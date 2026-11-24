# Security Policy

## Current status

Inventario Web is a learning-stage prototype, **not** a hardened production service. The current API does not have authentication or authorization and its CORS policy is permissive. Do not expose it to the public internet or use it with private business data.

## Previously exposed configuration

A historical commit contains `backend/.env` with a non-empty database password. Removing it from the latest commit does **not** purge Git history. Rotate any reused credentials, review the database account's access privileges, and avoid copying historical values into new deployments.

History rewriting to purge the old blob should be planned separately because it changes commit history and can disrupt existing clones and forks.

## Reporting an issue

Please contact the maintainer privately through their GitHub profile or use the repository's private vulnerability-reporting feature if enabled. Do not disclose exploit details or secrets in a public GitHub issue.

There is no published vulnerability-response SLA yet.
