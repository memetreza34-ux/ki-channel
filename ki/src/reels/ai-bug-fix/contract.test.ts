import {describe, expect, it} from 'vitest';
import {AI_BUG_FIX_CAPTION_ZONE_Y, AI_BUG_FIX_DURATION_IN_FRAMES, AI_BUG_FIX_SCENES, AI_BUG_FIX_SUBTITLES} from './contract';

describe('AI bug fix reel contract',()=>{
  it('covers the full timeline with five contiguous scenes',()=>{
    expect(AI_BUG_FIX_SCENES).toHaveLength(5);
    expect(AI_BUG_FIX_SCENES[0]?.startFrame).toBe(0);
    expect(AI_BUG_FIX_SCENES.at(-1)?.endFrame).toBe(AI_BUG_FIX_DURATION_IN_FRAMES);
    for(let i=1;i<AI_BUG_FIX_SCENES.length;i++)expect(AI_BUG_FIX_SCENES[i-1]?.endFrame).toBe(AI_BUG_FIX_SCENES[i]?.startFrame);
  });
  it('keeps the hard caption zone and cues inside duration',()=>{
    expect(AI_BUG_FIX_CAPTION_ZONE_Y).toBe(1440);
    for(const cue of AI_BUG_FIX_SUBTITLES){expect(cue.startFrame).toBeGreaterThanOrEqual(0);expect(cue.endFrame).toBeLessThanOrEqual(AI_BUG_FIX_DURATION_IN_FRAMES);expect(cue.endFrame).toBeGreaterThan(cue.startFrame);}
  });
  it('has contiguous planned subtitle coverage',()=>{
    expect(AI_BUG_FIX_SUBTITLES[0]?.startFrame).toBe(0);
    expect(AI_BUG_FIX_SUBTITLES.at(-1)?.endFrame).toBe(AI_BUG_FIX_DURATION_IN_FRAMES);
    for(let i=1;i<AI_BUG_FIX_SUBTITLES.length;i++)expect(AI_BUG_FIX_SUBTITLES[i]?.startFrame).toBe(AI_BUG_FIX_SUBTITLES[i-1]?.endFrame);
  });
});
