import test from 'node:test';
import assert from 'node:assert/strict';
import {findMissingCapabilityEvidence,isSafeReelSourceFile,validateRemotionCapabilityManifest} from '../remotion-capability-contract.mjs';

const valid={
  version:1,
  sourceFiles:[
    'ki/src/reels/example/Hook.tsx',
    'ki/src/reels/example/Flow.tsx',
    'ki/src/reels/example/Code.tsx',
    'ki/src/reels/example/End.tsx',
  ],
  beats:[
    {beatId:'hook',sourceFile:'ki/src/reels/example/Hook.tsx',isHook:true,isHero:true,primaryCapability:'object-transformation',capabilities:['object-transformation','kinetic-typography'],primaryPrimitive:'object',rationale:'The object visibly transforms so the consequence is understandable before the narration finishes.'},
    {beatId:'flow',sourceFile:'ki/src/reels/example/Flow.tsx',primaryCapability:'paths',capabilities:['paths','motion-blur'],primaryPrimitive:'path',rationale:'A moving payload along a route makes the directional process visible instead of describing it in cards.'},
    {beatId:'code',sourceFile:'ki/src/reels/example/Code.tsx',primaryCapability:'terminal-code',capabilities:['terminal-code'],primaryPrimitive:'code',rationale:'Code is the actual subject, therefore a terminal surface is semantically correct and evidence-like.'},
    {beatId:'end',sourceFile:'ki/src/reels/example/End.tsx',primaryCapability:'shapes',capabilities:['shapes','kinetic-typography'],primaryPrimitive:'shape',rationale:'A geometric end state gives the verdict a distinct final silhouette and avoids another information panel.'},
  ],
};

const validSources=new Map([
  ['ki/src/reels/example/Hook.tsx','// REMOTION_BEAT: hook\n<ObjectTransformation fromLabel="A" toLabel="B" x={0} y={0} /><KineticType text="40%" x={0} y={0} />'],
  ['ki/src/reels/example/Flow.tsx','// REMOTION_BEAT: flow\n<AnimatedDataPath path="M0 0 L100 0" x={0} y={0} width={100} height={20} /><Trail layers={4}><div /></Trail>'],
  ['ki/src/reels/example/Code.tsx','// REMOTION_BEAT: code\n<TerminalMock x={0} y={0} lines={["npm test"]} />'],
  ['ki/src/reels/example/End.tsx','// REMOTION_BEAT: end\n<ShapeSignal x={0} y={0} /><KineticType text="DONE" x={0} y={0} />'],
]);

test('valid capability manifest passes',()=>{
  assert.deepEqual(validateRemotionCapabilityManifest(valid),[]);
});

test('abstract cards are rejected',()=>{
  const broken={...valid,beats:valid.beats.map((beat,index)=>index===1?{...beat,primaryPrimitive:'card'}:beat)};
  assert.match(validateRemotionCapabilityManifest(broken).join('\n'),/semanticCardReason/);
});

test('unsafe and out-of-scope source paths are rejected',()=>{
  assert.equal(isSafeReelSourceFile('ki/src/reels/example/Reel.tsx'),true);
  assert.equal(isSafeReelSourceFile('../secret.tsx'),false);
  assert.equal(isSafeReelSourceFile('/tmp/Reel.tsx'),false);
  assert.equal(isSafeReelSourceFile('ki/src/longform/Reel.tsx'),false);

  const broken={...valid,sourceFiles:['../secret.tsx',...valid.sourceFiles.slice(1)]};
  assert.match(validateRemotionCapabilityManifest(broken).join('\n'),/without path traversal/);
});

test('every beat source must be explicitly declared',()=>{
  const broken={...valid,beats:valid.beats.map((beat,index)=>index===0?{...beat,sourceFile:'ki/src/reels/example/Other.tsx'}:beat)};
  assert.match(validateRemotionCapabilityManifest(broken).join('\n'),/must also be listed/);
});

test('source evidence is checked in the source section assigned to the beat',()=>{
  const brokenSources=new Map(validSources);
  brokenSources.set('ki/src/reels/example/Flow.tsx','// REMOTION_BEAT: flow\nconst x = 1;');
  const failures=findMissingCapabilityEvidence(valid,brokenSources);
  assert.ok(failures.some((failure)=>failure.startsWith('flow/paths:')));
  assert.ok(failures.some((failure)=>failure.startsWith('flow/motion-blur:')));
  assert.ok(!failures.some((failure)=>failure.startsWith('hook/')));
});

