# Osnova

Osnova ("foundation") is a shared design system for my projects: design tokens and accessible React components, published as npm packages. A project installs them, imports two stylesheets and changes the look only by overriding tokens in its own theme.

| Package | What it is |
|---|---|
| [`@aleksandar381radosavljevic/osnova-tokens`](packages/tokens) | Design tokens as CSS custom properties (`--color-*`, `--space-*`, `--radius-*`, `--text-*`, `--shadow-*`, `--duration-*`). Framework-free. |
| [`@aleksandar381radosavljevic/osnova-react`](packages/react) | React 19 components styled with CSS Modules that read only those tokens. Depends on `osnova-tokens`. |

Principles: WCAG 2.2 AA by default (every color pair is contrast-tested), system font stack only, icons from [Lucide](https://lucide.dev) through one `Icon` component, semantic HTML first.

Status: first component scope built (OsnovaProvider, Icon, Button, Badge, Card, Input, TextArea, Banner, Skeleton, EmptyState), as approved in [`docs/component-api-proposal.md`](docs/component-api-proposal.md). Usage examples are in [`docs/components.md`](docs/components.md); decisions are in [`docs/decisions/`](docs/decisions/).

## Use Osnova in a project

The packages live on GitHub Packages ([decision 0002](docs/decisions/0002-distribute-via-github-packages.md)). GitHub Packages requires a token for every install, even for public packages.

### 1. Create a token

Create a **classic** personal access token (GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)) with only the `read:packages` scope. Fine-grained tokens do not work with the GitHub Packages npm registry. Put it in your shell profile:

```sh
export NPM_TOKEN=ghp_your_token
```

### 2. Point the scope at GitHub Packages

Add an `.npmrc` to the project root and commit it. It contains no secret, only a reference to the environment variable:

```ini
@aleksandar381radosavljevic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Only the `@aleksandar381radosavljevic` scope goes to GitHub; every other package still comes from npmjs.org.

### 3. Install

```sh
npm install @aleksandar381radosavljevic/osnova-tokens @aleksandar381radosavljevic/osnova-react lucide-react
```

`lucide-react` is a peer dependency: the app imports the icons it uses from it and registers them in `OsnovaProvider` ([decision 0004](docs/decisions/0004-component-api-conventions.md), setup in [`docs/components.md`](docs/components.md)).

### 4. Deploy (Vercel and other CI)

- **Vercel**: Project → Settings → Environment Variables → add `NPM_TOKEN` (the same `read:packages` token) for Production, Preview and Development. Vercel reads the committed `.npmrc` during install.
- **GitHub Actions** in another repository: the default `GITHUB_TOKEN` can only read packages of repositories it was granted access to. Either grant that repository access in the package settings (Package → Manage access) and use `NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}` with `permissions: packages: read`, or store the classic token as a secret.

### 5. Import the styles once

In the app's root layout, in this order:

```ts
import '@aleksandar381radosavljevic/osnova-tokens/tokens.css';
import '@aleksandar381radosavljevic/osnova-react/styles.css';
import './theme.css'; // your overrides
```

### 6. Theme it by overriding tokens

Osnova's defaults are neutral and brand-free. A project sets its own values in an unlayered `:root` rule:

```css
/* app/theme.css */
:root {
  --brand-orange-700: #a04617; /* project palette: referenced only in this file */

  --color-accent: var(--brand-orange-700);
  --color-accent-text: var(--brand-orange-700);
  --color-focus: var(--brand-orange-700);
  --radius-lg: 12px;
}
```

Rules:

- Override tokens only. Never target Osnova's class names: they are hashed and private, and they change between releases.
- Osnova puts its defaults in the `osnova` cascade layer, so your unlayered theme wins regardless of stylesheet order. If you put your theme in a layer, declare it after: `@layer osnova, theme;`.
- When you change a color, re-check every pair in [`packages/tokens/test/contrast-pairs.ts`](packages/tokens/test/contrast-pairs.ts) against WCAG 2.2 AA (4.5:1 text, 3:1 borders and focus).
- If you override `--duration-*`, also set them to `0.01ms` inside `@media (prefers-reduced-motion: reduce)`.

### 7. Agent rules

`osnova-react` ships the rules agents must follow when using it as [`ai/rules.md`](packages/react/ai/rules.md), declared in its `package.json` as `"aiInstructions"`. Projects that use [ai-instructions](https://github.com/aleksandar381radosavljevic/ai-instructions) list the package in `.ai-instructions.json` and `sync` inlines the version-matched rules (ai-instructions decision 0007).

## Develop

Requires Node.js 24 (see `.nvmrc`; 22.22.2+ also works).

```sh
npm install
npm run lint        # ESLint with type-aware typescript-eslint rules
npm run typecheck   # TypeScript 6.0 (see decision 0003)
npm test            # Vitest: token contrast tests, React tests in jsdom
npm run build       # tokens → dist/tokens.css; react → dist/index.js ('use client'), *.d.ts, styles.css
```

Layout:

```text
packages/
  tokens/   src/tokens.css, test/ (contrast pairs, WCAG check under default and test themes), scripts/build.mjs
  react/    src/ (one folder per component: Name.tsx, Name.module.css, Name.test.tsx), ai/rules.md, test/
docs/
  decisions/                 ADRs
  component-api-proposal.md  first-scope component APIs (approved 2026-10-06)
  components.md              usage examples
```

TypeScript note: the repository uses TypeScript 6.0 because typescript-eslint does not support TypeScript 7 yet. The trigger for moving to 7 is in [decision 0003](docs/decisions/0003-toolchain.md).

## Release

Releases use [Changesets](https://github.com/changesets/changesets).

1. In the pull request that changes a package, run `npm run changeset`, pick the packages and the bump (patch, minor, major) and write one line for the changelog. Commit the generated `.changeset/*.md` file.
2. When that pull request merges to `main`, the release job opens (or updates) a pull request called "chore: version packages" that bumps versions and writes `CHANGELOG.md` files.
3. Merging that version pull request publishes the changed packages to GitHub Packages, tags them and creates GitHub releases.

Publishing uses the workflow's `GITHUB_TOKEN` with `packages: write`; no personal token is stored in this repository. Until 1.0.0, breaking changes are `minor` bumps.

## License

Not chosen yet; until then the packages are marked `UNLICENSED`.
