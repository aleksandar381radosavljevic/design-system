import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import a11y from '../internal/a11y.module.css';
import { cx } from '../internal/cx';
import styles from './Skeleton.module.css';

export type SkeletonShape = 'text' | 'block' | 'circle';

export interface SkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** @default 'text' */
  shape?: SkeletonShape;
  /** CSS length, for example `'12rem'` or `'60%'`. @default '100%' */
  width?: string;
  /** CSS length. @default one line of text */
  height?: string;
}

/** Placeholder bar while data loads. Hidden from assistive technology; wrap it in a `SkeletonGroup`. */
export function Skeleton({ shape = 'text', width, height, className, style, ...rest }: SkeletonProps) {
  const sizing = {
    ...(width !== undefined && { '--skeleton-width': width }),
    ...(height !== undefined && { '--skeleton-height': height }),
  } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      {...rest}
      className={cx(styles.skeleton, styles[shape], className)}
      style={{ ...sizing, ...style }}
    />
  );
}

export interface SkeletonGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Announced once for the whole group, for example "Loading tasks…". */
  label: ReactNode;
  children: ReactNode;
}

/** Marks a loading region (`aria-busy`) and gives its skeletons one announced label. */
export function SkeletonGroup({ label, className, children, ...rest }: SkeletonGroupProps) {
  return (
    <div aria-busy="true" {...rest} className={cx(styles.group, className)}>
      <span className={a11y.visuallyHidden}>{label}</span>
      {children}
    </div>
  );
}
