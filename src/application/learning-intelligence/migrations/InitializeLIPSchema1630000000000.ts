// src/application/learning-intelligence/migrations/InitializeLIPSchema.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates all tables required by the Learning Intelligence Platform.
 * This is a simple migration – in a real project you would split into multiple files.
 */
export class InitializeLIPSchema1630000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE learning_events (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studentId" varchar NOT NULL,
        "eventType" varchar NOT NULL,
        payload jsonb NOT NULL,
        "event_timestamp" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE metric_snapshots (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studentId" varchar NOT NULL,
        "metricName" varchar NOT NULL,
        value double precision NOT NULL,
        definition text NOT NULL,
        formula text NOT NULL,
        "dataSources" text[],
        version varchar NOT NULL,
        confidence double precision NOT NULL,
        "computed_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE topic_analytics (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "topicId" varchar NOT NULL,
        "studentId" varchar NOT NULL,
        accuracy double precision NOT NULL,
        "solveTime" double precision NOT NULL,
        confidence double precision NOT NULL,
        "difficultyTrend" double precision NOT NULL,
        retention double precision NOT NULL,
        mastery double precision NOT NULL,
        "learningVelocity" double precision NOT NULL,
        "questionVolume" integer NOT NULL,
        "improvementTrend" double precision NOT NULL,
        "weaknessScore" double precision NOT NULL,
        "last_updated" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE concept_analytics (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "conceptId" varchar NOT NULL,
        "studentId" varchar NOT NULL,
        mastery double precision NOT NULL,
        "dependencyCoverage" double precision NOT NULL,
        "misconceptionFrequency" double precision NOT NULL,
        retention double precision NOT NULL,
        "questionExposure" double precision NOT NULL,
        "historicalProgress" double precision NOT NULL,
        "last_updated" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE skill_analytics (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "skillName" varchar NOT NULL,
        "studentId" varchar NOT NULL,
        mastery double precision NOT NULL,
        "last_updated" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE retention_analytics (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studentId" varchar NOT NULL,
        "retentionScore" double precision NOT NULL,
        "decayFactor" double precision NOT NULL,
        "daysSinceLastPractice" integer NOT NULL,
        "computed_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE insights (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studentId" varchar NOT NULL,
        type varchar NOT NULL,
        payload jsonb NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE analytics_job_log (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "start_time" timestamptz NOT NULL DEFAULT now(),
        "end_time" timestamptz NOT NULL DEFAULT now(),
        "processedEvents" integer NOT NULL,
        status varchar NOT NULL,
        "errorMessage" text
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS analytics_job_log;');
    await queryRunner.query('DROP TABLE IF EXISTS insights;');
    await queryRunner.query('DROP TABLE IF EXISTS retention_analytics;');
    await queryRunner.query('DROP TABLE IF EXISTS skill_analytics;');
    await queryRunner.query('DROP TABLE IF EXISTS concept_analytics;');
    await queryRunner.query('DROP TABLE IF EXISTS topic_analytics;');
    await queryRunner.query('DROP TABLE IF EXISTS metric_snapshots;');
    await queryRunner.query('DROP TABLE IF EXISTS learning_events;');
  }
}
