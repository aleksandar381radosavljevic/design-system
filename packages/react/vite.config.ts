import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.build.json' })],
  css: {
    modules: {
      // Readable, prefixed class names help debugging; they are still private API.
      generateScopedName: 'osnova-[local]-[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      // All CSS Modules end up in one dist/styles.css that the consumer imports once.
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    // Ship readable code; the consuming app minifies.
    minify: false,
    rolldownOptions: {
      // Peer and runtime dependencies stay imports, so the app bundles one copy.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@aleksandar381radosavljevic\//],
      output: {
        // The bundle is one module, so a per-file directive would be dropped.
        // One 'use client' on the entry makes every component importable from
        // Next.js App Router server components (rendered as client components).
        banner: "'use client';",
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
  },
});
