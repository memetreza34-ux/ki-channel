#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {getWhyAIForgetsRenderConfig} from './why-ai-forgets-render-config.mjs';

const config = getWhyAIForgetsRenderConfig(process.argv[2]);
const transcriptArg = process.argv[3];
if (!transcriptArg) {
  throw new Error('Nutzung: node scripts/prepare-why-ai-forgets-final-sync.mjs <reel-ordner> <transcript-json>');
}

const transcript = JSON.parse(readFileSync(resolve(transcriptArg), 'utf8'));
const rawWords = Array.isArray(transcript.words) ? transcript.words : [];
if (rawWords.length === 0) throw new Error('Transcript enthält keine words-Einträge.');

const words = rawWords.map((word, index) => {
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
  'Warum vergisst deine KI plötzlich frühere Nachrichten?',
  'Dahinter steckt meistens ihr begrenztes Kontextfenster.',
  'Stell dir den Chat als sehr langes Band vor.',
  'Die KI sieht davon immer nur einen Ausschnitt.',
  'Mit jeder neuen Nachricht wandert dieses Fenster weiter.',
  'Neue Inhalte schieben den sichtbaren Bereich nach vorn.',
  'Ältere Nachrichten rutschen dadurch irgendwann hinaus.',
  'Für die nächste Antwort sind sie nicht vollständig verfügbar.',
  'Lange Texte füllen den verfügbaren Platz besonders schnell.',
  'Dateien und ausführliche Antworten verbrauchen zusätzlich viel Raum.',
  'Dann fehlen Namen, Regeln oder Entscheidungen vom Anfang.',
  'Die KI kann nur mit dem sichtbaren Teil arbeiten.',
  'Fasse wichtige Punkte deshalb regelmäßig kurz zusammen.',
  'Wiederhole zentrale Vorgaben und gliedere große Projekte klar.',
  'So bleibt der entscheidende Kontext im aktiven Fenster.',
  'Die KI vergisst dich nicht absichtlich, der Teil ist nur unsichtbar.',
];

const normalize = (value) => value.toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9]/gi, '');
const transcriptTokens = words.map((word) => normalize(word.text));
let cursor = 0;
const sentences = [];

for (const [sentenceIndex, sentenceText] of sentenceTexts.entries()) {
  const visibleTokens = sentenceText.split(/\s+/).filter(Boolean);
  const alignedWords = [];

  for (const visibleText of visibleTokens) {
    const token = normalize(visibleText);
    let matchIndex = -1;
    for (let lookahead = cursor; lookahead < Math.min(words.length, cursor + 5); lookahead += 1) {
      if (transcriptTokens[lookahead] === token) {
        matchIndex = lookahead;
        break;
      }
    }
    if (matchIndex < 0) {
      throw new Error(`Transcript stimmt bei Satz ${sentenceIndex + 1} nicht mit dem Script überein. Erwartet: ${visibleText}`);
    }
    if (matchIndex > cursor + 1) {
      throw new Error(`Zu große Transcript-Lücke vor „${visibleText}“ in Satz ${sentenceIndex + 1}.`);
    }

    const matched = words[matchIndex];
    alignedWords.push({
      text: visibleText,
      startFrame: Math.round(matched.start * fps),
      endFrame: Math.max(Math.round(matched.end * fps), Math.round(matched.start * fps) + 1),
    });
    cursor = matchIndex + 1;
  }

  sentences.push({
    id: `sentence-${String(sentenceIndex + 1).padStart(2, '0')}`,
    text: sentenceText,
    startFrame: alignedWords[0].startFrame,
    endFrame: alignedWords.at(-1).endFrame,
    words: alignedWords,
  });
}

if (sentences.length !== 16) throw new Error(`Erwartet 16 Untertitelsätze, gefunden: ${sentences.length}.`);

const speechPairs = Array.from({length: 8}, (_, index) => ({
  id: `pair-${String(index + 1).padStart(2, '0')}`,
  sceneId: `scene-${String(index + 1).padStart(2, '0')}`,
  speechStartFrame: sentences[index * 2].startFrame,
  speechEndFrame: sentences[index * 2 + 1].endFrame,
  sentences: [sentences[index * 2], sentences[index * 2 + 1]],
}));

