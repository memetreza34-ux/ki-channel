import React from 'react';
import {
  ArrowRightLeft,
  Bot,
  Brain,
  CalendarDays,
  Code2,
  Gauge,
  GitBranch,
  Lock,
  Search,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Unlock,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../brand/brand';
import {getBrandAnchor, type BrandAnchorId} from './brandRegistry';

export type TechIconName =
  | 'arrow-swap'
  | 'bot'
  | 'brain'
  | 'calendar'
  | 'code'
  | 'gauge'
  | 'git-branch'
  | 'lock'
  | 'search'
  | 'sliders'
  | 'sparkles'
  | 'terminal'
  | 'unlock'
  | 'workflow'
  | 'zap';

const ICONS: Readonly<Record<TechIconName, LucideIcon>> = Object.freeze({
  'arrow-swap': ArrowRightLeft,
  bot: Bot,
  brain: Brain,
  calendar: CalendarDays,
  code: Code2,
  gauge: Gauge,
  'git-branch': GitBranch,
  lock: Lock,
  search: Search,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  terminal: Terminal,
  unlock: Unlock,
  workflow: Workflow,
  zap: Zap,
});

export const TechIcon: React.FC<{
  name: TechIconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({name, size = 36, strokeWidth = 2.2, color = 'currentColor'}) => {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={strokeWidth} color={color} aria-hidden="true" />;
};

export const BrandAnchor: React.FC<{
  brand: BrandAnchorId;
  x?: number;
  y?: number;
  compact?: boolean;
  accent?: boolean;
  delay?: number;
}> = ({brand, x, y, compact = false, accent = false, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const definition = getBrandAnchor(brand);
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 18, stiffness: 150, mass: 0.75}});
  const categoryIcon = definition.categoryIcon as TechIconName;
  return (
    <div
      data-brand-anchor={brand}
      data-brand-mark-kind={definition.markKind}
      title={definition.ownershipNote}
      style={{
        position: x === undefined && y === undefined ? 'relative' : 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 12 : 16,
        minHeight: compact ? 58 : 72,
        padding: compact ? '0 18px' : '0 22px',
        borderRadius: compact ? 22 : 26,
        background: accent ? BRAND.accentDk : 'rgba(255,255,255,.94)',
        color: accent ? '#fff' : BRAND.ink,
        border: `2px solid ${accent ? 'rgba(110,69,201,.82)' : 'rgba(110,69,201,.18)'}`,
        boxShadow: '0 18px 45px rgba(45,30,68,.12)',
        transform: `translateY(${(1 - enter) * 22}px) scale(${0.9 + enter * 0.1})`,
        opacity: enter,
        zIndex: 20,
      }}
    >
      <div style={{display: 'flex', width: compact ? 34 : 42, height: compact ? 34 : 42, alignItems: 'center', justifyContent: 'center'}}>
        <TechIcon name={categoryIcon} size={compact ? 30 : 38} strokeWidth={2.25} color={accent ? '#fff' : BRAND.accentDk} />
      </div>
      <div style={{fontSize: compact ? 25 : 31, fontWeight: 900, letterSpacing: -0.7}}>{definition.label}</div>
    </div>
  );
};

export const SceneBackdrop: React.FC<{
  intensity?: number;
  grid?: boolean;
  orbit?: boolean;
}> = ({intensity = 1, grid = true, orbit = true}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 48) * 18 * intensity;
  const driftY = Math.cos(frame / 61) * 14 * intensity;
  const spin = frame * 0.18 * intensity;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${30 + driftX / 8}% ${28 + driftY / 8}%, rgba(185,140,255,.18), transparent 34%), radial-gradient(circle at 80% 66%, rgba(110,69,201,.10), transparent 30%), linear-gradient(180deg,#FFFEFF 0%,#FBF9FF 58%,#FFFFFF 100%)`,
        }}
      />
      {grid ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.22,
            backgroundImage: 'linear-gradient(rgba(110,69,201,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.06) 1px,transparent 1px)',
            backgroundSize: '84px 84px',
            transform: `translate(${driftX}px,${driftY}px)`,
          }}
        />
      ) : null}
      {orbit ? (
        <>
          <div style={{position: 'absolute', left: 112, top: 270, width: 720, height: 720, borderRadius: '50%', border: '2px solid rgba(110,69,201,.08)', transform: `rotate(${spin}deg)`}} />
          <div style={{position: 'absolute', right: -190, top: 690, width: 620, height: 620, borderRadius: '50%', border: '3px solid rgba(185,140,255,.08)', transform: `rotate(${-spin * 0.8}deg)`}} />
        </>
      ) : null}
    </div>
  );
};

