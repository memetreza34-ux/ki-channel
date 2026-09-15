import {createHash} from 'node:crypto';
import {access, mkdir, readFile, rename, stat, writeFile} from 'node:fs/promises';
import {basename, dirname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const [mode, reelArg] = process.argv.slice(2);
if (!['verify', 'materialize'].includes(mode) || !reelArg) {
  console.error('Usage: node scripts/materialize-generated-media.mjs <verify|materialize> <reel-package-dir>');
  process.exit(2);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reelDir = resolve(projectRoot, reelArg);
const requestPath = resolve(reelDir, '06-projektdateien', 'GENERATED-MEDIA-REQUESTS.json');
const manifestPath = resolve(reelDir, '06-projektdateien', 'GENERATED-MEDIA.json');
const publicRoot = resolve(projectRoot, 'public', 'reel-assets', 'generated');
const visualWorldPath = resolve(projectRoot, 'ki', 'brand', 'visual-world.json');

const IMAGE_MODEL = process.env.KI_IMAGE_MODEL || 'gemini-3.1-flash-image';
const VIDEO_MODEL = process.env.KI_VIDEO_MODEL || 'veo-3.1-generate-preview';
const boundedEnvNumber = (name, fallback, min, max) => {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
};
const MAX_ITEMS = boundedEnvNumber('KI_MEDIA_MAX_ITEMS', 8, 1, 20);
const POLL_INTERVAL_MS = boundedEnvNumber('KI_VIDEO_POLL_MS', 10000, 5000, 60000);
const POLL_TIMEOUT_MS = boundedEnvNumber('KI_VIDEO_TIMEOUT_MS', 480000, 60000, 900000);
const GOOGLE_IMAGE_BASE = 'https://generativelanguage.googleapis.com/v1';
const GOOGLE_VIDEO_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const ALLOWED_KINDS = new Set(['IMAGE', 'BROLL']);
const ALLOWED_EVIDENCE_ROLES = new Set(['ILLUSTRATION', 'ATMOSPHERE', 'TRANSITION']);
const FORBIDDEN_EVIDENCE_ROLES = new Set([
  'PROOF', 'EVIDENCE', 'OFFICIAL', 'OFFICIAL_UI', 'PRODUCT_UI', 'REAL_EVENT',
  'REAL_FOOTAGE', 'BRAND_IDENTITY', 'SOURCE',
]);

const fail = (message) => {
  console.error(`GENERATED MEDIA ERROR: ${message}`);
  process.exit(1);
};

const readJson = async (path, required = true) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (!required && error?.code === 'ENOENT') return null;
    fail(`${path} fehlt oder enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const exists = async (path) => {
  try { await access(path); return true; } catch { return false; }
};
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const fileSha256 = async (path) => sha256(await readFile(path));
const sanitizeId = (id) => id.replace(/[^a-zA-Z0-9._-]/g, '-');

const visualWorld = await readJson(visualWorldPath);
if (!visualWorld?.id || !visualWorld?.promptPrefix) fail('ki/brand/visual-world.json ist unvollständig.');
const visualWorldFingerprint = sha256(JSON.stringify(visualWorld));

const assertInside = (parent, child, label) => {
  const normalizedParent = parent.endsWith(sep) ? parent : `${parent}${sep}`;
  if (!(child === parent || child.startsWith(normalizedParent))) {
    fail(`${label} verlässt den erlaubten Pfad: ${child}`);
  }
};

const validateRequest = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail('Request-Datei muss ein JSON-Objekt sein.');
  if (raw.schemaVersion !== 1) fail('GENERATED-MEDIA-REQUESTS.json braucht schemaVersion: 1.');
  if (!Array.isArray(raw.items)) fail('GENERATED-MEDIA-REQUESTS.json braucht items[].');
  if (raw.items.length > MAX_ITEMS) fail(`Maximal ${MAX_ITEMS} generierte Medien pro Lauf erlaubt. KI_MEDIA_MAX_ITEMS kann bewusst bis 20 erhöht werden.`);

  const ids = new Set();
  const forbiddenStylePhrases = Array.isArray(visualWorld?.forbiddenPromptPhrases) ? visualWorld.forbiddenPromptPhrases : [];
  const items = raw.items.map((item, index) => {
    const label = `items[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) fail(`${label} muss ein Objekt sein.`);
    if (typeof item.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{1,79}$/.test(item.id)) fail(`${label}.id muss 2-80 Zeichen lang und dateisicher sein.`);
    if (ids.has(item.id)) fail(`Doppelte Media-ID: ${item.id}`);
    ids.add(item.id);

    const kind = String(item.kind || '').toUpperCase();
    if (!ALLOWED_KINDS.has(kind)) fail(`${item.id}: kind muss IMAGE oder BROLL sein.`);
    if (typeof item.prompt !== 'string' || item.prompt.trim().length < 20) fail(`${item.id}: prompt muss mindestens 20 Zeichen enthalten.`);
    if (typeof item.purpose !== 'string' || item.purpose.trim().length < 8) fail(`${item.id}: purpose muss die visuelle Aufgabe erklären.`);

    const positivePromptLower = item.prompt.toLocaleLowerCase('en-US');
    for (const phrase of forbiddenStylePhrases) {
      if (positivePromptLower.includes(String(phrase).toLocaleLowerCase('en-US'))) {
        fail(`${item.id}: positiver Prompt widerspricht der KI-Kanal-Bildwelt durch "${phrase}". Nutze ki/brand/visual-world.json.`);
      }
    }

    const evidenceRole = String(item.evidenceRole || '').toUpperCase();
    if (FORBIDDEN_EVIDENCE_ROLES.has(evidenceRole)) fail(`${item.id}: KI-generierte Medien dürfen nicht als ${evidenceRole} ausgegeben werden.`);
    if (!ALLOWED_EVIDENCE_ROLES.has(evidenceRole)) fail(`${item.id}: evidenceRole muss ILLUSTRATION, ATMOSPHERE oder TRANSITION sein.`);

    const aspectRatio = item.aspectRatio || '9:16';
    if (!['9:16', '16:9'].includes(aspectRatio)) fail(`${item.id}: aspectRatio muss 9:16 oder 16:9 sein.`);

    const normalized = {
      id: item.id,
      kind,
      prompt: item.prompt.trim(),
      negativePrompt: typeof item.negativePrompt === 'string' ? item.negativePrompt.trim() : '',
      purpose: item.purpose.trim(),
      sceneId: typeof item.sceneId === 'string' ? item.sceneId : null,
      claimId: typeof item.claimId === 'string' ? item.claimId : null,
      evidenceRole,
      aspectRatio,
    };

    if (kind === 'IMAGE') {
      normalized.imageSize = item.imageSize || '1K';
      if (!['512', '1K', '2K', '4K'].includes(normalized.imageSize)) fail(`${item.id}: imageSize muss 512, 1K, 2K oder 4K sein.`);
    } else {
      normalized.durationSeconds = String(item.durationSeconds ?? 8);
      if (!['4', '6', '8'].includes(normalized.durationSeconds)) fail(`${item.id}: BROLL durationSeconds muss 4, 6 oder 8 sein.`);
      normalized.resolution = item.resolution || '720p';
      if (!['720p', '1080p', '4k'].includes(normalized.resolution)) fail(`${item.id}: resolution muss 720p, 1080p oder 4k sein.`);
      if (normalized.resolution !== '720p' && normalized.durationSeconds !== '8') fail(`${item.id}: 1080p/4k B-Roll braucht 8 Sekunden.`);
    }
    return normalized;
  });

  return {schemaVersion: 1, provider: 'GOOGLE_GEMINI', items};
};

