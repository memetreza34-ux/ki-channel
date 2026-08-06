import {describe, expect, it} from 'vitest';
import {REEL_COPY} from '../copy';
import {MISUNDERSTANDS_AUDIO, MISUNDERSTANDS_DURATION, MISUNDERSTANDS_SCENES} from '../contract';

const countWords=(text:string):number=>text.match(/[A-Za-zÄÖÜäöüß0-9]+(?:[’'-][A-Za-zÄÖÜäöüß0-9]+)*/g)?.length??0;

describe('why-ai-misunderstands-you contract',()=>{
  it('uses the future animation-only format',()=>{
    expect(MISUNDERSTANDS_DURATION).toBe(1950);
    expect(MISUNDERSTANDS_SCENES).toHaveLength(9);
    expect(MISUNDERSTANDS_AUDIO.playbackRate).toBe(1);
    expect(MISUNDERSTANDS_AUDIO.music).toBe(false);
    expect(MISUNDERSTANDS_AUDIO.soundMode).toBe('off');
    expect(MISUNDERSTANDS_SCENES.every((scene)=>scene.type==='remotion')).toBe(true);
  });

  it('has contiguous scenes with readable duration and result holds',()=>{
    let cursor=0;
    for(const scene of MISUNDERSTANDS_SCENES){
      expect(scene.start).toBe(cursor);
      expect(scene.end-scene.start).toBeGreaterThanOrEqual(165);
      expect(scene.minimumResultHoldSeconds).toBeGreaterThanOrEqual(1);
      cursor=scene.end;
    }
    expect(cursor).toBe(MISUNDERSTANDS_DURATION);
  });

  it('contains the approved 131-word voiceover',()=>{
    const text=Object.values(REEL_COPY).map((scene)=>scene.voiceover).join(' ');
    expect(countWords(text)).toBe(131);
  });

  it('keeps fallback captions inside each scene',()=>{
    for(const scene of MISUNDERSTANDS_SCENES){
      const duration=scene.end-scene.start;
      const chunks=REEL_COPY[scene.id].captions;
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.every((chunk)=>chunk.start>=0&&chunk.end<=duration&&chunk.end>chunk.start)).toBe(true);
    }
  });
});
