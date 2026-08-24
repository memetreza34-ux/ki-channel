import {describe, expect, it} from 'vitest';
import {
  STUDY_MODE_COMPOSITION_ID,
  STUDY_MODE_DURATION_IN_FRAMES,
  STUDY_MODE_FPS,
  STUDY_MODE_HEIGHT,
  STUDY_MODE_SCENES,
  STUDY_MODE_WIDTH,
} from './contract';

describe('ChatGPT Study Mode reel contract',()=>{
  it('uses vertical short-form geometry',()=>{
    expect(STUDY_MODE_COMPOSITION_ID).toBe('KI-ChatGPTStudyMode');
    expect(STUDY_MODE_WIDTH).toBe(1080);
    expect(STUDY_MODE_HEIGHT).toBe(1920);
    expect(STUDY_MODE_FPS).toBe(30);
  });

  it('derives one continuous timeline from reel.json',()=>{
    expect(STUDY_MODE_SCENES).toHaveLength(5);
    expect(STUDY_MODE_SCENES[0]?.startFrame).toBe(0);
    for(let i=1;i<STUDY_MODE_SCENES.length;i++){
      expect(STUDY_MODE_SCENES[i]?.startFrame).toBe(STUDY_MODE_SCENES[i-1]?.endFrame);
    }
    expect(STUDY_MODE_SCENES.at(-1)?.endFrame).toBe(STUDY_MODE_DURATION_IN_FRAMES);
  });
});
