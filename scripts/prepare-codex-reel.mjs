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
if (slug === '_codex-hybrid-template') {
  console.error('Copy the template to a real reel slug before preparation.');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]+$/.test(slug)) {
  console.error('Reel slug must contain only lowercase letters, digits, and hyphens.');
  process.exit(1);
}

const reelDir = resolve('ki', 'reels', slug);
const errors = [];
const warnings = [];
const fileContents = new Map();

const STRUCTURED_FILES = Object.freeze({
  readme: 'README.md',
  reel: 'reel.json',
  voiceover: 'script/voiceover.md',
  subtitleCues: 'script/subtitle-cues.json',
  sceneIndex: 'scenes/README.md',
  imagePrompts: 'visuals/image-prompts.md',
  animationPlan: 'visuals/animation-plan.md',
  assetManifest: 'assets/asset-manifest.json',
  codexTask: 'codex/CODEX_ASSEMBLY_TASK.md',
  reviewChecklist: 'codex/review-checklist.md',
  generatedBrief: 'codex/CODEX-BRIEF.generated.md',
  packageReport: 'codex/codex-package-report.json',
});

const normalizeRelativePath = (value) => value.replaceAll('\\', '/');

const isSafePackagePath = (value) =>
  typeof value === 'string' &&
  value.length > 0 &&
  !value.startsWith('/') &&
  !value.includes('..') &&
  !value.split('/').includes('');

