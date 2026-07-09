import { EventEmitter } from 'events';

export enum TutorEvent {
  SessionStarted = 'sessionStarted',
  QuestionAsked = 'questionAsked',
  HintRequested = 'hintRequested',
  HintProvided = 'hintProvided',
  ExplanationGenerated = 'explanationGenerated',
  MisconceptionDetected = 'misconceptionDetected',
  SessionEnded = 'sessionEnded',
}

export interface TutorEventPayloads {
  [TutorEvent.SessionStarted]: { sessionId: string; studentId: string };
  [TutorEvent.QuestionAsked]: { sessionId: string; questionId: string; rawQuestion: string };
  [TutorEvent.HintRequested]: { sessionId: string; level: number };
  [TutorEvent.HintProvided]: { sessionId: string; hint: string; level: number };
  [TutorEvent.ExplanationGenerated]: { sessionId: string; explanation: string };
  [TutorEvent.MisconceptionDetected]: { sessionId: string; issues: string[] };
  [TutorEvent.SessionEnded]: { sessionId: string; summary: string };
}

export class TutorEventBus extends EventEmitter {
  emit<E extends TutorEvent>(event: E, payload: TutorEventPayloads[E]): boolean {
    return super.emit(event, payload);
  }

  on<E extends TutorEvent>(event: E, listener: (payload: TutorEventPayloads[E]) => void): this {
    super.on(event, listener as any);
    return this;
  }
}

export const tutorEventBus = new TutorEventBus();
