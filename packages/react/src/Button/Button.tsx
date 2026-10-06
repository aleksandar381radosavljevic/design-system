import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/registry';
import { cx } from '../internal/cx';
import { useOsnova } from '../OsnovaProvider/OsnovaContext';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

interface ButtonOwnProps {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** `md` is 44px high, `lg` 48px. @default 'md' */
  size?: ButtonSize;
  /** Decorative icon before the label. Replaced by a spinner while `loading`. */
  iconStart?: IconName;
  /** Decorative icon after the label. */
  iconEnd?: IconName;
  /** Shows a spinner, sets `aria-busy` and ignores clicks. Focus and label stay. @default false */
  loading?: boolean;
}

/** A visible label, or no label and a required `aria-label` (icon-only button). */
type ButtonContent =
  | { children: ReactNode; 'aria-label'?: string }
  | { children?: never; 'aria-label': string };

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label'> & {
  href?: never;
};

/** Navigation must be a link, and a link cannot be disabled. */
type NativeLinkProps = Omit<ComponentPropsWithRef<'a'>, 'children' | 'aria-label' | 'href' | 'type'> & {
  href: string;
  disabled?: never;
  type?: never;
};

export type ButtonProps = ButtonOwnProps & ButtonContent & (NativeButtonProps | NativeLinkProps);

/**
 * Renders a `<button>` (default `type="button"`), or a link through the
 * provider's `linkComponent` when `href` is given.
 */
export function Button(props: ButtonProps) {
  const { linkComponent: Link } = useOsnova();
  const {
    variant = 'primary',
    size = 'md',
    iconStart,
    iconEnd,
    loading = false,
    className,
    children,
    onClick,
    ...rest
  } = props;

  const classes = cx(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      {loading ? (
        <Icon name="loader-circle" className={styles.spinner} />
      ) : (
        iconStart && <Icon name={iconStart} />
      )}
      {children}
      {iconEnd && <Icon name={iconEnd} />}
    </>
  );

  // While loading, swallow clicks (including Enter and Space, which fire click)
  // but keep the element focusable and its name unchanged.
  const handleClick = (event: MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  if (rest.href !== undefined) {
    const linkProps = rest as NativeLinkProps;
    return (
      <Link
        {...linkProps}
        className={classes}
        aria-busy={loading || undefined}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  const { type = 'button', ...buttonProps } = rest as NativeButtonProps;
  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}
