import {createHash} from 'node:crypto';
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import {relative, resolve, sep} from 'node:path';

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith('--'));
const readyMode = args.includes('--ready');
const validateOnly = args.includes('--validate-only');

if (!slug) {
  console.error('Usage: node scripts/prepare-codex-reel.mjs <slug> [--ready] [--validate-only]');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]+$/.test(slug)) {
  console.error('Reel slug must contain only lowercase letters, digits, and hyphens.');
  process.exit(1);
}

const reelDir = resolve('ki', 'reels', slug);
const PATHS = Object.freeze({
  start: '01_START-HIER.md',
  voiceover: '02_VOICEOVER.md',
  scenes: '03_SZENEN.md',
  imagePrompts: '04_BILDER/PROMPTS.md',
  codexTask: '06_CODEX.md',
  reel: '99_INTERN/reel.json',
  subtitleCues: '99_INTERN/subtitle-cues.json',
  animationPlan: '99_INTERN/animation-plan.md',
  assetManifest: '99_INTERN/asset-manifest.json',
  reviewChecklist: '99_INTERN/review-checklist.md',
  generatedBrief: '99_INTERN/CODEX-BRIEF.generated.md',
  packageReport: '99_INTERN/codex-package-report.json',
});
const REQUIRED_FILES = [
  PATHS.start,
  PATHS.voiceover,
  PATHS.scenes,
  PATHS.imagePrompts,
  PATHS.codexTask,
  PATHS.reel,
  PATHS.subtitleCues,
  PATHS.animationPlan,
  PATHS.assetManifest,
  PATHS.reviewChecklist,
];

const errors = [];
const warnings = [];
const contents = new Map();

const isSafePackagePath = (value) =>
  typeof value === 'string' &&
  value.length > 0 &&
  !value.startsWith('/') &&
  !value.includes('..') &&
  !value.split('/').includes('');

