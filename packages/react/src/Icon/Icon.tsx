import type { ComponentPropsWithRef } from 'react';
import { cx } from '../internal/cx';
import { warnInDevelopment } from '../internal/dev';
import { useOsnova } from '../OsnovaProvider/OsnovaContext';
import styles from './Icon.module.css';
import { builtInIcons, fallbackIconName, type IconName } from './registry';

export type IconSize = 16 | 20 | 24;

export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** Lucide icon name in kebab-case. It must be registered in `OsnovaProvider` `icons`. */
  name: IconName;
  /** @default 20 */
  size?: IconSize;
  /**
   * Accessible name. Without it the icon is decorative (`aria-hidden`) and the
   * text next to it carries the meaning.
   */
  label?: string;
}

const warned = new Set<string>();

/** Renders a registered Lucide icon by name as an inline SVG in `currentColor`. */
export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  const { icons } = useOsnova();
  let Component = icons[name];
  if (!Component) {
    if (!warned.has(name)) {
      warned.add(name);
      warnInDevelopment(
        `Icon "${name}" is not registered, so "${fallbackIconName}" is shown instead. ` +
          `Add it to the icons passed to <OsnovaProvider icons={...}>.`,
      );
    }
    Component = icons[fallbackIconName] ?? builtInIcons[fallbackIconName];
  }
  if (!Component) return null;

  const a11y =
    label === undefined ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': label };

  return <Component size={size} className={cx(styles.icon, className)} {...a11y} {...rest} />;
}
