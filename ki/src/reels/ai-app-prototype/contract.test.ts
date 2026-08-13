import {describe, expect, it} from 'vitest';
import {AI_APP_CAPTION_ZONE_Y, AI_APP_DURATION_IN_FRAMES, AI_APP_SCENES, AI_APP_SUBTITLES} from './contract';

describe('AI app prototype reel contract',()=>{
  it('has five contiguous NEW_BUILD scene slots across the full baseline',()=>{
    expect(AI_APP_SCENES).toHaveLength(5);
    expect(AI_APP_SCENES[0]?.startFrame).toBe(0);
    expect(AI_APP_SCENES.at(-1)?.endFrame).toBe(AI_APP_DURATION_IN_FRAMES);
    for(let i=1;i<AI_APP_SCENES.length;i++) expect(AI_APP_SCENES[i]?.startFrame).toBe(AI_APP_SCENES[i-1]?.endFrame);
  });

  it('reserves the hard caption zone',()=>{
    expect(AI_APP_CAPTION_ZONE_Y).toBe(1440);
  });

  it('keeps baseline caption coverage contiguous through the reel',()=>{
    expect(AI_APP_SUBTITLES[0]?.startFrame).toBe(0);
    expect(AI_APP_SUBTITLES.at(-1)?.endFrame).toBe(AI_APP_DURATION_IN_FRAMES);
    for(let i=1;i<AI_APP_SUBTITLES.length;i++) expect(AI_APP_SUBTITLES[i]?.startFrame).toBe(AI_APP_SUBTITLES[i-1]?.endFrame);
  });

  it('keeps short chapter headers for mobile readability',()=>{
    for(const scene of AI_APP_SCENES) expect(scene.headline.length).toBeLessThanOrEqual(28);
  });
});
