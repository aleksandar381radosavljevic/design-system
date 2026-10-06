# 0001. Ship Osnova as a monorepo with separate tokens and React packages

- Status: Accepted
- Date: 2026-10-05

## Context
Osnova needs design tokens and React components (administrativni-asistent ADR 0010). Tokens are useful without React: a static page, an email template or a future non-React app can read CSS custom properties. Components always need the tokens, and both change together while the token contract is young. ai-instructions decisions 0006 and 0007 already assume an Osnova monorepo whose packages ship their own agent rules.

## Options
1. **One package** with tokens and components: simplest to publish, but every token consumer installs React components and a React peer dependency.
2. **Separate repositories** for tokens and components: clean boundary, but a token rename needs two coordinated pull requests and releases.
3. **One repository, two packages** (`osnova-tokens`, `osnova-react`) in npm workspaces.

## Decision
Option 3: `@aleksandar381radosavljevic/osnova-tokens` (framework-free CSS) and `@aleksandar381radosavljevic/osnova-react` (components, depends on tokens), versioned independently from one repository.

## Why
A token change and the components that use it land in one pull request and one CI run, while consumers that only want tokens never pull in React. It is also the shape decisions 0006 and 0007 in ai-instructions were written for.

## Consequences
- Releases need a tool that understands workspaces and internal dependencies (Changesets, decision 0003).
- `osnova-react` ships consumer agent rules as `ai/rules.md`, declared via `"aiInstructions"` in its `package.json` (ai-instructions decision 0007). `rules/design/osnova.md` in ai-instructions can move here once the first release is out.
- New framework bindings (for example a future `osnova-web-components`) are new packages that reuse `osnova-tokens`.
