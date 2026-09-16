import {readdir, stat} from 'node:fs/promises';
import {resolve, relative, basename} from 'node:path';

const repoRoot = resolve(process.env.KI_REEL_STRUCTURE_ROOT ?? '.');
const kiRoot = resolve(repoRoot, 'ki');
const reelsRoot = resolve(kiRoot, 'reels');
const sourceReelsRoot = resolve(kiRoot, 'src', 'reels');

const WEEK_PATTERN = /^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/;
const REEL_PATTERN = /^\d{2}_.+/;
const REQUIRED_REEL_DIRS = [
  '01-script-audio',
  '02-bilder',
  '03-caption',
  '04-pdf',
  '05-export',
  '06-projektdateien',
];
const ROOT_REEL_MARKERS = new Set([
  'brief.json',
  'reel.json',
  'voiceover.md',
  'scene-plan.md',
  'animation-plan.md',
  'subtitle-cues.json',
  'asset-manifest.json',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
]);
const SOURCE_FORBIDDEN_PLANNING_MARKERS = new Set([
  'brief.json',
  'reel.json',
  'voiceover.md',
  'scene-plan.md',
  'animation-plan.md',
  'subtitle-cues.json',
  'asset-manifest.json',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
  'caption.md',
  'audio-plan.md',
  'asset-prompts.md',
]);
const ALLOWED_REELS_ROOT_FILES = new Set([
  'README.md',
  'AGENTS.md',
  'animation-history.json',
  // Globale, reelübergreifende Visual-Regeln. REPO-STATE.md verweist auf
  // REMOTION_NATIVE_VISUALS_MAXIMUM.md ausdrücklich unter diesem Pfad.
  'REMOTION_NATIVE_VISUALS.md',
  'REMOTION_NATIVE_VISUALS_MAXIMUM.md',
  '.gitkeep',
]);

const failures = [];
const display = (path) => relative(repoRoot, path) || '.';

const readDirSafe = async (path) => {
  try {
    return await readdir(path, {withFileTypes: true});
  } catch (error) {
    failures.push(`${display(path)} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
    return [];
  }
};

const directFileNames = async (path) => {
  const entries = await readDirSafe(path);
  return new Set(entries.filter((entry) => entry.isFile()).map((entry) => entry.name));
};

const walkFiles = async (root) => {
  const files = [];
  const entries = await readDirSafe(root);
  for (const entry of entries) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
};

// 1) Reel projects must never live directly below ki/.
for (const entry of await readDirSafe(kiRoot)) {
  if (!entry.isDirectory()) continue;
  if (['reels', 'src'].includes(entry.name)) continue;
  const candidate = resolve(kiRoot, entry.name);
  const files = await directFileNames(candidate);
  const marker = [...ROOT_REEL_MARKERS].find((name) => files.has(name));
  if (marker) {
    failures.push(
      `${display(candidate)} sieht wie ein Reel-Projekt aus (${marker}). ` +
      'Reel-Projekte dürfen niemals direkt unter ki/ liegen. Erwartet: ' +
      'ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/.',
    );
  }
}

// 2) ki/src/reels is executable source only; planning packages are forbidden there.
for (const entry of await readDirSafe(sourceReelsRoot)) {
  if (!entry.isDirectory()) continue;
  const sourcePackage = resolve(sourceReelsRoot, entry.name);
  const files = await walkFiles(sourcePackage);
  for (const path of files) {
    const name = basename(path);
    if (SOURCE_FORBIDDEN_PLANNING_MARKERS.has(name)) {
      failures.push(
        `${display(path)} ist eine Planungsdatei im Source-Bereich. ` +
        'ki/src/reels/<slug>/ ist ausschließlich für ausführbaren TS/TSX-Code, Tests und technische Source-Dateien vorgesehen. ' +
        'Planung gehört unter ki/reels/<Woche>/<Reel>/.',
      );
    }
  }
}

// 3) ki/reels root contains only global control files/templates and weekly folders.
for (const entry of await readDirSafe(reelsRoot)) {
  if (entry.isFile()) {
    if (!ALLOWED_REELS_ROOT_FILES.has(entry.name)) {
      failures.push(`${display(resolve(reelsRoot, entry.name))} ist auf der falschen Ebene; hier sind nur globale Reel-Steuerdateien erlaubt.`);
    }
    continue;
  }
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_')) continue;
  if (!WEEK_PATTERN.test(entry.name)) {
    failures.push(
      `${display(resolve(reelsRoot, entry.name))} ist kein gültiger Wochenordner. ` +
      'Erwartetes Format: YYYY-MM-DD_bis_YYYY-MM-DD.',
    );
    continue;
  }

  const weekRoot = resolve(reelsRoot, entry.name);
  for (const reelEntry of await readDirSafe(weekRoot)) {
    if (!reelEntry.isDirectory()) {
      failures.push(`${display(resolve(weekRoot, reelEntry.name))} liegt direkt im Wochenordner. Dort sind nur NN_Reel-Titel/-Ordner erlaubt.`);
      continue;
    }
    if (!REEL_PATTERN.test(reelEntry.name)) {
      failures.push(`${display(resolve(weekRoot, reelEntry.name))} benötigt das Format NN_Reel-Titel.`);
      continue;
    }

    const reelRoot = resolve(weekRoot, reelEntry.name);
    const reelEntries = await readDirSafe(reelRoot);
    const childDirs = new Set(reelEntries.filter((child) => child.isDirectory()).map((child) => child.name));
    const childFiles = new Set(reelEntries.filter((child) => child.isFile()).map((child) => child.name));

    if (!childFiles.has('README.md')) failures.push(`${display(reelRoot)}: README.md fehlt.`);
    for (const required of REQUIRED_REEL_DIRS) {
      if (!childDirs.has(required)) failures.push(`${display(reelRoot)}: Pflichtordner ${required}/ fehlt.`);
    }

    const flatPlanning = [...ROOT_REEL_MARKERS].filter((name) => childFiles.has(name));
    if (flatPlanning.length > 0) {
      failures.push(
        `${display(reelRoot)} enthält flache Planungsdateien (${flatPlanning.join(', ')}). ` +
        'Skript/Audio -> 01, Bilder -> 02, Caption -> 03, PDF -> 04, Export -> 05, Planung/Technik -> 06.',
      );
    }
  }
}

if (failures.length > 0) {
  console.error('KI-Reel-Strukturvertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'KI-Reel-Strukturvertrag bestanden: keine Reel-Projekte im ki/-Root, Source und Planung getrennt, Wochenordner gültig und jedes Reel besitzt die feste 01–06-Produktionsstruktur.',
);
