# 0006. Third component scope: categorical palette, hero type and display font

- Status: Accepted (owner approved [`component-api-proposal-0.3.md`](../component-api-proposal-0.3.md) on 2026-10-16)
- Date: 2026-10-16

## Context
The first consumer, administrativni-asistent, moved to an illustrated look (its ADR 0020): content areas get their own colors, a large rounded headline opens the home page, and life events show as illustrated tiles and tilted "stickers". The token contract had one accent and four status colors, a largest type step of 28 px, and no way to choose a separate face for headings.

## Options
1. **Area colors**: (A) a categorical palette in Osnova, six colors with three roles each; (B) app-only tokens in the project theme, with components taking colors from outside.
2. **Headline size**: (A) a new `hero` step above `display`; (B) make `display` larger.
3. **Heading face**: (A) a `--font-display` token defaulting to the body stack; (B) leave headings on `--font-body`.

## Decision
- 1A: `--color-category-1` … `-6`, each with `-soft` (tinted backgrounds) and `-decorative` (illustration fills only). Neutral defaults; projects map their own areas to numbers.
- 2A: `--text-hero-size` (`clamp(2.75rem, 5vw + 1rem, 6.75rem)`), `--text-hero-line`, `--text-hero-weight`, `--text-hero-tracking`.
- 3A: `--font-display: var(--font-body)`, so existing projects do not change.
- Also `--radius-2xl: 24px`, and the `IllustratedCard` component with `tone`, `variant` (`tile`, `sticker`) and `tilt`.

## Why
With the palette in Osnova a component can name a tone, and the contrast test checks every category pair (base on its tint, on surfaces, text and focus on the tint) under every test theme; app-only colors would sit outside that test. A separate `hero` step keeps `display` usable for page titles in apps. The display font token lets a theme pick a rounded system face without breaking the system-fonts-only rule.

## Consequences
- 36 new contrast pairs; the dark test theme defines its own categorical palette. A project theme that overrides one category color must keep its pairs passing.
- `-decorative` colors are excluded from the pair test like the other decorative tokens, so they must never carry text or meaning.
- `IllustratedCard` sets two component properties, `--illustrated-card-tint` and `--osnova-tilt`, listed in the stylesheet test.
