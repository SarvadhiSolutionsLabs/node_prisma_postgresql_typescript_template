### Backend Skeleton Engineering Rules

This project is a reusable Node.js/TypeScript/Express/Prisma backend skeleton. All new services based on this skeleton must follow these rules.

### Architecture

- **Layered design**: Follow **Controller → Service → Repository**.
  - **Controllers**: HTTP only – parse/validate requests, call services, map responses via `handleApiResponse`.
  - **Services**: Business rules, orchestration, error decisions (`AppError`).
  - **Repositories**: Data access only (Prisma).
- **Shared core**:
  - Use `AppError` + `ErrorHandler` for all error handling.
  - Use `handleApiResponse` / `handleErrorResponse` for all API responses.
  - Use constants from `src/constant` (`ERROR_TYPES`, `RES_TYPES`, `RES_STATUS`, `END_POINTS`).

### Data access (Prisma, performance)

- **Reads must use raw SQL**:
  - For all **data retrieval**, use **Prisma raw queries**: `prisma.$queryRaw` with parameterized templates.
  - Do **not** use `findMany` / `findUnique` / `findFirst` / etc. for reads unless there is a strong reason and it is documented.
  - Prefer **single, well-structured SQL** over multiple round-trips to avoid N+1 queries.
  - Always use **pagination** for list endpoints and select only required columns.
- **Writes**:
  - `create` / `update` / `delete` may use the regular Prisma client, or raw SQL where needed for performance or complex operations.

### Environment & builds

- Use **env flavors** via `APP_ENV`:
  - Supported values: `local`, `dev`, `staging`, `production`.
  - Maintain matching files: `.env.local`, `.env.dev`, `.env.staging`, `.env.production` (plus base `.env`).
  - The config loader reads base `.env` then overlays `.env.<APP_ENV>`.
- **Builds**:
  - Prefer `npm run build:interactive` when creating named builds.
    - The script will:
      - Ask **which branch** is being built.
      - Ask **which environment flavor** (`local`/`dev`/`staging`/`production`).
      - Ask for a short **build message/label**.
      - Run `npm run build` with the selected env.
      - Write `dist/build-info.json` with branch, flavor, message, timestamp, and commit hash.
  - Flavor-specific scripts:
    - `build:local`, `build:dev`, `build:staging`, `build:prod` must keep using `APP_ENV` and `NODE_ENV` consistently.

### Security & auth

- Always register **security middlewares** in `app.ts`:
  - `helmet` for headers.
  - `cors` with explicit configuration.
  - `express-rate-limit` using values from config.
- **JWT auth**:
  - All protected routes must use `authenticate` from `src/middleware/auth.ts`.
  - Use **role-based guards** (`authorizeByRole`, `authorizeByAnyRole`) for admin/privileged flows.

### Validation, errors & logging

- **Request validation**:
  - Use `zod` schemas and `validateRequest` middleware for `body`, `query`, and `params`.
  - Do not manually validate in controllers; centralize via schemas.
- **Errors**:
  - Only throw `AppError` from services/controllers for expected errors.
  - Use `ERROR_TYPES` and `RES_TYPES` for categorization and messages.
  - Never send raw error stacks to clients; rely on `ErrorHandler`.
- **Logging**:
  - Use the shared `logger` from `src/logger/logger.ts`.
  - Do not use `console.log`/`console.error` in application code (only allowed in scripts and startup in exceptional cases).

### Quality, accuracy, timely delivery

- **Quality**:
  - TypeScript must run in **strict** mode.
  - ESLint + Prettier must be green before merging (and pre-commit via Husky must pass).
  - Keep modules small, focused, and well-named.
- **Accuracy**:
  - All inputs validated; all domain rules captured in services.
  - Responses must use standardized shapes and message constants.
  - Prefer explicit, typed DTOs and return types.
- **Timely delivery**:
  - Reuse this skeleton and its patterns for new modules and services.
  - Avoid reinventing patterns – extend shared utilities and constants instead.
  - Favor small, incremental changes and PRs over large rewrites.

