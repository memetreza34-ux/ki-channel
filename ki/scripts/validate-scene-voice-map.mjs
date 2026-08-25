#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>');
  process.exit(1);
}

const root = path.resolve(target);
const reelPath = path.join(root, '06-projektdateien', 'reel.json');
const captionsPath = path.join(root, '03-caption', 'subtitle-cues.json');
const scriptPath = path.join(root, '01-script-audio', 'VOICEOVER-ZUM-KOPIEREN.txt');
for (const file of [reelPath, captionsPath, scriptPath]) {
  if (!fs.existsSync(file)) {
    console.error(`SCENE VOICE MAP FAILED: missing required file: ${file}`);
    process.exit(1);
  }
}

const reel = JSON.parse(fs.readFileSync(reelPath, 'utf8'));
const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));
const canonicalScript = fs.readFileSync(scriptPath, 'utf8');
const mapRelative = reel?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const mapPath = path.resolve(root, mapRelative);
if (!fs.existsSync(mapPath)) {
  console.error(`SCENE VOICE MAP FAILED: missing map: ${mapPath}`);
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const issues = [];
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
const sentences = Array.isArray(map.sentences) ? map.sentences : [];
const cues = Array.isArray(captions.cues) ? captions.cues : [];

if (!scenes.length) issues.push('reel.json has no scenes');
if (!sentences.length) issues.push('SCENE-VOICE-MAP.json has no sentences');

const sceneIndex = new Map(scenes.map((scene, index) => [scene.sceneId, index]));
const seenSentenceIds = new Set();
let lastSceneIndex = -1;
for (const [index, sentence] of sentences.entries()) {
  const prefix = `sentence ${index + 1}`;
  if (!sentence?.id) issues.push(`${prefix}: id missing`);
  else if (seenSentenceIds.has(sentence.id)) issues.push(`${prefix}: duplicate id ${sentence.id}`);
  else seenSentenceIds.add(sentence.id);
  if (!sentence?.sceneId || !sceneIndex.has(sentence.sceneId)) {
    issues.push(`${prefix}: unknown sceneId ${sentence?.sceneId ?? 'missing'}`);
    continue;
  }
  if (!normalize(sentence.text)) issues.push(`${prefix}: text missing`);
  const currentSceneIndex = sceneIndex.get(sentence.sceneId);
  if (currentSceneIndex < lastSceneIndex) issues.push(`${prefix}: scene order goes backwards`);
  lastSceneIndex = currentSceneIndex;
}

const mappedScript = normalize(sentences.map((sentence) => sentence.text).join(' '));
if (mappedScript !== normalize(canonicalScript)) {
  issues.push('all mapped sentence texts together do not exactly reconstruct VOICEOVER-ZUM-KOPIEREN.txt');
}

const expectedByScene = new Map();
for (const scene of scenes) expectedByScene.set(scene.sceneId, []);
for (const sentence of sentences) {
  if (expectedByScene.has(sentence.sceneId)) expectedByScene.get(sentence.sceneId).push(sentence.text);
}
for (const scene of scenes) {
  if (!expectedByScene.get(scene.sceneId)?.length) issues.push(`${scene.sceneId}: no mapped sentence`);
}

const actualByScene = new Map();
for (const scene of scenes) actualByScene.set(scene.sceneId, []);
for (const cue of cues) {
  if (!actualByScene.has(cue.sceneId)) issues.push(`caption ${cue.id ?? 'unknown'}: unknown sceneId ${cue.sceneId}`);
  else actualByScene.get(cue.sceneId).push(cue.text);
}
for (const scene of scenes) {
  const expected = normalize(expectedByScene.get(scene.sceneId)?.join(' '));
  const actual = normalize(actualByScene.get(scene.sceneId)?.join(' '));
  if (expected !== actual) {
    issues.push(`${scene.sceneId}: caption text does not reconstruct mapped scene text exactly`);
  }
}

const isVoiceLocked = String(captions.timingStatus ?? '').startsWith('VOICE_LOCKED');
if (isVoiceLocked) {
  const tolerance = Number(map?.rules?.sceneStartToleranceFrames ?? 4);
  const firstSceneLead = Number(map?.rules?.firstSceneLeadFrames ?? 8);

  for (const [index, scene] of scenes.entries()) {
    const sceneCues = cues
      .filter((cue) => cue.sceneId === scene.sceneId)
      .sort((a, b) => a.startFrame - b.startFrame);
    if (!sceneCues.length) {
      issues.push(`${scene.sceneId}: no voice-locked captions`);
      continue;
    }
    const firstCue = sceneCues[0];
    const lastCue = sceneCues[sceneCues.length - 1];
    const firstWord = Array.isArray(firstCue.words) && firstCue.words.length ? firstCue.words[0] : null;
    const lastWord = Array.isArray(lastCue.words) && lastCue.words.length ? lastCue.words[lastCue.words.length - 1] : null;
    if (!firstWord || !lastWord) {
      issues.push(`${scene.sceneId}: word-level timings missing for scene anchor check`);
      continue;
    }

    if (index === 0) {
      if (scene.startFrame !== 0) issues.push(`${scene.sceneId}: first scene must start at frame 0`);
      if (firstWord.startFrame - scene.startFrame > firstSceneLead) {
        issues.push(`${scene.sceneId}: first spoken word starts ${firstWord.startFrame - scene.startFrame}f after scene start; max ${firstSceneLead}f`);
      }
    } else if (Math.abs(scene.startFrame - firstWord.startFrame) > tolerance) {
      issues.push(`${scene.sceneId}: scene start ${scene.startFrame}f is not anchored to first mapped word ${firstWord.startFrame}f within ±${tolerance}f`);
    }

    if (scene.endFrame < lastWord.endFrame) {
      issues.push(`${scene.sceneId}: scene ends before its last mapped spoken word`);
    }
  }
}

if (issues.length) {
  for (const issue of issues) console.error(`❌ ${issue}`);
  console.error(`\n❌ Scene/voice mapping failed with ${issues.length} issue(s)`);
  process.exit(1);
}

console.log(`✅ Scene/voice map valid: ${sentences.length} sentence(s), ${scenes.length} scene(s)`);
console.log(`✅ Voiceover reconstruction: exact`);
console.log(`✅ Caption-to-scene reconstruction: exact`);
if (isVoiceLocked) console.log('✅ Scene starts are anchored to mapped spoken words');
