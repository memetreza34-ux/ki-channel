#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {getWhyAIForgetsRenderConfig} from './why-ai-forgets-render-config.mjs';

const config = getWhyAIForgetsRenderConfig(process.argv[2]);
const transcriptArg = process.argv[3];
if (!transcriptArg) {
  throw new Error('Nutzung: node scripts/prepare-why-ai-forgets-final-sync.mjs <reel-ordner> <transcript-json>');
}

const transcriptPath = resolve(transcriptArg);
const transcript = JSON.parse(readFileSync(transcriptPath, 'utf8'));
const words = Array.isArray(transcript.words) ? transcript.words : [];
if (words.length === 0) throw new Error('Transcript enthält keine words-Einträge.');

const normalizedWords = words.map((word, index) => {
  const text = String(word.word ?? word.text ?? '').trim();
  const start = Number(word.start ?? word.startSeconds);
  const end = Number(word.end ?? word.endSeconds);
  if (!text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error(`Ungültiges Transcript-Wort an Position ${index}.`);
  }
  return {text, start, end};
});

const fps = 30;
const sentenceTexts = [
  'Warum vergisst deine KI plötzlich etwas, das du ihr vorher geschrieben hast?',
  'Der Grund ist meistens ihr Kontextfenster.',
  'Stell dir den Chat wie ein langes Band vor.',
  'Die KI sieht nicht automatisch das gesamte Band, sondern nur einen begrenzten Ausschnitt.',
  'Mit jeder neuen Nachricht wandert dieses Fenster weiter.',
  'Ältere Teile rutschen irgendwann hinaus und stehen für die nächste Antwort nicht mehr vollständig zur Verfügung.',
  'Besonders schnell passiert das bei langen Texten, vielen Dateien oder sehr ausführlichen Antworten.',
  'Dann fehlen plötzlich Namen, Regeln oder Entscheidungen vom Anfang.',
  'Du kannst das vermeiden: Fasse wichtige Punkte regelmäßig kurz zusammen.',
  'Wiederhole zentrale Vorgaben vor einer neuen Aufgabe.',
  'Teile große Projekte in klare Abschnitte und speichere Entscheidungen außerhalb des Chats.',
  'So gibst du der KI genau den Kontext, den sie gerade braucht.',
  'Sie hat dich nicht absichtlich vergessen.',
  'Der relevante Teil war nur nicht mehr im sichtbaren Fenster.',
];

const normalize = (value) => value.toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9]/gi, '');
const scriptTokens = sentenceTexts.map((sentence) => sentence.split(/\s+/).map(normalize).filter(Boolean));
const transcriptTokens = normalizedWords.map((word) => normalize(word.text));

let cursor = 0;
const captions = [];
for (const [sentenceIndex, tokens] of scriptTokens.entries()) {
  const startIndex = cursor;
  for (const token of tokens) {
    while (cursor < transcriptTokens.length && transcriptTokens[cursor] !== token) cursor += 1;
    if (cursor >= transcriptTokens.length) {
      throw new Error(`Transcript kann Satz ${sentenceIndex + 1} nicht eindeutig zuordnen; Token fehlt: ${token}`);
    }
    cursor += 1;
  }
  const endIndex = cursor - 1;
  captions.push({
    id: `caption-${String(sentenceIndex + 1).padStart(2, '0')}`,
    text: sentenceTexts[sentenceIndex],
    startFrame: Math.round(normalizedWords[startIndex].start * fps),
    endFrame: Math.round(normalizedWords[endIndex].end * fps),
    lineCount: sentenceTexts[sentenceIndex].length > 58 ? 2 : 1,
    bottomPx: 220,
    revealMode: 'instant',
    wordHighlight: false,
    progressIndicator: 'single-violet-line',
  });
}

const sceneCaptionRanges = [
  [0, 1],
  [2, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 10],
  [11, 13],
];

const speechStartSeconds = normalizedWords[0].start;
const speechEndSeconds = normalizedWords.at(-1).end;
const outroHoldSeconds = 1.8;
const durationInFrames = Math.ceil((speechEndSeconds + outroHoldSeconds) * fps);

