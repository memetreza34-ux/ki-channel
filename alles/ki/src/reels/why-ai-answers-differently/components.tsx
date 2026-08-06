import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {answerFont, answerPalette, answerShadows} from './style';

export type AnswerIconName = 'split' | 'probability' | 'route' | 'temperature' | 'token' | 'shield' | 'lock' | 'compare';

export const prog = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const useEnter = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 160, mass: 0.78}});
};

const SceneIcon: React.FC<{name: AnswerIconName; progress: number}> = ({name, progress}) => {
  const p = Math.max(0, Math.min(1, progress));
  const stroke = answerPalette.accent;
  const secondary = answerPalette.danger;
  const common = {fill: 'none', stroke, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

  return (
    <div style={{width: 92, height: 92, borderRadius: 28, background: answerPalette.accentSoft, border: `3px solid ${answerPalette.accent}`, boxShadow: answerShadows.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.92 + p * 0.08})`}}>
      <svg viewBox="0 0 100 100" width="72" height="72">
        {name === 'split' ? <>
          <path d="M50 16 V42 C50 56 26 56 26 72" {...common} />
          <path d="M50 42 C50 56 74 56 74 72" {...common} stroke={secondary} />
          <circle cx="26" cy="78" r="9" fill={stroke} />
          <circle cx="74" cy="78" r="9" fill={secondary} />
        </> : null}
        {name === 'probability' ? <>
          {[26, 48, 70].map((y, index) => <React.Fragment key={y}><circle cx="18" cy={y} r="6" fill={index === 0 ? stroke : answerPalette.lineStrong} /><path d={`M31 ${y} H${45 + p * (38 - index * 8)}`} {...common} strokeWidth={8} /></React.Fragment>)}
        </> : null}
        {name === 'route' ? <>
          <circle cx="50" cy="24" r="9" fill={stroke} />
          <path d="M50 34 V48 C50 58 24 58 24 74" {...common} opacity={0.35} />
          <path d="M50 48 C50 58 50 58 50 78" {...common} />
          <path d="M50 48 C50 58 76 58 76 74" {...common} opacity={0.35} />
          <circle cx="50" cy="82" r={7 + p * 3} fill={stroke} />
        </> : null}
        {name === 'temperature' ? <>
          <circle cx="50" cy="52" r="31" {...common} stroke={answerPalette.lineStrong} />
          <path d="M50 52 L78 38" {...common} transform={`rotate(${-30 + p * 60} 50 52)`} />
          <circle cx="50" cy="52" r="8" fill={answerPalette.foreground} />
          <path d="M25 84 H75" {...common} strokeWidth={5} />
        </> : null}
        {name === 'token' ? <>
          <rect x="10" y="29" width="34" height="34" rx="10" {...common} />
          <rect x="56" y="29" width="34" height="34" rx="10" {...common} stroke={secondary} />
          <path d="M39 19 L52 29 L39 39 M61 71 L48 61 L61 51" {...common} strokeWidth={5} />
        </> : null}
        {name === 'shield' ? <>
          <path d="M50 12 L80 24 V48 C80 68 66 82 50 90 C34 82 20 68 20 48 V24 Z" {...common} />
          <path d="M34 50 L45 61 L68 37" {...common} stroke={answerPalette.success} strokeDasharray="55" strokeDashoffset={55 * (1 - p)} />
        </> : null}
        {name === 'lock' ? <>
          <path d="M31 46 V34 C31 21 39 14 50 14 C61 14 69 21 69 34 V46" {...common} transform={`translate(0 ${8 * (1 - p)})`} />
          <rect x="22" y="43" width="56" height="43" rx="13" {...common} />
          <circle cx="50" cy="64" r="7" fill={stroke} />
        </> : null}
        {name === 'compare' ? <>
          <rect x="10" y="20" width="31" height="45" rx="8" {...common} />
          <rect x="59" y="20" width="31" height="45" rx="8" {...common} />
          <circle cx={38 + p * 24} cy="62" r="17" {...common} stroke={answerPalette.success} />
          <path d={`M${50 + p * 24} 74 L${64 + p * 24} 88`} {...common} stroke={answerPalette.success} />
        </> : null}
      </svg>
    </div>
  );
};

export const SceneShell: React.FC<React.PropsWithChildren<{
  title: string;
  icon: AnswerIconName;
  iconProgress?: number;
}>> = ({title, icon, iconProgress = 1, children}) => {
  const enter = useEnter(2);
  return (
    <AbsoluteFill style={{background: answerPalette.background, color: answerPalette.foreground, fontFamily: answerFont, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 42%, rgba(108,53,215,.18), transparent 48%), linear-gradient(90deg, rgba(108,53,215,.035) 1px, transparent 1px), linear-gradient(rgba(108,53,215,.035) 1px, transparent 1px)', backgroundSize: 'auto, 88px 88px, 88px 88px'}} />
      <div style={{position: 'absolute', left: 56, right: 56, top: 72, zIndex: 50, opacity: enter, transform: `translateY(${(1 - enter) * 22}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24}}>
        <SceneIcon name={icon} progress={iconProgress} />
        <div style={{maxWidth: 820, fontSize: 58, lineHeight: 0.98, fontWeight: 970, letterSpacing: -2.8, textAlign: 'left'}}>{title}</div>
      </div>
      <div style={{position: 'absolute', left: 34, right: 34, top: 242, bottom: 470, zIndex: 10}}>{children}</div>
    </AbsoluteFill>
  );
};

