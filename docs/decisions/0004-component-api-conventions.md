# 0004. Component API conventions: provider, icon registry, link component

- Status: Accepted (owner approved 2026-10-06)
- Date: 2026-10-06

## Context
The first component scope ([`component-api-proposal.md`](../component-api-proposal.md)) left two choices to the owner that shape every component's API. Icons are referenced by Lucide name (names are stored in data, for example a task's icon), but Lucide has about 2,100 icons and Osnova must not bundle all of them or render nothing on the server. Button and Card render links, and in the first consumer (Next.js App Router) a plain `<a>` causes a full page load. A third choice, `Input` with a `multiline` flag versus two components, decided how form fields are built.

## Options
1. **Icons**: (A) an explicit registry the app passes to a provider; (B) `DynamicIcon` from `lucide-react/dynamic`, loaded on demand; (C) icon components as props (`icon={ChevronRight}`); (D) the full `icons` map.
2. **Router links**: (A) one provider with a `linkComponent`, used by every component that renders a link; (B) an `asChild` prop on each component (Radix style); (C) a polymorphic `as` prop.
3. **Multi-line text**: (A) `Input multiline`; (B) `Input` and `TextArea` sharing an internal `Field`.

## Decision
Approved by the owner on 2026-10-06, as recommended in the proposal:
- One client-side `<OsnovaProvider linkComponent={Link} icons={icons}>` at the app root. `linkComponent` defaults to `'a'`; `icons` is a `Partial<Record<IconName, LucideIcon>>`. Without a provider, links render `<a>` and Osnova's own icons still work.
- Icons option A. Osnova always registers the icons it renders itself (`check`, `x`, `info`, `triangle-alert`, `loader-circle`, `circle-help`); the app's registry is merged over them. An unregistered name renders `circle-help` and warns once per name in development.
- `lucide-react` `^1` is a peer dependency (and a pinned dev dependency), so the app and Osnova share one copy. `IconName` comes from `lucide-react/dynamic` as a type-only import, so a typo is a compile error.
- Links option A: `Button` with `href` and `CardLink` render `linkComponent`.
- Text fields option B: `Input` and `TextArea` share an internal `Field` that wires label, hint, error, `aria-describedby` and `aria-invalid`.

Implementation conventions that follow from the approved shared conventions:
- Component styles sit in the `osnova` cascade layer, like the tokens, so any unlayered or later-layered app rule (including utility classes passed as `className`) wins over them without specificity fights.
- Text fields put `className` on the outer wrapper (it is used for layout) and every other prop, including `ref`, on the native control.
- New tokens: `--text-label-*` (button and field labels), `--target-lg` (48px Button `lg`) and `--border-width`.

## Why
The registry keeps "icon by Lucide name", tree-shakes to exactly the icons a project uses, renders on the server, and makes the project's icon set one reviewable file; the cost is one line per new icon. `DynamicIcon` emits about 2,100 lazy chunks and renders nothing until an effect resolves, which shifts layout. A single `linkComponent` keeps each component's props and tests simple and keeps link semantics in Osnova's hands; `asChild` and `as` are more flexible but let callers render a link as a `div`. Two small field components keep `type`/`inputMode` and `rows` on the element they belong to.

## Consequences
- In Next.js the provider must be rendered from a `'use client'` file: a server layout cannot pass component props (icons, `Link`) to a client component.
- Each new icon an app uses is one line in its icon file; a missing line shows `circle-help` instead of breaking the page. Lucide renames (for example `circle-help` to `circle-question-mark` in Lucide 1) keep both names valid through Lucide's aliases.
- A `lucide-react` major release is a breaking change for Osnova's peer range and needs a new Osnova minor (major after 1.0).
- `TextArea autoGrow` uses CSS `field-sizing: content`; browsers without it keep the `rows` height and scroll. Revisit if a consumer needs auto-grow there.
- Another link-rendering component must read `linkComponent` from the provider rather than accept its own link prop.
