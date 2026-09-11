import {describe, expect, it} from 'vitest';
import {ASTRA_FPS, ASTRA_HEIGHT, ASTRA_WIDTH} from './index';
import {assertAstraTimeline, type AstraTimeline} from './types';

const validTimeline = (): AstraTimeline => ({
  contract: 'ASTRA_VOICE_LOCK_V1',
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 180,
  voiceoverStaticPath: 'runtime-audio/KI-GPT6-Astra-Agenten-Kontrolle.wav',
  beats: [
    {id: 'beat-1', chapterId: 'chapter-01', startFrame: 0, endFrame: 90, kind: 'AGENT_WORKSPACE'},
    {id: 'beat-2', chapterId: 'chapter-01', startFrame: 90, endFrame: 180, kind: 'CONTROL_STACK'},
  ],
});

describe('GPT-6 Astra clean longform contract', () => {
  it('uses the canonical 16:9 YouTube format', () => {
    expect(ASTRA_WIDTH).toBe(1920);
    expect(ASTRA_HEIGHT).toBe(1080);
    expect(ASTRA_FPS).toBe(30);
  });

  it('accepts only a real voice-locked positive timeline', () => {
    expect(() => assertAstraTimeline(validTimeline())).not.toThrow();
    const invalid = validTimeline();
    invalid.durationInFrames = 0;
    expect(() => assertAstraTimeline(invalid)).toThrow(/real voice-locked duration/i);
  });

  it('rejects overlapping visual beats instead of hiding timing mistakes', () => {
    const invalid = validTimeline();
    invalid.beats[1] = {...invalid.beats[1], startFrame: 60};
    expect(() => assertAstraTimeline(invalid)).toThrow(/overlapping beat timing/i);
  });

  it('rejects source or real-media beats without an approved local static path', () => {
    const invalid = validTimeline();
    invalid.beats[0] = {...invalid.beats[0], kind: 'SOURCE_PROOF'};
    expect(() => assertAstraTimeline(invalid)).toThrow(/approved local assetStaticPath/i);
  });

  it('does not encode equal fixed chapter durations in the source contract', () => {
    const text = JSON.stringify(validTimeline());
    expect(text).not.toContain('1000');
  });
});
