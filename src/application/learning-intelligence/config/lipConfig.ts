// src/application/learning-intelligence/config/lipConfig.ts
export const lipConfig = {
  // Aggregation batch size (number of events per aggregation job)
  aggregationBatchSize: 500,
  // Metrics version – bump when formulas change
  metricVersion: '1.0.0',
  // Retention decay factor (exponential decay per day)
  retentionDecayFactor: 0.95,
  // Prediction confidence threshold
  predictionConfidenceThreshold: 0.6,
  // Observability settings
  observability: {
    enablePrometheus: true,
    metricPrefix: 'lip_',
  },
};
