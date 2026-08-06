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
const targetSeconds = Number(option('seconds', '64'));
const implementationSourceDir = option('source-dir', `ki/src/reels/${slug ?? 'REPLACE_ME'}`);

if (!week || !day || !slug) {
  console.error('Nutzung: node scripts/create-future-reel.mjs <woche> <wochentag> <slug> --title "..." --hook "..." [--scenes 8|9] [--seconds 58-70] [--source-dir ki/src/reels/...]');
  process.exit(1);
}

const safeSegment = /^[a-zA-Z0-9._-]+$/;
for (const [label, value] of [['Woche', week], ['Wochentag', day], ['Slug', slug]]) {
  if (!safeSegment.test(value) || value.includes('..')) throw new Error(`${label} enthält unsichere Zeichen: ${value}`);
}
if (![8, 9].includes(sceneCount)) throw new Error('--scenes muss 8 oder 9 sein.');
if (!Number.isFinite(targetSeconds) || targetSeconds < 58 || targetSeconds > 70) throw new Error('--seconds muss zwischen 58 und 70 liegen.');

const technicalRoot = process.cwd();
const projectRoot = path.resolve(technicalRoot, '..', 'reels', week, day, slug);
if (fs.existsSync(projectRoot)) throw new Error(`Reel-Ordner existiert bereits: ${projectRoot}`);

const fps = 30;
const placeholderDurationInFrames = Math.round(targetSeconds * fps);
const baseDuration = Math.floor(placeholderDurationInFrames / sceneCount);
const remainder = placeholderDurationInFrames % sceneCount;
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
    timingStatus: 'placeholder-until-final-audio',
    purpose: 'REPLACE_ME',
    primaryObject: 'REPLACE_ME',
    dominantMotion: 'REPLACE_ME',
    resultState: 'REPLACE_ME',
    maximumSupportingElements: 2,
    minimumResultHoldSeconds: 1
  });
  cursor = end;
}

