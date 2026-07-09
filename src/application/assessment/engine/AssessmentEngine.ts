// src/application/assessment/engine/AssessmentEngine.ts
import { AssessmentSession } from './AssessmentSession';
import { TimerService } from './TimerService';
import { ScoringService } from './ScoringService';
import { ResultService } from './ResultService';
import { ReviewService } from './ReviewService';
import { AssessmentConfig } from '../domain/models/AssessmentConfig';
import { EventEmitter } from 'events';

/**
 * Core engine that coordinates an assessment lifecycle.
 * Uses existing UQRE for rendering and LPE for question selection where applicable.
 */
export class AssessmentEngine extends EventEmitter {
  private session?: AssessmentSession;
  private timerService: TimerService;
  private scoringService: ScoringService;
  private resultService: ResultService;
  private reviewService: ReviewService;

  constructor() {
    super();
    this.timerService = new TimerService(this);
    this.scoringService = new ScoringService();
    this.resultService = new ResultService(this.scoringService);
    this.reviewService = new ReviewService();
  }

  /**
   * Starts a new assessment session.
   */
  async startAssessment(config: AssessmentConfig, studentId: string): Promise<AssessmentSession> {
    this.session = new AssessmentSession(config, studentId);
    // Emit start event
    this.emit('AssessmentStarted', { sessionId: this.session.id, studentId });
    // Start global timer if configured
    if (config.timeLimitSeconds) {
      this.timerService.startGlobalTimer(config.timeLimitSeconds);
    }
    // Load first question set via LPE or other provider (stubbed for now)
    await this.session.initialize();
    return this.session;
  }

  /** Returns the current question for the active session */
  getCurrentQuestion() {
    if (!this.session) throw new Error('No active session');
    return this.session.currentQuestion();
  }

  /** Submit an answer for the current question */
  async submitAnswer(answer: any) {
    if (!this.session) throw new Error('No active session');
    this.session.recordAnswer(answer);
    this.emit('QuestionAnswered', { sessionId: this.session.id, questionId: this.session.currentQuestionId });
    // Move to next question or finish
    if (this.session.hasNext()) {
      this.session.moveNext();
    } else {
      await this.finishAssessment();
    }
  }

  /** Finish assessment, calculate results and emit events */
  async finishAssessment() {
    if (!this.session) return;
    const result = this.resultService.calculateResult(this.session);
    await this.session.persistResult(result);
    this.emit('AssessmentCompleted', { sessionId: this.session.id, result });
    // Stop timer
    this.timerService.stopAll();
    return result;
  }
}
