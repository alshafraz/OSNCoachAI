// src/application/operations/migrations/InitializeOperationsSchema1630400000000.ts

/**
 * InitializeOperationsSchema
 *
 * Migration to establish schemas for production platform operations database entities.
 *
 * Tables:
 *   - ops_deployment_history
 *   - ops_backup_history
 *   - ops_system_events
 */

export const OPERATIONS_SCHEMA_UP = `
-- ops_deployment_history: Releases registry tracking
CREATE TABLE IF NOT EXISTS ops_deployment_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version        VARCHAR(50) NOT NULL,
  commit_hash    VARCHAR(100) NOT NULL,
  environment    VARCHAR(50) NOT NULL DEFAULT 'production',
  deployed_by    VARCHAR(255) NOT NULL,
  status         VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
  deployed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,
  release_notes  TEXT
);
CREATE INDEX idx_ops_deployments_date ON ops_deployment_history (deployed_at DESC);

-- ops_backup_history: Database snapshots log
CREATE TABLE IF NOT EXISTS ops_backup_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name    VARCHAR(255) NOT NULL UNIQUE,
  size_bytes     BIGINT NOT NULL,
  checksum       VARCHAR(255) NOT NULL,
  storage_path   VARCHAR(512) NOT NULL,
  status         VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  error_message  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_ops_backups_date ON ops_backup_history (created_at DESC);

-- ops_system_events: Operations logs audit trail
CREATE TABLE IF NOT EXISTS ops_system_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type     VARCHAR(100) NOT NULL,
  severity       VARCHAR(50) NOT NULL DEFAULT 'INFO',
  actor          VARCHAR(255) NOT NULL,
  description    TEXT NOT NULL,
  metadata       JSONB DEFAULT '{}',
  ip_address     VARCHAR(50),
  timestamp      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ops_events_timestamp ON ops_system_events (timestamp DESC);
CREATE INDEX idx_ops_events_type_severity ON ops_system_events (event_type, severity);
`;

export const OPERATIONS_SCHEMA_DOWN = `
DROP TABLE IF EXISTS ops_system_events;
DROP TABLE IF EXISTS ops_backup_history;
DROP TABLE IF EXISTS ops_deployment_history;
`;
