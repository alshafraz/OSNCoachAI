// src/application/ai-governance/engine/GovernanceOrchestrator.ts
import { AgentExecutionResult, AgentConfig } from '@/domain/services/ai/Agent';
import { PromptRegistry } from '../services/PromptRegistry';
import { PromptVersionService } from '../services/PromptVersionService';
import { ModelRouter } from '../services/ModelRouter';
import { ProviderGateway } from '../services/ProviderGateway';
import { ValidationService } from '../services/ValidationService';
import { SafetyGuardrailService } from '../services/SafetyGuardrailService';
import { EvaluationService } from '../services/EvaluationService';
import { CostService } from '../services/CostService';
import { AuditService } from '../services/AuditService';
import { FeatureFlagService } from '../services/FeatureFlagService';
import { AIOpsTaskType } from '../config/governanceConfig';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

export interface GovernanceInput {
  agentName: string;
  variables: Record<string, string>;
  studentId?: string;
  engine?: AIOpsTaskType;
}

/**
 * GovernanceOrchestrator coordinates the 13-stage execution pipeline.
 * All LLM communications in the application flow through here.
 */
export class GovernanceOrchestrator {
  private readonly logger = new Logger('GovernanceOrchestrator');

  private readonly promptRegistry = new PromptRegistry();
  private readonly promptVersionService = new PromptVersionService();
  private readonly router = new ModelRouter();
  private readonly gateway = new ProviderGateway();
  private readonly validationService = new ValidationService();
  private readonly safetyService = new SafetyGuardrailService();
  private readonly evaluationService = new EvaluationService();
  private readonly costService = new CostService();
  private readonly auditService = new AuditService();
  private readonly featureFlagService = new FeatureFlagService();

