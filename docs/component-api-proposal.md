# Component API proposal: first scope

- Status: **Awaiting owner approval.** Nothing below is built yet.
- Date: 2026-10-05
- Scope: Button, Badge, Card, Input, Icon, Banner, Skeleton, EmptyState (administrativni-asistent ADR 0010)
- Source: administrativni-asistent `docs/06-design-system.md` §11, reshaped into a shared, project-neutral API following the `new-component` skill, section 2.

Approve, change or reject each component. The ones marked **Decision needed** have a choice that changes the API.

## Shared conventions (apply to every component)

- **Native element first.** Each component renders the element named below and passes through `className` (merged, never replaced), `ref` (a plain prop in React 19), `aria-*`, `data-*` and event props.
- **Visual options are one enum-like prop** (`variant`, `tone`, `size`), never boolean flags that can contradict each other.
- **Styling only through tokens.** No hard-coded colors, spacing, radii or fonts. Dynamic values go through custom properties (`style={{ '--skeleton-width': width }}`).
- **No built-in copy.** Osnova is used by projects in different languages, so any text it would render (dismiss label, loading text) is a prop. Where that text is essential for accessibility, the prop is required by the types.
- **Icon names** are typed with `IconName` from `lucide-react/dynamic`, a type-only import with no runtime cost, so a typo is a compile error.
- **Touch targets** are at least 44×44 px (`--target-min`); focus uses `outline: var(--focus-ring-width) solid var(--color-focus)` with `--focus-ring-offset`.
- **Motion** uses `--duration-*` tokens, which collapse to `0.01ms` under `prefers-reduced-motion`.
- **Decision needed: router links.** In Next.js, a plain `<a>` causes a full page load. Proposal: one client-side `<OsnovaProvider linkComponent={Link} icons={icons}>` at the app root; Button and Card links render `linkComponent` (default `'a'`). Rejected: an `asChild` prop on every component (Radix style), which is more flexible but makes each component's types and tests harder and lets callers break semantics.

---

## Button

Renders `<button>`; renders a link (`<a>` or `linkComponent`) when `href` is given, because navigation must be a link.