const requestFingerprint = (item, model) => sha256(JSON.stringify({
  schemaVersion: 1,
  provider: 'GOOGLE_GEMINI',
  model,
  visualWorldFingerprint,
  ...item,
}));

const buildPrompt = (item) => {
  const palette = visualWorld?.palette || {};
  const paletteText = [
    ...(Array.isArray(palette.anchor) ? palette.anchor : []),
    ...(Array.isArray(palette.semantic) ? palette.semantic : []),
    ...(Array.isArray(palette.neutral) ? palette.neutral : []),
  ].join(', ');
  const canonicalAvoid = Array.isArray(visualWorld?.defaultAvoid) ? visualWorld.defaultAvoid.join(', ') : '';
  const parts = [
    'Create an original AI-generated illustrative visual for a faceless KI-channel explainer.',
    `Canonical visual-world profile: ${visualWorld.id}.`,
    visualWorld.promptPrefix,
    paletteText ? `Canonical palette reference: ${paletteText}.` : '',
    visualWorld.lighting ? `Lighting: ${visualWorld.lighting}` : '',
    visualWorld.composition ? `Composition: ${visualWorld.composition}` : '',
    visualWorld.materials ? `Materials: ${visualWorld.materials}` : '',
    item.kind === 'BROLL' && visualWorld.motion ? `Motion: ${visualWorld.motion}` : '',
    'The result must look like it belongs inside the same bright white-lavender Remotion reel, not like a separate film, documentary, advertisement or dark cinematic still.',
    'Do not imitate a news photograph, documentary evidence, official product screenshot, official UI, or authentic brand asset.',
    'Do not add logos, watermarks, captions, subtitles, interface text, or factual labels unless the prompt explicitly asks for generic non-brand text.',
    `The visual purpose is: ${item.purpose}.`,
  ].filter(Boolean);
  const avoid = [canonicalAvoid, item.negativePrompt].filter(Boolean).join(', ');
  if (avoid) parts.push(`Avoid: ${avoid}.`);
  parts.push(item.prompt);
  return parts.join(' ');
};

