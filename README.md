# a360nis360

Production-ready backend foundation for an India-first, globally extensible accounting and compliance platform.

## What is included

- **Modular monolith backend** in Node.js + Express
- **PostgreSQL + Prisma** data model covering accounting, GST, E-Way Bill, TDS, payroll, inventory, audit, and reporting support
- **Kafka integration** for webhook/event pipeline
- **Redis integration** for fast webhook queue buffering
- **REST APIs** for health, entities, and webhook ingestion
- **Docker support** (single-service Dockerfile + local multi-service docker-compose)
- **Kubernetes manifests** for app deployment basics
- **Postman collection** for quick API testing

## Project structure

- `src/` — API and module code
- `prisma/schema.prisma` — relational schema
- `docker-compose.yml` — local stack (app + postgres + redis + kafka)
- `k8s/` — deployment manifests
- `postman/a360nis360.postman_collection.json` — API collection
- `docs/executive-brief.md` — high-level product strategy brief

## Quick start

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start infrastructure (optional if using existing services):

   ```bash
   docker compose up -d postgres redis zookeeper kafka
   ```

4. Generate Prisma client and apply schema:

   ```bash
   npm run prisma:generate
   npx prisma db push
   ```

5. Run the API:

   ```bash
   npm run dev
   ```

## API endpoints

- `GET /health`
- `POST /api/v1/entities`
- `GET /api/v1/entities`
- `POST /api/v1/webhooks/ingest`

## Notes

- Kafka and Redis are optional at runtime; API still starts if either dependency is unavailable.
- Schema is designed to evolve into separated services without breaking the modular-monolith approach.
