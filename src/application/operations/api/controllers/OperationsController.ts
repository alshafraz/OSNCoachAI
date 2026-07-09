// src/application/operations/api/controllers/OperationsController.ts
import { Router, Request, Response } from 'express';
import { HealthService } from '../../services/HealthService';
import { MonitoringService } from '../../services/MonitoringService';
import { BackupService } from '../../services/BackupService';
import { RestoreService } from '../../services/RestoreService';
import { DeploymentService } from '../../services/DeploymentService';
import { MaintenanceService } from '../../services/MaintenanceService';
import { AuditService } from '../../services/AuditService';
import { AlertService } from '../../services/AlertService';
import { Logger } from '@/infra/logger';

const router = Router();
const healthService = new HealthService();
const monitoringService = new MonitoringService();
const backupService = new BackupService();
const restoreService = new RestoreService();
const deploymentService = new DeploymentService();
const maintenanceService = new MaintenanceService();
const auditService = new AuditService();
const alertService = new AlertService();
const logger = new Logger('OperationsController');

/**
 * GET /operations/health
 * Returns deep liveness/readiness indicators for cloud load balancers.
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await healthService.getHealth();
    res.json({ health });
  } catch (err: any) {
    logger.error('GET /health failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /operations/metrics
 * Returns current metrics snapshots.
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await monitoringService.getMetrics();
    res.json({ metrics });
  } catch (err: any) {
    logger.error('GET /metrics failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /operations/backups
 * Triggers an immediate database dump.
 */
router.post('/backups', async (req: Request, res: Response) => {
  try {
    const backup = await backupService.createBackup();
    res.json({ backup, message: 'Database backup completed.' });
  } catch (err: any) {
    logger.error('POST /backups failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /operations/backups/:id/restore
 * Triggers a database restore sequence.
 */
router.post('/backups/:id/restore', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await restoreService.restoreFromBackup(id);
    res.json({ message: 'Database successfully restored from backup snapshot.' });
  } catch (err: any) {
    logger.error('POST /restore failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /operations/deployments
 * Logs a new production deployment event.
 */
router.post('/deployments', async (req: Request, res: Response) => {
  try {
    const { version, commitHash, author, notes } = req.body;
    const log = await deploymentService.deploy(version, commitHash, author, notes);
    res.json({ log, message: 'Deployment successfully logged.' });
  } catch (err: any) {
    logger.error('POST /deployments failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /operations/maintenance
 * Enforces system-wide read-only locks during system migrations.
 */
router.post('/maintenance', async (req: Request, res: Response) => {
  try {
    const { locked, actor, reason } = req.body;
    await maintenanceService.setMaintenanceLock(locked, actor, reason);
    res.json({ locked, message: `System-wide write lock updated: ${locked ? 'ENABLED' : 'DISABLED'}.` });
  } catch (err: any) {
    logger.error('POST /maintenance failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /operations/events
 * Retrieves recent operations audit logs.
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    const limit = parseInt((req.query.limit as string) ?? '50', 10);
    const events = await auditService.getRecentEvents(limit);
    res.json({ events });
  } catch (err: any) {
    logger.error('GET /events failed', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /operations/alerts
 * Retrieves active/tripped threshold alerts.
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const alerts = await alertService.getRecentAlerts();
    res.json({ alerts });
  } catch (err: any) {
    logger.error('GET /alerts failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
