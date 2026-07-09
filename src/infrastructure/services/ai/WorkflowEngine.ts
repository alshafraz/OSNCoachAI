import { AgentRegistry } from './AgentRegistry';
import { PromptRegistry } from './PromptRegistry';
import { renderPrompt } from '@/domain/services/ai/Prompt';
import { OpenAiLlmProvider, trackTokensCost, getDailyTokensCost } from './LlmProviderRegistry';
import { AiValidator } from './AiValidator';
import { AgentExecutionResult } from '@/domain/services/ai/Agent';
import { GovernanceOrchestrator } from '@/application/ai-governance/engine/GovernanceOrchestrator';

export class WorkflowEngine {
  private static provider = new OpenAiLlmProvider();
  private static orchestrator = new GovernanceOrchestrator();

  static async runAgent(
    agentName: string,
    variables: Record<string, string>
  ): Promise<AgentExecutionResult> {
    const config = AgentRegistry.getAgent(agentName);
    return this.orchestrator.execute({ agentName, variables }, config);
  }

  static async importWorksheetWorkflow(rawPdfText: string) {
    const extractRes = await this.runAgent('QuestionExtractionAgent', { rawText: rawPdfText });
    if (!extractRes.success || !extractRes.data || !extractRes.data.questions) {
      return { success: false, error: 'Extraction failed: ' + extractRes.reasoning };
    }

    const rawQuestions = extractRes.data.questions;
    const processedQuestions = [];

    for (const q of rawQuestions) {
      const qBody = q.body || '';

      const [diffRes, topicRes] = await Promise.all([
        this.runAgent('DifficultyAnalyzer', { questionBody: qBody }),
        this.runAgent('TopicClassifier', { questionBody: qBody }),
      ]);

      processedQuestions.push({
        ...q,
        difficulty: diffRes.success && diffRes.data && diffRes.data.difficulty ? diffRes.data.difficulty : 'MEDIUM',
        topic: topicRes.success && topicRes.data && topicRes.data.topic ? topicRes.data.topic : 'Algebra',
        confidence: Math.min(
          extractRes.confidenceScore,
          diffRes.confidenceScore,
          topicRes.confidenceScore
        ),
      });
    }

    return {
      success: true,
      questions: processedQuestions,
      observability: {
        totalCost: getDailyTokensCost(),
      },
    };
  }
}
