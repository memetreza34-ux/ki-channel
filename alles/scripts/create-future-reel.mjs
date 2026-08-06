#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const [week, day, slug] = positional;

const option = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
};

const title = option('title', 'REPLACE_ME');
const hook = option('hook', 'REPLACE_ME');
const sceneCount = Number(option('scenes', '8'));
const targetSeconds = Number(option('seconds', '65'));

if (!week || !day || !slug) {
  console.error('Nutzung: node scripts/create-future-reel.mjs <woche> <wochentag> <slug> --title "..." --hook "..." [--scenes 8|9] [--seconds 60-70]');
  process.exit(1);
}

const safeSegment = /^[a-zA-Z0-9._-]+$/;
for (const [label, value] of [['Woche', week], ['Wochentag', day], ['Slug', slug]]) {
  if (!safeSegment.test(value) || value.includes('..')) {
    throw new Error(`${label} enthält unsichere Zeichen: ${value}`);
  }
}
if (![8, 9].includes(sceneCount)) throw new Error('--scenes muss 8 oder 9 sein.');
if (!Number.isFinite(targetSeconds) || targetSeconds < 60 || targetSeconds > 70) {
  throw new Error('--seconds muss zwischen 60 und 70 liegen.');
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(technicalRoot, '..', 'reels', week, day, slug);
if (fs.existsSync(projectRoot)) throw new Error(`Reel-Ordner existiert bereits: ${projectRoot}`);

const fps = 30;
const durationInFrames = Math.round(targetSeconds * fps);
const baseDuration = Math.floor(durationInFrames / sceneCount);
const remainder = durationInFrames % sceneCount;
const scenes = [];
let cursor = 0;

for (let index = 0; index < sceneCount; index += 1) {
  const duration = baseDuration + (index < remainder ? 1 : 0);
  const start = cursor;
  const end = start + duration;
  scenes.push({
    id: `scene-${String(index + 1).padStart(2, '0')}`,
    type: 'remotion',
    start,
    end,
    purpose: 'REPLACE_ME',
    animationId: `REPLACE_ME_${index + 1}`,
    layout: `REPLACE_ME_${index + 1}`,
    motion: `REPLACE_ME_${index + 1}`,
    minimumResultHoldSeconds: 1,
  });
  cursor = end;
}

const checkpoints = [...new Set(scenes.flatMap((scene) => {
  const duration = scene.end - scene.start;
  return [
    scene.start,
    scene.start + Math.round(duration * 0.33),
    scene.start + Math.round(duration * 0.66),
    scene.end - 1,
  ];
}))].sort((a, b) => a - b);

const mkdir = (relative) => fs.mkdirSync(path.join(projectRoot, relative), {recursive: true});
const write = (relative, content) => {
  const target = path.join(projectRoot, relative);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
};

for (const folder of [
  '00-cover',
  '01-voice-script',
  '02-audio',
  '03-szenen/EINZELNE-SZENEN',
  '04-caption',
  '05-review',
  '06-video',
  'render',
  'timeline',
]) mkdir(folder);

for (const scene of scenes) {
  mkdir(`03-szenen/EINZELNE-SZENEN/${scene.id}`);
  write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `# ${scene.id}\n\n- Voiceover: REPLACE_ME\n- Hauptgedanke: REPLACE_ME\n- Startzustand: REPLACE_ME\n- dominante Hauptanimation: REPLACE_ME\n- Ergebniszustand: REPLACE_ME\n- Transcript-Auslöser: REPLACE_ME\n- Ergebnis-Hold: mindestens 1 Sekunde\n`);
}

write('README.md', `# ${title}\n\nNeues Animation-only-Reel nach \`ki-animation-only-reel-v1\`.\n\n- Dauerziel: ${targetSeconds} Sekunden\n- Szenen: ${sceneCount}\n- Voiceover: 125 bis 145 Wörter\n- Reel: 100 Prozent Remotion\n- Cover: ein statisches Bild mit einem Satz\n- Audio: 1,00x\n`);

write('AGENTS.md', `# Reel-lokale Regeln\n\nVor jeder Arbeit lesen:\n\n1. Root-\`AGENTS.md\`\n2. \`alles/AGENTS.md\`\n3. \`alles/ki/reel-brain/PRODUCTION-BRAIN.md\`\n4. \`alles/ki/reel-brain/FUTURE-REEL-STANDARD.md\`\n5. \`alles/ki/reel-brain/VALIDATION.md\`\n\nVoiceover und Storyboard nicht ohne Nutzerfreigabe umschreiben. Keine generierten Szenenbilder, Musik oder SFX ergänzen. Nicht mergen.\n`);

write('00-cover/cover.md', `# Cover\n\n## Exakter Satz\n\n${hook}\n\n## Hauptmotiv\n\nREPLACE_ME\n\n## Bildprompt für das Motiv\n\nREPLACE_ME\n\n## Regeln\n\n- genau eine statische Bilddatei\n- genau ein Hauptmotiv\n- genau ein deutscher Satz\n- keine weiteren Labels\n- Satz deterministisch setzen\n`);

