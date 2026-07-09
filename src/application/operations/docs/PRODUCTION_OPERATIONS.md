# Production Platform, Deployment & Operations Guide

## Production Architecture & Topology

The **MathOSN Coach Production Platform** is built to operate inside a multi-container isolated cloud topology.

```
       [Users]
          │ (HTTPS)
          ▼
    [Cloudflare CDN]
          │ (Cache / Edge WAF)
          ▼
 [Application Load Balancer]
      (SSL Termination)
    ┌─────┴─────┐
    ▼           ▼
[App Node 1] [App Node 2]  <── Canary / Blue-Green releases
    │           │
    ├───────────┼───────────┐
    ▼           ▼           ▼
[PostgreSQL] [Redis Cache] [S3 Bucket]
 (Relational) (Rate limit)  (Worksheets)
```

---

## Container Architecture (`Dockerfile` & `docker-compose.yml`)

The application is containerized using a multi-stage **Docker** build:
1. **Deps Stage (`deps`)**: Installs production dependency modules.
2. **Builder Stage (`builder`)**: Builds the optimized Next.js static bundle and compiles source targets.
3. **Runner Stage (`runner`)**: Configures standard Alpine execution environments under non-root users (`nextjs`).

Continuous local simulation can be booted with `docker-compose up` orchestrating:
- `app`: MathOSN Coach NextJS container (exposed on port `3000`).
- `db`: PostgreSQL 15 persistent relational storage (exposed on port `5432`).
- `cache`: Redis 7 rate-limiting and query cache (exposed on port `6379`).

---

## CI/CD Pipeline Design

Automated continuous integration is handled by Github Actions (`.github/workflows/ci-cd.yml`):
1. **Build Gate**: Runs syntax lint checks, static analysis (`tsc --noEmit`), and tests.
2. **AI Verification**: Triggers agent benchmark validation checks to guarantee prompt registry regressions do not get deployed.
3. **Image Build & Security**: Creates Docker images and scans them for vulnerabilities using Trivy.
4. **Deploy**: Triggers Blue-Green deployments with rolling target routing to prevent downtime.

---

## Database Operations, Backups, and DR Plan

### Backup Strategy
1. **Interval**: DB backups run every 12 hours.
2. **Storage**: Export files are compressed using gzip and stored in secure S3 buckets with checksum validation.
3. **Retention**: 14 days retention. Older dumps are automatically purged.

### Restoration Steps (Runbook)
1. Retrieve backup ID using `GET /operations/backups`.
2. Block write operations via `POST /operations/maintenance` (locked = true).
3. Execute restore operation via `POST /operations/backups/:id/restore`.
4. Validate health probe `GET /operations/health` (verify database.connected = true).
5. Open database locks via `POST /operations/maintenance` (locked = false).

---

## Monitoring, Metrics, and Alert thresholds

Proactive metric collection tracks parameters:
- CPU load > 85%: Fired warning to ops channels.
- Memory used > 90%: Fired CRITICAL alert.
- Response Latency > 2500ms: Fired latency warning to alerts gateway.
- DB Connection Pool saturation: Checked pool counts.

---

## Security Framework

All traffic is secured via standard operational guardrails:
- **Rate Limiting**: Configured at 100 requests per minute per IP.
- **CSRF / CORS**: Hardened origins targeting whitelisted domains.
- **Security Headers**: Standard CSP, HSTS, and FrameOptions headers enabled.

---

## Production Readiness Checklist

1. [ ] Secrets verified and moved to production variables (no mock keys).
2. [ ] S3 bucket lifecycle rule configured for 14 days database backups deletion.
3. [ ] DNS records mapped to Cloudflare proxy.
4. [ ] Slack Alerting Webhook url set in operational config.
5. [ ] Blue-green deployment groups whitelisted in target VPC.

---

## Future Cloud & Multi-Region Roadmap

- **AWS EKS Integration**: Move from Compose/single-node to Kubernetes orchestration.
- **Cross-Region Read Replicas**: Deploy replica databases globally to optimize analytics processing speeds.
- **Redis Cluster Clustering**: Distribute caching across multiple nodes.
