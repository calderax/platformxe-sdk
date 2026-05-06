# Project Guide

## Zero Tolerance for Errors

**Every TypeScript error, test failure, lint warning, or CI issue found during any session MUST be fixed immediately — regardless of who or what caused it.** There is no concept of "pre-existing" or "not mine" errors. If `tsc --noEmit` reports errors, fix them. If tests fail, fix them. If CI is red, fix it. The codebase must be clean when you leave it.

- `tsc --noEmit` must return zero errors before any commit
- `vitest run` (or `jest`) must return zero failures before any commit
- CI pipelines must be green — if a downstream validation fails, fix the downstream repo
- No dismissed warnings, no skipped checks, no deferred fixes

## Publishing

**Never run `npm publish` locally. CI is the only path to the registry.**

The @caldera/events package had its registry drift away from `origin/master` by four minor versions due to local publishes from an unmerged feature branch. The GitLab publish job in this repo now enforces two guards:

- Tagged commit must be an ancestor of `origin/master` (blocks publishing from feature branches).
- `package.json.version` must match the tag (blocks version/tag drift).

### Release flow

1. On a feature branch, bump `package.json` version (and any version line in README/docs — architecture contract tests enforce parity where present).
2. Open an MR into `master`. CI runs test + consumer-validate jobs.
3. Merge to `master`.
4. Tag the merge commit: `git tag v<X.Y.Z> && git push origin v<X.Y.Z>`. Tag value must match `package.json.version` exactly, prefixed with `v`.
5. GitLab CI's `publish` job runs and pushes to the registry.
6. Consuming apps pick up on their next `npm install`.

If CI is broken, fix CI. The manual local publish is the path that created the drift.
