import {describe,expect,it} from 'vitest';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {assertScenesContiguous,assertSubtitlesWithinScenes,assertVerticalFormat} from '../__test-utils__/assertReelContract';
import {
  CHATGPT_ADS_GERMANY_DURATION_IN_FRAMES,
  CHATGPT_ADS_GERMANY_FPS,
  CHATGPT_ADS_GERMANY_HEIGHT,
  CHATGPT_ADS_GERMANY_SCENES,
  CHATGPT_ADS_GERMANY_SUBTITLES,
  CHATGPT_ADS_GERMANY_WIDTH,
} from './contract';

describe('ChatGPT Ads Germany reel contract',()=>{
  it('uses vertical production format',()=>{
    assertVerticalFormat(CHATGPT_ADS_GERMANY_WIDTH,CHATGPT_ADS_GERMANY_HEIGHT,CHATGPT_ADS_GERMANY_FPS);
    expect(CHATGPT_ADS_GERMANY_DURATION_IN_FRAMES/CHATGPT_ADS_GERMANY_FPS).toBeCloseTo(53,1);
  });
  it('has five contiguous scenes',()=>{
    expect(CHATGPT_ADS_GERMANY_SCENES).toHaveLength(5);
    assertScenesContiguous(CHATGPT_ADS_GERMANY_SCENES,CHATGPT_ADS_GERMANY_DURATION_IN_FRAMES);
  });
  it('keeps preview cues inside scenes',()=>{
    assertSubtitlesWithinScenes(CHATGPT_ADS_GERMANY_SUBTITLES,CHATGPT_ADS_GERMANY_SCENES);
  });
  it('uses canonical caption safe geometry',()=>{
    expect(REEL_CAPTION_SAFE.bottom).toBe(520);
    expect(REEL_CAPTION_SAFE.horizontalInset).toBe(104);
    expect(REEL_CAPTION_SAFE.maxWidth).toBe(820);
  });
  it('keeps unique scene ids and concise headlines',()=>{
    const ids=CHATGPT_ADS_GERMANY_SCENES.map(s=>s.sceneId);
    expect(new Set(ids).size).toBe(ids.length);
    CHATGPT_ADS_GERMANY_SCENES.forEach(s=>expect(s.headline.trim().split(/\s+/).length).toBeLessThanOrEqual(6));
  });
});
