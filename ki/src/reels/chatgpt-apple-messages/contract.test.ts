import {describe,expect,it} from 'vitest';
import {APPLE_MESSAGES_COMPOSITION_ID,APPLE_MESSAGES_DURATION_IN_FRAMES,APPLE_MESSAGES_FPS,APPLE_MESSAGES_HEIGHT,APPLE_MESSAGES_SCENES,APPLE_MESSAGES_WIDTH} from './contract';

describe('ChatGPT Apple Messages reel contract',()=>{
  it('uses vertical production geometry',()=>{expect(APPLE_MESSAGES_COMPOSITION_ID).toBe('KI-ChatGPTAppleMessages');expect(APPLE_MESSAGES_WIDTH).toBe(1080);expect(APPLE_MESSAGES_HEIGHT).toBe(1920);expect(APPLE_MESSAGES_FPS).toBe(30);});
  it('has five continuous scenes',()=>{expect(APPLE_MESSAGES_SCENES).toHaveLength(5);expect(APPLE_MESSAGES_SCENES[0]?.startFrame).toBe(0);for(let i=1;i<APPLE_MESSAGES_SCENES.length;i++)expect(APPLE_MESSAGES_SCENES[i]?.startFrame).toBe(APPLE_MESSAGES_SCENES[i-1]?.endFrame);expect(APPLE_MESSAGES_SCENES.at(-1)?.endFrame).toBe(APPLE_MESSAGES_DURATION_IN_FRAMES);});
});
