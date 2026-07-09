// src/application/ai-governance/services/PromptRegistry.ts
import { Prompt, PromptVersion } from '../domain/models/Prompt';
import { PromptRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * PromptRegistry manages AI prompts, versions, category classifications, and owners.
 */
export class PromptRegistry {
  private readonly logger = new Logger('PromptRegistry');
  private readonly repo = new PromptRepository();

  private static seedingPromise: Promise<void> | null = null;

  constructor() {
    this.ensureSeeded();
  }

  private ensureSeeded(): Promise<void> {
    if (!PromptRegistry.seedingPromise) {
      PromptRegistry.seedingPromise = this.seedDefaults();
    }
    return PromptRegistry.seedingPromise;
  }

  /** Get a prompt by ID. */
  async getPrompt(id: string): Promise<Prompt | null> {
    await this.ensureSeeded();
    return this.repo.findById(id);
  }

  /** Get a specific semver version of a prompt. Falls back to active version. */
  async getPromptVersion(id: string, version?: string): Promise<PromptVersion | null> {
    await this.ensureSeeded();
    const prompt = await this.getPrompt(id);
    if (!prompt) return null;
    const targetVer = version || prompt.activeVersion;
    let versionEntity = await this.repo.findVersion(id, targetVer);
    if (!versionEntity) {
      versionEntity = await this.repo.findVersion(id, prompt.activeVersion);
    }
    return (versionEntity as unknown as PromptVersion) ?? null;
  }

  /** Register a new prompt with an initial version. */
  async registerPrompt(promptData: Partial<Prompt>, initialVersion: Partial<PromptVersion>): Promise<Prompt> {
    const prompt: Prompt = {
      id: promptData.id || uuidv4(),
      name: promptData.name || 'Unnamed Prompt',
      description: promptData.description || '',
      category: promptData.category || 'General',
      owner: promptData.owner || 'AI Team',
      variables: promptData.variables || [],
      activeVersion: initialVersion.semver || '1.0.0',
      versions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ver: PromptVersion = {
      versionId: uuidv4(),
      promptId: prompt.id,
      semver: initialVersion.semver || '1.0.0',
      author: initialVersion.author || 'System',
      description: initialVersion.description || 'Initial release',
      status: initialVersion.status || 'RELEASED',
      releaseNotes: initialVersion.releaseNotes || 'Initial check-in',
      systemTemplate: initialVersion.systemTemplate || 'You are a helpful AI assistant.',
      userTemplate: initialVersion.userTemplate || 'Hello.',
      temperature: initialVersion.temperature ?? 0.3,
      maxTokens: initialVersion.maxTokens ?? 2048,
      expectedOutputSchema: initialVersion.expectedOutputSchema,
      createdAt: new Date(),
    };

    await this.repo.savePrompt(prompt as any);
    await this.repo.saveVersion(ver as any);
    this.logger.info('Prompt registered', { id: prompt.id, activeVersion: prompt.activeVersion });
    return prompt;
  }

  /** Render template strings with variables. */
  render(template: string, variables: Record<string, string>): string {
    let rendered = template;
    for (const [key, val] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }
    return rendered;
  }

  private async seedDefaults(): Promise<void> {
    const existing = await this.repo.findById('ocr-extract');
    if (existing) return;

    // Seed ocr-extract
    await this.registerPrompt(
      {
        id: 'ocr-extract',
        name: 'OCR Question Extraction Prompt',
        description: 'Extract questions and properties from raw text',
        category: 'OCR',
        owner: 'Principal AI Architect',
        variables: ['rawText'],
      },
      {
        semver: '1.0.0',
        author: 'Principal AI Architect',
        description: 'Primary OCR extraction template',
        status: 'RELEASED',
        releaseNotes: 'First stable deployment',
        systemTemplate: 'You are a Mathematics Olympiad AI Extraction Agent. Extract math questions and solve explanations.',
        userTemplate: 'Worksheet Content:\n{{rawText}}\n\nExtract questions as structured JSON objects.',
        temperature: 0.1,
        maxTokens: 2048,
        expectedOutputSchema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  body: { type: 'string' },
                  type: { type: 'string', enum: ['MCQ', 'SHORT_ANSWER'] },
                  correctAnswer: { type: 'string' },
                  explanation: { type: 'string' },
                },
                required: ['body', 'type', 'correctAnswer'],
              },
            },
          },
          required: ['questions'],
        },
      }
    );

    // Seed difficulty-analyze
    await this.registerPrompt(
      {
        id: 'difficulty-analyze',
        name: 'Olympiad Difficulty Rating Agent',
        description: 'Classifies questions into Easy, Medium, or Hard difficulty tags',
        category: 'CLASSIFICATION',
        owner: 'Educational Psychologist',
        variables: ['questionBody'],
      },
      {
        semver: '1.0.0',
        author: 'Educational Psychologist',
        description: 'Baseline difficulty rating prompt',
        status: 'RELEASED',
        releaseNotes: 'Calibrated baseline logic metrics',
        systemTemplate: 'You are an OSN Mathematics coach. Evaluate complexity level.',
        userTemplate: 'Evaluate the difficulty of this problem: {{questionBody}}\n\nRespond with EASY, MEDIUM, or HARD.',
        temperature: 0.2,
        maxTokens: 200,
      }
    );

    // Seed topic-classify
    await this.registerPrompt(
      {
        id: 'topic-classify',
        name: 'Syllabus Topic Classification Agent',
        description: 'Classifies questions into math categories',
        category: 'CLASSIFICATION',
        owner: 'LX Designer',
        variables: ['questionBody'],
      },
      {
        semver: '1.0.0',
        author: 'LX Designer',
        description: 'Topic mapping prompt',
        status: 'RELEASED',
        releaseNotes: 'Baseline classifications',
        systemTemplate: 'You are a Mathematics Olympiad Syllabus specialist.',
        userTemplate: 'Classify this problem into syllabus topic: {{questionBody}}',
        temperature: 0.2,
        maxTokens: 200,
      }
    );

    // Seed hint-generate
    await this.registerPrompt(
      {
        id: 'hint-generate',
        name: 'Socratic Tutor Hint Builder',
        description: 'Builds Socratic hints guiding children without giving absolute answers',
        category: 'TUTOR',
        owner: 'LX Designer',
        variables: ['questionBody', 'studentAnswer'],
      },
      {
        semver: '1.0.0',
        author: 'LX Designer',
        description: 'Motivational Socratic hints prompt',
        status: 'RELEASED',
        releaseNotes: 'Friendly, step-by-step guidance checks',
        systemTemplate: 'You are a Socratic AI Coach helping an 11-year-old solve math puzzles.',
        userTemplate: 'Question: {{questionBody}}\nStudent Answer Attempt: {{studentAnswer}}\n\nProvide one friendly step-by-step hint.',
        temperature: 0.5,
        maxTokens: 500,
      }
    );
  }
}
export const defaultPromptRegistry = new PromptRegistry();
