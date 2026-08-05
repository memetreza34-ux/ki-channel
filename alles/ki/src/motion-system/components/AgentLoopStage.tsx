import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {getLabelTypography} from '../textLayout';
import {ProcessingCore} from './ProcessingCore';

type AgentLoopStep = {
  label: string;
  angle: number;
};

export type AgentLoopStageTimings = {
  agentFrame?: number;
  stepFrames?: number[];
  resultFrame?: number;
};

export const AgentLoopStage: React.FC<{
  agentLabel?: string;
  stepLabels?: string[];
  resultLabel?: string;
  startFrame?: number;
  timings?: AgentLoopStageTimings;
}> = ({
  agentLabel = 'KI-Agent',
  stepLabels = ['Planen', 'Ausführen', 'Prüfen'],
  resultLabel = 'Selbstständig weiter',
  startFrame = 0,
  timings,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps: AgentLoopStep[] = [
    {label: stepLabels[0] ?? 'Planen', angle: -90},
    {label: stepLabels[1] ?? 'Ausführen', angle: 30},
    {label: stepLabels[2] ?? 'Prüfen', angle: 150},
  ];
  const agentFrame = timings?.agentFrame ?? startFrame;
  const stepFrames = steps.map((_, index) => timings?.stepFrames?.[index] ?? startFrame + 24 + index * 26);
  const resultFrame = timings?.resultFrame ?? startFrame + 104;
  const loopStartFrame = Math.min(...stepFrames);
  const loopEndFrame = Math.max(loopStartFrame + 1, resultFrame + 16);
  const loopProgress = interpolate(frame, [loopStartFrame, loopEndFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resultProgress = spring({
    fps,
    frame: frame - resultFrame,
    config: {damping: 18, stiffness: 175},
  });
  const resultTypography = getLabelTypography(resultLabel, {maxFontSize: 34, minFontSize: 23});

  return (
    <>
      <ProcessingCore x={410} y={650} startFrame={agentFrame} label={agentLabel} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <circle
          cx="540"
          cy="775"
          r="255"
          fill="none"
          stroke="#E8DDF8"
          strokeWidth="12"
          strokeDasharray="14 16"
        />
        <circle
          cx="540"
          cy="775"
          r="255"
          fill="none"
          stroke="#B98CFF"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${1600 * loopProgress} 1600`}
          transform="rotate(-90 540 775)"
        />
      </svg>
      {steps.map((step, index) => {
        const local = spring({
          fps,
          frame: frame - stepFrames[index],
          config: {damping: 18, stiffness: 175},
        });
        const rad = (step.angle * Math.PI) / 180;
        const x = 540 + Math.cos(rad) * 255 - 105;
        const y = 775 + Math.sin(rad) * 255 - 55;
        const typography = getLabelTypography(step.label, {maxFontSize: 30, minFontSize: 21});

        return (
          <div
            key={`${step.label}-${index}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 210,
              height: 110,
              borderRadius: 28,
              background: '#FFFFFF',
              border: '4px solid #CDB6F5',
              boxShadow: '0 22px 52px rgba(26,26,46,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typography.fontSize,
              lineHeight: typography.lineHeight,
              letterSpacing: typography.letterSpacing,
              fontWeight: 900,
              color: '#1A1A2E',
              opacity: local,
              transform: `scale(${interpolate(local, [0, 1], [0.9, 1])}) translateY(${interpolate(
                local,
                [0, 1],
                [18, 0],
              )}px)`,
              textAlign: 'center',
              padding: 14,
              overflowWrap: 'anywhere',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {step.label}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 365,
          top: 1125,
          width: 350,
          minHeight: 130,
          borderRadius: 32,
          background: '#F1FFF7',
          border: '4px solid #6FD19C',
          boxShadow: '0 24px 58px rgba(111,209,156,0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: resultTypography.fontSize,
          lineHeight: resultTypography.lineHeight,
          letterSpacing: resultTypography.letterSpacing,
          fontWeight: 900,
          color: '#1A1A2E',
          opacity: resultProgress,
          transform: `translateY(${interpolate(resultProgress, [0, 1], [24, 0])}px) scale(${interpolate(
            resultProgress,
            [0, 1],
            [0.92, 1],
          )})`,
          textAlign: 'center',
          padding: 20,
          overflowWrap: 'anywhere',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {resultLabel}
      </div>
    </>
  );
};
