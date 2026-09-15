#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import {requirePackage, run, posix} from './lib/longform-sync.mjs';

const fail = (message) => { console.error(`LONGFORM SYNC READINESS FAILED: ${message}`); process.exit(1); };
let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { fail(error.message); }
const node = (label, script, args = []) => {
  try { run(label, process.execPath, [path.resolve(script), ...args], {stdio: 'inherit'}); }
  catch (error) { fail(error.message); }
};

node('explicit longform choreography gate', 'scripts/validate-longform-choreography.mjs', [root, '--render-source']);
node('existing longform render readiness gate', 'scripts/check-ki-longform-render-readiness.mjs', [root]);
console.log('LONGFORM SYNC + RENDER READINESS: PASSED');
console.log(`package: ${posix(root)}`);
