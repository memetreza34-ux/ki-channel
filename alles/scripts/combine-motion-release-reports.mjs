import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {combineMotionReleaseReports} from './motion-release-summary.mjs';

const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const individualPath = resolve(OUTPUT_DIR, 'release-report.json');
const timelinePath = resolve(OUTPUT_DIR, 'timeline-release-report.json');
const combinedPath = resolve(OUTPUT_DIR, 'combined-release-report.json');

const readJson = async (path, name) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${name} konnte nicht gelesen werden: ${message}`);
  }
};

const individual = await readJson(individualPath, 'release-report.json');
const timeline = await readJson(timelinePath, 'timeline-release-report.json');
const combined = combineMotionReleaseReports({individual, timeline});

await mkdir(OUTPUT_DIR, {recursive: true});
await writeFile(combinedPath, `${JSON.stringify(combined, null, 2)}\n`, 'utf8');

console.log(
  `Motion-Gesamtfreigabe: ${combined.summary.validFiles}/${combined.summary.expectedFiles} Dateien gültig.`,
);
console.log(`Bericht: ${combinedPath}`);

if (!combined.summary.passed) {
  process.exit(1);
}
