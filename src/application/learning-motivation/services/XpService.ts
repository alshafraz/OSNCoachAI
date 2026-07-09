// src/application/learning-motivation/services/XpService.ts
import { motivationEventBus, MotivationEvent, MotivationEventPayloads } from '../engine/EventBus';
import { xpRules } from '../config/xpRules';
import { XpLedgerRepository } from '../../../infrastructure/persistence/repositories/XpLedgerRepository';

/**
 * Service responsible for calculating and persisting XP based on motivation events.
 * It subscribes to the global MotivationEventBus and updates the XpLedger accordingly.
 */
export class XpService {
  private ledgerRepo: XpLedgerRepository;

  constructor() {
    this.ledgerRepo = new XpLedgerRepository();
    this.registerEventHandlers();
  }

  private registerEventHandlers() {
    const events: MotivationEvent[] = [
      'QuestionSolved',
      'PerfectScore',
      'PracticeCompleted',
      'AssessmentCompleted',
      'HintUsed',
      'DailyGoalCompleted',
      'WeakTopicImproved',
      'ConsecutiveStudyDay',
      'AITutorSessionCompleted',
      'ReviewSessionCompleted',
    ];
    events.forEach((event) => {
      // @ts-ignore - generic typing handled via overloads
      motivationEventBus.on(event as any, (payload) => this.handleEvent(event, payload as any));
    });
  }

  private async handleEvent<E extends MotivationEvent>(event: E, payload: MotivationEventPayloads[E]) {
    let xp = 0;
    switch (event) {
      case 'QuestionSolved':
        xp = (payload as MotivationEventPayloads['QuestionSolved']).xp || xpRules.QuestionSolved;
        break;
      case 'PerfectScore':
        xp = xpRules.PerfectScore;
        break;
      case 'PracticeCompleted':
        xp = xpRules.PracticeCompleted;
        break;
      case 'AssessmentCompleted':
        xp = xpRules.AssessmentCompleted;
        break;
      case 'HintUsed':
        xp = (payload as MotivationEventPayloads['HintUsed']).xpPenalty || xpRules.HintUsedPenalty;
        break;
      case 'DailyGoalCompleted':
        xp = xpRules.DailyGoalCompleted;
        break;
      case 'WeakTopicImproved':
        xp = xpRules.WeakTopicImproved;
        break;
      case 'ConsecutiveStudyDay':
        const days = (payload as MotivationEventPayloads['ConsecutiveStudyDay']).streakDays;
        xp = typeof xpRules.ConsecutiveStudyDay === 'function'
          ? xpRules.ConsecutiveStudyDay(days)
          : xpRules.ConsecutiveStudyDay;
        break;
      case 'AITutorSessionCompleted':
        xp = xpRules.AITutorSessionCompleted;
        break;
      case 'ReviewSessionCompleted':
        xp = xpRules.ReviewSessionCompleted;
        break;
      default:
        xp = 0;
    }
    if (xp !== 0) {
      await this.ledgerRepo.addXp((payload as any).studentId, xp, event);
      // Emit a generic XPGenerated event for other services (e.g., LevelService)
      motivationEventBus.emit('XPGenerated', { studentId: (payload as any).studentId, amount: xp, reason: event });
    }
  }
}
