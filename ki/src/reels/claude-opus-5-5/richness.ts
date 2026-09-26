import type {SceneRichnessEntry} from '../../visual-system/sceneRichness';

export const CLAUDE_OPUS55_SCENE_RICHNESS: readonly SceneRichnessEntry[] = [
  {sceneId:'claude55-01',heroObjects:3,supportElements:8,brandAnchors:1,meaningfulStateChanges:5,microBeats:5,depthLayers:4,cameraMotion:'push',visualMechanisms:['model-chip','old-model-eject','cost-slam','brand-anchor','semantic-icons'],intentionalWhitespace:false},
  {sceneId:'claude55-02',heroObjects:2,supportElements:6,brandAnchors:1,meaningfulStateChanges:4,microBeats:4,depthLayers:3,cameraMotion:'pan',visualMechanisms:['dual-model','balance-line','equality-lock','semantic-icons'],intentionalWhitespace:false},
  {sceneId:'claude55-03',heroObjects:2,supportElements:7,brandAnchors:1,meaningfulStateChanges:5,microBeats:4,depthLayers:3,cameraMotion:'push',visualMechanisms:['price-slabs','old-new-transform','direction-arrows','token-icons'],intentionalWhitespace:false},
  {sceneId:'claude55-04',heroObjects:2,supportElements:7,brandAnchors:1,meaningfulStateChanges:5,microBeats:5,depthLayers:4,cameraMotion:'parallax',visualMechanisms:['server-stack','packet-flow','race-lanes','speed-anchor'],intentionalWhitespace:false},
  {sceneId:'claude55-05',heroObjects:1,supportElements:7,brandAnchors:1,meaningfulStateChanges:4,microBeats:4,depthLayers:3,cameraMotion:'push',visualMechanisms:['terminal','active-line','job-icons','model-chip'],intentionalWhitespace:false},
  {sceneId:'claude55-06',heroObjects:2,supportElements:6,brandAnchors:1,meaningfulStateChanges:4,microBeats:4,depthLayers:3,cameraMotion:'pull',visualMechanisms:['evidence-split','source-icons','focus-lens','context-warning'],intentionalWhitespace:false},
  {sceneId:'claude55-07',heroObjects:2,supportElements:8,brandAnchors:1,meaningfulStateChanges:5,microBeats:5,depthLayers:4,cameraMotion:'pull',visualMechanisms:['model-chip','three-pillars','semantic-icons','coding-dock','verdict'],intentionalWhitespace:false}
] as const;
