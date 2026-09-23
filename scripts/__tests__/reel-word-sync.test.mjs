import assert from 'node:assert/strict';
import test from 'node:test';

import {alignExactWordTimings, normalizeSpokenWord} from '../sync-reel-word-timings.mjs';

const caption = (text, startMs, endMs) => ({
  text,
  startMs,
  endMs,
  timestampMs: Math.round((startMs + endMs) / 2),
  confidence: 0.99,
});

test('normalizeSpokenWord ignores punctuation but preserves the spoken word', () => {
  assert.equal(normalizeSpokenWord('„Richtung.“'), 'richtung');
  assert.equal(normalizeSpokenWord('KI'), 'ki');
});

test('alignExactWordTimings writes exact frames and preserves authored cue text', () => {
  const subtitlePlan = {
    version: 1,
    fps: 30,
    cues: [
      {sceneId: 's1', startFrame: 0, endFrame: 60, text: 'Wenn dein Prompt offen ist,'},
      {sceneId: 's1', startFrame: 60, endFrame: 120, text: 'braucht die KI Richtung.'},
    ],
  };
  const captions = [
    caption('Wenn', 100, 300),
    caption(' dein', 320, 520),
    caption(' Prompt', 540, 840),
    caption(' offen', 860, 1080),
    caption(' ist,', 1100, 1260),
    caption(' braucht', 1320, 1540),
    caption(' die', 1560, 1660),
    caption(' KI', 1680, 1810),
    caption(' Richtung.', 1830, 2140),
  ];

  const result = alignExactWordTimings({subtitlePlan, captions, fps: 30});
  assert.equal(result.exactWordTimings, true);
  assert.equal(result.timingSource, 'whisper.cpp-token-level-final-audio');
  assert.equal(result.cues[0].text, 'Wenn dein Prompt offen ist,');
  assert.deepEqual(result.cues[0].words.map((word) => word.text), ['Wenn', 'dein', 'Prompt', 'offen', 'ist']);
  assert.equal(result.cues[0].startFrame, 3);
  assert.equal(result.cues[0].endFrame, 38);
  assert.equal(result.cues[1].words[3].text, 'Richtung');
  assert.equal(result.cues[1].words[3].startFrame, 54);
  assert.equal(result.cues[1].words[3].endFrame, 65);
});

test('alignExactWordTimings refuses a Whisper/script mismatch instead of estimating', () => {
  const subtitlePlan = {
    fps: 30,
    cues: [{sceneId: 's1', startFrame: 0, endFrame: 30, text: 'mehr Richtung'}],
  };
  const captions = [caption('mehr', 0, 200), caption(' Rätsel', 220, 500)];

  assert.throws(
    () => alignExactWordTimings({subtitlePlan, captions, fps: 30}),
    /Wortabweichung.*Richtung.*Rätsel/i,
  );
});
