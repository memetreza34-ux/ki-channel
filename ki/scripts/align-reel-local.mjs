#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {runtimeAudioPath, safeCompositionId} from './lib/render-provenance.mjs';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/align-reel-local.mjs <reel-package-dir> [--backend=auto|mlx-qwen3|ctc-german]');
  process.exit(1);
}
const requestedBackend = process.argv.find((arg) => arg.startsWith('--backend='))?.split('=')[1] || 'auto';
const reelDir = path.resolve(rawReelDir);
const fail = (message) => { console.error(`LOCAL REEL ALIGNMENT FAILED: ${message}`); process.exit(1); };

const reelPath = path.join(reelDir,'06-projektdateien','reel.json');
const scriptPath = path.join(reelDir,'01-script-audio','VOICEOVER-ZUM-KOPIEREN.txt');
const captionsPath = path.join(reelDir,'03-caption','subtitle-cues.json');
for (const file of [reelPath,scriptPath,captionsPath]) if (!existsSync(file)) fail(`missing required file: ${file}`);

let reel;
try { reel = JSON.parse(await readFile(reelPath,'utf8')); }
catch (error) { fail(`invalid reel.json: ${error.message}`); }
const compositionId = safeCompositionId(reel?.compositionId);
const fps = Number(reel?.format?.fps);
if (!compositionId) fail('compositionId missing.');
if (!Number.isFinite(fps) || fps <= 0) fail('reel.format.fps missing/invalid.');
const mapRelative = reel?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const mapPath = path.resolve(reelDir,mapRelative);
if (!existsSync(mapPath)) fail(`SCENE-VOICE-MAP missing: ${mapPath}`);
let sceneMap;
try { sceneMap = JSON.parse(await readFile(mapPath,'utf8')); }
catch (error) { fail(`invalid SCENE-VOICE-MAP.json: ${error.message}`); }
const sentences = Array.isArray(sceneMap?.sentences) ? sceneMap.sentences : [];
if (!sentences.length) fail('SCENE-VOICE-MAP.json has no sentences.');

const normalizeSpace = (value) => String(value ?? '').replace(/\s+/g,' ').trim();
const lexical = (value) => (String(value ?? '').normalize('NFKC').toLocaleLowerCase('de-DE').match(/[\p{L}\p{N}]+/gu) || []).join('');
const splitWords = (value) => normalizeSpace(value).split(' ').filter(Boolean);
const canonicalScript = await readFile(scriptPath,'utf8');
const mappedScript = sentences.map((sentence) => sentence.text).join(' ');
if (normalizeSpace(canonicalScript) !== normalizeSpace(mappedScript)) fail('SCENE-VOICE-MAP does not reconstruct VOICEOVER-ZUM-KOPIEREN.txt exactly.');

const run = (label, command, args, options={}) => {
  const result = spawnSync(command,args,{encoding:'utf8',...options});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) fail(`${label} failed${result.error ? `: ${result.error.message}` : ''}.`);
  return result;
};

run('runtime audio preparation', process.execPath, [path.resolve('ki/scripts/prepare-reel-audio.mjs'), reelDir]);
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(runtimeAudio)) fail(`runtime WAV missing after preparation: ${runtimeAudio}`);

const markerPath = path.resolve('.cache','reel-aligner-backend.json');
if (!existsSync(markerPath)) {
  console.log('Local aligner is not installed yet; running one-time setup.');
  const setupArgs = [path.resolve('ki/scripts/setup-local-forced-aligner.mjs')];
  if (requestedBackend !== 'auto') setupArgs.push(`--backend=${requestedBackend}`);
  run('local aligner setup', process.execPath, setupArgs, {stdio:'inherit'});
}
let marker;
try { marker = JSON.parse(await readFile(markerPath,'utf8')); }
catch (error) { fail(`invalid local aligner marker: ${error.message}`); }
let backend = requestedBackend === 'auto' ? marker.backend : requestedBackend;
if (!['mlx-qwen3','ctc-german'].includes(backend)) fail(`unsupported backend: ${backend}`);
if (requestedBackend !== 'auto' && marker.backend !== backend) {
  run('switch local aligner backend', process.execPath, [path.resolve('ki/scripts/setup-local-forced-aligner.mjs'),`--backend=${backend}`], {stdio:'inherit'});
  marker = JSON.parse(await readFile(markerPath,'utf8'));
}

const venvPython = path.resolve(marker.python);
if (!existsSync(venvPython)) fail(`local aligner python missing: ${venvPython}. Run node ki/scripts/setup-local-forced-aligner.mjs.`);
const workDir = path.resolve('.cache','reel-alignment',compositionId);
await mkdir(workDir,{recursive:true});
const rawAlignmentPath = path.join(workDir,'alignment.raw.json');
run('forced alignment', venvPython, [
  path.resolve('ki/scripts/python/align_words.py'),
  '--audio', runtimeAudio,
  '--text-file', scriptPath,
  '--output', rawAlignmentPath,
  '--backend', backend,
], {stdio:'inherit'});

let raw;
try { raw = JSON.parse(await readFile(rawAlignmentPath,'utf8')); }
catch (error) { fail(`forced alignment output invalid: ${error.message}`); }
const aligned = Array.isArray(raw?.words) ? raw.words : [];
if (!aligned.length) fail('forced aligner returned no words.');

