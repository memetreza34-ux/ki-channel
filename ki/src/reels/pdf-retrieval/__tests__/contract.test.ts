import {describe,expect,it} from 'vitest';
import {PDF_RETRIEVAL_DURATION_IN_FRAMES,PDF_RETRIEVAL_SCENES,assertPdfRetrievalContract} from '../contract';

describe('pdf retrieval reel contract',()=>{
  it('covers five contiguous scenes and fifteen beats',()=>{expect(PDF_RETRIEVAL_SCENES).toHaveLength(5);expect(new Set(PDF_RETRIEVAL_SCENES.flatMap((scene)=>[...scene.beatIds])).size).toBe(15);expect(PDF_RETRIEVAL_SCENES[PDF_RETRIEVAL_SCENES.length-1]?.endFrame).toBe(PDF_RETRIEVAL_DURATION_IN_FRAMES)});
  it('passes authored contract',()=>{expect(()=>assertPdfRetrievalContract()).not.toThrow()});
});
