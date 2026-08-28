#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-reel-script-budget.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const scriptPath = path.join(reelDir, '01-script-audio', 'VOICEOVER-ZUM-KOPIEREN.txt');
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const fail = (message) => { console.error(`SCRIPT BUDGET GATE FAILED: ${message}`); process.exit(1); };

if (!existsSync(scriptPath)) fail(`missing script: ${scriptPath}`);
if (!existsSync(reelPath)) fail(`missing reel.json: ${reelPath}`);

const script = (await readFile(scriptPath, 'utf8')).trim();
let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

const words = script.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu) || [];
const wordCount = words.length;
const targetMin = Number(reel?.scriptBudget?.targetMinWords ?? 55);
const targetMax = Number(reel?.scriptBudget?.targetMaxWords ?? 75);
const hardMax = Number(reel?.scriptBudget?.hardMaxWords ?? 80);
const allowLonger = reel?.scriptBudget?.allowLonger === true;
const reason = String(reel?.scriptBudget?.longerReason || '').trim();

if (![targetMin, targetMax, hardMax].every(Number.isFinite)) fail('scriptBudget values must be numeric.');
if (!(targetMin > 0 && targetMax >= targetMin && hardMax >= targetMax)) fail('scriptBudget limits are inconsistent.');
if (wordCount === 0) fail('VOICEOVER-ZUM-KOPIEREN.txt contains no spoken words.');

if (wordCount > hardMax && !(allowLonger && reason.length >= 12)) {
  fail(`${wordCount} words exceeds hardMaxWords=${hardMax}. Shorten Phase 1 or set scriptBudget.allowLonger=true with a concrete longerReason.`);
}

const estimatedSecondsAt120Wpm = (wordCount / 120) * 60;
console.log('SCRIPT BUDGET GATE PASSED');
console.log(`words: ${wordCount}`);
console.log(`target: ${targetMin}-${targetMax} words`);
console.log(`hard max: ${hardMax} words`);
console.log(`rough 120 wpm estimate: ${estimatedSecondsAt120Wpm.toFixed(1)} s`);
if (wordCount < targetMin) console.log('note: below target range; concise is allowed if the story still lands.');
if (wordCount > targetMax) console.log(`note: above preferred range${allowLonger ? `; approved reason: ${reason}` : '; still within hard max.'}`);
