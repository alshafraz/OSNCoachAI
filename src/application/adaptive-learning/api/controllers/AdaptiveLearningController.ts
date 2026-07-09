// src/application/adaptive-learning/api/controllers/AdaptiveLearningController.ts
import { Router, Request, Response } from 'express';
import { AdaptiveLearningService } from '../../services/AdaptiveLearningService';
import { Logger } from '@/infra/logger';

const router = Router();
const service = new AdaptiveLearningService();
const logger = new Logger('AdaptiveLearningController');

/**
 * GET /adaptive/:studentId/plan
 * Returns the current adaptive plan for a student.
 */
router.get('/:studentId/plan', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const plan = await service.getPlan(studentId);
    if (!plan) return res.status(404).json({ error: 'No adaptive plan found for this student.' });
    res.json({ plan });
  } catch (err: any) {
    logger.error('GET /plan failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /adaptive/:studentId/run
 * Trigger a full adaptation pipeline run.
 * Body: { topicId, evidence: { recentAccuracy, hintUsageRate, ... } }
 */
router.post('/:studentId/run', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { topicId, evidence, competitionDate, targetGrade, masteredTopicIds } = req.body;

    if (!topicId || !evidence) {
      return res.status(400).json({ error: 'topicId and evidence are required.' });
    }

    const plan = await service.runAdaptation({
      studentId,
      topicId,
      targetGrade,
      competitionDate: competitionDate ? new Date(competitionDate) : undefined,
      masteredTopicIds,
      evidence,
    });

    res.json({ plan, message: 'Adaptation pipeline run complete.' });
  } catch (err: any) {
    logger.error('POST /run failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /adaptive/:studentId/session
 * Returns today's planned learning session.
 * Query: topicId, recentAccuracy, hintUsageRate, solveTimeRatio, questionsAttempted
 */
router.get('/:studentId/session', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const topicId = (req.query.topicId as string) ?? 'numbers';

    const session = await service.getSession({
      studentId,
      topicId,
      evidence: {
        recentAccuracy: parseFloat((req.query.recentAccuracy as string) ?? '0.7'),
        hintUsageRate: parseFloat((req.query.hintUsageRate as string) ?? '0.2'),
        solveTimeRatio: parseFloat((req.query.solveTimeRatio as string) ?? '1.0'),
        questionsAttempted: parseInt((req.query.questionsAttempted as string) ?? '10'),
        consecutivePoorSessions: 0,
        consecutiveStrongSessions: 0,
        confidence: 0.7,
        avgSolveTimeRatio: 1.0,
      },
    });

    const dto = {
      id: session.id,
      studentId: session.studentId,
      scheduledDate: session.scheduledDate.toISOString(),
      estimatedDurationMinutes: session.estimatedDurationMinutes,
      paceRecommendation: session.paceRecommendation,
      phases: session.phases.map(p => ({
        type: p.type,
        label: p.label,
        durationMinutes: p.durationMinutes,
        itemCount: p.items.length,
      })),
    };

    res.json({ session: dto });
  } catch (err: any) {
    logger.error('GET /session failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /adaptive/:studentId/path
 * Returns the student's current learning path.
 */
router.get('/:studentId/path', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const competitionDate = req.query.competitionDate ? new Date(req.query.competitionDate as string) : undefined;
    const targetGrade = req.query.targetGrade ? parseInt(req.query.targetGrade as string) : undefined;

    const path = await service.getLearningPath(studentId, { competitionDate, targetGrade });
    res.json({ path });
  } catch (err: any) {
    logger.error('GET /path failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /adaptive/:studentId/decisions
 * Returns recent adaptation decisions with explainability data.
 */
router.get('/:studentId/decisions', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt((req.query.limit as string) ?? '20');
    const formatted = await service.getFormattedDecisions(studentId, limit);
    res.json({ decisions: formatted });
  } catch (err: any) {
    logger.error('GET /decisions failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /adaptive/:studentId/simulate
 * Runs a readiness simulation for 7/14/30 days.
 */
router.get('/:studentId/simulate', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await service.simulate(studentId, {
      overallMastery: parseFloat((req.query.mastery as string) ?? '0.6'),
      overallRetention: parseFloat((req.query.retention as string) ?? '0.75'),
      topicsMastered: parseInt((req.query.topicsMastered as string) ?? '3'),
      totalTopics: parseInt((req.query.totalTopics as string) ?? '13'),
      dailyLearningRate: parseFloat((req.query.dailyRate as string) ?? '0.015'),
      lastPracticeDate: new Date(),
      competitionDate: req.query.competitionDate ? new Date(req.query.competitionDate as string) : undefined,
      atRiskTopics: [],
      onTrackTopics: [],
    });
    res.json({ simulation: result });
  } catch (err: any) {
    logger.error('GET /simulate failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /adaptive/:studentId/reviews
 * Returns upcoming review schedule.
 */
router.get('/:studentId/reviews', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt((req.query.limit as string) ?? '10');
    const reviews = await service.getReviews(studentId, limit);
    res.json({ reviews });
  } catch (err: any) {
    logger.error('GET /reviews failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
