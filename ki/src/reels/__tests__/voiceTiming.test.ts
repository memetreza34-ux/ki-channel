import {describe, expect, it} from 'vitest';
import {createVoiceTiming} from '../voiceTiming';

describe('voiceTiming', () => {
  const scenes = [
    {sceneId: 'scene1', startFrame: 0, endFrame: 120},
    {sceneId: 'scene2', startFrame: 120, endFrame: 240},
  ];
  const cues = [
    {
      sceneId: 'scene1',
      sentenceId: 's01',
      startFrame: 12,
      endFrame: 80,
      text: 'Nur das Ziel ist wichtig',
      words: [
        {text: 'Nur', startFrame: 12, endFrame: 20},
        {text: 'das', startFrame: 21, endFrame: 28},
        {text: 'Ziel', startFrame: 29, endFrame: 40},
        {text: 'ist', startFrame: 41, endFrame: 50},
        {text: 'wichtig', startFrame: 52, endFrame: 80},
      ],
    },
    {
      sceneId: 'scene2',
      sentenceId: 's02',
      startFrame: 135,
      endFrame: 210,
      text: 'Tool ausführen und Ergebnis prüfen',
      words: [
        {text: 'Tool', startFrame: 135, endFrame: 150},
        {text: 'ausführen', startFrame: 151, endFrame: 170},
        {text: 'und', startFrame: 171, endFrame: 179},
        {text: 'Ergebnis', startFrame: 180, endFrame: 195},
        {text: 'prüfen', startFrame: 196, endFrame: 210},
      ],
    },
  ];

  it('converts absolute aligned word timing into scene-local phrase frames', () => {
    const timing = createVoiceTiming(cues, scenes);
    expect(timing.phraseFrame('scene1', 's01', 'das Ziel', 0.9)).toBe(21);
    expect(timing.phraseFrame('scene2', 's02', 'Ergebnis prüfen', 0.1)).toBe(60);
  });

  it('uses aligned sentence windows when available', () => {
    const timing = createVoiceTiming(cues, scenes);
    expect(timing.sentenceWindow('scene2', 's02', 0.1, 0.9)).toEqual({start: 15, end: 90});
  });

  it('uses ratio fallback only when no aligned phrase exists', () => {
    const timing = createVoiceTiming(cues, scenes);
    expect(timing.phraseFrame('scene1', 's01', 'nicht vorhanden', 0.5)).toBe(60);
  });
});
