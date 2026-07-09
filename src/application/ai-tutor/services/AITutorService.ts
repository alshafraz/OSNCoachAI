// src/application/ai-tutor/services/AITutorService.ts
import { TutorEventBus, TutorEvent } from '../engine/TutorEventBus';
import { ExplanationService } from './ExplanationService';
import { HintOrchestrator } from './HintOrchestrator';
import { ConceptLookupService } from './ConceptLookupService';
import { MisconceptionService } from './MisconceptionService';

export class AITutorService {
  private readonly eventBus: TutorEventBus;

  constructor(
    private readonly explanationService: ExplanationService,
    private readonly hintOrchestrator: HintOrchestrator,
    private readonly conceptLookupService: ConceptLookupService,
    private readonly misconceptionService: MisconceptionService,
    eventBus?: TutorEventBus,
  ) {
    this.eventBus = eventBus ?? new TutorEventBus();
  }

  async handleStudentQuestion(sessionId: string, studentId: string, question: string) {
    // Emit question received event
    this.eventBus.emit(TutorEvent.QuestionAsked, {
      sessionId,
      questionId: '', // generated later
      rawQuestion: question,
    });

    // Generate explanation via ExplanationService (LLM call abstracted)
    const explanation = await this.explanationService.generateExplanation(sessionId, question);

    // Emit explanation generated event
    this.eventBus.emit(TutorEvent.ExplanationGenerated, { sessionId, explanation });

    return explanation;
  }

  async requestHint(sessionId: string, level: number) {
    const hint = await this.hintOrchestrator.provideHint(sessionId, level);
    this.eventBus.emit(TutorEvent.HintProvided, { sessionId, hint, level });
    return hint;
  }
}
