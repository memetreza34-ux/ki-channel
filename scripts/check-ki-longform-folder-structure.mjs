import {access, readdir} from 'node:fs/promises';
import {basename, dirname, relative, resolve} from 'node:path';

const repoRoot = resolve(process.env.KI_LONGFORM_STRUCTURE_ROOT ?? '.');
const kiRoot = resolve(repoRoot, 'ki');
const longformRoot = resolve(kiRoot, 'youtube-longform');
const sourceLongformRoot = resolve(kiRoot, 'src', 'longform');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VIDEO_PATTERN = /^\d{2}_.+/;
const REQUIRED_VIDEO_DIRS = [
  '01-script-audio',
  '02-visuals',
  '03-thumbnail',
  '04-metadata',
  '05-export',
  '06-projektdateien',
];
const ROOT_VIDEO_MARKERS = new Set([
  'longform.json',
  'voiceover.md',
  'chapter-plan.md',
  'animation-plan.md',
  'visual-plan.md',
  'thumbnail-brief.md',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
  'PHASE-STATUS.md',
]);
const SOURCE_FORBIDDEN_PLANNING_MARKERS = new Set([
  'longform.json',
  'voiceover.md',
  'chapter-plan.md',
  'animation-plan.md',
  'visual-plan.md',
  'thumbnail-brief.md',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
  'PHASE-STATUS.md',
]);
const ALLOWED_LONGFORM_ROOT_FILES = new Set([
  'README.md',
  'AGENTS.md',
  '.gitkeep',
]);

const failures = [];
const display = (path) => relative(repoRoot, path) || '.';

const readDirSafe = async (path, {optional = false} = {}) => {
  try {
    return await readdir(path, {withFileTypes: true});
  } catch (error) {
    if (!optional) {
      failures.push(`${display(path)} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
    }
    return [];
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const walkFiles = async (root) => {
  const files = [];
  for (const entry of await readDirSafe(root, {optional: true})) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
};

// 1) Produktionspakete: ki/youtube-longform/YYYY-MM-DD/NN_Titel/ mit fester 01-06-Struktur.
for (const entry of await readDirSafe(longformRoot, {optional: true})) {
  if (entry.isFile()) {
    if (!ALLOWED_LONGFORM_ROOT_FILES.has(entry.name)) {
      failures.push(
        `${display(resolve(longformRoot, entry.name))} ist auf der falschen Ebene; ` +
        'hier sind nur globale Longform-Steuerdateien und Datumsordner erlaubt.',
      );
    }
    continue;
  }
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_')) continue;
  if (!DATE_PATTERN.test(entry.name)) {
    failures.push(
      `${display(resolve(longformRoot, entry.name))} ist kein gültiger Datumsordner. ` +
      'Erwartetes Format: YYYY-MM-DD.',
    );
    continue;
  }

  const dateRoot = resolve(longformRoot, entry.name);
  for (const videoEntry of await readDirSafe(dateRoot)) {
    if (!videoEntry.isDirectory()) {
      failures.push(
        `${display(resolve(dateRoot, videoEntry.name))} liegt direkt im Datumsordner. ` +
        'Dort sind nur NN_Video-Titel/-Ordner erlaubt.',
      );
      continue;
    }
    if (!VIDEO_PATTERN.test(videoEntry.name)) {
      failures.push(`${display(resolve(dateRoot, videoEntry.name))} benötigt das Format NN_Video-Titel.`);
      continue;
    }

    const videoRoot = resolve(dateRoot, videoEntry.name);
    const videoEntries = await readDirSafe(videoRoot);
    const childDirs = new Set(videoEntries.filter((child) => child.isDirectory()).map((child) => child.name));
    const childFiles = new Set(videoEntries.filter((child) => child.isFile()).map((child) => child.name));

    if (!childFiles.has('README.md')) failures.push(`${display(videoRoot)}: README.md fehlt.`);
    for (const required of REQUIRED_VIDEO_DIRS) {
      if (!childDirs.has(required)) failures.push(`${display(videoRoot)}: Pflichtordner ${required}/ fehlt.`);
    }

    const flatPlanning = [...ROOT_VIDEO_MARKERS].filter((name) => childFiles.has(name));
    if (flatPlanning.length > 0) {
      failures.push(
        `${display(videoRoot)} enthält flache Planungsdateien (${flatPlanning.join(', ')}). ` +
        'Skript/Audio -> 01, Visuals -> 02, Thumbnail -> 03, Metadaten -> 04, Export -> 05, Planung/Technik -> 06.',
      );
    }
  }
}

// 2) ki/src/longform ist ausschließlich ausführbarer Source.
for (const entry of await readDirSafe(sourceLongformRoot, {optional: true})) {
  if (!entry.isDirectory()) continue;
  for (const path of await walkFiles(resolve(sourceLongformRoot, entry.name))) {
    if (SOURCE_FORBIDDEN_PLANNING_MARKERS.has(basename(path))) {
      failures.push(
        `${display(path)} ist eine Planungsdatei im Source-Bereich. ` +
        'ki/src/longform/<slug>/ ist ausschließlich für ausführbaren TS/TSX-Code und Tests vorgesehen. ' +
        'Planung gehört unter ki/youtube-longform/<Datum>/<Video>/.',
      );
    }
  }
}

// 3) Relative Imports im Longform-Source müssen auflösbar sein.
//    Ein falsch getippter Pfad (z. B. '../../brand/brand' statt '../../../brand/brand')
//    bricht den kompletten Remotion-Bundle — und faellt sonst erst beim Render auf.
const IMPORT_PATTERN = /(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]/g;
const CANDIDATE_SUFFIXES = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.tsx'];

for (const path of await walkFiles(sourceLongformRoot)) {
  if (!/\.(ts|tsx)$/.test(path)) continue;
  const source = await import('node:fs/promises').then((fs) => fs.readFile(path, 'utf8'));
  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const specifier = match[1];
    const target = resolve(dirname(path), specifier);
    const resolved = await Promise.all(
      CANDIDATE_SUFFIXES.map((suffix) => exists(`${target}${suffix}`)),
    );
    if (!resolved.some(Boolean)) {
      failures.push(
        `${display(path)}: Import '${specifier}' ist nicht auflösbar. ` +
        'Ein falscher relativer Pfad bricht den gesamten Remotion-Bundle.',
      );
    }
  }
}

if (failures.length > 0) {
  console.error('KI-Longform-Strukturvertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'KI-Longform-Strukturvertrag bestanden: Datumsordner gültig, jedes Video besitzt die feste 01–06-Produktionsstruktur, ' +
  'Source und Planung sind getrennt und alle relativen Source-Imports lassen sich auflösen.',
);
