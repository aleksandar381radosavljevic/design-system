import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { Field, type FieldProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { cx } from '../internal/cx';
import styles from './TextArea.module.css';

export interface TextAreaProps extends FieldProps, Omit<ComponentPropsWithRef<'textarea'>, 'children'> {
  /**
   * Grow with the content up to this many rows, then scroll. `rows` stays the
   * minimum. Uses CSS `field-sizing`; browsers without it keep the `rows` height.
   */
  autoGrow?: number;
}

/**
 * Multi-line text field with its label, hint and error. `className` goes on the
 * outer wrapper; every other prop, including `ref`, goes on the `<textarea>`.
 */
export function TextArea({
  label,
  hideLabel,
  hint,
  error,
  autoGrow,
  id,
  className,
  style,
  'aria-describedby': describedBy,
  ...rest
}: TextAreaProps) {
  const growStyle =
    autoGrow === undefined ? style : ({ '--textarea-max-rows': autoGrow, ...style } as CSSProperties);
  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      id={id}
      describedBy={describedBy}
      className={className}
    >
      {(control) => (
        <textarea
          {...rest}
          {...control}
          style={growStyle}
          className={cx(fieldStyles.control, styles.textArea, autoGrow !== undefined && styles.autoGrow)}
        />
      )}
    </Field>
  );
}
