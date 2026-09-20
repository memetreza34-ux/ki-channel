import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AI_SKETCH_WEBSITE_SCENES} from './contract';
import {AI_SKETCH_WEBSITE_VISUAL_PROFILES} from './visualProfiles';

const visualsSource = readFileSync(
  resolve('ki/src/reels/ai-sketch-website/Visuals.tsx'),
  'utf8',
);

describe('AI sketch website authored visual diversity', () => {
  it('covers every authored scene in production order', () => {
    expect(AI_SKETCH_WEBSITE_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual(
      AI_SKETCH_WEBSITE_SCENES.map((scene) => scene.sceneId),
    );
  });

  it('passes the canonical authored diversity gate with at least four primary grammars', () => {
    const result = evaluateAuthoredVisualDiversity(AI_SKETCH_WEBSITE_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(4);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
  });

  it('does not regress to the former shared card-template visual grammar', () => {
    expect(visualsSource).not.toContain('const card:React.CSSProperties');
    expect(visualsSource).toContain('SketchMeaningVisual');
    expect(visualsSource).toContain('StructureVisual');
    expect(visualsSource).toContain('LayoutVisual');
    expect(visualsSource).toContain('FunctionVisual');
    expect(visualsSource).toContain('TestPrototypeVisual');
    expect(visualsSource).toContain('<svg');
    expect(visualsSource).toContain('perspective:1100');
  });
});
