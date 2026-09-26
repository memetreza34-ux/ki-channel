import {describe,expect,it} from 'vitest';
import {GPT55_DURATION_IN_FRAMES,GPT55_SCENES,GPT55_SUBTITLES,assertGpt55Contract} from '../contract';

describe('GPT-5.5 retirement reel contract',()=>{
  it('covers six contiguous scenes and twelve beats',()=>{expect(GPT55_SCENES).toHaveLength(6);expect(new Set(GPT55_SCENES.flatMap((scene)=>[...scene.beatIds])).size).toBe(12);expect(GPT55_SCENES[GPT55_SCENES.length-1]?.endFrame).toBe(GPT55_DURATION_IN_FRAMES)});
  it('keeps all planned caption groups at six words or fewer',()=>{expect(Math.max(...GPT55_SUBTITLES.map((cue)=>cue.text.trim().split(/\s+/).length))).toBeLessThanOrEqual(6)});
  it('passes authored contract',()=>{expect(()=>assertGpt55Contract()).not.toThrow()});
});
