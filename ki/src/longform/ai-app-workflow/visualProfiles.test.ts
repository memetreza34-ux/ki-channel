import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AI_APP_WORKFLOW_CHAPTERS} from './contract';
import {AI_APP_WORKFLOW_VISUAL_PROFILES} from './visualProfiles';

const productionSource = readFileSync(
  resolve('ki/src/longform/ai-app-workflow/LongformAIAppWorkflow.tsx'),
  'utf8',
);
const v3Source = readFileSync(
  resolve('ki/src/longform/ai-app-workflow/CreativeVisualsV3.tsx'),
  'utf8',
);

describe('AI app workflow longform visual diversity', () => {
  it('covers all longform chapters in exact production order', () => {
    expect(AI_APP_WORKFLOW_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual(
      AI_APP_WORKFLOW_CHAPTERS.map((chapter) => chapter.id),
    );
  });

  it('passes the authored diversity gate with broad visual grammar coverage', () => {
    const result = evaluateAuthoredVisualDiversity(AI_APP_WORKFLOW_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(5);
    expect(result.uniqueLayoutCount).toBe(8);
    expect(result.uniqueMotionCount).toBe(8);
  });

  it('keeps production wired to cinematic V3 instead of legacy visual layers', () => {
    expect(productionSource).toContain("from './CreativeVisualsV3'");
    expect(productionSource).not.toContain("from './Visuals'");
    expect(productionSource).not.toContain("from './CreativeVisualsV2'");
    expect(v3Source).not.toContain('const card:React.CSSProperties');
    expect(v3Source).not.toContain('const AppWindow');
    expect(v3Source).not.toContain('const Chip');
    expect(v3Source).toContain('perspective:1300');
    expect(v3Source).toContain('darkSurface');
  });
});
