import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');
const studioRoot = readSource('ki/src/Root.tsx');
const productionRoot = readSource('ki/src/ProductionRoot.tsx');
const productionEntry = readSource('ki/src/production-entry.tsx');
const productionImports = [...productionRoot.matchAll(/from\s+['"](\.\/(?:reels|longform)\/[^'"]+)['"]/g)].map((match)=>match[1]);

describe('ProductionRoot isolation', () => {
  it('keeps the Studio root as composition only', () => {expect(studioRoot).toContain("from './ProductionRoot'");expect(studioRoot).toContain("from './motion-system/MotionPreviewRoot'");expect(studioRoot).not.toMatch(/from\s+['"]\.\/(?:reels|longform)\//);});
  it('registers production through a preview-free entry point', () => {expect(productionEntry).toContain("from './ProductionRoot'");expect(productionEntry).toContain('registerRoot(ProductionRoot)');expect(productionEntry).not.toContain('MotionPreviewRoot');expect(productionEntry).not.toContain('motion-system/');});
  it('keeps every registered production module in one canonical root', () => {const uniqueImports=new Set(productionImports);const reelImports=[...uniqueImports].filter((path)=>path.startsWith('./reels/'));const longformImports=[...uniqueImports].filter((path)=>path.startsWith('./longform/'));expect(reelImports).toHaveLength(13);expect(longformImports).toHaveLength(1);});
  it('does not hard-import optional Phase-2 voiceover assets', () => {expect(productionRoot).not.toMatch(/01-script-audio\/voiceover\.(?:wav|mp3|mp4|m4a|aac|ogg)/i);expect(productionRoot).not.toMatch(/import\s+voiceover[A-Za-z0-9_]*\s+from\s+['"]/i);});
});
