import {spawn} from 'node:child_process';

const run = (args, label) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n[all-content-release] ${label}`);
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${label} endete mit Code ${code}.`));
    });
  });

try {
  await run(
    ['scripts/verify-animation-library-release.mjs'],
    'Bestehenden vollständigen Animationsbibliothek-Releasevertrag prüfen',
  );
  await run(
    ['scripts/verify-masterplan-content-release.mjs', '--complete'],
    '22/22 exakte Masterplan-Content-Artefakte prüfen',
  );
  await run(
    ['scripts/check-content-motion-edge-cases.mjs'],
    'Semantische Edge-Case-Verträge prüfen',
  );
  await run(
    ['scripts/check-production-derived-runtime-keys.mjs'],
    'Abgeleitete Runtime-Keys gegen TSX-Komponenten prüfen',
  );

  console.log(
    '\n[all-content-release] Vollständiger technischer Content-Releasevertrag bestanden.',
  );
  console.log(
    '[all-content-release] Zusätzlich weiterhin erforderlich: visuelle manuelle Freigabe der 22 Masterplan-Content-Videos und sechs Edge-Case-Renders.',
  );
} catch (error) {
  console.error('\n[all-content-release] Releaseprüfung fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
