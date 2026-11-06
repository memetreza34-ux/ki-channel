import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['studio/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/whisper.cpp/**', '**/out/**'],
  },
});
