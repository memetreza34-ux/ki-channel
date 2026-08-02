import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {retimeMotionStoryboardFps} from '../fps';
import {createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

describe('Motion-FPS-Retiming', () => {
  it('skaliert Dauer, Beat-Start und Beat-Dauer zeitproportional', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const outputBeat = storyboard.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );
    const retimed = retimeMotionStoryboardFps(storyboard, 60);
    const retimedOutputBeat = retimed.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );

    expect(retimed.fps).toBe(60);
    expect(retimed.durationInFrames).toBe(300);
    expect(retimedOutputBeat?.atFrame).toBe((outputBeat?.atFrame ?? 0) * 2);
    expect(retimedOutputBeat?.durationFrames).toBe((outputBeat?.durationFrames ?? 0) * 2);
    expect(() => motionStoryboardSchema.parse(retimed)).not.toThrow();
  });

  it('skaliert auch auf 24 FPS ohne ungültige Frames', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const retimed = retimeMotionStoryboardFps(storyboard, 24);

    expect(retimed.durationInFrames).toBe(120);
    expect(retimed.beats.every((beat) => beat.atFrame < retimed.durationInFrames)).toBe(true);
    expect(() => motionStoryboardSchema.parse(retimed)).not.toThrow();
  });

  it('gibt bei identischer FPS dasselbe Storyboard zurück', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    expect(retimeMotionStoryboardFps(storyboard, storyboard.fps)).toBe(storyboard);
  });

  it('hält Beats beim 900-Frame-Limit vollständig innerhalb der Szene', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const extended = {
      ...storyboard,
      durationInFrames: 900,
      beats: storyboard.beats.map((beat, index) =>
        index === 0 ? {...beat, atFrame: 880, durationFrames: 20} : beat,
      ),
    };
    const retimed = retimeMotionStoryboardFps(extended, 60);
    const firstBeat = retimed.beats[0];

    expect(retimed.durationInFrames).toBe(900);
    expect(firstBeat.atFrame + firstBeat.durationFrames).toBeLessThanOrEqual(900);
    expect(() => motionStoryboardSchema.parse(retimed)).not.toThrow();
  });

  it('retimed beim direkten Audio-Sync auch nicht ausgerichtete Beats', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const originalInput = storyboard.beats.find(
      (beat) => beat.targetId === 'input' && beat.action === 'show',
    );
    const originalOutput = storyboard.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );

    const aligned = alignStoryboardToWords(
      storyboard,
      [{text: 'Ergebnis', startMs: 1000, endMs: 1200}],
      60,
    );
    const alignedInput = aligned.beats.find(
      (beat) => beat.targetId === 'input' && beat.action === 'show',
    );
    const alignedOutput = aligned.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );

    expect(aligned.fps).toBe(60);
    expect(aligned.durationInFrames).toBeGreaterThanOrEqual(300);
    expect(alignedInput?.atFrame).toBe((originalInput?.atFrame ?? 0) * 2);
    expect(alignedOutput?.atFrame).toBe(60);
    expect(originalOutput?.atFrame).not.toBe(alignedOutput?.atFrame);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('retimed auch ohne gültige Wörter, wenn explizit andere FPS angefordert werden', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const aligned = alignStoryboardToWords(storyboard, [], 60);

    expect(aligned.fps).toBe(60);
    expect(aligned.durationInFrames).toBe(300);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('lehnt nicht unterstützte oder nicht ganzzahlige FPS ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(() => retimeMotionStoryboardFps(storyboard, 23)).toThrow(
      'FPS muss eine ganze Zahl zwischen 24 und 60 sein.',
    );
    expect(() => retimeMotionStoryboardFps(storyboard, 59.5)).toThrow(
      'FPS muss eine ganze Zahl zwischen 24 und 60 sein.',
    );
    expect(() => alignStoryboardToWords(storyboard, [], 23)).toThrow(
      'FPS muss eine ganze Zahl zwischen 24 und 60 sein.',
    );
  });
});
