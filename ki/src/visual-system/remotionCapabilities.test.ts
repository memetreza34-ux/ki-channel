import {describe, expect, it} from 'vitest';
import {assertRemotionCapabilityPlan, isSafeRemotionReelSourceFile, type RemotionCapabilityPlan} from './remotionCapabilities';

const sourceFiles = [
  'ki/src/reels/example/Hook.tsx',
  'ki/src/reels/example/Flow.tsx',
  'ki/src/reels/example/Code.tsx',
  'ki/src/reels/example/Verdict.tsx',
] as const;

const validPlan: RemotionCapabilityPlan = {
  version: 1,
  sourceFiles,
  beats: [
    {beatId:'hook',sourceFile:sourceFiles[0],isHook:true,isHero:true,primaryCapability:'object-transformation',capabilities:['object-transformation','kinetic-typography'],primaryPrimitive:'object',rationale:'A visible model transformation communicates the conflict immediately without relying on a panel.'},
    {beatId:'flow',sourceFile:sourceFiles[1],primaryCapability:'paths',capabilities:['paths','motion-blur'],primaryPrimitive:'path',rationale:'A drawn route with a moving payload explains directional data flow better than labels in cards.'},
    {beatId:'code',sourceFile:sourceFiles[2],primaryCapability:'terminal-code',capabilities:['terminal-code','kinetic-typography'],primaryPrimitive:'code',rationale:'The claim is about implementation, so an executable-looking code surface is the semantic object itself.'},
    {beatId:'verdict',sourceFile:sourceFiles[3],primaryCapability:'shapes',capabilities:['shapes','kinetic-typography'],primaryPrimitive:'shape',rationale:'Large geometric forms and type create a distinct visual verdict rather than another information panel.'},
  ],
};

describe('assertRemotionCapabilityPlan', () => {
  it('accepts a varied capability plan with safe reel source wiring', () => {
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

  it('rejects unsafe source paths and undeclared beat source files', () => {
    expect(isSafeRemotionReelSourceFile('../outside.tsx')).toBe(false);
    expect(isSafeRemotionReelSourceFile('ki/src/reels/example/Reel.tsx')).toBe(true);

    const broken: RemotionCapabilityPlan = {
      ...validPlan,
      beats: validPlan.beats.map((beat,index)=>index===2?{...beat,sourceFile:'ki/src/reels/example/Other.tsx'}:beat),
    };
    expect(() => assertRemotionCapabilityPlan(broken)).toThrow(/sourceFile must be a declared/i);
  });
});
