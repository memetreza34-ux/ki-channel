import {describe, expect, it} from 'vitest';
import {createMotionRenderCommands, MOTION_RENDER_COMMANDS} from '../renderCommands';
import {MOTION_RENDER_PLAN} from '../renderPlan';

describe('Motion-Render-Kommandos', () => {
  it('erzeugt genau einen Kommandosatz pro Renderplan-Eintrag', () => {
    expect(MOTION_RENDER_COMMANDS).toHaveLength(MOTION_RENDER_PLAN.length);
  });

  it('erzeugt für jeden Prüfpunkt einen Still-Befehl', () => {
    for (const [index, commands] of MOTION_RENDER_COMMANDS.entries()) {
      expect(commands.frameCommands).toHaveLength(MOTION_RENDER_PLAN[index].checkpoints.length);
      expect(commands.frameCommands.every((command) => command.includes('remotion still'))).toBe(true);
    }
  });

  it('erzeugt einen finalen MP4-Render je Visualtyp', () => {
    for (const commands of MOTION_RENDER_COMMANDS) {
      expect(commands.finalRenderCommand).toContain('remotion render');
      expect(commands.finalRenderCommand).toContain('.mp4');
      expect(commands.finalRenderCommand).toContain(commands.compositionId);
    }
  });

  it('bleibt für identische Parameter deterministisch', () => {
    expect(createMotionRenderCommands()).toEqual(createMotionRenderCommands());
  });

  it('unterstützt eigene Entry- und Ausgabe-Pfade', () => {
    const [commands] = createMotionRenderCommands('ki/src/index.ts', 'tmp/motion');
    expect(commands.frameCommands[0]).toContain("'ki/src/index.ts'");
    expect(commands.frameCommands[0]).toContain("'tmp/motion/");
  });
});
