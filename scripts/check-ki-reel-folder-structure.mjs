import {readdir, readFile} from 'node:fs/promises';
import {resolve, relative, basename} from 'node:path';

const repoRoot = resolve(process.env.KI_REEL_STRUCTURE_ROOT ?? '.');
const kiRoot = resolve(repoRoot, 'ki');
const reelsRoot = resolve(kiRoot, 'reels');
const sourceReelsRoot = resolve(kiRoot, 'src', 'reels');
const generatorPath = resolve(repoRoot, 'scripts', 'new-ki-reel.mjs');
const generatorCorePath = resolve(repoRoot, 'scripts', 'new-ki-reel-core.mjs');

const WEEK_PATTERN = /^(\d{4}-\d{2}-\d{2})_bis_(\d{4}-\d{2}-\d{2})$/;
const STRICT_DAY_STRUCTURE_FROM = '2026-08-31';
const DAY_PATTERN = /^(01_Montag|02_Dienstag|03_Mittwoch|04_Donnerstag|05_Freitag|06_Samstag|07_Sonntag)$/;
const TOPIC_PATTERN = /^\d{2}_.+/;
const REQUIRED_REEL_DIRS = [
  '01-script-audio',
  '02-bilder',
  '03-caption',
  '04-pdf',
  '05-export',
  '06-projektdateien',
];
const ROOT_REEL_MARKERS = new Set([
  'brief.json','reel.json','voiceover.md','scene-plan.md','animation-plan.md','subtitle-cues.json','asset-manifest.json','CODEX_ASSEMBLY_TASK.md','review-checklist.md',
]);
const SOURCE_FORBIDDEN_PLANNING_MARKERS = new Set([
  'brief.json','reel.json','voiceover.md','scene-plan.md','animation-plan.md','subtitle-cues.json','asset-manifest.json','CODEX_ASSEMBLY_TASK.md','review-checklist.md','caption.md','audio-plan.md','asset-prompts.md',
]);
const ALLOWED_REELS_ROOT_FILES = new Set(['README.md','AGENTS.md','animation-history.json','.gitkeep','REMOTION_NATIVE_VISUALS.md','REMOTION_NATIVE_VISUALS_MAXIMUM.md']);
const ALLOWED_DAY_FILES = new Set(['README.md','.gitkeep']);

