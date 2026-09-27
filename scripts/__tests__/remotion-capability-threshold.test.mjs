import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const checker=resolve(here,'..','check-remotion-capabilities.mjs');

test('Remotion capability gate is not coupled to V3/V4 visual-quality cutoff',async()=>{
  const source=await readFile(checker,'utf8');
  assert.ok(!source.includes("from './visual-quality-v3-contract.mjs'"),'capability gate must not depend on V3 cutoff');
  assert.match(source,/futureReelNeedsCapabilityGate/);
  assert.match(source,/weekStart>'2026-09-21'/);
  assert.match(source,/return index>=5/);
});
