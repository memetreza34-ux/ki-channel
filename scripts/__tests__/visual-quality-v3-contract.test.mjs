import test from 'node:test';
import assert from 'node:assert/strict';
import {futureReelNeedsV3,validateVisualQualityV3Manifest} from '../visual-quality-v3-contract.mjs';

const good={version:3,sourceQualityContract:'ki/src/reels/example/visualQuality.ts',hook:{heroAreaRatio:.32,semanticVisualAnchors:3,brandAnchorAreaRatio:.05,stateChangesFirstSecond:2,stateChangesFirst3Seconds:4,contrast:'strong',conflictVisible:true,keyMessageVisible:true},scenes:[
{sceneId:'1',archetype:'hero-impact',heroAreaRatio:.32,semanticIconCount:2,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:4,microBeats:4,motionDistancePx:160,depthLayers:2,contrast:'strong',cameraMotion:'push'},
{sceneId:'2',archetype:'network-flow',heroAreaRatio:.24,semanticIconCount:3,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:3,microBeats:3,motionDistancePx:100,depthLayers:2,contrast:'balanced',cameraMotion:'parallax'},
{sceneId:'3',archetype:'terminal-code',heroAreaRatio:.25,semanticIconCount:1,illustrationCount:2,supportElementCount:4,distinctShapeFamilies:3,meaningfulStateChanges:3,microBeats:3,motionDistancePx:80,depthLayers:2,contrast:'strong',cameraMotion:'push'},
{sceneId:'4',archetype:'final-verdict',heroAreaRatio:.28,semanticIconCount:3,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:3,microBeats:3,motionDistancePx:90,depthLayers:2,contrast:'strong',cameraMotion:'pull'}],targetScores:{hook:8.5,visualVariety:8.5,motion:8.5,iconIllustrationUse:8.5,readability:8.5,overall:8.5}};

test('strong V3 manifest passes',()=>assert.deepEqual(validateVisualQualityV3Manifest(good),[]));
test('weak hook is blocked',()=>assert.ok(validateVisualQualityV3Manifest({...good,hook:{...good.hook,heroAreaRatio:.1}}).some((e)=>e.includes('hook.heroAreaRatio'))));
test('V3 remains only for legacy threshold before V4 week',()=>{
  assert.equal(futureReelNeedsV3('2026-09-21_bis_2026-09-27','04_old'),false);
  assert.equal(futureReelNeedsV3('2026-09-21_bis_2026-09-27','05_new'),true);
  assert.equal(futureReelNeedsV3('2026-09-28_bis_2026-10-04','01_v4'),false);
});
