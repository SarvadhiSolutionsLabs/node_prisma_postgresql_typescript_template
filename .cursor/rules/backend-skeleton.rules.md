### Backend Skeleton Cursor Rules

- **Architecture**
  - Prefer `Controller → Service → Repository` layering.
  - Controllers should only handle HTTP concerns and delegate to services.
  - Services should contain business rules and throw `AppError` for expected failures.
  - Repositories should contain all database access via Prisma.

- **Responses & errors**
  - Always use `handleApiResponse` / `handleErrorResponse` for HTTP responses.
  - Always use `AppError` with `ERROR_TYPES` and `RES_TYPES` instead of generic `Error`.
  - Do not return ad-hoc response shapes; use the standardized `{ success, statusCode, message, data?, pagination? }`.

- **Prisma usage (performance rule)**
  - For **reads**, always use **Prisma raw queries** (`prisma.$queryRaw` with template strings and parameters).
  - Do **not** introduce `findMany` / `findUnique` / similar for data retrieval unless explicitly requested.
  - For **writes** (create, update, delete), Prisma client methods are allowed; raw SQL writes are optional.

- **Environment & builds**
  - Respect env flavoring: `APP_ENV` in [`local`, `dev`, `staging`, `production`] and `.env.<APP_ENV>` files.
  - When adding or updating build scripts, ensure they:
    - Set `APP_ENV` and `NODE_ENV` consistently.
    - Keep `build:interactive` as the primary entry point for interactive builds.
  - Do not remove or bypass `scripts/build-interactive.ts` when adding new build flows.

- **Security & middleware**
  - Keep `helmet`, `cors`, and `express-rate-limit` registered via `registerSecurityMiddlewares` in `app.ts`.
  - Use `authenticate`, `authorizeByRole`, and `authorizeByAnyRole` for protected routes and role-based access.
  - Use `validateRequest` with `zod` schemas for all new endpoints.

- **Logging**
  - Use the shared `logger` from `src/logger/logger.ts` instead of `console.log` in application code.
  - Request logging should remain centralized in `responseHandler`.

- **General**
  - Maintain TypeScript strictness and ESLint/Prettier configuration.
  - Prefer adding new constants to `src/constant` rather than hard-coding strings in controllers/services.

