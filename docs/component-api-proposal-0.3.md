# Component API proposal: Osnova 0.3.0

- Status: Proposed
- Date: 2026-10-16
- Scope: the tokens and the one component that the administrativni-asistent "Illustrated friend" redesign needs and Osnova 0.2.0 lacks (app [ADR 0020](https://github.com/aleksandar381radosavljevic/administrativni-asistent/blob/claude/app-design-air5ho/docs/decisions/0020-illustrated-visual-direction.md); concept https://claude.ai/artifact/A6rGiMYn7eHu6pD7eLd4yD).
- The shared conventions from the first proposal still apply: native element first, `className`/`ref`/`aria-*` pass-through, one enum-like prop for visual options, tokens only, no built-in copy.

Approve, change or reject each part. The one marked **Decision needed** has a choice that changes the API.

---

## Tokens

### `--font-display`
A font stack for large headings. Default: the same stack as `--font-body`, so nothing changes for existing projects. A project may set a rounded system face, for example `ui-rounded, "SF Pro Rounded", system-ui, …`; still system fonts only.

### `--text-hero-*`
A type step above `display`, for the one headline at the top of a landing page: `--text-hero-size` (`clamp(2.75rem, 5vw + 1rem, 6.75rem)`, 44 px on a phone to 108 px on a wide screen), `--text-hero-line: 0.95`, `--text-hero-weight: 900`, and `--text-hero-tracking: -0.04em`. Tight tracking is part of the style: large rounded type looks loose without it.

### Categorical palette: `--color-category-1` … `--color-category-6`
Six colors for telling groups apart (an app's content areas, chart series). Each has three roles:

| Token | Role | Contrast rule (added to `contrast-pairs.ts`) |
|---|---|---|
| `--color-category-N` | text and meaningful icons | 4.5:1 on `-soft`, on `--color-surface` and on `--color-bg` |
| `--color-category-N-soft` | tinted backgrounds | `--color-text` and `--color-text-muted` at 4.5:1 on it |
| `--color-category-N-decorative` | illustration fills only | none: never text, never the only cue |

Defaults are neutral (blue, green, gold, red, purple, teal); a project maps its own areas to numbers in its theme.

**Decision needed: palette in Osnova or in the app?** Proposal: in Osnova. The component below takes a `tone`, and Osnova's contrast test can then check every pair under every theme it tests. Rejected: six app-only tokens in `theme.css`, which is less API but leaves the component unable to name a tone and leaves the pairs outside Osnova's contrast test.

### `--radius-2xl: 24px`
For large illustrated surfaces; `--radius-xl` (16 px) reads as a small card at that size.

## IllustratedCard

A whole-card link with an illustration on top, a title and an optional meta line. Renders `linkComponent` (ADR 0004) with the title as its accessible name.

| Prop | Values | Default |
|---|---|---|
| `href` | `string` | required |
| `title` | `string` | required |
| `illustration` | `ReactNode`, decorative (Osnova wraps it in `aria-hidden`) | required |
| `meta` | `ReactNode`, one short line such as a duration | none |
| `tone` | `'neutral' \| 'category-1'` … `'category-6'` | `'neutral'` |
| `variant` | `'tile' \| 'sticker'` | `'tile'` |
| `tilt` | `number`, degrees, clamped to `-8..8`; `sticker` only | `0` |
| `headingLevel` | `2 \| 3 \| 4` for the title | `3` |

- **Look, `tile`:** the illustration area and the card share the `-soft` tone, `--radius-2xl`, title in `--font-display` `--text-title-*`, meta in `--text-body-sm` `--color-text-muted`.
- **Look, `sticker`:** a `--color-surface` frame with `--space-3` padding around the tinted illustration, `--shadow-lg`, a translucent "tape" strip at the top edge, rotated by `tilt` through a custom property (`--osnova-tilt`), never an inline transform.
- **States:** hover and `:focus-visible` lift the card; a `sticker` also straightens to 0° and scales to 1.04. Focus ring in `--color-focus`, at least 3:1. Under `prefers-reduced-motion` nothing moves; only the ring and shadow change.
- **Meta is always visible.** The concept shows the duration only on the hovered sticker; touch screens have no hover, so the meta line stays visible on every card.
- **Screen reader:** "Selim se na novu adresu, link". The meta is inside the link and is read after the title.
- **Rejected:** extending `CardLink` with an `illustration` prop. The sticker frame, tilt and tape would make `CardLink`'s API and styles carry art direction it does not need everywhere else.

---

## Not in this scope

- **Illustrations themselves:** they stay in the app as SVG components that use the app's theme tokens (ADR 0020).
- **The hero background that changes color, the wave transition, section tint blocks:** composition, built in the app from these tokens.
- **Category links ("Lična dokumenta", …):** app links styled with tokens, as `CategoryFilter` already is.

## Release

One `minor` changeset for `osnova-tokens` (new tokens) and `osnova-react` (IllustratedCard), giving 0.3.0 for both through the existing "Version Packages" PR. An Osnova ADR records the categorical palette and the hero type step, because new token families are decisions.
