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
  'targetMinWords ?? 150',
  'targetMaxWords ?? 175',
  'hardMaxWords ?? 190',
  'referenceWpm ?? 140',
  'targetMinSeconds ?? 60',
  'targetMaxSeconds ?? 75',
  'allowLonger',
  'longerReason',
  'SCRIPT BUDGET GATE FAILED',
];
for (const token of requiredValidatorTokens) {
  if (!validator.includes(token)) fail(`validator contract token missing: ${token}`);
}

if (!prepare.includes("run('script budget gate'")) fail('prepare-reel-render.mjs does not execute the script budget gate.');
if (!prepare.includes('validate-reel-script-budget.mjs')) fail('prepare-reel-render.mjs is not wired to validate-reel-script-budget.mjs.');
if (!prepare.includes('targetMinSeconds')) fail('prepare-reel-render.mjs does not validate minimum final reel duration.');
if (!prepare.includes('targetMaxSeconds')) fail('prepare-reel-render.mjs does not validate maximum final reel duration.');

for (const [label, text] of [
  ['ki/reels/AGENTS.md', reelAgents],
  ['ki/src/reels/AGENTS.md', sourceAgents],
  ['ki/gehirn/REELS.md', reelBrain],
  ['ki/gehirn/PRODUKTIONSABLAUF.md', productionFlow],
]) {
  for (const token of ['60', '75', '150', '175', '190', 'validate-reel-script-budget.mjs']) {
    if (!text.includes(token)) fail(`${label} is missing script-budget contract token: ${token}`);
  }
}

console.log('SCRIPT BUDGET CONTRACT PASSED');
console.log('target duration: 60-75 seconds');
console.log('preferred range: 150-175 words');
console.log('hard max: 190 words unless documented exception');
console.log('pre-render duration wiring: verified');
console.log('global agent/brain documentation: verified');
