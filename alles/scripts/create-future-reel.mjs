#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const [week, day, slug] = positional;
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
};

const title = option('title', 'REPLACE_ME');
const hook = option('hook', 'REPLACE_ME');
const sceneCount = Number(option('scenes', '8'));
const targetSeconds = Number(option('seconds', '64'));
const sourceDir = option('source-dir', `ki/src/reels/${slug ?? 'REPLACE_ME'}`);

if (!week || !day || !slug) {
  console.error('Nutzung: node scripts/create-future-reel.mjs <woche> <wochentag> <slug> --title "..." --hook "..." [--scenes 8|9] [--seconds 58-70]');
  process.exit(1);
}
for (const [label, value] of [['Woche', week], ['Wochentag', day], ['Slug', slug]]) {
  if (!/^[a-zA-Z0-9._-]+$/.test(value) || value.includes('..')) throw new Error(`${label} enthält unsichere Zeichen: ${value}`);
}
if (![8, 9].includes(sceneCount)) throw new Error('--scenes muss 8 oder 9 sein.');
if (!Number.isFinite(targetSeconds) || targetSeconds < 58 || targetSeconds > 70) throw new Error('--seconds muss zwischen 58 und 70 liegen.');

const projectRoot = path.resolve('..', 'reels', week, day, slug);
if (fs.existsSync(projectRoot)) throw new Error(`Reel-Ordner existiert bereits: ${projectRoot}`);
const fps = 30;
const durationInFrames = Math.round(targetSeconds * fps);
const perScene = Math.floor(durationInFrames / sceneCount);
let cursor = 0;
const scenes = Array.from({length: sceneCount}, (_, index) => {
  const start = cursor;
  const end = index === sceneCount - 1 ? durationInFrames : start + perScene;
  cursor = end;
  return {id: `scene-${String(index + 1).padStart(2, '0')}`, type: 'remotion', start, end, timingStatus: 'placeholder-until-final-audio', purpose: 'REPLACE_ME', primaryObject: 'REPLACE_ME', dominantMotion: 'REPLACE_ME', resultState: 'REPLACE_ME'};
});

const write = (relative, content = '') => {
  const file = path.join(projectRoot, relative);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
};
for (const folder of ['00-cover','01-voice-script','02-audio','03-szenen/EINZELNE-SZENEN','04-caption','05-review','06-video','render','timeline']) fs.mkdirSync(path.join(projectRoot, folder), {recursive: true});

write('README.md', `# ${title}\n\nNeues Reel nach \`ki-animation-only-reel-v3\`.\n\n- ${sceneCount} Szenen\n- genau zwei kurze Sätze pro Szene\n- 125 bis 145 Wörter\n- 100 Prozent Remotion\n- aktives Wort violett\n- keine Fortschrittslinie\n- finales Timing aus \`timeline/final-sync.json\`\n`);
write('AGENTS.md', '# Reel-lokale Regeln\n\nStandard: `ki-animation-only-reel-v3`. Lies Root- und `alles/AGENTS.md`, den Zukunftsstandard sowie Animation-Director-, Sync-Auditor- und Visual-QA-Skills. Beide Untertitelsätze erscheinen vollständig; nur das aktive Wort wird violett. Kein Merge ohne Freigabe.\n');
write('00-cover/cover.md', `# Cover\n\n## Exakter Satz\n\n${hook}\n\n## Ein Hauptmotiv\n\nREPLACE_ME\n\n## Bildprompt\n\nREPLACE_ME\n`);
write('01-voice-script/script-fliesstext.txt', `${hook} REPLACE_ME`);
write('01-voice-script/script.md', `# Voiceover\n\nPlane ${sceneCount * 2} kurze Sätze: genau zwei pro Szene.\n`);
write('01-voice-script/voiceover-anweisung.txt', 'Deutsch, natürlich, klar, 1,00x. Keine Musik und keine Soundeffekte.');
write('02-audio/README.md', 'Lege genau eine finale Audio- oder Mediendatei ab. Danach echtes Wort-Transcript und final-sync.json erzeugen.');
write('03-szenen/README.md', `# Szenen\n\n${sceneCount} Szenen: ein großes Hauptobjekt, eine dominante Bewegung, maximal zwei Helfer und ein stabiler Ergebniszustand pro Szene.\n`);

