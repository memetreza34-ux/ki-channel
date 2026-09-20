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
const v2Source = readFileSync(
  resolve('ki/src/longform/ai-app-workflow/CreativeVisualsV2.tsx'),
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

  it('keeps production wired to V2 instead of the legacy card-heavy layer', () => {
    expect(productionSource).toContain("from './CreativeVisualsV2'");
    expect(productionSource).not.toContain("from './Visuals'");
    expect(v2Source).not.toContain('const card:React.CSSProperties');
    expect(v2Source).not.toContain('const AppWindow');
    expect(v2Source).not.toContain('const Chip');
    expect(v2Source).toContain('perspective:1100');
    expect(v2Source).toContain('perspective:1150');
  });
});
