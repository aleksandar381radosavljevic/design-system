/**
 * Every foreground/background pair Osnova components are allowed to use.
 * A pair that is not listed here is not allowed until it is added and passes.
 *
 * - `text`: WCAG 2.2 SC 1.4.3, 4.5:1 (all Osnova text is below "large text" size).
 * - `ui`: WCAG 2.2 SC 1.4.11, 3:1 for component boundaries, icons that carry
 *   meaning and focus indicators.
 */
export interface ContrastPair {
  fg: string;
  bg: string;
  kind: 'text' | 'ui';
  usedFor: string;
}

export const contrastPairs: ContrastPair[] = [
  // Body text on every surface it can sit on
  { fg: '--color-text', bg: '--color-bg', kind: 'text', usedFor: 'Body text on the page' },
  { fg: '--color-text', bg: '--color-surface', kind: 'text', usedFor: 'Text in Card, Input' },
  { fg: '--color-text', bg: '--color-surface-sunken', kind: 'text', usedFor: 'Text in a nested surface' },
  { fg: '--color-text', bg: '--color-surface-neutral', kind: 'text', usedFor: 'Text on neutral fills' },
  { fg: '--color-text', bg: '--color-accent-soft', kind: 'text', usedFor: 'Text on accent-soft surfaces' },
  { fg: '--color-text', bg: '--color-success-soft', kind: 'text', usedFor: 'Banner body (success)' },
  { fg: '--color-text', bg: '--color-attention-soft', kind: 'text', usedFor: 'Banner body (info, warning)' },
  { fg: '--color-text', bg: '--color-danger-soft', kind: 'text', usedFor: 'Banner body (error)' },

  // Muted text
  { fg: '--color-text-muted', bg: '--color-bg', kind: 'text', usedFor: 'Secondary text on the page' },
  { fg: '--color-text-muted', bg: '--color-surface', kind: 'text', usedFor: 'Hint, placeholder, EmptyState description' },
  { fg: '--color-text-muted', bg: '--color-surface-neutral', kind: 'text', usedFor: 'Badge neutral, disabled Button label' },
  { fg: '--color-text-muted', bg: '--color-accent-soft', kind: 'text', usedFor: 'Meta text on accent-soft' },
  { fg: '--color-text-muted', bg: '--color-success-soft', kind: 'text', usedFor: 'Secondary text in success Banner' },
  { fg: '--color-text-muted', bg: '--color-attention-soft', kind: 'text', usedFor: 'Secondary text in info/warning Banner' },
  { fg: '--color-text-muted', bg: '--color-danger-soft', kind: 'text', usedFor: 'Secondary text in error Banner' },

  // Accent
  { fg: '--color-accent-text', bg: '--color-bg', kind: 'text', usedFor: 'Links on the page' },
  { fg: '--color-accent-text', bg: '--color-surface', kind: 'text', usedFor: 'Links in cards' },
  { fg: '--color-accent-text', bg: '--color-accent-soft', kind: 'text', usedFor: 'Badge accent' },
  { fg: '--color-accent-text', bg: '--color-surface-neutral', kind: 'text', usedFor: 'Accent text next to neutral fills' },
  { fg: '--color-text-on-accent', bg: '--color-accent', kind: 'text', usedFor: 'Button primary' },
  { fg: '--color-text-on-accent', bg: '--color-accent-hover', kind: 'text', usedFor: 'Button primary hover/active' },

  // Status
  { fg: '--color-success', bg: '--color-success-soft', kind: 'text', usedFor: 'Badge success, success Banner title and icon' },
  { fg: '--color-success', bg: '--color-surface', kind: 'text', usedFor: 'Success text in cards' },
  { fg: '--color-text-on-accent', bg: '--color-success', kind: 'text', usedFor: 'Text or icon on a success fill' },
  { fg: '--color-attention', bg: '--color-attention-soft', kind: 'text', usedFor: 'Badge attention, info/warning Banner title and icon' },
  { fg: '--color-attention', bg: '--color-surface', kind: 'ui', usedFor: 'Attention icon or border on a card' },
  { fg: '--color-danger', bg: '--color-danger-soft', kind: 'text', usedFor: 'Badge danger, error Banner title and icon' },
  { fg: '--color-danger', bg: '--color-surface', kind: 'text', usedFor: 'Input error message' },
  { fg: '--color-danger', bg: '--color-bg', kind: 'text', usedFor: 'Error message on the page' },
  { fg: '--color-text-on-accent', bg: '--color-danger', kind: 'text', usedFor: 'Button danger' },
  { fg: '--color-text-on-accent', bg: '--color-danger-hover', kind: 'text', usedFor: 'Button danger hover/active' },

  // UI boundaries
  { fg: '--color-border', bg: '--color-surface', kind: 'ui', usedFor: 'Input and secondary Button border in cards' },
  { fg: '--color-border', bg: '--color-bg', kind: 'ui', usedFor: 'Input and secondary Button border on the page' },
  { fg: '--color-border', bg: '--color-surface-neutral', kind: 'ui', usedFor: 'Borders on neutral fills' },
  { fg: '--color-danger', bg: '--color-surface', kind: 'ui', usedFor: 'Invalid Input border' },

  // Focus ring on every surface it can sit on
  { fg: '--color-focus', bg: '--color-bg', kind: 'ui', usedFor: 'Focus ring on the page' },
  { fg: '--color-focus', bg: '--color-surface', kind: 'ui', usedFor: 'Focus ring in cards' },
  { fg: '--color-focus', bg: '--color-surface-neutral', kind: 'ui', usedFor: 'Focus ring on neutral fills' },
];
