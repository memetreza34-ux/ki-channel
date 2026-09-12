import {describe,expect,it} from 'vitest';
import {REMOTION_SHOWCASE_DURATION_IN_FRAMES,REMOTION_SHOWCASE_FPS,REMOTION_SHOWCASE_HEIGHT,REMOTION_SHOWCASE_WIDTH,SHOWCASE_SCENES} from './contract';

describe('Remotion motion showcase contract',()=>{
  it('uses 16:9 1080p at 30fps',()=>{
    expect(REMOTION_SHOWCASE_WIDTH).toBe(1920);
    expect(REMOTION_SHOWCASE_HEIGHT).toBe(1080);
    expect(REMOTION_SHOWCASE_FPS).toBe(30);
  });
  it('is exactly 40 seconds and has seven distinct scenes',()=>{
    expect(REMOTION_SHOWCASE_DURATION_IN_FRAMES).toBe(1200);
    expect(SHOWCASE_SCENES).toHaveLength(7);
    expect(new Set(SHOWCASE_SCENES.map((scene)=>scene.id)).size).toBe(7);
  });
  it('covers the whole timeline without gaps or overlaps',()=>{
    expect(SHOWCASE_SCENES[0].from).toBe(0);
    for(let i=1;i<SHOWCASE_SCENES.length;i++){
      expect(SHOWCASE_SCENES[i].from).toBe(SHOWCASE_SCENES[i-1].from+SHOWCASE_SCENES[i-1].duration);
    }
    const last=SHOWCASE_SCENES.at(-1)!;
    expect(last.from+last.duration).toBe(REMOTION_SHOWCASE_DURATION_IN_FRAMES);
  });
});
