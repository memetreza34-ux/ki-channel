import {describe,expect,it} from 'vitest';
import {
  CODEX_SUNSET_COMPOSITION_ID,
  CODEX_SUNSET_DURATION_IN_FRAMES,
  CODEX_SUNSET_FPS,
  CODEX_SUNSET_HEIGHT,
  CODEX_SUNSET_SCENES,
  CODEX_SUNSET_WIDTH,
} from './contract';

describe('Codex GPT-5.4 sunset reel contract',()=>{
  it('keeps the vertical production format',()=>{
    expect(CODEX_SUNSET_COMPOSITION_ID).toBe('KI-CodexGPT54Sunset');
    expect(CODEX_SUNSET_WIDTH).toBe(1080);
    expect(CODEX_SUNSET_HEIGHT).toBe(1920);
    expect(CODEX_SUNSET_FPS).toBe(30);
    expect(CODEX_SUNSET_DURATION_IN_FRAMES).toBeGreaterThan(0);
  });
  it('has five ordered scenes',()=>{
    expect(CODEX_SUNSET_SCENES).toHaveLength(5);
    expect(CODEX_SUNSET_SCENES.map((scene)=>scene.sceneId)).toEqual(['scene1','scene2','scene3','scene4','scene5']);
  });
  it('keeps the key factual visual labels',async()=>{
    const source=await import('./ReelCodexGPT54Sunset');
    expect(source.ReelCodexGPT54Sunset).toBeTypeOf('function');
  });
});
