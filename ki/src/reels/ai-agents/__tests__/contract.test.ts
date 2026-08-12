import {describe, expect, it} from 'vitest';
import {AI_AGENTS_CAPTION_ZONE_Y, AI_AGENTS_DURATION_IN_FRAMES, AI_AGENTS_SCENES, AI_AGENTS_SUBTITLES, assertAIAgentsContract, normalizeAIAgentText} from '../contract';

describe('AI agents reel contract',()=>{
  it('keeps the canonical phase-1 structure',()=>{
    expect(()=>assertAIAgentsContract()).not.toThrow();
    expect(AI_AGENTS_DURATION_IN_FRAMES).toBe(1740);
    expect(AI_AGENTS_CAPTION_ZONE_Y).toBe(1440);
    expect(AI_AGENTS_SCENES).toHaveLength(5);
    expect(new Set(AI_AGENTS_SCENES.flatMap((scene)=>scene.beatIds)).size).toBe(14);
    expect(AI_AGENTS_SCENES.every((scene)=>scene.implementation==='NEW_BUILD')).toBe(true);
  });

  it('covers every spoken scene with subtitle text',()=>{
    for(const scene of AI_AGENTS_SCENES){
      const text=AI_AGENTS_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).sort((a,b)=>a.startFrame-b.startFrame).map((cue)=>cue.text).join(' ');
      expect(normalizeAIAgentText(text)).toBe(normalizeAIAgentText(scene.spokenText));
    }
  });
});
