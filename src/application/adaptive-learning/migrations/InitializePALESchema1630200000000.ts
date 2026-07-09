// src/application/adaptive-learning/migrations/InitializePALESchema1630200000000.ts

/**
 * InitializePALESchema
 *
 * Creates the foundational tables for the Personalized Adaptive Learning Engine (PALE).
 *
 * In production, these would be proper SQL migrations.
 * This file documents the intended schema for DBA review and future ORM migration generation.
 *
 * Tables:
 *   - pale_adaptive_plans
 *   - pale_adaptation_decisions
 *   - pale_learning_paths
 *   - pale_review_schedules
 *   - pale_difficulty_states
 *   - pale_simulation_results
 */

export const PALE_SCHEMA_UP = `
-- pale_adaptive_plans: Master adaptive plan per student
CREATE TABLE IF NOT EXISTS pale_adaptive_plans (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id                VARCHAR(255) NOT NULL UNIQUE,
  learning_path_id          UUID,
  current_topic_id          VARCHAR(255) NOT NULL,
  active_topic_difficulties JSONB NOT NULL DEFAULT '{}',
  active_recovery_plan_ids  JSONB NOT NULL DEFAULT '[]',
  active_challenge_plan_ids JSONB NOT NULL DEFAULT '[]',
  upcoming_review_topic_ids JSONB NOT NULL DEFAULT '[]',
  overall_readiness         DECIMAL(4,3) NOT NULL DEFAULT 0,
  competition_prep_active   BOOLEAN NOT NULL DEFAULT FALSE,
  days_to_competition       INTEGER,
  current_pace_recommendation VARCHAR(50) NOT NULL DEFAULT 'CONTINUE',
  total_sessions_completed  INTEGER NOT NULL DEFAULT 0,
  last_adapted_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pale_adaptive_plans_student ON pale_adaptive_plans (student_id);

-- pale_adaptation_decisions: Audit log of every adaptation decision
CREATE TABLE IF NOT EXISTS pale_adaptation_decisions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id              VARCHAR(255) NOT NULL,
  topic_id                VARCHAR(255) NOT NULL,
  action                  VARCHAR(100) NOT NULL,
  decision_summary        TEXT NOT NULL,
  evidence_used           JSONB NOT NULL DEFAULT '[]',
  reasoning               TEXT NOT NULL,
  expected_benefit        TEXT NOT NULL,
  estimated_improvement   INTEGER NOT NULL DEFAULT 0,
  confidence              DECIMAL(4,3) NOT NULL DEFAULT 0,
  model_version           VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  applied_at              TIMESTAMPTZ,
  outcome                 VARCHAR(20),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pale_decisions_student ON pale_adaptation_decisions (student_id, created_at DESC);

-- pale_learning_paths: Personalized topic ordering per student
CREATE TABLE IF NOT EXISTS pale_learning_paths (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           VARCHAR(255) NOT NULL UNIQUE,
  nodes                JSONB NOT NULL DEFAULT '[]',
  current_node_index   INTEGER NOT NULL DEFAULT 0,
  mastered_topic_ids   JSONB NOT NULL DEFAULT '[]',
  recovery_topic_ids   JSONB NOT NULL DEFAULT '[]',
  competition_date     DATE,
  version              INTEGER NOT NULL DEFAULT 1,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pale_paths_student ON pale_learning_paths (student_id);

-- pale_review_schedules: Spaced repetition review slots
CREATE TABLE IF NOT EXISTS pale_review_schedules (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id              VARCHAR(255) NOT NULL,
  topic_id                VARCHAR(255) NOT NULL,
  leitner_box             SMALLINT NOT NULL DEFAULT 1,
  scheduled_for           TIMESTAMPTZ NOT NULL,
  urgency                 DECIMAL(4,3) NOT NULL DEFAULT 0,
  retention_at_scheduling DECIMAL(4,3) NOT NULL DEFAULT 0,
  completed               BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at            TIMESTAMPTZ,
  answered_correctly      BOOLEAN,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pale_reviews_student_due ON pale_review_schedules (student_id, scheduled_for)
  WHERE completed = FALSE;

-- pale_difficulty_states: Per-student per-topic difficulty state
CREATE TABLE IF NOT EXISTS pale_difficulty_states (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id                VARCHAR(255) NOT NULL,
  topic_id                  VARCHAR(255) NOT NULL,
  current_difficulty        VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  consecutive_increases     INTEGER NOT NULL DEFAULT 0,
  consecutive_decreases     INTEGER NOT NULL DEFAULT 0,
  total_adjustments         INTEGER NOT NULL DEFAULT 0,
  recent_accuracy           DECIMAL(4,3) NOT NULL DEFAULT 0.5,
  recent_hint_usage_rate    DECIMAL(4,3) NOT NULL DEFAULT 0.2,
  recent_solve_time_ratio   DECIMAL(6,3) NOT NULL DEFAULT 1.0,
  last_updated              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, topic_id)
);
CREATE INDEX idx_pale_difficulty_student ON pale_difficulty_states (student_id);

-- pale_simulation_results: Forward projections cache
CREATE TABLE IF NOT EXISTS pale_simulation_results (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id                      VARCHAR(255) NOT NULL,
  simulated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  projections                     JSONB NOT NULL DEFAULT '[]',
  estimated_readiness_date        DATE,
  at_risk_topics                  JSONB NOT NULL DEFAULT '[]',
  on_track_topics                 JSONB NOT NULL DEFAULT '[]',
  estimated_competition_percentile INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_pale_simulations_student ON pale_simulation_results (student_id, simulated_at DESC);
`;

export const PALE_SCHEMA_DOWN = `
DROP TABLE IF EXISTS pale_simulation_results;
DROP TABLE IF EXISTS pale_difficulty_states;
DROP TABLE IF EXISTS pale_review_schedules;
DROP TABLE IF EXISTS pale_learning_paths;
DROP TABLE IF EXISTS pale_adaptation_decisions;
DROP TABLE IF EXISTS pale_adaptive_plans;
`;
