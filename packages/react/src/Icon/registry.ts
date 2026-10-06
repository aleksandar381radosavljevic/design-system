import { Check, CircleQuestionMark, Info, LoaderCircle, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import type { IconName } from 'lucide-react/dynamic';

export type { IconName };

/** Maps Lucide icon names (kebab-case) to Lucide icon components. */
export type IconRegistry = Partial<Record<IconName, LucideIcon>>;

/** Name rendered when a requested icon is not registered. */
export const fallbackIconName = 'circle-help' satisfies IconName;

/**
 * The icons Osnova components render themselves. Always available, so apps
 * only register the icons they use directly.
 */
export const builtInIcons: IconRegistry = {
  check: Check,
  x: X,
  info: Info,
  'triangle-alert': TriangleAlert,
  'loader-circle': LoaderCircle,
  // Lucide 1 renamed circle-help to circle-question-mark; both names stay valid.
  'circle-help': CircleQuestionMark,
};
