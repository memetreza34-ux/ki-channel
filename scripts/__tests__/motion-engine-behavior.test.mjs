import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('motion engine contains authored trajectory and decaying impact math',async()=>{
  const [math,object]=await Promise.all([
    readFile('ki/src/motion-engine/motionMath.ts','utf8'),
    readFile('ki/src/motion-engine/ChoreographedObject.tsx','utf8'),
  ]);
  assert.match(math,/bezierPoint/);
  assert.match(math,/Math\.exp\(-t \* decay\)/);
  assert.match(object,/bezierTangentAngle/);
  assert.match(object,/anticipationDistance/);
  assert.match(object,/settleSpring/);
});
