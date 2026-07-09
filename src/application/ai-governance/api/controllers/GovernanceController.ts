// src/application/ai-governance/api/controllers/GovernanceController.ts
import { Router, Request, Response } from 'express';
import { PromptRegistry } from '../../services/PromptRegistry';
import { PromptVersionService } from '../../services/PromptVersionService';
import { CostService } from '../../services/CostService';
import { AuditService } from '../../services/AuditService';
import { FeatureFlagService } from '../../services/FeatureFlagService';
import { BenchmarkService } from '../../services/BenchmarkService';
import { Logger } from '@/infra/logger';

const router = Router();
const promptRegistry = new PromptRegistry();
const promptVersionService = new PromptVersionService();
const costService = new CostService();
const auditService = new AuditService();
const featureFlagService = new FeatureFlagService();
const benchmarkService = new BenchmarkService();
const logger = new Logger('GovernanceController');

/**
 * GET /governance/logs
 * Retrieve recent AIOps request execution logs.
 */
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const limit = parseInt((req.query.limit as string) ?? '50', 10);
    const logs = await auditService.getRecentLogs(limit);
    res.json({ logs });
  } catch (err: any) {
    logger.error('GET /logs failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /governance/stats
 * Retrieve billing metrics and feature cost allocations.
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await costService.getStats();
    res.json({ stats });
  } catch (err: any) {
    logger.error('GET /stats failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /governance/prompts/:id/version
 * Submit a new prompt version template to the registry.
 */
router.post('/prompts/:id/version', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const version = await promptVersionService.createVersion(id, req.body);
    res.json({ version, message: 'New version added as DRAFT.' });
  } catch (err: any) {
    logger.error('POST /version failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /governance/prompts/:id/promote
 * Promote prompt version to active production status.
 */
router.post('/prompts/:id/promote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { semver } = req.body;
    await promptVersionService.promoteVersion(id, semver);
    res.json({ message: `Version ${semver} successfully promoted to active release.` });
  } catch (err: any) {
    logger.error('POST /promote failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /governance/prompts/:id/rollback
 * Rollback active template to previous stable version.
 */
router.post('/prompts/:id/rollback', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { semver } = req.body;
    await promptVersionService.rollbackVersion(id, semver);
    res.json({ message: `Prompt successfully rolled back to ${semver}.` });
  } catch (err: any) {
    logger.error('POST /rollback failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /governance/flags
 * Configure rollout rule configurations.
 */
router.post('/flags', async (req: Request, res: Response) => {
  try {
    const { flagKey, description, isActive, canaryWeight, targetValue } = req.body;
    const flag = await featureFlagService.setFlag(flagKey, { description, isActive, canaryWeight, targetValue });
    res.json({ flag, message: 'Rollout flag configured.' });
  } catch (err: any) {
    logger.error('POST /flags failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /governance/benchmarks/run
 * Run regression test benchmarks on prompt versions.
 */
router.post('/benchmarks/run', async (req: Request, res: Response) => {
  try {
    const { promptId, semver, category } = req.body;
    const score = await benchmarkService.runSuite(promptId, semver, category);
    await promptVersionService.updateEvaluationScore(promptId, semver, score);
    res.json({ score, message: 'Benchmark suite ran successfully.' });
  } catch (err: any) {
    logger.error('POST /benchmarks/run failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
