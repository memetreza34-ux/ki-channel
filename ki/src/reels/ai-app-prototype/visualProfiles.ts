import type {AuthoredVisualScene} from '../../animation-library/authoredProductionGate';

export const AI_APP_VISUAL_PROFILES: readonly AuthoredVisualScene[] = [
  {
    sceneId: 'app-01',
    visualId: 'ai-app-idea-to-device-transformation-v2',
    fingerprint: {
      primaryPrimitive: 'object', cameraMotion: 'push', depthStyle: 'layered-2d', entryMechanism: 'morph', medium: 'remotion-native', direction: 'left-to-right',
      visualFamily: 'idea-to-prototype', layoutFamily: 'idea-beam-device-result', motionSignature: 'idea-establish-beam-transform-device-warn',
    },
  },
  {
    sceneId: 'app-02',
    visualId: 'ai-app-structure-radial-plan-v2',
    fingerprint: {
      primaryPrimitive: 'nodes', cameraMotion: 'parallax', depthStyle: 'flat', entryMechanism: 'draw', medium: 'remotion-native', direction: 'center-out',
      visualFamily: 'app-structure', layoutFamily: 'radial-plan-network', motionSignature: 'plan-core-connect-nodes-clarify',
    },
  },
  {
    sceneId: 'app-03',
    visualId: 'ai-app-module-assembly-v2',
    fingerprint: {
      primaryPrimitive: 'object', cameraMotion: 'pan', depthStyle: 'pseudo-3d', entryMechanism: 'assemble', medium: 'remotion-native', direction: 'left-to-right',
      visualFamily: 'code-assembly', layoutFamily: 'modules-to-device-assembly', motionSignature: 'modules-separate-route-assemble-prototype',
    },
  },
  {
    sceneId: 'app-04',
    visualId: 'ai-app-diagnostic-scanner-v2',
    fingerprint: {
      primaryPrimitive: 'path', cameraMotion: 'pull', depthStyle: 'layered-2d', entryMechanism: 'mask', medium: 'remotion-native', direction: 'top-to-bottom',
      visualFamily: 'testing-diagnostics', layoutFamily: 'full-frame-app-scanner', motionSignature: 'scan-descend-detect-mark-repair',
    },
  },
  {
    sceneId: 'app-05',
    visualId: 'ai-app-human-gated-workflow-v2',
    fingerprint: {
      primaryPrimitive: 'path', cameraMotion: 'pan', depthStyle: 'flat', entryMechanism: 'draw', medium: 'remotion-native', direction: 'left-to-right',
      visualFamily: 'iterative-workflow', layoutFamily: 'serpentine-build-test-fix-route', motionSignature: 'route-progress-human-gate-resume-finish',
    },
  },
] as const;
