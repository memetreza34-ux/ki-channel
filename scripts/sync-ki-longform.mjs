#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import {requirePackage, run, posix} from './lib/longform-sync.mjs';

const fail = (message) => { console.error(`LONGFORM SYNC FAILED: ${message}`); process.exit(1); };
let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { fail(error.message); }
const backendArg = process.argv.find((arg) => arg.startsWith('--backend='));
const node = (label, script, args = []) => {
  try { run(label, process.execPath, [path.resolve(script), ...args], {stdio: 'inherit'}); }
  catch (error) { fail(error.message); }
};

console.log('\n[1/5] Primary known-transcript forced alignment');
node('primary longform alignment', 'scripts/align-longform-local.mjs', [root, ...(backendArg ? [backendArg] : [])]);

console.log('\n[2/5] Independent CTC alignment consensus');
node('longform alignment consensus', 'scripts/verify-longform-alignment-consensus.mjs', [root]);

console.log('\n[3/5] Resolve exact speech → ENTER/HOLD/EXIT choreography');
node('longform choreography compile', 'scripts/compile-longform-choreography.mjs', [root]);

console.log('\n[4/5] Write human-readable timing audit');
node('longform timeline audit', 'scripts/write-longform-timeline-audit.mjs', [root]);

console.log('\n[5/5] Hard choreography validation');
node('longform choreography validation', 'scripts/validate-longform-choreography.mjs', [root]);

console.log('\nLONGFORM EXPLICIT SYNC COMPLETE');
console.log(`package: ${posix(root)}`);
console.log('authority: 06-projektdateien/CHOREOGRAPHY-RESOLVED.json');
console.log('audit: 06-projektdateien/TIMELINE-AUDIT.md');
console.log('Next: Remotion source must consume createLongformChoreographyTiming() + the resolved authority; canonical render gate verifies both.');
