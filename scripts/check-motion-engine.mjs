import {access, readFile} from 'node:fs/promises';

const requiredFiles=[
  'ki/src/motion-engine/CinematicCameraRig.tsx',
  'ki/src/motion-engine/ChoreographedObject.tsx',
  'ki/src/motion-engine/MotionEffects.tsx',
  'ki/src/motion-engine/SceneMotionOrchestrator.tsx',
  'ki/src/motion-engine/MotionEngineLab.tsx',
];

const failures=[];
for (const path of requiredFiles) {
  try { await access(path); } catch { failures.push(`missing ${path}`); }
}
if (failures.length===0) {
  const [camera,object,effects]=await Promise.all(requiredFiles.slice(0,3).map((path)=>readFile(path,'utf8')));
  for (const marker of ['push-through','whip-left','impact-push','orbit-right']) if (!camera.includes(marker)) failures.push(`camera rig missing ${marker}`);
  for (const marker of ['bezierPoint','anticipationStart','impactFrame','settleFrame']) if (!object.includes(marker)) failures.push(`object choreography missing ${marker}`);
  for (const marker of ['ImpactShake','AliveHold','DirectionalBlur']) if (!effects.includes(marker)) failures.push(`motion effects missing ${marker}`);
}

if (failures.length) {
  console.error('MOTION ENGINE: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('MOTION ENGINE: PASS');
