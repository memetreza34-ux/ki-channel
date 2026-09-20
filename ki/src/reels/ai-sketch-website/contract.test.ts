import {describe,expect,it} from 'vitest';
import {AI_SKETCH_WEBSITE_CAPTION_ZONE_Y,AI_SKETCH_WEBSITE_DURATION_IN_FRAMES,AI_SKETCH_WEBSITE_SCENES,AI_SKETCH_WEBSITE_SUBTITLES} from './contract';

describe('AI sketch website reel contract',()=>{
  it('covers full timeline with five contiguous scenes',()=>{
    expect(AI_SKETCH_WEBSITE_SCENES).toHaveLength(5);
    expect(AI_SKETCH_WEBSITE_SCENES[0]?.startFrame).toBe(0);
    expect(AI_SKETCH_WEBSITE_SCENES[AI_SKETCH_WEBSITE_SCENES.length-1]?.endFrame).toBe(AI_SKETCH_WEBSITE_DURATION_IN_FRAMES);
    for(let i=1;i<AI_SKETCH_WEBSITE_SCENES.length;i++)expect(AI_SKETCH_WEBSITE_SCENES[i-1]?.endFrame).toBe(AI_SKETCH_WEBSITE_SCENES[i]?.startFrame);
  });
  it('protects caption zone and timeline',()=>{
    expect(AI_SKETCH_WEBSITE_CAPTION_ZONE_Y).toBe(1440);
    for(const cue of AI_SKETCH_WEBSITE_SUBTITLES){expect(cue.startFrame).toBeGreaterThanOrEqual(0);expect(cue.endFrame).toBeLessThanOrEqual(AI_SKETCH_WEBSITE_DURATION_IN_FRAMES);expect(cue.endFrame).toBeGreaterThan(cue.startFrame);}
  });
  it('has contiguous subtitle coverage',()=>{for(let i=1;i<AI_SKETCH_WEBSITE_SUBTITLES.length;i++)expect(AI_SKETCH_WEBSITE_SUBTITLES[i]?.startFrame).toBe(AI_SKETCH_WEBSITE_SUBTITLES[i-1]?.endFrame);});
});
