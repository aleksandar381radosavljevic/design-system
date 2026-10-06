import { createContext, use, type AnchorHTMLAttributes, type ElementType, type Ref } from 'react';
import { builtInIcons, type IconRegistry } from '../Icon/registry';

/** Props Osnova passes to the link component (`<a>`, or a router link such as Next.js `Link`). */
export type LinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export type LinkComponent = ElementType<LinkComponentProps>;

export interface OsnovaContextValue {
  linkComponent: LinkComponent;
  icons: IconRegistry;
}

const defaultValue: OsnovaContextValue = { linkComponent: 'a', icons: builtInIcons };

export const OsnovaContext = createContext<OsnovaContextValue>(defaultValue);

export function useOsnova(): OsnovaContextValue {
  return use(OsnovaContext);
}
