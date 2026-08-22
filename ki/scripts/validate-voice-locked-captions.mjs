#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>');
  process.exit(1);
}

const root = path.resolve(target);
const reelPath = path.join(root, '06-projektdateien', 'reel.json');
const captionsPath = path.join(root, '03-caption', 'subtitle-cues.json');

for (const file of [reelPath, captionsPath]) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
}

const reel = JSON.parse(fs.readFileSync(reelPath, 'utf8'));
const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));
const issues = [];
const scenes = new Map((reel.scenes ?? []).map((scene) => [scene.sceneId, scene]));
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

if (!String(captions.timingStatus ?? '').startsWith('VOICE_LOCKED')) {
  issues.push('caption timingStatus is not VOICE_LOCKED');
}

for (const [index, cue] of (captions.cues ?? []).entries()) {
  const prefix = `cue ${index + 1} (${cue.sceneId ?? 'unknown'})`;
  const scene = scenes.get(cue.sceneId);
  if (!scene) {
    issues.push(`${prefix}: unknown sceneId`);
    continue;
  }
  if (cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame) {
    issues.push(`${prefix}: cue exceeds scene bounds`);
  }
  if (!Array.isArray(cue.words) || cue.words.length === 0) {
    issues.push(`${prefix}: missing word-level timestamps`);
    continue;
  }
  const rebuilt = normalize(cue.words.map((word) => word.text).join(' '));
  if (rebuilt !== normalize(cue.text)) {
    issues.push(`${prefix}: word texts do not rebuild cue text exactly`);
  }
  for (let i = 0; i < cue.words.length; i++) {
    const word = cue.words[i];
    if (!(Number.isFinite(word.startFrame) && Number.isFinite(word.endFrame) && word.endFrame > word.startFrame)) {
      issues.push(`${prefix}: invalid word timing at index ${i}`);
      continue;
    }
    if (word.startFrame < cue.startFrame || word.endFrame > cue.endFrame) {
      issues.push(`${prefix}: word ${i} exceeds cue bounds`);
    }
    if (i > 0 && word.startFrame < cue.words[i - 1].endFrame) {
      issues.push(`${prefix}: word ${i} overlaps previous word`);
    }
  }
}

const fps = reel.format?.fps;
const durationFrames = reel.format?.durationInFrames;
const observedSeconds = reel.audio?.observedRenderDurationSeconds;
if (Number.isFinite(fps) && Number.isFinite(durationFrames) && Number.isFinite(observedSeconds)) {
  const expected = observedSeconds * fps;
  if (Math.abs(durationFrames - expected) > 2) {
    issues.push(`composition duration (${durationFrames}f) differs from observed audio (${expected.toFixed(1)}f) by more than 2 frames`);
  }
}

if (issues.length) {
  for (const issue of issues) console.error(`❌ ${issue}`);
  console.error(`\n❌ Voice-lock validation failed with ${issues.length} issue(s)`);
  process.exit(1);
}

console.log(`✅ Voice-locked captions valid: ${(captions.cues ?? []).length} cues`);
