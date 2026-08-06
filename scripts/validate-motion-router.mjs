#!/usr/bin/env node
import {readFile} from 'node:fs/promises';

const allowedArchetypes = new Set(['cause_effect','before_after','problem_solution','input_process_result','comparison','spatial_metaphor','ui_demo']);
const allowedModes = new Set(['remotion','image','hybrid']);
const path = process.argv[2] ?? 'motion-plan.json';
const plan = JSON.parse(await readFile(path, 'utf8'));
const errors = [];

if (plan?.format?.width !== 1080 || plan?.format?.height !== 1920 || plan?.format?.fps !== 30) errors.push('Format muss 1080x1920 bei 30 FPS sein.');
if (!Array.isArray(plan.beats) || plan.beats.length === 0) errors.push('Mindestens ein Beat ist erforderlich.');

let previousEnd = -1;
let previousArchetype = null;
let repeated = 0;
for (const [index, beat] of (plan.beats ?? []).entries()) {
  const label = `Beat ${index + 1}`;
  for (const field of ['spokenText','communicationGoal','visibleStateBefore','visibleStateAfter','meaningfulChange','cameraIntent']) {
    if (!String(beat[field] ?? '').trim()) errors.push(`${label}: ${field} fehlt.`);
  }
  if (!allowedArchetypes.has(beat.archetype)) errors.push(`${label}: ungültiger archetype.`);
  if (!allowedModes.has(beat.renderMode)) errors.push(`${label}: ungültiger renderMode.`);
  if (!Number.isInteger(beat.startFrame) || !Number.isInteger(beat.endFrame) || beat.endFrame <= beat.startFrame) errors.push(`${label}: ungültiges Timing.`);
  if (beat.startFrame < previousEnd) errors.push(`${label}: überlappt den vorherigen Beat.`);
  previousEnd = beat.endFrame;
  repeated = beat.archetype === previousArchetype ? repeated + 1 : 1;
  if (repeated > 2) errors.push(`${label}: derselbe Szenenarchetyp erscheint mehr als zweimal hintereinander.`);
  previousArchetype = beat.archetype;
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Motion-Plan gültig: ${plan.beats.length} Beats, Meaning-first-Regeln bestanden.`);
