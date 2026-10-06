# 0002. Distribute Osnova through GitHub Packages

- Status: Accepted
- Date: 2026-10-05

## Context
Projects need to install Osnova as versioned npm packages (the open question in the ai-instructions README and administrativni-asistent ADR 0010). npm cannot install a package from a subdirectory of a git repository, so the monorepo (decision 0001) rules out installing straight from git without extra tooling. Deploys run on Vercel.

## Options
1. **Public npm registry**: no token needed to install, anyone can use it; needs an npm account, an npm scope and an `NPM_TOKEN` publish secret in this repository; the packages are public to the world.
2. **GitHub Packages npm registry**: lives next to the code, publishes with the workflow's built-in `GITHUB_TOKEN`, no extra account; every install needs a token, even for public packages, and the scope must equal the GitHub owner.
3. **Git dependency** (`github:owner/repo#tag`): no registry at all; does not work for a package in a monorepo subdirectory, skips the build unless `prepare` builds on every install, and has no semver ranges.

## Decision
Option 2, chosen by the owner on 2026-10-05. Packages are published as `@aleksandar381radosavljevic/osnova-tokens` and `@aleksandar381radosavljevic/osnova-react` with `publishConfig.registry` set to `https://npm.pkg.github.com`.

## Why
It keeps code, releases and packages under one GitHub account and needs no second registry account or long-lived publish secret: CI publishes with `GITHUB_TOKEN` and `packages: write`. The install-time token is a known, one-time cost per machine and per deploy target.

## Consequences
- Every install outside GitHub Actions needs a **classic** personal access token with `read:packages` (fine-grained tokens are not supported by the npm registry on GitHub Packages), exposed as `NPM_TOKEN`.
- Each consuming project commits an `.npmrc` mapping `@aleksandar381radosavljevic` to `https://npm.pkg.github.com` with `_authToken=${NPM_TOKEN}`.
- Vercel needs `NPM_TOKEN` as an environment variable in every environment that builds.
- Other repositories' GitHub Actions need either package access granted to their repository or the classic token as a secret.
- Moving to public npm later means renaming nothing (the scope can stay) but changing `publishConfig`, the workflow and every consumer's `.npmrc`; that would be a new ADR superseding this one.
