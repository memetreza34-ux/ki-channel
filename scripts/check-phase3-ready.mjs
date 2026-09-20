import {readdir, readFile, stat} from 'node:fs/promises';
import {basename, relative, resolve} from 'node:path';

/**
 * Phase-3-Preflight.
 *
 * Phase 3 (Codex / Antigravity) darf erst starten, wenn Phase 1 wirklich
 * fertig ist und ein echtes Voiceover vorliegt. Bisher stand diese Regel nur
 * in den Verträgen — dieses Gate setzt sie durch.
 *
 *   node scripts/check-phase3-ready.mjs                 -> Übersicht aller Pakete
 *   node scripts/check-phase3-ready.mjs <paket-pfad>    -> ein Paket, Exit 1 wenn blockiert
 *
 * Audio ist absichtlich gitignored. Dieses Gate ist deshalb ein lokaler
 * Preflight, kein CI-Schritt.
 */

const repoRoot = resolve(process.env.KI_PHASE3_ROOT ?? '.');
const display = (path) => relative(repoRoot, path) || '.';

const AUDIO_NAMES = ['voiceover.wav', 'voiceover.mp3', 'voiceover.m4a', 'voiceover.mp4'];
const PLACEHOLDER_MARKERS = [
  'PHASE 1 MUSS DIESE DATEI',
  '**Status:** OFFEN',
  'Status: OFFEN',
];

const REEL_REQUIRED = [
  '01-script-audio/voiceover.md',
  '01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt',
  '03-caption/platform-copy.md',
  '06-projektdateien/PHASE-STATUS.md',
];
const LONGFORM_REQUIRED = [
  '01-script-audio/voiceover.md',
  '01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt',
  '04-metadata/youtube.md',
  '06-projektdateien/PHASE-STATUS.md',
  '06-projektdateien/longform.json',
];

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const readTextSafe = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
};

const findPackages = async (root, depth) => {
  const found = [];
  const top = await readdir(root, {withFileTypes: true}).catch(() => []);
  for (const entry of top) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    const level1 = resolve(root, entry.name);
    if (depth === 1) {
      if (/^\d{2}_/.test(entry.name)) found.push(level1);
      continue;
    }
    for (const child of await readdir(level1, {withFileTypes: true}).catch(() => [])) {
      if (child.isDirectory() && /^\d{2}_/.test(child.name)) {
        found.push(resolve(level1, child.name));
      }
    }
  }
  return found.sort();
};

const inspectPackage = async (packageRoot) => {
  const isLongform = packageRoot.includes(`${'youtube-longform'}`);
  const required = isLongform ? LONGFORM_REQUIRED : REEL_REQUIRED;
  const blockers = [];

  // Phase 1: Pflichtdateien vorhanden?
  const missingFiles = [];
  for (const relativePath of required) {
    if (!(await exists(resolve(packageRoot, relativePath)))) missingFiles.push(relativePath);
  }
  if (missingFiles.length > 0) {
    blockers.push(`PHASE 1 UNVOLLSTAENDIG — fehlende Dateien: ${missingFiles.join(', ')}`);
  }

  // Phase 1: Platzhalter noch drin?
  const placeholderFiles = [];
  for (const relativePath of required) {
    const text = await readTextSafe(resolve(packageRoot, relativePath));
    if (text && PLACEHOLDER_MARKERS.some((marker) => text.includes(marker))) {
      placeholderFiles.push(relativePath);
    }
  }
  if (placeholderFiles.length > 0) {
    blockers.push(
      `PHASE 1 UNVOLLSTAENDIG — noch im Status OFFEN / Platzhalter: ${placeholderFiles.join(', ')}`,
    );
  }

  // Phase 2: echtes Voiceover vorhanden?
  let audioFile = null;
  for (const name of AUDIO_NAMES) {
    const candidate = resolve(packageRoot, '01-script-audio', name);
    if (await exists(candidate)) {
      audioFile = candidate;
      break;
    }
  }
  if (!audioFile) {
    blockers.push('PHASE 2 AUDIO FEHLT');
  } else {
    const info = await stat(audioFile);
    if (info.size < 32 * 1024) {
      blockers.push(
        `PHASE 2 AUDIO UNGUELTIG — ${basename(audioFile)} ist nur ${info.size} Bytes gross ` +
        'und kann kein echtes Voiceover sein.',
      );
    }
  }

  return {packageRoot, isLongform, blockers, audioFile};
};

const [requested] = process.argv.slice(2);

if (requested) {
  const packageRoot = resolve(repoRoot, requested);
  if (!(await exists(packageRoot))) {
    console.error(`Paket nicht gefunden: ${display(packageRoot)}`);
    process.exit(1);
  }
  const result = await inspectPackage(packageRoot);
  if (result.blockers.length === 0) {
    console.log(`Phase-3-Preflight bestanden: ${display(packageRoot)}`);
    console.log(`Voiceover: ${display(result.audioFile)}`);
    console.log('Phase 3 darf starten.');
    process.exit(0);
  }
  console.error(`Phase 3 darf fuer ${display(packageRoot)} NICHT starten:`);
  for (const blocker of result.blockers) console.error(`- ${blocker}`);
  console.error('');
  console.error('Verbindlich: ki/gehirn/PRODUKTIONSABLAUF.md, Abschnitt "Stop-Bedingungen".');
  process.exit(1);
}

// Ohne Argument: Uebersicht ueber alle Produktionspakete.
const packages = [
  ...(await findPackages(resolve(repoRoot, 'ki', 'reels'), 2)),
  ...(await findPackages(resolve(repoRoot, 'ki', 'youtube-longform'), 2)),
];

if (packages.length === 0) {
  console.log('Keine Produktionspakete gefunden.');
  process.exit(0);
}

let ready = 0;
console.log('Phase-3-Bereitschaft je Produktionspaket:');
console.log('');
for (const packageRoot of packages) {
  const result = await inspectPackage(packageRoot);
  const label = display(packageRoot);
  if (result.blockers.length === 0) {
    ready += 1;
    console.log(`  BEREIT      ${label}`);
    continue;
  }
  console.log(`  BLOCKIERT   ${label}`);
  for (const blocker of result.blockers) console.log(`              ${blocker}`);
}
console.log('');
console.log(`${ready} von ${packages.length} Paketen sind bereit fuer Phase 3.`);
console.log('Einzelpruefung: node scripts/check-phase3-ready.mjs <paket-pfad>');
