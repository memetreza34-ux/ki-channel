import {describe,expect,it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {VISION_PHOTO_VISUAL_PROFILES} from '../visualProfiles';

describe('vision photo visual diversity',()=>{
  it('keeps five distinct authored scene grammars',()=>{
    const result=evaluateAuthoredVisualDiversity(VISION_PHOTO_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(VISION_PHOTO_VISUAL_PROFILES).toHaveLength(5);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
  });
});
