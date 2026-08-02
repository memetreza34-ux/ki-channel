import {MOTION_RENDER_PLAN} from './renderPlan';

export type MotionRenderCommand = {
  visualType: (typeof MOTION_RENDER_PLAN)[number]['visualType'];
  compositionId: string;
  frameCommands: string[];
  finalRenderCommand: string;
};

export const DEFAULT_MOTION_ENTRY_POINT = 'ki/src/motion-system/remotion-entry.tsx';
export const DEFAULT_MOTION_OUTPUT_DIR = 'out/motion-system';

const shellEscape = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

export const createMotionRenderCommands = (
  entryPoint = DEFAULT_MOTION_ENTRY_POINT,
  outputDir = DEFAULT_MOTION_OUTPUT_DIR,
): MotionRenderCommand[] =>
  MOTION_RENDER_PLAN.map((item) => {
    const baseName = item.visualType.replace(/[^a-z0-9-]/gi, '-');
    const frameCommands = item.checkpoints.map(
      (frame) =>
        `npx --no-install remotion still ${shellEscape(entryPoint)} ${shellEscape(item.compositionId)} ${shellEscape(`${outputDir}/${baseName}/frame-${frame}.png`)} --frame=${frame} --overwrite`,
    );

    return {
      visualType: item.visualType,
      compositionId: item.compositionId,
      frameCommands,
      finalRenderCommand: `npx --no-install remotion render ${shellEscape(entryPoint)} ${shellEscape(item.compositionId)} ${shellEscape(`${outputDir}/${baseName}/final.mp4`)} --overwrite`,
    };
  });

export const MOTION_RENDER_COMMANDS = createMotionRenderCommands();
