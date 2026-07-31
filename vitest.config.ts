import { defineConfig } from 'vitest/config';

// Nur unsere eigenen Tests ausführen. whisper.cpp und importierte Fremdvorlagen
// bringen eigene Test-Suiten mit, die nicht Teil der Studio-Produktionslogik sind.
// Eigene Core-, Kanal- und Script-Tests bleiben vollständig aktiv.
export default defineConfig({
  test: {
    include: ['core/**/*.{test,spec}.{ts,tsx}', 'channels/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/whisper.cpp/**',
      '**/dist/**',
      '**/out/**',
      '**/_archive/**',
      '**/vendor-templates/**',
      '**/core/gehirn/templates/remotion-bits/**',
    ],
  },
});
