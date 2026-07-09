// src/application/content-generation/migrations/InitializeACGPSchema.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeACGPSchema1630100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE generation_requests (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "requestedBy" varchar NOT NULL,
        "requested_at" timestamptz NOT NULL DEFAULT now(),
        "contentType" varchar NOT NULL,
        topic varchar,
        subtopic varchar,
        difficulty varchar,
        "targetGrade" integer,
        count integer,
        "learningObjective" varchar,
        "olympiadCategory" varchar,
        "requiredSkills" text[],
        "reasoningStrategy" varchar,
        "studentId" varchar,
        "weakTopics" text[],
        "recentMistakeConceptIds" text[],
        "sourceContentId" varchar,
        "variationAspects" text[],
        "topicMix" varchar,
        metadata jsonb
      );
    `);

    await queryRunner.query(`
      CREATE TABLE generated_contents (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "requestId" varchar NOT NULL,
        "contentType" varchar NOT NULL,
        body jsonb NOT NULL,
        "generationState" varchar NOT NULL DEFAULT 'PENDING',
        "validationState" varchar NOT NULL DEFAULT 'PENDING',
        "reviewState" varchar NOT NULL DEFAULT 'PENDING',
        "publicationState" varchar NOT NULL DEFAULT 'UNPUBLISHED',
        "qualityScore" double precision,
        "qualityGrade" varchar,
        "estimatedDifficulty" varchar,
        "difficultyConfidence" double precision,
        "promptVersion" varchar,
        "modelUsed" varchar,
        "tokensUsed" integer,
        "estimatedCostUsd" double precision,
        "generationTimeMs" integer,
        "regenerationCount" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "published_at" timestamptz
      );
    `);

    await queryRunner.query(`
      CREATE TABLE prompt_versions (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "templateId" varchar NOT NULL,
        version varchar NOT NULL,
        "systemTemplate" text NOT NULL,
        "userTemplate" text NOT NULL,
        variables text[] NOT NULL,
        temperature double precision NOT NULL,
        "maxTokens" integer NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updatedBy" varchar NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE validation_reports (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contentId" varchar NOT NULL,
        passed boolean NOT NULL,
        "qualityScore" double precision NOT NULL,
        "qualityGrade" varchar NOT NULL,
        issues jsonb NOT NULL,
        suggestions text[] NOT NULL,
        "difficultyLevel" varchar,
        "primaryConceptId" varchar,
        "skillIds" text[],
        "validated_at" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE review_records (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contentId" varchar NOT NULL,
        "reviewerId" varchar NOT NULL,
        decision varchar NOT NULL,
        comments text,
        "reviewed_at" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE publications (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contentId" varchar NOT NULL,
        "publishedBy" varchar NOT NULL,
        "published_at" timestamptz NOT NULL DEFAULT now(),
        "targetChannels" text[] NOT NULL,
        "externalReferenceId" varchar
      );
    `);

    await queryRunner.query(`
      CREATE TABLE content_variations (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "sourceContentId" varchar NOT NULL,
        "variationContentId" varchar NOT NULL,
        "variationType" varchar NOT NULL,
        "similarityScore" double precision NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS content_variations;');
    await queryRunner.query('DROP TABLE IF EXISTS publications;');
    await queryRunner.query('DROP TABLE IF EXISTS review_records;');
    await queryRunner.query('DROP TABLE IF EXISTS validation_reports;');
    await queryRunner.query('DROP TABLE IF EXISTS prompt_versions;');
    await queryRunner.query('DROP TABLE IF EXISTS generated_contents;');
    await queryRunner.query('DROP TABLE IF EXISTS generation_requests;');
  }
}
