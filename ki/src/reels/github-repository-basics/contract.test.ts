import {describe,expect,it} from 'vitest';
import {GITHUB_REPOSITORY_CAPTION_ZONE_Y,GITHUB_REPOSITORY_DURATION_IN_FRAMES,GITHUB_REPOSITORY_SCENES,GITHUB_REPOSITORY_SUBTITLES} from './contract';

describe('GitHub repository reel contract',()=>{
  it('covers the full timeline with five contiguous scenes',()=>{
    expect(GITHUB_REPOSITORY_SCENES).toHaveLength(5);
    expect(GITHUB_REPOSITORY_SCENES[0]?.startFrame).toBe(0);
    expect(GITHUB_REPOSITORY_SCENES.at(-1)?.endFrame).toBe(GITHUB_REPOSITORY_DURATION_IN_FRAMES);
    for(let i=1;i<GITHUB_REPOSITORY_SCENES.length;i++) expect(GITHUB_REPOSITORY_SCENES[i-1]?.endFrame).toBe(GITHUB_REPOSITORY_SCENES[i]?.startFrame);
  });
  it('keeps the caption zone hard and all cues valid',()=>{
    expect(GITHUB_REPOSITORY_CAPTION_ZONE_Y).toBe(1440);
    for(const cue of GITHUB_REPOSITORY_SUBTITLES){expect(cue.startFrame).toBeGreaterThanOrEqual(0);expect(cue.endFrame).toBeLessThanOrEqual(GITHUB_REPOSITORY_DURATION_IN_FRAMES);expect(cue.endFrame).toBeGreaterThan(cue.startFrame);}
  });
  it('keeps planned subtitle cues contiguous',()=>{
    for(let i=1;i<GITHUB_REPOSITORY_SUBTITLES.length;i++) expect(GITHUB_REPOSITORY_SUBTITLES[i]?.startFrame).toBe(GITHUB_REPOSITORY_SUBTITLES[i-1]?.endFrame);
  });
});
