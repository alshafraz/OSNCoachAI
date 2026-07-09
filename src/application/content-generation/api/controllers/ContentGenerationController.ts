import { Router, Request, Response } from 'express';
import { ContentGenerationOrchestrator } from '../../engine/ContentGenerationOrchestrator';
import { ContentGenerationService } from '../../services/ContentGenerationService';
import { GeneratedContentRepository } from '../../infrastructure/persistence/repositories/GeneratedContentRepository';
import { ReviewRecordRepository } from '../../infrastructure/persistence/repositories/ReviewRecordRepository';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const orchestrator = new ContentGenerationOrchestrator();
const genService = new ContentGenerationService();
const contentRepo = new GeneratedContentRepository();
const reviewRepo = new ReviewRecordRepository();

// POST /generate - initiate generation pipeline
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const requestSpec = req.body;
    const request = {
      id: uuidv4(),
      requestedBy: requestSpec.requestedBy ?? 'admin',
      requestedAt: new Date(),
      contentType: requestSpec.contentType ?? 'SHORT_ANSWER',
      topic: requestSpec.topic,
      subtopic: requestSpec.subtopic,
      difficulty: requestSpec.difficulty,
      targetGrade: requestSpec.targetGrade,
      count: requestSpec.count ?? 1,
      learningObjective: requestSpec.learningObjective,
      olympiadCategory: requestSpec.olympiadCategory,
      requiredSkills: requestSpec.requiredSkills,
      reasoningStrategy: requestSpec.reasoningStrategy,
      studentId: requestSpec.studentId,
      weakTopics: requestSpec.weakTopics,
      recentMistakeConceptIds: requestSpec.recentMistakeConceptIds,
    };

    const autoPublish = req.query.autoPublish === 'true';
    const content = await orchestrator.executePipeline(request, autoPublish);
    
    res.status(201).json(content);
  } catch (err) {
    console.error('Error generating content', err);
    res.status(500).json({ error: (err as Error).message || 'Generation failed' });
  }
});

// POST /review - record human review decision
router.post('/review', async (req: Request, res: Response) => {
  try {
    const { contentId, reviewerId, decision, comments } = req.body;
    if (!contentId || !decision) {
      return res.status(400).json({ error: 'Missing contentId or decision parameters.' });
    }

    const review = reviewRepo.create({
      id: uuidv4(),
      contentId,
      reviewerId: reviewerId ?? 'admin-reviewer',
      decision,
      comments,
      reviewedAt: new Date(),
    });
    await reviewRepo.save(review);

    await contentRepo.update(contentId, {
      reviewState: decision,
    });

    res.status(200).json({ message: 'Review recorded successfully.', review });
  } catch (err) {
    console.error('Error recording review', err);
    res.status(500).json({ error: 'Failed to record human review' });
  }
});

// POST /publish - publish approved content
router.post('/publish', async (req: Request, res: Response) => {
  try {
    const { contentId, publishedBy } = req.body;
    if (!contentId) {
      return res.status(400).json({ error: 'Missing contentId parameter.' });
    }

    const publication = await genService.publishContent(contentId, publishedBy ?? 'admin-publisher');
    res.status(200).json({ message: 'Content published successfully.', publication });
  } catch (err) {
    console.error('Error publishing content', err);
    res.status(500).json({ error: (err as Error).message || 'Failed to publish content' });
  }
});

// GET /metrics - retrieve observability dashboard metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = genService.getMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    console.error('Error fetching metrics', err);
    res.status(500).json({ error: 'Failed to retrieve observability metrics' });
  }
});

export default router;
