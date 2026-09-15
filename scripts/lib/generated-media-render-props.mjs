import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const sha256File = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');

const fail = (message) => {
  throw new Error(`GENERATED MEDIA PROP RESOLUTION FAILED: ${message}`);
};

const safeRelativePublicPath = (value) => {
  const raw = String(value || '').trim().replace(/\\/g, '/');
  if (!raw || path.posix.isAbsolute(raw)) fail(`invalid publicPath: ${raw || '(empty)'}`);
  const normalized = path.posix.normalize(raw);
  if (normalized === '..' || normalized.startsWith('../') || !normalized.startsWith('reel-assets/generated/')) {
    fail(`publicPath must stay under reel-assets/generated/: ${raw}`);
  }
  return normalized;
};

export const resolveGeneratedMediaRenderProps = async ({
  reelDir,
  reel,
  requireManifest = false,
  publicRoot = path.resolve('public'),
}) => {
  const bindings = reel?.visuals?.generatedMediaBindings;
  if (bindings == null) {
    return {
      status: 'NO_BINDINGS',
      props: {},
      assets: [],
      manifestPath: null,
      manifestSha256: null,
    };
  }
  if (!bindings || typeof bindings !== 'object' || Array.isArray(bindings)) {
    fail('reel.visuals.generatedMediaBindings must be an object mapping Remotion prop names to generated-media asset IDs.');
  }

  const entries = Object.entries(bindings);
  if (entries.length === 0) {
    return {
      status: 'NO_BINDINGS',
      props: {},
      assets: [],
      manifestPath: null,
      manifestSha256: null,
    };
  }

  const manifestRelative = String(reel?.visuals?.generatedMediaManifest || '').trim();
  if (!manifestRelative) fail('generatedMediaBindings exist but reel.visuals.generatedMediaManifest is missing.');
  const manifestPath = path.resolve(reelDir, manifestRelative);
  if (!existsSync(manifestPath)) {
    if (requireManifest) fail(`generated-media manifest is not materialized: ${manifestPath}`);
    return {
      status: 'MANIFEST_PENDING',
      props: {},
      assets: [],
      manifestPath,
      manifestSha256: null,
    };
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    fail(`invalid generated-media manifest ${manifestPath}: ${error.message}`);
  }
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest) || !Array.isArray(manifest.assets)) {
    fail('generated-media manifest must be an object with an assets array.');
  }
  if (reel?.reelId && manifest.reelId && String(manifest.reelId) !== String(reel.reelId)) {
    fail(`manifest reelId ${manifest.reelId} does not match reel.json reelId ${reel.reelId}.`);
  }

  const assetsById = new Map();
  for (const asset of manifest.assets) {
    const id = String(asset?.id || '').trim();
    if (!id) fail('manifest contains an asset without id.');
    if (assetsById.has(id)) fail(`manifest contains duplicate asset id: ${id}`);
    assetsById.set(id, asset);
  }

  const props = {};
  const resolvedAssets = [];
  for (const [propNameRaw, assetIdRaw] of entries) {
    const propName = String(propNameRaw).trim();
    const assetId = String(assetIdRaw || '').trim();
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(propName)) fail(`invalid Remotion prop name in generatedMediaBindings: ${propName}`);
    if (!assetId) fail(`generatedMediaBindings.${propName} has an empty asset id.`);

    const asset = assetsById.get(assetId);
    if (!asset) fail(`bound asset ${assetId} for prop ${propName} is missing from generated-media manifest.`);
    const kind = String(asset.kind || '').trim().toUpperCase();
    if (!['IMAGE', 'BROLL'].includes(kind)) fail(`bound asset ${assetId} has unsupported kind ${kind || '(empty)'}.`);

    const publicPath = safeRelativePublicPath(asset.publicPath);
    const absolutePath = path.resolve(publicRoot, ...publicPath.split('/'));
    const relativeToPublic = path.relative(publicRoot, absolutePath);
    if (!relativeToPublic || relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
      fail(`bound asset ${assetId} resolves outside public/: ${publicPath}`);
    }
    if (!existsSync(absolutePath)) fail(`bound asset ${assetId} is missing locally: ${absolutePath}`);

    const expectedSha256 = String(asset.sha256 || '').trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(expectedSha256)) fail(`bound asset ${assetId} has invalid sha256.`);
    const actualSha256 = await sha256File(absolutePath);
    if (actualSha256 !== expectedSha256) fail(`bound asset ${assetId} sha256 mismatch. Re-materialize media before rendering.`);

    props[propName] = publicPath;
    resolvedAssets.push({
      propName,
      id: assetId,
      kind,
      publicPath,
      sha256: actualSha256,
    });
  }

  return {
    status: 'BOUND',
    props,
    assets: resolvedAssets,
    manifestPath,
    manifestSha256: await sha256File(manifestPath),
  };
};
