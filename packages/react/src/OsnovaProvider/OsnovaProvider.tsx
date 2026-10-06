import { useMemo, type ReactNode } from 'react';
import { builtInIcons, type IconRegistry } from '../Icon/registry';
import { OsnovaContext, type LinkComponent } from './OsnovaContext';

export interface OsnovaProviderProps {
  /**
   * Component that renders links in Button (`href`) and CardLink. Pass a router
   * link (for example Next.js `Link`) for client-side navigation.
   * @default 'a'
   */
  linkComponent?: LinkComponent;
  /**
   * The Lucide icons the app renders by name, for example
   * `{ 'chevron-right': ChevronRight }`. Osnova's own icons are always included.
   */
  icons?: IconRegistry;
  children: ReactNode;
}

/** App-wide Osnova settings. Render it once, near the root, in a client component. */
export function OsnovaProvider({ linkComponent = 'a', icons, children }: OsnovaProviderProps) {
  const value = useMemo(
    () => ({ linkComponent, icons: { ...builtInIcons, ...icons } }),
    [linkComponent, icons],
  );
  return <OsnovaContext value={value}>{children}</OsnovaContext>;
}
