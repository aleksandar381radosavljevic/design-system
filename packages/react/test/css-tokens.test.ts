// @vitest-environment node
// Component styles may only use Osnova tokens, so a project theme that
// overrides tokens restyles every component (the contrast of those tokens is
// checked per theme in packages/tokens). This test fails on a hard-coded
// color, length or font, and on a var() that no token defines.
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const srcDir = new URL('../src/', import.meta.url);
const tokensCss = readFileSync(new URL('../../tokens/src/tokens.css', import.meta.url), 'utf8');
const tokenNames = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));

const modules = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.module.css'))
  .map((file) => ({
    file,
    css: readFileSync(new URL(file, srcDir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
  }));

// Custom properties a component sets itself (from props or per tone), not tokens.
const componentProperties = new Set([
  '--skeleton-width',
  '--skeleton-height',
  '--textarea-max-rows',
  '--banner-accent',
]);

describe.each(modules)('$file', ({ file, css }) => {
  it('references only defined tokens', () => {
    const used = [...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1] ?? '');
    const unknown = used.filter((name) => !tokenNames.has(name) && !componentProperties.has(name));
    expect(unknown).toEqual([]);
  });

  it('hard-codes no colors', () => {
    expect(css.match(/#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch|color-mix)\(/gi)).toBeNull();
  });

  it('hard-codes no absolute lengths', () => {
    const lengths = css.match(/\b\d*\.?\d+(px|rem|pt)\b/g) ?? [];
    // The visually-hidden technique needs a literal 1px box.
    const allowed = file.endsWith('a11y.module.css') ? ['1px', '1px'] : [];
    expect(lengths).toEqual(allowed);
  });

  it('sets fonts, radii and shadows only through tokens', () => {
    const declarations = [...css.matchAll(/(font-family|border-radius|box-shadow)\s*:\s*([^;]+);/g)];
    const literal = declarations.filter(([, , value]) => !/^(var\(--[\w-]+\)|inherit)$/.test(value?.trim() ?? ''));
    expect(literal.map(([declaration]) => declaration)).toEqual([]);
  });
});
