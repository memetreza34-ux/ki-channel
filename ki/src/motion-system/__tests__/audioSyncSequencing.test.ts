import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

const beatFrame = (
  storyboard: ReturnType<typeof createDefaultStoryboard>,
  targetId: string,
  action: (typeof storyboard.beats)[number]['action'],
) => storyboard.beats.find((beat) => beat.targetId === targetId && beat.action === action)?.atFrame;

describe('Audio-Sync Reihenfolge', () => {
  it('erhält den Abstand zwischen Show- und Folgeaktionen eines Elements', () => {
    const storyboard = createDefaultStoryboard('Die KI erzeugt einen Fehler und muss geprüft werden.');
    const originalShow = beatFrame(storyboard, 'error', 'show') ?? 0;
    const originalShake = beatFrame(storyboard, 'error', 'shake') ?? 0;

    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Fehler', startMs: 1000, endMs: 1250},
    ]);

    const alignedShow = beatFrame(aligned, 'error', 'show') ?? 0;
    const alignedShake = beatFrame(aligned, 'error', 'shake') ?? 0;

    expect(alignedShow).toBe(30);
    expect(alignedShake - alignedShow).toBe(originalShake - originalShow);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('legt Highlight und Show nicht auf denselben Frame', () => {
    const storyboard = createDefaultStoryboard('Modell A ist im Vergleich besser als Modell B.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Variante', startMs: 1000, endMs: 1150},
      {text: 'B', startMs: 1180, endMs: 1250},
    ]);

    const showFrame = beatFrame(aligned, 'right', 'show') ?? 0;
    const highlightFrame = beatFrame(aligned, 'right', 'highlight') ?? 0;

    expect(highlightFrame).toBeGreaterThan(showFrame);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('startet Verbindungen erst nachdem Quelle und Ziel sichtbar sind', () => {
    const storyboard = createDefaultStoryboard('Daten fließen durch die KI zum Ergebnis.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Datenquelle', startMs: 0, endMs: 150},
      {text: 'KI', startMs: 200, endMs: 400},
      {text: 'Ergebnis', startMs: 1000, endMs: 1250},
    ]);

    const inputShow = beatFrame(aligned, 'input', 'show') ?? 0;
    const aiShow = beatFrame(aligned, 'ai', 'show') ?? 0;
    const inputConnection = aligned.beats.find(
      (beat) => beat.sourceId === 'input' && beat.targetId === 'ai' && beat.action === 'connect',
    )?.atFrame ?? 0;

    expect(inputConnection).toBeGreaterThanOrEqual(Math.max(inputShow, aiShow) + 6);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('reserviert auch am 900-Frame-Limit sichtbare Beat-Dauer', () => {
    const storyboard = createDefaultStoryboard('Die KI erzeugt einen Fehler und muss geprüft werden.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Fehler', startMs: 40000, endMs: 45000},
    ]);

    const errorShow = aligned.beats.find(
      (beat) => beat.targetId === 'error' && beat.action === 'show',
    );

    expect(aligned.durationInFrames).toBe(900);
    expect(errorShow).toBeDefined();
    expect((errorShow?.atFrame ?? 900) + (errorShow?.durationFrames ?? 0)).toBeLessThanOrEqual(900);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });
});
