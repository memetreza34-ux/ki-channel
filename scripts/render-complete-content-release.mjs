import {spawn} from 'node:child_process';

const run = (command, args, label) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n[complete-content-render] ${label}`);
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
    ['scripts/render-animation-library.mjs', 'all'],
    'Bestehende vollständige Animationsbibliothek-Releaseartefakte rendern',
  );
  await run(
    'node',
    ['scripts/render-production-derived-content.mjs', 'all'],
    '22/22 Production-Derived-Content-Kompositionen rendern',
  );
  await run(
    'node',
    ['scripts/render-content-motion-edge-cases.mjs', 'all'],
    'Sechs semantische Edge-Case-Kompositionen rendern',
  );

  console.log(
    '\n[complete-content-render] Alle Standard-, Production-Derived- und Edge-Case-Artefakte wurden erzeugt.',
  );
  console.log(
    '[complete-content-render] Danach ausführen: node scripts/verify-complete-content-release.mjs',
  );
} catch (error) {
  console.error('\n[complete-content-render] Renderlauf fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