const scenes = sceneCaptionRanges.map(([firstCaption, lastCaption], index) => {
  const previousEnd = index === 0 ? 0 : Math.round((captions[firstCaption].startFrame + captions[firstCaption - 1].endFrame) / 2);
  const nextStart = index === sceneCaptionRanges.length - 1
    ? durationInFrames
    : Math.round((captions[lastCaption].endFrame + captions[lastCaption + 1].startFrame) / 2);
  return {
    id: `scene-${String(index + 1).padStart(2, '0')}`,
    startFrame: previousEnd,
    endFrame: nextStart,
    speechStartFrame: captions[firstCaption].startFrame,
    speechEndFrame: captions[lastCaption].endFrame,
    resultHoldFrames: Math.max(30, nextStart - captions[lastCaption].endFrame),
    boundaryReferenceFrame: nextStart,
    boundaryOffsetFrames: 0,
  };
});

for (const [index, caption] of captions.entries()) {
  const sceneIndex = sceneCaptionRanges.findIndex(([first, last]) => index >= first && index <= last);
  caption.sceneId = `scene-${String(sceneIndex + 1).padStart(2, '0')}`;
}

const triggerDefinitions = [
  ['s1-forgets', 'scene-01', 'vergisst'],
  ['s1-window', 'scene-01', 'Kontextfenster'],
  ['s2-rail', 'scene-02', 'Band'],
  ['s2-limited', 'scene-02', 'Ausschnitt'],
  ['s3-new', 'scene-03', 'Nachricht'],
  ['s3-shift', 'scene-03', 'wandert'],
  ['s4-old', 'scene-04', 'Ältere'],
  ['s4-out', 'scene-04', 'hinaus'],
  ['s4-unavailable', 'scene-04', 'vollständig'],
  ['s5-text', 'scene-05', 'Texten'],
  ['s5-files', 'scene-05', 'Dateien'],
  ['s5-answer', 'scene-05', 'Antworten'],
  ['s6-name', 'scene-06', 'Namen'],
  ['s6-rules', 'scene-06', 'Regeln'],
  ['s6-decisions', 'scene-06', 'Entscheidungen'],
  ['s7-summary', 'scene-07', 'zusammen'],
  ['s7-repeat', 'scene-07', 'Wiederhole'],
  ['s7-sections', 'scene-07', 'Abschnitte'],
  ['s8-context', 'scene-08', 'Kontext'],
  ['s8-intent', 'scene-08', 'absichtlich'],
  ['s8-visible', 'scene-08', 'Fenster'],
];

const usedWordIndexes = new Set();
const beats = triggerDefinitions.map(([id, sceneId, token]) => {
  const normalizedToken = normalize(token);
  const scene = scenes.find((item) => item.id === sceneId);
  const candidates = normalizedWords
    .map((word, index) => ({word, index}))
    .filter(({word, index}) => normalize(word.text) === normalizedToken && !usedWordIndexes.has(index) && Math.round(word.start * fps) >= scene.startFrame && Math.round(word.start * fps) < scene.endFrame);
  const candidate = candidates[0];
  if (!candidate) throw new Error(`Triggerwort nicht gefunden: ${sceneId}/${token}`);
  usedWordIndexes.add(candidate.index);
  const transcriptStartFrame = Math.round(candidate.word.start * fps);
  return {
    id,
    sceneId,
    expression: token,
    transcriptStartFrame,
    animationStartFrame: transcriptStartFrame,
    resultFrame: Math.min(scene.endFrame - 30, transcriptStartFrame + Math.round(1.4 * fps)),
  };
});

const finalSync = {
  version: 1,
  status: 'final-transcript-aligned',
  fps,
  audio: {
    durationSeconds: Number(transcript.duration ?? transcript.audioDuration ?? speechEndSeconds),
    speechStartSeconds,
    speechEndSeconds,
  },
  composition: {
    durationInFrames,
    outroHoldFrames: durationInFrames - Math.round(speechEndSeconds * fps),
  },
  captions,
  scenes,
  beats,
};

const finalSyncPath = resolve(config.reelRoot, 'timeline', 'final-sync.json');
writeFileSync(finalSyncPath, `${JSON.stringify(finalSync, null, 2)}\n`, 'utf8');
console.log(`✓ Finale Audio-Timeline erzeugt: ${finalSyncPath}`);
console.log(`Sprachbeginn: ${speechStartSeconds.toFixed(2)} s`);
console.log(`Sprachende: ${speechEndSeconds.toFixed(2)} s`);
console.log(`Composition: ${(durationInFrames / fps).toFixed(2)} s`);