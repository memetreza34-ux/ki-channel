import {describe, expect, it} from 'vitest';
import {
  createMotionRenderCommands,
  createMotionTimelineRenderCommands,
  DEFAULT_MOTION_ENTRY_POINT,
  MOTION_RENDER_COMMANDS,
  MOTION_TIMELINE_RENDER_COMMANDS,
} from '../renderCommands';
import {MOTION_RENDER_PLAN} from '../renderPlan';
import {MOTION_TIMELINE_RENDER_PLAN} from '../timelineRenderPlan';

describe('Motion-Render-Kommandos', () => {
  it('erzeugt genau einen Kommandosatz pro Renderplan-Eintrag', () => {
    expect(MOTION_RENDER_COMMANDS).toHaveLength(MOTION_RENDER_PLAN.length);
  });

  it('erzeugt für jeden Prüfpunkt einen Still-Befehl', () => {
    for (const [index, commands] of MOTION_RENDER_COMMANDS.entries()) {
      expect(commands.frameCommands).toHaveLength(MOTION_RENDER_PLAN[index].checkpoints.length);
      expect(commands.frameCommands.every((command) => command.includes('remotion still'))).toBe(true);
      expect(commands.frameCommands.every((command) => command.includes('--overwrite'))).toBe(true);
    }
  });

  it('verwendet standardmäßig den isolierten Motion-Einstiegspunkt', () => {
    for (const commands of MOTION_RENDER_COMMANDS) {
      expect(commands.frameCommands.every((command) => command.includes(DEFAULT_MOTION_ENTRY_POINT))).toBe(true);
      expect(commands.finalRenderCommand).toContain(DEFAULT_MOTION_ENTRY_POINT);
      expect(commands.frameCommands.every((command) => command.includes('npx --no-install'))).toBe(true);
    }
  });

  it('erzeugt einen finalen MP4-Render je Visualtyp', () => {
    for (const commands of MOTION_RENDER_COMMANDS) {
      expect(commands.finalRenderCommand).toContain('remotion render');
      expect(commands.finalRenderCommand).toContain('.mp4');
      expect(commands.finalRenderCommand).toContain(commands.compositionId);
      expect(commands.finalRenderCommand).toContain('--overwrite');
    }
  });

  it('erzeugt Still- und Video-Kommandos für die Timeline-Demo', () => {
    expect(MOTION_TIMELINE_RENDER_COMMANDS.compositionId).toBe(
      MOTION_TIMELINE_RENDER_PLAN.compositionId,
    );
    expect(MOTION_TIMELINE_RENDER_COMMANDS.frameCommands).toHaveLength(
      MOTION_TIMELINE_RENDER_PLAN.checkpoints.length,
    );
    expect(
      MOTION_TIMELINE_RENDER_COMMANDS.frameCommands.every(
        (command) =>
          command.includes('remotion still') &&
          command.includes('/timeline-demo/frame-'),
      ),
    ).toBe(true);
    expect(MOTION_TIMELINE_RENDER_COMMANDS.finalRenderCommand).toContain(
      "'out/motion-system/timeline-demo/final.mp4'",
    );
  });

  it('bleibt für identische Parameter deterministisch', () => {
    expect(createMotionRenderCommands()).toEqual(createMotionRenderCommands());
    expect(createMotionTimelineRenderCommands()).toEqual(
      createMotionTimelineRenderCommands(),
    );
  });

  it('unterstützt eigene Entry- und Ausgabe-Pfade', () => {
    const [commands] = createMotionRenderCommands('ki/src/index.ts', 'tmp/motion');
    expect(commands.frameCommands[0]).toContain("'ki/src/index.ts'");
    expect(commands.frameCommands[0]).toContain("'tmp/motion/");

    const timelineCommands = createMotionTimelineRenderCommands(
      'ki/src/index.ts',
      'tmp/timeline',
    );
    expect(timelineCommands.frameCommands[0]).toContain("'ki/src/index.ts'");
    expect(timelineCommands.frameCommands[0]).toContain(
      "'tmp/timeline/timeline-demo/",
    );
  });
});
