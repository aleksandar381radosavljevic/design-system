import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/registry';
import { cx } from '../internal/cx';
import styles from './Banner.module.css';

export type BannerTone = 'info' | 'warning' | 'success' | 'error';
export type BannerLive = 'off' | 'polite' | 'assertive';

const toneIcons: Record<BannerTone, IconName> = {
  info: 'info',
  warning: 'triangle-alert',
  success: 'check',
  error: 'triangle-alert',
};

const liveRoles: Record<BannerLive, 'status' | 'alert' | undefined> = {
  off: undefined,
  polite: 'status',
  assertive: 'alert',
};

/** A dismissible banner needs an accessible name for its close button. */
type BannerDismiss =
  | { onDismiss?: undefined; dismissLabel?: undefined }
  | { onDismiss: () => void; dismissLabel: string };

export type BannerProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> &
  BannerDismiss & {
    /** @default 'info' */
    tone?: BannerTone;
    title?: ReactNode;
    children: ReactNode;
    /** Decorative icon. @default per tone: info, triangle-alert, check, triangle-alert */
    icon?: IconName;
    /**
     * `polite` adds `role="status"`, `assertive` adds `role="alert"`. Use them
     * only for a banner that appears after a user action, never on page load.
     * @default 'off'
     */
    live?: BannerLive;
    /** A link or a ghost Button. */
    action?: ReactNode;
  };

/** Inline message block. Stays until the user dismisses it; never auto-dismisses. */
export function Banner({
  tone = 'info',
  title,
  children,
  icon,
  live = 'off',
  action,
  onDismiss,
  dismissLabel,
  className,
  ...rest
}: BannerProps) {
  return (
    <div role={liveRoles[live]} {...rest} className={cx(styles.banner, styles[tone], className)}>
      <span className={styles.iconSlot}>
        <Icon name={icon ?? toneIcons[tone]} />
      </span>
      <div className={styles.content}>
        {title !== undefined && <div className={styles.title}>{title}</div>}
        <div className={styles.body}>{children}</div>
        {action !== undefined && <div className={styles.action}>{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label={dismissLabel} onClick={onDismiss}>
          <Icon name="x" />
        </button>
      )}
    </div>
  );
}