write('01-voice-script/script-fliesstext.txt', `${hook}\n\nREPLACE_ME`);
write('01-voice-script/script.md', `# Voiceover nach Szenen\n\n${scenes.map((scene) => `## ${scene.id}\n\nREPLACE_ME`).join('\n\n')}\n`);
write('01-voice-script/voiceover-anweisung.txt', `Deutsch. Natürlich, ruhig und klar. Quellgeschwindigkeit 1,00x. Keine künstliche Beschleunigung. Keine Musik und keine Soundeffekte.`);
write('02-audio/README.md', `Lege hier genau eine finale Audio- oder Mediendatei ab. Erlaubt: WAV, MP3, M4A, AAC, OGG, MP4, MOV oder WEBM. Die Stimme wird bei 1,00x erzeugt.`);

write('03-szenen/README.md', `# Szenen\n\n${sceneCount} vollständig programmierte Remotion-Szenen. Keine generierten Szenenbilder. Jede Szene besitzt eine dominante Erklärung, maximal zwei starke Bewegungen und mindestens eine Sekunde Ergebnis-Hold.`);
write('03-szenen/semantic-beats.json', `${JSON.stringify({
  version: 1,
  timingStatus: 'estimated-until-final-transcript',
  scenes: scenes.map((scene) => ({
    id: scene.id,
    beats: [{
      expression: 'REPLACE_ME',
      visualReaction: 'REPLACE_ME',
      transcriptTrigger: 'REPLACE_ME',
      resultState: 'REPLACE_ME',
      importance: 'primary',
    }],
  })),
  rules: {
    importantMeaningWithoutVisualReactionAllowed: false,
    fillerWordsReceiveStrongAnimation: false,
    maximumBeatsPerScene: 4,
    finalTimingSource: 'real-word-transcript',
  },
}, null, 2)}\n`);

write('04-caption/README.md', `Normale Satzuntertitel, maximal zwei Zeilen, ungefähr 50 px und mindestens 40 px. Weiß mit dunkler Kontur oder starkem Schatten. Keine hektischen Zwei- bis Vier-Wort-Blöcke. Finale Zeitpunkte kommen aus dem echten Wort-Transcript.`);

write('05-review/review-checklist.md', `# Review\n\n- [ ] 125 bis 145 Wörter\n- [ ] 60 bis 70 Sekunden\n- [ ] ${sceneCount} klare Szenen\n- [ ] keine generierten Szenenbilder\n- [ ] alle wichtigen Bedeutungen visuell abgedeckt\n- [ ] maximal zwei starke Bewegungen gleichzeitig\n- [ ] mindestens eine Sekunde Ergebnis-Hold pro Szene\n- [ ] echte Wortzeiten eingebaut\n- [ ] TypeScript bestanden\n- [ ] fokussierte Tests bestanden\n- [ ] Checkpoints geprüft\n- [ ] Kontaktbogen geprüft\n- [ ] Cover geprüft\n- [ ] MP4 vollständig in normaler Geschwindigkeit angesehen\n- [ ] Smartphone-Lesbarkeit bestätigt\n- [ ] technische Artefaktprüfung bestanden\n- [ ] Nutzerfreigabe vorhanden\n`);

write('05-review/production-status.json', `${JSON.stringify({
  version: 1,
  standardId: 'ki-animation-only-reel-v1',
  stage: 'planning',
  scriptApproved: false,
  remotionPrebuilt: false,
  audioReceived: false,
  transcriptAligned: false,
  typecheckPassed: false,
  testsPassed: false,
  renderCompleted: false,
  visuallyReviewed: false,
  approved: false,
}, null, 2)}\n`);

write('06-video/.gitkeep', '');
write('render/.gitkeep', '');

write('timeline/codex-reel-package.json', `${JSON.stringify({
  version: 3,
  standardId: 'ki-animation-only-reel-v1',
  slug,
  title,
  composition: {
    id: 'REPLACE_ME',
    width: 1080,
    height: 1920,
    fps,
    targetDurationSeconds: targetSeconds,
    durationInFrames,
  },
  editorial: {
    targetWordsMin: 125,
    targetWordsMax: 145,
    targetScenesMin: 8,
    targetScenesMax: 9,
  },
  audio: {
    sourceFolder: '02-audio',
    playbackRate: 1,
    maximumPlaybackRateWithoutExplicitApproval: 1.05,
    preservePitch: true,
    soundMode: 'off',
    music: false,
  },
  media: {
    generatedSceneImagesAllowed: false,
    stockSceneImagesAllowed: false,
    requiredImageScenes: [],
    coverAssetCount: 1,
  },
  captions: {
    mode: 'sentence-based-transcript-aligned',
    maximumLines: 2,
    defaultFontSizePx: 50,
    minimumFontSizePx: 40,
    rapidTwoToFourWordChunksAllowed: false,
  },
  motion: {
    dominantMotionsPerScene: 1,
    maximumStrongSimultaneousMotions: 2,
    maximumSemanticBeatsPerScene: 4,
    minimumResultHoldSeconds: 1,
    hardCutsDefault: true,
  },
  scenes,
  checkpoints,
}, null, 2)}\n`);

write('timeline/storyboard.md', `# Storyboard\n\n${scenes.map((scene) => `## ${scene.id}\n\n- Frames: ${scene.start}–${scene.end - 1}\n- Aussage: REPLACE_ME\n- visuelle Erklärung: REPLACE_ME\n- Ergebnis: REPLACE_ME`).join('\n\n')}\n`);
write('timeline/motion-design.md', `# Motion-Design\n\n- eine dominante Hauptanimation pro Szene\n- maximal zwei starke Bewegungen gleichzeitig\n- maximal vier Bedeutungsbeats pro Szene\n- mindestens eine Sekunde Ergebnis-Hold\n- Hard Cut als Standard\n- keine generierten Szenenbilder\n- keine dekorative Dauerbewegung\n- alle wichtigen Aktionen am echten Transcript ausrichten\n`);

console.log(`Neues Reel angelegt: ${path.relative(technicalRoot, projectRoot)}`);
console.log(`Szenen: ${sceneCount}`);
console.log(`Dauerziel: ${targetSeconds} Sekunden (${durationInFrames} Frames)`);
console.log('Nächster Schritt: Script, Szenen und semantische Beats ausfüllen und den Zukunftsstandard prüfen.');
