import {describe, expect, it} from 'vitest';
import {
  CHATGPT_TEENS_COMPOSITION_ID,
  CHATGPT_TEENS_DURATION_IN_FRAMES,
  CHATGPT_TEENS_SCENES,
  TEEN_VISIBLE_COPY,
} from './contract';

const forbiddenLegacyCopy = [
  'NOVA',
  'CREATIVE BRIEF',
  'WERBECLIP',
  'Produkt bleibt konsistent',
  'KEYFRAME',
  'MOTION',
  'ZIELGRUPPE',
  'STIMMUNG',
];

describe('ChatGPT for Teens contract', () => {
  it('uses the dedicated composition identity', () => {
    expect(CHATGPT_TEENS_COMPOSITION_ID).toBe('KI-ChatGPTForTeens');
  });

  it('has five continuous non-overlapping scenes', () => {
    expect(CHATGPT_TEENS_SCENES).toHaveLength(5);
    expect(CHATGPT_TEENS_SCENES[0]?.startFrame).toBe(0);
    for (let i = 1; i < CHATGPT_TEENS_SCENES.length; i++) {
      expect(CHATGPT_TEENS_SCENES[i]?.startFrame).toBe(CHATGPT_TEENS_SCENES[i - 1]?.endFrame);
    }
    expect(CHATGPT_TEENS_SCENES.at(-1)?.endFrame).toBe(CHATGPT_TEENS_DURATION_IN_FRAMES);
  });

  it('contains only teen-relevant visible copy', () => {
    const copy = JSON.stringify(TEEN_VISIBLE_COPY);
    for (const forbidden of forbiddenLegacyCopy) expect(copy).not.toContain(forbidden);
    for (const required of ['ChatGPT', 'TEEN', 'Altersschätzung', 'Study Mode', 'Schutz aktiv', 'Chats bleiben privat']) {
      expect(copy).toContain(required);
    }
  });
});
