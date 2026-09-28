import type {AuthoredVisualScene} from '../../animation-library/authoredProductionGate';

export const CHATGPT_SECURITY_VISUAL_PROFILES: readonly AuthoredVisualScene[] = [
  {sceneId:'security-01',visualId:'security-login-collision-v1',fingerprint:{primaryPrimitive:'object',cameraMotion:'push',depthStyle:'pseudo-3d',entryMechanism:'cut',medium:'remotion-native',direction:'center-out',visualFamily:'account-security-impact',layoutFamily:'device-shield-collision',motionSignature:'device-visible-risk-hit-event-lock'}},
  {sceneId:'security-02',visualId:'security-history-timeline-v1',fingerprint:{primaryPrimitive:'path',cameraMotion:'pan',depthStyle:'layered-2d',entryMechanism:'draw',medium:'remotion-native',direction:'left-to-right',visualFamily:'security-event-history',layoutFamily:'timeline-three-events',motionSignature:'node-path-node-path-history-complete'}},
  {sceneId:'security-03',visualId:'security-device-details-v1',fingerprint:{primaryPrimitive:'ui',cameraMotion:'parallax',depthStyle:'pseudo-3d',entryMechanism:'depth',medium:'remotion-native',direction:'center-out',visualFamily:'device-context-details',layoutFamily:'phone-three-depth-layers',motionSignature:'phone-hold-layers-separate-detail-focus'}},
  {sceneId:'security-04',visualId:'security-action-gate-v1',fingerprint:{primaryPrimitive:'mixed',cameraMotion:'pull',depthStyle:'pseudo-3d',entryMechanism:'morph',medium:'remotion-native',direction:'outside-in',visualFamily:'security-action-verdict',layoutFamily:'risk-gate-action',motionSignature:'risk-enters-scan-gate-transform-secure'}}
] as const;