const apiJson = async (url, options, label) => {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : {}; }
  catch { throw new Error(`${label}: API lieferte kein gültiges JSON (HTTP ${response.status}).`); }
  if (!response.ok) throw new Error(`${label}: ${payload?.error?.message || `HTTP ${response.status}`}`);
  return payload;
};

const generateImage = async (item, apiKey) => {
  const prompt = buildPrompt(item);
  const payload = await apiJson(
    `${GOOGLE_IMAGE_BASE}/models/${encodeURIComponent(IMAGE_MODEL)}:generateContent`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-goog-api-key': apiKey},
      body: JSON.stringify({
        contents: [{parts: [{text: prompt}]}],
        generationConfig: {
          responseModalities: ['IMAGE'],
          responseFormat: {image: {aspectRatio: item.aspectRatio, imageSize: item.imageSize}},
        },
      }),
    },
    item.id,
  );

  const parts = payload?.candidates?.flatMap((candidate) => candidate?.content?.parts || []) || [];
  const imagePart = parts.find((part) => part?.inlineData?.data || part?.inline_data?.data);
  const inlineData = imagePart?.inlineData || imagePart?.inline_data;
  if (!inlineData?.data) throw new Error(`${item.id}: Gemini lieferte kein Bild.`);
  const mimeType = inlineData.mimeType || inlineData.mime_type || 'image/png';
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) throw new Error(`${item.id}: unerwarteter Bildtyp ${mimeType}.`);
  return {bytes: Buffer.from(inlineData.data, 'base64'), mimeType, model: IMAGE_MODEL, apiVersion: 'v1', generatedPrompt: prompt};
};

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
const generateVideo = async (item, apiKey) => {
  const prompt = buildPrompt(item);
  const payload = await apiJson(
    `${GOOGLE_VIDEO_BASE}/models/${encodeURIComponent(VIDEO_MODEL)}:predictLongRunning`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-goog-api-key': apiKey},
      body: JSON.stringify({
        instances: [{prompt}],
        parameters: {
          aspectRatio: item.aspectRatio,
          durationSeconds: item.durationSeconds,
          resolution: item.resolution,
          numberOfVideos: 1,
        },
      }),
    },
    item.id,
  );

  if (!payload?.name) throw new Error(`${item.id}: Veo lieferte keinen Operation-Namen.`);
  const started = Date.now();
  let operation = payload;
  while (!operation.done) {
    if (Date.now() - started > POLL_TIMEOUT_MS) throw new Error(`${item.id}: Veo-Generierung hat das Timeout von ${POLL_TIMEOUT_MS} ms überschritten.`);
    await sleep(POLL_INTERVAL_MS);
    operation = await apiJson(`${GOOGLE_VIDEO_BASE}/${operation.name}`, {headers: {'x-goog-api-key': apiKey}}, `${item.id} poll`);
  }
  if (operation.error) throw new Error(`${item.id}: Veo fehlgeschlagen: ${operation.error.message || JSON.stringify(operation.error)}`);

  const videoUri = operation?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri || operation?.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error(`${item.id}: Veo lieferte keine Download-URI.`);
  const response = await fetch(videoUri, {headers: {'x-goog-api-key': apiKey}, redirect: 'follow'});
  if (!response.ok) throw new Error(`${item.id}: Video-Download fehlgeschlagen (HTTP ${response.status}).`);
  return {
    bytes: Buffer.from(await response.arrayBuffer()),
    mimeType: response.headers.get('content-type')?.split(';')[0] || 'video/mp4',
    model: VIDEO_MODEL,
    apiVersion: 'v1beta',
    generatedPrompt: prompt,
    remoteOperation: operation.name,
  };
};

