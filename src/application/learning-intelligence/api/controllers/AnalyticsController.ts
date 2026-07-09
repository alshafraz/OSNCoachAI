import { Router, Request, Response } from 'express';
import { LearningAnalyticsService } from '../../services/LearningAnalyticsService';
import { MetricEngine } from '../../services/MetricEngine';
import { TopicAnalyticsService } from '../../services/TopicAnalyticsService';
import { InsightRepository } from '../../infrastructure/persistence/repositories/InsightRepository';

import { MetricSnapshotRepository } from '../../infrastructure/persistence/repositories/MetricSnapshotRepository';

const router = Router();
const learningAnalyticsService = new LearningAnalyticsService();
const metricEngine = new MetricEngine();
const topicAnalyticsService = new TopicAnalyticsService();
const insightRepo = new InsightRepository();
const snapshotRepo = new MetricSnapshotRepository();

// POST /events - ingest a learning event
router.post('/events', async (req: Request, res: Response) => {
  try {
    const event = req.body; // assumed validated
    await learningAnalyticsService.processEvent(event);
    res.status(202).json({ message: 'Event accepted' });
  } catch (err) {
    console.error('Error ingesting event', err);
    res.status(500).json({ error: 'Failed to process event' });
  }
});

// GET /metrics/:studentId - retrieve metric snapshots for a student
router.get('/metrics/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const snapshots = await snapshotRepo.findLatest(studentId as string);
    res.json(snapshots);
  } catch (err) {
    console.error('Error fetching metrics', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /topic/:topicId - retrieve topic analytics
router.get('/topic/:topicId', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const analytics = await topicAnalyticsService.getTopicAnalytics(topicId as string);
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching topic analytics', err);
    res.status(500).json({ error: 'Failed to fetch topic analytics' });
  }
});

// GET /insights/:studentId - retrieve insights for a student
router.get('/insights/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const insights = await insightRepo.find({ where: { studentId: studentId as string }, order: { createdAt: 'DESC' } });
    res.json(insights);
  } catch (err) {
    console.error('Error fetching student insights', err);
    res.status(500).json({ error: 'Failed to fetch student insights' });
  }
});

export default router;

