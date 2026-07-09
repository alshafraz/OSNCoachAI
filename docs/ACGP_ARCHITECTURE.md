# AI Content Generation Platform (ACGP) Architecture Guide

## 1. Platform Architecture

The AI Content Generation Platform (ACGP) is a centralized, enterprise-grade content generation system for the MathOSN Coach application. It serves as the primary factory for creating, modifying, calibrating, and publishing Olympiad-style math materials (questions, hints, worked explanations, concept summaries, and practice sets).

```
[Generation Request]
        │
        ▼
[ContextBuilder] ◄───► [MIL (Math Intelligence Layer)]
        │        ◄───► [LIP (Learning Intelligence Platform)]
        ▼
[PromptBuilder]  ◄───► [PromptRegistry]
        │
        ▼
[LLM Provider] (OpenAI / Mock)
        │
        ▼
[ValidationService] ◄───► [CIP (Content Intelligence Platform)]
        │           ◄───► [Duplicate Detector]
        ▼
[Human Review Workflow] (Configurable)
        │
        ▼
[PublicationService] ◄───► [Prisma Question Database]
```

---

## 2. Generation Pipeline

To ensure absolute mathematical accuracy, alignment with curriculum standards, and avoidance of near-duplicates, every piece of content undergoes a strictly sequential pipeline:

1. **Request Submission:** Generation criteria specified (topic, difficulty, grade, objective, required skills).
2. **Context Aggregation:** 
   - MIL lookup gathers relevant formulas, strategies, and misconceptions.
   - Knowledge Graph lookup finds prerequisite links.
   - LIP lookup obtains student-specific weak areas for personalized runs.
3. **Prompt Composition:** PromptBuilder renders the targeted template.
4. **LLM Generation:** OpenAiLlmProvider calls LLM to output a JSON payload.
5. **Calibrator Inspection:** DifficultyCalibrator evaluates and registers estimated difficulty, solve time, and prerequisites.
6. **Validation Pipeline:** ContentValidatorImpl checks syntax, question format consistency, and presence of answers. Jaccard token analysis detects duplicates.
7. **Regeneration Retry:** Fails validation? Re-runs up to 3 times automatically.
8. **Human Review:** Staged for approval or immediate publish based on config.
9. **Publication:** Persists content to the production database via Prisma.

---

## 3. Prompt Architecture

Prompts are managed using the central `PromptRegistry` with strict versioning (e.g. `v1`).
Key template identifiers are:
- `question-generate`: Produces questions with distinct format tags (e.g. MCQ choices array, correct answer).
- `explanation-generate`: Employs step-by-step reasoning strategies and alternative solutions.
- `hint-generate`: Structures exactly 5 progressive hint levels.
- `concept-generate`: Constructs concept definitions, everyday applications, and analogies.
- `variation-generate`: Re-evaluates numeric parameters, story scenarios, or difficulty scales.

---

## 4. Question Generation Framework

Supported question formats:
- **Multiple Choice Questions (MCQ):** Renders between 2 and 5 choices, ensuring one option exactly matches the designated correct answer.
- **Short Answer & Fill in the Blank:** Accepts exact numeric or algebraic matches.
- **Challenge / Olympiad questions:** Focuses heavily on deep reasoning steps and algebraic simplification.

---

## 5. Explanation Generation Framework

Explanations are generated as a structured JSON object containing:
1. **Problem Understanding:** Outlines known and unknown data points.
2. **Strategy Selection:** Rationale for choosing the primary solving method.
3. **Step-by-Step Solution:** Fenced, numbered steps with LaTeX equations.
4. **Alternative Method:** Secondary solving strategy (e.g., visual or fast methods) and when to use it.
5. **Key Takeaways & Common Mistakes:** Highlighting pitfalls from the misconception database.

---

## 6. Hint Generation Framework

Hints are progressive, ensuring students receive just enough guidance to resolve obstacles without spoiling the final answer:
1. **Level 1 (Observation):** Basic observation about the question setup.
2. **Level 2 (Relevant Concept):** General mathematical concept involved.
3. **Level 3 (Formula Reminder):** Specific formula or identity.
4. **Level 4 (Partial Reasoning):** Guide for the first half of calculation.
5. **Level 5 (Nearly Complete):** A hint revealing almost the entire solution direction.

