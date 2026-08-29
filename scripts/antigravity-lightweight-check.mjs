#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const log = (message) => process.stderr.write(`[antigravity-check] ${message}\n`);

const run = (command, args) => {
  const result = spawnSync(command, args, {cwd: root, encoding: 'utf8'});
  if (result.error) {
    log(`skipped ${command}: ${result.error.message}`);
    return {status: 0, skipped: true};
  }
  if (result.status !== 0) {
    if (result.stdout) process.stderr.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  return result;
};

const git = run('git', ['diff', '--name-only', 'HEAD']);
const changed = git.skipped ? [] : String(git.stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const jsonFiles = changed.filter((file) => file.startsWith('.agents/') && file.endsWith('.json'));
for (const relative of jsonFiles) {
  const absolute = path.resolve(root, relative);
  if (!existsSync(absolute)) continue;
  try {
    JSON.parse(readFileSync(absolute, 'utf8'));
  } catch (error) {
    log(`invalid JSON: ${relative}: ${error.message}`);
    process.exit(1);
  }
}

if (changed.some((file) => file.startsWith('ki/reels/'))) {
  run(process.execPath, ['scripts/check-ki-reel-folder-structure.mjs']);
  log('reel structure check passed after reel-package edit');
}

if (changed.some((file) => file.startsWith('.agents/') || file === 'GEMINI.md')) {
  run(process.execPath, ['scripts/check-antigravity-integration.mjs']);
  log('Antigravity integration check passed after customization edit');
}

process.stdout.write('{}\n');
