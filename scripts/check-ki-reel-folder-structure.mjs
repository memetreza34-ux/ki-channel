import {readdir, readFile} from 'node:fs/promises';
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
  ...ROOT_REEL_MARKERS,
  'creative-brief.md',
  'source-ledger.md',
  'visual-strategy.md',
  'creative-review.md',
  'production-contract-v2.json',
  'caption.md',
  'audio-plan.md',
  'asset-prompts.md',
]);
const ALLOWED_REELS_ROOT_FILES = new Set([
  'README.md',
  'AGENTS.md',
  'animation-history.json',
  '.gitkeep',
]);
const V2_PROJECT_FILES = [
  'production-contract-v2.json',
  'creative-brief.md',
  'source-ledger.md',
  'visual-strategy.md',
  'creative-review.md',
  'PHASE-STATUS.md',
];
const V2_MODALITIES = [
  'REMOTION_NATIVE',
  'REAL_CAPTURE',
  'HYBRID',
  'EXTERNAL_STILL_REQUIRED',
  'EXTERNAL_MOTION_REQUIRED',
];
const ASSET_STATUSES = new Set([
  'NOT_REQUIRED',
  'MISSING_REQUIRED',
  'PROVIDED',
  'VERIFIED',
]);
const CREATIVE_BRIEF_SECTIONS = [
  'Viewer promise',
  'Hook tension',
  '3-second proof',
  'Why care',
  'Core mechanism',
  'Payoff',
  'Memorable moment',
  'Truth risk',
];

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

const readTextSafe = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    failures.push(`${display(path)} kann nicht gelesen werden: ${error instanceof Error ? error.message : error}`);
    return '';
  }
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

const phaseBlock = (phaseStatus, phaseNumber) => {
  const next = phaseNumber + 1;
  const pattern = new RegExp(
    `## Phase ${phaseNumber}[^\\n]*\\n([\\s\\S]*?)(?=\\n## Phase ${next}|$)`,
    'i',
  );
  return phaseStatus.match(pattern)?.[0] ?? '';
};

const phaseIsFinished = (phaseStatus, phaseNumber) =>
  /\*\*Status:\*\*\s*FERTIG/i.test(phaseBlock(phaseStatus, phaseNumber));

const markdownSectionBody = (text, heading) => {
  const lines = text.split(/\r?\n/);
  const wanted = `## ${heading}`.toLowerCase();
  const start = lines.findIndex((line) => line.trim().toLowerCase() === wanted);
  if (start < 0) return '';

  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index].trim().startsWith('## ')) break;
    body.push(lines[index]);
  }
  return body.join('\n').trim();
};

const markdownBoldFieldValue = (text, label) => {
  const lines = text.split(/\r?\n/);
  const marker = `**${label}:**`;
  const index = lines.findIndex((line) => line.trim().startsWith(marker));
  if (index < 0) return '';

  const sameLine = lines[index].trim().slice(marker.length).trim();
  if (sameLine) return sameLine;

  for (let next = index + 1; next < lines.length; next += 1) {
    const candidate = lines[next].trim();
    if (!candidate) continue;
    if (candidate.startsWith('**') || candidate.startsWith('## ') || candidate.startsWith('|')) return '';
    return candidate;
  }

  return '';
};

const meaningfulSection = (body) => {
  if (!body) return false;
  const cleaned = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('- [ ]') && !line.startsWith('<!--'))
    .join(' ')
    .trim();
  return cleaned.length >= 3 && !/^(offen|todo|tbd|n\/a)$/i.test(cleaned);
};

const markdownTableDataRows = (text) => text
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.startsWith('|') && line.endsWith('|'))
  .filter((line) => !/^\|\s*-+/.test(line))
  .filter((line) => !/Claim-ID|Beat\s*\|\s*Sprecherstelle/i.test(line));

const checkCreativeBrief = (path, text) => {
  for (const section of CREATIVE_BRIEF_SECTIONS) {
    const body = markdownSectionBody(text, section);
    if (!meaningfulSection(body)) {
      failures.push(`${display(path)}: Abschnitt "${section}" ist für Phase 1 FERTIG noch leer/Placeholder.`);
    }
  }
};

