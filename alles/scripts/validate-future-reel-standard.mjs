#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const finalMode = args.includes('--final');

if (!projectArg) {
  console.error('Nutzung: node scripts/validate-future-reel-standard.mjs <reel-ordner> [--final]');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const errors = [];
const warnings = [];

const exists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readText = (file) => fs.readFileSync(file, 'utf8');
const firstExisting = (files) => files.find(exists);
const relative = (file) => path.relative(projectRoot, file).replaceAll('\\', '/');
const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);
const finite = (value) => Number.isFinite(Number(value));
const number = (value) => Number(value);

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  console.error(`Reel-Ordner fehlt: ${projectRoot}`);
  process.exit(1);
}

const packageFile = firstExisting([
  path.join(projectRoot, 'timeline', 'codex-reel-package.json'),
  path.join(projectRoot, 'timeline', 'reel.json'),
]);

let reel = null;
if (!packageFile) {
  addError('Timeline-Vertrag fehlt.');
} else {
  try {
    reel = readJson(packageFile);
  } catch (error) {
    addError(`Timeline-Vertrag ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const scriptFile = firstExisting([
  path.join(projectRoot, '01-voice-script', 'script-fliesstext.txt'),
  path.join(projectRoot, '01-voice-script', 'voiceover.md'),
  path.join(projectRoot, '01-voice-script', 'script.md'),
]);

let wordCount = null;
if (!scriptFile) {
  addError('Finaler Voiceover-Fließtext fehlt.');
} else {
  const scriptText = readText(scriptFile)
    .replace(/^#.*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\b(REPLACE_ME|TODO)\b/g, ' ');
  const words = scriptText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? [];
  wordCount = words.length;
  if (wordCount < 125 || wordCount > 145) addError(`Voiceover hat ${wordCount} Wörter; erlaubt sind 125 bis 145.`);
}

const beatFile = firstExisting([
  path.join(projectRoot, 'timeline', 'semantic-beats.json'),
  path.join(projectRoot, '03-szenen', 'semantic-beats.json'),
]);

let beatDocument = null;
let semanticBeatCount = null;
if (!beatFile) {
  addError('Semantische Beat-Map fehlt.');
} else {
  try {
    beatDocument = readJson(beatFile);
    const sceneBeats = Array.isArray(beatDocument.scenes) ? beatDocument.scenes : [];
    semanticBeatCount = sceneBeats.reduce((sum, scene) => sum + (Array.isArray(scene.beats) ? scene.beats.length : 0), 0);
    if (sceneBeats.length < 8 || sceneBeats.length > 9) addError(`Beat-Map enthält ${sceneBeats.length} Szenen; erlaubt sind 8 bis 9.`);
    for (const scene of sceneBeats) {
      const beats = Array.isArray(scene.beats) ? scene.beats : [];
      const maximum = reel?.standardId === 'ki-animation-only-reel-v2' ? 3 : 4;
      if (beats.length < 1 || beats.length > maximum) addError(`${scene.id ?? 'Unbekannte Szene'} enthält ${beats.length} Beats; erlaubt sind 1 bis ${maximum}.`);
      for (const [index, beat] of beats.entries()) {
        for (const key of ['expression', 'visualReaction', 'transcriptTrigger', 'resultState']) {
          if (typeof beat?.[key] !== 'string' || beat[key].trim() === '' || beat[key] === 'REPLACE_ME') addError(`${scene.id ?? 'Unbekannte Szene'} Beat ${index + 1}: ${key} fehlt.`);
        }
      }
    }
  } catch (error) {
    addError(`Semantische Beat-Map ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let durationSeconds = null;
let sceneCount = null;
let fps = 30;
let packageDurationInFrames = null;

if (reel) {
  const isV2 = reel.standardId === 'ki-animation-only-reel-v2';
  const isHistoricalV1 = reel.standardId === 'ki-animation-only-reel-v1';
  if (!isV2 && !isHistoricalV1) addError(`Unbekannte standardId: ${String(reel.standardId)}.`);
  if (isHistoricalV1) addWarning('Historischer v1-Vertrag: nicht als Vorlage für neue Reels verwenden.');

  const composition = reel.composition ?? reel.format ?? {};
  const width = number(composition.width);
  const height = number(composition.height);
  fps = number(composition.fps);
  packageDurationInFrames = number(composition.durationInFrames);

  if (width !== 1080 || height !== 1920 || fps !== 30) addError(`Format muss 1080 × 1920 bei 30 FPS sein; gefunden: ${width} × ${height} bei ${fps} FPS.`);

  if (finite(packageDurationInFrames) && fps > 0) durationSeconds = packageDurationInFrames / fps;
  else if (finite(composition.targetDurationSeconds)) durationSeconds = number(composition.targetDurationSeconds);
  else addError('Composition-Dauer fehlt.');

  const minimumDuration = isV2 ? 58 : 60;
  if (durationSeconds !== null && (durationSeconds < minimumDuration || durationSeconds > 70)) addError(`Geplante Dauer beträgt ${durationSeconds.toFixed(2)} Sekunden; erlaubt sind ${minimumDuration} bis 70.`);

  const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
  sceneCount = scenes.length;
  if (sceneCount < 8 || sceneCount > 9) addError(`Timeline enthält ${sceneCount} Szenen; erlaubt sind 8 bis 9.`);

  let previousEnd = 0;
  for (const [index, scene] of scenes.entries()) {
    if (scene.type === 'image' || scene.type === 'hybrid') addError(`${scene.id ?? `Szene ${index + 1}`}: Szenenbilder sind nicht erlaubt.`);
    const start = number(scene.start ?? scene.startFrame);
    const end = number(scene.end ?? scene.endFrameExclusive);
    if (finite(start) && finite(end)) {
      if (index === 0 && start !== 0) addError('Erste Szene muss bei Frame 0 beginnen.');
      if (index > 0 && start !== previousEnd) addError(`${scene.id ?? `Szene ${index + 1}`}: Szenengrenzen sind nicht lückenlos.`);
      if (end <= start) addError(`${scene.id ?? `Szene ${index + 1}`}: ungültige Dauer.`);
      previousEnd = end;
    }
  }
  if (scenes.length > 0 && finite(packageDurationInFrames) && previousEnd !== packageDurationInFrames) addError('Letzte Szene endet nicht am Ende der Composition.');

  const playbackRate = number(reel.audio?.playbackRate ?? 1);
  if (playbackRate < 1 || playbackRate > 1.05) addError(`playbackRate muss zwischen 1,00 und 1,05 liegen; gefunden: ${playbackRate}.`);
  if (playbackRate > 1) addWarning(`playbackRate ist ${playbackRate}; dokumentierte Hörprobe und Nutzerfreigabe erforderlich.`);
  if (reel.audio?.music !== false) addError('Musik muss deaktiviert sein.');
  if (!['off', false].includes(reel.audio?.soundMode ?? 'off')) addError('Soundeffekte müssen deaktiviert sein.');

  if (Array.isArray(reel.media?.requiredImageScenes) && reel.media.requiredImageScenes.length > 0) addError('requiredImageScenes muss leer sein.');
  if (reel.media?.generatedSceneImagesAllowed === true) addError('generatedSceneImagesAllowed muss false sein.');
  if (reel.media?.stockSceneImagesAllowed === true) addError('stockSceneImagesAllowed muss false sein.');

  const maximumMotions = number(reel.motion?.maximumStrongSimultaneousMotions ?? 2);
  if (maximumMotions > 2) addError('Maximal zwei starke gleichzeitige Bewegungen sind erlaubt.');
  const maximumBeats = number(reel.motion?.maximumSemanticBeatsPerScene ?? (isV2 ? 3 : 4));
  if (maximumBeats > (isV2 ? 3 : 4)) addError(`Maximal ${isV2 ? 3 : 4} Bedeutungsbeats pro Szene sind erlaubt.`);
  if (number(reel.motion?.minimumResultHoldSeconds ?? 1) < 1) addError('Ergebnis-Hold muss mindestens eine Sekunde betragen.');

  if (isV2) {
    if (number(reel.visual?.primaryObjectsPerScene ?? 1) > 1) addError('Neue Reels erlauben nur ein Hauptobjekt pro Szene.');
    if (number(reel.visual?.maximumSupportingElementsPerScene ?? 2) > 2) addError('Maximal zwei unterstützende Elemente pro Szene sind erlaubt.');
    if (reel.visual?.miniDashboardsAllowed === true) addError('Mini-Dashboards sind nicht erlaubt.');
    if (reel.captions?.mode !== 'instant-full-sentence-with-violet-progress-line') addError('Caption-Modus muss instant-full-sentence-with-violet-progress-line sein.');
    if (reel.captions?.wordByWordRevealAllowed !== false) addError('Wort-für-Wort-Reveal muss deaktiviert sein.');
    if (reel.captions?.wordHighlightAllowed !== false) addError('Einzelne Wortmarkierung muss deaktiviert sein.');
    if (number(reel.captions?.bottomPx ?? 220) < 210 || number(reel.captions?.bottomPx ?? 220) > 235) addError('Untertitel-Unterkante muss zwischen 210 und 235 px liegen.');
    if (number(reel.captions?.minimumFontSizePx ?? 42) < 42) addError('Untertitel dürfen nicht kleiner als 42 px werden.');
  } else {
    if (reel.captions?.rapidTwoToFourWordChunksAllowed === true) addError('Hektische Untertitelblöcke sind nicht erlaubt.');
  }
}

const coverFile = firstExisting([
  path.join(projectRoot, '00-cover', 'cover.md'),
  path.join(projectRoot, '00-cover', 'cover.txt'),
]);
if (!coverFile) addError('Cover-Vertrag fehlt.');

let finalSyncFile = null;
let finalSync = null;

if (finalMode) {
  const audioFolder = path.join(projectRoot, '02-audio');
  const supportedAudio = new Set(['.wav', '.mp3', '.m4a', '.aac', '.ogg', '.mp4', '.mov', '.webm']);
  const audioFiles = fs.existsSync(audioFolder)
    ? fs.readdirSync(audioFolder).filter((name) => supportedAudio.has(path.extname(name).toLowerCase()) && fs.statSync(path.join(audioFolder, name)).size > 0)
    : [];
  if (audioFiles.length !== 1) addError(`Finaler Modus benötigt genau eine nicht leere Mediendatei; gefunden: ${audioFiles.length}.`);

  if (reel?.standardId === 'ki-animation-only-reel-v2') {
    finalSyncFile = path.join(projectRoot, 'timeline', 'final-sync.json');
    if (!exists(finalSyncFile)) {
      addError('timeline/final-sync.json fehlt.');
    } else {
      try {
        finalSync = readJson(finalSyncFile);
      } catch (error) {
        addError(`final-sync.json ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } else {
    const transcriptFile = firstExisting([
      path.join(projectRoot, '04-caption', 'word-timings.json'),
      path.join(projectRoot, '04-caption', 'transcript.json'),
      path.join(projectRoot, 'timeline', 'word-timings.json'),
      path.join(projectRoot, 'timeline', 'final-transcript.json'),
    ]);
    if (!transcriptFile) addError('Finale Wortzeiten fehlen.');
  }
}

let maximumTriggerOffsetFrames = null;
let maximumBoundaryOffsetFrames = null;
let outroHoldSeconds = null;

if (finalMode && finalSync && reel?.standardId === 'ki-animation-only-reel-v2') {
  if (finalSync.status !== 'final-transcript-aligned') addError('final-sync status muss final-transcript-aligned sein.');
  if (number(finalSync.fps) !== 30) addError('final-sync fps muss 30 sein.');

  const audio = finalSync.audio ?? {};
  const speechStart = number(audio.speechStartSeconds);
  const speechEnd = number(audio.speechEndSeconds);
  const audioDuration = number(audio.durationSeconds);
  const syncDurationFrames = number(finalSync.composition?.durationInFrames);

  if (![speechStart, speechEnd, audioDuration, syncDurationFrames].every(Number.isFinite)) addError('Audio- oder Composition-Werte in final-sync fehlen.');
  if (speechStart > 0.6) addError(`Sprachbeginn liegt bei ${speechStart.toFixed(2)} s; maximal 0,60 s erlaubt.`);
  if (speechStart < 0 || speechEnd <= speechStart || audioDuration < speechEnd) addError('Audio-Zeitwerte sind nicht logisch.');

  if (Number.isFinite(syncDurationFrames) && Number.isFinite(speechEnd)) {
    outroHoldSeconds = syncDurationFrames / 30 - speechEnd;
    if (outroHoldSeconds < 1.2 || outroHoldSeconds > 2.2) addError(`Schluss-Hold beträgt ${outroHoldSeconds.toFixed(2)} s; erlaubt sind 1,20 bis 2,20 s.`);
  }
  if (finite(packageDurationInFrames) && syncDurationFrames !== packageDurationInFrames) addError('Package-Dauer und final-sync-Dauer stimmen nicht überein.');

  const syncScenes = Array.isArray(finalSync.scenes) ? finalSync.scenes : [];
  if (syncScenes.length !== sceneCount) addError(`final-sync enthält ${syncScenes.length} Szenen; erwartet: ${sceneCount}.`);
  let cursor = 0;
  let boundaryMax = 0;
  for (const [index, scene] of syncScenes.entries()) {
    const start = number(scene.startFrame);
    const end = number(scene.endFrame);
    if (start !== cursor) addError(`${scene.id ?? `Szene ${index + 1}`}: final-sync ist nicht lückenlos.`);
    if (end <= start) addError(`${scene.id ?? `Szene ${index + 1}`}: ungültige finale Szenendauer.`);
    if (number(scene.resultHoldFrames) < 30) addError(`${scene.id ?? `Szene ${index + 1}`}: Ergebnis-Hold unter 30 Frames.`);
    if (index < syncScenes.length - 1) {
      if (!finite(scene.boundaryReferenceFrame)) addError(`${scene.id ?? `Szene ${index + 1}`}: boundaryReferenceFrame fehlt.`);
      else boundaryMax = Math.max(boundaryMax, Math.abs(end - number(scene.boundaryReferenceFrame)));
    }
    cursor = end;
  }
  if (cursor !== syncDurationFrames) addError('Letzte finale Szene endet nicht am Composition-Ende.');
  maximumBoundaryOffsetFrames = boundaryMax;
  if (boundaryMax > 6) addError(`Größte Szenengrenzen-Abweichung beträgt ${boundaryMax} Frames; maximal 6 erlaubt.`);

  const captions = Array.isArray(finalSync.captions) ? finalSync.captions : [];
  if (captions.length === 0) addError('final-sync enthält keine Untertitel.');
  let firstCaptionStart = Infinity;
  for (const caption of captions) {
    const start = number(caption.startFrame);
    const end = number(caption.endFrame);
    firstCaptionStart = Math.min(firstCaptionStart, start);
    if (!caption.text || typeof caption.text !== 'string') addError(`${caption.id ?? 'Untertitel'}: Text fehlt.`);
    if (end <= start) addError(`${caption.id ?? 'Untertitel'}: ungültige Dauer.`);
    if (caption.revealMode !== 'instant') addError(`${caption.id ?? 'Untertitel'}: revealMode muss instant sein.`);
    if (caption.wordHighlight !== false) addError(`${caption.id ?? 'Untertitel'}: wordHighlight muss false sein.`);
    if (caption.progressIndicator !== 'single-violet-line') addError(`${caption.id ?? 'Untertitel'}: genau eine violette Linie ist erforderlich.`);
    if (number(caption.bottomPx) < 210 || number(caption.bottomPx) > 235) addError(`${caption.id ?? 'Untertitel'}: bottomPx muss 210 bis 235 sein.`);
    if (number(caption.lineCount) < 1 || number(caption.lineCount) > 2) addError(`${caption.id ?? 'Untertitel'}: maximal zwei Zeilen erlaubt.`);
  }
  const speechStartFrame = Math.round(speechStart * 30);
  if (firstCaptionStart > speechStartFrame + 3) addError(`Erster Untertitel erscheint ${firstCaptionStart - speechStartFrame} Frames nach Sprachbeginn; maximal 3 erlaubt.`);

  const beats = Array.isArray(finalSync.beats) ? finalSync.beats : [];
  if (beats.length === 0) addError('final-sync enthält keine semantischen Beats.');
  let triggerMax = 0;
  const beatsPerScene = new Map();
  for (const beat of beats) {
    const transcriptFrame = number(beat.transcriptStartFrame);
    const animationFrame = number(beat.animationStartFrame);
    if (!Number.isFinite(transcriptFrame) || !Number.isFinite(animationFrame)) addError(`${beat.sceneId ?? 'Beat'}: Trigger-Frames fehlen.`);
    else triggerMax = Math.max(triggerMax, Math.abs(animationFrame - transcriptFrame));
    beatsPerScene.set(beat.sceneId, (beatsPerScene.get(beat.sceneId) ?? 0) + 1);
  }
  for (const [sceneId, count] of beatsPerScene.entries()) if (count < 1 || count > 3) addError(`${sceneId}: ${count} finale Beats; erlaubt sind 1 bis 3.`);
  maximumTriggerOffsetFrames = triggerMax;
  if (triggerMax > 5) addError(`Größte Trigger-Abweichung beträgt ${triggerMax} Frames; maximal 5 erlaubt.`);

  if (finalSync.timingSource !== 'final-voiceover-transcript') addError('timingSource muss final-voiceover-transcript sein.');
  if (finalSync.fallbackTimingActive !== false) addError('fallbackTimingActive muss false sein.');
}

const report = {
  version: 2,
  standardId: reel?.standardId ?? null,
  checkedAt: new Date().toISOString(),
  projectRoot: path.relative(technicalRoot, projectRoot),
  mode: finalMode ? 'final' : 'planning',
  inputs: {
    packageFile: packageFile ? relative(packageFile) : null,
    scriptFile: scriptFile ? relative(scriptFile) : null,
    semanticBeatFile: beatFile ? relative(beatFile) : null,
    coverFile: coverFile ? relative(coverFile) : null,
    finalSyncFile: finalSyncFile && exists(finalSyncFile) ? relative(finalSyncFile) : null
  },
  metrics: {
    wordCount,
    durationSeconds,
    sceneCount,
    semanticBeatCount,
    maximumTriggerOffsetFrames,
    maximumBoundaryOffsetFrames,
    outroHoldSeconds
  },
  errors,
  warnings,
  passed: errors.length === 0
};

const reviewRoot = path.join(projectRoot, '05-review');
fs.mkdirSync(reviewRoot, {recursive: true});
const reportFile = path.join(reviewRoot, 'future-standard-report.json');
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);

for (const warning of warnings) console.warn(`WARNUNG: ${warning}`);
for (const error of errors) console.error(`FEHLER: ${error}`);

if (!report.passed) {
  console.error(`Zukunftsstandard nicht bestanden: ${errors.length} Fehler, ${warnings.length} Warnungen.`);
  process.exit(1);
}

console.log(`Zukunftsstandard bestanden: ${wordCount} Wörter, ${durationSeconds?.toFixed(2)} Sekunden, ${sceneCount} Szenen.`);
if (finalMode && reel?.standardId === 'ki-animation-only-reel-v2') {
  console.log(`Sync: Trigger max ${maximumTriggerOffsetFrames} Frames, Grenzen max ${maximumBoundaryOffsetFrames} Frames, Schluss-Hold ${outroHoldSeconds?.toFixed(2)} s.`);
}
console.log(`Bericht: ${path.relative(technicalRoot, reportFile)}`);
