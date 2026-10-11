# 0005. Second component scope: scrim token and breakpoint literals

- Status: Accepted (owner approved [`component-api-proposal-0.2.md`](../component-api-proposal-0.2.md) on 2026-10-11)
- Date: 2026-10-11

## Context
The second scope (ProgressBar, SegmentedControl, Dialog) is the first that needs two things the token contract did not cover. A modal dialog dims the page behind it, and no token describes that overlay. Dialog actions stack on phones and sit in a row on wider screens, which is the first media query in a component; `tokens.css` says components repeat the `--bp-*` values as literals because custom properties cannot be used in `@media` conditions, but the stylesheet test rejected every literal length.

## Options
1. **Overlay color**: (A) a new `--color-scrim` token; (B) reuse `--shadow-lg`'s color in `::backdrop`; (C) a hard-coded `rgb()` in the Dialog stylesheet.
2. **Breakpoints in components**: (A) allow literal lengths in `@media` conditions only, and test that each equals a `--bp-*` value; (B) avoid media queries with wrapping flex layouts; (C) container queries with a named container.

## Decision
- 1A: `--color-scrim: rgb(27 31 38 / 0.5)`, in the color section of `tokens.css`. It is not a contrast pair, because nothing is read against it, so the token test lists it with the decorative colors.
- 2A: the stylesheet test ignores lengths inside `@media` conditions and has a new check that each of them is a `--bp-*` value.

## Why
A theme must be able to change the overlay (a dark theme may want a darker or tinted scrim), which rules out 1B and 1C. For 2, the documented rule already said "repeat the breakpoint values", so the test was stricter than the contract; checking against the `--bp-*` values keeps the guarantee that there are no arbitrary breakpoints. Wrapping layouts (2B) cannot express "stacked full width below this width, right-aligned above", and container queries (2C) would make the dialog's layout depend on markup the app controls.

## Consequences
- Projects that theme Osnova can override `--color-scrim`.
- If a breakpoint token changes, the literals in component stylesheets must change with it; the test fails until they do.
