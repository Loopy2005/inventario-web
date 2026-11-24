# Contributing to Inventario Web

Thanks for your interest in contributing.

## Before coding

1. Open an issue describing the problem, target user, acceptance criteria and proposed change.
2. Wait for a maintainer to agree on scope before implementing major features.
3. Keep pull requests focused and explain how to reproduce and test the change.
4. Do not include client data, credentials, local `.env` files, generated dependencies or private business material.

## Development checks

- Frontend: `cd frontend && npm ci && npm run lint && npm run build`.
- Backend: `cd backend && npm ci`; automated backend tests are not implemented yet.
- When changing API or SQL behavior, explicitly document any required schema changes. Migrations are not yet included.

## Security

If your report could reveal a security weakness or private data, **do not open a public issue with details**. Follow [SECURITY.md](SECURITY.md). Never paste a secret into an issue, pull request, log or screenshot.

## Review expectations

Contributions must be functional and meaningfully improve the project. Automated, duplicate or cosmetic-only changes intended to inflate activity metrics are not acceptable.
