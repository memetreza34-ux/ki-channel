import test from 'node:test';
import assert from 'node:assert/strict';
import {findMissingCapabilityEvidence,validateRemotionCapabilityManifest} from '../remotion-capability-contract.mjs';

const valid={
  version:1,
  sourceFiles:['ki/src/reels/example/Reel.tsx'],
  beats:[
    {beatId:'hook',isHook:true,isHero:true,primaryCapability:'object-transformation',capabilities:['object-transformation','kinetic-typography'],primaryPrimitive:'object',rationale:'The object visibly transforms so the consequence is understandable before the narration finishes.'},
    {beatId:'flow',primaryCapability:'paths',capabilities:['paths','motion-blur'],primaryPrimitive:'path',rationale:'A moving payload along a route makes the directional process visible instead of describing it in cards.'},
    {beatId:'code',primaryCapability:'terminal-code',capabilities:['terminal-code'],primaryPrimitive:'code',rationale:'Code is the actual subject, therefore a terminal surface is semantically correct and evidence-like.'},
    {beatId:'end',primaryCapability:'shapes',capabilities:['shapes','kinetic-typography'],primaryPrimitive:'shape',rationale:'A geometric end state gives the verdict a distinct final silhouette and avoids another information panel.'},
  ],
};

test('valid capability manifest passes',()=>{
  assert.deepEqual(validateRemotionCapabilityManifest(valid),[]);
});

test('abstract cards are rejected',()=>{
  const broken={...valid,beats:valid.beats.map((beat,index)=>index===1?{...beat,primaryPrimitive:'card'}:beat)};
  assert.match(validateRemotionCapabilityManifest(broken).join('\n'),/semanticCardReason/);
});

test('source evidence is required for declared capabilities',()=>{
  const failures=findMissingCapabilityEvidence(valid,'const x = 1;');
  assert.ok(failures.some((failure)=>failure.startsWith('paths:')));
  assert.ok(failures.some((failure)=>failure.startsWith('object-transformation:')));
});

test('source evidence recognizes shared high-level primitives',()=>{
  const source=`import {AnimatedDataPath,KineticType,ObjectTransformation,ShapeSignal} from './AdvancedMotionKit';\nimport {TerminalMock} from './SemanticVisualKit';\nimport {Trail} from '@remotion/motion-blur';`;
  assert.deepEqual(findMissingCapabilityEvidence(valid,source),[]);
});