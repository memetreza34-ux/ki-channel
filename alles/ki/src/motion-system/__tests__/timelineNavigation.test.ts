import {describe, expect, it} from 'vitest';
import {
  resolveMotionTimelineFrame,
  resolveMotionTimelineTime,
  secondsToMotionTimelineFrame,
} from '../timelineNavigation';
import {MOTION_TIMELINE_EXAMPLE} from '../timelineExamples';

describe('Motion-Timeline-Navigation', () => {
  it('ordnet Start-, Mittel- und Endframes der ersten Szene korrekt zu', () => {
    const start = resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 0);
    const middle = resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 75);
    const end = resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 149);

    expect(start.kind).toBe('scene');
    expect(middle.kind).toBe('scene');
    expect(end.kind).toBe('scene');

    if (start.kind === 'scene' && middle.kind === 'scene' && end.kind === 'scene') {
      expect(start.scene.index).toBe(0);
      expect(start.localFrame).toBe(0);
      expect(start.progress).toBe(0);
      expect(middle.localFrame).toBe(75);
      expect(end.localFrame).toBe(149);
      expect(end.progress).toBe(1);
    }
  });

  it('erkennt die Lücken zwischen den Szenen', () => {
    for (let frame = 150; frame < 158; frame += 1) {
      const context = resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, frame);
      expect(context.kind).toBe('gap');
      if (context.kind === 'gap') {
        expect(context.previousScene.index).toBe(0);
        expect(context.nextScene.index).toBe(1);
        expect(context.gapDurationInFrames).toBe(8);
        expect(context.gapFrame).toBe(frame - 150);
      }
    }
  });

  it('ordnet alle Timeline-Renderprüfpunkte einer sichtbaren Szene zu', () => {
    for (const frame of [75, 233, 391, 549, 623]) {
      const context = resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, frame);
      expect(context.kind).toBe('scene');
    }
  });

  it('rechnet Sekunden deterministisch in Frames um', () => {
    expect(secondsToMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 0)).toBe(0);
    expect(secondsToMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 2.5)).toBe(75);
    expect(secondsToMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 999)).toBe(623);

    const context = resolveMotionTimelineTime(MOTION_TIMELINE_EXAMPLE, 2.5);
    expect(context.kind).toBe('scene');
    if (context.kind === 'scene') {
      expect(context.scene.index).toBe(0);
      expect(context.localFrame).toBe(75);
    }
  });

  it('lehnt ungültige Frames und Zeiten ab', () => {
    expect(() => resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, -1)).toThrow();
    expect(() => resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 624)).toThrow();
    expect(() => resolveMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, 1.5)).toThrow();
    expect(() => secondsToMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, -1)).toThrow();
    expect(() => secondsToMotionTimelineFrame(MOTION_TIMELINE_EXAMPLE, Number.NaN)).toThrow();
  });
});
