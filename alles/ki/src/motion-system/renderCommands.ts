import {MOTION_RENDER_PLAN} from './renderPlan';
import {MOTION_TIMELINE_RENDER_PLAN} from './timelineRenderPlan';

export type MotionRenderCommand = {
  visualType: (typeof MOTION_RENDER_PLAN)[number]['visualType'];
  compositionId: string;
  frameCommands: string[];
  finalRenderCommand: string;
};

export type MotionTimelineRenderCommand = {
  targetKey: 'timeline-demo';
  compositionId: string;
  frameCommands: string[];
  finalRenderCommand: string;
};

export const DEFAULT_MOTION_ENTRY_POINT = 'ki/src/motion-system/remotion-entry.tsx';
export const DEFAULT_MOTION_OUTPUT_DIR = 'out/motion-system';

const shellEscape = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

const createStillCommand = ({
  entryPoint,
  compositionId,
  outputPath,
  frame,
}: {
  entryPoint: string;
  compositionId: string;
  outputPath: string;
  frame: number;
}): string =>
  `npx --no-install remotion still ${shellEscape(entryPoint)} ${shellEscape(compositionId)} ${shellEscape(outputPath)} --frame=${frame} --overwrite`;

const createVideoCommand = ({
  entryPoint,
  compositionId,
  outputPath,
}: {
  entryPoint: string;
  compositionId: string;
  outputPath: string;
}): string =>
  `npx --no-install remotion render ${shellEscape(entryPoint)} ${shellEscape(compositionId)} ${shellEscape(outputPath)} --overwrite`;

export const createMotionRenderCommands = (
  entryPoint = DEFAULT_MOTION_ENTRY_POINT,
  outputDir = DEFAULT_MOTION_OUTPUT_DIR,
): MotionRenderCommand[] =>
  MOTION_RENDER_PLAN.map((item) => {
    const baseName = item.visualType.replace(/[^a-z0-9-]/gi, '-');
    const targetDir = `${outputDir}/${baseName}`;

    return {
      visualType: item.visualType,
      compositionId: item.compositionId,
      frameCommands: item.checkpoints.map((frame) =>
        createStillCommand({
          entryPoint,
          compositionId: item.compositionId,
          outputPath: `${targetDir}/frame-${frame}.png`,
          frame,
        }),
      ),
      finalRenderCommand: createVideoCommand({
        entryPoint,
        compositionId: item.compositionId,
        outputPath: `${targetDir}/final.mp4`,
      }),
    };
  });

export const createMotionTimelineRenderCommands = (
  entryPoint = DEFAULT_MOTION_ENTRY_POINT,
  outputDir = DEFAULT_MOTION_OUTPUT_DIR,
): MotionTimelineRenderCommand => {
  const targetDir = `${outputDir}/${MOTION_TIMELINE_RENDER_PLAN.targetKey}`;

  return {
    targetKey: MOTION_TIMELINE_RENDER_PLAN.targetKey,
    compositionId: MOTION_TIMELINE_RENDER_PLAN.compositionId,
    frameCommands: MOTION_TIMELINE_RENDER_PLAN.checkpoints.map((frame) =>
      createStillCommand({
        entryPoint,
        compositionId: MOTION_TIMELINE_RENDER_PLAN.compositionId,
        outputPath: `${targetDir}/frame-${frame}.png`,
        frame,
      }),
    ),
    finalRenderCommand: createVideoCommand({
      entryPoint,
      compositionId: MOTION_TIMELINE_RENDER_PLAN.compositionId,
      outputPath: `${targetDir}/final.mp4`,
    }),
  };
};

export const MOTION_RENDER_COMMANDS = createMotionRenderCommands();
export const MOTION_TIMELINE_RENDER_COMMANDS = createMotionTimelineRenderCommands();
