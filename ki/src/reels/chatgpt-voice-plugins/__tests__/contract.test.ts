import {describe,expect,it} from 'vitest';
import {assertAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {VOICE_PLUGINS_DURATION_IN_FRAMES,VOICE_PLUGIN_SCENES,VOICE_PLUGIN_SUBTITLES} from '../contract';
import {VOICE_PLUGIN_VISUAL_PROFILES} from '../visualProfiles';
import {VOICE_PLUGIN_VISUAL_QUALITY_V3} from '../visualQuality';
import {assertVisualQualityV3} from '../../../visual-system/visualQualityV3';

describe('ChatGPT Voice plugins reel contract',()=>{
  it('covers the complete planned timeline without gaps',()=>{
    expect(VOICE_PLUGIN_SCENES[0]?.from).toBe(0);
    for(let i=1;i<VOICE_PLUGIN_SCENES.length;i+=1){
      expect(VOICE_PLUGIN_SCENES[i].from).toBe(VOICE_PLUGIN_SCENES[i-1].from+VOICE_PLUGIN_SCENES[i-1].duration);
    }
    const last=VOICE_PLUGIN_SCENES[VOICE_PLUGIN_SCENES.length-1];
    expect(last.from+last.duration).toBe(VOICE_PLUGINS_DURATION_IN_FRAMES);
  });

  it('keeps captions inside the six-word planning limit',()=>{
    for(const cue of VOICE_PLUGIN_SUBTITLES) expect(cue.text.trim().split(/\s+/).length).toBeLessThanOrEqual(6);
  });

  it('passes authored diversity and Visual Quality V3 gates',()=>{
    expect(()=>assertAuthoredVisualDiversity(VOICE_PLUGIN_VISUAL_PROFILES)).not.toThrow();
    expect(()=>assertVisualQualityV3(VOICE_PLUGIN_VISUAL_QUALITY_V3)).not.toThrow();
  });
});