const checkSourceLedger = (path, text) => {
  const rows = markdownTableDataRows(text);
  const noExternalClaims = /NO_EXTERNAL_CLAIMS:\s*\S+/i.test(text);

  if (rows.length === 0 && !noExternalClaims) {
    failures.push(
      `${display(path)}: Phase 1 ist FERTIG, aber es gibt weder Claim-Zeile noch ` +
      '`NO_EXTERNAL_CLAIMS: <Begründung>`.',
    );
  }

  for (const row of rows) {
    if (/\|\s*REMOVE\s*\|?\s*$/i.test(row)) {
      failures.push(`${display(path)}: Claim mit Status REMOVE ist bei Phase 1 FERTIG noch im Ledger.`);
    }
    if (!/\|\s*(VERIFIED|QUALIFIED)\s*\|?\s*$/i.test(row)) {
      failures.push(`${display(path)}: Claim-Zeile benötigt am Ende VERIFIED oder QUALIFIED: ${row}`);
    }
  }
};

const checkVisualStrategy = (path, text) => {
  const rows = markdownTableDataRows(text);
  if (rows.length === 0) {
    failures.push(`${display(path)}: Phase 1 ist FERTIG, aber das Beat Sheet enthält keinen Visual Beat.`);
  }

  for (const row of rows) {
    if (!V2_MODALITIES.some((modality) => row.includes(modality))) {
      failures.push(`${display(path)}: Visual-Beat-Zeile ohne gültige Modality: ${row}`);
    }
  }

  const hero = markdownBoldFieldValue(text, 'Hero/Memorable Beat');
  if (!hero || /^(offen|todo|tbd)$/i.test(hero)) {
    failures.push(`${display(path)}: Hero/Memorable Beat muss vor Phase 1 FERTIG konkret benannt sein.`);
  }
};

const parseAssetManifest = async (path) => {
  const raw = await readTextSafe(path);
  if (!raw) return null;
  try {
    const manifest = JSON.parse(raw);
    if (!Array.isArray(manifest.assets)) {
      failures.push(`${display(path)}: assets muss ein Array sein.`);
      return null;
    }
    for (const [index, asset] of manifest.assets.entries()) {
      const status = asset?.status;
      if (!ASSET_STATUSES.has(status)) {
        failures.push(
          `${display(path)}: assets[${index}].status muss einer von ` +
          `${[...ASSET_STATUSES].join(', ')} sein.`,
        );
      }
    }
    return manifest;
  } catch (error) {
    failures.push(`${display(path)} ist kein gültiges JSON: ${error instanceof Error ? error.message : error}`);
    return null;
  }
};

