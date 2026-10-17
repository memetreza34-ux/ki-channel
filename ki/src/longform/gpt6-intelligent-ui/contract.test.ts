import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {
  INTELLIGENT_UI_CHAPTERS, INTELLIGENT_UI_DURATION_IN_FRAMES,
  INTELLIGENT_UI_WIDTH, INTELLIGENT_UI_HEIGHT, INTELLIGENT_UI_FPS,
  assertIntelligentUIContract,
} from './contract';
import {INTELLIGENT_UI_VISUAL_PROFILES} from './visualProfiles';

describe('GPT-6 Intelligent UI – longform production contract', () => {
  it('uses 16:9 1080p and 30fps', () => {
    expect([INTELLIGENT_UI_WIDTH,INTELLIGENT_UI_HEIGHT,INTELLIGENT_UI_FPS]).toEqual([1920,1080,30]);
  });
  it('holds an honest 5–6 minute Phase-1 baseline', () => {
    expect(INTELLIGENT_UI_DURATION_IN_FRAMES).toBeGreaterThanOrEqual(30*300);
    expect(INTELLIGENT_UI_DURATION_IN_FRAMES).toBeLessThanOrEqual(30*360);
  });
  it('has gap-free chapters and matching fingerprints', () => {
    expect(()=>assertIntelligentUIContract()).not.toThrow();
    expect(INTELLIGENT_UI_CHAPTERS).toHaveLength(8);
    expect(INTELLIGENT_UI_VISUAL_PROFILES.map(x=>x.sceneId)).toEqual(INTELLIGENT_UI_CHAPTERS.map(x=>x.id));
    expect(evaluateAuthoredVisualDiversity(INTELLIGENT_UI_VISUAL_PROFILES).passed).toBe(true);
  });
  it('contains more than card layouts, with no fake capture', () => {
    const source=readFileSync(resolve('ki/src/longform/gpt6-intelligent-ui/IntelligentUIVisuals.tsx'),'utf8');
    expect(source).toContain('SCHEMATISCHE ILLUSTRATION');
    expect(source).toContain('SPARBEISPIEL');
    expect(source).toContain('STROMKREIS');
    expect(source).not.toContain('Math.random');
    expect(new Set(INTELLIGENT_UI_VISUAL_PROFILES.map(x=>x.fingerprint.primaryPrimitive)).size).toBeGreaterThanOrEqual(6);
  });
});
