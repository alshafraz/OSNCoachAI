# AI Governance & Operations Platform (AIOps)

## Architecture Overview

The **AI Governance & Operations Platform (AIOps)** acts as the centralized gateway for all AI services across the MathOSN Coach application. Every LLM request must flow through this platform.

### Core Architecture Principles
1. **Gatekeeper Pattern**: No subsystem communicates directly with raw LLM client APIs. All execution requests route through `GovernanceOrchestrator`.
2. **Prompts Versioning**: Prompts are independent assets managed in an in-memory `PromptRegistry`. Every prompt has semantic version numbers and description tags.
3. **Safety & Validation**: Standard guardrail modules scan inputs (protecting against injections) and validate outputs (schema verification and math sanity checks).
4. **Resiliency / Failbacks**: Model requests support secondary backups and mock fallbacks automatically in case of API outages.

---

## The 13-Stage Governance Pipeline

```
Inbound request (variables, studentId, engine)
   │
   ▼
[Stage 1] SafetyGuardrailService.validateInput()
          → Reject request if injection patterns match
   │
   ▼
[Stage 2] FeatureFlagService.evaluateFlag()
          → Canary check to swap/route target prompt version
   │
   ▼
[Stage 3] PromptRegistry.render()
          → Render variables into Prompt template
   │
   ▼
[Stage 4] ModelRouter.route()
          → Match capabilities, costs, and availability
   │
   ▼
[Stage 5] ProviderGateway.execute()
          → Unified API call (OpenAI, Anthropic, Gemini, Azure, Local)
   │
   ▼
[Stage 6] ValidationService.validate()
          → Parse JSON schema correctness & math validations
   │
   ▼
[Stage 7] SafetyGuardrailService.validateOutput()
          → Check for prompt leakages or unsafe keywords
   │
   ▼
[Stage 8] EvaluationService.evaluate()
          → Assess correctness and pedagogical quality
   │
   ▼
[Stage 9] CostService.trackCost()
          → Calculate request billing and student billing metrics
   │
   ▼
[Stage 10] AuditService.log()
           → Persist AuditLog entries
   │
   ▼
[Stage 11] Latency/observability instrumentation
   │
   ▼
[Stage 12] Resiliency Fallback Routing (circuit breaker triggers)
   │
   ▼
[Stage 13] Response output returned to client
```

---

## Model Fallbacks

Each preferred model has a prioritized fallback list in `governanceConfig.ts`:
- **gpt-4o** → Anthropic Sonnet → Azure OpenAI → Llama 3 → Mock emergency client.
- **gpt-4o-mini** → Gemini 1.5 Pro → Llama 3 → Mock emergency client.

---

## DB Tables Schema

| Table | Purpose |
|---|---|
| `ai_prompts` | Prompt registry base configuration. |
| `ai_prompt_versions` | Specific system/user templates matching semver. |
| `ai_prompt_evaluations` | Benchmark results cache. |
| `ai_model_providers` | Latency, cost, and availability of LLM APIs. |
| `ai_requests` | Request payload logs. |
| `ai_responses` | Outcome logs. |
| `ai_cost_trackings` | Running billing aggregates. |
| `ai_audit_logs` | Comprehensive logs for dashboards. |
| `ai_feature_flags` | Rollout and canary splits settings. |
| `ai_benchmarks` | Test reference datasets. |

---

## API Contracts

- **GET `/governance/logs`**: Retrieve recent request execution history.
- **GET `/governance/stats`**: Aggregate cost tracking analytics.
- **POST `/governance/prompts/:id/version`**: Add a draft version template.
- **POST `/governance/prompts/:id/promote`**: Mark template version as active production version.
- **POST `/governance/prompts/:id/rollback`**: Rollback active version.
- **POST `/governance/flags`**: Update canary weights/activation states.
- **POST `/governance/benchmarks/run`**: Execute prompt suite against regression tests.
