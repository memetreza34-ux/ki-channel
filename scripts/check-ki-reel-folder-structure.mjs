import {readdir, readFile} from 'node:fs/promises';
import {resolve, relative, basename} from 'node:path';

const repoRoot = resolve(process.env.KI_REEL_STRUCTURE_ROOT ?? '.');
const kiRoot = resolve(repoRoot, 'ki');
const reelsRoot = resolve(kiRoot, 'reels');
const sourceReelsRoot = resolve(kiRoot, 'src', 'reels');
const generatorPath = resolve(repoRoot, 'scripts', 'new-ki-reel.mjs');

const WEEK_PATTERN = /^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/;
const REEL_PATTERN = /^\d{2}_.+/;
const REQUIRED_REEL_DIRS = ['01-script-audio','02-bilder','03-caption','04-pdf','05-export','06-projektdateien'];
const ROOT_REEL_MARKERS = new Set(['brief.json','reel.json','voiceover.md','scene-plan.md','animation-plan.md','subtitle-cues.json','asset-manifest.json','CODEX_ASSEMBLY_TASK.md','review-checklist.md']);
const SOURCE_FORBIDDEN_PLANNING_MARKERS = new Set(['brief.json','reel.json','voiceover.md','scene-plan.md','animation-plan.md','subtitle-cues.json','asset-manifest.json','CODEX_ASSEMBLY_TASK.md','review-checklist.md','caption.md','audio-plan.md','asset-prompts.md']);
const ALLOWED_REELS_ROOT_FILES = new Set(['README.md','AGENTS.md','animation-history.json','.gitkeep']);

const failures = [];
const display = (filePath) => relative(repoRoot, filePath) || '.';
const readDirSafe = async (filePath) => {
  try { return await readdir(filePath, {withFileTypes:true}); }
  catch (error) { failures.push(`${display(filePath)} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`); return []; }
};
const directFileNames = async (filePath) => new Set((await readDirSafe(filePath)).filter((entry)=>entry.isFile()).map((entry)=>entry.name));
const walkFiles = async (root) => {
  const files=[];
  for (const entry of await readDirSafe(root)) {
    const filePath=resolve(root,entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(filePath));
    else if (entry.isFile()) files.push(filePath);
  }
  return files;
};

// 0) Canonical generator contract: Git-stable 01–06 + Storytelling + Level-Up v3 scaffold for future reels.
try {
  const generator = await readFile(generatorPath,'utf8');
  for (const required of REQUIRED_REEL_DIRS) {
    if (!generator.includes(`'${required}'`) && !generator.includes(`"${required}"`)) failures.push(`scripts/new-ki-reel.mjs erzeugt den Pflichtordner ${required}/ nicht mehr.`);
  }
  if (!generator.includes("'.gitkeep'") && !generator.includes('".gitkeep"')) failures.push('scripts/new-ki-reel.mjs erzeugt keine .gitkeep-Platzhalter mehr.');

  const requiredGeneratorTokens = [
    ["'06-projektdateien/story-beats.json'",'story-beats.json'],
    ["'06-projektdateien/STORY-PLAN.md'",'STORY-PLAN.md'],
    ["'06-projektdateien/LEVEL-UP-PLAN.json'",'LEVEL-UP-PLAN.json'],
    ["publishDate >= '2026-09-03' ? 3 : 2",'Level-Up-v3-Datumsgrenze'],
    ['minVisualBeats = levelUpVersion >= 3 ? 20 : 15','v3-Beat-Mindestdichte'],
    ['realMediaMinimum = levelUpVersion >= 3 ? 3 : 2','v3-Real-Media-Mindestdichte'],
    ['"candidateFrame": 15','Cover-Kandidat Frame 15'],
    ['"holdFrames": 15','Cover-Hold 15 Frames'],
    ['brandRecognizable','Cover-Brand-Erkennbarkeit'],
    ['brandFidelity','Brand-Fidelity-v3-Block'],
    ['minimumRecognizableMoments','Brand-Wiederholungs-Mindestzahl'],
    ['minimumDistinctScenes','Brand-Szenen-Mindestzahl'],
    ['officialLogoOrWordmarkPreferred','Official-Brand-Asset-Priorität'],
    ['genericSymbolFallbackForbidden','Verbot generischer Brand-Ersatzsymbole'],
    ['approximateLogoReconstructionAllowed','Logo-Rekonstruktionsregel'],
    ['realMediaMix','Real-Media-Mix'],
    ['motionIsClaim','Motion-ist-Claim-Regel'],
    ['videoExceptionReason','Video-Ausnahme'],
    ['visualWorlds','Visual-World-v3-Vertrag'],
    ['midReelReframes','Mid-Reel-Reframe-v3-Vertrag'],
    ['WORD_TIMINGS_AFTER_FORCED_ALIGNMENT','Word/Phrase-Timing-Autorität'],
    ['sceneDensity','Szenendichte-Vertrag'],
    ['targetMeaningfulChangeSecondsMin','minimale Szenendichte'],
    ['targetMeaningfulChangeSecondsMax','maximale Szenendichte'],
    ['overlapPolicy','Overlap-Vertrag'],
    ['onePrimaryFocusAtATime','Ein-Fokus-Regel'],
    ['captionMayCoverCriticalVisual','Caption-Overlap-Regel'],
    ['bottom 330','Caption bottom 330'],
    ['max 6 Wörter','Caption-Gruppierung'],
    ['COVER_FRAME_READY','Cover-Reviewfeld'],
    ['REAL_MEDIA_MIX','Real-Media-Reviewfeld'],
    ['BRAND_FIDELITY','Brand-Fidelity-Reviewfeld'],
    ['BRAND_RECOGNIZABLE_WITHOUT_CAPTION','Brand-Erkennbarkeit-v3-Reviewfeld'],
    ['PRIMARY_BRAND_REAPPEARS','Brand-Reappearance-v3-Reviewfeld'],
    ['REAL_BRAND_ASSET_USED_OR_EXCEPTION','Real-Brand-Asset-v3-Reviewfeld'],
    ['REAL_MEDIA_NOT_JUST_SOURCE_CARDS','Real-Media-v3-Reviewfeld'],
    ['VISUAL_WORLD_VARIETY','Visual-World-v3-Reviewfeld'],
    ['MID_REEL_REFRAMES','Mid-Reframe-v3-Reviewfeld'],
    ['WORD_LOCKED_MAJOR_REVEALS','Word-Lock-Reviewfeld'],
    ['SCENE_DENSITY','Szenendichte-Reviewfeld'],
    ['NO_VISUAL_OVERLAP','Overlap-Reviewfeld'],
    ['MOTION_GRAMMAR_DIVERSITY','Motion-Diversity-Reviewfeld'],
    ['STATIC_STATE_OVER_LIMIT_VIOLATIONS','Static-State-Reviewfeld'],
  ];
  for (const [needle,label] of requiredGeneratorTokens) {
    if (!generator.includes(needle)) failures.push(`scripts/new-ki-reel.mjs verliert den Story/Level-Up-v3-Scaffold: ${label}.`);
  }
} catch (error) {
  failures.push(`scripts/new-ki-reel.mjs fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : error}`);
}

