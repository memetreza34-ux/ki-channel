import { defineConfig } from 'vitest/config';

// Nur repository-eigene Vitest-Suiten ausführen. Fremdvorlagen und generierte
// Artefakte bleiben ausgeschlossen. Der aktive Kanal liegt unter `ki/`; die alte
// `channels/*`-Struktur ist nicht mehr Teil dieses Repositories.
export default defineConfig({
  test: {
    include: [
      'core/**/*.{test,spec}.{ts,tsx}',
      'ki/**/*.{test,spec}.{ts,tsx}',
      'scripts/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/whisper.cpp/**',
      '**/dist/**',
      '**/out/**',
      '**/_archive/**',
      '**/vendor-templates/**',
    ],
  },
});
