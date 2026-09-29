import test from 'node:test';
import assert from 'node:assert/strict';
import {validateHeroMotionSource} from '../motion-engine-source-contract.mjs';

test('hero contract accepts authored Motion Engine choreography',()=>{
  const source=`
    import {useCurrentFrame} from 'remotion';
    const Hero=()=>{const frame=useCurrentFrame();return <CinematicCameraRig move="impact-push" impactFrame={30}><ChoreographedObject anticipationStart={0} launchFrame={10} impactFrame={30} settleFrame={50} endFrame={80} path={[[0,0],[1,1],[2,2],[3,3]]}>x</ChoreographedObject></CinematicCameraRig>};
  `;
  assert.deepEqual(validateHeroMotionSource(source),[]);
});

test('hero contract rejects plain fade/slide utility motion',()=>{
  const source=`import {useCurrentFrame} from 'remotion'; const Hero=()=>{const frame=useCurrentFrame();return <div style={{opacity:frame/30}}>x</div>};`;
  assert.ok(validateHeroMotionSource(source).length>=2);
});
