import {describe,expect,it} from 'vitest';
import {GPT56_DURATION_IN_FRAMES,GPT56_SCENES,GPT56_SUBTITLES,assertGpt56Contract} from '../contract';

describe('GPT-5.6 ChatGPT reel contract',()=>{
  it('covers seven contiguous scenes and fourteen beats',()=>{expect(GPT56_SCENES).toHaveLength(7);expect(new Set(GPT56_SCENES.flatMap((scene)=>[...scene.beatIds])).size).toBe(14);expect(GPT56_SCENES[GPT56_SCENES.length-1]?.endFrame).toBe(GPT56_DURATION_IN_FRAMES)});
  it('keeps all planned caption groups at six words or fewer',()=>{expect(Math.max(...GPT56_SUBTITLES.map((cue)=>cue.text.trim().split(/\s+/).length))).toBeLessThanOrEqual(6)});
  it('passes authored contract',()=>{expect(()=>assertGpt56Contract()).not.toThrow()});
});
