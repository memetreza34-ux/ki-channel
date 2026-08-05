import {createHash} from 'node:crypto';
import {readdir, readFile} from 'node:fs/promises';
import {relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const REPOSITORY_ROOT = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
);
const MOTION_SOURCE_ROOT = resolve(
  REPOSITORY_ROOT,
  'ki/src/motion-system',
);
const MOTION_SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.json']);
const ROOT_FILES = [
  'package.json',
  'tsconfig.base.json',
  'ki/tsconfig.motion.json',
  'scripts/motion-render-config.mjs',
  'scripts/motion-source-fingerprint.mjs',
  'scripts/motion-artifact-validation.mjs',
  'scripts/motion-release-summary.mjs',
  'scripts/render-motion-system.mjs',
  'scripts/check-motion-renders.mjs',
  'scripts/combine-motion-release-reports.mjs',
];

const extensionOf = (path) => {
  const lastDot = path.lastIndexOf('.');
  return lastDot === -1 ? '' : path.slice(lastDot);
};

const toRepositoryPath = (absolutePath) =>
  relative(REPOSITORY_ROOT, absolutePath).split(sep).join('/');

const collectMotionSourceFiles = async (directory) => {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMotionSourceFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && MOTION_SOURCE_EXTENSIONS.has(extensionOf(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
};

const sourceFiles = [
  ...await collectMotionSourceFiles(MOTION_SOURCE_ROOT),
  ...ROOT_FILES.map((path) => resolve(REPOSITORY_ROOT, path)),
]
  .map(toRepositoryPath)
  .filter((path, index, paths) => paths.indexOf(path) === index)
  .sort((left, right) => left.localeCompare(right));

const hash = createHash('sha256');
for (const repositoryPath of sourceFiles) {
  const content = await readFile(resolve(REPOSITORY_ROOT, repositoryPath));
  hash.update(repositoryPath);
  hash.update('\0');
  hash.update(content);
  hash.update('\0');
}

export const MOTION_SOURCE_FILES = Object.freeze(sourceFiles);
export const MOTION_SOURCE_FINGERPRINT = hash.digest('hex');