export const GlassPanel: React.FC<React.PropsWithChildren<{
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  accent?: boolean;
  delay?: number;
  rotate?: number;
}>> = ({x, y, width, height, radius = 36, accent = false, delay = 0, rotate = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 20, stiffness: 145, mass: 0.82}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height, borderRadius: radius, background: accent ? 'linear-gradient(145deg,#F6EFFF,#E7D9FF)' : 'rgba(255,255,255,.92)', border: `2px solid ${accent ? 'rgba(110,69,201,.24)' : 'rgba(110,69,201,.14)'}`, boxShadow: '0 28px 80px rgba(45,30,68,.12)', backdropFilter: 'blur(10px)', transform: `translateY(${(1 - enter) * 32}px) rotate(${rotate * enter}deg) scale(${0.94 + 0.06 * enter})`, opacity: enter}}>
      {children}
    </div>
  );
};

export const InfoChip: React.FC<{
  label: string;
  icon?: TechIconName;
  x: number;
  y: number;
  width?: number;
  accent?: boolean;
  delay?: number;
}> = ({label, icon, x, y, width = 210, accent = false, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 16, stiffness: 180, mass: 0.7}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height: 70, borderRadius: 23, background: accent ? BRAND.accentDk : 'rgba(255,255,255,.96)', color: accent ? '#fff' : BRAND.ink, border: `2px solid ${accent ? 'rgba(110,69,201,.82)' : 'rgba(110,69,201,.17)'}`, boxShadow: '0 16px 38px rgba(45,30,68,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `translateY(${(1 - enter) * 28}px) scale(${0.88 + 0.12 * enter})`, opacity: enter, zIndex: 18}}>
      {icon ? <TechIcon name={icon} size={29} strokeWidth={2.25} color={accent ? '#fff' : BRAND.accentDk} /> : null}
      <span style={{fontSize: 24, fontWeight: 900, letterSpacing: -0.4}}>{label}</span>
    </div>
  );
};

export const HeroOrb: React.FC<{
  label: string;
  eyebrow?: string;
  x: number;
  y: number;
  size?: number;
  delay?: number;
  icon?: TechIconName;
  warm?: boolean;
}> = ({label, eyebrow, x, y, size = 360, delay = 0, icon, warm = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 17, stiffness: 135, mass: 0.9}});
  const pulse = 1 + Math.sin((frame - delay) / 18) * 0.018;
  const ring = interpolate(frame, [delay, delay + 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, transform: `scale(${(0.78 + 0.22 * enter) * pulse})`, opacity: enter}}>
      <div style={{position: 'absolute', inset: -40, borderRadius: '50%', border: '3px solid rgba(110,69,201,.12)', opacity: ring, transform: `scale(${0.8 + ring * 0.25})`}} />
      <div style={{position: 'absolute', inset: -82, borderRadius: '50%', border: '2px dashed rgba(185,140,255,.16)', opacity: ring * 0.85, transform: `rotate(${frame * 0.35}deg)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: warm ? 'radial-gradient(circle at 34% 28%,#FFFDF1 0%,#F2E7FF 40%,#C8A8FF 100%)' : 'radial-gradient(circle at 34% 28%,#FFFFFF 0%,#F0E8FF 42%,#D1BCF7 100%)', border: '4px solid rgba(110,69,201,.24)', boxShadow: '0 40px 110px rgba(110,69,201,.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {icon ? <div style={{marginBottom: 14, color: BRAND.accentDk}}><TechIcon name={icon} size={52} strokeWidth={2.1} /></div> : null}
        {eyebrow ? <div style={{fontSize: 30, fontWeight: 850, color: 'rgba(26,26,46,.54)', letterSpacing: 0.2}}>{eyebrow}</div> : null}
        <div style={{fontSize: Math.max(48, Math.min(78, size / 4.7)), fontWeight: 950, color: BRAND.accentDk, letterSpacing: -2.2}}>{label}</div>
      </div>
    </div>
  );
};

export const KineticConnector: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  startFrame: number;
  endFrame: number;
  width?: number;
  color?: string;
  bend?: number;
}> = ({from, to, startFrame, endFrame, width = 7, color = BRAND.accentDk, bend = 0.22}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, Math.max(startFrame + 1, endFrame)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const dx = to.x - from.x;
  const c1x = from.x + dx * 0.35;
  const c2x = from.x + dx * 0.65;
  const c1y = from.y - Math.abs(dx) * bend;
  const c2y = to.y + Math.abs(dx) * bend;
  const d = `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
  const length = 1300;
  return (
    <svg viewBox="0 0 1080 1440" style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1440, pointerEvents: 'none', overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={0.78} strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
      <circle cx={from.x + dx * progress} cy={from.y + (to.y - from.y) * progress - Math.sin(progress * Math.PI) * Math.abs(dx) * bend * 0.55} r={10 + progress * 3} fill={color} opacity={progress > 0 && progress < 1 ? 0.9 : 0} />
    </svg>
  );
};
