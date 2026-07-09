# Learning Intelligence Platform (LIP) – Architecture

## Overview

The Learning Intelligence Platform (LIP) is a **read-only analytics engine** whose sole responsibility is to observe what happens during a learning session, aggregate those observations into meaningful metrics, and surface insights for coaches, parents, and administrators to act upon.

> **Critical constraint:** The LIP **never** makes learning decisions. It only observes, aggregates, and exposes data. All instructional decisions are made upstream by the AI Coach, AI Tutor, or Adaptive Learning engines.

---

## Pipeline

```
Learning Events
       │
       ▼
  Aggregation
  ──────────
  LearningAnalyticsService.processEvent()
  LearningEventRepository.save()
       │
       ▼
  Metrics
  ──────────
  MetricEngine.computeMetrics()
  → accuracy, averageSolveTime, …
  MetricSnapshotRepository.save()
       │
       ▼
  Pattern Detection
  ──────────
  TrendEngine.detectTrends()
  RetentionEngine.estimateRetention()
  PredictionEngine.generatePredictions()
       │
       ▼
  Insight Generation
  ──────────
  InsightEngine.generateInsights()
  → ConceptMisconceptionAlert, RetentionRiskAlert, …
  InsightRepository.save()
       │
       ▼
  Evidence Store
  ──────────
  PostgreSQL tables:
    learning_events
    metric_snapshots
    topic_analytics
    concept_analytics
    skill_analytics
    retention_analytics
    insights
    analytics_job_log
       │
       ▼
  API Exposure
  ──────────
  AnalyticsController (Express router)
  POST /analytics/events        – ingest events
  GET  /analytics/metrics/:id   – metric snapshots
  GET  /analytics/topic/:id     – topic analytics
  GET  /analytics/insights/:id  – student insights
       │
       ▼
  Visualization
  ──────────
  (Consumed by the front-end dashboard components)
```

---

## Components

| Component | File | Responsibility |
|---|---|---|
| `LearningAnalyticsService` | `services/LearningAnalyticsService.ts` | Ingest & persist raw learning events |
| `MetricEngine` | `services/MetricEngine.ts` | Compute accuracy, solve time, and other metrics |
| `TrendEngine` | `services/TrendEngine.ts` | Detect improvement/decline trends over time |
| `RetentionEngine` | `services/RetentionEngine.ts` | Estimate short-term retention via spacing model |
| `PredictionEngine` | `services/PredictionEngine.ts` | Predict future performance from historical data |
| `InsightEngine` | `services/InsightEngine.ts` | Generate structured insight alerts |
| `TopicAnalyticsService` | `services/TopicAnalyticsService.ts` | Per-topic mastery, accuracy, and weakness scoring |
| `ConceptAnalyticsService` | `services/ConceptAnalyticsService.ts` | Per-concept mastery and misconception analysis |
| `SkillAnalyticsService` | `services/SkillAnalyticsService.ts` | Skill-level aggregation |
| `RetentionAnalyticsService` | `services/RetentionAnalyticsService.ts` | Exponential decay retention scoring |
| `AnalyticsOrchestrator` | `engine/AnalyticsOrchestrator.ts` | Runs the full pipeline as a scheduled or on-demand job |
| `AnalyticsController` | `api/controllers/AnalyticsController.ts` | REST API for event ingestion and analytics retrieval |

---

## Database Schema

All tables are created by the migration `InitializeLIPSchema1630000000000.ts`.

| Table | Primary Entity | Description |
|---|---|---|
| `learning_events` | `LearningEventEntity` | Raw event stream |
| `metric_snapshots` | `MetricSnapshotEntity` | Computed metric values per student |
| `topic_analytics` | `TopicAnalyticsEntity` | Topic-level aggregated analytics |
| `concept_analytics` | `ConceptAnalyticsEntity` | Concept-level analytics |
| `skill_analytics` | `SkillAnalyticsEntity` | Skill-level performance |
| `retention_analytics` | `RetentionAnalyticsEntity` | Retention decay scores |
| `insights` | `InsightEntity` | Generated insight alerts |
| `analytics_job_log` | `AnalyticsJobLogEntity` | Audit log for pipeline runs |

---

## Integration Points

- **AI Coach → LIP:** After each coach session the `CoachOrchestrator` calls `LearningAnalyticsService.processEvent()` to publish a `sessionCompleted` event.
- **LIP → Front-end:** The front-end dashboard queries `GET /analytics/insights/:studentId` and `GET /analytics/topic/:topicId` to render student progress views.

---

## Observability

Metrics are exposed via `src/infrastructure/monitoring/lipMetrics.ts`. Mount `GET /metrics` in the Express app to return Prometheus text format.

| Metric | Type | Description |
|---|---|---|
| `lip_events_ingested_total` | Counter | Total events ingested |
| `lip_events_errored_total` | Counter | Ingestion errors |
| `lip_pipeline_runs_total` | Counter | Total pipeline runs |
| `lip_pipeline_errors_total` | Counter | Failed pipeline runs |
| `lip_insights_generated_total` | Counter | Total insights generated |

---

## Running Migrations

```bash
# Generate the migration SQL (dry run)
npx typeorm migration:show -d src/infrastructure/db/dataSource.ts

# Run pending migrations
npx typeorm migration:run -d src/infrastructure/db/dataSource.ts

# Revert the last migration
npx typeorm migration:revert -d src/infrastructure/db/dataSource.ts
```
