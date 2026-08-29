#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import process from 'node:process';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
let input = {};
try { input = raw.trim() ? JSON.parse(raw) : {}; } catch {}

if (Number(input?.invocationNum ?? 0) !== 0) {
  process.stdout.write('{"injectSteps":[]}\n');
  process.exit(0);
}

const branchResult = spawnSync('git', ['branch', '--show-current'], {encoding: 'utf8'});
const branch = String(branchResult.stdout || '').trim() || 'unknown';
const message = [
  `KI-channel session guard. Current branch: ${branch}.`,
  'Read REPO-STATE.md and GEMINI.md before production changes.',
  'Run npm run antigravity:capabilities and use every relevant Agent/Skill/Workflow/MCP, not every irrelevant one.',
  'For a long production session prefer /bootstrap-ki-channel first.',
  'Production voiceover is Phase 2 user-only input: never synthesize, remotely fetch or replace voiceover.mp3/wav.',
  'Parallelize independent read-only research/verification through custom subagents; never let multiple write agents edit the same working tree concurrently.',
  'Never claim tests, render, visual review or release PASS unless actually executed with evidence.'
].join(' ');

process.stdout.write(`${JSON.stringify({injectSteps: [{ephemeralMessage: message}]})}\n`);
