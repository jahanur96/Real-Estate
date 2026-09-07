# Google Cloud AI Project Documentation Prompt

Copy the prompt below into Google Cloud Vertex AI / Gemini. Attach the complete project repository, or provide the source files in batches if the platform has an upload limit.

```text
You are a senior software architect and technical writer. Analyze the attached Real-Estate project repository and create a complete technical document that helps a new developer understand, run, maintain, and extend the system.

Repository context
- This is a real-estate management and property-listing application.
- The repository contains a Node.js/Express backend, PostgreSQL database access, a public static website, and an AdminLTE-based admin dashboard.
- Treat the source code as the only authority. Do not invent behavior, database columns, relationships, credentials, deployment steps, or business rules.
- Inspect the actual files, imports, route registration, SQL queries, HTML forms, JavaScript fetch calls, middleware, package manifests, and configuration.
- Exclude or clearly separate third-party/template content such as AdminLTE demo pages, documentation, plugins, build output, and vendor assets from application-owned code.

Analysis rules
1. Cite every important claim with a repository-relative file path and, when possible, the symbol, route, or relevant line range.
2. Mark each statement as one of:
   - Verified: directly confirmed in source code.
   - Inferred: strongly suggested by source code but not explicitly declared.
   - Unknown: not available in the repository.
3. Never expose actual secrets, passwords, tokens, or private connection values. Replace them with [REDACTED] and identify where they are hard-coded.
4. Preserve existing names exactly, including unusual spellings such as `feture_category`, when documenting the current system.
5. If files disagree, document the disagreement instead of choosing silently.
6. Distinguish current behavior from recommended future behavior.

Create the document with these sections:

## 1. Executive summary
- What the system does.
- Who uses it: public visitors, administrators, agents, or other roles found in the code.
- Main capabilities and current implementation status.

## 2. Repository guide
- Top-level directory tree focused on application-owned files.
- Purpose of each important directory and file.
- Files that are generated, vendor-provided, legacy, or not part of the core application.

## 3. Technology stack
Create a table containing technology, detected version, where it is declared or used, and purpose. Include runtime, framework, database driver, authentication, upload handling, frontend libraries, CSS/UI framework, and development tools.

## 4. How the application starts
- Exact prerequisites.
- Install commands supported by the repository.
- Actual backend startup command and working directory.
- Server port and host behavior.
- Static-file serving behavior.
- Required database name, host, port, user, schema, tables, and filesystem directories.
- Environment variables that exist or should exist.
- Clearly list anything needed to run the system that is missing from the repository.

## 5. System architecture
Describe the request flow from browser to Express route, controller, database or filesystem, and response. Explain the public site, admin site, API, PostgreSQL, authentication cookie/JWT, and upload storage. Include a Mermaid diagram, but make sure it reflects only verified or explicitly labeled inferred relationships.

## 6. Backend structure
- Entry points and initialization.
- Middleware and their order.
- Route registration.
- Controller responsibilities.
- Shared utilities and database connection behavior.
- Error handling and response conventions.

## 7. Complete API catalog
Create a table for every endpoint with:
- HTTP method and path.
- Public or admin-facing purpose.
- Authentication and authorization actually enforced.
- Route file and controller function.
- Query parameters, path parameters, JSON fields, form fields, and multipart upload fields.
- Validation, file limits, accepted file types, and side effects.
- Success response shape and likely status codes.
- Error response shape and likely status codes.
- Database tables or files affected.

Do not summarize endpoints into broad categories. Include CRUD, search, dropdown, upload, replacement, deletion, login, logout if present, and contact-submission routes.

## 8. Database documentation
- List every table, column, and SQL operation that can be verified from queries.
- Map each API resource to its tables.
- Infer primary keys and foreign-key relationships only when supported by SQL usage; label inferred relationships.
- Produce a Mermaid ER diagram and a plain-language explanation.
- Document joins, filters, sorting, search behavior, and pagination behavior.
- Identify missing schema, migration, seed, and backup files.

## 9. Authentication and authorization
- Explain login input, password handling, JWT creation, claims, expiration, cookie settings, role checks, and protected static paths.
- Trace which API routes use authentication middleware and which do not.
- Distinguish intended protection from protection actually enforced by the code.
- List security concerns without modifying the source code.

## 10. File uploads and media
- Document every upload directory and its public URL.
- List multipart field names, file count limits, size limits, extension/MIME checks, naming behavior, database references, replacement behavior, and deletion behavior.
- Explain what happens when a database operation or file operation fails.

## 11. Frontend guide
Separate application-owned pages from template/demo assets.

For the public website, document:
- Page purpose and navigation.
- Reusable HTML fragments.
- API calls made by each page.
- Query parameters and URL conventions.
- Loading, empty, and error states that are implemented.

For the admin dashboard, document:
- Each management page.
- Forms and fields.
- CRUD workflows.
- Upload workflows.
- API endpoints called by inline or external JavaScript.
- Any client-side authentication or redirect behavior.

## 12. End-to-end workflows
Describe step-by-step flows for:
- Public property search and browsing.
- Opening property details and loading images.
- Administrator login.
- Creating and editing a property.
- Managing property images.
- Managing categories, feature categories, locations, agents, sliders, testimonials, and contact messages.
- Any other complete workflow found in the code.

## 13. Configuration and deployment
- Separate development assumptions from production requirements.
- Identify hard-coded localhost URLs, ports, filesystem paths, secrets, CORS behavior, and database settings.
- Explain what would need to change for Google Cloud deployment, but label all recommendations as recommendations.
- Do not claim that a Google Cloud service is already configured unless the repository proves it.

## 14. Testing and observability
- List existing tests, scripts, linting, logging, health checks, and error reporting.
- State clearly when no tests or checks exist.
- Suggest a prioritized test plan covering authentication, authorization, CRUD, uploads, search, and database failures.

## 15. Security and technical debt
Create a prioritized table with severity, evidence, impact, and recommended remediation. Check at least:
- Plaintext or weak password handling.
- Hard-coded secrets and database credentials.
- Missing API authorization.
- SQL injection risk and query parameterization.
- File upload validation and path traversal.
- CORS, CSRF, cookie flags, and token storage.
- Missing input validation, rate limiting, pagination, transactions, centralized errors, and audit logging.
- Production URL and configuration assumptions.
- Dependency inconsistencies and duplicate or legacy authentication paths.

## 16. New developer quick start
Give a concise checklist for a developer joining the project, including what to read first, how to run it, how to verify the backend, how to create test data, and where to make common changes. Do not invent commands or data that are not supported by the repository; mark placeholders clearly.

## 17. Unknowns and questions
End with a list of unanswered questions required to operate or maintain the project, such as the authoritative database schema, initial admin account process, production hosting, backup strategy, domain configuration, and intended authorization model.

Final requirements
- Use clear Markdown headings and tables.
- Include a table of contents.
- Include Mermaid diagrams for architecture and database relationships.
- Keep verified facts, inferences, recommendations, and unknowns visibly distinct.
- Prefer precise file paths and endpoint names over vague descriptions.
- Do not silently omit incomplete, duplicated, legacy, or suspicious code paths.
- Finish with a one-page concise summary for onboarding.
```

Before submitting the prompt, attach at minimum:

- `package.json` and `frontend/admin/package.json`
- `backend/server.js` and `backend/db.js`
- All backend route, controller, middleware, and upload files
- Public frontend HTML and JavaScript files
- Admin page HTML and JavaScript files
- Any database schema, migration, seed, deployment, or environment-example files, if available

Do not attach `.env` files or other files containing real secrets.
