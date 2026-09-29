import {access, readFile} from 'node:fs/promises';

const requiredFiles=[
  'ki/src/motion-engine/CinematicCameraRig.tsx',
  'ki/src/motion-engine/ChoreographedObject.tsx',
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
  const [camera,object,effects,parallax,type,orchestrator,lab,preview,studioRoot,productionEntry]=await Promise.all([
    readFile(requiredFiles[0],'utf8'),
    readFile(requiredFiles[1],'utf8'),
    readFile(requiredFiles[2],'utf8'),
    readFile(requiredFiles[3],'utf8'),
    readFile(requiredFiles[4],'utf8'),
    readFile(requiredFiles[5],'utf8'),
    readFile(requiredFiles[6],'utf8'),
    readFile(requiredFiles[7],'utf8'),
    readFile('ki/src/Root.tsx','utf8'),
    readFile('ki/src/production-entry.tsx','utf8'),
  ]);
  for (const marker of ['push-through','whip-left','whip-right','impact-push','orbit-right','followPath','followAnchor']) if (!camera.includes(marker)) failures.push(`camera rig missing ${marker}`);
  for (const marker of ['bezierPoint','bezierTangentAngle','anticipationStart','impactFrame','settleFrame','aliveAmplitude','velocityStretch','zStart','zEnd']) if (!object.includes(marker)) failures.push(`object choreography missing ${marker}`);
  for (const marker of ['ImpactShake','AliveHold','DirectionalBlur','SampledMotionBlur','CameraMotionBlur']) if (!effects.includes(marker)) failures.push(`motion effects missing ${marker}`);
  for (const marker of ['ParallaxStage','ParallaxLayer','translate3d','rotateY','rotateX']) if (!parallax.includes(marker)) failures.push(`parallax system missing ${marker}`);
  for (const marker of ['MaskedKineticText','clipPath','spring','lineStaggerFrames']) if (!type.includes(marker)) failures.push(`kinetic type system missing ${marker}`);
  for (const marker of ['anticipation','travel','impact','reveal','settle','hold']) if (!orchestrator.includes(marker)) failures.push(`orchestrator missing ${marker}`);
  for (const marker of ['KI-MotionEngine-V1','ParallaxStage','MaskedKineticText','followPath','velocityStretch']) if (!lab.includes(marker)) failures.push(`Motion Engine lab missing ${marker}`);
  if (!preview.includes('MotionEngineLab')) failures.push('Motion Engine preview root is not wired to lab');
  if (!studioRoot.includes('MotionEnginePreviewRoot')) failures.push('Studio Root must expose Motion Engine preview');
  if (productionEntry.includes('MotionEngine') || productionEntry.includes('motion-engine')) failures.push('Production entry must not contain Motion Engine preview/lab imports');
}

if (failures.length) {
  console.error('MOTION ENGINE: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('MOTION ENGINE: PASS — camera tracking, authored trajectories, velocity stretch, parallax depth, masked kinetic type, temporal blur, settle/alive motion and Studio-only lab wiring are present.');
