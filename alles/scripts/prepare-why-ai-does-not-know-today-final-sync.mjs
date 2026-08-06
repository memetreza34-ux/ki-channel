#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {getTodayKnowledgeRenderConfig} from './why-ai-does-not-know-today-render-config.mjs';

const config = getTodayKnowledgeRenderConfig(process.argv[2]);
const transcriptArg = process.argv[3];
if (!transcriptArg) {
  throw new Error('Nutzung: node scripts/prepare-why-ai-does-not-know-today-final-sync.mjs <reel-ordner> <transcript-json>');
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
  'Warum weiß deine KI nicht automatisch, was heute passiert?',
  'Weil ihr Wissen meistens nicht live mit der Welt verbunden ist.',
  'Beim Training lernt sie Muster aus einem festen Datenstand.',
  'Dieser Stand ist eher ein eingefrorenes Archiv als ein Liveticker.',
  'Danach entstehen neue Updates, Preise und Ereignisse.',
  'Ohne Webzugriff sieht die KI diese Veränderungen nicht von selbst.',
  'Dann ergänzt sie Lücken mit älteren Mustern.',
  'So kann eine veraltete Aussage trotzdem überzeugend klingen.',
  'Mit Webzugriff kann sie aktuelle Quellen gezielt abrufen.',
  'Entscheidend ist, welche Seite sie findet und wie frisch sie ist.',
  'Frage bei aktuellen Themen nach Datum, Quelle und Veröffentlichungszeit.',
  'Öffne die Originalseite statt nur einer Zusammenfassung zu vertrauen.',
  'Vergleiche zwei seriöse Quellen, wenn die Entscheidung wichtig ist.',
  'Prüfe besonders Zahlen, Termine, Preise, Versionen und öffentliche Ämter.',
  'Ohne aktuelle Quelle ist Sicherheit nur Tonfall, kein Beweis.',
  'Für heutige Fakten gilt: suchen, Datum prüfen, Originalquelle öffnen.',
];

const normalize = (value) => String(value).toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9]/gi, '');
const transcriptTokens = words.map((word) => normalize(word.text));
let cursor = 0;
const sentences = [];

for (const [sentenceIndex, sentenceText] of sentenceTexts.entries()) {
  const visibleTokens = sentenceText.split(/\s+/).filter(Boolean);
  const alignedWords = [];

  for (const visibleText of visibleTokens) {
    const token = normalize(visibleText);
    let matchIndex = -1;
    for (let lookahead = cursor; lookahead < Math.min(words.length, cursor + 6); lookahead += 1) {
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
    const startFrame = Math.round(matched.start * fps);
    alignedWords.push({
      text: visibleText,
      startFrame,
      endFrame: Math.max(Math.round(matched.end * fps), startFrame + 1),
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

if (sentences.length !== 16) throw new Error(`Erwartet 16 Sätze, gefunden: ${sentences.length}.`);

const speechPairs = Array.from({length: 8}, (_, index) => ({
  id: `pair-${String(index + 1).padStart(2, '0')}`,
  sceneId: `scene-${String(index + 1).padStart(2, '0')}`,
  speechStartFrame: sentences[index * 2].startFrame,
  speechEndFrame: sentences[index * 2 + 1].endFrame,
  sentences: [sentences[index * 2], sentences[index * 2 + 1]],
}));

const speechStartSeconds = words[0].start;
const speechEndSeconds = words.at(-1).end;
const durationInFrames = Math.ceil((speechEndSeconds + 1.7) * fps);

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
    resultHoldFrames: Math.max(30, endFrame - pair.speechEndFrame),
    boundaryReferenceFrame: endFrame,
    boundaryOffsetFrames: 0,
  };
});

const captionPairs = speechPairs.map((pair, index) => ({
  id: pair.id,
  sceneId: pair.sceneId,
  startFrame: scenes[index].startFrame,
  endFrame: scenes[index].endFrame,
  bottomPx: 320,
  mode: 'single-sentence-active-word',
  sentences: pair.sentences,
}));

const triggerDefinitions = [
  ['s1-today', 'scene-01', 'heute'],
  ['s1-live-gap', 'scene-01', 'live'],
  ['s2-training', 'scene-02', 'Training'],
  ['s2-freeze', 'scene-02', 'Datenstand'],
  ['s3-updates', 'scene-03', 'Updates'],
  ['s3-blocked', 'scene-03', 'Webzugriff'],
  ['s4-gap', 'scene-04', 'Lücken'],
  ['s4-confident', 'scene-04', 'überzeugend'],
  ['s5-web', 'scene-05', 'Webzugriff'],
  ['s5-retrieve', 'scene-05', 'Quellen'],
  ['s5-fresh', 'scene-05', 'frisch'],
  ['s6-date', 'scene-06', 'Datum'],
  ['s6-original', 'scene-06', 'Originalseite'],
  ['s7-compare', 'scene-07', 'Vergleiche'],
  ['s7-check', 'scene-07', 'Prüfe'],
  ['s8-source', 'scene-08', 'Quelle'],
  ['s8-proof', 'scene-08', 'Beweis'],
  ['s8-original', 'scene-08', 'Originalquelle'],
];

const usedIndexes = new Set();
const beats = triggerDefinitions.map(([id, sceneId, token]) => {
  const scene = scenes.find((item) => item.id === sceneId);
  if (!scene) throw new Error(`Szene fehlt: ${sceneId}`);
  const candidate = words
    .map((word, index) => ({word, index}))
    .find(({word, index}) => {
      const frame = Math.round(word.start * fps);
      return normalize(word.text) === normalize(token)
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
    resultFrame: Math.max(
      transcriptStartFrame,
      Math.min(scene.endFrame - 1, transcriptEndFrame + Math.round(1.15 * fps)),
    ),
  };
});

const finalSync = {
  version: 4,
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

const target = resolve(config.reelRoot, 'timeline', 'final-sync.json');
writeFileSync(target, `${JSON.stringify(finalSync, null, 2)}\n`, 'utf8');
console.log(`✓ Finale Audio-Timeline erzeugt: ${target}`);
console.log(`Sprachbeginn: ${speechStartSeconds.toFixed(2)} s`);
console.log(`Sprachende: ${speechEndSeconds.toFixed(2)} s`);
console.log(`Composition: ${(durationInFrames / fps).toFixed(2)} s`);
