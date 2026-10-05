// Copies the framework-free stylesheet to dist/. There is nothing to compile;
// dist/ exists so the published layout does not change if a build step is added later.
import { copyFile, mkdir, rm } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(new URL('../src/tokens.css', import.meta.url), new URL('tokens.css', dist));
console.log('tokens: wrote dist/tokens.css');
