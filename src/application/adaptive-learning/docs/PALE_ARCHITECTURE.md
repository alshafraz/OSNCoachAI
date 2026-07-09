# PALE Architecture Documentation

## Overview

The **Personalized Adaptive Learning Engine (PALE)** is PALE is the orchestration engine for MathOSN Coach that continuously designs and adjusts each student's complete learning journey.

PALE coordinates every major subsystem:
- Learning Activities
- Question Selection
- Topic Sequencing
- Difficulty Progression
- Review Scheduling
- Assessment Timing
- AI Tutor Sessions
- AI Coach Plans
- Generated Content
- Rest Recommendations

---

## Core Principle

> **"The LLM never makes adaptation decisions."**
>
> All decisions in PALE are:
> - Evidence-based (measurable signals only)
> - Rule-driven (deterministic thresholds)
> - Explainable (full audit trail on every decision)
> - Configurable (all thresholds in `paleConfig.ts`)
> - Observable (Prometheus-style counters in `paleMetrics.ts`)
> - Testable (each engine independently unit-testable)

---

## Component Table

| Component | File | Responsibility |
|---|---|---|
| Config | `config/paleConfig.ts` | All thresholds, weights, toggles |
| Orchestrator | `engine/AdaptationOrchestrator.ts` | 9-step pipeline driver |
| Facade | `services/AdaptiveLearningService.ts` | External API surface |
| Difficulty | `services/DifficultyEngine.ts` | Rule-based difficulty adjustment |
| Review | `services/ReviewScheduler.ts` | Leitner spaced repetition |
| Question | `services/QuestionSelectionService.ts` | Multi-signal weighted scoring |
| Path | `services/LearningPathService.ts` | Topic progression management |
| Session | `services/LearningSessionPlanner.ts` | Structured session assembly |
| Recovery | `services/RecoveryEngine.ts` | Struggling student interventions |
| Challenge | `services/ChallengeEngine.ts` | Excelling student accelerations |
| Simulation | `services/SimulationEngine.ts` | 7/14/30-day readiness projection |
| Pace | `services/PaceEngine.ts` | Fatigue detection and pacing |
| Goals | `services/GoalAdapter.ts` | Dynamic goal rebalancing |
| Explainability | `services/ExplainabilityFormatter.ts` | Human-readable decisions |
| Metrics | `monitoring/paleMetrics.ts` | Observability counters |
| API | `api/controllers/AdaptiveLearningController.ts` | 7 REST endpoints |

---

## Adaptation Pipeline (9 Steps)

```
INPUT (evidence per student+topic)
    │
    ▼
[Step 1] DifficultyEngine.adjustDifficulty()
         → AdaptationDecision (INCREASE/DECREASE/null)
    │
    ▼
[Step 2] ReviewScheduler.scheduleReview()
         → ReviewSchedule (if retention < 0.65)
    │
    ▼
[Step 3] RecoveryEngine.generateRecoveryPlan()
         → RecoveryPlan | null (if accuracy < 45% for 3 sessions)
    │
    ▼
[Step 4] ChallengeEngine.generateChallengePlan()
         → ChallengePlan | null (if accuracy > 90% for 3 sessions)
    │
    ▼
[Step 5] LearningPathService.getOrBuildPath()
         → LearningPath (evolves mastered topics)
    │
    ▼
[Step 6] DifficultyEngine.getCurrentDifficulty()
         → current PaleDifficulty for plan snapshot
    │
    ▼
[Step 7] PaceEngine.evaluate()
         → PaceRecommendation for plan
    │
    ▼
[Step 8] Compute daysToCompetition
    │
    ▼
[Step 9] Persist AdaptivePlan
         → Updated master state document
    │
    ▼
OUTPUT: AdaptivePlan
```

---

## Question Selection Formula

```
score = (topicPriority × 0.30) + (difficultyMatch × 0.25) 
       + (diversityBonus × 0.15) + (retentionGap × 0.15) 
       + (solveTimeBonus × 0.10) + (recencyBonus × 0.05)
```

All weights are configurable in `paleConfig.questionSelection`.

---

## Difficulty Adjustment Rules

| Condition | Direction |
|---|---|
| Accuracy ≥ 85% AND solveTime fast AND hints low | INCREASE |
| Accuracy ≤ 55% OR hints high OR solveTime slow | DECREASE |
| Max 3 consecutive increases | PAUSE increases |
| Minimum 5 questions before any adjustment | WAIT |

---

## Spaced Repetition (Leitner Boxes)

| Box | Interval | Promotion on Correct | Demotion on Incorrect |
|---|---|---|---|
| 1 | 1 day | → Box 2 | (stays) |
| 2 | 3 days | → Box 3 | → Box 1 |
| 3 | 7 days | → Box 4 | → Box 1 |
| 4 | 14 days | → Box 5 | → Box 1 |
| 5 | 30 days | (max) | → Box 1 |

---

## Database Schema (6 Tables)

| Table | Key Fields |
|---|---|
| `pale_adaptive_plans` | student_id (unique), readiness, pace, decisions |
| `pale_adaptation_decisions` | student_id, action, evidence, reasoning, confidence |
| `pale_learning_paths` | student_id (unique), nodes (JSONB), version |
| `pale_review_schedules` | student_id, leitner_box, scheduled_for, urgency |
| `pale_difficulty_states` | (student_id, topic_id) unique, current_difficulty |
| `pale_simulation_results` | student_id, projections (JSONB), percentile |

---

## Integration Map

```
              ┌──────────────────────────────────────┐
              │            PALE (PALE)               │
              │    AdaptiveLearningService (Facade)   │
              └──────────────┬───────────────────────┘
                             │
         ┌───────────────────┼──────────────────────┐
         ▼                   ▼                       ▼
   ┌──────────┐       ┌──────────┐          ┌──────────────┐
   │   LIP    │       │  ACGP    │          │   MIL / KG   │
   │ Analytics│       │ Content  │          │  Knowledge   │
   │ Platform │       │ Platform │          │    Graph     │
   └──────────┘       └──────────┘          └──────────────┘
         │                   │                       │
         │ TopicAnalytics     │ Question generation   │ Concept deps
         │ RetentionScores    │ (when supply is low)  │ Learning path
         └───────────────────┴───────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   AI Coach      │
                    │   AI Tutor      │
                    │   Assessment    │
                    └─────────────────┘
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/adaptive/:studentId/plan` | Get full adaptive plan |
| GET | `/adaptive/:studentId/session` | Get today's session |
| GET | `/adaptive/:studentId/path` | Get learning path |
| GET | `/adaptive/:studentId/decisions` | Get adaptation decisions |
| POST | `/adaptive/:studentId/run` | Trigger full pipeline run |
| GET | `/adaptive/:studentId/simulate` | Run readiness simulation |
| GET | `/adaptive/:studentId/reviews` | Get upcoming reviews |

---

## Observability Counters

| Metric | Description |
|---|---|
| `pale_adaptation_runs_total` | Full pipeline cycles executed |
| `pale_difficulty_adjustments_total` | Difficulty changes made |
| `pale_reviews_scheduled_total` | Spaced reviews created |
| `pale_recovery_plans_activated_total` | Recovery activations |
| `pale_challenge_plans_activated_total` | Challenge activations |
| `pale_sessions_planned_total` | Sessions assembled |
| `pale_question_selections_total` | Question selection calls |
| `pale_simulation_runs_total` | Simulations executed |
| `pale_goal_rebalances_total` | Goal rebalancing actions |
