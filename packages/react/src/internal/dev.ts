// Bundlers replace `process.env.NODE_ENV` at build time (Vite, Next.js, webpack,
// esbuild), so this check and the warning text disappear from production builds.
// Declared locally so the source does not depend on Node.js types.
declare const process: { env: { NODE_ENV?: string } };

export function warnInDevelopment(message: string): void {
  let isDevelopment = false;
  try {
    isDevelopment = process.env.NODE_ENV !== 'production';
  } catch {
    // No bundler replacement and no `process` global: treat as production.
  }
  if (isDevelopment) console.warn(`[osnova] ${message}`);
}
