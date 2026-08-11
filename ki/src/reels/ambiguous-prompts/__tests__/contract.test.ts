import {describe, expect, it} from 'vitest';
import {
  AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y,
  AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES,
  AMBIGUOUS_PROMPTS_SCENES,
  AMBIGUOUS_PROMPTS_SUBTITLES,
  assertAmbiguousPromptsContract,
} from '../contract';

describe('ambiguous-prompts production contract',()=>{
  it('keeps the phase-1 reel structurally valid',()=>{
    expect(()=>assertAmbiguousPromptsContract()).not.toThrow();
    expect(AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES).toBe(1740);
    expect(AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y).toBe(1440);
    expect(AMBIGUOUS_PROMPTS_SCENES).toHaveLength(5);
  });

  it('uses only reel-specific new-build scenes and twelve unique beats',()=>{
    expect(AMBIGUOUS_PROMPTS_SCENES.every((scene)=>scene.implementation==='NEW_BUILD')).toBe(true);
    const beats=AMBIGUOUS_PROMPTS_SCENES.flatMap((scene)=>[...scene.beatIds]);
    expect(beats).toHaveLength(12);
    expect(new Set(beats).size).toBe(12);
  });

  it('keeps captions inside scene ranges',()=>{
    for(const cue of AMBIGUOUS_PROMPTS_SUBTITLES){
      const scene=AMBIGUOUS_PROMPTS_SCENES.find((candidate)=>candidate.sceneId===cue.sceneId);
      expect(scene).toBeDefined();
      expect(cue.startFrame).toBeGreaterThanOrEqual(scene!.startFrame);
      expect(cue.endFrame).toBeLessThanOrEqual(scene!.endFrame);
    }
  });
});
