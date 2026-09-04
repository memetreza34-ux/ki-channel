#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/validate-local-forced-alignment.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
const mapPathDefault = path.join(reelDir,'01-script-audio','SCENE-VOICE-MAP.json');
const wordsPath = path.join(reelDir,'01-script-audio','WORD-TIMINGS.json');
const captionsPath = path.join(reelDir,'03-caption','subtitle-cues.json');
const voicePath = path.join(reelDir,'01-script-audio','VOICEOVER-ZUM-KOPIEREN.txt');
for (const file of [reelPath,wordsPath,captionsPath,voicePath]) {
  if (!existsSync(file)) {
    console.error(`❌ missing required forced-alignment file: ${file}`);
    process.exit(1);
  }
}

const reel = JSON.parse(await readFile(reelPath,'utf8'));
const mapPath = path.resolve(reelDir,reel?.sceneVoiceMap?.file || path.relative(reelDir,mapPathDefault));
if (!existsSync(mapPath)) {
  console.error(`❌ scene voice map missing: ${mapPath}`);
  process.exit(1);
}
const sceneMap = JSON.parse(await readFile(mapPath,'utf8'));
const timings = JSON.parse(await readFile(wordsPath,'utf8'));
const captions = JSON.parse(await readFile(captionsPath,'utf8'));
const canonical = await readFile(voicePath,'utf8');
const issues = [];
const normalizeSpace = (v) => String(v ?? '').replace(/\s+/g,' ').trim();

const allowed = {
  'mlx-qwen3': {model:'mlx-community/Qwen3-ForcedAligner-0.6B-8bit',license:'Apache-2.0'},
  'ctc-german': {model:'facebook/wav2vec2-large-xlsr-53-german',license:'Apache-2.0'},
};
if (timings.status !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') issues.push('WORD-TIMINGS status is not LOCAL_FORCED_ALIGNMENT_ACCEPTED');
if (timings.alignmentType !== 'KNOWN_TRANSCRIPT_FORCED_ALIGNMENT') issues.push('alignmentType is not KNOWN_TRANSCRIPT_FORCED_ALIGNMENT');
const expectedBackend = allowed[timings.backend];
if (!expectedBackend) issues.push(`unsupported alignment backend: ${timings.backend ?? 'missing'}`);
else {
  if (timings.model !== expectedBackend.model) issues.push(`unexpected model for ${timings.backend}: ${timings.model}`);
  if (timings.modelLicense !== expectedBackend.license) issues.push(`model license is not ${expectedBackend.license}`);
}
if (timings?.rules?.fuzzyWordMatching !== false) issues.push('fuzzyWordMatching must be false');
if (timings?.rules?.canonicalTextAuthority !== 'VOICEOVER-ZUM-KOPIEREN.txt') issues.push('canonical text authority is wrong');
if (timings?.rules?.sceneAuthority !== 'SCENE-VOICE-MAP.json') issues.push('scene authority is wrong');

const sentences = Array.isArray(sceneMap?.sentences) ? sceneMap.sentences : [];
const expectedWords = [];
for (const sentence of sentences) {
  for (const word of normalizeSpace(sentence.text).split(' ').filter(Boolean)) expectedWords.push({text:word,sceneId:sentence.sceneId,sentenceId:sentence.id});
}
if (normalizeSpace(sentences.map((s)=>s.text).join(' ')) !== normalizeSpace(canonical)) issues.push('SCENE-VOICE-MAP does not reconstruct canonical voiceover');

const words = Array.isArray(timings?.words) ? timings.words : [];
if (!words.length) issues.push('WORD-TIMINGS contains no words');
if (words.length !== expectedWords.length) issues.push(`WORD-TIMINGS word count ${words.length} != canonical ${expectedWords.length}`);
for (let i=0;i<Math.min(words.length,expectedWords.length);i++) {
  const word = words[i];
  const expected = expectedWords[i];
  if (word.text !== expected.text) issues.push(`word ${i+1} text mismatch`);
  if (word.sceneId !== expected.sceneId) issues.push(`word ${i+1} sceneId mismatch`);
  if (word.sentenceId !== expected.sentenceId) issues.push(`word ${i+1} sentenceId mismatch`);
  if (!Number.isFinite(word.startFrame) || !Number.isFinite(word.endFrame) || word.endFrame <= word.startFrame) issues.push(`word ${i+1} frame timing invalid`);
  if (!Number.isFinite(word.startSeconds) || !Number.isFinite(word.endSeconds) || word.endSeconds <= word.startSeconds) issues.push(`word ${i+1} second timing invalid`);
  if (i>0 && word.startFrame < words[i-1].startFrame) issues.push(`word ${i+1} starts before previous word`);
}

const captionWords = [];
for (const cue of Array.isArray(captions?.cues) ? captions.cues : []) {
  for (const word of Array.isArray(cue.words) ? cue.words : []) captionWords.push({text:word.text,startFrame:word.startFrame,endFrame:word.endFrame,sceneId:cue.sceneId,sentenceId:cue.sentenceId});
}
if (captionWords.length !== words.length) issues.push(`caption word count ${captionWords.length} != WORD-TIMINGS ${words.length}`);
for (let i=0;i<Math.min(captionWords.length,words.length);i++) {
  const a = captionWords[i];
  const b = words[i];
  if (a.text !== b.text || a.startFrame !== b.startFrame || a.endFrame !== b.endFrame || a.sceneId !== b.sceneId) issues.push(`caption word ${i+1} is not byte-logically identical to WORD-TIMINGS timing`);
  if (a.sentenceId && a.sentenceId !== b.sentenceId) issues.push(`caption word ${i+1} sentenceId mismatch`);
}

if (!String(captions?.timingStatus ?? '').startsWith('VOICE_LOCKED')) issues.push('captions are not VOICE_LOCKED after forced alignment');
if (reel?.sceneVoiceMap?.status !== 'VOICE_LOCKED') issues.push('reel.sceneVoiceMap.status is not VOICE_LOCKED');

if (issues.length) {
  console.error('LOCAL FORCED ALIGNMENT GATE: FAILED');
  for (const issue of issues) console.error(`❌ ${issue}`);
  process.exit(1);
}

console.log('LOCAL FORCED ALIGNMENT GATE: PASSED');
console.log(`backend: ${timings.backend}`);
console.log(`model: ${timings.model} (${timings.modelLicense})`);
console.log(`words: ${words.length}`);
console.log('fuzzy matching: disabled');
