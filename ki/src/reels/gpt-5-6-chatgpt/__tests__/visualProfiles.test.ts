import {describe,expect,it} from 'vitest';
import {assertAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {GPT56_VISUAL_PROFILES} from '../visualProfiles';

describe('GPT-5.6 visual profiles',()=>{
  it('defines seven distinct authored scenes',()=>{expect(GPT56_VISUAL_PROFILES).toHaveLength(7);expect(new Set(GPT56_VISUAL_PROFILES.map((scene)=>scene.visualId)).size).toBe(7)});
  it('passes authored diversity gate',()=>{expect(()=>assertAuthoredVisualDiversity(GPT56_VISUAL_PROFILES)).not.toThrow()});
});
