<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution creation)

Modified Principles: N/A (new document)

Added Sections:
- Core Principles (6 principles)
- Technology Stack section
- Security Requirements section
- Governance section

Removed Sections: N/A (new document)

Templates Requiring Updates:
- ✅ plan-template.md - Constitution Check section references principles (compatible)
- ✅ spec-template.md - Requirements align with FR/NFR patterns (compatible)
- ✅ tasks-template.md - Phase structure aligns with constitution (compatible)

Follow-up TODOs: None

================================================================================
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Monorepo Architecture

The project MUST follow a monorepo structure with clear separation between frontend and backend concerns:
- Frontend (Next.js) and Backend (FastAPI) reside in the same repository
- Each component MUST be independently buildable and testable
- Shared configuration (environment variables, secrets) MUST be centralized
- Cross-component dependencies MUST be explicitly documented

**Rationale**: A monorepo simplifies deployment coordination, ensures version consistency, and enables atomic changes across the full stack while maintaining clear boundaries.

### II. JWT-Based Authentication

All API communication MUST be secured via JWT tokens issued by Better Auth:
- Frontend authenticates users and obtains JWT tokens from Better Auth
- Every API request MUST include `Authorization: Bearer <token>` header
- Backend MUST verify tokens using the shared `BETTER_AUTH_SECRET`
- Tokens MUST have configurable expiry (default: 7 days)
- Requests without valid tokens MUST receive 401 Unauthorized

**Rationale**: Stateless JWT authentication enables independent frontend/backend scaling without shared session state while maintaining security through cryptographic verification.

### III. User Data Isolation

Users MUST only access their own data - this is NON-NEGOTIABLE:
- All task endpoints MUST include `{user_id}` in the path
- Backend MUST extract `user_id` from verified JWT and validate against path
- Database queries MUST filter by authenticated user's ID
- Any attempt to access another user's data MUST return 403 Forbidden

**Rationale**: Multi-tenant data isolation prevents data leakage and ensures privacy compliance. Path-based user identification combined with JWT verification provides defense in depth.

### IV. RESTful API Design

The API MUST follow REST conventions with predictable endpoint patterns:
- Resource-based URLs: `/api/{user_id}/tasks` and `/api/{user_id}/tasks/{id}`
- Standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update)
- Consistent response formats with appropriate HTTP status codes
- All endpoints MUST be documented with request/response schemas

**Rationale**: RESTful design ensures API predictability, enables client code generation, and follows industry-standard patterns for maintainability.

### V. Test-First Development

Testing MUST accompany all feature development:
- Unit tests for business logic and validation
- Integration tests for API endpoints
- Contract tests for frontend-backend communication
- Security tests for authentication and authorization flows

**Rationale**: Comprehensive testing prevents regressions, documents expected behavior, and enables confident refactoring and deployment.

### VI. Environment-Based Configuration

All secrets and environment-specific values MUST be externalized:
- `BETTER_AUTH_SECRET` MUST be identical on frontend and backend
- Database connection strings MUST use environment variables
- No hardcoded secrets, tokens, or credentials in source code
- `.env.example` MUST document all required variables without values

**Rationale**: Environment-based configuration enables secure secret management, simplifies deployment across environments, and prevents accidental credential exposure.

## Technology Stack

| Layer           | Technology                        |
|-----------------|-----------------------------------|
| Frontend        | Next.js (React)                   |
| Backend         | FastAPI (Python)                  |
| Database        | PostgreSQL                        |
| Authentication  | Better Auth (JWT)                 |
| API Protocol    | REST over HTTPS                   |

**Constraints**:
- Python version: 3.11+
- Node.js version: 18+
- PostgreSQL version: 14+

## Security Requirements

### Authentication Flow

1. User logs in on Frontend via Better Auth
2. Better Auth issues JWT token with user claims
3. Frontend stores token securely and attaches to all API requests
4. Backend middleware verifies JWT signature using shared secret
5. Backend extracts `user_id` from token claims
6. Backend enforces `user_id` matches path parameter

### Security Controls

- **Token Verification**: All endpoints require valid JWT (except health checks)
- **Path Authorization**: `user_id` in path MUST match token's `user_id`
- **Input Validation**: All inputs MUST be validated against schemas
- **Error Handling**: Error responses MUST NOT leak internal details
- **CORS**: Configure allowed origins explicitly for production
- **Rate Limiting**: Implement rate limiting on authentication endpoints

## Governance

This constitution defines non-negotiable principles for the Todo Full-Stack Web Application. All development work MUST comply with these principles.

**Amendment Process**:
1. Proposed amendments MUST be documented with rationale
2. Amendments MUST be reviewed for security and architectural impact
3. Breaking changes require migration plan and version bump
4. All amendments MUST be recorded with date and description

**Compliance**:
- All pull requests MUST verify compliance with constitution principles
- Code reviews MUST check for security requirement adherence
- Deviations require explicit justification and approval

**Guidance**: See `CLAUDE.md` for runtime development guidance and tooling.

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