const placeholderCheckpoints = [...new Set(scenes.flatMap((scene) => {
  const duration = scene.end - scene.start;
  return [scene.start, scene.start + Math.round(duration * 0.5), scene.end - 1];
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
  'timeline'
]) mkdir(folder);

for (const scene of scenes) {
  write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `# ${scene.id}\n\n## Inhalt\n\n- Voiceover: REPLACE_ME\n- Hauptgedanke: REPLACE_ME\n\n## Einfache Choreografie\n\n- Hauptobjekt: REPLACE_ME\n- Startzustand: REPLACE_ME\n- eine dominante Hauptbewegung: REPLACE_ME\n- höchstens zwei unterstützende Elemente: REPLACE_ME\n- Ergebniszustand: REPLACE_ME\n- Ergebnis-Hold: mindestens 1 Sekunde\n\n## Semantische Trigger\n\n1. Sinnabschnitt: REPLACE_ME\n   - sichtbare Reaktion: REPLACE_ME\n   - Transcript-Auslöser: REPLACE_ME\n   - Ergebnis: REPLACE_ME\n\nMaximal drei Sinnabschnitte. Finale Frames kommen ausschließlich aus timeline/final-sync.json.\n`);
}

write('README.md', `# ${title}\n\nNeues Reel nach \`ki-animation-only-reel-v2\`.\n\n- redaktionelles Dauerziel: ungefähr ${targetSeconds} Sekunden\n- finale Dauer: Sprachende plus 1,2 bis 2,2 Sekunden\n- Szenen: ${sceneCount}\n- Voiceover: 125 bis 145 Wörter\n- Reel: 100 Prozent Remotion\n- Cover: ein statisches Bild mit einem Satz\n- Audio: 1,00x\n- finale Zeitquelle: \`timeline/final-sync.json\`\n- Untertitel: vollständiger Satz plus eine violette Fortschrittslinie\n\nDie anfänglichen Frames sind nur Platzhalter. Sie dürfen nicht unverändert gerendert werden, sobald finales Audio vorhanden ist.\n`);

write('AGENTS.md', `# Reel-lokale Regeln\n\nVor jeder Arbeit lesen:\n\n1. Root-\`AGENTS.md\`\n2. \`alles/AGENTS.md\`\n3. \`alles/ki/reel-brain/PRODUCTION-BRAIN.md\`\n4. \`alles/ki/reel-brain/FUTURE-REEL-STANDARD.md\`\n5. \`alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md\`\n6. \`alles/ki/reel-brain/VALIDATION.md\`\n\nFinales Audio ist die einzige Zeitquelle. Vorab verteilte Szenenframes sind Platzhalter. Nach dem Audio muss \`timeline/final-sync.json\` erstellt werden. Keine generierten Szenenbilder, Musik oder SFX. Nicht mergen.\n`);

write('00-cover/cover.md', `# Cover\n\n## Exakter Satz\n\n${hook}\n\n## Hauptmotiv\n\nREPLACE_ME\n\n## Bildprompt für das Motiv\n\nREPLACE_ME\n\n## Regeln\n\n- genau eine statische Bilddatei\n- genau ein Hauptmotiv\n- genau ein deutscher Satz\n- keine Nebenbotschaft\n- Satz deterministisch setzen\n`);

write('01-voice-script/script-fliesstext.txt', `${hook}\n\nREPLACE_ME`);
write('01-voice-script/script.md', `# Voiceover nach Sinnabschnitten\n\n${scenes.map((scene) => `## ${scene.id}\n\nREPLACE_ME`).join('\n\n')}\n`);
write('01-voice-script/voiceover-anweisung.txt', `Deutsch. Natürlich, ruhig und klar. Quellgeschwindigkeit 1,00x. Kurze natürliche Sinnpausen zwischen den Szenen. Keine künstliche Beschleunigung, Musik oder Soundeffekte.`);
write('02-audio/README.md', `Lege hier genau eine finale Audio- oder Mediendatei ab. Erlaubt: WAV, MP3, M4A, AAC, OGG, MP4, MOV oder WEBM. Nach dem Einfügen muss Codex ein echtes Wort- und Satz-Transcript sowie timeline/final-sync.json erzeugen.`);

write('03-szenen/README.md', `# Szenen\n\n${sceneCount} vollständig programmierte Remotion-Szenen. Jede Szene verwendet ein Hauptobjekt, eine dominante Bewegung, höchstens zwei unterstützende Elemente und einen stabilen Ergebniszustand. Keine Mini-Dashboards, Kartenansammlungen oder generierten Szenenbilder.`);
write('03-szenen/semantic-beats.json', `${JSON.stringify({
  version: 2,
  timingStatus: 'placeholder-until-final-transcript',
  scenes: scenes.map((scene) => ({
    id: scene.id,
    primaryObject: 'REPLACE_ME',
    beats: [{
      expression: 'REPLACE_ME',
      visualReaction: 'REPLACE_ME',
      transcriptTrigger: 'REPLACE_ME',
      resultState: 'REPLACE_ME',
      importance: 'primary'
    }]
  })),
  rules: {
    importantMeaningWithoutVisualReactionAllowed: false,
    fillerWordsReceiveStrongAnimation: false,
    maximumBeatsPerScene: 3,
    finalTimingSource: 'timeline/final-sync.json'
  }
}, null, 2)}\n`);

write('04-caption/README.md', `# Untertitel\n\n- kompletter aktueller Satz oder Sinnabschnitt erscheint sofort\n- keine Wort-für-Wort-Einblendung\n- keine Einzelwort-Hervorhebung\n- maximal zwei Zeilen\n- 46 bis 52 px, mindestens 42 px\n- Unterkante standardmäßig 220 px, erlaubt 210 bis 235 px\n- kein großer Hintergrundkasten\n- genau eine 6 bis 10 px hohe violette Fortschrittslinie\n- nur die Linie bewegt sich\n- finale Satzzeiten aus timeline/final-sync.json\n`);

write('05-review/review-checklist.md', `# Review\n\n- [ ] 125 bis 145 Wörter\n- [ ] ${sceneCount} klare Szenen\n- [ ] finale Audiodatei vorhanden\n- [ ] echtes Wort- und Satz-Transcript vorhanden\n- [ ] timeline/final-sync.json gültig\n- [ ] keine aktive Fallback-Zeitquelle\n- [ ] finale Dauer = Sprachende + 1,2 bis 2,2 Sekunden\n- [ ] Trigger-Abweichung höchstens 5 Frames\n- [ ] Szenengrenzen-Abweichung höchstens 6 Frames\n- [ ] ein Hauptobjekt und eine Hauptbewegung pro Szene\n- [ ] maximal drei Bedeutungsbeats pro Szene\n- [ ] mindestens eine Sekunde Ergebnis-Hold\n- [ ] Untertitel erscheinen vollständig sofort\n- [ ] keine Wort-für-Wort-Einblendung\n- [ ] Untertitel-Unterkante 210 bis 235 px\n- [ ] genau eine violette Fortschrittslinie\n- [ ] TypeScript und Tests bestanden\n- [ ] aktuelle Checkpoints und Kontaktbogen geprüft\n- [ ] MP4 vollständig in normaler Geschwindigkeit und Smartphone-Größe angesehen\n- [ ] technische Artefaktprüfung bestanden\n- [ ] Nutzerfreigabe vorhanden\n`);

write('05-review/production-status.json', `${JSON.stringify({
  version: 2,
  standardId: 'ki-animation-only-reel-v2',
  stage: 'planning',
  scriptApproved: false,
  remotionPrebuilt: false,
  audioReceived: false,
  finalSyncCreated: false,
  fallbackTimingActive: true,
  transcriptAligned: false,
  typecheckPassed: false,
  testsPassed: false,
  renderCompleted: false,
  visuallyReviewed: false,
  approved: false
}, null, 2)}\n`);

write('06-video/.gitkeep', '');
write('render/.gitkeep', '');

write('timeline/codex-reel-package.json', `${JSON.stringify({
  version: 4,
  standardId: 'ki-animation-only-reel-v2',
  slug,
  title,
  composition: {
    id: 'REPLACE_ME',
    width: 1080,
    height: 1920,
    fps,
    targetDurationSeconds: targetSeconds,
    durationInFrames: placeholderDurationInFrames,
    durationStatus: 'placeholder-until-final-audio'
  },
  editorial: {
    targetWordsMin: 125,
    targetWordsMax: 145,
    targetScenesMin: 8,
    targetScenesMax: 9
  },
  audio: {
    sourceFolder: '02-audio',
    playbackRate: 1,
    maximumPlaybackRateWithoutExplicitApproval: 1.05,
    preservePitch: true,
    soundMode: 'off',
    music: false,
    finalTimingSource: 'timeline/final-sync.json'
  },
  sync: {
    requiredFinalFile: 'timeline/final-sync.json',
    singleSourceOfTruth: true,
    maximumSemanticTriggerOffsetFrames: 5,
    maximumSceneBoundaryOffsetFrames: 6,
    maximumCaptionStartDelayFrames: 3,
    minimumOutroHoldSeconds: 1.2,
    maximumOutroHoldSeconds: 2.2,
    fallbackTimingAllowedInFinal: false
  },
  media: {
    generatedSceneImagesAllowed: false,
    stockSceneImagesAllowed: false,
    requiredImageScenes: [],
    coverAssetCount: 1
  },
  visual: {
    primaryObjectsPerScene: 1,
    maximumSupportingElementsPerScene: 2,
    primaryVisualAreaPercentMin: 55,
    primaryVisualAreaPercentMax: 72,
    miniDashboardsAllowed: false,
    persistentSceneNumbersAllowed: false,
    persistentKickersAllowed: false,
    emojiAsPrimaryExplanationAllowed: false
  },
  captions: {
    mode: 'instant-full-sentence-with-violet-progress-line',
    maximumLines: 2,
    defaultFontSizePx: 50,
    minimumFontSizePx: 42,
    bottomPx: 220,
    wordByWordRevealAllowed: false,
    wordHighlightAllowed: false,
    progressIndicator: 'single-violet-line',
    progressLineHeightPx: 8
  },
  motion: {
    dominantMotionsPerScene: 1,
    maximumStrongSimultaneousMotions: 2,
    maximumSemanticBeatsPerScene: 3,
    minimumResultHoldSeconds: 1,
    hardCutsDefault: true
  },
  implementation: {
    sourceDir: implementationSourceDir,
    fallbackTimingPreviewOnly: true,
    finalBuildRequiresFinalSync: true
  },
  scenes,
  checkpoints: placeholderCheckpoints
}, null, 2)}\n`);

write('timeline/final-sync.template.json', `${JSON.stringify({
  version: 1,
  status: 'replace-with-final-transcript-aligned',
  timingSource: 'final-voiceover-transcript',
  fallbackTimingActive: false,
  fps,
  audio: {durationSeconds: 0, speechStartSeconds: 0, speechEndSeconds: 0},
  composition: {durationInFrames: 0, outroHoldFrames: 0},
  captions: [],
  scenes: [],
  beats: []
}, null, 2)}\n`);

write('timeline/storyboard.md', `# Storyboard\n\nDie folgenden Frames sind nur Platzhalter. Finale Szenengrenzen entstehen aus der echten Sprache.\n\n${scenes.map((scene) => `## ${scene.id}\n\n- Platzhalter-Frames: ${scene.start}–${scene.end - 1}\n- Hauptgedanke: REPLACE_ME\n- Hauptobjekt: REPLACE_ME\n- eine dominante Bewegung: REPLACE_ME\n- Ergebnis: REPLACE_ME`).join('\n\n')}\n`);
write('timeline/motion-design.md', `# Motion-Design\n\n- ein Hauptobjekt pro Szene\n- eine dominante Hauptanimation\n- maximal zwei unterstützende Elemente\n- maximal zwei starke Bewegungen gleichzeitig\n- maximal drei Bedeutungsbeats\n- mindestens eine Sekunde Ergebnis-Hold\n- keine Mini-Dashboards oder Kartenansammlungen\n- keine dauerhaft sichtbare Szenennummer oder Kicker\n- keine Wort-für-Wort-Untertitel\n- eine violette Linie synchron zur echten Satzdauer\n- alle finalen Frames aus timeline/final-sync.json\n`);

console.log(`Neues v2-Reel angelegt: ${path.relative(technicalRoot, projectRoot)}`);
console.log(`Szenen: ${sceneCount}`);
console.log(`Redaktionelles Dauerziel: ${targetSeconds} Sekunden (${placeholderDurationInFrames} Platzhalter-Frames)`);
console.log('Wichtig: Nach finalem Audio muss timeline/final-sync.json erstellt und die komplette Timeline ersetzt werden.');
