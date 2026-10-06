import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import { cx } from '../internal/cx';
import { useOsnova } from '../OsnovaProvider/OsnovaContext';
import styles from './Card.module.css';

export type CardElement = 'div' | 'article' | 'section' | 'li';
export type CardPadding = 'default' | 'compact';

export interface CardProps extends Omit<ComponentPropsWithRef<'div'>, 'ref'> {
  /** @default 'div' */
  as?: CardElement;
  /** `default` is `--space-4`, `compact` is `--space-3`. @default 'default' */
  padding?: CardPadding;
  ref?: Ref<HTMLElement>;
}

/** Surface container. Put a `CardLink` inside to make the whole card clickable. */
export function Card({ as = 'div', padding = 'default', className, ref, ...rest }: CardProps) {
  // All four elements accept the same props and are HTMLElements, but React
  // types refs per tag, so the union needs one cast to render.
  const Element = as as 'div';
  return (
    <Element
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      className={cx(styles.card, styles[padding], className)}
    />
  );
}

export interface CardLinkProps extends Omit<ComponentPropsWithRef<'a'>, 'href' | 'children'> {
  href: string;
  /** Usually the card title. It is the link's whole accessible name. */
  children: ReactNode;
}

/**
 * A real link whose click area is stretched over the whole card. Other
 * interactive elements in the card stay separately reachable above it.
 */
export function CardLink({ className, ...rest }: CardLinkProps) {
  const { linkComponent: Link } = useOsnova();
  return <Link {...rest} className={cx(styles.link, className)} />;
}
