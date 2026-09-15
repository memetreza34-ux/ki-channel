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
const prepareRenderPath = path.resolve('ki/scripts/prepare-reel-render.mjs');
const fail = (message) => { console.error(`SCRIPT BUDGET GATE FAILED: ${message}`); process.exit(1); };

if (!existsSync(scriptPath)) fail(`missing script: ${scriptPath}`);
if (!existsSync(reelPath)) fail(`missing reel.json: ${reelPath}`);
if (!existsSync(prepareRenderPath)) fail(`production render gate missing: ${prepareRenderPath}`);

const script = (await readFile(scriptPath, 'utf8')).trim();
let reel;
try { reel = JSON.parse(await readFile(reelPath, 'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }

// Self-wiring guard: a direct budget validation must also detect if a later refactor
// accidentally removes this gate from the canonical production render preparation.
const prepareRender = await readFile(prepareRenderPath, 'utf8');
if (!prepareRender.includes("run('script budget gate'")) fail('prepare-reel-render.mjs no longer executes the script budget gate.');
if (!prepareRender.includes('validate-reel-script-budget.mjs')) fail('prepare-reel-render.mjs is no longer wired to this validator.');

const words = script.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu) || [];
const wordCount = words.length;
const targetMin = Number(reel?.scriptBudget?.targetMinWords ?? 150);
const targetMax = Number(reel?.scriptBudget?.targetMaxWords ?? 175);
const hardMinRaw = reel?.scriptBudget?.hardMinWords;
const hardMin = hardMinRaw == null ? null : Number(hardMinRaw);
const hardMax = Number(reel?.scriptBudget?.hardMaxWords ?? 190);
const referenceWpm = Number(reel?.scriptBudget?.referenceWpm ?? 140);
const targetMinSeconds = Number(reel?.scriptBudget?.targetMinSeconds ?? 60);
const targetMaxSeconds = Number(reel?.scriptBudget?.targetMaxSeconds ?? 75);
const allowShorter = reel?.scriptBudget?.allowShorter === true;
const shorterReason = String(reel?.scriptBudget?.shorterReason || '').trim();
const allowLonger = reel?.scriptBudget?.allowLonger === true;
const longerReason = String(reel?.scriptBudget?.longerReason || '').trim();

const numeric = [targetMin, targetMax, hardMax, referenceWpm, targetMinSeconds, targetMaxSeconds];
if (hardMin !== null) numeric.push(hardMin);
if (!numeric.every(Number.isFinite)) fail('scriptBudget values must be numeric.');
if (!(targetMin > 0 && targetMax >= targetMin && hardMax >= targetMax)) fail('scriptBudget word limits are inconsistent.');
if (hardMin !== null && !(hardMin > 0 && hardMin <= targetMin)) fail('hardMinWords must be > 0 and <= targetMinWords.');
if (!(referenceWpm > 0 && targetMinSeconds > 0 && targetMaxSeconds >= targetMinSeconds)) fail('scriptBudget duration values are inconsistent.');
if (wordCount === 0) fail('VOICEOVER-ZUM-KOPIEREN.txt contains no spoken words.');

if (hardMin !== null && wordCount < hardMin && !(allowShorter && shorterReason.length >= 12)) {
  fail(`${wordCount} words is below hardMinWords=${hardMin}. Expand Phase 1 or set scriptBudget.allowShorter=true with a concrete shorterReason.`);
}
if (wordCount > hardMax && !(allowLonger && longerReason.length >= 12)) {
  fail(`${wordCount} words exceeds hardMaxWords=${hardMax}. Shorten Phase 1 or set scriptBudget.allowLonger=true with a concrete longerReason.`);
}

const estimatedSeconds = (wordCount / referenceWpm) * 60;
console.log('SCRIPT BUDGET GATE PASSED');
console.log(`words: ${wordCount}`);
console.log(`preferred words: ${targetMin}-${targetMax}`);
if (hardMin !== null) console.log(`hard min: ${hardMin} words`);
console.log(`hard max: ${hardMax} words`);
console.log(`target duration: ${targetMinSeconds}-${targetMaxSeconds} s`);
console.log(`rough estimate at ${referenceWpm} wpm: ${estimatedSeconds.toFixed(1)} s`);
console.log('production pre-render wiring: verified');
if (wordCount < targetMin) console.log(`note: below preferred word range${allowShorter ? `; approved reason: ${shorterReason}` : '; final audio must still land inside the duration target when configured.'}`);
if (wordCount > targetMax) console.log(`note: above preferred word range${allowLonger ? `; approved reason: ${longerReason}` : '; still within hard max.'}`);
if (estimatedSeconds < targetMinSeconds || estimatedSeconds > targetMaxSeconds) console.log('note: word-based duration is only an estimate; the production gate validates the actual voice-locked duration when target seconds are configured.');
