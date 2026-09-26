import {describe,expect,it} from 'vitest';
import {assertClaudeOpus55Contract,CLAUDE_OPUS55_DURATION_IN_FRAMES,CLAUDE_OPUS55_SCENES,CLAUDE_OPUS55_SUBTITLES} from '../contract';
import {VISUAL_QUALITY_V3} from '../visualQuality';

describe('Claude Opus 5.5 reel contract',()=>{
  it('passes all production contracts',()=>expect(()=>assertClaudeOpus55Contract()).not.toThrow());
  it('covers 42 seconds at 30fps',()=>expect(CLAUDE_OPUS55_DURATION_IN_FRAMES).toBe(1260));
  it('uses seven scenes and captions',()=>{expect(CLAUDE_OPUS55_SCENES).toHaveLength(7);expect(CLAUDE_OPUS55_SUBTITLES.length).toBeGreaterThan(20);});
  it('is the first V3 production reel',()=>{expect(VISUAL_QUALITY_V3.version).toBe(3);expect(VISUAL_QUALITY_V3.targetScores.overall).toBeGreaterThanOrEqual(8);});
});