const expected = [];
for (const sentence of sentences) {
  if (!sentence?.id || !sentence?.sceneId || !normalizeSpace(sentence.text)) fail('scene map contains an incomplete sentence entry.');
  for (const word of splitWords(sentence.text)) expected.push({text:word,sentenceId:sentence.id,sceneId:sentence.sceneId});
}
if (aligned.length !== expected.length) fail(`word count mismatch: aligner=${aligned.length}, canonical=${expected.length}. No fuzzy guessing allowed.`);

const words = aligned.map((word,index) => {
  const expectedWord = expected[index];
  if (lexical(word.text) !== lexical(expectedWord.text)) fail(`word ${index+1} mismatch: aligner="${word.text}" canonical="${expectedWord.text}". No timing files were accepted.`);
  const startSeconds = Number(word.start);
  const endSeconds = Number(word.end);
  if (!Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) || startSeconds < 0 || endSeconds <= startSeconds) fail(`invalid timing for word ${index+1}.`);
  const startFrame = Math.max(0,Math.floor(startSeconds*fps));
  const endFrame = Math.max(startFrame+1,Math.ceil(endSeconds*fps));
  return {
    index:index+1,
    text:expectedWord.text,
    sentenceId:expectedWord.sentenceId,
    sceneId:expectedWord.sceneId,
    startSeconds:Number(startSeconds.toFixed(6)),
    endSeconds:Number(endSeconds.toFixed(6)),
    startFrame,
    endFrame,
    score:Number.isFinite(Number(word.score)) ? Number(Number(word.score).toFixed(6)) : undefined,
  };
});
for (let i=1;i<words.length;i++) if (words[i].startFrame < words[i-1].startFrame) fail(`word timing goes backwards at word ${i+1}.`);

const wordTimingsPath = path.join(reelDir,'01-script-audio','WORD-TIMINGS.json');
const timingPayload = {
  version:1,
  status:'LOCAL_FORCED_ALIGNMENT_ACCEPTED',
  alignmentType:'KNOWN_TRANSCRIPT_FORCED_ALIGNMENT',
  backend:raw.backend,
  model:raw.model,
  modelLicense:raw.modelLicense,
  runtime:raw.runtime,
  fps,
  runtimeAudio:`public/runtime-audio/${compositionId}.wav`,
  generatedAt:new Date().toISOString(),
  rules:{fuzzyWordMatching:false,canonicalTextAuthority:'VOICEOVER-ZUM-KOPIEREN.txt',sceneAuthority:'SCENE-VOICE-MAP.json'},
  words,
};
await writeFile(wordTimingsPath,`${JSON.stringify(timingPayload,null,2)}\n`,'utf8');

const punctuationEnd = /[.!?;:,]$/u;
const cues = [];
let cueNumber = 1;
for (const sentence of sentences) {
  const sentenceWords = words.filter((word) => word.sentenceId === sentence.id);
  let cursor = 0;
  while (cursor < sentenceWords.length) {
    let end = Math.min(cursor+5,sentenceWords.length);
    for (let candidate=cursor+2;candidate<end;candidate++) {
      if (punctuationEnd.test(sentenceWords[candidate].text)) { end=candidate+1; break; }
    }
    const group = sentenceWords.slice(cursor,end);
    const first = group[0];
    const last = group[group.length-1];
    cues.push({
      id:`c${String(cueNumber++).padStart(2,'0')}`,
      sceneId:sentence.sceneId,
      sentenceId:sentence.id,
      startFrame:first.startFrame,
      endFrame:last.endFrame,
      text:group.map((word)=>word.text).join(' '),
      words:group.map((word)=>({text:word.text,startFrame:word.startFrame,endFrame:word.endFrame})),
    });
    cursor=end;
  }
}

const captions = {
  version:2,
  fps,
  timingStatus:'WORD_ALIGNED_LOCAL_FORCED_ALIGNMENT',
  timingAuthority:'01-script-audio/WORD-TIMINGS.json',
  note:'Generated from the exact runtime PCM-WAV plus the exact known transcript. Scene timing is derived next from SCENE-VOICE-MAP.json.',
  cues,
};
await writeFile(captionsPath,`${JSON.stringify(captions,null,2)}\n`,'utf8');

run('scene timing lock', process.execPath, [path.resolve('ki/scripts/lock-scene-timing-from-captions.mjs'),reelDir]);
run('scene/voice gate', process.execPath, [path.resolve('ki/scripts/validate-scene-voice-map.mjs'),reelDir]);
run('voice-lock gate', process.execPath, [path.resolve('ki/scripts/validate-voice-locked-captions.mjs'),reelDir]);

console.log('\nLOCAL REEL ALIGNMENT COMPLETE');
console.log(`backend: ${raw.backend}`);
console.log(`model: ${raw.model} (${raw.modelLicense})`);
console.log(`word timings: ${wordTimingsPath}`);
console.log(`captions: ${captionsPath}`);
console.log('scene timing: VOICE_LOCKED');
console.log('Next: review/commit the generated JSON, then run prepare-reel-render.mjs.');
