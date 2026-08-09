import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {
  CONTEXT_OVERLOAD_DURATION_IN_FRAMES,
  CONTEXT_OVERLOAD_SCENES,
} from './contract';
import {ContextOverloadCaptions} from './Captions';
import {buildContextOverloadSceneRuntime} from './runtime';

export type ReelContextOverloadProps = {
  voiceoverSrc?: string;
  showCaptions?: boolean;
  showDebugTimeline?: boolean;
};

const DebugTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [0, CONTEXT_OVERLOAD_DURATION_IN_FRAMES - 1],
    [0, 100],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const activeSceneIndex = CONTEXT_OVERLOAD_SCENES.findIndex(
    (scene) => frame >= scene.startFrame && frame < scene.endFrame,
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 8,
          background: BRAND.bgDeep,
          zIndex: 250,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: BRAND.accentDk,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 28,
          top: 28,
          zIndex: 250,
          padding: '9px 12px',
          borderRadius: 12,
          background: 'rgba(26,26,46,0.86)',
          color: '#FFFFFF',
          fontFamily: 'monospace',
          fontSize: 17,
        }}
      >
        F{frame} · S{activeSceneIndex + 1}
      </div>
    </>
  );
};

export const ReelContextOverload: React.FC<ReelContextOverloadProps> = ({
  voiceoverSrc,
  showCaptions = true,
  showDebugTimeline = false,
}) => {
  const runtimes = useMemo(
    () => CONTEXT_OVERLOAD_SCENES.map(buildContextOverloadSceneRuntime),
    [],
  );

  return (
    <AbsoluteFill style={{background: BRAND.bg}}>
      {runtimes.map(({scene, component: Component, renderProps}) => (
        <Sequence
          key={scene.sceneId}
          from={scene.startFrame}
          durationInFrames={scene.endFrame - scene.startFrame}
          name={`${scene.sceneId}-${scene.animationId}`}
        >
          <Component {...renderProps} />
        </Sequence>
      ))}

      {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
      {showCaptions ? <ContextOverloadCaptions /> : null}
      {showDebugTimeline ? <DebugTimeline /> : null}
    </AbsoluteFill>
  );
};
