export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  owner: string;
  purpose: string;
  variables: string[];
  systemTemplate: string;
  userTemplate: string;
  temperature: number;
  maxTokens: number;
  expectedOutputSchema?: Record<string, any>;
  safetyRules?: string[];
  examples?: { input: Record<string, string>; output: string }[];
}

export function renderPrompt(template: string, variables: Record<string, string>): string {
  let rendered = template;
  for (const [key, val] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
  }
  return rendered;
}
