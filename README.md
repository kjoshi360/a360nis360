# a360nis360

Production-ready modular-monolith platform for India-first and global-ready accounting + compliance.

## What is included

- **Backend API (Node.js + Express)**
- **Frontend control center** for all current backend features
- **PostgreSQL + Prisma** enterprise schema (accounting, GST, E-Way, TDS, payroll, inventory, audit)
- **Kafka** producer integration for webhook eventing
- **Redis** integration for webhook buffering
- **Docker + Docker Compose** for local runtime
- **Kubernetes manifests** for deployment baseline
- **Postman collection** for API testing

## Feature coverage

### Frontend (`/`)

- API health check UI (`GET /health`)
- Entity create form (`POST /api/v1/entities`)
- Entity list viewer (`GET /api/v1/entities`)
- Webhook ingest form (`POST /api/v1/webhooks/ingest`)

### Backend

- Health endpoint with DB/Redis status
- Modular routes (`entities`, `webhooks`)
- Kafka + Redis adapters with graceful fallback

## Project structure

- `public/` — frontend UI files (`index.html`, `styles.css`, `app.js`)
- `src/` — backend app and modules
- `prisma/schema.prisma` — PostgreSQL schema model
- `docker-compose.yml` — local multi-service setup
- `k8s/` — K8s manifests
- `postman/a360nis360.postman_collection.json` — API requests

## Quick start

```bash
cp .env.example .env
npm install
docker compose up -d postgres redis zookeeper kafka
npm run prisma:generate
npx prisma db push
npm run dev
```

Open: `http://localhost:3000`
