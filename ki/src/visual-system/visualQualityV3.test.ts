import {describe, expect, it} from 'vitest';
import {assertVisualQualityV3, type VisualQualityV3Contract} from './visualQualityV3';

const good: VisualQualityV3Contract = {
  version: 3,
  hook: {heroAreaRatio: 0.34, semanticVisualAnchors: 3, brandAnchorAreaRatio: 0.05, stateChangesFirstSecond: 2, stateChangesFirst3Seconds: 4, contrast: 'strong', conflictVisible: true, keyMessageVisible: true},
  scenes: [
    {sceneId:'s1',archetype:'hero-impact',heroAreaRatio:.34,semanticIconCount:2,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:4,microBeats:4,motionDistancePx:180,depthLayers:2,contrast:'strong',cameraMotion:'push'},
    {sceneId:'s2',archetype:'network-flow',heroAreaRatio:.24,semanticIconCount:3,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:3,microBeats:3,motionDistancePx:120,depthLayers:2,contrast:'balanced',cameraMotion:'parallax'},
    {sceneId:'s3',archetype:'terminal-code',heroAreaRatio:.28,semanticIconCount:1,illustrationCount:2,supportElementCount:4,distinctShapeFamilies:3,meaningfulStateChanges:3,microBeats:3,motionDistancePx:90,depthLayers:2,contrast:'strong',cameraMotion:'push'},
    {sceneId:'s4',archetype:'final-verdict',heroAreaRatio:.30,semanticIconCount:3,illustrationCount:1,supportElementCount:5,distinctShapeFamilies:4,meaningfulStateChanges:3,microBeats:3,motionDistancePx:100,depthLayers:2,contrast:'strong',cameraMotion:'pull'},
  ],
  targetScores: {hook:8.5,visualVariety:8.5,motion:8.5,iconIllustrationUse:8.5,readability:8.5,overall:8.5},
};

describe('Visual Quality V3', () => {
  it('accepts a visually strong multi-archetype plan', () => expect(() => assertVisualQualityV3(good)).not.toThrow());
  it('rejects a tiny weak hook', () => expect(() => assertVisualQualityV3({...good, hook: {...good.hook, heroAreaRatio: .12}})).toThrow(/hook hero/));
  it('rejects repeated shot archetypes', () => expect(() => assertVisualQualityV3({...good, scenes: [good.scenes[0], {...good.scenes[1], archetype:'hero-impact'}, good.scenes[2], good.scenes[3]]})).toThrow(/repeat shot archetype/));
  it('rejects scenes that count tiny decoration instead of semantic visuals', () => expect(() => assertVisualQualityV3({...good, scenes: [{...good.scenes[0], semanticIconCount:0, illustrationCount:1}, ...good.scenes.slice(1)]})).toThrow(/semantic icons\/illustrations/));
});
