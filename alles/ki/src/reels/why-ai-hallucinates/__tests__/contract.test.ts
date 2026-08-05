import {describe, expect, it} from 'vitest';
import {
  HALLUCINATION_AUDIO,
  HALLUCINATION_DURATION,
  HALLUCINATION_FPS,
  HALLUCINATION_HEIGHT,
  HALLUCINATION_SCENES,
  HALLUCINATION_WIDTH,
  SUBTITLE_CUES,
} from '../contract';
import {CONTRADICTION_EXAMPLE, PROBABILITY_CANDIDATES} from '../sceneData';

const sceneDuration = (scene: (typeof HALLUCINATION_SCENES)[number]) => scene.end-scene.start;

describe('why AI hallucinates reel contract',()=>{
  it('uses the production format',()=>{
    expect(HALLUCINATION_WIDTH).toBe(1080);
    expect(HALLUCINATION_HEIGHT).toBe(1920);
    expect(HALLUCINATION_FPS).toBe(30);
    expect(HALLUCINATION_DURATION).toBe(1080);
    expect(HALLUCINATION_SCENES).toHaveLength(8);
  });

  it('keeps continuous complete scene ranges',()=>{
    expect(HALLUCINATION_SCENES[0].start).toBe(0);
    expect(HALLUCINATION_SCENES.at(-1)?.end).toBe(HALLUCINATION_DURATION);
    for(let index=1;index<HALLUCINATION_SCENES.length;index+=1){
      expect(HALLUCINATION_SCENES[index].start).toBe(HALLUCINATION_SCENES[index-1].end);
    }
    expect(HALLUCINATION_SCENES.every((scene)=>sceneDuration(scene)>0)).toBe(true);
  });

  it('uses unique full animations and avoids adjacent layout or motion repetition',()=>{
    expect(new Set(HALLUCINATION_SCENES.map((scene)=>scene.id)).size).toBe(8);
    expect(new Set(HALLUCINATION_SCENES.map((scene)=>scene.animationId)).size).toBe(8);
    for(let index=1;index<HALLUCINATION_SCENES.length;index+=1){
      expect(HALLUCINATION_SCENES[index].layout).not.toBe(HALLUCINATION_SCENES[index-1].layout);
      expect(HALLUCINATION_SCENES[index].motion).not.toBe(HALLUCINATION_SCENES[index-1].motion);
    }
  });

  it('requires 1.10x pitch-preserved voiceover and no other sound',()=>{
    expect(HALLUCINATION_AUDIO.playbackRate).toBe(1.1);
    expect(HALLUCINATION_AUDIO.preservePitch).toBe(true);
    expect(HALLUCINATION_AUDIO.soundMode).toBe('off');
    expect(HALLUCINATION_AUDIO.music).toBe(false);
  });

  it('keeps subtitle cues ordered and inside each local scene',()=>{
    for(const scene of HALLUCINATION_SCENES){
      const cues=SUBTITLE_CUES[scene.id];
      expect(cues.length).toBeGreaterThan(0);
      for(let index=0;index<cues.length;index+=1){
        expect(cues[index].atFrame).toBeGreaterThanOrEqual(0);
        expect(cues[index].atFrame).toBeLessThan(sceneDuration(scene));
        if(index>0) expect(cues[index].atFrame).toBeGreaterThanOrEqual(cues[index-1].atFrame);
      }
    }
  });

  it('keeps factual example contracts stable',()=>{
    expect(PROBABILITY_CANDIDATES.reduce((sum,item)=>sum+item.value,0)).toBe(100);
    expect(CONTRADICTION_EXAMPLE.contradictionCount).toBe(3);
    expect(CONTRADICTION_EXAMPLE.fictional).toBe(true);
  });
});
