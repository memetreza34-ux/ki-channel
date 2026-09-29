import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=(path)=>readFile(path,'utf8');

test('Motion Engine V1 exposes authored cinematic primitives',async()=>{
  const [camera,object,effects,parallax,type,lab]=await Promise.all([
    read('ki/src/motion-engine/CinematicCameraRig.tsx'),
    read('ki/src/motion-engine/ChoreographedObject.tsx'),
    read('ki/src/motion-engine/MotionEffects.tsx'),
    read('ki/src/motion-engine/ParallaxStage.tsx'),
    read('ki/src/motion-engine/MaskedKineticText.tsx'),
    read('ki/src/motion-engine/MotionEngineLab.tsx'),
  ]);

  for (const marker of ['push-through','whip-left','whip-right','impact-push','orbit-left','orbit-right','followPath','followAnchor']) {
    assert.match(camera,new RegExp(marker));
  }
  for (const marker of ['bezierPoint','anticipationStart','impactFrame','settleFrame','velocityStretch','zStart','zEnd']) {
    assert.match(object,new RegExp(marker));
  }
  for (const marker of ['ImpactShake','AliveHold','DirectionalBlur','SampledMotionBlur']) {
    assert.match(effects,new RegExp(marker));
  }
  assert.match(parallax,/ParallaxStage/);
  assert.match(parallax,/ParallaxLayer/);
  assert.match(parallax,/translate3d/);
  assert.match(type,/MaskedKineticText/);
  assert.match(type,/clipPath/);
  assert.match(type,/spring/);
  assert.match(lab,/KI-MotionEngine-V1/);
  assert.match(lab,/ChoreographedObject/);
  assert.match(lab,/CinematicCameraRig/);
  assert.match(lab,/ParallaxStage/);
  assert.match(lab,/MaskedKineticText/);
  assert.match(lab,/followPath/);
});
