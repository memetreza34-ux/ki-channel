import {access, mkdir, open, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';
import {
  DEFAULT_CHECKPOINTS,
  TIMELINE_TARGET,
  VISUAL_TYPES,
} from './motion-render-config.mjs';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from './motion-artifact-validation.mjs';

const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'all';
const VALID_MODES = new Set(['stills', 'videos', 'all', 'timeline']);

if (!VALID_MODES.has(MODE)) {
  console.error(
    `Unbekannter Prüfmodus: ${MODE}. Erlaubt: stills, videos, all, timeline.`,
  );
  process.exit(1);
}

const readHeader = async (absolutePath) => {
  const fileHandle = await open(absolutePath, 'r');

  try {
    const header = Buffer.alloc(32);
    const {bytesRead} = await fileHandle.read(header, 0, header.length, 0);
    return header.subarray(0, bytesRead);
  } finally {
    await fileHandle.close();
  }
};

const inspectFile = async (relativePath) => {
  const absolutePath = resolve(relativePath);

  try {
    await access(absolutePath);
    const fileStat = await stat(absolutePath);
    const isFile = fileStat.isFile();
    const header = isFile ? await readHeader(absolutePath) : Buffer.alloc(0);
    const inspection = inspectMotionArtifactBuffer({
      extension: extname(absolutePath),
      sizeBytes: isFile ? fileStat.size : 0,
      header,
    });

    return {
      path: relativePath,
      exists: true,
      isFile,
      sizeBytes: fileStat.size,
      ...inspection,
      valid: isFile && inspection.valid,
    };
  } catch {
    return {
      path: relativePath,
      exists: false,
      isFile: false,
      sizeBytes: 0,
      mediaType: 'unknown',
      signatureValid: false,
      dimensionsValid: null,
      minimumSizeValid: false,
      width: null,
      height: null,
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
        : !file.isFile
          ? 'ist keine reguläre Datei'
          : describeMotionArtifactFailure(file);
      console.error(`${file.path} ${reason}.`);
    }
  }
  process.exit(1);
}
