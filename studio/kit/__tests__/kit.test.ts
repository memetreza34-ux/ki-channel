import {describe, expect, it} from 'vitest';
import {formatOf} from '../layout';
import {musicVolumeAt} from '../Music';
import {scenesDuration, type SceneItem} from '../Scenes';

const word = (text: string, startMs: number, endMs: number) => ({text, startMs, endMs, timestampMs: null, confidence: null});

describe('musicVolumeAt', () => {
  const base = {volume: 0.5, duckTo: 0.3, fadeInFrames: 0, fadeOutFrames: 0, durationInFrames: 300, fps: 30};

  it('spielt ohne Stimme in voller Grundlautstärke', () => {
    expect(musicVolumeAt(60, base)).toBeCloseTo(0.5);
  });

  it('senkt die Musik ab, solange gesprochen wird', () => {
    const captions = [word('Hallo', 1000, 1600)];
    expect(musicVolumeAt(36, {...base, captions})).toBeCloseTo(0.15); // 1200 ms: mitten im Wort
    expect(musicVolumeAt(90, {...base, captions})).toBeCloseTo(0.5); // 3000 ms: weit weg
  });

  it('blendet das Absenken weich ein statt zu springen', () => {
    const captions = [word('Hallo', 1000, 1600)];
    const before = musicVolumeAt(26, {...base, captions}); // ≈ 867 ms, 133 ms vor dem Wort
    expect(before).toBeGreaterThan(0.15);
    expect(before).toBeLessThan(0.5);
  });

  it('blendet am Anfang ein und am Ende aus', () => {
    const o = {...base, fadeInFrames: 15, fadeOutFrames: 30};
    expect(musicVolumeAt(0, o)).toBe(0);
    expect(musicVolumeAt(300, o)).toBe(0);
    expect(musicVolumeAt(150, o)).toBeCloseTo(0.5);
  });
});

describe('scenesDuration', () => {
  it('zieht Übergangsüberlappungen ab, harte Schnitte nicht', () => {
    const items: SceneItem[] = [
      {duration: 60, content: null},
      {duration: 80, content: null, transition: 'fade'},
      {duration: 90, content: null},
      {duration: 50, content: null, transition: 'slide-up', transitionFrames: 10},
    ];
    expect(scenesDuration(items)).toBe(60 + 80 - 14 + 90 + 50 - 10);
  });
});

describe('formatOf', () => {
  it('erkennt die Standardformate', () => {
    expect(formatOf(1080, 1920)).toBe('vertical');
    expect(formatOf(1920, 1080)).toBe('landscape');
    expect(formatOf(1080, 1080)).toBe('square');
    expect(formatOf(1080, 1350)).toBe('portrait');
  });
});
