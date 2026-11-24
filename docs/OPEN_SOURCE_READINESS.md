# Open-source readiness checklist

This checklist records verified findings from the repository audit. It is **not** a claim of current eligibility for any grant or program.

- [x] Public GitHub repository exists.
- [x] Current stack and features documented.
- [x] Historical `.env` exposure identified.
- [ ] Database password rotated by the owner if still in use or reused elsewhere.
- [ ] Old secret purged from Git history (requires an explicit, coordinated history-rewrite decision; deleting the current file is insufficient).
- [ ] Choose and publish a maintainer-approved OSI license. **No license granted by this documentation.**
- [ ] Verify ownership and third-party code licensing.
- [ ] Add a reproducible database schema/migrations.
- [ ] Add automated tests and a supported Node version policy.
- [ ] Introduce authentication/authorization and production-safe CORS before deployment.
- [ ] Verify installation and smoke tests on a clean machine with test credentials.
- [ ] Build a real contribution history from useful improvements and external reviews.

Claude for Open Source additionally requires all general eligibility conditions, including the age of the GitHub account and public contribution activity within the preceding 90 days. A documentation change alone does not guarantee program eligibility.
