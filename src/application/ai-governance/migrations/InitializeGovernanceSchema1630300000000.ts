// src/application/ai-governance/migrations/InitializeGovernanceSchema1630300000000.ts

/**
 * InitializeGovernanceSchema
 *
 * Migration to establish database schema layout for AI Governance & Operations (AIOps).
 *
 * Tables:
 *   - ai_prompts
 *   - ai_prompt_versions
 *   - ai_prompt_evaluations
 *   - ai_model_providers
 *   - ai_requests
 *   - ai_responses
 *   - ai_cost_trackings
 *   - ai_audit_logs
 *   - ai_feature_flags
 *   - ai_benchmarks
 */

export const GOVERNANCE_SCHEMA_UP = `
-- ai_prompts: Base prompt metadata
CREATE TABLE IF NOT EXISTS ai_prompts (
  id             VARCHAR(255) PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  description    TEXT,
  category       VARCHAR(100) NOT NULL,
  owner          VARCHAR(100) NOT NULL,
  variables      JSONB NOT NULL DEFAULT '[]',
  active_version VARCHAR(20) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_prompt_versions: Semantic versions of prompt templates
CREATE TABLE IF NOT EXISTS ai_prompt_versions (
  version_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id              VARCHAR(255) REFERENCES ai_prompts(id) ON DELETE CASCADE,
  semver                 VARCHAR(20) NOT NULL,
  author                 VARCHAR(100) NOT NULL,
  description            TEXT,
  status                 VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  release_notes          TEXT,
  system_template        TEXT NOT NULL,
  user_template          TEXT NOT NULL,
  temperature            DECIMAL(3,2) NOT NULL DEFAULT 0.3,
  max_tokens             INTEGER NOT NULL DEFAULT 2048,
  expected_output_schema JSONB,
  evaluation_score       INTEGER,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (prompt_id, semver)
);
CREATE INDEX idx_prompt_versions_lookup ON ai_prompt_versions (prompt_id, semver);

-- ai_prompt_evaluations: Benchmark evaluations log
CREATE TABLE IF NOT EXISTS ai_prompt_evaluations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id             VARCHAR(255) NOT NULL,
  prompt_version        VARCHAR(20) NOT NULL,
  evaluated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  overall_score         INTEGER NOT NULL,
  correctness           INTEGER NOT NULL,
  consistency           INTEGER NOT NULL,
  completeness          INTEGER NOT NULL,
  pedagogical_quality   INTEGER NOT NULL,
  mathematical_accuracy INTEGER NOT NULL,
  explanation_quality   INTEGER NOT NULL,
  hint_quality          INTEGER NOT NULL,
  sample_count          INTEGER NOT NULL DEFAULT 1,
  notes                 TEXT
);

-- ai_model_providers: LLM model target registry
CREATE TABLE IF NOT EXISTS ai_model_providers (
  id                           VARCHAR(255) PRIMARY KEY,
  provider_type                VARCHAR(50) NOT NULL,
  model_name                   VARCHAR(100) NOT NULL,
  avg_latency_ms               INTEGER NOT NULL DEFAULT 0,
  quality_score                INTEGER NOT NULL DEFAULT 0,
  is_available                 BOOLEAN NOT NULL DEFAULT TRUE,
  cost_per_million_prompt      DECIMAL(8,4) NOT NULL DEFAULT 0.0,
  cost_per_million_completion  DECIMAL(8,4) NOT NULL DEFAULT 0.0,
  fallback_model_id            VARCHAR(255),
  consecutive_failures         INTEGER NOT NULL DEFAULT 0,
  last_tested_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_requests: Log of incoming request details
CREATE TABLE IF NOT EXISTS ai_requests (
  request_id      UUID PRIMARY KEY,
  engine          VARCHAR(50) NOT NULL,
  student_id      VARCHAR(255),
  prompt_id       VARCHAR(255) NOT NULL,
  prompt_version  VARCHAR(20) NOT NULL,
  variables       JSONB NOT NULL DEFAULT '{}',
  system_prompt   TEXT NOT NULL,
  user_prompt     TEXT NOT NULL,
  temperature     DECIMAL(3,2) NOT NULL,
  max_tokens      INTEGER NOT NULL,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_responses: Outcome logs of LLM responses
CREATE TABLE IF NOT EXISTS ai_responses (
  response_id        UUID PRIMARY KEY,
  request_id         UUID REFERENCES ai_requests(request_id) ON DELETE CASCADE,
  provider_id        VARCHAR(255) NOT NULL,
  raw_content        TEXT NOT NULL,
  parsed_data        JSONB,
  is_valid           BOOLEAN NOT NULL DEFAULT TRUE,
  validation_reason  TEXT,
  is_safe            BOOLEAN NOT NULL DEFAULT TRUE,
  safety_reason      TEXT,
  quality_score      INTEGER NOT NULL DEFAULT 0,
  latency_ms         INTEGER NOT NULL,
  retry_count        INTEGER NOT NULL DEFAULT 0,
  input_tokens       INTEGER NOT NULL,
  output_tokens      INTEGER NOT NULL,
  cost_usd           DECIMAL(12,6) NOT NULL,
  timestamp          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_cost_trackings: Cost analysis registry
CREATE TABLE IF NOT EXISTS ai_cost_trackings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id    UUID NOT NULL,
  engine        VARCHAR(50) NOT NULL,
  student_id    VARCHAR(255),
  provider_id   VARCHAR(255) NOT NULL,
  input_tokens  INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd      DECIMAL(12,6) NOT NULL,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cost_trackings_student ON ai_cost_trackings (student_id);

-- ai_audit_logs: Log details for governance reports
CREATE TABLE IF NOT EXISTS ai_audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     UUID NOT NULL,
  timestamp      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  student_id     VARCHAR(255),
  engine         VARCHAR(50) NOT NULL,
  prompt_id      VARCHAR(255) NOT NULL,
  prompt_version VARCHAR(20) NOT NULL,
  provider_id    VARCHAR(255) NOT NULL,
  model_name     VARCHAR(100) NOT NULL,
  input_tokens   INTEGER NOT NULL DEFAULT 0,
  output_tokens  INTEGER NOT NULL DEFAULT 0,
  cost_usd       DECIMAL(12,6) NOT NULL DEFAULT 0.0,
  latency_ms     INTEGER NOT NULL DEFAULT 0,
  retry_count    INTEGER NOT NULL DEFAULT 0,
  success        BOOLEAN NOT NULL DEFAULT FALSE,
  is_valid       BOOLEAN NOT NULL DEFAULT FALSE,
  is_safe        BOOLEAN NOT NULL DEFAULT FALSE,
  quality_score  INTEGER NOT NULL DEFAULT 0,
  error_details  JSONB
);
CREATE INDEX idx_audit_logs_engine ON ai_audit_logs (engine);

-- ai_feature_flags: Gradual rollout and swap controls
CREATE TABLE IF NOT EXISTS ai_feature_flags (
  flag_key       VARCHAR(255) PRIMARY KEY,
  description    TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT FALSE,
  canary_weight  DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  target_value   VARCHAR(255) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_benchmarks: Test reference points
CREATE TABLE IF NOT EXISTS ai_benchmarks (
  id                      VARCHAR(255) PRIMARY KEY,
  category                VARCHAR(50) NOT NULL,
  input_variables         JSONB NOT NULL DEFAULT '{}',
  expected_output_pattern TEXT NOT NULL,
  description             TEXT
);
`;

export const GOVERNANCE_SCHEMA_DOWN = `
DROP TABLE IF EXISTS ai_benchmarks;
DROP TABLE IF EXISTS ai_feature_flags;
DROP TABLE IF EXISTS ai_audit_logs;
DROP TABLE IF EXISTS ai_cost_trackings;
DROP TABLE IF EXISTS ai_responses;
DROP TABLE IF EXISTS ai_requests;
DROP TABLE IF EXISTS ai_model_providers;
DROP TABLE IF EXISTS ai_prompt_evaluations;
DROP TABLE IF EXISTS ai_prompt_versions;
DROP TABLE IF EXISTS ai_prompts;
`;
