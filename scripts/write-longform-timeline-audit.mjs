#!/usr/bin/env node
import process from 'node:process';
import {
  CHOREOGRAPHY_STATUS,
  clock,
  nonEmptyFile,
  packagePath,
  posix,
  readJson,
  requirePackage,
} from './lib/longform-sync.mjs';
import {writeFile} from 'node:fs/promises';

const fail = (message) => { console.error(`LONGFORM TIMELINE AUDIT FAILED: ${message}`); process.exit(1); };
let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { fail(error.message); }
const resolvedPath = packagePath(root, '06-projektdateien', 'CHOREOGRAPHY-RESOLVED.json');
const chaptersPath = packagePath(root, '01-script-audio', 'CHAPTERS.json');
const cuesPath = packagePath(root, '01-script-audio', 'SPEECH-CUES.json');
for (const file of [resolvedPath, chaptersPath, cuesPath]) if (!nonEmptyFile(file)) fail(`required file missing/empty: ${posix(file)}`);
const [resolved, chaptersDoc, cuesDoc] = await Promise.all([readJson(resolvedPath), readJson(chaptersPath), readJson(cuesPath)]);
if (resolved?.status !== CHOREOGRAPHY_STATUS) fail(`CHOREOGRAPHY-RESOLVED.status must be ${CHOREOGRAPHY_STATUS}.`);
const fps = Number(resolved.fps);
const chapters = Array.isArray(chaptersDoc?.chapters) ? chaptersDoc.chapters : [];
const beats = Array.isArray(resolved?.beats) ? resolved.beats : [];
const cues = Array.isArray(cuesDoc?.cues) ? cuesDoc.cues : [];
const esc = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const lines = [];
lines.push('# Longform Timeline Audit', '');
lines.push('**Authority:** `06-projektdateien/CHOREOGRAPHY-RESOLVED.json`  ');
lines.push(`**FPS:** ${fps}  `);
lines.push(`**Final duration:** ${clock(resolved.finalDurationInFrames, fps)} (${resolved.finalDurationInFrames}f)  `);
lines.push('**Rule:** No final visual timing may be guessed from percentages or unbounded one-frame triggers. Every planned beat has a spoken interval and an explicit visual ENTER/HOLD/EXIT interval.', '');

lines.push('## 1. Kapitel', '');
lines.push('| Kapitel | Von | Bis | Frames | Sprachbereich |');
lines.push('|---|---:|---:|---:|---:|');
for (const chapter of chapters) {
  lines.push(`| ${esc(chapter.id)} — ${esc(chapter.title)} | ${clock(chapter.startFrame, fps)} | ${clock(chapter.endFrame, fps)} | ${chapter.startFrame}–${chapter.endFrame} | ${clock(chapter.speechStartFrame ?? chapter.startFrame, fps)}–${clock(chapter.speechEndFrame ?? chapter.endFrame, fps)} |`);
}
lines.push('');

lines.push('## 2. Stimme ↔ Visual-Choreografie', '');
lines.push('| Beat | Kapitel | Gesprochen von–bis | Gesprochener Ausschnitt | ENTER | HOLD | EXIT | Visual-Ziel | Typ |');
lines.push('|---|---|---:|---|---:|---:|---:|---|---|');
for (const beat of beats) {
  lines.push(`| ${esc(beat.id)} | ${esc(beat.chapterId)} | ${clock(beat.speech.startFrame, fps)}–${clock(beat.speech.endFrame, fps)} | ${esc(beat.spokenText)} | ${clock(beat.visual.startFrame, fps)}–${clock(beat.visual.enterEndFrame, fps)} | ${clock(beat.visual.holdStartFrame, fps)}–${clock(beat.visual.holdEndFrame, fps)} | ${clock(beat.visual.exitStartFrame, fps)}–${clock(beat.visual.endFrame, fps)} | ${esc(beat.target)} | ${esc(beat.kind)} |`);
}
lines.push('');

lines.push('## 3. YouTube-Untertitel aus denselben Worttimings', '');
lines.push('| Cue | Kapitel | Von | Bis | Text |');
lines.push('|---|---|---:|---:|---|');
for (const cue of cues) {
  lines.push(`| ${esc(cue.id)} | ${esc(cue.chapterId)} | ${clock(cue.startFrame, fps)} | ${clock(cue.endFrame, fps)} | ${esc(cue.text)} |`);
}
lines.push('');

const sfx = beats.filter((beat) => beat.sfx);
lines.push('## 4. SFX', '');
if (!sfx.length) lines.push('Keine SFX-Beats geplant.', '');
else {
  lines.push('| SFX | Beat | Kapitel | Exakte Zeit | Frame | Datei | Gain |');
  lines.push('|---|---|---|---:|---:|---|---:|');
  for (const beat of sfx) {
    lines.push(`| ${esc(beat.sfx.id)} | ${esc(beat.id)} | ${esc(beat.chapterId)} | ${clock(beat.sfx.frame, fps)} | ${beat.sfx.frame} | ${esc(beat.sfx.file || '')} | ${beat.sfx.gain} |`);
  }
  lines.push('');
}

lines.push('## 5. Produktionsregeln', '');
lines.push('- Das echte Nutzer-Voiceover ist die Zeit-Autorität.');
lines.push('- `WORD-TIMINGS.json` muss durch Known-Transcript Forced Alignment erzeugt sein.');
lines.push('- `ALIGNMENT-QUALITY.json` muss einen unabhängigen zweiten Aligner bestätigen.');
lines.push('- Visuals dürfen lange HOLD-Phasen haben; Longform soll nicht wie ein Reel dauerhaft hektisch animieren.');
lines.push('- Wechsel, B-Roll, UI, Diagramme und SFX werden an semantische Sprachphrasen gebunden, nicht an Prozentwerte der Videodauer.');
lines.push('- Wenn eine Phrase, ein Zeitfenster oder ein SFX-Anker nicht eindeutig auflösbar ist, muss die Pipeline blockieren statt zu raten.');
lines.push('- Änderungen an Voiceover, `VOICEOVER.txt`, `CHAPTER-VOICE-MAP.json` oder `CHOREOGRAPHY-PLAN.json` erfordern erneuten Sync.', '');

const out = packagePath(root, '06-projektdateien', 'TIMELINE-AUDIT.md');
await writeFile(out, `${lines.join('\n')}\n`, 'utf8');
console.log('LONGFORM TIMELINE AUDIT WRITTEN');
console.log(posix(out));
