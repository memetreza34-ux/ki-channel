import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  MOTION_SOURCE_FILES,
  MOTION_SOURCE_FINGERPRINT,
} from '../motion-source-fingerprint.mjs';

describe('Motion-Quellstand-Fingerprint', () => {
  it('erzeugt einen stabilen SHA-256-Wert', () => {
    assert.match(MOTION_SOURCE_FINGERPRINT, /^[a-f0-9]{64}$/);
  });

  it('verwendet eine eindeutige sortierte Dateiliste', () => {
    assert.deepEqual(
      MOTION_SOURCE_FILES,
      [...MOTION_SOURCE_FILES].sort((left, right) => left.localeCompare(right)),
    );
    assert.equal(new Set(MOTION_SOURCE_FILES).size, MOTION_SOURCE_FILES.length);
  });

  it('deckt Runtime, Stage, Render-Skripte und Konfiguration ab', () => {
    const requiredFiles = [
      'ki/src/motion-system/runtime.ts',
      'ki/src/motion-system/production.ts',
      'ki/src/motion-system/MotionStage.tsx',
      'ki/src/motion-system/render-config.json',
      'scripts/motion-source-fingerprint.mjs',
      'scripts/render-motion-system.mjs',
      'scripts/check-motion-renders.mjs',
      'package.json',
      'ki/tsconfig.motion.json',
    ];

    for (const path of requiredFiles) {
      assert.ok(MOTION_SOURCE_FILES.includes(path), `${path} fehlt im Quellstand-Fingerprint.`);
    }
  });

  it('enthält keine generierten Ausgabedateien', () => {
    assert.equal(
      MOTION_SOURCE_FILES.some((path) => path.startsWith('out/')),
      false,
    );
  });
});
