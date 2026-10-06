import { useId, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import a11y from '../internal/a11y.module.css';
import { cx } from '../internal/cx';
import styles from './Field.module.css';

/** Label, hint and error props shared by Input and TextArea. */
export interface FieldProps {
  /** Visible label, and the control's accessible name. Never use a placeholder instead. */
  label: ReactNode;
  /** Hides the label visually; it is still announced. For fields with an obvious visual label, such as search. @default false */
  hideLabel?: boolean;
  /** Help text under the label, announced after the label. */
  hint?: ReactNode;
  /** Error message. Sets `aria-invalid` and is announced after the hint. */
  error?: ReactNode;
}

export interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
}

interface FieldRenderProps extends FieldProps {
  /** The control's own `id`, if the caller passed one. */
  id: string | undefined;
  /** Caller's `aria-describedby`, kept after the hint and error ids. */
  describedBy: string | undefined;
  className: string | undefined;
  children: (control: FieldControlProps) => ReactNode;
}

/** Internal: lays out label, control, hint and error and wires their ids. */
export function Field({ label, hideLabel = false, hint, error, id, describedBy, className, children }: FieldRenderProps) {
  const generatedId = useId();
  const controlId = id ?? `${generatedId}-control`;
  const hintId = `${generatedId}-hint`;
  const errorId = `${generatedId}-error`;
  const hasHint = hint !== undefined && hint !== null && hint !== false;
  const hasError = error !== undefined && error !== null && error !== false;
  const describedByIds = [hasHint && hintId, hasError && errorId, describedBy].filter(Boolean).join(' ');

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={controlId} className={hideLabel ? a11y.visuallyHidden : styles.label}>
        {label}
      </label>
      {hasHint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({
        id: controlId,
        'aria-describedby': describedByIds || undefined,
        'aria-invalid': hasError || undefined,
      })}
      {hasError && (
        <p id={errorId} className={styles.error}>
          <span className={styles.errorIcon}>
            <Icon name="triangle-alert" size={16} />
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
