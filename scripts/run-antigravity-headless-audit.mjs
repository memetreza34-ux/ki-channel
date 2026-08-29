#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const targetArg = positional[0];
const option = (name, fallback) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

if (!targetArg) {
  console.error('Usage: node scripts/run-antigravity-headless-audit.mjs <reel-package-dir> [--mode=release|facts|motion|dependencies] [--timeout=15m]');
  process.exit(1);
}

const mode = option('mode', 'release');
const timeout = option('timeout', '15m');
const configs = {
  release: {
    agent: 'ki-release-verifier',
    instruction: 'Perform an independent fail-closed release-readiness audit. Run only checks that your agent contract allows. Do not edit production files. Distinguish real PASS evidence from NOT_RUN/BLOCKED.',
  },
  facts: {
    agent: 'ki-fact-researcher',
    instruction: 'Audit the target reel factual claims, dates, numbers and proof-source candidates using current primary sources. Do not edit files. A factual audit can PASS even when production/render gates are not relevant.',
  },
  motion: {
    agent: 'ki-motion-researcher',
    instruction: 'Audit the target reel story beats and current Remotion source for narrative/motion opportunities and technical fit. Do not edit files. Report source-based findings honestly; do not claim rendered visual PASS.',
  },
  dependencies: {
    agent: 'ki-dependency-auditor',
    instruction: 'Audit dependency/API compatibility relevant to this target and current repository pins. Do not edit package files or lockfiles. Use current official docs when needed.',
  },
};
if (!configs[mode]) {
  console.error(`Unknown --mode=${mode}. Expected ${Object.keys(configs).join(', ')}.`);
  process.exit(1);
}

const root = process.cwd();
const target = path.resolve(root, targetArg);
if (!existsSync(target)) {
  console.error(`Target does not exist: ${target}`);
  process.exit(1);
}
const schemaPath = path.resolve(root, 'scripts/antigravity-audit.schema.json');
if (!existsSync(schemaPath)) {
  console.error(`Audit schema missing: ${schemaPath}`);
  process.exit(1);
}

const config = configs[mode];
const relativeTarget = path.relative(root, target) || '.';
const prompt = [
  `Mode: ${mode}.`,
  `Target reel package: ${relativeTarget}.`,
  config.instruction,
  'Read REPO-STATE.md and GEMINI.md first.',
  'Use the target reel contracts and source as repository authority.',
  'Return only the requested structured schema.',
  'For every PASS provide concrete command/source evidence. If a command or runtime proof was not executed, use NOT_RUN or BLOCKED instead of inferring PASS.',
].join(' ');

const agy = process.platform === 'win32' ? 'agy.cmd' : 'agy';
const commandArgs = [
  '-p', prompt,
  '--output-format', 'json',
  '--json-schema', schemaPath,
  '--agent', config.agent,
  '--sandbox',
  '--print-timeout', timeout,
];

console.log(`ANTIGRAVITY HEADLESS AUDIT: ${mode}`);
console.log(`agent: ${config.agent}`);
console.log(`target: ${relativeTarget}`);
console.log('safety: sandbox enabled; permission bypass disabled');

const result = spawnSync(agy, commandArgs, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
  shell: false,
});

if (result.error) {
  console.error(`Could not start agy CLI: ${result.error.message}`);
  console.error('Authenticate once in interactive Antigravity and ensure `agy` is on PATH.');
  process.exit(1);
}
if (result.stderr) process.stderr.write(result.stderr);

let envelope;
try {
  envelope = JSON.parse(String(result.stdout || '').trim());
} catch (error) {
  console.error(`Antigravity returned non-JSON output: ${error instanceof Error ? error.message : error}`);
  if (result.stdout) console.error(result.stdout);
  process.exit(result.status || 1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const reelId = path.basename(target).replace(/[^a-zA-Z0-9._-]+/g, '-');
const outDir = path.resolve(root, 'out', 'antigravity-audits', reelId);
await mkdir(outDir, {recursive: true});
const rawPath = path.join(outDir, `${stamp}_${mode}_envelope.json`);
const auditPath = path.join(outDir, `${stamp}_${mode}_audit.json`);
await writeFile(rawPath, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');

if (envelope?.status !== 'SUCCESS' || !envelope?.structured_output) {
  console.error(`Antigravity audit did not complete successfully: ${envelope?.status || 'UNKNOWN'}`);
  if (envelope?.error) console.error(envelope.error);
  console.error(`raw envelope: ${path.relative(root, rawPath)}`);
  process.exit(result.status || 1);
}

const structured = envelope.structured_output;
await writeFile(auditPath, `${JSON.stringify(structured, null, 2)}\n`, 'utf8');
console.log(`audit: ${path.relative(root, auditPath)}`);
console.log(`raw envelope: ${path.relative(root, rawPath)}`);
console.log(`overallStatus: ${structured.overallStatus}`);

if (result.status !== 0) process.exit(result.status);
if (structured.overallStatus === 'FAIL') process.exit(2);
