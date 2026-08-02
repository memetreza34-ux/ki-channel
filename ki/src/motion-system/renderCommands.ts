import {MOTION_RENDER_PLAN} from './renderPlan';

export type MotionRenderCommand = {
  visualType: (typeof MOTION_RENDER_PLAN)[number]['visualType'];
  compositionId: string;
  frameCommands: string[];
  finalRenderCommand: string;
};

const shellEscape = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

export const createMotionRenderCommands = (
  entryPoint = 'ki/src/index.ts',
  outputDir = 'out/motion-system',
): MotionRenderCommand[] =>
  MOTION_RENDER_PLAN.map((item) => {
    const baseName = item.visualType.replace(/[^a-z0-9-]/gi, '-');
    const frameCommands = item.checkpoints.map(
      (frame) =>
        `npx remotion still ${shellEscape(entryPoint)} ${shellEscape(item.compositionId)} ${shellEscape(`${outputDir}/${baseName}/frame-${frame}.png`)} --frame=${frame}`,
    );

    return {
      visualType: item.visualType,
      compositionId: item.compositionId,
      frameCommands,
      finalRenderCommand: `npx remotion render ${shellEscape(entryPoint)} ${shellEscape(item.compositionId)} ${shellEscape(`${outputDir}/${baseName}/final.mp4`)}`,
    };
  });

export const MOTION_RENDER_COMMANDS = createMotionRenderCommands();