---

## 7. Difficulty Calibration Strategy

Estimated difficulties are verified dynamically by mapping:
- **Step count weight:** More steps = higher score.
- **Concept complexity index:** Weighted based on topic complexity.
- **Cognitive tricks:** Flagged if requiring an Olympiad-specific trick.
- **Solve time estimate:** Computed as: `seconds = stepCount * 60 + readingComplexity * 10`.

---

## 8. Validation Framework

Content is validated using CIP (Content Intelligence Platform) rules:
- Question text must exceed 10 characters.
- MCQ formats must have valid choices.
- Correct answers must be present.
- Quality score must meet a configurable threshold (e.g. >= 60).
- Jaccard similarity must remain below 85% to block duplicates.

---

## 9. Human Review Workflow

The human review stage keeps content in a configurable workflow:
- `PENDING` -> `UNDER_REVIEW` -> `APPROVED` | `REJECTED` | `REGENERATION_REQUESTED`.
All reviewer actions, comments, and decision histories are persisted in `review_records` for audits.

---

## 10. Database Schema

Tables created under TypeORM:
- `generation_requests`: Stores specifications of the request.
- `generated_contents`: Tracks payloads, state machine flags, metrics, and cost.
- `prompt_versions`: Saves system prompts and configurations.
- `validation_reports`: Validation issues, suggestions, and grade score.
- `review_records`: Decision log for audit.
- `publications`: Published content metadata and channels.
- `content_variations`: Maps source-to-variation links and similarity scores.

---

## 11. API Contracts

### Ingest & Generate Content
`POST /content/generate`
```json
{
  "requestedBy": "teacher-1",
  "contentType": "SHORT_ANSWER",
  "topic": "primes",
  "difficulty": "MEDIUM",
  "targetGrade": 5,
  "count": 1,
  "learningObjective": "Master prime factorization"
}
```
*Response: 201 Created containing full `GeneratedContent` payload with validation and calibration details.*

### Human Review Decision
`POST /content/review`
```json
{
  "contentId": "uuid-here",
  "reviewerId": "admin-1",
  "decision": "APPROVED",
  "comments": "Mathematically sound and age-appropriate."
}
```

### Publish Content
`POST /content/publish`
```json
{
  "contentId": "uuid-here",
  "publishedBy": "admin-1"
}
```

---

## 12. State Management Design

The content lifecycle transitions strictly across independent state machines:

```
[Generation State]  PENDING ──► GENERATING ──► GENERATED | FAILED
                          │
                          ▼
[Validation State]  PENDING ──► VALIDATING ──► PASSED | FAILED
                          │
                          ▼
[Review State]      PENDING ──► UNDER_REVIEW ──► APPROVED | REJECTED
                          │
                          ▼
[Publication State] UNPUBLISHED ──► PUBLISHED ──► ARCHIVED
```

---

## 13. Folder Structure

```
src/application/content-generation/
├── config/           # acgpConfig.ts
├── domain/           # Models
├── engine/           # ContentGenerationOrchestrator.ts
├── services/         # Services & Content Generators
├── infrastructure/   # TypeORM Entities & Repositories
├── api/              # API Controller routes
└── migrations/       # SQL Schemas
```

---

## 14. Testing Strategy

1. **Prompt Tests:** Ensures variables are substituted correctly.
2. **Calibration Tests:** Validates that difficulty levels reflect steps and concept complexity.
3. **Duplicate Tests:** Checks that duplicate questions are successfully rejected.
4. **Integration Pipeline Tests:** Runs the orchestrator from request to validation state against mock providers.

---

## 15. Operational Guide

- Run migrations: `npx typeorm migration:run -d src/infrastructure/db/dataSource.ts`
- Toggle review requirement in `.env`: `ACGP_REQUIRE_REVIEW=true`
- Retrieve daily token costs: `GET /content/metrics`

---

## 16. Future Enhancement Roadmap

1. **Geometry Description to SVG:** Integrate visual rendering modules.
2. **Multi-Model Fallbacks:** Route to local LLMs if OpenAI quota is exceeded.
3. **Automatic Reinforcement:** Feed human edit comments back into prompts.
