import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MOTION_SAFE_ZONES} from './layout';
import {MotionStage} from './MotionStage';
import {motionStoryboardSchema, type MotionStoryboard} from './schema';
import {getSentenceTypography} from './textLayout';
import {TEMPLATE_REGISTRY} from './templates/TemplateRegistry';

const MotionSceneComponent: React.FC<{storyboard: MotionStoryboard}> = ({storyboard}) => {
  const parsed = React.useMemo(
    () => motionStoryboardSchema.parse(storyboard),
    [storyboard],
  );
  const template = TEMPLATE_REGISTRY[parsed.visualType];
  const sentenceTypography = React.useMemo(
    () => getSentenceTypography(parsed.sentence),
    [parsed.sentence],
  );

  return (
    <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: MOTION_SAFE_ZONES.titleTop,
          textAlign: 'center',
          fontSize: 38,
          fontWeight: 800,
          color: '#1A1A2E',
          letterSpacing: -0.8,
        }}
      >
        {template.title}
      </div>

      <MotionStage storyboard={parsed} />

      <div
        style={{
          position: 'absolute',
          left: MOTION_SAFE_ZONES.horizontalPadding,
          right: MOTION_SAFE_ZONES.horizontalPadding,
          bottom: MOTION_SAFE_ZONES.captionBottom,
          minHeight: MOTION_SAFE_ZONES.captionMinHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: sentenceTypography.fontSize,
          lineHeight: sentenceTypography.lineHeight,
          letterSpacing: sentenceTypography.letterSpacing,
          color: '#1A1A2E',
          fontWeight: 700,
          textShadow: '0 2px 10px rgba(255,255,255,0.95)',
          overflowWrap: 'anywhere',
          padding: '0 10px',
          boxSizing: 'border-box',
        }}
      >
        {parsed.sentence}
      </div>
    </AbsoluteFill>
  );
};

export const MotionScene = React.memo(MotionSceneComponent);
