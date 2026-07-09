// src/application/content-generation/services/ContextBuilder.ts
import { Injectable } from '@nestjs/common';
import { MIL } from '../../../infrastructure/services/math/MathIntelligenceLayer';
import { GenerationRequest } from '../domain/models/GenerationRequest';

export interface GenerationContext {
  conceptDetails?: any;
  dependencyChain?: any[];
  weakTopics?: string[];
  recentMistakes?: string[];
  formulas?: any[];
  misconceptions?: any[];
  prerequisitesNeeded?: any[];
}

@Injectable()
export class ContextBuilder {
  /**
   * Build the contextual information needed for prompt construction.
   */
  async buildContext(request: GenerationRequest): Promise<GenerationContext> {
    const context: GenerationContext = {};

    // 1. MIL Lookup: Retrieve details of the primary concept if topic is provided
    let primaryConceptId = request.topic;
    if (primaryConceptId) {
      const concept = MIL.concepts.getById(primaryConceptId);
      if (concept) {
        context.conceptDetails = concept;
        
        // 2. Knowledge Graph Lookup: Retrieve dependency chain
        context.dependencyChain = MIL.knowledgeGraph.getDependencyChain(primaryConceptId);
        
        // 3. Retrieve formulas & misconceptions associated with the concept
        context.formulas = MIL.formulas.getForConcept(primaryConceptId);
        context.misconceptions = MIL.misconceptions.getForConcept(primaryConceptId);
      }
    }

    // 4. Learning Intelligence Lookup: If studentId is present, lookup weakness/recent mistakes
    if (request.studentId) {
      try {
        const { TopicAnalyticsRepository } = await import('../../learning-intelligence/infrastructure/persistence/repositories/TopicAnalyticsRepository');
        const topicAnalyticsRepo = new TopicAnalyticsRepository();
        const weaknesses = await topicAnalyticsRepo.findAllByStudent(request.studentId);
        context.weakTopics = weaknesses.slice(0, 3).map(w => w.topicId);
      } catch (err) {
        // Fallback to request values or empty array if DB lookup fails/tables not ready
        context.weakTopics = request.weakTopics ?? [];
      }
      context.recentMistakes = request.recentMistakeConceptIds ?? [];
    } else {
      context.weakTopics = request.weakTopics ?? [];
      context.recentMistakes = request.recentMistakeConceptIds ?? [];
    }

    // 5. Gather missing prerequisites if learning history/mastered concepts is available
    if (primaryConceptId && request.studentId) {
      // Stub: in a real system we would fetch mastered concept ids from database or user profile
      const masteredConceptIds: string[] = []; 
      context.prerequisitesNeeded = MIL.knowledgeGraph.getMissingPrerequisites(primaryConceptId, masteredConceptIds);
    }

    return context;
  }
}
