import test from 'node:test';
import assert from 'node:assert/strict';
import {validateHeroMotionSource} from '../motion-engine-source-contract.mjs';

test('hero contract accepts authored Motion Engine choreography',()=>{
  const source=`
    const Hero=()=> <CinematicCameraRig move="impact-push" impactFrame={30}><ChoreographedObject anticipationStart={0} launchFrame={10} impactFrame={30} settleFrame={50} endFrame={80} path={[[0,0],[1,1],[2,2],[3,3]]}>x</ChoreographedObject></CinematicCameraRig>;
  `;
  assert.deepEqual(validateHeroMotionSource(source),[]);
});

test('hero contract accepts continuous world plus multi-state motion',()=>{
  const source=`
    const Hero=()=> <WorldCameraRig keyframes={CAMERA} worldWidth={2600} worldHeight={3200}><KeyframedMotion states={STATES}>x</KeyframedMotion></WorldCameraRig>;
  `;
  assert.deepEqual(validateHeroMotionSource(source),[]);
});

test('hero contract accepts layered parallax plus masked kinetic type',()=>{
  const source=`
    const Hero=()=> <ParallaxStage startFrame={0} endFrame={80}><ParallaxLayer depth={.8}><MaskedKineticText lines={["VOICE","WORKFLOW"]} startFrame={0} /></ParallaxLayer></ParallaxStage>;
  `;
  assert.deepEqual(validateHeroMotionSource(source),[]);
});

test('hero contract accepts reel-specific frame-driven choreography',()=>{
  const source=`
    import {interpolate,spring,useCurrentFrame} from 'remotion';
    const Hero=()=>{const frame=useCurrentFrame();const anticipation=interpolate(frame,[0,10],[0,1]);const impact=spring({frame:Math.max(0,frame-20),fps:30});const settle=interpolate(frame,[20,50],[0,1]);return <div style={{transform:\`translate3d(\${anticipation*40}px,0,0) scale(\${1+impact*.1-settle*.1})\`}}>x</div>};
  `;
  assert.deepEqual(validateHeroMotionSource(source),[]);
});

test('hero contract accepts real animated Lottie or Rive assets',()=>{
  assert.deepEqual(validateHeroMotionSource('<Lottie animationData={data} />'),[]);
  assert.deepEqual(validateHeroMotionSource('<RemotionRiveCanvas src={src} />'),[]);
});

test('hero contract rejects plain fade/slide utility motion',()=>{
  const source=`import {useCurrentFrame} from 'remotion'; const Hero=()=>{const frame=useCurrentFrame();return <div style={{opacity:frame/30}}>x</div>};`;
  assert.ok(validateHeroMotionSource(source).length>=1);
});
