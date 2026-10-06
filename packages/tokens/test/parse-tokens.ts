/**
 * Reads the custom properties of the first `:root` block in each stylesheet and
 * resolves `var()` references between them. Later stylesheets override earlier
 * ones, the way a project theme overrides tokens.css. Deliberately small: it
 * handles the shape of tokens.css and theme files, not arbitrary CSS.
 */
export function parseRootTokens(...stylesheets: string[]): Map<string, string> {
  const raw = new Map<string, string>();
  for (const css of stylesheets) {
    for (const [name, value] of readRootBlock(css)) raw.set(name, value);
  }

  const resolve = (value: string, seen: Set<string>): string =>
    value.replace(/var\((--[\w-]+)\)/g, (_, ref: string) => {
      if (seen.has(ref)) throw new Error(`Circular token reference: ${ref}`);
      const next = raw.get(ref);
      if (next === undefined) throw new Error(`Unknown token reference: ${ref}`);
      return resolve(next, new Set([...seen, ref]));
    });

  return new Map([...raw].map(([name, value]) => [name, resolve(value, new Set([name]))]));
}

function readRootBlock(css: string): [string, string][] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const start = source.indexOf(':root');
  if (start === -1) throw new Error('No :root block found');
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  const body = source.slice(open + 1, close);

  const entries: [string, string][] = [];
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name, value] = match;
    if (name && value) entries.push([name, value.trim()]);
  }
  return entries;
}

/** WCAG 2.x contrast ratio between two 6-digit hex colors. */
export function contrastRatio(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Expected a 6-digit hex color, got "${hex}"`);
  const digits = match[1];
  const channel = (offset: number) => {
    const c = parseInt(digits.slice(offset, offset + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}
