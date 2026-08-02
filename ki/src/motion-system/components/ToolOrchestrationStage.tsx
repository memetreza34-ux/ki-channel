import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProcessingCore} from './ProcessingCore';

type ToolItem = {
  label: string;
  x: number;
  y: number;
  appearFrame: number;
  connectFrame: number;
};

export type ToolOrchestrationStageTimings = {
  taskFrame?: number;
  coreFrame?: number;
  toolFrames?: number[];
  connectionFrames?: number[];
  resultFrame?: number;
};

const toolYPositions = (count: number): number[] => {
  if (count <= 1) return [685];
  if (count === 2) return [570, 800];
  return [455, 685, 915];
};

export const ToolOrchestrationStage: React.FC<{
  taskLabel?: string;
  resultLabel?: string;
  toolLabels?: string[];
  startFrame?: number;
  timings?: ToolOrchestrationStageTimings;
}> = ({
  taskLabel = 'Aufgabe',
  resultLabel = 'Ergebnis',
  toolLabels = ['Browser', 'Dateien', 'E-Mail'],
  startFrame = 0,
  timings,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const taskFrame = timings?.taskFrame ?? startFrame;
  const coreFrame = timings?.coreFrame ?? startFrame + 18;
  const resultFrame = timings?.resultFrame ?? startFrame + 112;
  const visibleLabels = toolLabels.slice(0, 3);
  const positions = toolYPositions(visibleLabels.length);
  const taskProgress = spring({fps, frame: frame - taskFrame, config: {damping: 18, stiffness: 175}});
  const resultProgress = spring({fps, frame: frame - resultFrame, config: {damping: 18, stiffness: 175}});
  const tools: ToolItem[] = visibleLabels.map((label, index) => ({
    label,
    x: 735,
    y: positions[index],
    appearFrame: timings?.toolFrames?.[index] ?? startFrame + 38 + index * 12,
    connectFrame: timings?.connectionFrames?.[index] ?? startFrame + 76 + index * 6,
  }));

  const card = (label: string, x: number, y: number, progress: number, accent: string) => (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: 250, height: 142,
        borderRadius: 32, border: `4px solid ${accent}`, background: '#FFFFFF',
        boxShadow: '0 24px 58px rgba(26,26,46,0.10)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: label.length > 18 ? 27 : 32, fontWeight: 900,
        color: '#1A1A2E', opacity: progress,
        transform: `translateY(${interpolate(progress,[0,1],[26,0])}px) scale(${interpolate(progress,[0,1],[0.92,1])})`,
        textAlign: 'center', padding: 18, overflowWrap: 'anywhere',
      }}
    >{label}</div>
  );

  const resultConnectionStart = Math.max(coreFrame + 20, resultFrame - 28);
  const resultConnectionEnd = Math.max(resultConnectionStart + 1, resultFrame + 8);

  return (
    <>
      {card(taskLabel, 70, 650, taskProgress, '#D9D4E7')}
      <ProcessingCore x={410} y={600} startFrame={coreFrame} label="KI-Agent" />
      {tools.map((tool, index) => {
        const progress = spring({fps, frame: frame - tool.appearFrame, config: {damping: 18, stiffness: 170}});
        return <React.Fragment key={`${tool.label}-${index}`}>{card(tool.label, tool.x, tool.y, progress, '#CDB6F5')}</React.Fragment>;
      })}
      {card(resultLabel, 410, 1120, resultProgress, '#6FD19C')}

      <svg width="1080" height="1920" style={{position:'absolute', inset:0}}>
        {tools.map((tool, index) => {
          const p = interpolate(frame,[tool.connectFrame,tool.connectFrame + 26],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
          const y2 = tool.y + 71;
          return <line key={`${tool.label}-${index}`} x1="640" y1="725" x2={640 + (tool.x - 640) * p} y2={725 + (y2 - 725) * p} stroke="#B98CFF" strokeWidth="8" strokeLinecap="round" />;
        })}
        <line x1="540" y1="830" x2="540" y2={830 + 290 * interpolate(frame,[resultConnectionStart,resultConnectionEnd],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})} stroke="#6FD19C" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </>
  );
};
