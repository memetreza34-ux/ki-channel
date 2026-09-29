import test from 'node:test';
import assert from 'node:assert/strict';
import {findMissingCapabilityEvidence,validateRemotionCapabilityManifest} from '../remotion-capability-contract.mjs';

test('one fitting capability can be reused without diversity quota',()=>{
  const sourceFile='ki/src/reels/example/Reel.tsx';
  const manifest={
    version:1,
    sourceFiles:[sourceFile],
    beats:[
      {beatId:'a',sourceFile,isHero:true,primaryCapability:'paths',capabilities:['paths'],primaryPrimitive:'path',rationale:'The same authored path mechanism is the clearest explanation for this continuous process beat.'},
      {beatId:'b',sourceFile,primaryCapability:'paths',capabilities:['paths'],primaryPrimitive:'path',rationale:'The process continues through the same spatial route, so changing capability would reduce coherence.'},
    ],
  };
  assert.deepEqual(validateRemotionCapabilityManifest(manifest),[]);
});

test('SampledMotionBlur is valid executable motion-blur evidence',()=>{
  const sourceFile='ki/src/reels/example/Reel.tsx';
  const manifest={
    version:1,
    sourceFiles:[sourceFile],
    beats:[
      {beatId:'hero',sourceFile,isHero:true,primaryCapability:'motion-blur',capabilities:['motion-blur'],primaryPrimitive:'object',rationale:'Temporal sampling makes the fast hero travel read as continuous speed rather than sharp frame jumps.'},
    ],
  };
  const source='// REMOTION_BEAT: hero\n<SampledMotionBlur><MovingHero /></SampledMotionBlur>';
  assert.deepEqual(findMissingCapabilityEvidence(manifest,new Map([[sourceFile,source]])),[]);
});
