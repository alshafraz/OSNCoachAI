// src/application/operations/config/operationsConfig.ts

/**
 * Operations, scaling, and retention configuration constants.
 */
export const operationsConfig = {
  /** Health metrics thresholds */
  thresholds: {
    cpuMaxPct: 85,
    memoryMaxPct: 90,
    diskMaxPct: 85,
    latencyMaxMs: 2500, // alert if avg request latency exceeds 2.5s
    dbConnectionsMax: 80, // warning limit for connection pool usage
  },

  /** Data retention policies in days */
  retentionDays: {
    auditLogs: 365,       // Audit logs kept for 1 year
    operationalLogs: 30,  // Detailed request logs kept for 30 days
    costTracking: 180,    // Financial data kept for 6 months
    backups: 14,          // Keep backups for 14 days
    tempUploads: 1,       // Cleanup temporary worksheet PDFs within 24h
  },

  /** Security configurations */
  security: {
    rateLimiting: {
      windowMs: 60 * 1000, // 1 minute window
      maxRequests: 100,    // 100 requests per minute max
    },
    corsOrigins: ['https://mathosn.com', 'https://staging.mathosn.com'],
  },

  /** Scheduled timing configurations */
  scheduler: {
    dailyAnalyticsHour: 2, // 2:00 AM daily
    backupIntervalHours: 12, // every 12 hours
    retentionCleanupHour: 3, // 3:00 AM daily
  },

  /** Alerts notification targets */
  alerting: {
    emailTarget: 'ops-alerts@mathosn.com',
    slackWebhook: 'https://hooks.slack.com/services/ops/alerts',
  },
} as const;
