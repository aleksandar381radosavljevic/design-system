import type { ComponentPropsWithRef } from 'react';
import { Field, type FieldProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/registry';
import { cx } from '../internal/cx';
import styles from './Input.module.css';

export interface InputProps extends FieldProps, Omit<ComponentPropsWithRef<'input'>, 'children'> {
  /** Decorative icon inside the field, before the text. */
  iconStart?: IconName;
}

/**
 * Text field with its label, hint and error. `className` goes on the outer
 * wrapper (for layout); every other prop, including `ref`, goes on the `<input>`.
 */
export function Input({
  label,
  hideLabel,
  hint,
  error,
  iconStart,
  id,
  className,
  'aria-describedby': describedBy,
  ...rest
}: InputProps) {
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
        <div className={styles.wrapper}>
          {iconStart && <Icon name={iconStart} className={styles.icon} />}
          <input
            {...rest}
            {...control}
            className={cx(fieldStyles.control, iconStart && styles.withIcon)}
          />
        </div>
      )}
    </Field>
  );
}
