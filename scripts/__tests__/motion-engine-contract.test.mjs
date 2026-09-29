import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=(path)=>readFile(path,'utf8');

test('Motion Engine V1 exposes authored cinematic primitives',async()=>{
  const [camera,object,effects,lab]=await Promise.all([
    read('ki/src/motion-engine/CinematicCameraRig.tsx'),
    read('ki/src/motion-engine/ChoreographedObject.tsx'),
    read('ki/src/motion-engine/MotionEffects.tsx'),
    read('ki/src/motion-engine/MotionEngineLab.tsx'),
  ]);

  for (const marker of ['push-through','whip-left','whip-right','impact-push','orbit-left','orbit-right']) {
    assert.match(camera,new RegExp(marker));
  }
  assert.match(object,/bezierPoint/);
  assert.match(object,/anticipationStart/);
  assert.match(object,/impactFrame/);
  assert.match(object,/settleFrame/);
  assert.match(effects,/ImpactShake/);
  assert.match(effects,/AliveHold/);
  assert.match(effects,/DirectionalBlur/);
  assert.match(lab,/KI-MotionEngine-V1/);
  assert.match(lab,/ChoreographedObject/);
  assert.match(lab,/CinematicCameraRig/);
});
