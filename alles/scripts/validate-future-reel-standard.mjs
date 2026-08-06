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
const relative = (file) => path.relative(projectRoot, file).replaceAll('\\', '/');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readText = (file) => fs.readFileSync(file, 'utf8');

const firstExisting = (candidates) => candidates.find(exists);
const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  console.error(`Reel-Ordner fehlt: ${projectRoot}`);
  process.exit(1);
}

const packageFile = firstExisting([
  path.join(projectRoot, 'timeline', 'codex-reel-package.json'),
  path.join(projectRoot, 'timeline', 'reel.json'),
]);

if (!packageFile) {
  addError('Timeline-Vertrag fehlt: timeline/codex-reel-package.json oder timeline/reel.json.');
}

let reel = null;
if (packageFile) {
  try {
    reel = readJson(packageFile);
  } catch (error) {
    addError(`Timeline-Vertrag ist kein gültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const scriptFile = firstExisting([
  path.join(projectRoot, '01-voice-script', 'script-fliesstext.txt'),
  path.join(projectRoot, '01-voice-script', 'voiceover.md'),
  path.join(projectRoot, '01-voice-script', 'script.md'),
]);

let wordCount = null;
if (!scriptFile) {
  addError('Finaler Voiceover-Fließtext fehlt in 01-voice-script/.');
} else {
  const scriptText = readText(scriptFile)
    .replace(/^#.*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\b(REPLACE_ME|TODO)\b/g, ' ');
  const words = scriptText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? [];
  wordCount = words.length;
  if (wordCount < 125 || wordCount > 145) {
    addError(`Voiceover hat ${wordCount} Wörter; erlaubt sind 125 bis 145.`);
  }
}

const beatFile = firstExisting([
  path.join(projectRoot, 'timeline', 'semantic-beats.json'),
  path.join(projectRoot, '03-szenen', 'semantic-beats.json'),
]);

let semanticBeatCount = null;
if (!beatFile) {
  addError('Semantische Beat-Map fehlt: timeline/semantic-beats.json oder 03-szenen/semantic-beats.json.');
} else {
  try {
    const beatDocument = readJson(beatFile);
    const sceneBeats = Array.isArray(beatDocument.scenes) ? beatDocument.scenes : [];
    semanticBeatCount = sceneBeats.reduce((sum, scene) => sum + (Array.isArray(scene.beats) ? scene.beats.length : 0), 0);
    if (sceneBeats.length < 8 || sceneBeats.length > 9) {
      addError(`Beat-Map enthält ${sceneBeats.length} Szenen; erlaubt sind 8 bis 9.`);
    }
    for (const scene of sceneBeats) {
      const beats = Array.isArray(scene.beats) ? scene.beats : [];
      if (beats.length < 1 || beats.length > 4) {
        addError(`${scene.id ?? 'Unbekannte Szene'} enthält ${beats.length} Bedeutungsbeats; erlaubt sind 1 bis 4.`);
      }
      for (const [index, beat] of beats.entries()) {
        for (const key of ['expression', 'visualReaction', 'transcriptTrigger', 'resultState']) {
          if (typeof beat?.[key] !== 'string' || beat[key].trim() === '' || beat[key] === 'REPLACE_ME') {
            addError(`${scene.id ?? 'Unbekannte Szene'} Beat ${index + 1}: ${key} fehlt.`);
          }
        }
      }
    }
  } catch (error) {
    addError(`Semantische Beat-Map ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let durationSeconds = null;
let sceneCount = null;

if (reel) {
  if (reel.standardId !== 'ki-animation-only-reel-v1') {
    addError(`standardId muss ki-animation-only-reel-v1 sein; gefunden: ${String(reel.standardId)}.`);
  }

  const composition = reel.composition ?? reel.format ?? {};
  const width = Number(composition.width);
  const height = Number(composition.height);
  const fps = Number(composition.fps);
  const durationInFrames = Number(composition.durationInFrames);

  if (width !== 1080 || height !== 1920 || fps !== 30) {
    addError(`Format muss 1080 × 1920 bei 30 FPS sein; gefunden: ${width} × ${height} bei ${fps} FPS.`);
  }

  if (Number.isFinite(durationInFrames) && Number.isFinite(fps) && fps > 0) {
    durationSeconds = durationInFrames / fps;
  } else if (Number.isFinite(Number(composition.targetDurationSeconds))) {
    durationSeconds = Number(composition.targetDurationSeconds);
  } else {
    addError('Composition-Dauer fehlt.');
  }

  if (durationSeconds !== null && (durationSeconds < 60 || durationSeconds > 70)) {
    addError(`Geplante Dauer beträgt ${durationSeconds.toFixed(2)} Sekunden; erlaubt sind 60 bis 70.`);
  }

  const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
  sceneCount = scenes.length;
  if (sceneCount < 8 || sceneCount > 9) {
    addError(`Timeline enthält ${sceneCount} Szenen; erlaubt sind 8 bis 9.`);
  }

  let previousEnd = 0;
  for (const [index, scene] of scenes.entries()) {
    if (scene.type === 'image' || scene.type === 'hybrid') {
      addError(`${scene.id ?? `Szene ${index + 1}`}: generierte oder hybride Szenenbilder sind für neue Reels nicht erlaubt.`);
    }
    const start = Number(scene.start ?? scene.startFrame);
    const end = Number(scene.end ?? scene.endFrameExclusive);
    if (Number.isFinite(start) && Number.isFinite(end)) {
      if (index === 0 && start !== 0) addError('Erste Szene muss bei Frame 0 beginnen.');
      if (index > 0 && start !== previousEnd) addError(`${scene.id ?? `Szene ${index + 1}`}: Szenengrenzen sind nicht lückenlos.`);
      const sceneSeconds = (end - start) / fps;
      if (sceneSeconds < 5.5) addError(`${scene.id ?? `Szene ${index + 1}`} ist mit ${sceneSeconds.toFixed(2)} Sekunden zu kurz.`);
      previousEnd = end;
    }
  }
  if (scenes.length > 0 && Number.isFinite(durationInFrames) && previousEnd !== durationInFrames) {
    addError('Letzte Szene endet nicht am Ende der Composition.');
  }

  const playbackRate = Number(reel.audio?.playbackRate ?? 1);
  if (playbackRate < 1 || playbackRate > 1.05) {
    addError(`playbackRate muss zwischen 1,00 und 1,05 liegen; gefunden: ${playbackRate}.`);
  }
  if (playbackRate > 1) {
    addWarning(`playbackRate ist ${playbackRate}; dafür ist eine dokumentierte Hörprobe und Nutzerfreigabe erforderlich.`);
  }
  if (reel.audio?.music !== false) addError('Musik muss deaktiviert sein.');
  if (!['off', false].includes(reel.audio?.soundMode ?? 'off')) addError('Soundeffekte müssen deaktiviert sein.');

  const requiredImages = reel.media?.requiredImageScenes;
  if (Array.isArray(requiredImages) && requiredImages.length > 0) {
    addError('requiredImageScenes muss für neue Reels leer sein.');
  }
  if (reel.media?.generatedSceneImagesAllowed === true) addError('generatedSceneImagesAllowed muss false sein.');
  if (reel.media?.stockSceneImagesAllowed === true) addError('stockSceneImagesAllowed muss false sein.');

  const maximumMotions = Number(reel.motion?.maximumStrongSimultaneousMotions ?? 2);
  if (maximumMotions > 2) addError('Maximal zwei starke gleichzeitige Bewegungen sind erlaubt.');
  const maximumBeats = Number(reel.motion?.maximumSemanticBeatsPerScene ?? 4);
  if (maximumBeats > 4) addError('Maximal vier Bedeutungsbeats pro Szene sind erlaubt.');
  const resultHold = Number(reel.motion?.minimumResultHoldSeconds ?? 1);
  if (resultHold < 1) addError('Der Ergebnis-Hold muss mindestens eine Sekunde betragen.');

  if (reel.captions?.rapidTwoToFourWordChunksAllowed === true) {
    addError('Hektische Zwei- bis Vier-Wort-Untertitelblöcke sind nicht erlaubt.');
  }
  if (Number(reel.captions?.maximumLines ?? 2) > 2) addError('Untertitel dürfen maximal zwei Zeilen besitzen.');
  if (Number(reel.captions?.minimumFontSizePx ?? 40) < 40) addError('Untertitel dürfen nicht kleiner als 40 px werden.');
}

const coverFile = firstExisting([
  path.join(projectRoot, '00-cover', 'cover.md'),
  path.join(projectRoot, '00-cover', 'cover.txt'),
]);
if (!coverFile) {
  addError('Cover-Vertrag fehlt in 00-cover/.');
} else {
  const cover = readText(coverFile);
  if (!/satz|titel|hook/i.test(cover)) addWarning('Cover-Datei nennt den exakten deutschen Satz nicht eindeutig.');
  if (!/motiv|bildprompt|visual/i.test(cover)) addWarning('Cover-Datei nennt kein eindeutiges Hauptmotiv.');
}

if (finalMode) {
  const audioFolder = path.join(projectRoot, '02-audio');
  const supportedAudio = new Set(['.wav', '.mp3', '.m4a', '.aac', '.ogg', '.mp4', '.mov', '.webm']);
  const audioFiles = fs.existsSync(audioFolder)
    ? fs.readdirSync(audioFolder).filter((name) => supportedAudio.has(path.extname(name).toLowerCase()))
    : [];
  if (audioFiles.length !== 1) {
    addError(`Im finalen Modus muss 02-audio/ genau eine unterstützte Mediendatei enthalten; gefunden: ${audioFiles.length}.`);
  }

  const transcriptFile = firstExisting([
    path.join(projectRoot, '04-caption', 'word-timings.json'),
    path.join(projectRoot, '04-caption', 'transcript.json'),
    path.join(projectRoot, 'timeline', 'word-timings.json'),
    path.join(projectRoot, 'timeline', 'final-transcript.json'),
  ]);
  if (!transcriptFile) addError('Finale Wortzeiten fehlen.');
}

const report = {
  version: 1,
  standardId: 'ki-animation-only-reel-v1',
  checkedAt: new Date().toISOString(),
  projectRoot: path.relative(technicalRoot, projectRoot),
  mode: finalMode ? 'final' : 'planning',
  inputs: {
    packageFile: packageFile ? relative(packageFile) : null,
    scriptFile: scriptFile ? relative(scriptFile) : null,
    semanticBeatFile: beatFile ? relative(beatFile) : null,
    coverFile: coverFile ? relative(coverFile) : null,
  },
  metrics: {wordCount, durationSeconds, sceneCount, semanticBeatCount},
  errors,
  warnings,
  passed: errors.length === 0,
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
console.log(`Bericht: ${path.relative(technicalRoot, reportFile)}`);
