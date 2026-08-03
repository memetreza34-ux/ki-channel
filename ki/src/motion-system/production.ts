import {
  buildMotionScene,
  type BuildMotionSceneInput,
  type BuildMotionSceneResult,
} from './runtime';
import {
  createMotionSceneInputsFromScript,
  type BuildMotionTimelineFromScriptInput,
} from './scriptTimeline';
import {
  buildMotionTimeline,
  type BuildMotionTimelineInput,
  type MotionTimeline,
} from './timeline';

export type BuildProductionMotionSceneInput = Omit<
  BuildMotionSceneInput,
  'qualityMode'
>;

export type BuildProductionMotionTimelineInput = Omit<
  BuildMotionTimelineInput,
  'qualityMode'
>;

export type BuildProductionMotionTimelineFromScriptInput = Omit<
  BuildMotionTimelineFromScriptInput,
  never
>;

export const buildProductionMotionScene = (
  input: BuildProductionMotionSceneInput,
): BuildMotionSceneResult => buildMotionScene({...input, qualityMode: 'strict'});

export const buildProductionMotionTimeline = ({
  scenes,
  ...timelineOptions
}: BuildProductionMotionTimelineInput): MotionTimeline =>
  buildMotionTimeline({
    ...timelineOptions,
    qualityMode: 'strict',
    scenes: scenes.map((scene) => ({...scene, qualityMode: 'strict'})),
  });

export const buildProductionMotionTimelineFromScript = ({
  script,
  fps,
  gapFrames,
  maxCharactersPerScene,
  mergeShorterThan,
  sceneDefaults,
  sceneOverrides,
}: BuildProductionMotionTimelineFromScriptInput): MotionTimeline => {
  const scenes = createMotionSceneInputsFromScript({
    script,
    maxCharactersPerScene,
    mergeShorterThan,
    sceneDefaults,
    sceneOverrides,
  }).map((scene) => ({...scene, qualityMode: 'strict' as const}));

  return buildMotionTimeline({
    scenes,
    fps,
    gapFrames,
    qualityMode: 'strict',
  });
};