| Prop | Values | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'md'` (min-height 44px) `\| 'lg'` (48px) | `'md'` |
| `iconStart`, `iconEnd` | `IconName` | none |
| `loading` | `boolean` | `false` |
| `href` | `string` | none (renders `<button>`) |
| `type` | native | `'button'` (not the HTML default `'submit'`, which submits forms by accident; forms pass `type="submit"`) |
| `children` | label | required, unless icon-only (then `aria-label` is required by the types) |

- **States:** default, hover (`--color-accent-hover` / `--color-danger-hover`), active, `:focus-visible`, disabled (native `disabled`; `--color-surface-neutral` fill with `--color-text-muted` label, 4.5:1+), loading (`aria-busy="true"`, spinner replaces `iconStart`, label stays so the accessible name does not change, clicks ignored, focus kept).
- **Keyboard / screen reader:** native button behavior (Enter, Space) or link behavior (Enter). Announced as "label, button" or "label, link"; loading adds "busy". A link cannot be disabled: passing `disabled` with `href` is a type error.
- **Rejected:** a polymorphic `as` prop (render as any element). It allows `<Button as="div">`, which loses keyboard and role semantics, and makes the prop types much harder to read. `href` covers the one real need.

## Badge

Non-interactive pill label. Renders `<span>`. The text carries the meaning; color only reinforces it (WCAG 1.4.1).

| Prop | Values | Default |
|---|---|---|
| `tone` | `'neutral' \| 'accent' \| 'success' \| 'attention' \| 'danger'` | `'neutral'` |
| `icon` | `IconName` (decorative, `aria-hidden`) | none |
| `children` | label text | required |

- **States:** static only. No hover or focus because it is not interactive.
- **Screen reader:** reads the text inline. No role.
- **Rejected:** a domain prop such as `status="in_progress"` that picks tone and label. Status names and their wording belong to the app (administrativni-asistent maps `todo | in_progress | done` itself); Osnova stays domain-free.

## Card

Surface container. Renders `<div>` by default.

| Prop | Values | Default |
|---|---|---|
| `as` | `'div' \| 'article' \| 'section' \| 'li'` | `'div'` |
| `padding` | `'default'` (`--space-4`) `\| 'compact'` (`--space-3`) | `'default'` |

Plus `CardLink` (`href`, `children`): a real link, usually wrapping the card title, whose click area is stretched over the whole card with CSS.

- **States:** default (`--color-surface`, `--radius-lg`, `--shadow-sm`). With a `CardLink`: hover raises to `--shadow-md`, and `:focus-visible` on the link draws the focus ring around the whole card (`:has()`).
- **Keyboard / screen reader:** only the `CardLink` is focusable; it is announced with its own text ("Passport renewal, link"), not the whole card's content. Other buttons inside the card stay separately reachable.
- **Rejected:** wrapping the whole card in `<a>`. A screen reader then reads every line of the card as one long link name, and the card cannot contain any other interactive element.

## Input

Text field with built-in label, hint and error. Renders `<label>` + `<input>` with generated ids (`useId`).

| Prop | Values | Default |
|---|---|---|
| `label` | `ReactNode` | required |
| `hideLabel` | `boolean` (visually hidden, still announced; for fields with an obvious visual label such as search) | `false` |
| `hint` | `ReactNode` | none |
| `error` | `ReactNode` | none |
| `iconStart` | `IconName` (decorative) | none |
| `type`, `inputMode`, `autoComplete`, `required`, `disabled`, `value`, `defaultValue`, `onChange`… | native | native |

Proposed companion: `TextArea` with the same `label` / `hint` / `error` props (and `autoGrow?: number` max rows) for the chat composer.

- **States:** default (1px `--color-border`), hover, `:focus-visible` ring, disabled (neutral fill, muted text), invalid (`error` set: `--color-danger` border, error text with `triangle-alert` icon). Placeholder uses `--color-text-muted` and is never the label. Text is `--text-body` (16px) so iOS does not zoom.
- **Keyboard / screen reader:** native input. Announced as "label, edit text", then hint and error through `aria-describedby`; `error` sets `aria-invalid="true"`.
- **Rejected:** a `multiline` boolean on `Input` (06 §11.4). It switches the element, and `type`, `inputMode` and `rows` only make sense for one of the two, so the props type becomes a tangle. Two small components that share an internal `Field` are clearer.

## Icon

`<Icon name="chevron-right" />`. Renders an inline `<svg>`; color is `currentColor`.

| Prop | Values | Default |
|---|---|---|
| `name` | `IconName` (kebab-case Lucide name, as stored in data) | required |
| `size` | `16 \| 20 \| 24` | `20` |
| `label` | `string` | none (decorative) |

- **Screen reader:** without `label`, `aria-hidden="true"` (decorative, the text next to it carries the meaning). With `label`, `role="img"` and `aria-label`. Not focusable.
- **Unknown name** (for example a typo in a database value): renders `circle-help` and warns in development, so a page never breaks.

**Decision needed: how a name becomes an icon without bundling all of Lucide** (about 2,100 icons):

| Approach | Bundle | Server render | Names from data | Verdict |
|---|---|---|---|---|
| **A. Explicit registry**: the app passes the icons it uses, `<OsnovaProvider icons={{ 'chevron-right': ChevronRight, … }}>`; Osnova adds the few it uses itself (`check`, `x`, `info`, `triangle-alert`, `loader-circle`, `circle-help`) | Only the listed icons | Yes, icons are in the HTML | Yes, if registered | **Recommended** |
| **B. `DynamicIcon` from `lucide-react/dynamic`**: imports each icon on demand | Small entry, but the bundler emits about 2,100 lazy chunks | No: renders nothing until a `useEffect` fetch finishes, so icons pop in and shift layout | Yes, any name | Rejected |
| **C. Named-import components**: `<Icon icon={ChevronRight} />` | Only what is imported | Yes | No: a name stored in data needs an app-side map anyway, which is approach A with extra steps; also breaks the "by Lucide name" rule | Rejected |
| D. The full `icons` map from `lucide-react` | All icons, several hundred KB | Yes | Yes | Rejected |

Why A: it keeps the "Icon by Lucide name" rule, tree-shakes to exactly the icons a project uses, renders on the server, and makes the project's icon set explicit and reviewable in one file. The cost is one line per new icon in the app's icon list. Because the app imports icons from `lucide-react` to register them, `lucide-react` becomes a **peer dependency** (`^1`) so the app and Osnova share one copy.

## Banner

Inline message block (replaces toasts, which fail WCAG 2.2.1 when they auto-dismiss). Renders `<div>`.

| Prop | Values | Default |
|---|---|---|
| `tone` | `'info' \| 'warning' \| 'success' \| 'error'` | `'info'` |
| `title` | `ReactNode` | none |
| `children` | body | required |
| `icon` | `IconName` | per tone: `info`, `triangle-alert`, `check`, `triangle-alert` |
| `live` | `'off' \| 'polite' \| 'assertive'` | `'off'` |
| `action` | `ReactNode` (a link or `ghost` Button) | none |
| `onDismiss` + `dismissLabel` | handler + accessible name of the close button; `dismissLabel` is required when `onDismiss` is set | none |

- **States:** static; the dismiss button has hover and `:focus-visible`. Colors per tone: info and warning use `attention-soft` / `attention`, success `success-soft` / `success`, error `danger-soft` / `danger`; body text is `--color-text`.
- **Screen reader:** `live="polite"` adds `role="status"`, `live="assertive"` adds `role="alert"`; use them only when the banner appears after a user action, never for a banner present on page load. The icon is decorative; the title and body carry the meaning.
- **Rejected:** choosing the live region from `tone` automatically (error always `alert`). A static error notice on page load would then interrupt the screen reader on every visit.

## Skeleton

Placeholder while data loads. Renders `<span aria-hidden="true">` (block via CSS).

| Prop | Values | Default |
|---|---|---|
| `shape` | `'text'` (`--radius-sm`) `\| 'block'` (`--radius-lg`) `\| 'circle'` (`--radius-full`) | `'text'` |
| `width`, `height` | CSS length string, passed as `--skeleton-width` / `--skeleton-height` | `100%` / one line |

Plus `SkeletonGroup` (`label` required, `children`): renders `<div aria-busy="true">` with `label` as visually hidden text, so assistive tech hears "Loading…" once instead of nothing or once per bar.

- **States:** pulse (opacity 0.5 to 1 over `--duration-slow`); static fill under `prefers-reduced-motion`. Fill is `--color-surface-neutral`.
- **Screen reader:** each Skeleton is hidden; only the group's label is announced.
- **Rejected:** `role="progressbar"` on each Skeleton. A list of ten skeleton rows would announce ten progress bars.

## EmptyState

Centered "nothing here" block that always offers a next step. Renders `<div>` with a real heading.

| Prop | Values | Default |
|---|---|---|
| `title` | `ReactNode` | required |
| `headingLevel` | `2 \| 3 \| 4` (must fit the page outline) | `2` |
| `description` | `ReactNode` | none |
| `icon` | `IconName` (24px, `--color-text-muted`, decorative) | none |
| `action` | `ReactNode` (Button `secondary` or a link) | none |

- **States:** static. Vertical padding `--space-8`, title `--text-heading`, description `--text-body` in `--color-text-muted`.
- **Screen reader:** heading, then text, then the action in reading order. No live region: the parent decides whether a change needs announcing.
- **Rejected:** `actionLabel` + `onAction` props. They only allow a button, while the most common next step is a link to another page.
