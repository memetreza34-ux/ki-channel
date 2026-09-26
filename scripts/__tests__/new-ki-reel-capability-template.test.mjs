import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here=dirname(fileURLToPath(import.meta.url));
const repoRoot=resolve(here,'..','..');
const generator=resolve(repoRoot,'scripts','new-ki-reel.mjs');

const read=async(path)=>readFile(path,'utf8');

test('new reel generator wires Visual Quality V3 and Remotion Capability Gate by default',async()=>{
  const cwd=await mkdtemp(resolve(tmpdir(),'ki-reel-generator-'));
  try {
    const result=spawnSync(process.execPath,[generator,'Capability Wiring Test','2026-09-28'],{
      cwd,
      encoding:'utf8',
    });
    assert.equal(result.status,0,`${result.stdout}\n${result.stderr}`);

    const reelRoot=resolve(cwd,'ki','reels','2026-09-28_bis_2026-10-04','01_Capability-Wiring-Test');
    const project=resolve(reelRoot,'06-projektdateien');

    const contract=JSON.parse(await read(resolve(project,'production-contract-v2.json')));
    assert.ok(contract.phase1RequiredArtifacts.includes('visual-quality-v3.json'));
    assert.ok(contract.phase1RequiredArtifacts.includes('remotion-capabilities-v1.json'));

    const visualQuality=JSON.parse(await read(resolve(project,'visual-quality-v3.json')));
    assert.equal(visualQuality.version,3);
    assert.equal(visualQuality.sourceQualityContract,'ki/src/reels/Capability-Wiring-Test/visualQuality.ts');
    assert.deepEqual(visualQuality.scenes,[]);

    const capabilities=JSON.parse(await read(resolve(project,'remotion-capabilities-v1.json')));
    assert.equal(capabilities.version,1);
    assert.deepEqual(capabilities.sourceFiles,[]);
    assert.deepEqual(capabilities.beats,[]);

    const strategy=await read(resolve(project,'visual-strategy.md'));
    assert.match(strategy,/Primary Remotion capability/);
    assert.match(strategy,/Capability rationale/);
    assert.match(strategy,/REMOTION_CAPABILITY_GATE\.md/);

    const review=await read(resolve(project,'creative-review.md'));
    for (const marker of ['Hook score','Visual Variety score','Motion score','Icon\/Illustration score','Readability score','Overall score']) {
      assert.match(review,new RegExp(marker));
    }

    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    assert.match(phase,/visual-quality-v3\.json/);
    assert.match(phase,/remotion-capabilities-v1\.json/);
  } finally {
    await rm(cwd,{recursive:true,force:true});
  }
});
