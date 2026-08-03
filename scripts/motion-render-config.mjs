import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const manifestUrl = new URL(
  '../ki/src/motion-system/render-config.json',
  import.meta.url,
);

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Motion-Render-Manifest konnte nicht geladen werden: ${message}`);
}

const assertFrameList = (value, name) => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((frame) => !Number.isInteger(frame) || frame < 0) ||
    new Set(value).size !== value.length ||
    value.some((frame, index) => index > 0 && frame <= value[index - 1])
  ) {
    throw new Error(`${name} muss eine eindeutige, aufsteigende Liste nicht negativer Frames sein.`);
  }
};

if (!Array.isArray(manifest.visualTypes) || manifest.visualTypes.length === 0) {
  throw new Error('Motion-Render-Manifest enthält keine Visualtypen.');
}
if (new Set(manifest.visualTypes).size !== manifest.visualTypes.length) {
  throw new Error('Motion-Render-Manifest enthält doppelte Visualtypen.');
}
assertFrameList(manifest.defaultCheckpoints, 'defaultCheckpoints');
assertFrameList(manifest.smokeCheckpoints, 'smokeCheckpoints');
assertFrameList(manifest.timeline?.smokeCheckpoints, 'timeline.smokeCheckpoints');
assertFrameList(manifest.timeline?.checkpoints, 'timeline.checkpoints');

if (
  !manifest.timeline ||
  manifest.timeline.targetKey !== 'timeline-demo' ||
  typeof manifest.timeline.compositionId !== 'string' ||
  !Number.isInteger(manifest.timeline.durationInFrames) ||
  manifest.timeline.durationInFrames <= 0
) {
  throw new Error('Motion-Render-Manifest enthält keine gültige Timeline-Konfiguration.');
}

if (
  [...manifest.timeline.smokeCheckpoints, ...manifest.timeline.checkpoints].some(
    (frame) => frame >= manifest.timeline.durationInFrames,
  )
) {
  throw new Error('Timeline-Prüfframe liegt außerhalb der Timeline-Dauer.');
}

export const RENDER_MANIFEST_FINGERPRINT = createHash('sha256')
  .update(JSON.stringify(manifest))
  .digest('hex');
export const VISUAL_TYPES = Object.freeze([...manifest.visualTypes]);
export const DEFAULT_CHECKPOINTS = Object.freeze([...manifest.defaultCheckpoints]);
export const SMOKE_CHECKPOINTS = Object.freeze([...manifest.smokeCheckpoints]);
export const TIMELINE_TARGET = Object.freeze({
  ...manifest.timeline,
  smokeCheckpoints: Object.freeze([...manifest.timeline.smokeCheckpoints]),
  checkpoints: Object.freeze([...manifest.timeline.checkpoints]),
});

export const toMotionCompositionId = (type) =>
  `Motion-${type}`.replace(
    /(^|-)([a-z])/g,
    (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`,
  );
