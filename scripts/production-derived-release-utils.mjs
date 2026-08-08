import {createHash} from 'node:crypto';
import {readdir, readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';

export const PRODUCTION_DERIVED_OUTPUT_ROOT = resolve(
  'out/production-derived-content',
);

export const readJson = async (path) =>
  JSON.parse(await readFile(resolve(path), 'utf8'));

export const getProductionDerivedSourceFingerprint = async () => {
  const hash = createHash('sha256');
  const fixedFiles = [
    'ki/src/animation-library/prototypeRuntimeContentDeriver.ts',
    'ki/src/animation-library/channelReelMasterPlan.ts',
    'ki/src/animation-library/productionEligibility.ts',
    'ki/src/animation-library/prototype-render-config.json',
    'ki/src/animation-library/content-render-fixtures.json',
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

export const getFixtureContent = (fixture) =>
  fixture?.content ?? fixture?.props?.content ?? null;

export const assertFileExistsAndNonEmpty = async (path, minimumBytes = 1) => {
  const info = await stat(resolve(path));
  if (!info.isFile() || info.size < minimumBytes) {
    throw new Error(`Artefakt fehlt oder ist zu klein: ${path}`);
  }
  return info.size;
};

export const assertPng = async (path) => {
  await assertFileExistsAndNonEmpty(path, 16);
  const buffer = await readFile(resolve(path));
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`Ungültige PNG-Signatur: ${path}`);
  }
};

export const assertMp4 = async (path) => {
  await assertFileExistsAndNonEmpty(path, 32);
  const buffer = await readFile(resolve(path));
  if (buffer.subarray(4, 8).toString('ascii') !== 'ftyp') {
    throw new Error(`Ungültiger MP4-Header: ${path}`);
  }
};
