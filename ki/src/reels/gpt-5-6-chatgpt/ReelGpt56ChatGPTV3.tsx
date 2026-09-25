import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {KineticConnector, TechIcon, type TechIconName} from '../../visual-system/TechVisualKit';
import {ReelGpt56ChatGPTV2, type ReelGpt56ChatGPTProps} from './ReelGpt56ChatGPTV2';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Dot: React.FC<{
  x: number;
  y: number;
  size?: number;
  icon: TechIconName;
  progress: number;
  accent?: boolean;
}> = ({x, y, size = 74, icon, progress, accent = false}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: accent ? '#fff' : BRAND.accentDk,
      background: accent ? BRAND.accentDk : 'rgba(255,255,255,.94)',
      border: `2px solid ${accent ? 'rgba(110,69,201,.32)' : 'rgba(110,69,201,.16)'}`,
      boxShadow: accent ? '0 18px 42px rgba(110,69,201,.24)' : '0 16px 36px rgba(45,30,68,.10)',
      opacity: progress,
      transform: `scale(${0.72 + progress * 0.28}) translateY(${(1 - progress) * 18}px)`,
    }}
  >
    <TechIcon name={icon} size={size * 0.48} color="currentColor" strokeWidth={2.2} />
  </div>
);

const HookLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 0 || frame >= 210) return null;
  const reveal = ease(frame, 6, 46);
  const travel = ease(frame, 22, 116);
  const fade = 1 - ease(frame, 130, 194);
  const strength = reveal * fade;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: strength}}>
      <div style={{position: 'absolute', left: 160, top: 748, width: 760, height: 12, borderRadius: 12, background: 'rgba(110,69,201,.10)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${18 + travel * 82}%`, background: `linear-gradient(90deg,#DCC9FF,${BRAND.accentDk})`}} />
      </div>
      <Dot x={122} y={716} icon="lock" progress={reveal} />
      <Dot x={498} y={712} icon="arrow-swap" progress={clamp(reveal * 1.4 - 0.25)} accent />
      <Dot x={874} y={708} icon="sparkles" progress={travel} />
      {[0, 1, 2, 3].map((index) => {
        const p = clamp(reveal * 1.8 - index * 0.2);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 270 + index * 150,
              top: 785 + (index % 2) * 22,
              width: 94,
              height: 8,
              borderRadius: 8,
              background: index < 2 ? 'rgba(110,69,201,.28)' : 'rgba(185,140,255,.36)',
              opacity: p,
              transform: `scaleX(${0.35 + p * 0.65})`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}
    </div>
  );
};

const LunaLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 210 || frame >= 420) return null;
  const local = frame - 210;
  const rail = ease(local, 20, 178);
  const orbit = ease(local, 34, 188);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 226,
          top: 390,
          width: 628,
          height: 470,
          borderRadius: '50%',
          border: '3px solid rgba(110,69,201,.12)',
          opacity: 0.25 + orbit * 0.55,
          transform: `rotate(${orbit * 38 - 18}deg) scale(${0.88 + orbit * 0.12})`,
          boxShadow: 'inset 0 0 70px rgba(185,140,255,.06)',
        }}
      />
      <div style={{position: 'absolute', left: 214, top: 885, width: 652, height: 10, borderRadius: 10, background: 'rgba(110,69,201,.10)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${rail * 100}%`, background: `linear-gradient(90deg,#E4D6FF,${BRAND.accentDk})`}} />
      </div>
      <Dot x={180} y={850} size={70} icon="terminal" progress={clamp(rail * 2.2)} />
      <Dot x={505} y={846} size={78} icon="zap" progress={clamp(rail * 2 - 0.45)} accent />
      <Dot x={830} y={850} size={70} icon="bot" progress={clamp(rail * 2 - 1)} />
      <div style={{position: 'absolute', left: 206 + rail * 624, top: 875, width: 30, height: 30, borderRadius: '50%', background: BRAND.accentDk, boxShadow: '0 0 0 16px rgba(185,140,255,.18)', transform: 'translate(-15px,-6px)'}} />
    </div>
  );
};

const SolLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 420 || frame >= 630) return null;
  const local = frame - 420;
  const fan = ease(local, 20, 168);
  const resolve = ease(local, 104, 198);
  const nodes = [
    {x: 146, y: 760, icon: 'code' as TechIconName},
    {x: 270, y: 850, icon: 'terminal' as TechIconName},
    {x: 760, y: 670, icon: 'search' as TechIconName},
    {x: 856, y: 850, icon: 'workflow' as TechIconName},
  ];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 350, top: 650, width: 380, height: 260, borderRadius: '50%', border: '2px dashed rgba(110,69,201,.22)', opacity: fan, transform: `scale(${0.72 + fan * 0.28}) rotate(${-12 + fan * 30}deg)`}} />
      {nodes.map((node, index) => {
        const p = clamp(fan * 1.65 - index * 0.18);
        return <Dot key={`${node.x}-${node.y}`} x={node.x} y={node.y} size={64} icon={node.icon} progress={p} accent={index === 3 && resolve > 0.6} />;
      })}
      <KineticConnector from={{x: 500, y: 720}} to={{x: 205, y: 792}} startFrame={444} endFrame={520} width={5} />
      <KineticConnector from={{x: 530, y: 735}} to={{x: 325, y: 882}} startFrame={456} endFrame={536} width={5} />
      <KineticConnector from={{x: 580, y: 720}} to={{x: 790, y: 704}} startFrame={470} endFrame={550} width={5} />
      <KineticConnector from={{x: 605, y: 742}} to={{x: 884, y: 882}} startFrame={486} endFrame={570} width={5} />
      <div style={{position: 'absolute', left: 182, top: 1286, width: 716, height: 18, borderRadius: 18, background: 'rgba(110,69,201,.09)', overflow: 'hidden', opacity: resolve}}>
        <div style={{width: `${resolve * 100}%`, height: '100%', background: `linear-gradient(90deg,#DCC7FF,${BRAND.accentDk})`}} />
      </div>
    </div>
  );
};

const ThinkingLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 630 || frame >= 840) return null;
  const local = frame - 630;
  const depth = ease(local, 28, 188);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {[0, 1, 2, 3].map((index) => {
        const p = clamp(depth * 4 - index);
        const size = 330 + index * 74;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 540 - size / 2,
              top: 1080 - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              border: `2px solid rgba(110,69,201,${0.08 + index * 0.025})`,
              opacity: p,
              transform: `scale(${0.82 + p * 0.18})`,
            }}
          />
        );
      })}
      {[0, 1, 2, 3].map((index) => {
        const p = clamp(depth * 4 - index);
        return <div key={`bar-${index}`} style={{position: 'absolute', left: 108, top: 916 + index * 70, width: 118 + index * 62, height: 18, borderRadius: 18, background: index === 3 ? BRAND.accentDk : 'rgba(110,69,201,.22)', opacity: p, transform: `scaleX(${0.35 + p * 0.65})`, transformOrigin: 'left center'}} />;
      })}
    </div>
  );
};

const StepsLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 840 || frame >= 1050) return null;
  const local = frame - 840;
  const climb = ease(local, 10, 178);
  const positions = [
    {x: 150, y: 980, icon: 'zap' as TechIconName},
    {x: 354, y: 900, icon: 'gauge' as TechIconName},
    {x: 558, y: 798, icon: 'brain' as TechIconName},
    {x: 762, y: 665, icon: 'sparkles' as TechIconName},
  ];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {positions.slice(0, -1).map((position, index) => {
        const next = positions[index + 1];
        return <KineticConnector key={index} from={{x: position.x + 34, y: position.y + 34}} to={{x: next.x + 34, y: next.y + 34}} startFrame={850 + index * 26} endFrame={932 + index * 26} width={6} />;
      })}
      {positions.map((position, index) => {
        const p = clamp(climb * 4 - index * 0.72);
        return <Dot key={index} x={position.x} y={position.y} size={68 + index * 4} icon={position.icon} progress={p} accent={index === 3 && p > 0.72} />;
      })}
      <div style={{position: 'absolute', left: 106, top: 1072, width: 870, height: 14, borderRadius: 14, background: 'rgba(110,69,201,.08)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${climb * 100}%`, background: `linear-gradient(90deg,#E1D2FF,${BRAND.accentDk})`}} />
      </div>
    </div>
  );
};

const PlansLift: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 1050 || frame >= 1260) return null;
  const local = frame - 1050;
  const scan = ease(local, 18, 188);
  const scannerX = 90 + scan * 900;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: scannerX, top: 338, width: 8, height: 842, borderRadius: 8, background: `linear-gradient(180deg,rgba(110,69,201,0),${BRAND.accentDk},rgba(110,69,201,0))`, opacity: 0.45 + scan * 0.45, boxShadow: '0 0 26px rgba(110,69,201,.28)'}} />
      {[168, 400, 632, 864].map((x, index) => {
        const p = clamp(scan * 4.8 - index * 0.92);
        return <Dot key={x} x={x} y={300} size={58} icon={index === 0 && p < 0.88 ? 'lock' : 'unlock'} progress={p} accent={index > 0 && p > 0.82} />;
      })}
      <div style={{position: 'absolute', left: 100, top: 1240, width: 880, height: 12, borderRadius: 12, background: 'rgba(110,69,201,.08)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${scan * 100}%`, background: `linear-gradient(90deg,#DCC7FF,${BRAND.accentDk})`}} />
      </div>
    </div>
  );
};

const VisualLiftLayer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{zIndex: 50, pointerEvents: 'none', overflow: 'hidden'}}>
      <HookLift frame={frame} />
      <LunaLift frame={frame} />
      <SolLift frame={frame} />
      <ThinkingLift frame={frame} />
      <StepsLift frame={frame} />
      <PlansLift frame={frame} />
    </AbsoluteFill>
  );
};

export const ReelGpt56ChatGPTV3: React.FC<ReelGpt56ChatGPTProps> = (props) => (
  <AbsoluteFill>
    <ReelGpt56ChatGPTV2 {...props} />
    <VisualLiftLayer />
  </AbsoluteFill>
);