test('a capability elsewhere in the same file cannot satisfy another beat',()=>{
  const sameFile='ki/src/reels/example/Reel.tsx';
  const manifest={
    ...valid,
    sourceFiles:[sameFile],
    beats:valid.beats.map((beat)=>({...beat,sourceFile:sameFile})),
  };
  const source=`
// REMOTION_BEAT: hook
<ObjectTransformation fromLabel="A" toLabel="B" x={0} y={0} /><KineticType text="40%" x={0} y={0} />
// REMOTION_BEAT: flow
<div>no path here</div>
// REMOTION_BEAT: code
<TerminalMock x={0} y={0} lines={["npm test"]} />
// REMOTION_BEAT: end
<ShapeSignal x={0} y={0} /><KineticType text="DONE" x={0} y={0} />
<AnimatedDataPath path="M0 0 L100 0" x={0} y={0} width={100} height={20} /><Trail layers={4}><div /></Trail>
`;
  const failures=findMissingCapabilityEvidence(manifest,new Map([[sameFile,source]]));
  assert.ok(failures.some((failure)=>failure.startsWith('flow/paths:')));
  assert.ok(failures.some((failure)=>failure.startsWith('flow/motion-blur:')));
});

test('comments cannot fake executable capability evidence',()=>{
  const brokenSources=new Map(validSources);
  brokenSources.set('ki/src/reels/example/Flow.tsx',`// REMOTION_BEAT: flow
// <AnimatedDataPath path="M0 0 L100 0" />
// <Trail layers={4}><div /></Trail>
const placeholder = 'evolvePath( fake )';
<div>still only a placeholder</div>`);
  const failures=findMissingCapabilityEvidence(valid,brokenSources);
  assert.ok(failures.some((failure)=>failure.startsWith('flow/paths:')));
  assert.ok(failures.some((failure)=>failure.startsWith('flow/motion-blur:')));
});

test('missing beat marker is rejected even when the capability exists in the file',()=>{
  const brokenSources=new Map(validSources);
  brokenSources.set('ki/src/reels/example/Code.tsx','<TerminalMock x={0} y={0} lines={["npm test"]} />');
  const failures=findMissingCapabilityEvidence(valid,brokenSources);
  assert.ok(failures.some((failure)=>failure.startsWith('code: missing source marker')));
});

test('source evidence recognizes concrete high-level primitive usage per beat',()=>{
  assert.deepEqual(findMissingCapabilityEvidence(valid,validSources),[]);
});

test('Lottie is accepted only with executable Lottie JSX in the beat section',()=>{
  const manifest={
    ...valid,
    beats:valid.beats.map((beat,index)=>index===3?{...beat,primaryCapability:'lottie',capabilities:['lottie'],primaryPrimitive:'animation',rationale:'A real authored Lottie asset is the semantic hero motion for this beat and is intentionally embedded in Remotion.'}:beat),
  };
  const sources=new Map(validSources);
  sources.set('ki/src/reels/example/End.tsx','// REMOTION_BEAT: end\n<Lottie animationData={animationData} />');
  assert.deepEqual(findMissingCapabilityEvidence(manifest,sources),[]);

  sources.set('ki/src/reels/example/End.tsx','// REMOTION_BEAT: end\nconst note = "<Lottie />";');
  assert.ok(findMissingCapabilityEvidence(manifest,sources).some((failure)=>failure.startsWith('end/lottie:')));
});

test('Rive is accepted only with executable RemotionRiveCanvas JSX in the beat section',()=>{
  const manifest={
    ...valid,
    beats:valid.beats.map((beat,index)=>index===3?{...beat,primaryCapability:'rive',capabilities:['rive'],primaryPrimitive:'animation',rationale:'A real authored Rive asset carries the state-machine animation for this beat and is rendered through Remotion.'}:beat),
  };
  const sources=new Map(validSources);
  sources.set('ki/src/reels/example/End.tsx','// REMOTION_BEAT: end\n<RemotionRiveCanvas src={riveAsset} />');
  assert.deepEqual(findMissingCapabilityEvidence(manifest,sources),[]);

  sources.set('ki/src/reels/example/End.tsx','// REMOTION_BEAT: end\n// <RemotionRiveCanvas src={riveAsset} />\n<div />');
  assert.ok(findMissingCapabilityEvidence(manifest,sources).some((failure)=>failure.startsWith('end/rive:')));
});
