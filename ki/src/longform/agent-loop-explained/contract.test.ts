import {describe,expect,it} from 'vitest';
import {AGENT_LOOP_CHAPTERS,AGENT_LOOP_DURATION_IN_FRAMES,AGENT_LOOP_FPS,AGENT_LOOP_HEIGHT,AGENT_LOOP_TOTAL_VISUAL_BEATS,AGENT_LOOP_WIDTH} from './contract';

describe('agent loop longform contract',()=>{
  it('uses the current 16:9 YouTube standard',()=>{
    expect(AGENT_LOOP_WIDTH).toBe(1920);
    expect(AGENT_LOOP_HEIGHT).toBe(1080);
    expect(AGENT_LOOP_FPS).toBe(30);
  });
  it('keeps the Phase-1 baseline inside 5–6 minutes',()=>{
    expect(AGENT_LOOP_DURATION_IN_FRAMES).toBeGreaterThanOrEqual(300*30);
    expect(AGENT_LOOP_DURATION_IN_FRAMES).toBeLessThanOrEqual(360*30);
  });
  it('has continuous chapters covering the whole baseline',()=>{
    expect(AGENT_LOOP_CHAPTERS[0].startFrame).toBe(0);
    AGENT_LOOP_CHAPTERS.slice(1).forEach((c,i)=>expect(c.startFrame).toBe(AGENT_LOOP_CHAPTERS[i].endFrame));
    expect(AGENT_LOOP_CHAPTERS.at(-1)?.endFrame).toBe(AGENT_LOOP_DURATION_IN_FRAMES);
  });
  it('keeps all 46 planned visual beats in the executable contract',()=>{
    expect(AGENT_LOOP_TOTAL_VISUAL_BEATS).toBe(46);
    AGENT_LOOP_CHAPTERS.forEach(c=>{
      const duration=c.endFrame-c.startFrame;
      expect(new Set(c.beatFrames).size).toBe(c.beatFrames.length);
      c.beatFrames.forEach(frame=>{expect(frame).toBeGreaterThan(0);expect(frame).toBeLessThan(duration);});
    });
  });
});
