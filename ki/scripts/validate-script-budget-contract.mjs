#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const fail = (message) => {
  console.error(`SCRIPT BUDGET CONTRACT FAILED: ${message}`);
  process.exit(1);
};

const validatorPath = path.resolve('ki/scripts/validate-reel-script-budget.mjs');
const preparePath = path.resolve('ki/scripts/prepare-reel-render.mjs');
const reelAgentsPath = path.resolve('ki/reels/AGENTS.md');
const sourceAgentsPath = path.resolve('ki/src/reels/AGENTS.md');
const reelBrainPath = path.resolve('ki/gehirn/REELS.md');
const productionFlowPath = path.resolve('ki/gehirn/PRODUKTIONSABLAUF.md');

for (const file of [validatorPath, preparePath, reelAgentsPath, sourceAgentsPath, reelBrainPath, productionFlowPath]) {
  if (!existsSync(file)) fail(`required file missing: ${path.relative(process.cwd(), file)}`);
}

const [validator, prepare, reelAgents, sourceAgents, reelBrain, productionFlow] = await Promise.all([
  readFile(validatorPath, 'utf8'),
  readFile(preparePath, 'utf8'),
  readFile(reelAgentsPath, 'utf8'),
  readFile(sourceAgentsPath, 'utf8'),
  readFile(reelBrainPath, 'utf8'),
  readFile(productionFlowPath, 'utf8'),
]);

const requiredValidatorTokens = [
  'targetMinWords ?? 55',
  'targetMaxWords ?? 75',
  'hardMaxWords ?? 80',
  'allowLonger',
  'longerReason',
  'SCRIPT BUDGET GATE FAILED',
];
for (const token of requiredValidatorTokens) {
  if (!validator.includes(token)) fail(`validator contract token missing: ${token}`);
}

if (!prepare.includes("run('script budget gate'")) fail('prepare-reel-render.mjs does not execute the script budget gate.');
if (!prepare.includes('validate-reel-script-budget.mjs')) fail('prepare-reel-render.mjs is not wired to validate-reel-script-budget.mjs.');

for (const [label, text] of [
  ['ki/reels/AGENTS.md', reelAgents],
  ['ki/src/reels/AGENTS.md', sourceAgents],
  ['ki/gehirn/REELS.md', reelBrain],
  ['ki/gehirn/PRODUKTIONSABLAUF.md', productionFlow],
]) {
  for (const token of ['55', '75', '80', 'validate-reel-script-budget.mjs']) {
    if (!text.includes(token)) fail(`${label} is missing script-budget contract token: ${token}`);
  }
}

console.log('SCRIPT BUDGET CONTRACT PASSED');
console.log('preferred range: 55-75 words');
console.log('hard max: 80 words unless documented exception');
console.log('pre-render wiring: verified');
console.log('global agent/brain documentation: verified');
