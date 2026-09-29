import {access, readFile} from 'node:fs/promises';

const requiredFiles=[
  'ki/src/motion-engine/CinematicCameraRig.tsx',
  'ki/src/motion-engine/WorldCameraRig.tsx',
  'ki/src/motion-engine/ChoreographedObject.tsx',
  'ki/src/motion-engine/KeyframedMotion.tsx',
  'ki/src/motion-engine/MotionEffects.tsx',
  'ki/src/motion-engine/ParallaxStage.tsx',
  'ki/src/motion-engine/MaskedKineticText.tsx',
  'ki/src/motion-engine/SceneMotionOrchestrator.tsx',
  'ki/src/motion-engine/MotionEngineLab.tsx',
  'ki/src/motion-engine/MotionEnginePreviewRoot.tsx',
];

const failures=[];
for (const path of requiredFiles) {
  try { await access(path); } catch { failures.push(`missing ${path}`); }
}
if (failures.length===0) {
  const [camera,worldCamera,object,keyframed,effects,parallax,type,orchestrator,lab,preview,studioRoot,productionEntry]=await Promise.all([
    ...requiredFiles.map((path)=>readFile(path,'utf8')),
    readFile('ki/src/Root.tsx','utf8'),
    readFile('ki/src/production-entry.tsx','utf8'),
  ]);
  for (const marker of ['push-through','whip-left','whip-right','impact-push','orbit-right','followPath','followAnchor']) if (!camera.includes(marker)) failures.push(`camera rig missing ${marker}`);
  for (const marker of ['WorldCameraRig','continuous-world','focusX','focusY','zoom','strictly increasing']) if (!worldCamera.includes(marker)) failures.push(`world camera missing ${marker}`);
  for (const marker of ['bezierPoint','bezierTangentAngle','anticipationStart','impactFrame','settleFrame','aliveAmplitude','velocityStretch','zStart','zEnd']) if (!object.includes(marker)) failures.push(`object choreography missing ${marker}`);
  for (const marker of ['KeyframedMotion','staggerIndex','staggerFrames','rotateX','rotateY','scaleX','scaleY']) if (!keyframed.includes(marker)) failures.push(`keyframed motion missing ${marker}`);
  for (const marker of ['ImpactShake','AliveHold','DirectionalBlur','SampledMotionBlur','CameraMotionBlur']) if (!effects.includes(marker)) failures.push(`motion effects missing ${marker}`);
  for (const marker of ['ParallaxStage','ParallaxLayer','translate3d','rotateY','rotateX']) if (!parallax.includes(marker)) failures.push(`parallax system missing ${marker}`);
  for (const marker of ['MaskedKineticText','clipPath','spring','lineStaggerFrames']) if (!type.includes(marker)) failures.push(`kinetic type system missing ${marker}`);
  for (const marker of ['anticipation','travel','impact','reveal','settle','hold']) if (!orchestrator.includes(marker)) failures.push(`orchestrator missing ${marker}`);
  for (const marker of ['KI-MotionEngine-V1','WorldCameraRig','KeyframedMotion','SampledMotionBlur','mosaicTargets','HeroSignal']) if (!lab.includes(marker)) failures.push(`Motion Engine lab missing ${marker}`);
  if (!preview.includes('MotionEngineLab')) failures.push('Motion Engine preview root is not wired to lab');
  if (!studioRoot.includes('MotionEnginePreviewRoot')) failures.push('Studio Root must expose Motion Engine preview');
  if (productionEntry.includes('MotionEngine') || productionEntry.includes('motion-engine')) failures.push('Production entry must not contain Motion Engine preview/lab imports');
}

if (failures.length) {
  console.error('MOTION ENGINE: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('MOTION ENGINE: PASS — preset camera moves, continuous-world camera keyframes, multi-state staggered motion, authored trajectories, parallax, masked kinetic type, temporal blur and Studio-only lab wiring are present.');
