import { PromptTemplate } from '@/domain/services/ai/Prompt';

const promptsDB: Record<string, Record<string, PromptTemplate>> = {
  'ocr-extract': {
    'v1': {
      id: 'ocr-extract',
      name: 'OCR Question Extraction Prompt',
      description: 'Extract questions and properties from worksheet text formats',
      version: 'v1',
      owner: 'Principal AI Architect',
      purpose: 'Extract clean math problems from raw layout segments',
      variables: ['rawText'],
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
    },
  },
  'difficulty-analyze': {
    'v1': {
      id: 'difficulty-analyze',
      name: 'Olympiad Difficulty Rating Agent',
      description: 'Classifies questions into Easy, Medium, or Hard difficulty tags',
      version: 'v1',
      owner: 'Educational Psychologist',
      purpose: 'Tag questions for student dashboard routes',
      variables: ['questionBody'],
      systemTemplate: 'You are an OSN Mathematics coach. Evaluate complexity level.',
      userTemplate: 'Evaluate the difficulty of this problem: {{questionBody}}\n\nRespond with EASY, MEDIUM, or HARD.',
      temperature: 0.2,
      maxTokens: 200,
    },
  },
  'topic-classify': {
    'v1': {
      id: 'topic-classify',
      name: 'Syllabus Topic Classification Agent',
      description: 'Classifies questions into Number System, Algebra, Geometry, Combinatorics, or Logic',
      version: 'v1',
      owner: 'LX Designer',
      purpose: 'Classify questions to target syllabus paths',
      variables: ['questionBody'],
      systemTemplate: 'You are a Mathematics Olympiad Syllabus specialist.',
      userTemplate: 'Classify this problem into syllabus topic: {{questionBody}}',
      temperature: 0.2,
      maxTokens: 200,
    },
  },
  'hint-generate': {
    'v1': {
      id: 'hint-generate',
      name: 'Socratic Tutor Hint Builder',
      description: 'Builds Socratic hints guiding children without giving absolute answers',
      version: 'v1',
      owner: 'LX Designer',
      purpose: 'Encourage discovery upon mistake detections',
      variables: ['questionBody', 'studentAnswer'],
      systemTemplate: 'You are a Socratic AI Coach helping an 11-year-old solve math puzzles.',
      userTemplate: 'Question: {{questionBody}}\nStudent Answer Attempt: {{studentAnswer}}\n\nProvide one friendly step-by-step hint.',
      temperature: 0.5,
      maxTokens: 500,
    },
  },
};

export class PromptRegistry {
  static getPrompt(id: string, version = 'v1'): PromptTemplate {
    const versions = promptsDB[id];
    if (!versions) {
      throw new Error(`Prompt template with ID "${id}" not found in registry.`);
    }
    const template = versions[version];
    if (!template) {
      return versions['v1'];
    }
    return template;
  }
}
