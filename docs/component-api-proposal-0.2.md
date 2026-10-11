# Component API proposal: Osnova 0.2.0

- Status: **Approved by the owner on 2026-10-11, without changes**, including the defaults in the two "Decision needed" items (separate RadioGroup later, no ConfirmDialog).
- Date: 2026-10-11
- Scope: ProgressBar, SegmentedControl, Dialog. These are the generic pieces the administrativni-asistent checklist (P4) needs and Osnova 0.1.0 lacks (owner decision 2026-10-11: add them to Osnova, release 0.2.0; P1 and P3 are built on 0.1.0 meanwhile).
- Source: administrativni-asistent `docs/06-design-system.md` §12.13, §12.14 and §12.19, and `docs/08-screen-specifications.md` P4, reshaped into a project-neutral API following the `new-component` skill, section 2.
- The shared conventions from the first proposal still apply: native element first, `className`/`ref`/`aria-*` pass-through, one enum-like prop for visual options, tokens only, no built-in copy.

Approve, change or reject each component. The ones marked **Decision needed** have a choice that changes the API.

---

## ProgressBar

Renders a native `<progress>` plus a visible text label, wrapped in a `<div>`. The label is linked to the bar with `aria-labelledby`, so the screen reader name is the same text sighted users read.

| Prop | Values | Default |
|---|---|---|
| `value` | `number` (clamped to `0..max`) | required |
| `max` | `number` (> 0) | required |
| `label` | `ReactNode`, visible text such as "1 / 4 completed" | required |

- **Look:** track `--color-surface-neutral`, fill `--color-accent`, height `--space-2` (8 px), `--radius-full`; label in `--text-data` above the bar. Fill changes animate with `--duration-base` (collapses under reduced motion).
- **States:** static. Not interactive, so no hover or focus. `value === max` needs no special style; the label carries the meaning.
- **Screen reader:** "1 / 4 completed, progress bar, 25%". Live announcements of changes are the app's job (one page-level live region), because a bar that announces itself on every change is noisy when several things change at once.
- **Rejected:** a `<div role="progressbar">` with an inline width. It re-implements what `<progress>` gives for free and needs an inline style for the width; the native element takes `value` as an attribute.

## SegmentedControl

A single choice between 2 to 5 short options, shown as joined segments. Renders `<fieldset>` + `<legend>` + native `<input type="radio">` with `<label>` per segment.

| Prop | Values | Default |
|---|---|---|
| `legend` | `string` | required (the group's accessible name) |
| `legendDisplay` | `'visible' \| 'hidden'` (visually hidden, still read) | `'visible'` |
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | required |
| `value` | `string` (controlled) | required |
| `onChange` | `(value: string) => void` | required |
| `name` | `string` | generated with `useId` |
| `disabled` | `boolean` (whole group) | `false` |

- **Look:** segments share one border (`--color-border`, `--radius-md` on the outer corners), equal width, filling the container (`grid-auto-columns: 1fr`), each at least `--target-min` (44 px) tall. Selected: `--color-accent` fill with `--color-text-on-accent` and a `check` icon, so the state is not shown by color alone. The container decides the width; the app puts it full-width on phones and on the right from 640 px.
- **States:** default, hover (`--color-accent-soft`), selected, `:focus-visible` (ring around the focused segment), disabled (option or group).
- **Keyboard / screen reader:** native radio behavior: Tab enters the group on the selected option, arrow keys move and select, Space selects. Announced as "In progress, radio button, 2 of 3, selected, {legend}, group".
- **Rejected:** buttons with `role="radio"` and a hand-written roving tabindex (the WAI-ARIA toolbar pattern). It re-implements arrow keys, focus and form behavior that native radios already have, and is easy to get subtly wrong.
- **Decision needed: generic `RadioGroup` later?** The admin also needs a plain radio group (cost type, 06 §12.19). Proposal: keep `SegmentedControl` as its own component now and add a separate vertical `RadioGroup` with the admin scope, both on the same internal radio pieces. Rejected for now: one `RadioGroup` with `appearance="segmented" | "list"`, because the two layouts differ in more than looks (equal-width grid versus stacked labels with descriptions).

## Dialog

A modal dialog on the native `<dialog>` element, opened with `showModal()`, so the browser handles the focus trap, `Escape`, the inert background and the top layer.

| Prop | Values | Default |
|---|---|---|
| `open` | `boolean` (controlled) | required |
| `onClose` | `() => void`, called on `Escape` and on any close request | required |
| `title` | `string`, rendered as the heading and used as the accessible name | required |
| `description` | `ReactNode`, linked with `aria-describedby` | none |
| `actions` | `ReactNode`, usually Osnova Buttons, in the footer | none |
| `children` | extra body content | none |
| `closeOnBackdrop` | `boolean` | `false` |

- **Look:** `--color-surface`, `--radius-xl`, `--shadow-lg`, padding `--space-6`, max width `60ch` (a reading measure, so it scales with the text) and a `--space-4` margin on each side on phones; actions right-aligned from 640 px and stacked full width below it. Backdrop uses a **new token `--color-scrim`** (dark, semi-transparent; recorded in an Osnova ADR, because a new token is a decision).
- **States:** closed, open (fade and scale in with `--duration-base`, none under reduced motion).
- **Keyboard / screen reader:** focus moves into the dialog on open and returns to the element that opened it on close. Initial focus goes to the element the app marks with `autoFocus` (for a confirmation, the safe "Cancel" button), otherwise the first focusable element. Announced as "{title}, dialog, {description}".
- **Why `closeOnBackdrop` defaults to `false`:** most dialogs in scope are confirmations of a destructive action, and a stray tap outside should not count as an answer.
- **Why `useEffect` here:** syncing `open` with `showModal()`/`close()` is syncing with a DOM API, which is what effects are for.
- **Rejected:** a custom `div` dialog rendered through a portal, with its own focus trap (the Radix approach). Native `<dialog>` is now supported in every target browser and gives the same behavior with far less code to test.
- **Decision needed: also ship `ConfirmDialog`?** Proposal: no. A confirmation is `Dialog` with `description` and two Buttons in `actions`, a few lines in the app. Rejected: a `ConfirmDialog` with `confirmLabel`/`cancelLabel`/`onConfirm`, which saves those lines but adds a second API to keep in sync; it can be added later if three or more places repeat the same pattern.

---

## Not in this scope

- **CategoryFilter chips** (Home): built in the app as links styled with tokens, because each chip is a navigation link (`?kategorija=`), not a control. If a second project needs filter chips, they move to Osnova then.
- **Select, Checkbox, RadioGroup, sortable list** for the admin: a later scope, with the admin screens.

## Release

One changeset (`minor`) for `osnova-react` and `osnova-tokens` (new `--color-scrim`), giving 0.2.0 for both through the existing "Version Packages" PR.
