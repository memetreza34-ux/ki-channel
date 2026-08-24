import {describe,expect,it} from 'vitest';
import {DALLE_ENDS_COMPOSITION_ID,DALLE_ENDS_DURATION_IN_FRAMES,DALLE_ENDS_FPS,DALLE_ENDS_HEIGHT,DALLE_ENDS_SCENES,DALLE_ENDS_WIDTH} from './contract';

describe('DALL-E GPT ends reel contract',()=>{
  it('uses vertical reel geometry',()=>{
    expect(DALLE_ENDS_COMPOSITION_ID).toBe('KI-DalleGptEnds');
    expect(DALLE_ENDS_WIDTH).toBe(1080);
    expect(DALLE_ENDS_HEIGHT).toBe(1920);
    expect(DALLE_ENDS_FPS).toBe(30);
  });
  it('has five continuous scenes',()=>{
    expect(DALLE_ENDS_SCENES).toHaveLength(5);
    expect(DALLE_ENDS_SCENES[0]?.startFrame).toBe(0);
    for(let i=1;i<DALLE_ENDS_SCENES.length;i++) expect(DALLE_ENDS_SCENES[i]?.startFrame).toBe(DALLE_ENDS_SCENES[i-1]?.endFrame);
    expect(DALLE_ENDS_SCENES.at(-1)?.endFrame).toBe(DALLE_ENDS_DURATION_IN_FRAMES);
  });
});