  /**
   * Run the 13-stage governance prompt pipeline.
   */
  async execute(input: GovernanceInput, agentConfig: AgentConfig): Promise<AgentExecutionResult> {
    const start = Date.now();
    const requestId = uuidv4();
    const engine = input.engine || this.inferEngine(input.agentName);
    const studentId = input.studentId;

    this.logger.info('AIOps execution pipeline started', { requestId, agentName: input.agentName, engine });

    // ── STAGE 1: Safety Validation on Inputs ────────────────────────────────────
    const inputSafety = this.safetyService.validateInput(input.variables);
    if (!inputSafety.isSafe) {
      const errorMsg = inputSafety.reason || 'Input safety validation failed.';
      await this.auditService.log({
        requestId,
        studentId,
        engine,
        promptId: agentConfig.promptId,
        promptVersion: agentConfig.promptVersion,
        success: false,
        isSafe: false,
        errorDetails: { code: 'SAFETY_INPUT_REJECTED', message: errorMsg },
      });
      return this.buildErrorResponse('SAFETY_INPUT_REJECTED', errorMsg, agentConfig.preferredModel);
    }

    // ── STAGE 2: Feature Flags & Prompt Versioning ──────────────────────────────
    let promptVersion = agentConfig.promptVersion;
    const flagKey = `flag-${agentConfig.promptId}`;
    const flagEval = await this.featureFlagService.evaluateFlag(flagKey, studentId);
    if (flagEval.isActive && flagEval.targetValue) {
      promptVersion = flagEval.targetValue;
      this.logger.info('Prompt version overridden by feature flag canary/rollout rules', { flagKey, overrideVersion: promptVersion });
    }

    const versionDetails = await this.promptRegistry.getPromptVersion(agentConfig.promptId, promptVersion);
    if (!versionDetails) {
      const errorMsg = `Prompt configuration version "${promptVersion}" does not exist in registry.`;
      return this.buildErrorResponse('PROMPT_NOT_FOUND', errorMsg, agentConfig.preferredModel);
    }

    // ── STAGE 3: Context & Prompt Builder ───────────────────────────────────────
    const renderedUser = this.promptRegistry.render(versionDetails.userTemplate, input.variables);
    const systemPrompt = versionDetails.systemTemplate;

    // ── STAGE 4: Provider Routing & Gateway ─────────────────────────────────────
    let attempts = 0;
    const maxAttempts = agentConfig.retryStrategy.maxAttempts;
    let delay = agentConfig.retryStrategy.initialDelayMs;
    let lastError: any = null;

    while (attempts < maxAttempts) {
      attempts++;
      const callStart = Date.now();
      let providerDetails;

      try {
        // Model Routing
        providerDetails = await this.router.route(agentConfig.preferredModel, engine);

        // STAGE 5: LLM Execution
        const llmResponse = await this.gateway.execute(providerDetails, {
          prompt: renderedUser,
          systemPrompt,
          temperature: agentConfig.temperature ?? versionDetails.temperature,
          maxTokens: agentConfig.maxTokens ?? versionDetails.maxTokens,
          responseFormat: versionDetails.expectedOutputSchema ? 'json' : 'text',
          jsonSchema: versionDetails.expectedOutputSchema,
        });

        const latencyMs = Date.now() - callStart;

        // Reset provider circuit breaker success status
        await this.router.recordSuccess(providerDetails.id);

        // STAGE 6: Output Validation (JSON check / format checks)
        const validation = this.validationService.validate(llmResponse.content, versionDetails.expectedOutputSchema);
        if (!validation.isValid) {
          this.logger.warn('Output validation failed', { reason: validation.reason });
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= agentConfig.retryStrategy.backoffMultiplier;
            continue;
          }

          // Max attempts reached with validation error
          const costUsd = await this.costService.trackCost(
            requestId,
            engine,
            studentId,
            providerDetails.id,
            llmResponse.tokensUsed.prompt,
            llmResponse.tokensUsed.completion
          );

          await this.auditService.log({
            requestId,
            studentId,
            engine,
            promptId: agentConfig.promptId,
            promptVersion,
            providerId: providerDetails.id,
            modelName: providerDetails.modelName,
            inputTokens: llmResponse.tokensUsed.prompt,
            outputTokens: llmResponse.tokensUsed.completion,
            costUsd,
            latencyMs: Date.now() - start,
            retryCount: attempts - 1,
            success: false,
            isValid: false,
            isSafe: true,
            errorDetails: { code: 'VALIDATION_FAILED', message: validation.reason || 'Validation failed.' },
          });

          return {
            success: false,
            confidenceScore: validation.confidenceScore,
            reasoning: `Validation failed: ${validation.reason}`,
            provider: llmResponse.provider,
            model: llmResponse.model,
            tokensUsed: llmResponse.tokensUsed,
            latencyMs: Date.now() - start,
            retryCount: attempts - 1,
            error: { code: 'VALIDATION_FAILED', message: validation.reason || 'Schema validation mismatch.' },
          };
        }

        // STAGE 7: Output Safety Guardrails (leakage checks)
        const safetyCheck = this.safetyService.validateOutput(llmResponse.content);
        if (!safetyCheck.isSafe) {
          const safetyReason = safetyCheck.reason || 'Output safety scan triggered alert.';
          this.logger.error('Safety guardrail rejected output', { reason: safetyReason });

          await this.auditService.log({
            requestId,
            studentId,
            engine,
            promptId: agentConfig.promptId,
            promptVersion,
            providerId: providerDetails.id,
            modelName: providerDetails.modelName,
            success: false,
            isValid: true,
            isSafe: false,
            errorDetails: { code: 'SAFETY_OUTPUT_BLOCKED', message: safetyReason },
          });

          return this.buildErrorResponse('SAFETY_OUTPUT_BLOCKED', safetyReason, providerDetails.modelName);
        }

        // STAGE 8: Quality Evaluation
        const evalResult = this.evaluationService.evaluate(agentConfig.promptId, promptVersion, llmResponse.content);

        // STAGE 9: Cost Tracking
        const costUsd = await this.costService.trackCost(
          requestId,
          engine,
          studentId,
          providerDetails.id,
          llmResponse.tokensUsed.prompt,
          llmResponse.tokensUsed.completion
        );

        // STAGE 10: Audit Log
        await this.auditService.log({
          requestId,
          studentId,
          engine,
          promptId: agentConfig.promptId,
          promptVersion,
          providerId: providerDetails.id,
          modelName: providerDetails.modelName,
          inputTokens: llmResponse.tokensUsed.prompt,
          outputTokens: llmResponse.tokensUsed.completion,
          costUsd,
          latencyMs,
          retryCount: attempts - 1,
          success: true,
          isValid: true,
          isSafe: true,
          qualityScore: evalResult.overallScore,
        });

        // STAGE 11: Return Response
        return {
          success: true,
          data: validation.data,
          confidenceScore: validation.confidenceScore,
          reasoning: validation.reason || 'Succeeded',
          provider: llmResponse.provider,
          model: llmResponse.model,
          tokensUsed: llmResponse.tokensUsed,
          latencyMs,
          retryCount: attempts - 1,
        };
      } catch (err: any) {
        lastError = err;
        this.logger.error('LLM execution attempt failed', { attempt: attempts, error: err.message });
        if (providerDetails) {
          await this.router.recordFailure(providerDetails.id);
        }

        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= agentConfig.retryStrategy.backoffMultiplier;
        }
      }
    }

    // STAGE 12: Graceful Failure Handling
    const errorMsg = lastError?.message || 'Max retries exceeded.';
    await this.auditService.log({
      requestId,
      studentId,
      engine,
      promptId: agentConfig.promptId,
      promptVersion,
      success: false,
      errorDetails: { code: 'EXECUTION_FAILED', message: errorMsg },
    });

    return this.buildErrorResponse('EXECUTION_FAILED', errorMsg, agentConfig.preferredModel);
  }

  private inferEngine(agentName: string): AIOpsTaskType {
    if (agentName.includes('Import') || agentName.includes('Extraction')) return 'OCR';
    if (agentName.includes('Validation')) return 'VALIDATION';
    if (agentName.includes('Classifier') || agentName.includes('Topic')) return 'CLASSIFICATION';
    if (agentName.includes('Tutor')) return 'TUTOR';
    if (agentName.includes('Coach')) return 'COACH';
    if (agentName.includes('Generator') && agentName.includes('Question')) return 'CONTENT_GEN';
    if (agentName.includes('Advisor') || agentName.includes('Difficulty')) return 'ADAPTIVE';
    return 'PEER_REVIEW';
  }

  private buildErrorResponse(code: string, message: string, model: string): AgentExecutionResult {
    return {
      success: false,
      confidenceScore: 0,
      reasoning: message,
      provider: 'AIOps',
      model,
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      latencyMs: 0,
      retryCount: 0,
      error: { code, message },
    };
  }
}
export const defaultGovernanceOrchestrator = new GovernanceOrchestrator();
