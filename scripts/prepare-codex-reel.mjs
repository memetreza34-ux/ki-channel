import {createHash} from 'node:crypto';
import {readFile, stat, writeFile} from 'node:fs/promises';
import {resolve, relative, sep} from 'node:path';

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
const requiredFiles = [
  'README.md',
  'reel.json',
  'voiceover.md',
  'scene-plan.md',
  'image-prompts.md',
  'animation-plan.md',
  'subtitle-cues.json',
  'asset-manifest.json',
  'CODEX_ASSEMBLY_TASK.md',
  'review-checklist.md',
];
const errors = [];
const warnings = [];
const fileContents = new Map();

const readText = async (name) => {
  const path = resolve(reelDir, name);
  try {
    const content = await readFile(path, 'utf8');
    fileContents.set(name, content);
    return content;
  } catch (error) {
    errors.push(`${name} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

for (const file of requiredFiles) await readText(file);

const parseJson = (name) => {
  const content = fileContents.get(name);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    errors.push(`${name} enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const reel = parseJson('reel.json');
const subtitles = parseJson('subtitle-cues.json');
const manifest = parseJson('asset-manifest.json');

for (const [name, content] of fileContents) {
  if (content.includes('REPLACE_ME')) {
    errors.push(`${name} enthält noch REPLACE_ME.`);
  }
}

const unique = (values) => new Set(values).size === values.length;

if (reel) {
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
    if (!unique(reel.scenes.map((scene) => scene.sceneId))) errors.push('sceneIds müssen eindeutig sein.');
    if (!unique(reel.scenes.map((scene) => scene.fullAnimationId))) errors.push('fullAnimationIds müssen eindeutig sein.');
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
  } else if (reel.checkpoints.some((frame) => !Number.isInteger(frame) || frame < 0 || frame >= format.durationInFrames)) {
    errors.push('Alle Checkpoints müssen innerhalb der Composition liegen.');
  }
}

if (subtitles && reel?.scenes) {
  if (subtitles.reelId !== slug) errors.push(`subtitle-cues.json reelId muss ${slug} sein.`);
  if (!Array.isArray(subtitles.scenes)) {
    errors.push('subtitle-cues.json benötigt scenes.');
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
  if (manifest.reelId !== slug) errors.push(`asset-manifest.json reelId muss ${slug} sein.`);
  if (!Array.isArray(manifest.assets)) {
    errors.push('asset-manifest.json benötigt assets.');
  } else {
    if (!unique(manifest.assets.map((asset) => asset.assetId))) errors.push('assetIds müssen eindeutig sein.');
    if (!unique(manifest.assets.map((asset) => asset.path))) errors.push('Asset-Pfade müssen eindeutig sein.');
    const sceneIds = new Set(reel?.scenes?.map((scene) => scene.sceneId) ?? []);
    for (const asset of manifest.assets) {
      if (!asset.assetId || !asset.path || !asset.type) {
        errors.push('Jedes Asset benötigt assetId, path und type.');
        continue;
      }
      if (asset.path.includes('..') || asset.path.startsWith('/') || asset.path.split('/').includes('')) {
        errors.push(`${asset.assetId}: unsicherer Asset-Pfad ${asset.path}.`);
        continue;
      }
      for (const sceneId of asset.sceneIds ?? []) {
        if (!sceneIds.has(sceneId)) errors.push(`${asset.assetId}: unbekannte sceneId ${sceneId}.`);
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
      } catch (error) {
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
for (const name of requiredFiles) {
  const content = fileContents.get(name);
  if (content) {
    fingerprint.update(name);
    fingerprint.update('\0');
    fingerprint.update(content);
    fingerprint.update('\0');
  }
}
for (const asset of assets.filter((item) => item.exists).sort((a, b) => a.path.localeCompare(b.path))) {
  fingerprint.update(asset.path);
  fingerprint.update('\0');
  fingerprint.update(String(asset.sizeBytes));
  fingerprint.update('\0');
}
const packageFingerprint = fingerprint.digest('hex');

const report = {
  version: 1,
  slug,
  readyMode,
  generatedAt: new Date().toISOString(),
  packageFingerprint,
  valid: errors.length === 0,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  assets,
};

await writeFile(
  resolve(reelDir, 'codex-package-report.json'),
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
  const sections = [
    '# Generated Codex reel brief',
    '',
    `**Reel:** ${slug}`,
    `**Package fingerprint:** \`${packageFingerprint}\``,
    `**Ready validation:** ${readyMode ? 'yes' : 'no'}`,
    '',
    '## Asset inventory',
    '',
    assetTable,
    '',
    ...requiredFiles.flatMap((name) => [
      `## Source: \`${relative(process.cwd(), resolve(reelDir, name)).replaceAll('\\', '/')}\``,
      '',
      name.endsWith('.json') ? '```json' : '```markdown',
      fileContents.get(name) ?? '',
      '```',
      '',
    ]),
    '## Codex execution rule',
    '',
    'Follow repository and nested AGENTS.md files. Treat this generated brief as the primary implementation context. Open original source files only to resolve a contradiction. Do not claim completion without current tests, renders, and visual review.',
    '',
  ];
  await writeFile(
    resolve(reelDir, 'CODEX-BRIEF.generated.md'),
    sections.join('\n'),
    'utf8',
  );
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
if (!validateOnly) console.log(`Brief: ${relative(process.cwd(), resolve(reelDir, 'CODEX-BRIEF.generated.md'))}`);
