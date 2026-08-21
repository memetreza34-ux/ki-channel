import React from 'react';
import {todayPalette} from './style';

export type TodayIconType =
  | 'broken-live-clock'
  | 'frozen-archive'
  | 'future-gate'
  | 'pattern-gap'
  | 'web-retrieval'
  | 'freshness-scanner'
  | 'original-source'
  | 'cross-check';

const common = {
  fill: 'none',
  stroke: todayPalette.foreground,
  strokeWidth: 6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const TodaySemanticIcon: React.FC<{type: TodayIconType; progress: number}> = ({type, progress}) => {
  const p = Math.max(0, Math.min(1, progress));
  const pulse = 0.94 + p * 0.08;
  const rotate = (p - 0.5) * 16;

  if (type === 'broken-live-clock') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `scale(${pulse})`}}>
        <circle cx="33" cy="50" r="22" {...common} />
        <path d={`M33 50 L33 ${34 - p * 5} M33 50 L${45 + p * 5} 58`} {...common} stroke={todayPalette.accent} />
        <path d="M58 50 H70 M82 50 H92" {...common} stroke={todayPalette.danger} />
        <circle cx="76" cy="50" r={4 + p * 3} fill={todayPalette.danger} />
      </svg>
    );
  }

  if (type === 'frozen-archive') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `rotate(${rotate}deg) scale(${pulse})`}}>
        <rect x="23" y="25" width="54" height="52" rx="12" {...common} />
        <path d="M31 38 H69 M31 50 H62 M31 62 H56" {...common} stroke={todayPalette.accent} />
        <path d="M50 12 V88 M18 31 L82 69 M18 69 L82 31" {...common} stroke={todayPalette.iceStrong} opacity={0.35 + p * 0.65} />
      </svg>
    );
  }

  if (type === 'future-gate') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `translateX(${(1 - p) * -4}px)`}}>
        <path d="M12 62 H88" {...common} />
        {[22, 38, 68, 84].map((x) => <circle key={x} cx={x} cy="62" r="6" fill={x < 50 ? todayPalette.accent : todayPalette.warning} />)}
        <path d="M50 20 V82" {...common} stroke={todayPalette.danger} />
        <path d="M42 26 H58 M42 38 H58 M42 50 H58" {...common} stroke={todayPalette.danger} />
        <path d={`M62 28 L${74 + p * 8} 20`} {...common} stroke={todayPalette.warning} />
      </svg>
    );
  }

  if (type === 'pattern-gap') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `scale(${pulse})`}}>
        <path d="M18 22 H43 V43 H18 Z M57 22 H82 V43 H57 Z M18 57 H43 V78 H18 Z" {...common} />
        <rect x={57 - (1 - p) * 12} y={57 - (1 - p) * 12} width="25" height="21" rx="4" fill={todayPalette.accentSoft} stroke={todayPalette.accent} strokeWidth="6" opacity={p} />
        <path d="M50 50 C62 44 70 45 78 52" {...common} stroke={todayPalette.danger} opacity={p} />
      </svg>
    );
  }

  if (type === 'web-retrieval') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `rotate(${rotate * 0.45}deg)`}}>
        <circle cx="42" cy="48" r="25" {...common} />
        <path d="M17 48 H67 M42 23 C31 35 31 61 42 73 M42 23 C53 35 53 61 42 73" {...common} stroke={todayPalette.accent} />
        <circle cx={72 + p * 6} cy={28 - p * 4} r="12" {...common} stroke={todayPalette.success} />
        <path d={`M64 36 L${52 - p * 8} 44`} {...common} stroke={todayPalette.success} />
      </svg>
    );
  }

  if (type === 'freshness-scanner') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `rotate(${p * 12}deg)`}}>
        <circle cx="50" cy="50" r="32" {...common} />
        <path d={`M50 50 L${50 + Math.cos(p * Math.PI * 1.2) * 28} ${50 + Math.sin(p * Math.PI * 1.2) * 28}`} {...common} stroke={todayPalette.success} />
        <path d="M34 52 L45 63 L68 36" {...common} stroke={todayPalette.success} opacity={p} />
      </svg>
    );
  }

  if (type === 'original-source') {
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `translateY(${(1 - p) * 4}px) scale(${pulse})`}}>
        <path d="M25 15 H62 L78 31 V84 H25 Z" {...common} />
        <path d="M62 15 V31 H78 M35 44 H68 M35 56 H68 M35 68 H58" {...common} stroke={todayPalette.accent} />
        <circle cx="72" cy="70" r="14" fill={todayPalette.successSoft} stroke={todayPalette.success} strokeWidth="5" opacity={p} />
        <path d="M65 70 L70 75 L79 65" {...common} stroke={todayPalette.success} opacity={p} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', transform: `scale(${pulse})`}}>
      <path d="M14 32 H38 L50 50 L38 68 H14 Z M86 32 H62 L50 50 L62 68 H86 Z" {...common} />
      <circle cx="50" cy="50" r={13 + p * 4} fill={todayPalette.accentSoft} stroke={todayPalette.accent} strokeWidth="6" />
      <path d="M43 50 L48 56 L59 43" {...common} stroke={todayPalette.success} opacity={p} />
    </svg>
  );
};
