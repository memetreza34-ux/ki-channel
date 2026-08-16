import {describe,expect,it} from 'vitest';
import {AI_APP_WORKFLOW_CHAPTERS,AI_APP_WORKFLOW_DURATION_IN_FRAMES,AI_APP_WORKFLOW_FPS,AI_APP_WORKFLOW_HEIGHT,AI_APP_WORKFLOW_WIDTH} from './contract';

describe('AI app workflow longform contract',()=>{
  it('uses the current 16:9 YouTube standard',()=>{
    expect(AI_APP_WORKFLOW_WIDTH).toBe(1920);
    expect(AI_APP_WORKFLOW_HEIGHT).toBe(1080);
    expect(AI_APP_WORKFLOW_FPS).toBe(30);
  });
  it('keeps the Phase-1 baseline inside 5–6 minutes',()=>{
    expect(AI_APP_WORKFLOW_DURATION_IN_FRAMES).toBeGreaterThanOrEqual(300*30);
    expect(AI_APP_WORKFLOW_DURATION_IN_FRAMES).toBeLessThanOrEqual(360*30);
  });
  it('has continuous chapters covering the whole baseline',()=>{
    expect(AI_APP_WORKFLOW_CHAPTERS[0].startFrame).toBe(0);
    AI_APP_WORKFLOW_CHAPTERS.slice(1).forEach((c,i)=>expect(c.startFrame).toBe(AI_APP_WORKFLOW_CHAPTERS[i].endFrame));
    expect(AI_APP_WORKFLOW_CHAPTERS.at(-1)?.endFrame).toBe(AI_APP_WORKFLOW_DURATION_IN_FRAMES);
  });
});
