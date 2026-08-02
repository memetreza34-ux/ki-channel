import {access, mkdir, open, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  DEFAULT_CHECKPOINTS,
  TIMELINE_TARGET,
  VISUAL_TYPES,
} from './motion-render-config.mjs';

const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'all';
const VALID_MODES = new Set(['stills', 'videos', 'all', 'timeline']);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!VALID_MODES.has(MODE)) {
  console.error(
    `Unbekannter Prüfmodus: ${MODE}. Erlaubt: stills, videos, all, timeline.`,
  );
  process.exit(1);
}

const inspectSignature = async (absolutePath) => {
  const extension = extname(absolutePath).toLowerCase();
  const fileHandle = await open(absolutePath, 'r');

  try {
    const header = Buffer.alloc(12);
    const {bytesRead} = await fileHandle.read(header, 0, header.length, 0);

    if (extension === '.png') {
      return bytesRead >= PNG_SIGNATURE.length &&
        header.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
    }

    if (extension === '.mp4') {
      return bytesRead >= 8 && header.subarray(4, 8).toString('ascii') === 'ftyp';
    }

    return false;
  } finally {
    await fileHandle.close();
  }
};

const inspectFile = async (relativePath) => {
  const absolutePath = resolve(relativePath);

  try {
    await access(absolutePath);
    const fileStat = await stat(absolutePath);
    const isNonEmptyFile = fileStat.isFile() && fileStat.size > 0;
    const signatureValid = isNonEmptyFile
      ? await inspectSignature(absolutePath)
      : false;

    return {
      path: relativePath,
      exists: true,
      sizeBytes: fileStat.size,
      signatureValid,
      valid: isNonEmptyFile && signatureValid,
    };
  } catch {
    return {
      path: relativePath,
      exists: false,
      sizeBytes: 0,
      signatureValid: false,
      valid: false,
    };
  }
};

const targets = MODE === 'timeline'
  ? [
      {
        targetKey: TIMELINE_TARGET.targetKey,
        checkpoints: TIMELINE_TARGET.checkpoints,
        includeStills: true,
        includeVideo: true,
      },
    ]
  : VISUAL_TYPES.map((visualType) => ({
      targetKey: visualType,
      checkpoints: DEFAULT_CHECKPOINTS,
      includeStills: MODE === 'stills' || MODE === 'all',
      includeVideo: MODE === 'videos' || MODE === 'all',
    }));

const report = {
  generatedAt: new Date().toISOString(),
  mode: MODE,
  outputDir: OUTPUT_DIR,
  targets: [],
  summary: {
    expectedFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    passed: false,
  },
};

for (const target of targets) {
  const expectedPaths = [];

  if (target.includeStills) {
    expectedPaths.push(
      ...target.checkpoints.map(
        (frame) => `${OUTPUT_DIR}/${target.targetKey}/frame-${frame}.png`,
      ),
    );
  }

  if (target.includeVideo) {
    expectedPaths.push(`${OUTPUT_DIR}/${target.targetKey}/final.mp4`);
  }

  const files = [];
  for (const expectedPath of expectedPaths) {
    files.push(await inspectFile(expectedPath));
  }

  report.targets.push({
    targetKey: target.targetKey,
    passed: files.every((file) => file.valid),
    files,
  });
}

const allFiles = report.targets.flatMap((entry) => entry.files);
report.summary.expectedFiles = allFiles.length;
report.summary.validFiles = allFiles.filter((file) => file.valid).length;
report.summary.invalidFiles = allFiles.length - report.summary.validFiles;
report.summary.passed = report.summary.invalidFiles === 0;

await mkdir(OUTPUT_DIR, {recursive: true});
const reportFileName = MODE === 'timeline'
  ? 'timeline-release-report.json'
  : 'release-report.json';
const reportPath = resolve(OUTPUT_DIR, reportFileName);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(
  `Motion-Renderprüfung: ${report.summary.validFiles}/${report.summary.expectedFiles} Dateien gültig.`,
);
console.log(`Bericht: ${reportPath}`);

if (!report.summary.passed) {
  for (const target of report.targets) {
    for (const file of target.files.filter((entry) => !entry.valid)) {
      const reason = !file.exists
        ? 'fehlt'
        : file.sizeBytes === 0
          ? 'ist leer'
          : 'besitzt keine gültige PNG-/MP4-Signatur';
      console.error(`${file.path} ${reason}.`);
    }
  }
  process.exit(1);
}
