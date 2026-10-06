import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/registry';
import { cx } from '../internal/cx';
import styles from './EmptyState.module.css';

export type EmptyStateHeadingLevel = 2 | 3 | 4;

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> {
  title: ReactNode;
  /** Must fit the page outline. @default 2 */
  headingLevel?: EmptyStateHeadingLevel;
  description?: ReactNode;
  /** Decorative 24px icon above the title. */
  icon?: IconName;
  /** The next step: a secondary Button or a link. */
  action?: ReactNode;
}

/** Centered "nothing here" block with a real heading and a next step. */
export function EmptyState({
  title,
  headingLevel = 2,
  description,
  icon,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  const Heading = `h${String(headingLevel)}` as 'h2' | 'h3' | 'h4';
  return (
    <div {...rest} className={cx(styles.emptyState, className)}>
      {icon && <Icon name={icon} size={24} className={styles.icon} />}
      <Heading className={styles.title}>{title}</Heading>
      {description !== undefined && <p className={styles.description}>{description}</p>}
      {action !== undefined && <div className={styles.action}>{action}</div>}
    </div>
  );
}
