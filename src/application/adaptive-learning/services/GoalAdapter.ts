// src/application/adaptive-learning/services/GoalAdapter.ts
import { paleConfig } from '../config/paleConfig';
import { AdaptationDecision } from '../domain/models/AdaptationDecision';
import { AdaptationDecisionRepository } from '../infrastructure/persistence/repositories/AdaptationDecisionRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

export interface StudentGoal {
  goalId: string;
  type: 'DAILY_QUESTIONS' | 'WEEKLY_TOPICS' | 'MONTHLY_MASTERY' | 'COMPETITION_READINESS';
  targetValue: number;
  currentValue: number;
  dueDate?: Date;
}

export interface GoalAdaptationResult {
  goalId: string;
  action: 'REBALANCE' | 'EXTEND_DEADLINE' | 'ADD_ENRICHMENT' | 'NO_CHANGE';
  reason: string;
  adjustedTarget?: number;
  adjustedDueDate?: Date;
}

/**
 * GoalAdapter monitors goal progress and rebalances dynamically.
 * Competition dates are NEVER modified — only daily/weekly/monthly targets.
 */
export class GoalAdapter {
  private readonly logger = new Logger('GoalAdapter');
  private readonly decisionRepo = new AdaptationDecisionRepository();
  private readonly cfg = paleConfig.goals;

  async adaptGoals(
    studentId: string,
    goals: StudentGoal[]
  ): Promise<GoalAdaptationResult[]> {
    const results: GoalAdaptationResult[] = [];

    for (const goal of goals) {
      const progress = goal.currentValue / Math.max(1, goal.targetValue);
      const daysRemaining = goal.dueDate
        ? (goal.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        : null;

      // Never touch competition readiness deadlines
      if (goal.type === 'COMPETITION_READINESS') {
        results.push({ goalId: goal.goalId, action: 'NO_CHANGE', reason: 'Competition deadlines are fixed.' });
        continue;
      }

      // Behind schedule: rebalance
      if (progress < (1 - this.cfg.behindScheduleThreshold) && daysRemaining && daysRemaining > 0) {
        const decision = await this.createDecision(studentId, goal, 'REBALANCE');
        results.push({
          goalId: goal.goalId,
          action: 'REBALANCE',
          reason: `Student is ${((1 - progress) * 100).toFixed(0)}% behind schedule. Redistributing remaining work over available days.`,
          adjustedTarget: Math.ceil(goal.currentValue + (goal.targetValue - goal.currentValue) * 0.8),
        });
        this.logger.info('Goal rebalanced', { studentId, goalId: goal.goalId });
      }
      // Ahead of schedule: offer enrichment
      else if (progress > (1 + this.cfg.aheadScheduleThreshold)) {
        results.push({
          goalId: goal.goalId,
          action: 'ADD_ENRICHMENT',
          reason: `Student is ahead of schedule (${(progress * 100).toFixed(0)}% complete). Adding enrichment targets.`,
          adjustedTarget: Math.ceil(goal.targetValue * 1.15),
        });
        this.logger.info('Goal enrichment added', { studentId, goalId: goal.goalId });
      } else {
        results.push({ goalId: goal.goalId, action: 'NO_CHANGE', reason: 'Goal is on track.' });
      }
    }

    return results;
  }

  private async createDecision(studentId: string, goal: StudentGoal, action: string): Promise<AdaptationDecision> {
    const decision: AdaptationDecision = {
      id: uuidv4(),
      studentId,
      topicId: 'GOAL',
      action: 'REBALANCE_GOAL',
      decisionSummary: `Goal ${goal.goalId} rebalanced due to pace.`,
      evidenceUsed: [{ metric: 'goalProgress', value: goal.currentValue / goal.targetValue, direction: 'BELOW', threshold: 1 - this.cfg.behindScheduleThreshold }],
      reasoning: `Goal progress is insufficient for the remaining time frame.`,
      expectedBenefit: 'Student remains on track despite slower-than-planned progress.',
      estimatedImprovement: 10,
      confidence: 0.7,
      modelVersion: '1.0.0',
      createdAt: new Date(),
    };
    await this.decisionRepo.save(decision as any);
    return decision;
  }
}
