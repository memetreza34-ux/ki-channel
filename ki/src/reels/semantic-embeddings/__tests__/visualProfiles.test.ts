import {describe,expect,it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {SEMANTIC_EMBEDDINGS_VISUAL_PROFILES} from '../visualProfiles';

describe('semantic embeddings visual profiles',()=>{
  it('uses distinct layouts and motion signatures',()=>{expect(new Set(SEMANTIC_EMBEDDINGS_VISUAL_PROFILES.map((item)=>item.fingerprint.layoutFamily)).size).toBe(5);expect(new Set(SEMANTIC_EMBEDDINGS_VISUAL_PROFILES.map((item)=>item.fingerprint.motionSignature)).size).toBe(5);});
  it('passes authored diversity gate',()=>{expect(evaluateAuthoredVisualDiversity(SEMANTIC_EMBEDDINGS_VISUAL_PROFILES).passed).toBe(true);});
});