const readText = async (path) => {
  try {
    const content = await readFile(resolve(reelDir, path), 'utf8');
    fileContents.set(path, content);
    return content;
  } catch (error) {
    errors.push(`${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const parseJsonContent = (path, content) => {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    errors.push(`${path} enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const readmeContent = await readText(STRUCTURED_FILES.readme);
const reelContent = await readText(STRUCTURED_FILES.reel);
const reel = parseJsonContent(STRUCTURED_FILES.reel, reelContent);

const requiredFiles = [
  STRUCTURED_FILES.readme,
  STRUCTURED_FILES.reel,
  STRUCTURED_FILES.voiceover,
  STRUCTURED_FILES.subtitleCues,
  STRUCTURED_FILES.sceneIndex,
  STRUCTURED_FILES.imagePrompts,
  STRUCTURED_FILES.animationPlan,
  STRUCTURED_FILES.assetManifest,
  STRUCTURED_FILES.codexTask,
  STRUCTURED_FILES.reviewChecklist,
];

if (reel?.files && typeof reel.files === 'object') {
  const expectedReferences = {
    voiceover: STRUCTURED_FILES.voiceover,
    subtitleCues: STRUCTURED_FILES.subtitleCues,
    sceneIndex: STRUCTURED_FILES.sceneIndex,
    imagePrompts: STRUCTURED_FILES.imagePrompts,
    animationPlan: STRUCTURED_FILES.animationPlan,
    assetManifest: STRUCTURED_FILES.assetManifest,
    codexTask: STRUCTURED_FILES.codexTask,
    reviewChecklist: STRUCTURED_FILES.reviewChecklist,
    generatedBrief: STRUCTURED_FILES.generatedBrief,
    packageReport: STRUCTURED_FILES.packageReport,
  };
  for (const [key, expected] of Object.entries(expectedReferences)) {
    if (reel.files[key] !== expected) {
      errors.push(`reel.json files.${key} muss ${expected} sein.`);
    }
  }
} else if (reel) {
  errors.push('reel.json benötigt ein files-Objekt für die strukturierte Produktionsablage.');
}

if (Array.isArray(reel?.scenes)) {
  for (const scene of reel.scenes) {
    if (!isSafePackagePath(scene.planFile) || !scene.planFile.startsWith('scenes/')) {
      errors.push(`${scene.sceneId ?? 'unbekannte Szene'}: planFile muss sicher unter scenes/ liegen.`);
      continue;
    }
    requiredFiles.push(normalizeRelativePath(scene.planFile));
  }
}

for (const path of [...new Set(requiredFiles)]) {
  if (!fileContents.has(path)) await readText(path);
}

const subtitles = parseJsonContent(
  STRUCTURED_FILES.subtitleCues,
  fileContents.get(STRUCTURED_FILES.subtitleCues),
);
const manifest = parseJsonContent(
  STRUCTURED_FILES.assetManifest,
  fileContents.get(STRUCTURED_FILES.assetManifest),
);

for (const [path, content] of fileContents) {
  if (content.includes('REPLACE_ME')) {
    errors.push(`${path} enthält noch REPLACE_ME.`);
  }
}

const unique = (values) => new Set(values).size === values.length;

if (reel) {
  if (reel.version !== 2) errors.push('reel.json version muss 2 sein.');
  if (reel.reelId !== slug) errors.push(`reel.json reelId muss ${slug} sein.`);
  if (!reel.compositionId || typeof reel.compositionId !== 'string') {
    errors.push('reel.json benötigt compositionId.');
  }
  const format = reel.format ?? {};
  if (format.width !== 1080 || format.height !== 1920 || format.fps !== 30) {
    errors.push('reel.json muss 1080 × 1920 bei 30 FPS verwenden.');
  }
  if (!Number.isInteger(format.durationInFrames) || format.durationInFrames <= 0) {
    errors.push('reel.json benötigt eine positive ganzzahlige durationInFrames.');
  }
  if (!Array.isArray(reel.scenes) || reel.scenes.length < 2) {
    errors.push('reel.json benötigt mindestens zwei Szenen.');
  } else {
    if (!unique(reel.scenes.map((scene) => scene.sceneId))) {
      errors.push('sceneIds müssen eindeutig sein.');
    }
    if (!unique(reel.scenes.map((scene) => scene.fullAnimationId))) {
      errors.push('fullAnimationIds müssen eindeutig sein.');
    }
    if (!unique(reel.scenes.map((scene) => scene.planFile))) {
      errors.push('planFile-Pfade müssen eindeutig sein.');
    }
    for (let index = 0; index < reel.scenes.length; index += 1) {
      const scene = reel.scenes[index];
      const expectedStart = index === 0 ? 0 : reel.scenes[index - 1].endFrameExclusive;
      if (scene.startFrame !== expectedStart) {
        errors.push(`${scene.sceneId}: startFrame ${scene.startFrame} erwartet ${expectedStart}.`);
      }
      if (scene.endFrameExclusive !== scene.startFrame + scene.durationInFrames) {
        errors.push(`${scene.sceneId}: endFrameExclusive passt nicht zur Dauer.`);
      }
      if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 45) {
        errors.push(`${scene.sceneId}: Dauer muss mindestens 45 Frames betragen.`);
      }
      if (!scene.heading || typeof scene.heading !== 'string') {
        errors.push(`${scene.sceneId}: heading fehlt.`);
      }
      const scenePlan = fileContents.get(scene.planFile);
      if (scenePlan && !scenePlan.includes(scene.sceneId.replace('scene-', 'Szene '))) {
        warnings.push(`${scene.planFile}: Szenennummer ist im Dokument nicht eindeutig sichtbar.`);
      }
      if (index > 0) {
        const previous = reel.scenes[index - 1];
        if (scene.layoutFamily === previous.layoutFamily) {
          errors.push(`${previous.sceneId} und ${scene.sceneId} wiederholen layoutFamily ${scene.layoutFamily}.`);
        }
        if (scene.motionSignature === previous.motionSignature) {
          errors.push(`${previous.sceneId} und ${scene.sceneId} wiederholen motionSignature ${scene.motionSignature}.`);
        }
      }
    }
    const last = reel.scenes[reel.scenes.length - 1];
    if (last.endFrameExclusive !== format.durationInFrames) {
      errors.push('Die letzte Szene muss exakt am Ende der Composition enden.');
    }
  }
  if (!Array.isArray(reel.checkpoints) || reel.checkpoints.length < reel.scenes.length * 3) {
    errors.push('reel.json benötigt mindestens drei Checkpoints pro Szene.');
  } else if (reel.checkpoints.some((frame) =>
    !Number.isInteger(frame) || frame < 0 || frame >= format.durationInFrames
  )) {
    errors.push('Alle Checkpoints müssen innerhalb der Composition liegen.');
  }
}

if (subtitles && reel?.scenes) {
  if (subtitles.reelId !== slug) {
    errors.push(`${STRUCTURED_FILES.subtitleCues} reelId muss ${slug} sein.`);
  }
  if (!Array.isArray(subtitles.scenes)) {
    errors.push(`${STRUCTURED_FILES.subtitleCues} benötigt scenes.`);
  } else {
    const cueByScene = new Map(subtitles.scenes.map((scene) => [scene.sceneId, scene]));
    for (const scene of reel.scenes) {
      const cues = cueByScene.get(scene.sceneId);
      if (!cues || !Array.isArray(cues.words) || cues.words.length === 0) {
        errors.push(`${scene.sceneId}: Untertitel-Cues fehlen.`);
        continue;
      }
      let previous = -1;
      for (const word of cues.words) {
        if (!word.text || typeof word.text !== 'string') {
          errors.push(`${scene.sceneId}: Untertitelwort ohne Text.`);
        }
        if (!Number.isInteger(word.atFrame) || word.atFrame < 0 || word.atFrame >= scene.durationInFrames) {
          errors.push(`${scene.sceneId}: Cue ${word.text ?? '?'} liegt außerhalb der Szene.`);
        }
        if (word.atFrame < previous) {
          errors.push(`${scene.sceneId}: Cues sind nicht sortiert.`);
        }
        previous = word.atFrame;
      }
    }
  }
}

const assets = [];
if (manifest) {
  if (manifest.reelId !== slug) {
    errors.push(`${STRUCTURED_FILES.assetManifest} reelId muss ${slug} sein.`);
  }
  if (!Array.isArray(manifest.assets)) {
    errors.push(`${STRUCTURED_FILES.assetManifest} benötigt assets.`);
  } else {
    if (!unique(manifest.assets.map((asset) => asset.assetId))) {
      errors.push('assetIds müssen eindeutig sein.');
    }
    if (!unique(manifest.assets.map((asset) => asset.path))) {
      errors.push('Asset-Pfade müssen eindeutig sein.');
    }
    const sceneIds = new Set(reel?.scenes?.map((scene) => scene.sceneId) ?? []);
    for (const asset of manifest.assets) {
      if (!asset.assetId || !asset.path || !asset.type) {
        errors.push('Jedes Asset benötigt assetId, path und type.');
        continue;
      }
      if (!isSafePackagePath(asset.path)) {
        errors.push(`${asset.assetId}: unsicherer Asset-Pfad ${asset.path}.`);
        continue;
      }
      for (const sceneId of asset.sceneIds ?? []) {
        if (!sceneIds.has(sceneId)) {
          errors.push(`${asset.assetId}: unbekannte sceneId ${sceneId}.`);
        }
      }
      const absolutePath = resolve(reelDir, asset.path);
      const normalizedRoot = `${reelDir}${sep}`;
      if (!absolutePath.startsWith(normalizedRoot)) {
        errors.push(`${asset.assetId}: Asset liegt außerhalb des Reel-Pakets.`);
        continue;
      }
      try {
        const metadata = await stat(absolutePath);
        if (!metadata.isFile()) throw new Error('Pfad ist keine Datei');
        assets.push({
          assetId: asset.assetId,
          path: asset.path,
          type: asset.type,
          required: Boolean(asset.required),
          exists: true,
          sizeBytes: metadata.size,
        });
        if (metadata.size === 0) errors.push(`${asset.assetId}: Asset-Datei ist leer.`);
      } catch {
        assets.push({
          assetId: asset.assetId,
          path: asset.path,
          type: asset.type,
          required: Boolean(asset.required),
          exists: false,
          sizeBytes: 0,
        });
        const message = `${asset.assetId}: ${asset.path} fehlt.`;
        if (readyMode && asset.required) errors.push(message);
        else if (asset.required) warnings.push(message);
      }
    }
  }
}

const fingerprint = createHash('sha256');
for (const path of [...new Set(requiredFiles)].sort()) {
  const content = fileContents.get(path);
  if (!content) continue;
  fingerprint.update(path);
  fingerprint.update('\0');
  fingerprint.update(content);
  fingerprint.update('\0');
}
for (const asset of assets.filter((item) => item.exists).sort((a, b) => a.path.localeCompare(b.path))) {
  fingerprint.update(asset.path);
  fingerprint.update('\0');
  fingerprint.update(String(asset.sizeBytes));
  fingerprint.update('\0');
}
const packageFingerprint = fingerprint.digest('hex');

const reportPath = reel?.files?.packageReport ?? STRUCTURED_FILES.packageReport;
const briefPath = reel?.files?.generatedBrief ?? STRUCTURED_FILES.generatedBrief;
await mkdir(resolve(reelDir, 'codex'), {recursive: true});

const report = {
  version: 2,
  slug,
  structure: 'structured-reel-package-v2',
  readyMode,
  generatedAt: new Date().toISOString(),
  packageFingerprint,
  valid: errors.length === 0,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  sourceFiles: [...new Set(requiredFiles)].sort(),
  assets,
};

await writeFile(
  resolve(reelDir, reportPath),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
).catch((error) => {
  console.error(`Bericht konnte nicht geschrieben werden: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

if (errors.length === 0 && !validateOnly) {
  const assetTable = assets.length === 0
    ? 'Keine Assets deklariert.'
    : [
        '| Asset | Pfad | Typ | Pflicht | Vorhanden | Bytes |',
        '|---|---|---|---:|---:|---:|',
        ...assets.map((asset) =>
          `| ${asset.assetId} | \`${asset.path}\` | ${asset.type} | ${asset.required ? 'ja' : 'nein'} | ${asset.exists ? 'ja' : 'nein'} | ${asset.sizeBytes} |`,
        ),
      ].join('\n');
  const orderedFiles = [...new Set(requiredFiles)];
  const sections = [
    '# Generated Codex reel brief',
    '',
    `**Reel:** ${slug}`,
    `**Package fingerprint:** \`${packageFingerprint}\``,
    `**Ready validation:** ${readyMode ? 'yes' : 'no'}`,
    `**Structure:** structured-reel-package-v2`,
    '',
    '## Asset inventory',
    '',
    assetTable,
    '',
    ...orderedFiles.flatMap((path) => [
      `## Source: \`${relative(process.cwd(), resolve(reelDir, path)).replaceAll('\\', '/')}\``,
      '',
      path.endsWith('.json') ? '```json' : '```markdown',
      fileContents.get(path) ?? '',
      '```',
      '',
    ]),
    '## Codex execution rule',
    '',
    'Follow repository and nested AGENTS.md files. Treat this generated brief as the primary implementation context. Open original source files only to resolve a contradiction. Do not claim completion without current tests, renders, and visual review.',
    '',
  ];
  await writeFile(resolve(reelDir, briefPath), sections.join('\n'), 'utf8');
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`Codex-Reel-Paket ungültig: ${errors.length} Fehler, ${warnings.length} Warnungen.`);
  process.exit(1);
}

console.log(
  `Codex-Reel-Paket gültig: ${slug}; ${assets.filter((asset) => asset.exists).length}/${assets.length} Assets vorhanden; Fingerprint ${packageFingerprint}.`,
);
if (!validateOnly) {
  console.log(`Brief: ${relative(process.cwd(), resolve(reelDir, briefPath)).replaceAll('\\', '/')}`);
  console.log(`Bericht: ${relative(process.cwd(), resolve(reelDir, reportPath)).replaceAll('\\', '/')}`);
}
