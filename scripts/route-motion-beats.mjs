#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';

const archetypes = {
  cause_effect: ['Ursache', 'Wirkung'],
  before_after: ['Vorher', 'Nachher'],
  problem_solution: ['Problem', 'Lösung'],
  input_process_result: ['Eingabe', 'Verarbeitung', 'Ergebnis'],
  comparison: ['Option A', 'Option B'],
  spatial_metaphor: ['Ausgangslage', 'sichtbare Veränderung'],
  ui_demo: ['Aktion', 'Reaktion'],
};

const chooseArchetype = (text) => {
  const value = text.toLowerCase();
  if (/vorher|nachher|früher|jetzt/.test(value)) return 'before_after';
  if (/problem|lösung|stattdessen|aber/.test(value)) return 'problem_solution';
  if (/vergleich|besser|schlechter|während|gegen/.test(value)) return 'comparison';
  if (/eingabe|verarbeitet|ergebnis|schritt/.test(value)) return 'input_process_result';
  if (/klick|öffne|wähle|tool|app/.test(value)) return 'ui_demo';
  if (/weil|dadurch|deshalb|führt/.test(value)) return 'cause_effect';
  return 'spatial_metaphor';
};

const fail = (message) => {
  console.error(`Motion Router: ${message}`);
  process.exit(1);
};

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? 'motion-plan.json';
if (!inputPath) fail('Aufruf: npm run motion:route -- <beats.json> [motion-plan.json]');

const source = JSON.parse(await readFile(inputPath, 'utf8'));
if (!Array.isArray(source.beats) || source.beats.length === 0) fail('beats[] fehlt oder ist leer.');

const beats = source.beats.map((beat, index) => {
  const spokenText = String(beat.spokenText ?? '').trim();
  if (!spokenText) fail(`Beat ${index + 1}: spokenText fehlt.`);
  const archetype = beat.archetype ?? chooseArchetype(spokenText);
  if (!archetypes[archetype]) fail(`Beat ${index + 1}: unbekannter Archetyp ${archetype}.`);
  return {
    id: beat.id ?? `beat-${index + 1}`,
    spokenText,
    communicationGoal: beat.communicationGoal ?? `Diese Aussage sichtbar erklären: ${spokenText}`,
    archetype,
    renderMode: beat.renderMode ?? (archetype === 'ui_demo' ? 'remotion' : 'hybrid'),
    visibleStateBefore: beat.visibleStateBefore ?? archetypes[archetype][0],
    visibleStateAfter: beat.visibleStateAfter ?? archetypes[archetype].at(-1),
    meaningfulChange: beat.meaningfulChange ?? `${archetypes[archetype][0]} verwandelt sich sichtbar in ${archetypes[archetype].at(-1)}.`,
    continuityObject: beat.continuityObject ?? null,
    cameraIntent: beat.cameraIntent ?? 'stabiler Fokus auf die Hauptveränderung',
    sfxCue: beat.sfxCue ?? null,
    startFrame: Number(beat.startFrame ?? index * 120),
    endFrame: Number(beat.endFrame ?? (index + 1) * 120),
  };
});

const plan = {
  version: 1,
  title: source.title ?? 'Unbenanntes KI-Reel',
  format: {width: 1080, height: 1920, fps: 30},
  rules: {minScore: 8, maxSimilarArchetypesInARow: 2, requireMeaningfulChange: true},
  beats,
};

await writeFile(outputPath, `${JSON.stringify(plan, null, 2)}\n`);
console.log(`Motion-Plan erzeugt: ${outputPath} (${beats.length} Beats)`);
