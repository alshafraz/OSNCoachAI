// src/application/learning-intelligence/infrastructure/persistence/entities/MetricSnapshotEntity.ts
export class MetricSnapshotEntity {
  id!: string;
  studentId!: string;
  metricName!: string;
  value!: number;
  definition!: string;
  formula!: string;
  dataSources!: string[];
  version!: string;
  confidence!: number;
  timestamp!: Date;
}
