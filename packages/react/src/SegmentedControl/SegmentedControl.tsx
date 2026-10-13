import { useId, type ComponentPropsWithRef } from 'react';
import { Icon } from '../Icon/Icon';
import a11y from '../internal/a11y.module.css';
import { cx } from '../internal/cx';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children' | 'onChange'> {
  /** The group's accessible name. */
  legend: string;
  /** `hidden` keeps the legend for screen readers only. @default 'visible' */
  legendDisplay?: 'visible' | 'hidden';
  /** Two to five short options, shown as equal-width segments. */
  options: SegmentedControlOption[];
  /** The selected option's value. */
  value: string;
  onChange: (value: string) => void;
  /** Radio group name. @default generated */
  name?: string;
}

/**
 * Single choice between a few short options. Native radio inputs, so Tab
 * enters the group, arrow keys move and select, and forms see the value.
 */
export function SegmentedControl({
  legend,
  legendDisplay = 'visible',
  options,
  value,
  onChange,
  name,
  className,
  ...rest
}: SegmentedControlProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  return (
    <fieldset {...rest} className={cx(styles.group, className)}>
      <legend className={legendDisplay === 'hidden' ? a11y.visuallyHidden : styles.legend}>{legend}</legend>
      <div className={styles.segments}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label key={option.value} className={styles.segment}>
              <input
                type="radio"
                className={cx(a11y.visuallyHidden, styles.input)}
                name={groupName}
                value={option.value}
                checked={checked}
                disabled={option.disabled}
                onChange={() => { onChange(option.value); }}
              />
              <span className={styles.face}>
                {checked && <Icon name="check" size={16} />}
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
