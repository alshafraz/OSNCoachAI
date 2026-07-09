import { Evidence } from '../../domain/models/Evidence';
import { LearningMotivationService } from '../../learning-motivation/services/LearningMotivationService';
import { AssessmentService } from '../../assessment/services/AssessmentService';
import { AITutorService } from '../../ai-tutor/services/AITutorService';
import { PracticeService } from '../../practice/services/PracticeService';
import { KnowledgeGraphService } from '../../knowledge-graph/services/KnowledgeGraphService';

/**
 * EvidenceCollector gathers raw evidence from all other engines for a given session.
 * It normalises the data into the common `Evidence` shape.
 * The external services are stubbed – replace with actual implementations.
 */
export class EvidenceCollector {
  constructor(private readonly sessionId: string) {}

  async collect(): Promise<Evidence[]> {
    const evidences: Evidence[] = [];
    // Learning Motivation evidence
    try {
      const lm = new LearningMotivationService(this.sessionId);
      const lmData = await lm.getMotivationMetrics();
      evidences.push({
        id: `${this.sessionId}-lm-${Date.now()}`,
        sessionId: this.sessionId,
        type: 'learningMotivation',
        value: lmData.score,
        source: 'LearningMotivation',
        timestamp: new Date()
      });
    } catch {}
    // Assessment evidence
    try {
      const as = new AssessmentService(this.sessionId);
      const asData = await as.getAssessmentMetrics();
      evidences.push({
        id: `${this.sessionId}-as-${Date.now()}`,
        sessionId: this.sessionId,
        type: 'assessment',
        value: asData.overallScore,
        source: 'Assessment',
        timestamp: new Date()
      });
    } catch {}
    // AI Tutor evidence
    try {
      const at = new AITutorService(this.sessionId);
      const atData = await at.getTutorMetrics();
      evidences.push({
        id: `${this.sessionId}-at-${Date.now()}`,
        sessionId: this.sessionId,
        type: 'aiTutor',
        value: atData.engagementScore,
        source: 'AITutor',
        timestamp: new Date()
      });
    } catch {}
    // Practice evidence
    try {
      const pr = new PracticeService(this.sessionId);
      const prData = await pr.getPracticeMetrics();
      evidences.push({
        id: `${this.sessionId}-pr-${Date.now()}`,
        sessionId: this.sessionId,
        type: 'practice',
        value: prData.successRate,
        source: 'Practice',
        timestamp: new Date()
      });
    } catch {}
    // Knowledge Graph evidence
    try {
      const kg = new KnowledgeGraphService(this.sessionId);
      const kgData = await kg.getKnowledgeMetrics();
      evidences.push({
        id: `${this.sessionId}-kg-${Date.now()}`,
        sessionId: this.sessionId,
        type: 'knowledgeGraph',
        value: kgData.coverageScore,
        source: 'KnowledgeGraph',
        timestamp: new Date()
      });
    } catch {}
    return evidences;
  }
}
