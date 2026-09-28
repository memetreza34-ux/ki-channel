import type {SceneRichnessEntry} from '../../visual-system/sceneRichness';

export const CHATGPT_SECURITY_SCENE_RICHNESS: readonly SceneRichnessEntry[] = [
  {sceneId:'security-01',heroObjects:2,supportElements:6,brandAnchors:1,meaningfulStateChanges:4,microBeats:3,depthLayers:4,cameraMotion:'push',visualMechanisms:['device-shell','shield-core','risk-pulse','kinetic-type'],intentionalWhitespace:false},
  {sceneId:'security-02',heroObjects:1,supportElements:7,brandAnchors:1,meaningfulStateChanges:4,microBeats:3,depthLayers:3,cameraMotion:'pan',visualMechanisms:['event-nodes','animated-path','state-labels','history-rail'],intentionalWhitespace:false},
  {sceneId:'security-03',heroObjects:1,supportElements:7,brandAnchors:1,meaningfulStateChanges:4,microBeats:3,depthLayers:5,cameraMotion:'parallax',visualMechanisms:['phone-shell','browser-chrome','depth-stage','detail-layers'],intentionalWhitespace:false},
  {sceneId:'security-04',heroObjects:2,supportElements:6,brandAnchors:1,meaningfulStateChanges:4,microBeats:3,depthLayers:4,cameraMotion:'pull',visualMechanisms:['risk-state','shield-gate','scan-line','object-transformation'],intentionalWhitespace:false}
] as const;
