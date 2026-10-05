### Osnova design system
- Build UI from Osnova components (`@aleksandar381radosavljevic/osnova-react`) first. When something is missing, propose adding it to Osnova (`new-component` skill) instead of building a one-off in the app.
- Import the stylesheets once at the app root: `@aleksandar381radosavljevic/osnova-tokens/tokens.css`, then `@aleksandar381radosavljevic/osnova-react/styles.css`, then the project theme.
- A project changes appearance only by overriding Osnova's tokens (`--color-*`, `--space-*`, `--radius-*`, `--text-*`, `--shadow-*`, `--duration-*`) in its theme file. Never restyle Osnova components by targeting their internal class names.
- Project components read semantic tokens (`--color-text-muted`), not the theme's palette primitives.
- When a theme changes color tokens, re-check WCAG 2.2 AA for every pair Osnova uses (4.5:1 text, 3:1 UI boundaries and focus indicators). A theme that overrides `--duration-*` must also set them to `0.01ms` under `prefers-reduced-motion: reduce`.
- Icons only through Osnova's `Icon` component, by Lucide icon name.
- System font stack only; never add web fonts.
