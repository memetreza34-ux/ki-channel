import {describe, expect, it} from 'vitest';
import {SEMANTIC_EMBEDDINGS_DURATION_IN_FRAMES,SEMANTIC_EMBEDDINGS_SCENES,SEMANTIC_EMBEDDINGS_SUBTITLES,assertSemanticEmbeddingsContract,normalizeSemanticText} from '../contract';

const allBeats=()=>SEMANTIC_EMBEDDINGS_SCENES.flatMap((scene)=>[...scene.beatIds]);

describe('semantic embeddings reel contract',()=>{
  it('covers exactly five contiguous scenes and twelve beats',()=>{
    expect(SEMANTIC_EMBEDDINGS_SCENES).toHaveLength(5);
    expect(new Set(allBeats()).size).toBe(12);
    expect(SEMANTIC_EMBEDDINGS_SCENES.at(-1)?.endFrame).toBe(SEMANTIC_EMBEDDINGS_DURATION_IN_FRAMES);
  });
  it('keeps subtitle text identical to the approved spoken text',()=>{
    for(const scene of SEMANTIC_EMBEDDINGS_SCENES){const text=SEMANTIC_EMBEDDINGS_SUBTITLES.filter((cue)=>cue.sceneId===scene.sceneId).map((cue)=>cue.text).join(' ');expect(normalizeSemanticText(text)).toBe(normalizeSemanticText(scene.spokenText));}
  });
  it('passes the authored V2 contract',()=>{expect(()=>assertSemanticEmbeddingsContract()).not.toThrow();});
});
