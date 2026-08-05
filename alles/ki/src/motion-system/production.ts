import {
  inspectMotionStoryboardQuality,
  type MotionQualityIssue,
  type MotionQualityReport,
} from './quality';
import {
  buildMotionScene,
  type BuildMotionSceneInput,
  type BuildMotionSceneResult,
} from './runtime';
import type {MotionStoryboard} from './schema';
import {
  createMotionSceneInputsFromScript,
  type BuildMotionTimelineFromScriptInput,
} from './scriptTimeline';
import {
  buildMotionTimeline,
  type BuildMotionTimelineInput,
  type MotionTimeline,
} from './timeline';
import {
  buildMotionTimelineFromTranscript,
  type BuildMotionTimelineFromTranscriptInput,
  type BuildMotionTimelineFromTranscriptResult,
} from './transcriptTimeline';
import {assertMotionStoryboard} from './validation';

export const PRODUCTION_BLOCKING_QUALITY_CODES = [
  'stage-item-limit',
  'unrendered-element',
  'missing-stage-timing',
  'collapsed-beat-timing',
] as const satisfies readonly MotionQualityIssue['code'][];

const productionBlockingQualityCodeSet = new Set<MotionQualityIssue['code']>(
  PRODUCTION_BLOCKING_QUALITY_CODES,
);

export type MotionProductionBlockingIssue = MotionQualityIssue & {
  sceneIndex?: number;
  storyboardId: string;
};

export class MotionProductionQualityError extends Error {
  public readonly issues: MotionProductionBlockingIssue[];

  public constructor(issues: MotionProductionBlockingIssue[]) {
    super(
      `Motion-Produktionsprüfung fehlgeschlagen: ${issues
        .map((issue) => `${issue.code}: ${issue.message}`)
        .join(' | ')}`,
    );
    this.name = 'MotionProductionQualityError';
    this.issues = issues;
  }
}

export type BuildProductionMotionSceneInput = Omit<
  BuildMotionSceneInput,
  'qualityMode'
>;

export type BuildProductionMotionTimelineInput = Omit<
  BuildMotionTimelineInput,
  'qualityMode'
>;

export type BuildProductionMotionTimelineFromScriptInput =
  BuildMotionTimelineFromScriptInput;

export type BuildProductionMotionTimelineFromTranscriptInput = Omit<
  BuildMotionTimelineFromTranscriptInput,
  'qualityMode'
>;

export const findProductionBlockingIssues = (
  storyboard: MotionStoryboard,
  quality: MotionQualityReport,
  sceneIndex?: number,
): MotionProductionBlockingIssue[] =>
  quality.issues
    .filter(
      (issue) =>
        issue.severity === 'error' ||
        productionBlockingQualityCodeSet.has(issue.code),
    )
    .map((issue) => ({
      ...issue,
      storyboardId: storyboard.id,
      ...(sceneIndex === undefined ? {} : {sceneIndex}),
    }));

export const assertProductionMotionStoryboard = (
  input: MotionStoryboard,
): MotionStoryboard => {
  const storyboard = assertMotionStoryboard(input);
  const quality = inspectMotionStoryboardQuality(storyboard);
  const issues = findProductionBlockingIssues(storyboard, quality);

  if (issues.length > 0) {
    throw new MotionProductionQualityError(issues);
  }

  return storyboard;
};

const assertProductionSceneResult = (
  result: BuildMotionSceneResult,
): BuildMotionSceneResult => {
  const issues = findProductionBlockingIssues(
    result.storyboard,
    result.quality,
  );
  if (issues.length > 0) {
    throw new MotionProductionQualityError(issues);
  }
  return result;
};

const assertProductionTimeline = (timeline: MotionTimeline): MotionTimeline => {
  const issues = timeline.scenes.flatMap((scene) =>
    findProductionBlockingIssues(
      scene.storyboard,
      scene.quality,
      scene.index,
    ),
  );
  if (issues.length > 0) {
    throw new MotionProductionQualityError(issues);
  }
  return timeline;
};

export const buildProductionMotionScene = (
  input: BuildProductionMotionSceneInput,
): BuildMotionSceneResult =>
  assertProductionSceneResult(
    buildMotionScene({...input, qualityMode: 'strict'}),
  );

export const buildProductionMotionTimeline = ({
  scenes,
  ...timelineOptions
}: BuildProductionMotionTimelineInput): MotionTimeline =>
  assertProductionTimeline(
    buildMotionTimeline({
      ...timelineOptions,
      qualityMode: 'strict',
      scenes: scenes.map((scene) => ({...scene, qualityMode: 'strict'})),
    }),
  );

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

  return assertProductionTimeline(
    buildMotionTimeline({
      scenes,
      fps,
      gapFrames,
      qualityMode: 'strict',
    }),
  );
};

export const buildProductionMotionTimelineFromTranscript = (
  input: BuildProductionMotionTimelineFromTranscriptInput,
): BuildMotionTimelineFromTranscriptResult => {
  const result = buildMotionTimelineFromTranscript({
    ...input,
    qualityMode: 'strict',
  });

  return {
    ...result,
    timeline: assertProductionTimeline(result.timeline),
  };
};
