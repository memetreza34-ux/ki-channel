import {describe,expect,it} from 'vitest';
import {resolveMotionState} from '../KeyframedMotion';
import {bezierPoint,bezierTangentAngle,cinematicPhase,dampedOscillation} from '../motionMath';
import {assertMotionBeatContract} from '../SceneMotionOrchestrator';
import {resolveWorldCameraPose} from '../WorldCameraRig';

describe('motionMath',()=>{
  it('keeps bezier endpoints exact',()=>{
    const path=[[0,0],[10,20],[20,10],[30,30]] as const;
    expect(bezierPoint(0,...path)).toEqual({x:0,y:0});
    expect(bezierPoint(1,...path)).toEqual({x:30,y:30});
    expect(Number.isFinite(bezierTangentAngle(.5,...path))).toBe(true);
  });

  it('damps impact oscillation over time',()=>{
    const early=Math.abs(dampedOscillation({frame:11,startFrame:10,amplitude:20}));
    const late=Math.abs(dampedOscillation({frame:60,startFrame:10,amplitude:20}));
    expect(early).toBeGreaterThan(late);
  });

  it('splits authored choreography into meaningful phases',()=>{
    const before=cinematicPhase({frame:0,anticipationStart:5,launchFrame:20,impactFrame:50,settleFrame:75,endFrame:110});
    const hit=cinematicPhase({frame:55,anticipationStart:5,launchFrame:20,impactFrame:50,settleFrame:75,endFrame:110});
    expect(before.travel).toBe(0);
    expect(hit.impact).toBeGreaterThan(0);
    expect(hit.settle).toBeGreaterThan(0);
  });
});

describe('continuous world camera',()=>{
  const keys=[
    {frame:0,focusX:100,focusY:200,zoom:1},
    {frame:30,focusX:100,focusY:200,zoom:1},
    {frame:60,focusX:900,focusY:600,zoom:.7},
  ] as const;

  it('keeps repeated keyframes as an intentional hold',()=>{
    expect(resolveWorldCameraPose(15,keys,'cinematic')).toMatchObject({focusX:100,focusY:200,zoom:1});
  });

  it('travels toward the next world destination after the hold',()=>{
    const pose=resolveWorldCameraPose(45,keys,'cinematic');
    expect(pose.focusX).toBeGreaterThan(100);
    expect(pose.focusX).toBeLessThan(900);
    expect(pose.zoom).toBeLessThan(1);
  });
});

describe('multi-state motion',()=>{
  const states=[
    {frame:0,x:0,y:0,scale:1,opacity:0},
    {frame:20,x:100,y:40,scale:1.2,opacity:1},
    {frame:40,x:100,y:40,scale:1.2,opacity:1},
    {frame:70,x:300,y:120,scale:.8,rotateY:35,opacity:1},
  ] as const;

  it('preserves omitted values and explicit holds across states',()=>{
    const held=resolveMotionState(30,states,'cinematic');
    expect(held.x).toBe(100);
    expect(held.y).toBe(40);
    expect(held.opacity).toBe(1);
  });

  it('supports later 3D state transitions',()=>{
    const moving=resolveMotionState(55,states,'smooth');
    expect(moving.x).toBeGreaterThan(100);
    expect(moving.rotateY).toBeGreaterThan(0);
  });
});

describe('motion beat contract',()=>{
  it('accepts impact/reveal plus settle choreography',()=>{
    expect(()=>assertMotionBeatContract([
      {id:'anticipate',startFrame:0,endFrame:10,role:'anticipation'},
      {id:'impact',startFrame:11,endFrame:35,role:'impact'},
      {id:'settle',startFrame:36,endFrame:59,role:'settle'},
    ],60)).not.toThrow();
  });

  it('rejects choreography with no payoff',()=>{
    expect(()=>assertMotionBeatContract([
      {id:'a',startFrame:0,endFrame:10,role:'anticipation'},
      {id:'b',startFrame:11,endFrame:20,role:'travel'},
      {id:'c',startFrame:21,endFrame:30,role:'hold'},
    ],60)).toThrow(/impact or reveal/);
  });
});
