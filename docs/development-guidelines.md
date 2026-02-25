### Development Guidelines

These guidelines describe how to work effectively with this backend skeleton and keep services consistent across the organization.

### Architecture & module structure

- Follow **Controller → Service → Repository**:
  - **Controller**: Validate HTTP input with `zod` + `validateRequest`, call service, pass result to `handleApiResponse`.
  - **Service**: Implement domain rules, orchestration, and error decisions; throw `AppError` for expected failures.
  - **Repository**: Encapsulate all database access (Prisma) for the module.
- Keep cross-cutting concerns (logging, config, errors, responses) in shared locations:
  - `src/config` – env loading and validation.
  - `src/logger` – centralized logging configuration.
  - `src/constant` – messages, error types, endpoints.
  - `src/utils` – helpers like `AppError`, response utilities, JWT wrappers.
  - `src/middleware` – error, validation, auth, security, logging.

### Adding a new module

For a new domain (e.g. `project`, `task`, `organization`):

1. **Create a folder** under `src/modules/<moduleName>`.
2. Add:
   - `<module>.types.ts` – DTOs, `zod` schemas for validation, and shared types.
   - `<module>.repository.ts` – Prisma-based persistence using **raw queries for reads**.
   - `<module>.service.ts` – business logic that uses the repository and throws `AppError` on errors.
   - `<module>.controller.ts` – Express handlers that call services and return `handleApiResponse`.
   - `<module>.routes.ts` – Express router wiring endpoints to controllers and validation/auth middlewares.
3. **Wire routes** in `src/routes/index.ts`:
   - Import the module router and mount it under `END_POINTS.V1` + a new constant in `END_POINTS`.

### Data access & performance

- **Reads**:
  - Must use **Prisma raw queries** (`prisma.$queryRaw` with parameterized template strings).
  - Design SQL to:
    - Use proper WHERE clauses and indexes.
    - Avoid N+1 by joining related tables instead of performing loops of queries.
    - Return only required columns.
  - Always implement **pagination** for list endpoints (`page`, `limit`) and return `pagination` metadata.
- **Writes**:
  - You can use Prisma client methods (`create`, `update`, `delete`) or raw SQL where needed.
  - Encapsulate all write logic in repository functions.
- **Transactions**:
  - For multi-step changes, use Prisma transactions in the service layer (e.g. `prisma.$transaction`) and keep repository APIs transaction-friendly.

### Validation & error handling

- **Request validation**:
  - Define `zod` schemas in `<module>.types.ts`.
  - Use `validateRequest({ body, query, params })` in routes to validate before controllers run.
  - Never trust raw `req.body` / `req.query` / `req.params` inside services or repositories.
- **Errors**:
  - For expected domain errors, throw `AppError` with:
    - `errorType` from `ERROR_TYPES`.
    - `message` from `RES_TYPES`.
    - Optional `code` for more specific classification.
  - Never throw generic `Error` for domain-level failures (only for unexpected bugs).
  - The global `ErrorHandler` will:
    - Log the error via `logger`.
    - Map `ERROR_TYPES` and Prisma errors to HTTP status codes.
    - Return a normalized error response shape.

### Authentication & authorization

- Use `authenticate` middleware to require a valid JWT for protected endpoints.
  - JWTs are issued and verified using `src/utils/jwt.ts` and `JWT_SECRET`.
- Use `authorizeByRole` / `authorizeByAnyRole` to control role-based access (e.g. admin-only routes).
- For service-specific permissions (e.g. ownership checks), implement additional logic in services or dedicated authorization middlewares.

### Logging

- Use `logger` from `src/logger/logger.ts` for all logging.
- `responseHandler` automatically logs each request with status, method, URL, and latency.
- Prefer structured logs (objects serialized as JSON) when logging complex data.

### Coding standards & tooling

- **TypeScript**:
  - Strict mode is enabled; keep it that way.
  - Avoid `any`; if unavoidable, isolate it and document why.
- **Linting & formatting**:
  - Run `npm run lint` and `npm run format` locally.
  - Husky pre-commit hook (after `npm run prepare`) runs `lint-staged` on changed files.
- **Testing (recommended extension)**:
  - Add tests alongside modules (e.g. `src/modules/user/__tests__`) using your preferred framework.
  - Keep test data and fixtures minimal and focused.

### Workflow & timely delivery

- Start new services by cloning this skeleton.
- When extending:
  - Reuse existing utilities and patterns rather than inventing new ones.
  - Keep PRs small and focused (e.g. “add project module CRUD”).
  - Update `docs/*` and `RULES.md` whenever you introduce a new cross-cutting rule (e.g. new security requirement).

