import {describe, expect, it} from 'vitest';
import {assertRemotionCapabilityPlan, type RemotionCapabilityPlan} from './remotionCapabilities';

const validPlan: RemotionCapabilityPlan = {
  version: 1,
  beats: [
    {beatId:'hook',isHook:true,isHero:true,primaryCapability:'object-transformation',capabilities:['object-transformation','kinetic-typography'],primaryPrimitive:'object',rationale:'A visible model transformation communicates the conflict immediately without relying on a panel.'},
    {beatId:'flow',primaryCapability:'paths',capabilities:['paths','motion-blur'],primaryPrimitive:'path',rationale:'A drawn route with a moving payload explains directional data flow better than labels in cards.'},
    {beatId:'code',primaryCapability:'terminal-code',capabilities:['terminal-code','kinetic-typography'],primaryPrimitive:'code',rationale:'The claim is about implementation, so an executable-looking code surface is the semantic object itself.'},
    {beatId:'verdict',primaryCapability:'shapes',capabilities:['shapes','kinetic-typography'],primaryPrimitive:'shape',rationale:'Large geometric forms and type create a distinct visual verdict rather than another information panel.'},
  ],
};

describe('assertRemotionCapabilityPlan', () => {
  it('accepts a varied capability plan', () => {
    expect(() => assertRemotionCapabilityPlan(validPlan)).not.toThrow();
  });

  it('rejects an abstract card without semantic reason', () => {
    const broken: RemotionCapabilityPlan = {
      ...validPlan,
      beats: validPlan.beats.map((beat,index)=>index===1?{...beat,primaryCapability:'react-svg-css',capabilities:['react-svg-css'],primaryPrimitive:'card'}:beat),
    };
    expect(() => assertRemotionCapabilityPlan(broken)).toThrow(/card is forbidden/i);
  });

  it('rejects a plain CSS-only hook', () => {
    const broken: RemotionCapabilityPlan = {
      ...validPlan,
      beats: validPlan.beats.map((beat,index)=>index===0?{...beat,primaryCapability:'react-svg-css',capabilities:['react-svg-css'],primaryPrimitive:'typography'}:beat),
    };
    expect(() => assertRemotionCapabilityPlan(broken)).toThrow(/hook must use/i);
  });
});