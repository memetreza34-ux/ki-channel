import {createHash} from 'node:crypto';
import {readdir, readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';

export const MASTERPLAN_CONTENT_OUTPUT_ROOT = resolve(
  'out/masterplan-content-release',
);

export const readMasterplanJson = async (path) =>
  JSON.parse(await readFile(resolve(path), 'utf8'));

export const getMasterplanContentSourceFingerprint = async () => {
  const hash = createHash('sha256');
  const fixedFiles = [
    'ki/src/animation-library/prototypeRuntimeContentDeriver.ts',
    'ki/src/animation-library/prototypeRuntimeContentSanitizer.ts',
    'ki/src/animation-library/prototypeRuntimeContentAssociation.ts',
    'ki/src/animation-library/prototypeRenderPayload.ts',
    'ki/src/animation-library/prototypes/PrototypeContentContext.tsx',
    'ki/src/animation-library/prototypes/PrototypeMeasurementGrounding.ts',
    'ki/src/animation-library/channelReelMasterPlan.ts',
    'ki/src/animation-library/productionEligibility.ts',
    'ki/src/animation-library/executableAnimationManifest.ts',
    'ki/src/animation-library/prototype-render-config.json',
    'ki/src/animation-library/content-render-fixtures.json',
    'scripts/render-content-matched-prototype.mjs',
    'scripts/load-prototype-runtime-content-deriver.mjs',
    'scripts/load-prototype-runtime-content-sanitizer.mjs',
    'scripts/load-prototype-runtime-content-association.mjs',
    'scripts/load-prototype-render-payload.mjs',
    'scripts/render-masterplan-content-release.mjs',
    'scripts/verify-masterplan-content-release.mjs',
    'scripts/masterplan-content-release-utils.mjs',
  ];
  const prototypeDir = resolve('ki/src/animation-library/prototypes');
  const prototypeFiles = (await readdir(prototypeDir))
    .filter((fileName) => fileName.endsWith('.tsx'))
    .sort()
    .map((fileName) => `ki/src/animation-library/prototypes/${fileName}`);

  for (const file of [...fixedFiles, ...prototypeFiles]) {
    hash.update(file);
    hash.update('\0');
    hash.update(await readFile(resolve(file)));
    hash.update('\0');
  }
  return hash.digest('hex');
};

export const getMasterplanFixtureContent = (fixture) =>
  fixture?.content ?? fixture?.props?.content ?? null;

export const assertMasterplanPng = async (path) => {
  const absolute = resolve(path);
  const info = await stat(absolute);
  if (!info.isFile() || info.size < 16) {
    throw new Error(`PNG fehlt oder ist zu klein: ${path}`);
  }
  const buffer = await readFile(absolute);
  if (buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`Ungültige PNG-Signatur: ${path}`);
  }
};

export const assertMasterplanMp4 = async (path) => {
  const absolute = resolve(path);
  const info = await stat(absolute);
  if (!info.isFile() || info.size < 32) {
    throw new Error(`MP4 fehlt oder ist zu klein: ${path}`);
  }
  const buffer = await readFile(absolute);
  if (buffer.subarray(4, 8).toString('ascii') !== 'ftyp') {
    throw new Error(`Ungültiger MP4-Header: ${path}`);
  }
};
