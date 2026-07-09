// src/application/learning-intelligence/services/MetricEngine.ts
import { LearningEvent } from '../domain/models/LearningEvent';
import { MetricSnapshot } from '../domain/models/MetricSnapshot';
import { lipConfig } from '../config/lipConfig';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@/infra/logger';

/**
 * MetricEngine processes a batch of LearningEvents and produces MetricSnapshots.
 * For brevity, only a few example metrics are calculated.
 */
export class MetricEngine {
  private readonly logger = new Logger('MetricEngine');

  async computeMetrics(events: LearningEvent[]): Promise<MetricSnapshot[]> {
    const snapshots: MetricSnapshot[] = [];
    const studentId = events[0]?.studentId;
    if (!studentId) {
      this.logger.warn('No studentId found in events batch');
      return snapshots;
    }

    // Example metric: Accuracy (correct answers / total answered)
    const answerEvents = events.filter(e => e.eventType === 'questionAnswered');
    const correct = answerEvents.filter(e => e.payload?.correct === true).length;
    const total = answerEvents.length;
    const accuracy = total > 0 ? correct / total : 0;
    snapshots.push(this.buildSnapshot(studentId, 'accuracy', accuracy, ['questionAnswered'], `Accuracy = correct / total answered`));

    // Example metric: Average Solve Time (seconds)
    const timeEvents = events.filter(e => e.eventType === 'questionCompleted');
    const totalTime = timeEvents.reduce((sum, e) => sum + (e.payload?.durationSeconds ?? 0), 0);
    const avgSolveTime = timeEvents.length > 0 ? totalTime / timeEvents.length : 0;
    snapshots.push(this.buildSnapshot(studentId, 'averageSolveTime', avgSolveTime, ['questionCompleted'], `Average time to solve a question`));

    // Additional metrics can be added following the same pattern.
    return snapshots;
  }

  private buildSnapshot(
    studentId: string,
    metricName: string,
    value: number,
    dataSources: string[],
    definition: string,
  ): MetricSnapshot {
    return {
      id: uuidv4(),
      studentId,
      metricName,
      value,
      definition,
      formula: definition, // In a real system this would be LaTeX or detailed formula
      dataSources,
      version: lipConfig.metricVersion,
      confidence: 1.0, // placeholder confidence
      timestamp: new Date(),
    };
  }
}