const extensionFor = (kind, mimeType) => {
  if (kind === 'BROLL') return '.mp4';
  if (mimeType === 'image/jpeg') return '.jpg';
  if (mimeType === 'image/webp') return '.webp';
  return '.png';
};
const assertGeneratedBytes = (item, bytes, mimeType) => {
  if (!Buffer.isBuffer(bytes) || bytes.length < 1024) throw new Error(`${item.id}: generierte Datei ist leer oder verdächtig klein.`);
  if (item.kind === 'IMAGE' && !mimeType.startsWith('image/')) throw new Error(`${item.id}: erwartetes Bild, erhalten ${mimeType}.`);
  if (item.kind === 'BROLL' && mimeType !== 'video/mp4' && !mimeType.startsWith('video/')) throw new Error(`${item.id}: erwartetes Video, erhalten ${mimeType}.`);
};
const atomicWriteJson = async (path, value) => {
  await mkdir(dirname(path), {recursive: true});
  const temp = `${path}.tmp-${process.pid}`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temp, path);
};

assertInside(projectRoot, reelDir, 'Reel package');
const request = validateRequest(await readJson(requestPath));
console.log(`Generated-media ${mode}: ${request.items.length} request(s) in ${reelArg}`);
console.log(`Visual world: ${visualWorld.id} v${visualWorld.version} (${visualWorldFingerprint.slice(0, 12)})`);
if (mode === 'verify') {
  console.log('GENERATED MEDIA VERIFIED: schema, truth roles, limits, generation parameters and canonical reel visual world are valid. No API call was made.');
  process.exit(0);
}
if (request.items.length === 0) {
  console.log('No generated media requested. Nothing to materialize.');
  process.exit(0);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) fail('GEMINI_API_KEY fehlt. Keine Generierung gestartet.');

const reelJson = await readJson(resolve(reelDir, '06-projektdateien', 'reel.json'), false);
const reelSlug = sanitizeId(String(reelJson?.compositionId || reelJson?.slug || basename(reelDir)));
const outputDir = resolve(publicRoot, reelSlug);
assertInside(publicRoot, outputDir, 'Generated-media output');
await mkdir(outputDir, {recursive: true});

