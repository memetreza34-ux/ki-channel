import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProcessingCore} from './ProcessingCore';

type ToolItem = {
  label: string;
  x: number;
  y: number;
  delay: number;
};

export const ToolOrchestrationStage: React.FC<{
  taskLabel?: string;
  resultLabel?: string;
  toolLabels?: string[];
  startFrame?: number;
}> = ({taskLabel = 'Aufgabe', resultLabel = 'Ergebnis', toolLabels = ['Browser', 'Dateien', 'E-Mail'], startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const taskProgress = spring({fps, frame: frame - startFrame, config: {damping: 18, stiffness: 175}});
  const resultProgress = spring({fps, frame: frame - (startFrame + 92), config: {damping: 18, stiffness: 175}});
  const tools: ToolItem[] = [
    {label: toolLabels[0] ?? 'Browser', x: 735, y: 455, delay: 38},
    {label: toolLabels[1] ?? 'Dateien', x: 735, y: 685, delay: 50},
    {label: toolLabels[2] ?? 'E-Mail', x: 735, y: 915, delay: 62},
  ];

  const card = (label: string, x: number, y: number, progress: number, accent: string) => (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: 250, height: 142,
        borderRadius: 32, border: `4px solid ${accent}`, background: '#FFFFFF',
        boxShadow: '0 24px 58px rgba(26,26,46,0.10)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900,
        color: '#1A1A2E', opacity: progress,
        transform: `translateY(${interpolate(progress,[0,1],[26,0])}px) scale(${interpolate(progress,[0,1],[0.92,1])})`,
      }}
    >{label}</div>
  );

  return (
    <>
      {card(taskLabel, 70, 650, taskProgress, '#D9D4E7')}
      <ProcessingCore x={410} y={600} startFrame={startFrame + 18} label="KI-Agent" />
      {tools.map((tool) => {
        const progress = spring({fps, frame: frame - (startFrame + tool.delay), config: {damping: 18, stiffness: 170}});
        return <React.Fragment key={tool.label}>{card(tool.label, tool.x, tool.y, progress, '#CDB6F5')}</React.Fragment>;
      })}
      {card(resultLabel, 410, 1120, resultProgress, '#6FD19C')}

      <svg width="1080" height="1920" style={{position:'absolute', inset:0}}>
        {tools.map((tool) => {
          const p = interpolate(frame,[startFrame + tool.delay + 8,startFrame + tool.delay + 34],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
          const y2 = tool.y + 71;
          return <line key={tool.label} x1="640" y1="725" x2={640 + (tool.x - 640) * p} y2={725 + (y2 - 725) * p} stroke="#B98CFF" strokeWidth="8" strokeLinecap="round" />;
        })}
        <line x1="540" y1="830" x2="540" y2={830 + 290 * interpolate(frame,[startFrame + 78,startFrame + 108],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})} stroke="#6FD19C" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </>
  );
};
