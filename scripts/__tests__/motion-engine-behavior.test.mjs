import test from 'node:test';
import assert from 'node:assert/strict';
import {bezierPoint,dampedOscillation} from '../../ki/src/motion-engine/motionMath.ts';

test('bezier trajectory changes both axes for authored path',()=>{
  const path=[[0,0],[120,-80],[260,180],[400,40]];
  const a=bezierPoint(.25,...path);
  const b=bezierPoint(.75,...path);
  assert.notEqual(a.x,b.x);
  assert.notEqual(a.y,b.y);
});

test('impact oscillation decays materially',()=>{
  const early=Math.abs(dampedOscillation({frame:4,startFrame:0,amplitude:20,decay:.12,frequency:.9}));
  const late=Math.abs(dampedOscillation({frame:50,startFrame:0,amplitude:20,decay:.12,frequency:.9}));
  assert.ok(early>late*3);
});
