// src/application/adaptive-learning/services/DifficultyEngine.ts
import { paleConfig, PaleDifficulty, AdaptationAction } from '../config/paleConfig';
import { DifficultyState } from '../domain/models/DifficultyState';
import { AdaptationDecision, EvidenceSignal } from '../domain/models/AdaptationDecision';
import { DifficultyStateRepository } from '../infrastructure/persistence/repositories/DifficultyStateRepository';
import { AdaptationDecisionRepository } from '../infrastructure/persistence/repositories/AdaptationDecisionRepository';
import { Logger } from '@/infra/logger';
import { v4 as uuidv4 } from 'uuid';

const DIFFICULTY_ORDER: PaleDifficulty[] = ['EASY', 'MEDIUM', 'HARD', 'OLYMPIAD'];

/**
 * DifficultyEngine continuously evaluates evidence signals and adjusts
 * difficulty levels for each student × topic pair.
 *
 * PALE Engineering Rule: The engine never uses an LLM to make decisions.
 * All adjustments are rule-based, evidence-driven, and fully logged.
 */
export class DifficultyEngine {
  private readonly logger = new Logger('DifficultyEngine');
  private readonly stateRepo = new DifficultyStateRepository();
  private readonly decisionRepo = new AdaptationDecisionRepository();

  /**
   * Evaluate the current difficulty for a student+topic and potentially adjust.
   * Returns the (possibly new) AdaptationDecision if an adjustment was made, or null.
   */
  async adjustDifficulty(
    studentId: string,
    topicId: string,
    evidence: {
      recentAccuracy: number;
      hintUsageRate: number;
      solveTimeRatio: number;
      questionsAttempted: number;
    }
  ): Promise<AdaptationDecision | null> {
    const cfg = paleConfig.difficulty;

    if (evidence.questionsAttempted < cfg.minQuestionsBeforeAdjust) {
      this.logger.info('Not enough evidence yet', { studentId, topicId, questionsAttempted: evidence.questionsAttempted });
      return null;
    }

    let state = await this.stateRepo.findByStudentAndTopic(studentId, topicId);
    if (!state) {
      state = this.buildDefaultState(studentId, topicId);
    }

    // Update state metrics
    state.recentAccuracy = evidence.recentAccuracy;
    state.recentHintUsageRate = evidence.hintUsageRate;
    state.recentSolveTimeRatio = evidence.solveTimeRatio;

    const currentIdx = DIFFICULTY_ORDER.indexOf(state.currentDifficulty as PaleDifficulty);
    let newIdx = currentIdx;
    let action: AdaptationAction | null = null;
    const signals: EvidenceSignal[] = [];

    // ─── INCREASE CONDITIONS ────────────────────────────────────────────────────
    const shouldIncrease =
      evidence.recentAccuracy >= cfg.increaseThreshold &&
      evidence.solveTimeRatio <= cfg.fastSolveRatio &&
      evidence.hintUsageRate <= cfg.maxHintUsageRate &&
      state.consecutiveIncreases < cfg.maxConsecutiveIncreases &&
      currentIdx < DIFFICULTY_ORDER.length - 1;

    // ─── DECREASE CONDITIONS ────────────────────────────────────────────────────
    const shouldDecrease =
      (evidence.recentAccuracy <= cfg.decreaseThreshold ||
        evidence.hintUsageRate >= cfg.maxHintUsageRate ||
        evidence.solveTimeRatio >= cfg.slowSolveRatio) &&
      currentIdx > 0;

    if (shouldIncrease) {
      newIdx = currentIdx + 1;
      action = 'INCREASE_DIFFICULTY';
      signals.push(
        { metric: 'accuracy', value: evidence.recentAccuracy, threshold: cfg.increaseThreshold, direction: 'ABOVE' },
        { metric: 'solveTimeRatio', value: evidence.solveTimeRatio, threshold: cfg.fastSolveRatio, direction: 'BELOW' },
        { metric: 'hintUsageRate', value: evidence.hintUsageRate, threshold: cfg.maxHintUsageRate, direction: 'BELOW' }
      );
      state.consecutiveIncreases++;
      state.consecutiveDecreases = 0;
    } else if (shouldDecrease) {
      newIdx = currentIdx - 1;
      action = 'DECREASE_DIFFICULTY';
      signals.push(
        { metric: 'accuracy', value: evidence.recentAccuracy, threshold: cfg.decreaseThreshold, direction: 'BELOW' },
        { metric: 'hintUsageRate', value: evidence.hintUsageRate, threshold: cfg.maxHintUsageRate, direction: 'ABOVE' },
        { metric: 'solveTimeRatio', value: evidence.solveTimeRatio, threshold: cfg.slowSolveRatio, direction: 'ABOVE' }
      );
      state.consecutiveDecreases++;
      state.consecutiveIncreases = 0;
    } else {
      // No adjustment needed – persist latest state and return
      state.lastUpdated = new Date();
      await this.stateRepo.save(state as any);
      return null;
    }

    const previousDifficulty = state.currentDifficulty as PaleDifficulty;
    const newDifficulty = DIFFICULTY_ORDER[newIdx];
    state.currentDifficulty = newDifficulty;
    state.totalAdjustments++;
    state.lastUpdated = new Date();
    await this.stateRepo.save(state as any);

    // Build explainable decision
    const isIncrease = action === 'INCREASE_DIFFICULTY';
    const decision: AdaptationDecision = {
      id: uuidv4(),
      studentId,
      topicId,
      action,
      decisionSummary: `${isIncrease ? 'Increase' : 'Decrease'} difficulty for topic "${topicId}" from ${previousDifficulty} to ${newDifficulty}.`,
      evidenceUsed: signals,
      reasoning: isIncrease
        ? `Recent accuracy (${(evidence.recentAccuracy * 100).toFixed(0)}%) exceeds the increase threshold (${(cfg.increaseThreshold * 100).toFixed(0)}%), solve time is fast, and hint usage is low. The student is ready for harder challenges.`
        : `Performance signals indicate the student is struggling: accuracy ${(evidence.recentAccuracy * 100).toFixed(0)}%, hint usage rate ${(evidence.hintUsageRate * 100).toFixed(0)}%, or slow solve time ratio ${evidence.solveTimeRatio.toFixed(2)}. Reducing difficulty to rebuild confidence.`,
      expectedBenefit: isIncrease
        ? 'Accelerate mastery progression and olympiad readiness.'
        : 'Restore confidence, reduce error rate, and rebuild foundational understanding.',
      estimatedImprovement: isIncrease ? 12 : 15,
      confidence: Math.min(0.95, 0.6 + evidence.questionsAttempted / 50),
      modelVersion: '1.0.0',
      createdAt: new Date(),
    };

    await this.decisionRepo.save(decision as any);
    this.logger.info('Difficulty adjusted', { studentId, topicId, from: previousDifficulty, to: newDifficulty, action });
    return decision;
  }

  /** Get current difficulty for a student+topic. Returns 'MEDIUM' if unknown. */
  async getCurrentDifficulty(studentId: string, topicId: string): Promise<PaleDifficulty> {
    const state = await this.stateRepo.findByStudentAndTopic(studentId, topicId);
    return (state?.currentDifficulty as PaleDifficulty) ?? 'MEDIUM';
  }

  private buildDefaultState(studentId: string, topicId: string): DifficultyState {
    return {
      id: uuidv4(),
      studentId,
      topicId,
      currentDifficulty: 'MEDIUM',
      consecutiveIncreases: 0,
      consecutiveDecreases: 0,
      totalAdjustments: 0,
      recentAccuracy: 0.5,
      recentHintUsageRate: 0.2,
      recentSolveTimeRatio: 1.0,
      lastUpdated: new Date(),
    };
  }
}
