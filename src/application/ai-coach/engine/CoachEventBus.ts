import { EventEmitter } from 'events';

/**
 * Strongly‑typed event bus for the AI Coach Engine.
 * Each event name is associated with a payload type.
 */
export interface CoachEvents {
  /** Emitted after evidence collection finishes */
  evidenceCollected: { sessionId: string; count: number };
  /** Emitted after metrics are computed */
  metricsComputed: { sessionId: string; metricsCount: number };
  /** Emitted after a recommendation is generated */
  recommendationGenerated: { sessionId: string; recommendationId: string };
  /** Emitted when a recommendation is delivered to the client */
  recommendationDelivered: { sessionId: string; recommendationId: string };
  /** Emitted when a learning plan is created */
  planCreated: { sessionId: string; planId: string };
  /** Emitted when a risk is detected */
  riskDetected: { sessionId: string; riskType: string };
}

export class CoachEventBus extends EventEmitter {
  // Helper typings for emit and on
  emit<K extends keyof CoachEvents>(event: K, payload: CoachEvents[K]): boolean {
    return super.emit(event, payload);
  }
  on<K extends keyof CoachEvents>(event: K, listener: (payload: CoachEvents[K]) => void): this {
    super.on(event, listener as any);
    return this;
  }
}
