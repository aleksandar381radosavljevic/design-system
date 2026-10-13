import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Completed amount. Clamped to `0..max`. */
  value: number;
  /** Total amount. Must be greater than 0. */
  max: number;
  /** Visible text, for example "1 / 4 completed". It is also the bar's accessible name. */
  label: ReactNode;
}

/**
 * Native `<progress>` with a visible label. Announcing changes is the app's
 * job (one page-level live region), so the bar itself stays silent.
 */
export function ProgressBar({ value, max, label, className, ...rest }: ProgressBarProps) {
  const labelId = useId();
  const clamped = Math.min(Math.max(value, 0), max);
  return (
    <div {...rest} className={cx(styles.progress, className)}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <progress className={styles.bar} value={clamped} max={max} aria-labelledby={labelId} />
    </div>
  );
}
