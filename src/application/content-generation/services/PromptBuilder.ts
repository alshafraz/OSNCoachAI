// src/application/content-generation/services/PromptBuilder.ts
import { Injectable } from '@nestjs/common';
import { PromptRegistry } from '../../../infrastructure/services/ai/PromptRegistry';
import { renderPrompt } from '../../../domain/services/ai/Prompt';
import { GenerationRequest } from '../domain/models/GenerationRequest';
import { GenerationContext } from './ContextBuilder';

export interface RenderedPrompt {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  expectedOutputSchema?: Record<string, any>;
}

@Injectable()
export class PromptBuilder {
  /**
   * Build prompts based on the request configuration and aggregated context.
   */
  buildPrompt(request: GenerationRequest, context: GenerationContext): RenderedPrompt {
    // 1. Fetch template from registry based on request content type
    let templateId = 'question-generate';
    if (request.contentType.includes('EXPLANATION') || request.contentType.includes('WORKED_SOLUTION')) {
      templateId = 'explanation-generate';
    } else if (request.contentType.includes('HINT')) {
      templateId = 'hint-generate';
    } else if (request.contentType.includes('CONCEPT')) {
      templateId = 'concept-generate';
    } else if (request.contentType.includes('VARIATION')) {
      templateId = 'variation-generate';
    } else if (request.contentType.includes('PRACTICE')) {
      templateId = 'practice-set-generate';
    } else if (request.contentType.includes('MOCK_EXAM')) {
      templateId = 'mock-exam-generate';
    }

    let template;
    try {
      template = PromptRegistry.getPrompt(templateId);
    } catch {
      // Fallback template if specific one is not registered
      template = {
        id: templateId,
        name: 'Fallback Template',
        description: 'Generic fallback template',
        version: 'v1',
        owner: 'System',
        purpose: 'Generation fallback',
        variables: ['topic', 'difficulty', 'targetGrade', 'count', 'learningObjective', 'context'],
        systemTemplate: 'You are a Mathematics Olympiad Content Expert. Generate structured math content.',
        userTemplate: 'Topic: {{topic}}\nDifficulty: {{difficulty}}\nGrade: {{targetGrade}}\nObjective: {{learningObjective}}\nContext:\n{{context}}\n\nGenerate in clean JSON matching standard shapes.',
        temperature: 0.7,
        maxTokens: 2048,
      };
    }

    // 2. Prepare variables map
    const vars: Record<string, string> = {
      topic: request.topic ?? 'General Mathematics',
      subtopic: request.subtopic ?? 'General',
      difficulty: request.difficulty ?? 'MEDIUM',
      targetGrade: request.targetGrade?.toString() ?? '5',
      count: request.count?.toString() ?? '1',
      learningObjective: request.learningObjective ?? 'Practice and master concepts',
      context: JSON.stringify(context, null, 2),
      studentId: request.studentId ?? 'N/A',
      olympiadCategory: request.olympiadCategory ?? 'General',
      requiredSkills: (request.requiredSkills ?? []).join(', '),
      reasoningStrategy: request.reasoningStrategy ?? 'Logical reasoning',
    };

    // 3. Render prompts
    const systemPrompt = renderPrompt(template.systemTemplate, vars);
    const userPrompt = renderPrompt(template.userTemplate, vars);

    return {
      systemPrompt,
      userPrompt,
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      expectedOutputSchema: template.expectedOutputSchema,
    };
  }
}
