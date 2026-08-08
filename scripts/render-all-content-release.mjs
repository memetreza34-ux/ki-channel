import {spawn} from 'node:child_process';

const run = (args, label) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n[all-content-render] ${label}`);
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
    ['scripts/render-animation-library.mjs', 'all'],
    'Bestehende vollständige Animationsbibliothek-Matrix rendern',
  );
  await run(
    ['scripts/render-masterplan-content-release.mjs', 'all'],
    '22/22 exakte Masterplan-Content-Kompositionen rendern',
  );
  await run(
    ['scripts/render-content-motion-edge-cases.mjs', 'all'],
    'Sechs semantische Edge-Case-Kompositionen rendern',
  );

  console.log('\n[all-content-render] Alle Release-Artefakte wurden erzeugt.');
  console.log(
    '[all-content-render] Danach ausführen: node scripts/verify-all-content-release.mjs',
  );
} catch (error) {
  console.error('\n[all-content-render] Renderlauf fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
