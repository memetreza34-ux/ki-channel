#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const [week, day, slug] = positional;
const option = (name, fallback) => {const index = args.indexOf(`--${name}`); return index >= 0 ? args[index + 1] ?? fallback : fallback;};
const title = option('title', 'REPLACE_ME');
const hook = option('hook', 'REPLACE_ME');
const sceneCount = Number(option('scenes', '8'));
const targetSeconds = Number(option('seconds', '64'));

if (!week || !day || !slug) {
  console.error('Nutzung: node scripts/create-future-reel.mjs <woche> <wochentag> <slug> --title "..." --hook "..." [--scenes 8|9] [--seconds 58-70]');
  process.exit(1);
}
if (![8, 9].includes(sceneCount)) throw new Error('--scenes muss 8 oder 9 sein.');
if (targetSeconds < 58 || targetSeconds > 70) throw new Error('--seconds muss zwischen 58 und 70 liegen.');

const root = path.resolve('..', 'reels', week, day, slug);
if (fs.existsSync(root)) throw new Error(`Reel existiert bereits: ${root}`);
const write = (relative, content = '') => {const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`, 'utf8');};
for (const folder of ['00-cover','01-voice-script','02-audio','03-szenen/EINZELNE-SZENEN','04-caption','05-review','06-video','render','timeline']) fs.mkdirSync(path.join(root, folder), {recursive: true});

const fps = 30;
const duration = Math.round(targetSeconds * fps);
const perScene = Math.floor(duration / sceneCount);
const scenes = Array.from({length: sceneCount}, (_, index) => ({
  id: `scene-${String(index + 1).padStart(2, '0')}`,
  type: 'remotion',
  start: index * perScene,
  end: index === sceneCount - 1 ? duration : (index + 1) * perScene,
  headingIcon: 'REPLACE_ME',
  primaryObject: 'REPLACE_ME',
  primaryMotion: 'REPLACE_ME',
  resultState: 'REPLACE_ME',
}));

write('README.md', `# ${title}\n\nStandard: \`ki-animation-only-reel-v4\`. Ein aktueller Satz, violettes Wort-Tracking, semantisches Überschriften-Icon und große Ursache-Wirkung-Animation je Szene.`);
write('AGENTS.md', '# Reel-Regeln\n\nV4: nur aktueller Satz sichtbar, vollständiger Satz sofort, aktives Wort violett, keine Fortschrittslinie oder große Box, Icon je Überschrift, großes Hauptvisual, Audio-first.');
write('00-cover/cover.md', `# Cover\n\n## Satz\n${hook}\n\n## Hauptmotiv\nREPLACE_ME\n`);
write('01-voice-script/script-fliesstext.txt', `${hook} REPLACE_ME`);
write('01-voice-script/script.md', `# Voiceover\n\nPlane ungefähr ${sceneCount * 2} kurze Sätze. Im Video ist immer nur der aktuelle Satz sichtbar.`);
write('02-audio/README.md', 'Genau eine finale Mediendatei ablegen. Danach Wort-Transcript und final-sync erzeugen.');
write('03-szenen/README.md', `# Szenen\n\n${sceneCount} Szenen: Icon, großes Hauptobjekt, dominante Bewegung und Ergebniszustand.`);
for (const scene of scenes) write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `# ${scene.id}\n\n- Überschrift: REPLACE_ME\n- Icon: REPLACE_ME\n- Icon-Trigger: REPLACE_ME\n- Hauptobjekt: REPLACE_ME\n- dominante Bewegung: REPLACE_ME\n- Ergebnis: REPLACE_ME`);
write('04-caption/README.md', '# Untertitel v4\n\n- ein Satz sichtbar\n- vollständig sofort\n- aktives Wort violett\n- keine Fortschrittslinie oder große Box\n- Standard-Unterkante 320 px\n- echte Wortzeiten');
write('05-review/review-checklist.md', '# Review\n\n- [ ] nur aktueller Satz\n- [ ] violettes Wort synchron\n- [ ] Icon passt und bewegt sich semantisch\n- [ ] Hauptvisual groß\n- [ ] keine wiederholte Rahmenbühne\n- [ ] Smartphone geprüft\n- [ ] Nutzerfreigabe');
write('06-video/.gitkeep');
write('render/.gitkeep');

const packageData = {
  version: 6,
  standardId: 'ki-animation-only-reel-v4',
  timelineStatus: 'planned-placeholder-until-final-audio',
  slug,
  title,
  composition: {id: 'REPLACE_ME', coverId: 'REPLACE_ME', width: 1080, height: 1920, fps, targetDurationSeconds: targetSeconds, durationInFrames: duration, durationSource: 'planned-placeholder'},
  editorial: {targetWordsMin: 125, targetWordsMax: 145, targetScenesMin: 8, targetScenesMax: 9, plannedSentencesPerScene: 2, visibleSentencesAtOnce: 1},
  audio: {sourceFolder: '02-audio', playbackRate: 1, soundMode: 'off', music: false, finalTimingSource: 'timeline/final-sync.json'},
  media: {generatedSceneImagesAllowed: false, stockSceneImagesAllowed: false},
  visual: {primaryObjectsPerScene: 1, maximumSupportingElementsPerScene: 2, miniDashboardsAllowed: false, repeatedStageFrameAllowed: false, primaryVisualAreaPercentMin: 68, primaryVisualAreaPercentMax: 82, headingIconRequired: true, headingIconType: 'semantic-vector'},
  captions: {mode: 'single-sentence-active-word', sentencesVisible: 1, fullTextVisibleImmediately: true, defaultFontSizePx: 48, minimumFontSizePx: 44, bottomPx: 320, wordByWordRevealAllowed: false, activeWordHighlight: 'violet', progressIndicator: 'none', largeBackgroundBoxAllowed: false, timingSource: 'timeline/final-sync.json'},
  motion: {dominantMotionsPerScene: 1, maximumStrongSimultaneousMotions: 2, maximumSemanticBeatsPerScene: 3, minimumResultHoldSeconds: 1, triggerToleranceFrames: 5},
  scenes,
};
write('timeline/codex-reel-package.json', JSON.stringify(packageData, null, 2));
write('timeline/final-sync.template.json', JSON.stringify({version: 4, status: 'replace-with-final-transcript-aligned', fps, audio: {}, composition: {}, captionPairs: [], scenes: [], beats: []}, null, 2));
write('timeline/CODEX-AUFTRAG.md', '# Codex-Auftrag v4\n\nFinales Audio transkribieren, final-sync erzeugen, v4 validieren, testen, rendern, Icons und Smartphone-Wirkung prüfen.');
console.log(`✓ v4-Reel angelegt: ${root}`);
