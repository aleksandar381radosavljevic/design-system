import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/registry';
import { cx } from '../internal/cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'attention' | 'danger';

export interface BadgeProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** @default 'neutral' */
  tone?: BadgeTone;
  /** Decorative icon before the text. */
  icon?: IconName;
  /** The label. The text carries the meaning; the tone only reinforces it. */
  children: ReactNode;
}

/** Non-interactive pill label. */
export function Badge({ tone = 'neutral', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx(styles.badge, styles[tone], className)}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}