const failures = [];
const display = (path) => relative(repoRoot, path) || '.';
const readDirSafe = async (path) => {
  try { return await readdir(path, {withFileTypes:true}); }
  catch (error) {
    failures.push(`${display(path)} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
    return [];
  }
};
const directFileNames = async (path) => new Set((await readDirSafe(path)).filter((entry)=>entry.isFile()).map((entry)=>entry.name));
const walkFiles = async (root) => {
  const files=[];
  for (const entry of await readDirSafe(root)) {
    const path=resolve(root,entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
};

const validateTopicPackage = async (reelRoot) => {
  const reelEntries = await readDirSafe(reelRoot);
  const childDirs = new Set(reelEntries.filter((child)=>child.isDirectory()).map((child)=>child.name));
  const childFiles = new Set(reelEntries.filter((child)=>child.isFile()).map((child)=>child.name));
  if (!childFiles.has('README.md')) failures.push(`${display(reelRoot)}: README.md fehlt.`);
  for (const required of REQUIRED_REEL_DIRS) {
    const requiredPath=resolve(reelRoot,required);
    if (!childDirs.has(required)) {
      failures.push(`${display(reelRoot)}: Pflichtordner ${required}/ fehlt.`);
      continue;
    }
    const persistentFiles=await walkFiles(requiredPath);
    if (persistentFiles.length===0) failures.push(`${display(requiredPath)} ist leer. Jeder Pflichtordner benötigt mindestens eine persistente Datei.`);
  }
  const flatPlanning=[...ROOT_REEL_MARKERS].filter((name)=>childFiles.has(name));
  if (flatPlanning.length>0) failures.push(`${display(reelRoot)} enthält flache Planungsdateien (${flatPlanning.join(', ')}). Planung muss in 01–06 liegen.`);
};

// 0) Generator contract: wrapper chooses weekday, core keeps the full scaffold.
try {
  const wrapper = await readFile(generatorPath,'utf8');
  for (const [needle,label] of [
    ['new-ki-reel-core.mjs','Core-Generator-Aufruf'],
    ['01_Montag','Montagsordner'],
    ['02_Dienstag','Dienstagsordner'],
    ['03_Mittwoch','Mittwochsordner'],
    ['04_Donnerstag','Donnerstagsordner'],
    ['05_Freitag','Freitagsordner'],
    ['06_Samstag','Samstagsordner'],
    ['07_Sonntag','Sonntagsordner'],
    ['Wochentag','Wochentag-Ermittlung'],
    ['Kanonisch: Woche → Wochentag','kanonische Tagesstruktur'],
  ]) if (!wrapper.includes(needle)) failures.push(`scripts/new-ki-reel.mjs verliert den Tagesstruktur-Vertrag: ${label}.`);
} catch (error) {
  failures.push(`scripts/new-ki-reel.mjs fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
}

try {
  const generator = await readFile(generatorCorePath,'utf8');
  for (const required of REQUIRED_REEL_DIRS) {
    if (!generator.includes(`'${required}'`) && !generator.includes(`"${required}"`)) failures.push(`scripts/new-ki-reel-core.mjs erzeugt den Pflichtordner ${required}/ nicht mehr.`);
  }
  for (const [needle,label] of [
    ["'.gitkeep'",'.gitkeep-Platzhalter'],
    ["'06-projektdateien/story-beats.json'",'story-beats.json'],
    ["'06-projektdateien/STORY-PLAN.md'",'STORY-PLAN.md'],
    ["'06-projektdateien/LEVEL-UP-PLAN.json'",'LEVEL-UP-PLAN.json'],
    ['levelUpVersion','Level-Up-Versionierung'],
    ['minVisualBeats','Visual-Beat-Mindestdichte'],
    ['brandFidelity','Brand-Fidelity-v3'],
    ['visualWorlds','Visual-Worlds-v3'],
    ['midReelReframes','Mid-Reel-Reframes-v3'],
    ['WORD_TIMINGS_AFTER_FORCED_ALIGNMENT','Word/Phrase-Timing-Autorität'],
    ['coverHook','Cover-first-Vertrag'],
    ['realMediaMix','Real-Media-Mix'],
    ['sceneDensity','Szenendichte-Vertrag'],
    ['overlapPolicy','Overlap-Vertrag'],
    ['bottom 330','Caption bottom 330'],
  ]) if (!generator.includes(needle)) failures.push(`scripts/new-ki-reel-core.mjs verliert den Story/Level-Up-Scaffold: ${label}.`);
} catch (error) {
  failures.push(`scripts/new-ki-reel-core.mjs fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
}

// 1) Reel projects must never live directly below ki/.
for (const entry of await readDirSafe(kiRoot)) {
  if (!entry.isDirectory()) continue;
  if (['reels','src'].includes(entry.name)) continue;
  const candidate=resolve(kiRoot,entry.name);
  const files=await directFileNames(candidate);
  const marker=[...ROOT_REEL_MARKERS].find((name)=>files.has(name));
  if (marker) failures.push(`${display(candidate)} sieht wie ein Reel-Projekt aus (${marker}). Reel-Projekte gehören nach ki/reels/WOCHE/WOCHENTAG/NN_Thema/.`);
}

// 2) ki/src/reels is executable source only.
for (const entry of await readDirSafe(sourceReelsRoot)) {
  if (!entry.isDirectory()) continue;
  const sourcePackage=resolve(sourceReelsRoot,entry.name);
  const files=await walkFiles(sourcePackage);
  for (const path of files) {
    const name=basename(path);
    if (SOURCE_FORBIDDEN_PLANNING_MARKERS.has(name)) failures.push(`${display(path)} ist eine Planungsdatei im Source-Bereich. ki/src/reels/<slug>/ ist nur für ausführbaren TS/TSX-Code vorgesehen.`);
  }
}

// 3) Weekly structure. Current/future weeks require weekday -> topic. Older weeks remain readable legacy.
for (const entry of await readDirSafe(reelsRoot)) {
  if (entry.isFile()) {
    if (!ALLOWED_REELS_ROOT_FILES.has(entry.name)) failures.push(`${display(resolve(reelsRoot,entry.name))} ist auf der falschen Ebene.`);
    continue;
  }
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_')) continue;
  const weekMatch=entry.name.match(WEEK_PATTERN);
  if (!weekMatch) {
    failures.push(`${display(resolve(reelsRoot,entry.name))} ist kein gültiger Wochenordner. Erwartet: YYYY-MM-DD_bis_YYYY-MM-DD.`);
    continue;
  }

  const weekStart=weekMatch[1];
  const weekRoot=resolve(reelsRoot,entry.name);
  const weekEntries=await readDirSafe(weekRoot);
  const strictDayStructure=weekStart >= STRICT_DAY_STRUCTURE_FROM;

  if (strictDayStructure) {
    for (const dayEntry of weekEntries) {
      const dayPath=resolve(weekRoot,dayEntry.name);
      if (dayEntry.isFile()) {
        failures.push(`${display(dayPath)} liegt direkt im Wochenordner. Seit ${STRICT_DAY_STRUCTURE_FROM} sind dort nur Wochentagsordner erlaubt.`);
        continue;
      }
      if (!dayEntry.isDirectory() || !DAY_PATTERN.test(dayEntry.name)) {
        failures.push(`${display(dayPath)} verletzt die Tagesstruktur. Erwartet 01_Montag bis 07_Sonntag.`);
        continue;
      }

      for (const topicEntry of await readDirSafe(dayPath)) {
        const topicPath=resolve(dayPath,topicEntry.name);
        if (topicEntry.isFile()) {
          if (!ALLOWED_DAY_FILES.has(topicEntry.name)) failures.push(`${display(topicPath)} liegt direkt im Wochentagsordner; dort gehören nur NN_Thema/-Ordner hin.`);
          continue;
        }
        if (!topicEntry.isDirectory() || !TOPIC_PATTERN.test(topicEntry.name)) {
          failures.push(`${display(topicPath)} benötigt im Wochentag das Format NN_Thema.`);
          continue;
        }
        await validateTopicPackage(topicPath);
      }
    }
    continue;
  }

  // Legacy weeks before 2026-08-31 may still be flat, but already migrated weekday folders are also accepted.
  for (const legacyEntry of weekEntries) {
    if (legacyEntry.isFile()) {
      failures.push(`${display(resolve(weekRoot,legacyEntry.name))} liegt direkt im Legacy-Wochenordner; dort sind nur Reel- oder Wochentagsordner erlaubt.`);
      continue;
    }
    const legacyPath=resolve(weekRoot,legacyEntry.name);
    if (DAY_PATTERN.test(legacyEntry.name)) {
      for (const topicEntry of await readDirSafe(legacyPath)) {
        const topicPath=resolve(legacyPath,topicEntry.name);
        if (topicEntry.isDirectory() && TOPIC_PATTERN.test(topicEntry.name)) await validateTopicPackage(topicPath);
      }
      continue;
    }
    if (!TOPIC_PATTERN.test(legacyEntry.name)) {
      failures.push(`${display(legacyPath)} ist weder Legacy-NN_Thema noch Wochentagsordner.`);
      continue;
    }
    await validateTopicPackage(legacyPath);
  }
}

if (failures.length>0) {
  console.error('KI-Reel-Strukturvertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('KI-Reel-Strukturvertrag bestanden.');
console.log('Kanonisch ab Woche 2026-08-31: Woche -> Wochentag -> NN_Thema -> 01–06.');
console.log('Neue Reels werden automatisch im korrekten Wochentagsordner angelegt; ältere abgeschlossene Wochen bleiben Legacy-kompatibel.');
