import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastPairs } from './contrast-pairs';
import { contrastRatio, parseRootTokens } from './parse-tokens';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const css = read('../src/tokens.css');
const tokens = parseRootTokens(css);
const required = { text: 4.5, ui: 3 } as const;

// The defaults plus two test themes that override them the way a project
// theme does (README step 6). Every pair must pass under each one.
const themes = [
  { theme: 'default', tokens },
  { theme: 'warm-brand', tokens: parseRootTokens(css, read('./themes/warm-brand.css')) },
  { theme: 'dark', tokens: parseRootTokens(css, read('./themes/dark.css')) },
];

describe.each(themes)('contrast under the $theme theme (WCAG 2.2 AA)', ({ tokens: themeTokens }) => {
  it.each(contrastPairs)('$fg on $bg ($kind): $usedFor', ({ fg, bg, kind }) => {
    const fgValue = themeTokens.get(fg);
    const bgValue = themeTokens.get(bg);
    expect(fgValue, `${fg} is not defined`).toBeDefined();
    expect(bgValue, `${bg} is not defined`).toBeDefined();

    const ratio = contrastRatio(fgValue ?? '', bgValue ?? '');
    expect(ratio, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(required[kind]);
  });
});

describe('tokens.css', () => {
  it('defines every color token the pair list relies on', () => {
    const colorTokens = [...tokens.keys()].filter((name) => name.startsWith('--color-'));
    const decorativeOnly = ['--color-border-subtle', '--color-accent-decorative', '--color-attention-fill'];
    const covered = new Set(contrastPairs.flatMap(({ fg, bg }) => [fg, bg]));
    const uncovered = colorTokens.filter((name) => !covered.has(name) && !decorativeOnly.includes(name));
    expect(uncovered).toEqual([]);
  });

  it.each(['warm-brand', 'dark'])('the %s test theme only overrides tokens that exist', (theme) => {
    const overrides = [...parseRootTokens(read(`./themes/${theme}.css`)).keys()];
    // Palette primitives (--brand-*) are the theme's own; everything else must be an Osnova token.
    const unknown = overrides.filter((name) => !name.startsWith('--brand-') && !tokens.has(name));
    expect(unknown).toEqual([]);
  });
});

describe('parseRootTokens', () => {
  it('resolves var() references between tokens', () => {
    const parsed = parseRootTokens(':root { --a: #ffffff; --b: var(--a); }');
    expect(parsed.get('--b')).toBe('#ffffff');
  });

  it('lets a later stylesheet override an earlier one, including references', () => {
    const parsed = parseRootTokens(':root { --a: #ffffff; --b: var(--a); }', ':root { --a: #000000; }');
    expect(parsed.get('--b')).toBe('#000000');
  });

  it('rejects a reference to an undefined token', () => {
    expect(() => parseRootTokens(':root { --b: var(--missing); }')).toThrow('Unknown token reference');
  });
});
