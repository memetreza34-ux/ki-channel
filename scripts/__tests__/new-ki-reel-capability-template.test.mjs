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

test('new reel generator wires Physical AI Art Direction, Visual Quality V4 and Remotion Capability Gate by default',async()=>{
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
    assert.ok(contract.phase1RequiredArtifacts.includes('art-direction-calibration.json'));
    assert.ok(contract.phase1RequiredArtifacts.includes('visual-quality-v4.json'));
    assert.ok(!contract.phase1RequiredArtifacts.includes('visual-quality-v3.json'));
    assert.ok(contract.phase1RequiredArtifacts.includes('remotion-capabilities-v1.json'));

    const artDirection=JSON.parse(await read(resolve(project,'art-direction-calibration.json')));
    assert.equal(artDirection.version,1);
    assert.equal(artDirection.worldId,'physical-ai-editorial-v1');
    assert.deepEqual(artDirection.scenes.map((scene)=>scene.role),['hook','mechanism','payoff']);
    assert.equal(artDirection.humanCreativeStatus,'PENDING');
    assert.equal(artDirection.approvedByHuman,false);
    assert.equal(artDirection.fullReelBuildAllowed,false);
    for(const scene of artDirection.scenes){
      assert.equal(scene.neonBackground,false);
      assert.equal(scene.dashboardGrammar,false);
      assert.equal(scene.floatingPillCloud,false);
      assert.ok(scene.supportObjectCount<=3);
      assert.ok(scene.visualLabelCount<=2);
      assert.ok(scene.uiPanelCount<=1);
      assert.ok(scene.purpleCoverageTarget<=0.18);
    }

    const visualQuality=JSON.parse(await read(resolve(project,'visual-quality-v4.json')));
    assert.equal(visualQuality.version,4);
    assert.equal(visualQuality.fps,30);
    assert.equal(visualQuality.sourceQualityContract,'ki/src/reels/Capability-Wiring-Test/visualQuality.ts');
    assert.equal(visualQuality.hook.firstFrameHeroVisible,false);
    assert.deepEqual(visualQuality.scenes,[]);

    const capabilities=JSON.parse(await read(resolve(project,'remotion-capabilities-v1.json')));
    assert.equal(capabilities.version,1);
    assert.deepEqual(capabilities.sourceFiles,[]);
    assert.deepEqual(capabilities.beats,[]);

    const strategy=await read(resolve(project,'visual-strategy.md'));
    for (const marker of ['Start state','Visible change','End state','Visual verb','Recognition cues','Hero meaning','Payoff']) {
      assert.match(strategy,new RegExp(marker));
    }
    assert.match(strategy,/ART_DIRECTION\.md/);
    assert.match(strategy,/physical-ai-editorial-v1/);
    assert.match(strategy,/Hook \+ Mechanism \+ Payoff/);
    assert.match(strategy,/Primary Remotion capability/);
    assert.match(strategy,/Capability rationale/);
    assert.match(strategy,/VISUAL_QUALITY_V4\.md/);
    assert.match(strategy,/REMOTION_CAPABILITY_GATE\.md/);

    const review=await read(resolve(project,'creative-review.md'));
    for (const marker of ['Art Direction calibration','Technical status','Automated Visual status','Human Creative status','Semantic Clarity score','Story Motion score','Overall score']) {
      assert.match(review,new RegExp(marker));
    }

    const phase=await read(resolve(project,'PHASE-STATUS.md'));
    assert.match(phase,/art-direction-calibration\.json/);
    assert.match(phase,/humanCreativeStatus=APPROVED/);
    assert.match(phase,/visual-quality-v4\.json/);
    assert.match(phase,/scene-local V4 Visual Review/);
    assert.match(phase,/remotion-capabilities-v1\.json/);
  } finally {
    await rm(cwd,{recursive:true,force:true});
  }
});
