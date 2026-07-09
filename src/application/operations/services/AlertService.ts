// src/application/operations/services/AlertService.ts
import { operationsConfig } from '../config/operationsConfig';
import { Logger } from '@/infra/logger';

export interface OperationalAlert {
  source: string;
  metricName: string;
  metricValue: number;
  threshold: number;
  message: string;
  severity: 'WARNING' | 'CRITICAL';
  timestamp: Date;
}

/**
 * AlertService dispatches warnings and failures to operations notification channels.
 */
export class AlertService {
  private readonly logger = new Logger('AlertService');
  private static alertsFired: OperationalAlert[] = [];

  /** Evaluate metrics against thresholds and trigger alerts. */
  async checkThresholds(metricName: string, value: number): Promise<boolean> {
    const limits = operationsConfig.thresholds;
    let limitValue = 100;
    let severity: 'WARNING' | 'CRITICAL' = 'WARNING';

    if (metricName === 'cpu' && value > limits.cpuMaxPct) {
      limitValue = limits.cpuMaxPct;
      severity = 'CRITICAL';
    } else if (metricName === 'memory' && value > limits.memoryMaxPct) {
      limitValue = limits.memoryMaxPct;
      severity = 'CRITICAL';
    } else if (metricName === 'latency' && value > limits.latencyMaxMs) {
      limitValue = limits.latencyMaxMs;
      severity = 'WARNING';
    } else {
      return false; // Metrics normal
    }

    const alert: OperationalAlert = {
      source: 'SystemMonitor',
      metricName,
      metricValue: value,
      threshold: limitValue,
      message: `Threshold breached: ${metricName} is at ${value}% (limit: ${limitValue}%)`,
      severity,
      timestamp: new Date(),
    };

    AlertService.alertsFired.push(alert);
    this.logger.error('CRITICAL OPERATIONAL ALERT TRIPPED', alert);
    await this.dispatchAlertNotification(alert);
    return true;
  }

  async getRecentAlerts(): Promise<OperationalAlert[]> {
    return AlertService.alertsFired;
  }

  private async dispatchAlertNotification(alert: OperationalAlert): Promise<void> {
    // Simulated SMTP / Slack integrations
    this.logger.info('Dispatched alert notification to ops slack webhook', {
      target: operationsConfig.alerting.slackWebhook,
      severity: alert.severity,
    });
  }
}
export const defaultAlertService = new AlertService();
