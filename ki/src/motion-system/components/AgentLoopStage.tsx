import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProcessingCore} from './ProcessingCore';

const steps = [
  {label: 'Planen', angle: -90},
  {label: 'Ausführen', angle: 30},
  {label: 'Prüfen', angle: 150},
];

export const AgentLoopStage: React.FC<{startFrame?: number}> = ({startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const loopProgress = interpolate(frame, [startFrame + 20, startFrame + 120], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <>
      <ProcessingCore x={410} y={650} startFrame={startFrame} label="KI-Agent" />
      <svg width="1080" height="1920" style={{position:'absolute', inset:0}}>
        <circle cx="540" cy="775" r="255" fill="none" stroke="#E8DDF8" strokeWidth="12" strokeDasharray="14 16" />
        <circle
          cx="540" cy="775" r="255" fill="none" stroke="#B98CFF" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${1600 * loopProgress} 1600`} transform="rotate(-90 540 775)"
        />
      </svg>
      {steps.map((step, index) => {
        const local = spring({fps, frame: frame - (startFrame + 18 + index * 18), config: {damping: 18, stiffness: 175}});
        const rad = (step.angle * Math.PI) / 180;
        const x = 540 + Math.cos(rad) * 255 - 105;
        const y = 775 + Math.sin(rad) * 255 - 55;
        return (
          <div key={step.label} style={{
            position:'absolute', left:x, top:y, width:210, height:110, borderRadius:28,
            background:'#FFFFFF', border:'4px solid #CDB6F5', boxShadow:'0 22px 52px rgba(26,26,46,0.10)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900,
            color:'#1A1A2E', opacity:local,
            transform:`scale(${interpolate(local,[0,1],[0.9,1])}) translateY(${interpolate(local,[0,1],[18,0])}px)`,
          }}>{step.label}</div>
        );
      })}
      <div style={{
        position:'absolute', left:365, top:1125, width:350, height:130, borderRadius:32,
        background:'#F1FFF7', border:'4px solid #6FD19C', boxShadow:'0 24px 58px rgba(111,209,156,0.20)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, fontWeight:900, color:'#1A1A2E',
        opacity: spring({fps, frame: frame - (startFrame + 92), config:{damping:18, stiffness:175}}),
      }}>Selbstständig weiter</div>
    </>
  );
};
