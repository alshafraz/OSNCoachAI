// src/application/ai-governance/services/FeatureFlagService.ts
import { FeatureFlag } from '../domain/models/FeatureFlag';
import { FeatureFlagRepository } from '../infrastructure/persistence/repositories/Repositories';
import { Logger } from '@/infra/logger';

/**
 * FeatureFlagService orchestrates gradual prompt/model rollouts and rollback triggers.
 */
export class FeatureFlagService {
  private readonly logger = new Logger('FeatureFlagService');
  private readonly repo = new FeatureFlagRepository();

  /** Get flag state and active value (incorporating canary split calculation). */
  async evaluateFlag(
    flagKey: string,
    studentId?: string
  ): Promise<{ isActive: boolean; targetValue?: string }> {
    const flag = await this.repo.findByKey(flagKey);
    if (!flag || !flag.isActive) {
      return { isActive: false };
    }

    // Canary split logic
    if (flag.canaryWeight > 0 && flag.canaryWeight < 1 && studentId) {
      // Deterministic hash based on studentId + flagKey
      const hash = this.hashString(studentId + flagKey);
      const bucket = hash % 100;
      const targetBucket = flag.canaryWeight * 100;

      if (bucket < targetBucket) {
        this.logger.info('Canary bucket matched', { flagKey, studentId, bucket, targetBucket });
        return { isActive: true, targetValue: flag.targetValue };
      } else {
        return { isActive: false };
      }
    }

    return { isActive: true, targetValue: flag.targetValue };
  }

  /** Set feature flag rollout rules. */
  async setFlag(flagKey: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const flag: FeatureFlag = {
      flagKey,
      description: data.description || '',
      isActive: data.isActive ?? false,
      canaryWeight: data.canaryWeight ?? 1.0,
      targetValue: data.targetValue || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repo.save(flag as any);
    this.logger.info('Feature flag updated', { flagKey, isActive: flag.isActive, canaryWeight: flag.canaryWeight });
    return flag;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
export const defaultFeatureFlagService = new FeatureFlagService();
