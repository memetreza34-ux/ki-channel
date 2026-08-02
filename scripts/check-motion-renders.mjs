import {access, mkdir, stat, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

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

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Prüfmodus: ${MODE}. Erlaubt: stills, videos, all.`);
  process.exit(1);
}

const inspectFile = async (relativePath) => {
  const absolutePath = resolve(relativePath);

  try {
    await access(absolutePath);
    const fileStat = await stat(absolutePath);
    return {
      path: relativePath,
      exists: true,
      sizeBytes: fileStat.size,
      valid: fileStat.isFile() && fileStat.size > 0,
    };
  } catch {
    return {
      path: relativePath,
      exists: false,
      sizeBytes: 0,
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
    missingOrEmptyFiles: 0,
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
report.summary.missingOrEmptyFiles = allFiles.length - report.summary.validFiles;
report.summary.passed = report.summary.missingOrEmptyFiles === 0;

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
      console.error(`Fehlt oder leer: ${file.path}`);
    }
  }
  process.exit(1);
}