const beatDocument = {version: 3, standardId: 'ki-animation-only-reel-v3', timingStatus: 'placeholder-until-final-transcript', scenes: scenes.map((scene) => ({id: scene.id, primaryObject: 'REPLACE_ME', beats: [{id: 'REPLACE_ME', expression: 'REPLACE_ME', visualReaction: 'REPLACE_ME', transcriptTrigger: 'REPLACE_ME', resultState: 'REPLACE_ME', importance: 'primary'}]})), rules: {maximumBeatsPerScene: 3, maximumStrongSimultaneousMotions: 2, finalTimingSource: 'timeline/final-sync.json'}};
write('03-szenen/semantic-beats.json', JSON.stringify(beatDocument, null, 2));
for (const scene of scenes) write(`03-szenen/EINZELNE-SZENEN/${scene.id}/szene.md`, `# ${scene.id}\n\n- zwei kurze Voiceover-Sätze: REPLACE_ME\n- Hauptobjekt: REPLACE_ME\n- dominante Bewegung: REPLACE_ME\n- Ergebnis: REPLACE_ME\n- maximal drei Transcript-Trigger\n`);
write('04-caption/README.md', '# Untertitel v3\n\n- genau zwei Sätze gleichzeitig\n- beide vollständig sofort sichtbar\n- aktives Wort violett\n- keine Fortschrittslinie\n- keine Größenänderung\n- Standard-Unterkante 260 px\n- echte Wortzeiten aus final-sync.json\n');
write('05-review/review-checklist.md', '# Review\n\n- [ ] genau zwei Sätze pro Szene\n- [ ] aktives Wort synchron violett\n- [ ] keine Fortschrittslinie\n- [ ] Hauptvisual mindestens ungefähr 60 Prozent\n- [ ] Trigger höchstens ±5 Frames\n- [ ] Animation Director geprüft\n- [ ] Visual QA geprüft\n- [ ] Nutzerfreigabe\n');
write('05-review/production-status.json', JSON.stringify({version: 3, standardId: 'ki-animation-only-reel-v3', stage: 'planning', audioReceived: false, finalSyncCreated: false, typecheckPassed: false, testsPassed: false, renderCompleted: false, approved: false}, null, 2));
write('06-video/.gitkeep');
write('render/.gitkeep');

const reelPackage = {
  version: 5,
  standardId: 'ki-animation-only-reel-v3',
  timelineStatus: 'planned-placeholder-until-final-audio',
  slug,
  title,
  composition: {id: 'REPLACE_ME', coverId: 'REPLACE_ME', width: 1080, height: 1920, fps, targetDurationSeconds: targetSeconds, durationInFrames, durationSource: 'planned-placeholder'},
  editorial: {targetWordsMin: 125, targetWordsMax: 145, targetScenesMin: 8, targetScenesMax: 9, sentencesPerScene: 2},
  audio: {sourceFolder: '02-audio', playbackRate: 1, preservePitch: true, soundMode: 'off', music: false, finalTimingSource: 'timeline/final-sync.json'},
  media: {generatedSceneImagesAllowed: false, stockSceneImagesAllowed: false, requiredImageScenes: [], coverAssetCount: 1},
  visual: {primaryObjectsPerScene: 1, maximumSupportingElementsPerScene: 2, miniDashboardsAllowed: false, primaryVisualAreaPercentMin: 60, primaryVisualAreaPercentMax: 78, animationDirectorRequired: true, visualQaAgentRequired: true},
  captions: {mode: 'dual-sentence-active-word', sentencesVisible: 2, fullTextVisibleImmediately: true, defaultFontSizePx: 44, minimumFontSizePx: 42, bottomPx: 260, wordByWordRevealAllowed: false, activeWordHighlight: 'violet', wordHighlightSizeChangeAllowed: false, progressIndicator: 'none', timingSource: 'timeline/final-sync.json'},
  motion: {dominantMotionsPerScene: 1, maximumStrongSimultaneousMotions: 2, maximumSemanticBeatsPerScene: 3, minimumResultHoldSeconds: 1, hardCutsDefault: true, triggerToleranceFrames: 5},
  implementation: {sourceDir, fallbackTimingPreviewOnly: true, finalBuildRequiresFinalSync: true},
  scenes,
};
write('timeline/codex-reel-package.json', JSON.stringify(reelPackage, null, 2));
write('timeline/final-sync.template.json', JSON.stringify({version: 3, status: 'replace-with-final-transcript-aligned', fps, audio: {}, composition: {}, captionPairs: [], scenes: [], beats: []}, null, 2));
write('timeline/CODEX-AUFTRAG.md', '# Codex-Auftrag\n\nFinales Audio transkribieren, final-sync.json mit genau zwei Sätzen pro Szene und echten Wortzeiten erzeugen, v3 validieren, testen, rendern und mit Animation Director sowie Visual QA prüfen.\n');

console.log(`✓ v3-Reel angelegt: ${projectRoot}`);
console.log('Nächster Schritt: Script mit exakt zwei kurzen Sätzen pro Szene ausfüllen.');
