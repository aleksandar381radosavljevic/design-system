import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import { useOsnova } from '../OsnovaProvider/OsnovaContext';
import styles from './IllustratedCard.module.css';

export type IllustratedCardTone =
  | 'neutral'
  | 'category-1'
  | 'category-2'
  | 'category-3'
  | 'category-4'
  | 'category-5'
  | 'category-6';
export type IllustratedCardVariant = 'tile' | 'sticker';
export type IllustratedCardHeadingLevel = 2 | 3 | 4;

const maxTilt = 8;

export interface IllustratedCardProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> {
  href: string;
  /** The link's whole accessible name. */
  title: string;
  /** Decorative artwork above the title; hidden from screen readers. */
  illustration: ReactNode;
  /** One short line under the title, such as a duration. Always visible. */
  meta?: ReactNode;
  /** Tints the illustration area (and the whole `tile`) with a category's `-soft` color. @default 'neutral' */
  tone?: IllustratedCardTone;
  /** @default 'tile' */
  variant?: IllustratedCardVariant;
  /** Rotation in degrees for `sticker`, clamped to -8..8; ignored for `tile`. @default 0 */
  tilt?: number;
  /** Must fit the page outline. @default 3 */
  headingLevel?: IllustratedCardHeadingLevel;
}

/** A card-sized link with an illustration, a title and an optional meta line. */
export function IllustratedCard({
  href,
  title,
  illustration,
  meta,
  tone = 'neutral',
  variant = 'tile',
  tilt = 0,
  headingLevel = 3,
  className,
  style,
  ...rest
}: IllustratedCardProps) {
  const { linkComponent: Link } = useOsnova();
  const Heading = `h${String(headingLevel)}` as 'h2' | 'h3' | 'h4';
  // The tilt goes through a custom property so the stylesheet owns the
  // transform and can straighten the sticker on hover, focus and reduced motion.
  const degrees = variant === 'sticker' ? Math.max(-maxTilt, Math.min(maxTilt, tilt)) : 0;
  const tiltStyle = { '--osnova-tilt': `${String(degrees)}deg` } as CSSProperties;

  return (
    <div
      {...rest}
      style={{ ...tiltStyle, ...style }}
      className={cx(styles.card, styles[variant], styles[tone], className)}
    >
      {variant === 'sticker' && <span aria-hidden="true" className={styles.tape} />}
      <div aria-hidden="true" className={styles.art}>
        {illustration}
      </div>
      <div className={styles.body}>
        <Heading className={styles.title}>
          <Link href={href} className={styles.link}>
            {title}
          </Link>
        </Heading>
        {meta !== undefined && <p className={styles.meta}>{meta}</p>}
      </div>
    </div>
  );
}
