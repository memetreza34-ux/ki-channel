#!/usr/bin/env node
import process from 'node:process';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
let input = {};
try { input = raw.trim() ? JSON.parse(raw) : {}; } catch {}

if (input?.fullyIdle === false) {
  process.stdout.write(`${JSON.stringify({
    decision: 'continue',
    reason: 'Background commands or subagents are still active. Check /tasks and /agents, collect their results, then finish the production step before stopping.'
  })}\n`);
  process.exit(0);
}

process.stdout.write('{"decision":"allow"}\n');
