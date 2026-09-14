#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/build-reel-master-timeline-v2.mjs <reel-package-dir>');
  process.exit(2);
}

const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = (message) => { console.error(`MASTER TIMELINE V2 FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

const reelPath = p('06-projektdateien', 'reel.json');
const wordsPath = p('01-script-audio', 'WORD-TIMINGS.json');
const sceneMapPath = p('01-script-audio', 'SCENE-VOICE-MAP.json');
const captionsPath = p('03-caption', 'subtitle-cues.json');
const planPath = p('06-projektdateien', 'SYNC-PLAN.json');
const timelinePath = p('06-projektdateien', 'MASTER-TIMELINE.json');
const sfxEventsPath = p('06-projektdateien', 'sfx-events.json');
for (const file of [reelPath, wordsPath, sceneMapPath, captionsPath, planPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);

let reel = await readJson(reelPath);
const timings = await readJson(wordsPath);
const sceneMap = await readJson(sceneMapPath);
const plan = await readJson(planPath);
let sfxPlan = existsSync(sfxEventsPath) ? await readJson(sfxEventsPath) : null;

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('reel.format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('finalDurationInFrames missing. Run forced alignment first.');
if (String(timings?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('WORD-TIMINGS.json is not accepted forced alignment output.');

const words = Array.isArray(timings?.words) ? timings.words : [];
const sentences = Array.isArray(sceneMap?.sentences) ? sceneMap.sentences : [];
const events = Array.isArray(plan?.events) ? plan.events : [];
if (!words.length || !sentences.length || !events.length) fail('word timings, sentence map, or sync events missing.');

const sentenceIdOf = (sentence) => String(sentence?.id || sentence?.sentenceId || '').trim();
const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, '').trim();
const phraseTokens = (value) => String(value ?? '').split(/\s+/).map(normalize).filter(Boolean);

const sentenceById = new Map();
for (const sentence of sentences) {
  const id = sentenceIdOf(sentence);
  if (!id) fail('SCENE-VOICE-MAP sentence without id/sentenceId.');
  if (sentenceById.has(id)) fail(`duplicate sentence id: ${id}`);
  sentenceById.set(id, {...sentence, id, sentenceId: id});
}

const wordsBySentence = new Map();
const wordsByScene = new Map();
for (const word of words) {
  const sentenceId = String(word?.sentenceId || '').trim();
  const sceneId = String(word?.sceneId || '').trim();
  if (!sentenceId || !sceneId) fail(`word ${word?.index ?? '?'} missing sentenceId/sceneId.`);
  const sentenceRow = wordsBySentence.get(sentenceId) || [];
  sentenceRow.push(word);
  wordsBySentence.set(sentenceId, sentenceRow);
  const sceneRow = wordsByScene.get(sceneId) || [];
  sceneRow.push(word);
  wordsByScene.set(sceneId, sceneRow);
}
for (const row of [...wordsBySentence.values(), ...wordsByScene.values()]) row.sort((a, b) => Number(a.startFrame) - Number(b.startFrame));

const sceneOrder = Array.isArray(reel?.scenes) ? reel.scenes.map((scene) => String(scene.sceneId)) : [];
if (!sceneOrder.length) fail('reel.json scenes missing.');
const sceneRule = plan?.rules?.scenes || {};
const leadFrames = Math.max(0, Math.min(4, Number(sceneRule.leadFramesBeforeFirstWord ?? 4)));
const minGapAfterPreviousWord = Math.max(0, Number(sceneRule.minGapAfterPreviousWord ?? 1));

const sceneStarts = [];
for (let index = 0; index < sceneOrder.length; index++) {
  const sceneId = sceneOrder[index];
  const sceneWords = wordsByScene.get(sceneId) || [];
  if (!sceneWords.length) fail(`${sceneId}: no aligned words.`);
  if (index === 0) {
    sceneStarts.push(0);
    continue;
  }
  const firstWord = sceneWords[0];
  const prevWords = wordsByScene.get(sceneOrder[index - 1]) || [];
  if (!prevWords.length) fail(`${sceneOrder[index - 1]}: no aligned words.`);
  const prevLast = prevWords[prevWords.length - 1];
  const desiredLeadStart = Number(firstWord.startFrame) - leadFrames;
  const afterPreviousSpeech = Number(prevLast.endFrame) + minGapAfterPreviousWord;
  const pauseAwareStart = Math.max(desiredLeadStart, afterPreviousSpeech);
  sceneStarts.push(Math.min(Number(firstWord.startFrame), Math.max(0, pauseAwareStart)));
}

const lockedScenes = sceneOrder.map((sceneId, index) => {
  const original = reel.scenes.find((scene) => String(scene.sceneId) === sceneId);
  const startFrame = sceneStarts[index];
  const endFrame = index === sceneOrder.length - 1 ? finalDuration : sceneStarts[index + 1];
  if (!Number.isFinite(startFrame) || !Number.isFinite(endFrame) || endFrame <= startFrame) fail(`${sceneId}: invalid derived bounds.`);
  const sceneWords = wordsByScene.get(sceneId) || [];
  if (sceneWords[0].startFrame < startFrame || sceneWords[sceneWords.length - 1].endFrame > endFrame) fail(`${sceneId}: spoken words fall outside scene.`);
  return {...original, startFrame, endFrame, timingStatus: 'VOICE_LOCKED'};
});
const sceneById = new Map(lockedScenes.map((scene) => [String(scene.sceneId), scene]));

const captionRules = plan?.rules?.captions || {};
const minWords = Math.max(1, Math.min(4, Number(captionRules.minWordsPerCue || 2)));
const maxWords = Math.max(minWords, Math.min(5, Number(captionRules.maxWordsPerCue || 4)));
const targetWords = Math.max(minWords, Math.min(maxWords, Number(captionRules.targetWordsPerCue || 3)));
const hardGapFrames = Math.max(1, Math.round(Number(captionRules.maxGapSeconds || 0.22) * fps));
const softGapFrames = Math.max(1, Math.round(Number(captionRules.softGapSeconds || 0.14) * fps));
const tailFrames = Math.max(0, Math.min(4, Number(captionRules.tailFrames ?? 1)));
const punctuationHard = /[.!?;:]$/u;
const punctuationSoft = /[,]$/u;

const rawCues = [];
let cueIndex = 1;
for (const sentence of sentences) {
  const sentenceId = sentenceIdOf(sentence);
  const row = wordsBySentence.get(sentenceId) || [];
  if (!row.length) fail(`${sentenceId}: no aligned words.`);
  const groups = [];
  let group = [];
  const flush = () => { if (group.length) { groups.push(group); group = []; } };
  for (let index = 0; index < row.length; index++) {
    const word = row[index];
    const prev = group[group.length - 1];
    const gap = prev ? Number(word.startFrame) - Number(prev.endFrame) : 0;
    if (prev && gap > hardGapFrames && group.length >= minWords) flush();
    group.push(word);
    const next = row[index + 1];
    const nextGap = next ? Number(next.startFrame) - Number(word.endFrame) : 9999;
    const hardBreak = punctuationHard.test(String(word.text)) && group.length >= minWords;
    const softBreak = punctuationSoft.test(String(word.text)) && group.length >= minWords;
    const naturalTarget = group.length >= targetWords && (softBreak || nextGap > softGapFrames);
    if (group.length >= maxWords || hardBreak || naturalTarget) flush();
  }
  flush();
  if (groups.length >= 2 && groups[groups.length - 1].length === 1 && groups[groups.length - 2].length >= 3) {
    groups[groups.length - 1].unshift(groups[groups.length - 2].pop());
  }
  for (const groupWords of groups) {
    const first = groupWords[0];
    const last = groupWords[groupWords.length - 1];
    rawCues.push({
      id: `c${String(cueIndex++).padStart(2, '0')}`,
      sceneId: String(sentence.sceneId),
      sentenceId,
      startFrame: Number(first.startFrame),
      endFrame: Number(last.endFrame),
      text: groupWords.map((word) => String(word.text)).join(' '),
      words: groupWords.map((word) => ({text: String(word.text), startFrame: Number(word.startFrame), endFrame: Number(word.endFrame)})),
    });
  }
}
rawCues.sort((a, b) => a.startFrame - b.startFrame);
const cues = rawCues.map((cue, index) => {
  const nextStart = index < rawCues.length - 1 ? rawCues[index + 1].startFrame : finalDuration;
  const scene = sceneById.get(cue.sceneId);
  if (!scene) fail(`${cue.id}: unknown scene.`);
  const cap = Math.min(nextStart, scene.endFrame, finalDuration);
  const desiredEnd = Math.min(cap, cue.endFrame + tailFrames);
  return {...cue, endFrame: Math.max(cue.startFrame + 1, desiredEnd)};
});

const phraseMatch = (sentenceWords, phrase) => {
  const wanted = phraseTokens(phrase);
  if (!wanted.length) return null;
  const normalized = sentenceWords.map((word) => normalize(word.text));
  for (let index = 0; index <= normalized.length - wanted.length; index++) {
    let ok = true;
    for (let offset = 0; offset < wanted.length; offset++) if (normalized[index + offset] !== wanted[offset]) { ok = false; break; }
    if (ok) return {first: sentenceWords[index], last: sentenceWords[index + wanted.length - 1]};
  }
  return null;
};

const resolvedEvents = [];
const eventIds = new Set();
for (const event of events) {
  const id = String(event?.id || '').trim();
  const sceneId = String(event?.sceneId || '').trim();
  const sentenceId = String(event?.sentenceId || '').trim();
  if (!id || !sceneId || !sentenceId) fail('every sync event needs id + sceneId + sentenceId.');
  if (eventIds.has(id)) fail(`duplicate sync event id: ${id}`);
  eventIds.add(id);
  const sentence = sentenceById.get(sentenceId);
  if (!sentence || String(sentence.sceneId) !== sceneId) fail(`${id}: sentence/scene mismatch.`);
  const row = wordsBySentence.get(sentenceId) || [];
  const type = String(event.anchorType || '');
  let baseFrame;
  let matchedPhrase = null;
  if (type === 'SENTENCE_START') baseFrame = Number(row[0].startFrame);
  else if (type === 'SENTENCE_END') baseFrame = Number(row[row.length - 1].endFrame);
  else if (type === 'PHRASE_START' || type === 'PHRASE_END') {
    const match = phraseMatch(row, event.anchorPhrase);
    if (!match) fail(`${id}: exact phrase not found after alignment: "${event.anchorPhrase}".`);
    matchedPhrase = String(event.anchorPhrase);
    baseFrame = type === 'PHRASE_START' ? Number(match.first.startFrame) : Number(match.last.endFrame);
  } else fail(`${id}: unsupported anchorType ${type}.`);
  const globalFrame = baseFrame + Number(event.offsetFrames || 0);
  const scene = sceneById.get(sceneId);
  if (!scene || globalFrame < scene.startFrame || globalFrame >= scene.endFrame) fail(`${id}: resolved frame ${globalFrame} outside ${sceneId}.`);
  resolvedEvents.push({id, sceneId, sentenceId, kind: String(event.kind || 'ANIMATION'), target: String(event.target || ''), anchorType: type, anchorPhrase: matchedPhrase, offsetFrames: Number(event.offsetFrames || 0), globalFrame, sceneFrame: globalFrame - scene.startFrame, exact: true, sfxId: event.sfxId || null});
}

if (sfxPlan && Array.isArray(sfxPlan.events)) {
  const byId = new Map(resolvedEvents.map((event) => [event.id, event]));
  const sfxToEvent = new Map(resolvedEvents.filter((event) => event.sfxId).map((event) => [String(event.sfxId), event]));
  sfxPlan = {...sfxPlan, status: 'MASTER_TIMELINE_ANCHORED', syncAuthority: '06-projektdateien/MASTER-TIMELINE.json', events: sfxPlan.events.map((event) => {
    const mapped = event.syncEventId ? byId.get(String(event.syncEventId)) : sfxToEvent.get(String(event.id));
    if (!mapped) fail(`${event.id}: SFX event has no exact master-timeline mapping.`);
    return {...event, syncEventId: mapped.id, sync: {type: 'MASTER_EVENT', eventId: mapped.id}, anchor: {type: 'SCENE_OFFSET', frame: mapped.sceneFrame}};
  })};
  await writeFile(sfxEventsPath, `${JSON.stringify(sfxPlan, null, 2)}\n`, 'utf8');
}

reel = {...reel, timingAuthority: 'WORD_TIMINGS_AFTER_FORCED_ALIGNMENT', format: {...reel.format, finalDurationInFrames: finalDuration}, sceneVoiceMap: {...(reel.sceneVoiceMap || {}), status: 'VOICE_LOCKED'}, captions: {...(reel.captions || {}), status: 'VOICE_LOCKED_MASTER_TIMELINE'}, scenes: lockedScenes};
await writeFile(reelPath, `${JSON.stringify(reel, null, 2)}\n`, 'utf8');
await writeFile(captionsPath, `${JSON.stringify({version: 4, fps, timingStatus: 'VOICE_LOCKED_MASTER_TIMELINE', timingAuthority: '01-script-audio/WORD-TIMINGS.json', groupingAuthority: '06-projektdateien/SYNC-PLAN.json', note: 'Phrase-aware captions built directly from exact aligned word frames; cues never cross scene boundaries.', cues}, null, 2)}\n`, 'utf8');

const timeline = {
  version: 2,
  status: 'MASTER_TIMELINE_LOCKED',
  authority: '01-script-audio/WORD-TIMINGS.json',
  syncPlan: '06-projektdateien/SYNC-PLAN.json',
  fps,
  finalDurationInFrames: finalDuration,
  sceneCutPolicy: {mode: 'PAUSE_AWARE_PRE_ROLL', leadFramesBeforeFirstWord: leadFrames, minGapAfterPreviousWord},
  scenes: lockedScenes.map(({sceneId, startFrame, endFrame, title}) => ({sceneId, startFrame, endFrame, title})),
  captions: {file: '03-caption/subtitle-cues.json', cueCount: cues.length, targetWordsPerCue: targetWords, maxWordsPerCue: maxWords, maxGapFrames: hardGapFrames},
  events: resolvedEvents,
  sfx: sfxPlan ? {file: '06-projektdateien/sfx-events.json', eventCount: sfxPlan.events.length, authority: 'MASTER_TIMELINE_EVENT'} : {eventCount: 0},
};
await writeFile(timelinePath, `${JSON.stringify(timeline, null, 2)}\n`, 'utf8');

console.log('MASTER TIMELINE V2 BUILT');
console.log(`scenes: ${lockedScenes.length}`);
console.log(`captions: ${cues.length}`);
console.log(`events: ${resolvedEvents.length}`);
console.log(`sfx events: ${sfxPlan?.events?.length || 0}`);
console.log(`timeline: ${timelinePath}`);