export const Stage: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>{children}</div>
);

export const PromptCard: React.FC<{
  text: string;
  tone?: 'accent' | 'dark' | 'danger';
  style?: React.CSSProperties;
  opacity?: number;
}> = ({text, tone = 'accent', style, opacity = 1}) => {
  const color = tone === 'danger' ? answerPalette.danger : tone === 'dark' ? answerPalette.foreground : answerPalette.accent;
  const background = tone === 'danger' ? answerPalette.dangerSoft : tone === 'dark' ? answerPalette.foreground : answerPalette.surface;
  return <div style={{width: 560, height: 180, borderRadius: 42, border: `5px solid ${color}`, background, boxShadow: tone === 'danger' ? answerShadows.danger : tone === 'dark' ? answerShadows.dark : answerShadows.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 38px', boxSizing: 'border-box', fontSize: 34, lineHeight: 1.05, fontWeight: 970, textAlign: 'center', color: tone === 'dark' ? '#FFFFFF' : color, opacity, ...style}}>{text}</div>;
};

export const AnswerCard: React.FC<{
  label: string;
  fact?: string;
  tone?: 'accent' | 'danger' | 'success' | 'dark';
  style?: React.CSSProperties;
  opacity?: number;
}> = ({label, fact, tone = 'accent', style, opacity = 1}) => {
  const color = tone === 'danger' ? answerPalette.danger : tone === 'success' ? answerPalette.success : tone === 'dark' ? answerPalette.foreground : answerPalette.accent;
  const background = tone === 'danger' ? answerPalette.dangerSoft : tone === 'success' ? answerPalette.successSoft : tone === 'dark' ? answerPalette.foreground : answerPalette.surface;
  return <div style={{width: 420, height: 270, borderRadius: 40, border: `5px solid ${color}`, background, boxShadow: tone === 'danger' ? answerShadows.danger : tone === 'success' ? answerShadows.success : tone === 'dark' ? answerShadows.dark : answerShadows.card, padding: '32px 36px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, opacity, ...style}}><div style={{fontSize: 32, fontWeight: 970, color: tone === 'dark' ? '#FFFFFF' : color}}>{label}</div>{fact ? <div style={{fontSize: 25, lineHeight: 1.15, fontWeight: 830, color: tone === 'dark' ? '#F0EAF6' : answerPalette.foreground}}>{fact}</div> : null}<div style={{height: 20, width: '92%', borderRadius: 99, background: tone === 'dark' ? '#FFFFFF' : color, opacity: 0.28}} /><div style={{height: 20, width: '66%', borderRadius: 99, background: tone === 'dark' ? '#FFFFFF' : color, opacity: 0.17}} /></div>;
};

export const ProbabilityTile: React.FC<{
  word: string;
  percent: number;
  active?: boolean;
  visible: number;
  style?: React.CSSProperties;
}> = ({word, percent, active = false, visible, style}) => (
  <div style={{width: 420, height: 230, borderRadius: 42, border: `5px solid ${active ? answerPalette.accent : answerPalette.lineStrong}`, background: active ? 'linear-gradient(145deg,#FFFFFF,#E9DCFF)' : answerPalette.surface, boxShadow: active ? answerShadows.accent : answerShadows.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: visible, transform: `scale(${0.88 + visible * 0.08 + (active ? 0.05 : 0)})`, ...style}}><div style={{fontSize: 42, fontWeight: 980, color: active ? answerPalette.accentDark : answerPalette.foreground}}>{word}</div><div style={{fontSize: 58, lineHeight: 1, fontWeight: 980, color: active ? answerPalette.accent : answerPalette.muted}}>{Math.round(percent * 100)}%</div></div>
);

export const ResultBadge: React.FC<{
  text: string;
  tone?: 'accent' | 'danger' | 'success' | 'warning';
  visible: number;
  style?: React.CSSProperties;
}> = ({text, tone = 'accent', visible, style}) => {
  const color = tone === 'danger' ? answerPalette.danger : tone === 'success' ? answerPalette.success : tone === 'warning' ? answerPalette.warning : answerPalette.accent;
  return <div style={{padding: '18px 28px', borderRadius: 999, border: `3px solid ${color}`, background: `${color}18`, color, fontSize: 25, fontWeight: 970, letterSpacing: 0.5, opacity: visible, transform: `scale(${0.92 + visible * 0.08})`, ...style}}>{text}</div>;
};
