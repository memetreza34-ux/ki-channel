import {spawn} from 'node:child_process';

const runCanonicalVerification = () =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      ['scripts/verify-all-content-release.mjs'],
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
          `Kanonische All-Content-Verifikation endete mit Code ${code}.`,
        ),
      );
    });
  });

console.warn(
  '[complete-content-release] DEPRECATED: Dieser Kompatibilitätsbefehl delegiert vollständig an scripts/verify-all-content-release.mjs.',
);
console.warn(
  '[complete-content-release] Ein Production-Derived-Only-Manifest ist keine vollständige Produktionsfreigabe; verifiziert wird ausschließlich der kanonische Deriver -> Sanitizer -> Association -> Render-Props-Pfad.',
);

try {
  await runCanonicalVerification();
} catch (error) {
  console.error('\n[complete-content-release] Kanonische Releaseprüfung fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
