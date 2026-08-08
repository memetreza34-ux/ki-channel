import {spawn} from 'node:child_process';

const run = (command, args, label) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n[complete-content-release] ${label}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`${label} endete mit Code ${code}.`));
    });
  });

try {
  await run(
    'node',
    ['scripts/verify-animation-library-release.mjs'],
    'Bestehenden vollständigen Animationsbibliothek-Releasevertrag prüfen',
  );
  await run(
    'node',
    ['scripts/verify-production-derived-content.mjs', '--complete'],
    '22/22 Production-Derived-Content-Artefakte prüfen',
  );
  await run(
    'node',
    ['scripts/check-content-motion-edge-cases.mjs'],
    'Semantische Edge-Case-Verträge erneut statisch prüfen',
  );
  await run(
    'node',
    ['scripts/check-production-derived-runtime-keys.mjs'],
    'Abgeleitete Runtime-Keys gegen TSX-Komponenten prüfen',
  );

  console.log(
    '\n[complete-content-release] Vollständiger technischer Content-Releasevertrag bestanden.',
  );
  console.log(
    '[complete-content-release] Zusätzlich weiterhin erforderlich: visuelle manuelle Freigabe der 22 Production-Derived-Videos und sechs Edge-Case-Renders.',
  );
} catch (error) {
  console.error('\n[complete-content-release] Releaseprüfung fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
