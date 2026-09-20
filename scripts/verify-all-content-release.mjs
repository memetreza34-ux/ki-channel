import {spawn} from 'node:child_process';
import {CONTENT_REVIEW_COUNTS} from './content-review-contract.mjs';

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
    ['scripts/verify-content-motion-edge-case-renders.mjs', 'full'],
    'Sechs semantische Edge-Case-Renders inklusive PNG/MP4 und Props prüfen',
  );
  await run(
    ['scripts/check-creative-recipe-renders.mjs'],
    `${CONTENT_REVIEW_COUNTS.recipe} Creative-Recipe-Renders gegen Source-Fingerprint und Artefaktvertrag prüfen`,
  );
  await run(
    ['scripts/check-production-derived-runtime-keys.mjs'],
    'Abgeleitete Runtime-Keys gegen TSX-Komponenten prüfen',
  );
  await run(
    ['scripts/check-canonical-content-release-paths.mjs'],
    'Kanonische Release-Topologie prüfen',
  );
  await run(
    ['scripts/verify-content-review-gallery.mjs', 'full'],
    `Vollständigkeit der ${CONTENT_REVIEW_COUNTS.total}-Karten Full-Review-Galerie inklusive Creative Recipes prüfen`,
  );

  console.log('\n[all-content-release] Vollständiger technischer Content-Releasevertrag bestanden.');
  console.log(`[all-content-release] Zusätzlich erforderlich: ${CONTENT_REVIEW_COUNTS.total}/${CONTENT_REVIEW_COUNTS.total} Karten der Review-Galerie manuell visuell freigeben; technische Galerie-Vollständigkeit ist kein visuelles Qualitätsurteil.`);
} catch (error) {
  console.error('\n[all-content-release] Releaseprüfung fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
