import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastPairs } from './contrast-pairs';
import { contrastRatio, parseRootTokens } from './parse-tokens';

const css = readFileSync(new URL('../src/tokens.css', import.meta.url), 'utf8');
const tokens = parseRootTokens(css);
const required = { text: 4.5, ui: 3 } as const;

describe('tokens.css contrast (WCAG 2.2 AA)', () => {
  it.each(contrastPairs)('$fg on $bg ($kind): $usedFor', ({ fg, bg, kind }) => {
    const fgValue = tokens.get(fg);
    const bgValue = tokens.get(bg);
    expect(fgValue, `${fg} is not defined`).toBeDefined();
    expect(bgValue, `${bg} is not defined`).toBeDefined();

    const ratio = contrastRatio(fgValue ?? '', bgValue ?? '');
    expect(ratio, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(required[kind]);
  });

  it('defines every color token the pair list relies on', () => {
    const colorTokens = [...tokens.keys()].filter((name) => name.startsWith('--color-'));
    const decorativeOnly = ['--color-border-subtle', '--color-accent-decorative', '--color-attention-fill'];
    const covered = new Set(contrastPairs.flatMap(({ fg, bg }) => [fg, bg]));
    const uncovered = colorTokens.filter((name) => !covered.has(name) && !decorativeOnly.includes(name));
    expect(uncovered).toEqual([]);
  });
});

describe('parseRootTokens', () => {
  it('resolves var() references between tokens', () => {
    const parsed = parseRootTokens(':root { --a: #ffffff; --b: var(--a); }');
    expect(parsed.get('--b')).toBe('#ffffff');
  });

  it('rejects a reference to an undefined token', () => {
    expect(() => parseRootTokens(':root { --b: var(--missing); }')).toThrow('Unknown token reference');
  });
});
