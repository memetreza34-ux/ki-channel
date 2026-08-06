import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TodaySemanticIcon, type TodayIconType} from './icons';
import {todayFont, todayPalette, todayShadows} from './style';

export const sceneProgress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const useSceneEnter = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 20, stiffness: 145, mass: 0.82},
  });
};

export const SceneCanvas: React.FC<React.PropsWithChildren<{
  heading: string;
  icon: TodayIconType;
  iconProgress: number;
  accent?: 'violet' | 'red' | 'green' | 'blue' | 'amber';
}>> = ({heading, icon, iconProgress, accent = 'violet', children}) => {
  const enter = useSceneEnter(0);
  const tint = accent === 'red'
    ? 'rgba(226,74,95,.13)'
    : accent === 'green'
      ? 'rgba(22,131,94,.12)'
      : accent === 'blue'
        ? 'rgba(65,156,215,.14)'
        : accent === 'amber'
          ? 'rgba(225,139,45,.13)'
          : 'rgba(109,58,219,.14)';

  return (
    <AbsoluteFill style={{background: todayPalette.background, color: todayPalette.foreground, fontFamily: todayFont, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 52% 42%, ${tint}, transparent 48%), linear-gradient(90deg, rgba(38,28,49,.026) 1px, transparent 1px), linear-gradient(rgba(38,28,49,.026) 1px, transparent 1px)`, backgroundSize: 'auto, 96px 96px, 96px 96px'}} />
      <div style={{position: 'absolute', width: 520, height: 520, left: -250, top: 520, borderRadius: '50%', background: tint, filter: 'blur(45px)', opacity: 0.42}} />
      <div style={{position: 'absolute', left: 58, right: 58, top: 64, height: 150, display: 'flex', alignItems: 'center', gap: 28, zIndex: 50, opacity: enter, transform: `translateY(${(1 - enter) * 20}px)`}}>
        <div style={{width: 104, height: 104, flex: '0 0 104px', borderRadius: 32, background: 'rgba(255,255,255,.86)', border: `3px solid ${todayPalette.line}`, boxShadow: todayShadows.soft, padding: 14, boxSizing: 'border-box'}}>
          <TodaySemanticIcon type={icon} progress={iconProgress} />
        </div>
        <div style={{fontSize: 51, lineHeight: 1.02, fontWeight: 960, letterSpacing: -2.2, maxWidth: 820}}>
          {heading}
        </div>
      </div>
      <div style={{position: 'absolute', left: 42, right: 42, top: 242, bottom: 500, zIndex: 10}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const ResultPill: React.FC<{
  text: string;
  progress: number;
  tone?: 'accent' | 'danger' | 'success' | 'warning';
  style?: React.CSSProperties;
}> = ({text, progress, tone = 'accent', style}) => {
  const color = tone === 'danger'
    ? todayPalette.danger
    : tone === 'success'
      ? todayPalette.success
      : tone === 'warning'
        ? todayPalette.warning
        : todayPalette.accent;
  return (
    <div style={{
      padding: '17px 28px',
      borderRadius: 999,
      border: `3px solid ${color}`,
      background: `${color}16`,
      color,
      fontSize: 25,
      fontWeight: 950,
      letterSpacing: 0.3,
      opacity: progress,
      transform: `scale(${0.93 + progress * 0.07})`,
      boxShadow: `0 16px 45px ${color}20`,
      ...style,
    }}>
      {text}
    </div>
  );
};

export const SourceSheet: React.FC<{
  title: string;
  date: string;
  tone?: 'accent' | 'success' | 'danger' | 'muted';
  progress?: number;
  style?: React.CSSProperties;
}> = ({title, date, tone = 'accent', progress = 1, style}) => {
  const color = tone === 'success' ? todayPalette.success : tone === 'danger' ? todayPalette.danger : tone === 'muted' ? todayPalette.muted : todayPalette.accent;
  const bg = tone === 'success' ? todayPalette.successSoft : tone === 'danger' ? todayPalette.dangerSoft : todayPalette.surface;
  return (
    <div style={{
      width: 270,
      height: 210,
      borderRadius: 34,
      border: `4px solid ${color}`,
      background: bg,
      boxShadow: todayShadows.soft,
      padding: '24px 26px',
      boxSizing: 'border-box',
      opacity: progress,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...style,
    }}>
      <div style={{fontSize: 27, fontWeight: 950, color}}>{title}</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
        <div style={{height: 16, width: '100%', borderRadius: 99, background: color, opacity: 0.24}} />
        <div style={{height: 16, width: '73%', borderRadius: 99, background: color, opacity: 0.16}} />
      </div>
      <div style={{fontSize: 20, fontWeight: 880, color: todayPalette.foreground}}>{date}</div>
    </div>
  );
};
