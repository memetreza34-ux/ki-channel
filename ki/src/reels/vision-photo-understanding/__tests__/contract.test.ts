import {describe, expect, it} from 'vitest';
import {VISION_PHOTO_DURATION_IN_FRAMES,VISION_PHOTO_SCENES,VISION_PHOTO_SUBTITLES,assertVisionPhotoContract,normalizeVisionPhotoText} from '../contract';

const allBeats=()=>VISION_PHOTO_SCENES.flatMap((scene)=>[...scene.beatIds]);

describe('vision photo reel contract',()=>{
  it('covers five contiguous scenes and fifteen beats',()=>{
    expect(VISION_PHOTO_SCENES).toHaveLength(5);
    expect(new Set(allBeats()).size).toBe(15);
    expect(VISION_PHOTO_SCENES[VISION_PHOTO_SCENES.length-1]?.endFrame).toBe(VISION_PHOTO_DURATION_IN_FRAMES);
  });
  it('keeps subtitle text identical to approved spoken text',()=>{
    for(const scene of VISION_PHOTO_SCENES){const text=VISION_PHOTO_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).map((cue)=>cue.text).join(' ');expect(normalizeVisionPhotoText(text)).toBe(normalizeVisionPhotoText(scene.spokenText));}
  });
  it('passes the authored V2.1 contract',()=>{expect(()=>assertVisionPhotoContract()).not.toThrow();});
});