const previous = await readJson(manifestPath, false);
const previousItems = new Map(Array.isArray(previous?.items) ? previous.items.map((item) => [item.id, item]) : []);
const manifest = {
  schemaVersion: 1,
  provider: 'GOOGLE_GEMINI',
  generatedMediaIsEvidence: false,
  audioPolicy: 'GENERATED_BROLL_AUDIO_MUTED_IN_PRODUCTION',
  visualWorld: {
    id: visualWorld.id,
    version: visualWorld.version,
    fingerprint: visualWorldFingerprint,
    source: 'ki/brand/visual-world.json',
  },
  reelPackage: reelArg.replaceAll('\\', '/'),
  outputRoot: `reel-assets/generated/${reelSlug}`,
  updatedAt: new Date().toISOString(),
  items: [],
};

for (const item of request.items) {
  const model = item.kind === 'IMAGE' ? IMAGE_MODEL : VIDEO_MODEL;
  const fingerprint = requestFingerprint(item, model);
  const cached = previousItems.get(item.id);
  const cachedPath = cached?.localFile ? resolve(projectRoot, 'public', cached.localFile) : null;
  if (cachedPath) assertInside(resolve(projectRoot, 'public'), cachedPath, `${item.id} cached output`);

  if (cached && cached.requestFingerprint === fingerprint && cachedPath && (await exists(cachedPath))) {
    const actualSha = await fileSha256(cachedPath);
    if (actualSha === cached.sha256) {
      manifest.items.push({...cached, reusedAt: new Date().toISOString()});
      console.log(`REUSE ${item.id}: ${cached.localFile}`);
      await atomicWriteJson(manifestPath, manifest);
      continue;
    }
  }

  console.log(`GENERATE ${item.id} (${item.kind}) with ${model}`);
  const result = item.kind === 'IMAGE' ? await generateImage(item, apiKey) : await generateVideo(item, apiKey);
  assertGeneratedBytes(item, result.bytes, result.mimeType);
  const fileName = `${sanitizeId(item.id)}-${fingerprint.slice(0, 12)}${extensionFor(item.kind, result.mimeType)}`;
  const outputPath = resolve(outputDir, fileName);
  assertInside(outputDir, outputPath, `${item.id} output`);
  await writeFile(outputPath, result.bytes);

  const outputStats = await stat(outputPath);
  const outputSha = await fileSha256(outputPath);
  const localFile = `reel-assets/generated/${reelSlug}/${fileName}`;
  manifest.items.push({
    id: item.id,
    kind: item.kind,
    sceneId: item.sceneId,
    claimId: item.claimId,
    purpose: item.purpose,
    evidenceRole: item.evidenceRole,
    provider: 'GOOGLE_GEMINI',
    model: result.model,
    apiVersion: result.apiVersion,
    requestFingerprint: fingerprint,
    visualWorldId: visualWorld.id,
    visualWorldVersion: visualWorld.version,
    visualWorldFingerprint,
    generatedAt: new Date().toISOString(),
    generated: true,
    syntheticMedia: true,
    evidenceAllowed: false,
    reviewRequired: true,
    audioPolicy: item.kind === 'BROLL' ? 'MUTE_GENERATED_AUDIO' : null,
    aspectRatio: item.aspectRatio,
    durationSeconds: item.kind === 'BROLL' ? Number(item.durationSeconds) : null,
    resolution: item.kind === 'BROLL' ? item.resolution : item.imageSize,
    mimeType: result.mimeType,
    bytes: outputStats.size,
    sha256: outputSha,
    localFile,
    remotionStaticFile: localFile,
    prompt: item.prompt,
    generatedPrompt: result.generatedPrompt,
    remoteOperation: result.remoteOperation || null,
  });
  await atomicWriteJson(manifestPath, manifest);
  console.log(`OK ${item.id}: ${localFile} (${outputStats.size} bytes)`);
}

console.log(`GENERATED MEDIA MATERIALIZED: ${manifest.items.length} item(s).`);
console.log(`Manifest: ${manifestPath}`);