const checkV2Contract = async (reelRoot) => {
  const projectRoot = resolve(reelRoot, '06-projektdateien');
  const projectFiles = await directFileNames(projectRoot);
  if (!projectFiles.has('production-contract-v2.json')) return;

  for (const required of V2_PROJECT_FILES) {
    if (!projectFiles.has(required)) {
      failures.push(`${display(projectRoot)}: V2-Pflichtdatei ${required} fehlt.`);
    }
  }

  const assetRoot = resolve(reelRoot, '02-bilder');
  const assetFiles = await directFileNames(assetRoot);
  const assetManifestPath = resolve(assetRoot, 'asset-manifest.json');
  if (!assetFiles.has('asset-manifest.json')) {
    failures.push(`${display(assetRoot)}: V2 benötigt asset-manifest.json.`);
  }

  const contractPath = resolve(projectRoot, 'production-contract-v2.json');
  const contractRaw = await readTextSafe(contractPath);
  if (contractRaw) {
    try {
      const contract = JSON.parse(contractRaw);
      if (contract.version !== 2) {
        failures.push(`${display(contractPath)}: version muss 2 sein.`);
      }
      if (contract.format !== 'short-form-reel') {
        failures.push(`${display(contractPath)}: format muss short-form-reel sein.`);
      }
      const modalities = new Set(Array.isArray(contract.visualModalities) ? contract.visualModalities : []);
      const missingModalities = V2_MODALITIES.filter((name) => !modalities.has(name));
      if (missingModalities.length > 0) {
        failures.push(`${display(contractPath)}: Visual Modalities fehlen: ${missingModalities.join(', ')}.`);
      }
    } catch (error) {
      failures.push(`${display(contractPath)} ist kein gültiges JSON: ${error instanceof Error ? error.message : error}`);
    }
  }

  const manifest = assetFiles.has('asset-manifest.json')
    ? await parseAssetManifest(assetManifestPath)
    : null;

  const phasePath = resolve(projectRoot, 'PHASE-STATUS.md');
  if (!projectFiles.has('PHASE-STATUS.md')) return;
  const phaseStatus = await readTextSafe(phasePath);
  const phase1Finished = phaseIsFinished(phaseStatus, 1);
  const phase3Finished = phaseIsFinished(phaseStatus, 3);

  if (phase1Finished) {
    const phase1RequiredProjectFiles = [
      'creative-brief.md',
      'source-ledger.md',
      'visual-strategy.md',
      'reel.json',
      'animation-plan.md',
    ];
    for (const required of phase1RequiredProjectFiles) {
      if (!projectFiles.has(required)) {
        failures.push(`${display(projectRoot)}: Phase 1 ist FERTIG markiert, aber ${required} fehlt.`);
      }
    }

    for (const planned of ['creative-brief.md', 'source-ledger.md', 'visual-strategy.md']) {
      if (!projectFiles.has(planned)) continue;
      const path = resolve(projectRoot, planned);
      const text = await readTextSafe(path);
      if (/\*\*Status:\*\*\s*OFFEN/i.test(text)) {
        failures.push(`${display(path)}: Phase 1 ist FERTIG, Datei steht aber noch auf OFFEN.`);
      }
      if (planned === 'creative-brief.md') checkCreativeBrief(path, text);
      if (planned === 'source-ledger.md') checkSourceLedger(path, text);
      if (planned === 'visual-strategy.md') checkVisualStrategy(path, text);
    }

    const scriptFiles = await directFileNames(resolve(reelRoot, '01-script-audio'));
    for (const required of ['voiceover.md', 'VOICEOVER-ZUM-KOPIEREN.txt']) {
      if (!scriptFiles.has(required)) {
        failures.push(`${display(resolve(reelRoot, '01-script-audio'))}: Phase 1 ist FERTIG, aber ${required} fehlt.`);
      }
    }

    const captionFiles = await directFileNames(resolve(reelRoot, '03-caption'));
    for (const required of ['subtitle-cues.json', 'platform-copy.md']) {
      if (!captionFiles.has(required)) {
        failures.push(`${display(resolve(reelRoot, '03-caption'))}: Phase 1 ist FERTIG, aber ${required} fehlt.`);
      }
    }
  }

  if (phase3Finished) {
    if (!phase1Finished) {
      failures.push(`${display(phasePath)}: Phase 3 darf nicht FERTIG sein, solange Phase 1 nicht FERTIG ist.`);
    }

    const reviewPath = resolve(projectRoot, 'creative-review.md');
    if (!projectFiles.has('creative-review.md')) {
      failures.push(`${display(projectRoot)}: Phase 3 ist FERTIG, aber creative-review.md fehlt.`);
    } else {
      const review = await readTextSafe(reviewPath);
      if (!/\*\*PASS \/ FAIL:\*\*\s*PASS\b/i.test(review)) {
        failures.push(`${display(reviewPath)}: Phase 3 ist FERTIG, Creative Review ist aber nicht PASS.`);
      }
    }

    const audioFiles = await directFileNames(resolve(reelRoot, '01-script-audio'));
    if (!audioFiles.has('voiceover.wav') && !audioFiles.has('voiceover.mp3')) {
      failures.push(`${display(resolve(reelRoot, '01-script-audio'))}: Phase 3 ist FERTIG, aber echtes voiceover.wav/mp3 fehlt.`);
    }

    if (manifest?.assets?.some((asset) => asset?.status === 'MISSING_REQUIRED')) {
      failures.push(`${display(assetManifestPath)}: Phase 3 ist FERTIG, enthält aber noch MISSING_REQUIRED.`);
    }
  }
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
        'Skript/Audio -> 01, Assets -> 02, Caption -> 03, PDF -> 04, Export -> 05, Planung/Technik -> 06.',
      );
    }

    if (REQUIRED_REEL_DIRS.every((dir) => childDirs.has(dir))) {
      await checkV2Contract(reelRoot);
    }
  }
}

if (failures.length > 0) {
  console.error('KI-Reel-Strukturvertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'KI-Reel-Strukturvertrag bestanden: Source/Planung getrennt, Wochenstruktur gültig und V2-Reels besitzen geprüfte Creative-, Grounding-, Visual-Strategy- und Review-Verträge.',
);