const speechStartSeconds = words[0].start;
const speechEndSeconds = words.at(-1).end;
const durationInFrames = Math.ceil((speechEndSeconds + 1.8) * fps);

const scenes = speechPairs.map((pair, index) => {
  const startFrame = index === 0
    ? 0
    : Math.round((pair.speechStartFrame + speechPairs[index - 1].speechEndFrame) / 2);
  const endFrame = index === speechPairs.length - 1
    ? durationInFrames
    : Math.round((pair.speechEndFrame + speechPairs[index + 1].speechStartFrame) / 2);
  return {
    id: pair.sceneId,
    startFrame,
    endFrame,
    speechStartFrame: pair.speechStartFrame,
    speechEndFrame: pair.speechEndFrame,
    resultHoldFrames: 30,
    boundaryReferenceFrame: endFrame,
    boundaryOffsetFrames: 0,
  };
});

const captionPairs = speechPairs.map((pair, index) => ({
  id: pair.id,
  sceneId: pair.sceneId,
  startFrame: scenes[index].startFrame,
  endFrame: scenes[index].endFrame,
  bottomPx: 260,
  mode: 'dual-sentence-active-word',
  sentences: pair.sentences,
}));

const triggerDefinitions = [
  ['s1-forgets', 'scene-01', 'vergisst'],
  ['s1-window', 'scene-01', 'Kontextfenster'],
  ['s2-band', 'scene-02', 'Band'],
  ['s2-slice', 'scene-02', 'Ausschnitt'],
  ['s3-message', 'scene-03', 'Nachricht'],
  ['s3-shift', 'scene-03', 'wandert'],
  ['s4-out', 'scene-04', 'hinaus'],
  ['s4-unavailable', 'scene-04', 'verfügbar'],
  ['s5-text', 'scene-05', 'Texte'],
  ['s5-files', 'scene-05', 'Dateien'],
  ['s5-answer', 'scene-05', 'Antworten'],
  ['s6-details', 'scene-06', 'Namen'],
  ['s6-visible', 'scene-06', 'sichtbaren'],
  ['s7-summary', 'scene-07', 'zusammen'],
  ['s7-repeat', 'scene-07', 'Wiederhole'],
  ['s7-sections', 'scene-07', 'gliedere'],
  ['s8-context', 'scene-08', 'Kontext'],
  ['s8-intent', 'scene-08', 'absichtlich'],
  ['s8-visible', 'scene-08', 'unsichtbar'],
];

const usedIndexes = new Set();
const beats = triggerDefinitions.map(([id, sceneId, token]) => {
  const scene = scenes.find((item) => item.id === sceneId);
  const normalizedToken = normalize(token);
  const candidate = words
    .map((word, index) => ({word, index}))
    .find(({word, index}) => {
      const frame = Math.round(word.start * fps);
      return normalize(word.text) === normalizedToken
        && !usedIndexes.has(index)
        && frame >= scene.startFrame
        && frame < scene.endFrame;
    });
  if (!candidate) throw new Error(`Triggerwort nicht gefunden: ${sceneId}/${token}`);
  usedIndexes.add(candidate.index);
  const transcriptStartFrame = Math.round(candidate.word.start * fps);
  const transcriptEndFrame = Math.max(Math.round(candidate.word.end * fps), transcriptStartFrame + 1);
  return {
    id,
    sceneId,
    expression: token,
    transcriptStartFrame,
    animationStartFrame: transcriptStartFrame,
    resultFrame: Math.min(scene.endFrame - 30, transcriptEndFrame + Math.round(1.15 * fps)),
  };
});

const finalSync = {
  version: 3,
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
  captionPairs,
  scenes,
  beats,
};

const finalSyncPath = resolve(config.reelRoot, 'timeline', 'final-sync.json');
writeFileSync(finalSyncPath, `${JSON.stringify(finalSync, null, 2)}\n`, 'utf8');
console.log(`✓ Finale Audio-Timeline erzeugt: ${finalSyncPath}`);
console.log(`Sprachbeginn: ${speechStartSeconds.toFixed(2)} s`);
console.log(`Sprachende: ${speechEndSeconds.toFixed(2)} s`);
console.log(`Composition: ${(durationInFrames / fps).toFixed(2)} s`);
