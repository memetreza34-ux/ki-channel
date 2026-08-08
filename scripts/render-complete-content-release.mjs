import {spawn} from 'node:child_process';

const runCanonicalRelease = () =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      ['scripts/render-all-content-release.mjs'],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: process.env,
      },
    );
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(
        new Error(
          `Kanonischer All-Content-Renderlauf endete mit Code ${code}.`,
        ),
      );
    });
  });

console.warn(
  '[complete-content-render] DEPRECATED: Dieser Kompatibilitätsbefehl delegiert vollständig an scripts/render-all-content-release.mjs.',
);
console.warn(
  '[complete-content-render] Production-Derived-Only-Artefakte sind kein vollständiger Produktionsrelease, weil der kanonische Pfad Deriver -> Sanitizer -> Association -> Render-Props verlangt.',
);

try {
  await runCanonicalRelease();
} catch (error) {
  console.error('\n[complete-content-render] Kanonischer Renderlauf fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