const readText = async (path) => {
  try {
    const content = await readFile(resolve(reelDir, path), 'utf8');
    contents.set(path, content);
    return content;
  } catch (error) {
    errors.push(`${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const parseJson = (path) => {
  const content = contents.get(path);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    errors.push(`${path} enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

for (const path of REQUIRED_FILES) await readText(path);
for (const [path, content] of contents) {
  if (content.includes('REPLACE_ME')) errors.push(`${path} enthält noch REPLACE_ME.`);
}

const reel = parseJson(PATHS.reel);
const subtitles = parseJson(PATHS.subtitleCues);
const manifest = parseJson(PATHS.assetManifest);
const unique = (values) => new Set(values).size === values.length;

if (reel) {
  if (reel.version !== 3) errors.push(`${PATHS.reel}: version muss 3 sein.`);
  if (reel.reelId !== slug) errors.push(`${PATHS.reel}: reelId muss ${slug} sein.`);
  const expectedFiles = {
    start: PATHS.start,
    voiceover: PATHS.voiceover,
    scenes: PATHS.scenes,
    imagePrompts: PATHS.imagePrompts,
    audio: '05_AUDIO/voiceover.wav',
    codexTask: PATHS.codexTask,
    subtitleCues: PATHS.subtitleCues,
    animationPlan: PATHS.animationPlan,
    assetManifest: PATHS.assetManifest,
    reviewChecklist: PATHS.reviewChecklist,
    generatedBrief: PATHS.generatedBrief,
    packageReport: PATHS.packageReport,
  };
  for (const [key, value] of Object.entries(expectedFiles)) {
    if (reel.files?.[key] !== value) errors.push(`${PATHS.reel}: files.${key} muss ${value} sein.`);
  }

  const format = reel.format ?? {};
  if (format.width !== 1080 || format.height !== 1920 || format.fps !== 30) {
    errors.push(`${PATHS.reel}: Format muss 1080 × 1920 bei 30 FPS sein.`);
  }
  if (!Number.isInteger(format.durationInFrames) || format.durationInFrames <= 0) {
    errors.push(`${PATHS.reel}: durationInFrames muss positiv und ganzzahlig sein.`);
  }

  if (!Array.isArray(reel.scenes) || reel.scenes.length !== 8) {
    errors.push(`${PATHS.reel}: exakt acht Szenen erforderlich.`);
  } else {
    if (!unique(reel.scenes.map((scene) => scene.sceneId))) errors.push('sceneIds müssen eindeutig sein.');
    if (!unique(reel.scenes.map((scene) => scene.fullAnimationId))) errors.push('fullAnimationIds müssen eindeutig sein.');
    for (let index = 0; index < reel.scenes.length; index += 1) {
      const scene = reel.scenes[index];
      const expectedStart = index === 0 ? 0 : reel.scenes[index - 1].endFrameExclusive;
      if (scene.startFrame !== expectedStart) errors.push(`${scene.sceneId}: startFrame muss ${expectedStart} sein.`);
      if (scene.endFrameExclusive !== scene.startFrame + scene.durationInFrames) {
        errors.push(`${scene.sceneId}: Framebereich passt nicht zur Dauer.`);
      }
      if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 45) {
        errors.push(`${scene.sceneId}: Dauer muss mindestens 45 Frames betragen.`);
      }
      if (!scene.heading) errors.push(`${scene.sceneId}: heading fehlt.`);
      if (index > 0) {
        const previous = reel.scenes[index - 1];
        if (scene.layoutFamily === previous.layoutFamily) {
          errors.push(`${previous.sceneId} und ${scene.sceneId} wiederholen layoutFamily.`);
        }
        if (scene.motionSignature === previous.motionSignature) {
          errors.push(`${previous.sceneId} und ${scene.sceneId} wiederholen motionSignature.`);
        }
      }
    }
    if (reel.scenes.at(-1)?.endFrameExclusive !== format.durationInFrames) {
      errors.push('Letzte Szene muss exakt am Composition-Ende enden.');
    }
  }

  if (!Array.isArray(reel.checkpoints) || reel.checkpoints.length !== 32) {
    errors.push(`${PATHS.reel}: exakt 32 Checkpoints erforderlich.`);
  } else if (reel.checkpoints.some((frame) =>
    !Number.isInteger(frame) || frame < 0 || frame >= format.durationInFrames
  )) {
    errors.push(`${PATHS.reel}: Checkpoints liegen außerhalb der Composition.`);
  }
}

if (subtitles && reel?.scenes) {
  if (subtitles.reelId !== slug) errors.push(`${PATHS.subtitleCues}: reelId muss ${slug} sein.`);
  if (subtitles.windowSize !== 9) errors.push(`${PATHS.subtitleCues}: windowSize muss 9 sein.`);
  if (!Array.isArray(subtitles.scenes) || subtitles.scenes.length !== reel.scenes.length) {
    errors.push(`${PATHS.subtitleCues}: benötigt Cues für alle acht Szenen.`);
  } else {
    const byScene = new Map(subtitles.scenes.map((scene) => [scene.sceneId, scene]));
    for (const scene of reel.scenes) {
      const cueScene = byScene.get(scene.sceneId);
      if (!cueScene || !Array.isArray(cueScene.words) || cueScene.words.length === 0) {
        errors.push(`${scene.sceneId}: Untertitel-Cues fehlen.`);
        continue;
      }
      let previous = -1;
      for (const word of cueScene.words) {
        if (!word.text || typeof word.text !== 'string') errors.push(`${scene.sceneId}: Untertitelwort ohne Text.`);
        if (!Number.isInteger(word.atFrame) || word.atFrame < 0 || word.atFrame >= scene.durationInFrames) {
          errors.push(`${scene.sceneId}: Cue ${word.text ?? '?'} liegt außerhalb der Szene.`);
        }
        if (word.atFrame < previous) errors.push(`${scene.sceneId}: Cues sind nicht sortiert.`);
        previous = word.atFrame;
      }
    }
  }
}

const assets = [];
if (manifest) {
  if (manifest.reelId !== slug) errors.push(`${PATHS.assetManifest}: reelId muss ${slug} sein.`);
  if (!Array.isArray(manifest.assets)) {
    errors.push(`${PATHS.assetManifest}: assets fehlen.`);
  } else {
    if (!unique(manifest.assets.map((asset) => asset.assetId))) errors.push('assetIds müssen eindeutig sein.');
    if (!unique(manifest.assets.map((asset) => asset.path))) errors.push('Asset-Pfade müssen eindeutig sein.');
    const sceneIds = new Set(reel?.scenes?.map((scene) => scene.sceneId) ?? []);
    for (const asset of manifest.assets) {
      if (!asset.assetId || !asset.path || !asset.type) {
        errors.push('Jedes Asset benötigt assetId, path und type.');
        continue;
      }
      if (!isSafePackagePath(asset.path)) {
        errors.push(`${asset.assetId}: unsicherer Pfad ${asset.path}.`);
        continue;
      }
      for (const sceneId of asset.sceneIds ?? []) {
        if (!sceneIds.has(sceneId)) errors.push(`${asset.assetId}: unbekannte sceneId ${sceneId}.`);
      }
      const absolutePath = resolve(reelDir, asset.path);
      if (!absolutePath.startsWith(`${reelDir}${sep}`)) {
        errors.push(`${asset.assetId}: Asset liegt außerhalb des Reel-Ordners.`);
        continue;
      }
      try {
        const metadata = await stat(absolutePath);
        const exists = metadata.isFile() && metadata.size > 0;
        assets.push({assetId: asset.assetId, path: asset.path, type: asset.type, required: Boolean(asset.required), exists, sizeBytes: metadata.size});
        if (!exists) errors.push(`${asset.assetId}: Asset-Datei ist leer oder ungültig.`);
      } catch {
        assets.push({assetId: asset.assetId, path: asset.path, type: asset.type, required: Boolean(asset.required), exists: false, sizeBytes: 0});
        const message = `${asset.assetId}: ${asset.path} fehlt.`;
        if (readyMode && asset.required) errors.push(message);
        else if (asset.required) warnings.push(message);
      }
    }
  }
}

const fingerprint = createHash('sha256');
for (const path of [...REQUIRED_FILES].sort()) {
  fingerprint.update(path);
  fingerprint.update('\0');
  fingerprint.update(contents.get(path) ?? '');
  fingerprint.update('\0');
}
for (const asset of assets.filter((asset) => asset.exists).sort((a, b) => a.path.localeCompare(b.path))) {
  fingerprint.update(asset.path);
  fingerprint.update('\0');
  fingerprint.update(String(asset.sizeBytes));
  fingerprint.update('\0');
}
const packageFingerprint = fingerprint.digest('hex');

await mkdir(resolve(reelDir, '99_INTERN'), {recursive: true});
const report = {
  version: 3,
  slug,
  structure: 'minimal-visible-reel-v3',
  readyMode,
  generatedAt: new Date().toISOString(),
  packageFingerprint,
  valid: errors.length === 0,
  errors,
  warnings,
  sourceFiles: REQUIRED_FILES,
  assets,
};
await writeFile(resolve(reelDir, PATHS.packageReport), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (errors.length === 0 && !validateOnly) {
  const assetTable = [
    '| Asset | Pfad | Pflicht | Vorhanden | Bytes |',
    '|---|---|---:|---:|---:|',
    ...assets.map((asset) =>
      `| ${asset.assetId} | \`${asset.path}\` | ${asset.required ? 'ja' : 'nein'} | ${asset.exists ? 'ja' : 'nein'} | ${asset.sizeBytes} |`,
    ),
  ].join('\n');
  const sections = [
    '# Generated Codex reel brief',
    '',
    `**Reel:** ${slug}`,
    `**Fingerprint:** \`${packageFingerprint}\``,
    `**Ready:** ${readyMode ? 'yes' : 'no'}`,
    '',
    '## Assets',
    '',
    assetTable,
    '',
    ...REQUIRED_FILES.flatMap((path) => [
      `## Source: \`${relative(process.cwd(), resolve(reelDir, path)).replaceAll('\\', '/')}\``,
      '',
      path.endsWith('.json') ? '```json' : '```markdown',
      contents.get(path) ?? '',
      '```',
      '',
    ]),
    '## Execution rule',
    '',
    'Follow AGENTS.md and 06_CODEX.md. Do not claim completion without current tests, renders, artifact checks, and visual review.',
    '',
  ];
  await writeFile(resolve(reelDir, PATHS.generatedBrief), sections.join('\n'), 'utf8');
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) {
  console.error(`Codex-Reel-Paket ungültig: ${errors.length} Fehler, ${warnings.length} Warnungen.`);
  process.exit(1);
}

console.log(`Codex-Reel-Paket gültig: ${slug}; ${assets.filter((asset) => asset.exists).length}/${assets.length} Assets vorhanden; Fingerprint ${packageFingerprint}.`);
if (!validateOnly) console.log(`Brief: ${relative(process.cwd(), resolve(reelDir, PATHS.generatedBrief))}`);
