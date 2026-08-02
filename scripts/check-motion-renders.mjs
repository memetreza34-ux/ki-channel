import {access, mkdir, open, stat, writeFile} from 'node:fs/promises';
import {extname, resolve} from 'node:path';

const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'all';
const VALID_MODES = new Set(['stills', 'videos', 'all']);
const VISUAL_TYPES = [
  'input-output',
  'tool-orchestration',
  'comparison',
  'before-after',
  'data-flow',
  'error-path',
  'context-window',
  'agent-loop',
  'ranking',
  'process-chain',
];
const CHECKPOINTS = [0, 37, 75, 112, 149];
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Prüfmodus: ${MODE}. Erlaubt: stills, videos, all.`);
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

const report = {
  generatedAt: new Date().toISOString(),
  mode: MODE,
  outputDir: OUTPUT_DIR,
  visualTypes: [],
  summary: {
    expectedFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    passed: false,
  },
};

for (const visualType of VISUAL_TYPES) {
  const expectedPaths = [];

  if (MODE === 'stills' || MODE === 'all') {
    expectedPaths.push(
      ...CHECKPOINTS.map(
        (frame) => `${OUTPUT_DIR}/${visualType}/frame-${frame}.png`,
      ),
    );
  }

  if (MODE === 'videos' || MODE === 'all') {
    expectedPaths.push(`${OUTPUT_DIR}/${visualType}/final.mp4`);
  }

  const files = [];
  for (const expectedPath of expectedPaths) {
    files.push(await inspectFile(expectedPath));
  }

  report.visualTypes.push({
    visualType,
    passed: files.every((file) => file.valid),
    files,
  });
}

const allFiles = report.visualTypes.flatMap((entry) => entry.files);
report.summary.expectedFiles = allFiles.length;
report.summary.validFiles = allFiles.filter((file) => file.valid).length;
report.summary.invalidFiles = allFiles.length - report.summary.validFiles;
report.summary.passed = report.summary.invalidFiles === 0;

await mkdir(OUTPUT_DIR, {recursive: true});
const reportPath = resolve(OUTPUT_DIR, 'release-report.json');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(
  `Motion-Renderprüfung: ${report.summary.validFiles}/${report.summary.expectedFiles} Dateien gültig.`,
);
console.log(`Bericht: ${reportPath}`);

if (!report.summary.passed) {
  for (const visualType of report.visualTypes) {
    for (const file of visualType.files.filter((entry) => !entry.valid)) {
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
