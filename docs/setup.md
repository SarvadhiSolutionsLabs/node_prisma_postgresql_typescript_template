### Setup Guide

This document explains how to set up and run the Node.js/TypeScript/Express/Prisma backend skeleton.

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn (examples use npm)
- PostgreSQL instance (local Docker or managed)
- Git (recommended to use Husky hooks)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

- Copy `.env.example` to base `.env`:

```bash
cp .env.example .env
```

- For each environment flavor, create a specific file as needed:
  - `.env.local`
  - `.env.dev`
  - `.env.staging`
  - `.env.production`

The config loader:

- Always loads `.env` from the project root.
- Then loads `.env.<APP_ENV>` (if present) and overlays values.

Required variables (see `.env.example`):

- `NODE_ENV` – `development` | `test` | `production`
- `APP_ENV` – `local` | `dev` | `staging` | `production`
- `PORT` – HTTP port (default: `3000`)
- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – secret used for signing JWTs
- `LOG_LEVEL` – winston log level (e.g. `info`, `debug`, `error`)
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` – rate limiting configuration

### 3. Initialize Prisma

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run migrations (for local/dev):

```bash
npm run prisma:migrate
```

Seed the database (creates a default admin user):

```bash
npm run prisma:seed
```

### 4. Husky pre-commit hooks

If the project is inside a git repository, initialize Husky:

```bash
npm run prepare
```

This will install Husky hooks, and `.husky/pre-commit` will run `lint-staged` for staged files.

### 5. Running the app

#### Development

```bash
npm run dev
```

This starts the server with hot reload using `tsx`.

#### Build

Non-interactive flavor-specific builds:

```bash
npm run build:local
npm run build:dev
npm run build:staging
npm run build:prod
```

Each script sets `APP_ENV` and `NODE_ENV` before running `npm run build`.

#### Interactive build (recommended for releases)

```bash
npm run build:interactive
```

This script will:

- Ask which **branch** you are building for.
- Ask which **environment flavor** (`local` / `dev` / `staging` / `production`).
- Ask for a short **build message/label** (for example `production`, `local test build`).
- Run the TypeScript build with the selected env.
- Write `dist/build-info.json` containing:
  - `branch`
  - `flavor`
  - `nodeEnv`
  - `buildMessage`
  - `buildTime`
  - `commitHash` (if available)

### 6. Verifying health

Once running (via `dev` or `start` in production), check:

```bash
curl http://localhost:3000/api/v1/health
```

You should receive a JSON response with status `ok`, uptime, and timestamp.

