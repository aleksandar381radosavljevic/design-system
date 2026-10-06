# 0003. Toolchain: TypeScript 6, npm workspaces, Vite library mode, Vitest, Changesets

- Status: Proposed
- Date: 2026-10-05

## Context
Osnova needs to type-check, lint, test, build an ESM library with type declarations and one extracted CSS file, and release two packages that depend on each other. The owner chose TypeScript, Vitest with Testing Library and npm workspaces. TypeScript 7 (the native Go compiler, now `latest`) ships no JavaScript compiler API. typescript-eslint 8.71.1 needs that API and accepts only `typescript >=4.8.4 <6.1.0`. The first consumer uses the Next.js App Router, where a component that uses hooks or events must be behind a `'use client'` boundary.

## Options
1. **TypeScript version**: TypeScript 7 for type-checking, with the TypeScript 6 API aliased in for typescript-eslint (works, but needs a wrapper script and two `tsc` binaries) vs. **plain TypeScript 6.0.x** everywhere.
2. **Build**: Vite library mode (one ESM bundle, CSS Modules extracted to `styles.css`) vs. `tsc` only (no CSS Modules) vs. tsup/rolldown directly (more config for CSS Modules).
3. **Declarations**: `vite-plugin-dts` (runs inside `vite build`) vs. a separate `tsc --emitDeclarationOnly` step.
4. **`'use client'`**: `preserveModules` with a directive on each file that needs one (keeps server-only components, but needs a per-file plugin and a second set of rules) vs. **one directive on the single bundled entry**.
5. **Releases**: Changesets vs. semantic-release (driven by commit messages, weaker monorepo support) vs. manual `npm version` (easy to get wrong with internal dependencies).

## Decision
- TypeScript 6.0.3 for type-checking, declarations and linting.
- Vite 8 library mode for `osnova-react`, with `vite-plugin-dts` 5.1.2 emitting `.d.ts` files during `vite build` (checked: it works cleanly with TypeScript 6). Vitest 5 with jsdom and Testing Library. npm workspaces.
- A `'use client';` banner on the bundled entry (`rolldownOptions.output.banner`).
- Changesets with the GitHub changelog, run by `changesets/action` in CI.

## Why
One ordinary TypeScript install with no aliases or wrapper scripts is what every tool, editor and contributor expects. TypeScript 7 mainly makes builds faster, and that doesn't matter yet for a repository this small. A single directive is the simplest correct choice: most first-scope components need client code anyway (only Badge, Card, Skeleton and EmptyState could stay on the server), and Next.js still renders client components on the server. Changesets is built for workspace packages that are versioned independently.

## Consequences
- **Moving to TypeScript 7**: switch once a typescript-eslint release lists TypeScript 7 in its `typescript` peer range, or can use `@typescript/typescript6` for its API. Also check that `vite-plugin-dts` still emits declarations, or replace it with `tsc --emitDeclarationOnly`.
- Every Osnova component is a client component in Next.js, including purely presentational ones. They are still rendered on the server, but their code also ships to the browser. If bundle size becomes a problem, move to `preserveModules` with per-file directives in a new ADR.
- The build must keep `'use client'` as the first statement of `dist/index.js`. Check this when changing the Vite or Rolldown config.
- jsdom 30 requires Node.js 22.22.2+ or 24.15+. CI uses Node.js 24 from `.nvmrc`.
- `eslint-plugin-jsx-a11y` does not support ESLint 10 yet. Until it does, accessibility is enforced by tests and review.
