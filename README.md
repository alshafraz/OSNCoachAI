# MathOSN Coach - Architecture & Foundation

MathOSN Coach is an AI-powered Mathematics Olympiad Coach for Elementary School students. It is designed to act as a personal Socratic math mentor rather than a traditional quiz platform, promoting mathematical curiosity and gamified discovery.

## Clean Architecture Structure

To ensure long-term maintainability, scalability, and clean testing boundaries, the project strictly adheres to **Clean Architecture** principles. Dependencies flow inwards:

```mermaid
graph TD
    Presentation[Presentation Layer: Pages, Actions, React UI] --> Application[Application Layer: Use Cases, DTOs]
    Application --> Domain[Domain Layer: Entities, Repository & Service Interfaces]
    Infrastructure[Infrastructure Layer: Prisma, OpenAI, Supabase] --> Domain
    Infrastructure --> Application
```

### 1. Domain Layer (`src/domain/`)
The enterprise and business logic core. It has **zero dependencies** on external frameworks, databases, or libraries.
- **Entities (`entities/`)**: Pure business models (`User`, `StudentProfile`, `Question`, `Attempt`).
- **Repositories (`repositories/`)**: Abstract interfaces describing data persistence signatures.
- **Services (`services/`)**: Abstractions for external services (`AiCoachService`, `StorageService`, `OcrService`).

### 2. Application Layer (`src/application/`)
Orchestrates application use cases, defining the user stories and actions that drive user interactions.
- **Use Cases (`use-cases/`)**: Class-based interactors coordinating data flow between repositories and entities (e.g., `SubmitAnswerUseCase`).
- **DTOs (`dtos/`)**: Consistent data exchange signatures, including `ApiResponse` formats.

### 3. Infrastructure Layer (`src/infrastructure/`)
The adapter layer connecting core business logic to external databases, framework routes, and third-party APIs.
- **Database Client (`db/prisma.ts`)**: Prisma ORM connection config.
- **Repositories (`repositories/`)**: Concrete implementations of domain repositories using Prisma (e.g., `PrismaUserRepository`).
- **Services (`services/`)**: Implementations of external engines (e.g., Socratic prompts in `OpenAiCoachService` and upload logic in `SupabaseStorageService`).
- **DI Container (`config/container.ts`)**: The dependency injection container wiring concrete repositories and services into the use cases.

### 4. Presentation Layer (`src/presentation/` & `src/app/`)
The Next.js framework layer delivering layouts, client pages, state hooks, and action handlers.
- **App Router (`src/app/`)**: Standard App Router directory containing layout templates, page views, error boundaries, and loading screens.
- **Actions (`actions/`)**: Next.js Server Actions acting as controllers that call application Use Cases.
- **Components (`components/`)**: Shared, student-specific, and parent-specific components styled with shadcn/ui.

---

## Design System

We employ modern web aesthetics with a playful, kid-friendly look (inspired by Duolingo & Khan Academy):
- **Typography**: `Outfit` Google Font (headings) and `Inter` (body) loaded natively with Next.js font optimization.
- **Color System**: Custom Tailwind CSS v4 variables configured in `globals.css` with dark mode support.
  - **Indigo**: Brand accent and primary workspace colors.
  - **Amber**: Streak multipliers and Socratic tips.
  - **Emerald**: Successful answers and point rewards.
- **Theme Provider**: Next-themes integration enabling smooth transition between light and dark modes.

---

## Getting Started

### 1. Prerequisites
- **Node.js** v18+
- **PostgreSQL** instance

### 2. Environment Variables (`.env`)
Create a `.env` file at the root:
```env
# PostgreSQL connection URL
DATABASE_URL="postgresql://username:password@localhost:5432/mathosn"

# Auth.js secret key
NEXTAUTH_SECRET="your-32-character-secret-key-goes-here"

# OpenAI API Key (For Socratic Tutor hint completions)
OPENAI_API_KEY="your-openai-api-key"

# Supabase Storage Credentials (Optional - fallbacks to local storage if empty)
SUPABASE_URL="your-supabase-project-url"
SUPABASE_KEY="your-supabase-anon-key"
```

### 3. Setup Commands
```bash
# Install dependencies
npm install

# Initialize database schema
npx prisma db push

# Launch local development server
npm run dev
```

---

## Core Features Implemented in Milestone 1

1. **Authentication**: Auth.js setup supporting Parent and Student login profiles.
2. **Dashboard Shells**: Complete parent and student dashboard layouts with streak trackers and progressive roadmap indicators.
3. **Socratic AI Tutor**: Socratic dialogue bubbles and dynamic hints generated via `OpenAiCoachService` on incorrect answers.
4. **Local Fallback Systems**: Automatically saves OCR attachments and continues mock tutoring sessions locally if external Supabase or OpenAI credentials are not provided.
5. **Quality & Resilience**: Custom loading states and error boundaries at every page level to safeguard user experience.

---

## Learning Intelligence Platform (LIP) – Milestone 10

The LIP is a **passive analytics engine** that observes learning sessions, computes metrics, detects patterns, generates insights, and exposes them via a REST API. It **never** makes learning decisions.

### Pipeline (read-only, strictly sequential)

```
Learning Events → Aggregation → Metrics → Pattern Detection → Insight → Evidence Store → API Exposure → Visualization
```

### LIP Quick Start

```bash
# Run LIP database migrations (requires TypeORM data-source configured)
npx typeorm migration:run -d src/infrastructure/db/dataSource.ts

# Ingest a sample event (POST)
curl -X POST http://localhost:3000/analytics/events \
  -H "Content-Type: application/json" \
  -d '{"id":"ev-001","studentId":"stu-1","eventType":"questionAnswered","payload":{"correct":true,"durationSeconds":45},"timestamp":"2026-01-01T12:00:00Z"}'

# Retrieve insights for a student (GET)
curl http://localhost:3000/analytics/insights/stu-1

# View Prometheus metrics
curl http://localhost:3000/metrics
```

### Architecture Reference

See [`docs/LIP_ARCHITECTURE.md`](./docs/LIP_ARCHITECTURE.md) for the full pipeline diagram, component table, DB schema, and integration points.
