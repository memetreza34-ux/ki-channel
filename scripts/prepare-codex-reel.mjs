import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile, stat, writeFile} from 'node:fs/promises';
import {resolve, relative, sep} from 'node:path';

const args = process.argv.slice(2);
const rawPackage = args.find((arg) => !arg.startsWith('--'));
const readyMode = args.includes('--ready');
const validateOnly = args.includes('--validate-only');

if (!rawPackage) {
  console.error(
    'Usage: node scripts/prepare-codex-reel.mjs <YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel> [--ready] [--validate-only]',
  );
  process.exit(1);
}

const normalizePackageRef = (value) =>
  value
    .trim()
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .replace(/^ki\/reels\//, '')
    .replace(/\/+$/, '');

const packageRef = normalizePackageRef(rawPackage);
const packageParts = packageRef.split('/');
if (
  packageParts.length !== 2 ||
  !/^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(packageParts[0]) ||
  !/^\d{2}_[^/]+$/.test(packageParts[1]) ||
  packageParts.some((part) => part === '.' || part === '..')
) {
  console.error(
    'Reel-Paket muss exakt <YYYY-MM-DD_bis_YYYY-MM-DD>/<NN_Reel-Titel> entsprechen.',
  );
  process.exit(1);
}

const reelsRoot = resolve('ki', 'reels');
const reelDir = resolve(reelsRoot, ...packageParts);
const normalizedRoot = `${reelsRoot}${sep}`;
if (!reelDir.startsWith(normalizedRoot)) {
  console.error('Reel-Paket liegt außerhalb von ki/reels/.');
  process.exit(1);
}

try {
  execFileSync(process.execPath, ['scripts/check-ki-reel-folder-structure.mjs'], {
    stdio: 'inherit',
  });
} catch {
  console.error('Repository-Strukturprüfung fehlgeschlagen. Codex-Paket wird nicht vorbereitet.');
  process.exit(1);
}

const requiredFiles = Object.freeze({
  readme: 'README.md',
  voiceover: '01-script-audio/voiceover.md',
  assetManifest: '02-bilder/asset-manifest.json',
  subtitleCues: '03-caption/subtitle-cues.json',
  reel: '06-projektdateien/reel.json',
  scenePlan: '06-projektdateien/scene-plan.md',
  animationPlan: '06-projektdateien/animation-plan.md',
  assemblyTask: '06-projektdateien/CODEX_ASSEMBLY_TASK.md',
  reviewChecklist: '06-projektdateien/review-checklist.md',
});

const optionalFiles = [
  '02-bilder/image-prompts.md',
  '02-bilder/bildprompts.md',
  '01-script-audio/audio-plan.md',
  '03-caption/caption.md',
];

const errors = [];
const warnings = [];
const fileContents = new Map();

const readRequired = async (path) => {
  try {
    const content = await readFile(resolve(reelDir, path), 'utf8');
    fileContents.set(path, content);
    return content;
  } catch (error) {
    errors.push(
      `${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
};

const readOptional = async (path) => {
  try {
    const content = await readFile(resolve(reelDir, path), 'utf8');
    fileContents.set(path, content);
    return content;
  } catch {
    return null;
  }
};

for (const path of Object.values(requiredFiles)) await readRequired(path);
for (const path of optionalFiles) await readOptional(path);

for (const [path, content] of fileContents) {
  if (content.includes('REPLACE_ME')) errors.push(`${path} enthält noch REPLACE_ME.`);
}

const parseJson = (path) => {
  const content = fileContents.get(path);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    errors.push(
      `${path} enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
};

const reel = parseJson(requiredFiles.reel);
const subtitles = parseJson(requiredFiles.subtitleCues);
const manifest = parseJson(requiredFiles.assetManifest);

const unique = (values) => new Set(values).size === values.length;
const normalizeSpeech = (value) =>
  String(value ?? '')
    .toLocaleLowerCase('de-DE')
    .replace(/[„“”"'’`´]/g, '')
    .replace(/[–—-]/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

if (reel) {
  if (typeof reel.slug !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(reel.slug)) {
    errors.push(`${requiredFiles.reel} benötigt einen gültigen slug.`);
  }
  if (!reel.format || reel.format.width !== 1080 || reel.format.height !== 1920 || reel.format.fps !== 30) {
    errors.push(`${requiredFiles.reel} muss 1080 × 1920 bei 30 FPS verwenden.`);
  }
  if (!Number.isInteger(reel.format?.durationInFrames) || reel.format.durationInFrames <= 0) {
    errors.push(`${requiredFiles.reel} benötigt eine positive ganzzahlige durationInFrames.`);
  }
  if (!Array.isArray(reel.scenes) || reel.scenes.length < 2) {
    errors.push(`${requiredFiles.reel} benötigt mindestens zwei Szenen.`);
  } else {
    const sceneIds = reel.scenes.map((scene) => scene.sceneId);
    const animationIds = reel.scenes.map((scene) => scene.animationId);
    if (sceneIds.some((value) => typeof value !== 'string' || value.length === 0) || !unique(sceneIds)) {
      errors.push('sceneId muss pro Szene vorhanden und eindeutig sein.');
    }
    if (
      animationIds.some((value) => typeof value !== 'string' || value.length === 0) ||
      !unique(animationIds)
    ) {
      errors.push('animationId muss pro Szene vorhanden und innerhalb des Reels eindeutig sein.');
    }

    for (let index = 0; index < reel.scenes.length; index += 1) {
      const scene = reel.scenes[index];
      const expectedStart = index === 0 ? 0 : reel.scenes[index - 1].endFrame;
      if (!Number.isInteger(scene.startFrame) || scene.startFrame !== expectedStart) {
        errors.push(`${scene.sceneId ?? `scene-${index + 1}`}: startFrame muss ${expectedStart} sein.`);
      }
      if (!Number.isInteger(scene.endFrame) || scene.endFrame <= scene.startFrame) {
        errors.push(`${scene.sceneId ?? `scene-${index + 1}`}: endFrame muss nach startFrame liegen.`);
      }
      if (typeof scene.spokenText !== 'string' || scene.spokenText.trim().length === 0) {
        errors.push(`${scene.sceneId ?? `scene-${index + 1}`}: spokenText fehlt.`);
      }
    }

    const lastScene = reel.scenes.at(-1);
    if (lastScene?.endFrame !== reel.format?.durationInFrames) {
      errors.push('Die letzte Szene muss exakt bei format.durationInFrames enden.');
    }
  }
}

if (subtitles && reel?.scenes) {
  if (subtitles.fps !== reel.format?.fps) {
    errors.push(`${requiredFiles.subtitleCues}: fps muss mit reel.json übereinstimmen.`);
  }
  if (!Array.isArray(subtitles.cues) || subtitles.cues.length === 0) {
    errors.push(`${requiredFiles.subtitleCues} benötigt eine nicht-leere cues-Liste.`);
  } else {
    const sceneById = new Map(reel.scenes.map((scene) => [scene.sceneId, scene]));
    const cuesByScene = new Map(reel.scenes.map((scene) => [scene.sceneId, []]));

    let previousCueEnd = 0;
    for (const [index, cue] of subtitles.cues.entries()) {
      const scene = sceneById.get(cue.sceneId);
      if (!scene) {
        errors.push(`Subtitle-Cue ${index + 1}: unbekannte sceneId ${cue.sceneId}.`);
        continue;
      }
      if (
        !Number.isInteger(cue.startFrame) ||
        !Number.isInteger(cue.endFrame) ||
        cue.startFrame < scene.startFrame ||
        cue.endFrame > scene.endFrame ||
        cue.endFrame <= cue.startFrame
      ) {
        errors.push(`Subtitle-Cue ${index + 1} liegt außerhalb von ${cue.sceneId}.`);
      }
      if (index > 0 && cue.startFrame < previousCueEnd) {
        errors.push(`Subtitle-Cue ${index + 1} überlappt den vorherigen Cue.`);
      }
      previousCueEnd = cue.endFrame;
      if (typeof cue.text !== 'string' || cue.text.trim().length === 0) {
        errors.push(`Subtitle-Cue ${index + 1} hat keinen Text.`);
      }
      cuesByScene.get(cue.sceneId)?.push(cue);
    }

    for (const scene of reel.scenes) {
      const sceneCues = cuesByScene.get(scene.sceneId) ?? [];
      if (sceneCues.length === 0) {
        errors.push(`${scene.sceneId}: keine Subtitle-Cues vorhanden.`);
        continue;
      }
      const captionText = sceneCues.map((cue) => cue.text).join(' ');
      if (normalizeSpeech(captionText) !== normalizeSpeech(scene.spokenText)) {
        errors.push(`${scene.sceneId}: Subtitle-Text deckt den genehmigten spokenText nicht exakt ab.`);
      }
    }
  }
}

if (manifest && reel) {
  if (manifest.reelSlug && manifest.reelSlug !== reel.slug) {
    errors.push(
      `${requiredFiles.assetManifest}: reelSlug ${manifest.reelSlug} stimmt nicht mit ${reel.slug} überein.`,
    );
  }
}

const assetCandidates = [];
const addAssetCandidate = (kind, value, fallbackRequired = true) => {
  if (!value) return;
  if (typeof value === 'string') {
    assetCandidates.push({kind, path: value, required: fallbackRequired});
    return;
  }
  if (typeof value === 'object') {
    const path = value.path ?? value.file ?? value.src ?? null;
    if (typeof path === 'string' && path.trim()) {
      assetCandidates.push({
        kind,
        path,
        required: value.required ?? fallbackRequired,
      });
    }
  }
};

if (manifest) {
  for (const image of manifest.images ?? []) addAssetCandidate('image', image, true);
  for (const video of manifest.videos ?? []) addAssetCandidate('video', video, true);
  addAssetCandidate('voiceover', manifest.audio?.voiceover, Boolean(reel?.audio?.voiceoverRequired));
  addAssetCandidate('music', manifest.audio?.music, false);
  for (const sfx of manifest.audio?.sfx ?? []) addAssetCandidate('sfx', sfx, false);
}

const assetReport = [];
for (const asset of assetCandidates) {
  const normalized = asset.path.replaceAll('\\', '/').replace(/^\.\//, '');
  if (normalized.includes('..') || normalized.startsWith('/')) {
    errors.push(`Unsicherer Asset-Pfad: ${asset.path}`);
    continue;
  }

  const candidatePaths = [resolve(reelDir, normalized)];
  if (!normalized.startsWith('01-') && !normalized.startsWith('02-') && !normalized.startsWith('03-')) {
    if (asset.kind === 'voiceover') candidatePaths.push(resolve(reelDir, '01-script-audio', normalized));
    if (asset.kind === 'image') candidatePaths.push(resolve(reelDir, '02-bilder', normalized));
    if (asset.kind === 'video') candidatePaths.push(resolve(reelDir, '02-bilder', normalized));
  }

  let foundPath = null;
  let sizeBytes = 0;
  for (const candidate of candidatePaths) {
    if (!candidate.startsWith(`${reelDir}${sep}`)) continue;
    try {
      const metadata = await stat(candidate);
      if (metadata.isFile()) {
        foundPath = candidate;
        sizeBytes = metadata.size;
        break;
      }
    } catch {
      // Try next canonical candidate.
    }
  }

  assetReport.push({
    kind: asset.kind,
    declaredPath: asset.path,
    resolvedPath: foundPath ? relative(reelDir, foundPath).replaceAll('\\', '/') : null,
    required: Boolean(asset.required),
    exists: Boolean(foundPath),
    sizeBytes,
  });

  if (!foundPath && asset.required) {
    const message = `${asset.kind}: Pflicht-Asset ${asset.path} fehlt.`;
    if (readyMode) errors.push(message);
    else warnings.push(message);
  }
  if (foundPath && sizeBytes === 0) errors.push(`${asset.kind}: Asset ${asset.path} ist leer.`);
}

if (readyMode && reel?.audio?.voiceoverRequired && manifest?.audio?.voiceover == null) {
  errors.push(
    'Ready-Validierung verlangt Voiceover, aber asset-manifest.json deklariert noch kein Voiceover-Asset.',
  );
}

const fingerprint = createHash('sha256');
for (const path of [...fileContents.keys()].sort()) {
  fingerprint.update(path);
  fingerprint.update('\0');
  fingerprint.update(fileContents.get(path));
  fingerprint.update('\0');
}
for (const asset of assetReport.filter((item) => item.exists).sort((a, b) => a.declaredPath.localeCompare(b.declaredPath))) {
  fingerprint.update(asset.declaredPath);
  fingerprint.update('\0');
  fingerprint.update(String(asset.sizeBytes));
  fingerprint.update('\0');
}
const packageFingerprint = fingerprint.digest('hex');

const report = {
  version: 2,
  packageRef,
  reelSlug: reel?.slug ?? null,
  readyMode,
  generatedAt: new Date().toISOString(),
  packageFingerprint,
  valid: errors.length === 0,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  assets: assetReport,
};

const projectDir = resolve(reelDir, '06-projektdateien');
const reportPath = resolve(projectDir, 'codex-package-report.json');
const briefPath = resolve(projectDir, 'CODEX-BRIEF.generated.md');

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8').catch((error) => {
  console.error(
    `Bericht konnte nicht geschrieben werden: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});

if (errors.length === 0 && !validateOnly) {
  const assetTable = assetReport.length === 0
    ? 'Keine externen Asset-Dateien deklariert.'
    : [
        '| Typ | Deklariert | Aufgelöst | Pflicht | Vorhanden | Bytes |',
        '|---|---|---|---:|---:|---:|',
        ...assetReport.map(
          (asset) =>
            `| ${asset.kind} | \`${asset.declaredPath}\` | ${asset.resolvedPath ? `\`${asset.resolvedPath}\`` : '—'} | ${asset.required ? 'ja' : 'nein'} | ${asset.exists ? 'ja' : 'nein'} | ${asset.sizeBytes} |`,
        ),
      ].join('\n');

  const sections = [
    '# Generated Codex reel brief',
    '',
    `**Package:** \`ki/reels/${packageRef}/\``,
    `**Reel slug:** \`${reel?.slug ?? 'unknown'}\``,
    `**Package fingerprint:** \`${packageFingerprint}\``,
    `**Ready validation:** ${readyMode ? 'yes' : 'no'}`,
    '',
    '## Asset inventory',
    '',
    assetTable,
    '',
  ];

  for (const path of [...fileContents.keys()].sort()) {
    sections.push(
      `## Source: \`${relative(process.cwd(), resolve(reelDir, path)).replaceAll('\\', '/')}\``,
      '',
      path.endsWith('.json') ? '```json' : '```markdown',
      fileContents.get(path),
      '```',
      '',
    );
  }

  sections.push(
    '## Codex execution rule',
    '',
    'Follow repository and nested AGENTS.md files. The weekly reel package remains the authoritative planning source. Implement executable TS/TSX separately under `ki/src/reels/<reel-slug>/`. Do not relocate planning files. Do not claim completion without current tests, renders and manual visual review.',
    '',
  );

  await writeFile(briefPath, sections.join('\n'), 'utf8');
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(
    `Codex-Reel-Paket ungültig: ${errors.length} Fehler, ${warnings.length} Warnungen.`,
  );
  process.exit(1);
}

console.log(
  `Codex-Reel-Paket gültig: ki/reels/${packageRef}/; ${assetReport.filter((asset) => asset.exists).length}/${assetReport.length} deklarierte Asset-Dateien vorhanden; Fingerprint ${packageFingerprint}.`,
);
console.log(`Report: ${relative(process.cwd(), reportPath).replaceAll('\\', '/')}`);
if (!validateOnly) {
  console.log(`Brief: ${relative(process.cwd(), briefPath).replaceAll('\\', '/')}`);
}
