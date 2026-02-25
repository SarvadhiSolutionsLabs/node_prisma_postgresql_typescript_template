### Node/TypeScript/Prisma Backend Skeleton

This repository provides a reusable, production-ready backend skeleton for Node.js services using **TypeScript**, **Express**, **Prisma**, and **PostgreSQL**, aligned with the patterns used in `clario-backend`.

It is designed for **enterprise** and **microservice** architectures with a strong focus on:

- **Performance** – raw SQL via Prisma for reads, pagination, and efficient queries.
- **Quality** – strict TypeScript, ESLint, Prettier, Husky pre-commit.
- **Accuracy** – standardized responses, error handling, and validation.
- **Timely delivery** – clear structure and conventions for quickly bootstrapping new services.

---

### Tech stack

- Node.js 18+
- TypeScript
- Express
- Prisma ORM (PostgreSQL)
- Winston logging
- JWT-based authentication scaffold
- Zod for validation

---

### Architecture overview

- **Controller → Service → Repository pattern**:
  - **Controllers**: HTTP-only logic – use `validateRequest` + `zod` schemas, call services, and send responses via `handleApiResponse`.
  - **Services**: Domain and business logic – use repositories, enforce rules, and throw `AppError` on expected failures.
  - **Repositories**: Database access using Prisma – **all reads via raw SQL** for performance.
- **Shared core**:
  - `src/config` – environment loading and validation.
  - `src/constant` – `ERROR_TYPES`, `RES_TYPES`, `RES_STATUS`, `END_POINTS`.
  - `src/utils` – `AppError`, response helpers, JWT wrapper.
  - `src/logger` – Winston logger configuration.
  - `src/middleware` – error handler, validation, security (Helmet/CORS/rate limit), request logging, auth.
  - `src/routes` – central HTTP routing.

See `RULES.md` and `docs/development-guidelines.md` for detailed rules and patterns.

---

### Project structure (high level)

- `src/`
  - `index.ts` – application entrypoint (HTTP server + Prisma connection).
  - `app.ts` – Express app creation, core middlewares, and route mounting.
  - `config/` – env loader with Zod validation.
  - `constant/` – shared messages, error types, endpoints.
  - `logger/` – Winston logger.
  - `middleware/` – error, validation, auth, security, response logging.
  - `routes/` – main router and health route.
  - `modules/`
    - `user/` – full CRUD example with raw read queries and RBAC.
    - `auth/` – scaffolded auth routes/controllers for future implementation.
  - `utils/` – `AppError`, response helpers, JWT utilities.
  - `types/` – Express request augmentation for `req.user`.
- `prisma/`
  - `schema.prisma` – database schema with `User` model and `UserRole` enum.
  - `seed.ts` – seed script creating an admin user.
- `scripts/`
  - `build-interactive.ts` – interactive build script (branch + env + message).
- `docs/`
  - `setup.md` – environment, Prisma, and runtime setup steps.
  - `development-guidelines.md` – architecture and coding conventions.
- `RULES.md` – engineering and architectural rules for this skeleton.
- `.cursor/rules/backend-skeleton.rules.md` – machine-readable rules for Cursor.

---

### Getting started

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure env files

Copy `.env.example` to `.env` and adjust values. For each environment flavor, optionally create:

- `.env.local`
- `.env.dev`
- `.env.staging`
- `.env.production`

The config loader uses:

- Base `.env`
- Overlay `.env.<APP_ENV>` according to `APP_ENV` (`local`/`dev`/`staging`/`production`).

#### 3. Setup database & Prisma

See `docs/setup.md` for full details, but the typical flow is:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

#### 4. Run in development

```bash
npm run dev
```

The API will start on `PORT` (default `3000`). Check health:

```bash
curl http://localhost:3000/api/v1/health
```

---

### Scripts

- **Development**
  - `dev` – start dev server with hot reload.
- **Build**
  - `build` – compile TypeScript to `dist`.
  - `build:local` / `build:dev` / `build:staging` / `build:prod` – flavor-specific builds using `APP_ENV`.
  - `build:interactive` – interactive script asking for branch, env, and message; writes `dist/build-info.json`.
- **Runtime**
  - `start` – run compiled app from `dist`.
- **Prisma**
  - `prisma:generate` – generate Prisma client.
  - `prisma:migrate` – run migrations in dev.
  - `prisma:deploy` – apply migrations in production.
  - `prisma:seed` – seed DB using `prisma/seed.ts`.
- **Quality**
  - `lint` / `lint:fix` – run ESLint.
  - `format` – run Prettier.
  - `prepare` – install Husky (for git hooks).

---

### User module example

The `user` module demonstrates the recommended pattern:

- `user.types.ts` – DTOs and `zod` schemas.
- `user.repository.ts` – Prisma-based persistence with **raw read queries** (`$queryRaw`).
- `user.service.ts` – business logic, uniqueness checks, hashing passwords with `bcryptjs`.
- `user.controller.ts` – Express handlers that call services and standardize responses.
- `user.routes.ts` – routes with `validateRequest`, `authenticate`, and role-based authorization.

Mounted under:

- `GET    /api/v1/users`
- `GET    /api/v1/users/:id`
- `POST   /api/v1/users`
- `PUT    /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

All list/detail reads use **Prisma raw SQL** to satisfy the performance rule.

---

### Extending the skeleton

When adding new modules or services:

- Follow the same folder layout and patterns as the `user` module.
- Use **raw SQL reads** in repositories via `prisma.$queryRaw`.
- Use `zod` + `validateRequest` for all inputs.
- Use `AppError` and constants from `src/constant` for error handling.
- Keep build and environment behavior consistent with `RULES.md`.

See `docs/development-guidelines.md` for a detailed walkthrough.