// 1) Reel projects must never live directly below ki/.
for (const entry of await readDirSafe(kiRoot)) {
  if (!entry.isDirectory()) continue;
  if (['reels','src'].includes(entry.name)) continue;
  const candidate=resolve(kiRoot,entry.name);
  const files=await directFileNames(candidate);
  const marker=[...ROOT_REEL_MARKERS].find((name)=>files.has(name));
  if (marker) failures.push(`${display(candidate)} sieht wie ein Reel-Projekt aus (${marker}). Reel-Projekte gehören nach ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/.`);
}

// 2) ki/src/reels is executable source only; planning packages are forbidden there.
for (const entry of await readDirSafe(sourceReelsRoot)) {
  if (!entry.isDirectory()) continue;
  const sourcePackage=resolve(sourceReelsRoot,entry.name);
  const files=await walkFiles(sourcePackage);
  for (const filePath of files) {
    const name=basename(filePath);
    if (SOURCE_FORBIDDEN_PLANNING_MARKERS.has(name)) failures.push(`${display(filePath)} ist eine Planungsdatei im Source-Bereich. ki/src/reels/<slug>/ ist nur für ausführbaren TS/TSX-Code vorgesehen.`);
  }
}

// 3) ki/reels root contains only global control files/templates and weekly folders.
for (const entry of await readDirSafe(reelsRoot)) {
  if (entry.isFile()) {
    if (!ALLOWED_REELS_ROOT_FILES.has(entry.name)) failures.push(`${display(resolve(reelsRoot,entry.name))} ist auf der falschen Ebene.`);
    continue;
  }
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_')) continue;
  if (!WEEK_PATTERN.test(entry.name)) {
    failures.push(`${display(resolve(reelsRoot,entry.name))} ist kein gültiger Wochenordner. Erwartet: YYYY-MM-DD_bis_YYYY-MM-DD.`);
    continue;
  }

  const weekRoot=resolve(reelsRoot,entry.name);
  for (const reelEntry of await readDirSafe(weekRoot)) {
    if (!reelEntry.isDirectory()) { failures.push(`${display(resolve(weekRoot,reelEntry.name))} liegt direkt im Wochenordner. Dort sind nur NN_Reel-Titel/-Ordner erlaubt.`); continue; }
    if (!REEL_PATTERN.test(reelEntry.name)) { failures.push(`${display(resolve(weekRoot,reelEntry.name))} benötigt das Format NN_Reel-Titel.`); continue; }

    const reelRoot=resolve(weekRoot,reelEntry.name);
    const reelEntries=await readDirSafe(reelRoot);
    const childDirs=new Set(reelEntries.filter((child)=>child.isDirectory()).map((child)=>child.name));
    const childFiles=new Set(reelEntries.filter((child)=>child.isFile()).map((child)=>child.name));
    if (!childFiles.has('README.md')) failures.push(`${display(reelRoot)}: README.md fehlt.`);
    for (const required of REQUIRED_REEL_DIRS) {
      const requiredPath=resolve(reelRoot,required);
      if (!childDirs.has(required)) { failures.push(`${display(reelRoot)}: Pflichtordner ${required}/ fehlt.`); continue; }
      const persistentFiles=await walkFiles(requiredPath);
      if (persistentFiles.length===0) failures.push(`${display(requiredPath)} ist leer. Jeder Pflichtordner benötigt mindestens eine persistente Datei.`);
    }
    const flatPlanning=[...ROOT_REEL_MARKERS].filter((name)=>childFiles.has(name));
    if (flatPlanning.length>0) failures.push(`${display(reelRoot)} enthält flache Planungsdateien (${flatPlanning.join(', ')}). Planung muss in 01–06 liegen.`);
  }
}

if (failures.length>0) {
  console.error('KI-Reel-Strukturvertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('KI-Reel-Strukturvertrag bestanden: Generator erzeugt 01–06 Git-stabil plus Level-Up-v3-Scaffold für zukünftige Reels mit Cover-first, Brand-Wiederholung, Real-Media, mindestens 20 Beats, Visual Worlds, Mid-Reframes, Szenendichte und Overlap-Regeln.');
