import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, IconBadge, type IconRef, type Tone} from './Icon';
import {pop, progress} from './motion';
import {useTheme} from './themes';

// ── Icon-Orbit ───────────────────────────────────────────────────────────

type IconOrbitProps = {
  icons: IconRef[];
  /** Inhalt in der Mitte (z. B. ein großes IconBadge oder Logo). */
  center?: React.ReactNode;
  radius?: number;
  iconSize?: number;
  /** Grad pro Frame. */
  speed?: number;
  delay?: number;
};

/** Icons kreisen um eine Mitte – "kann vieles", "verbindet viele Tools". */
export const IconOrbit: React.FC<IconOrbitProps> = ({icons, center, radius = 300, iconSize = 130, speed = 0.35, delay = 0}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const ring = progress(frame, delay, 30, 'out');
  const box = radius * 2 + iconSize;
  const rot = (frame - delay) * speed;
  return (
    <div style={{position: 'relative', width: box, height: box}}>
      <svg width={box} height={box} style={{position: 'absolute', inset: 0}}>
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          stroke={t.c.accent}
          strokeWidth={3}
          strokeDasharray="2 14"
          strokeLinecap="round"
          opacity={0.8 * ring}
        />
      </svg>
      {icons.map((ic, i) => {
        const a = ((360 / icons.length) * i - 90 + rot) * (Math.PI / 180);
        const x = box / 2 + Math.cos(a) * radius - iconSize / 2;
        const y = box / 2 + Math.sin(a) * radius - iconSize / 2;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y}}>
            <IconBadge icon={ic} size={iconSize} tone="white" delay={delay + 8 + i * 5} shape="circle" />
          </div>
        );
      })}
      {center ? (
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{center}</div>
      ) : null}
    </div>
  );
};

// ── Mindmap ──────────────────────────────────────────────────────────────

type MindmapProps = {
  center: string;
  centerIcon?: IconRef;
  nodes: Array<{text: string; icon?: IconRef}>;
  width?: number;
  height?: number;
  delay?: number;
  step?: number;
  size?: number;
};

/** Mittelpunkt mit Ästen, die nacheinander herauswachsen. */
export const Mindmap: React.FC<MindmapProps> = ({center, centerIcon, nodes, width = 900, height = 900, delay = 0, step = 8, size = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2 - size * 3.2;
  const ry = height / 2 - size * 1.6;
  const c = pop(frame, fps, delay, 'snappy');
  return (
    <div style={{position: 'relative', width, height}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {nodes.map((_, i) => {
          const a = ((360 / nodes.length) * i - 90) * (Math.PI / 180);
          const p = progress(frame, delay + 8 + i * step, 16, 'out');
          const x = cx + Math.cos(a) * rx * p;
          const y = cy + Math.sin(a) * ry * p;
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={t.c.accent} strokeWidth={5} strokeLinecap="round" />;
        })}
      </svg>
      {nodes.map((n, i) => {
        const a = ((360 / nodes.length) * i - 90) * (Math.PI / 180);
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        const s = pop(frame, fps, delay + 18 + i * step, 'snappy');
        return (
          <div
            key={n.text}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${Math.max(0, s)})`,
              display: 'flex',
              alignItems: 'center',
              gap: size * 0.3,
              padding: `${size * 0.35}px ${size * 0.6}px`,
              borderRadius: 999,
              background: t.c.surface,
              border: t.border ?? `3px solid ${t.c.accent}`,
              boxShadow: t.shadow.soft,
              fontFamily: t.font.body,
              fontWeight: 800,
              fontSize: size,
              color: t.c.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {n.icon ? <Icon icon={n.icon} size={size * 1.1} color={t.c.accentDeep} animate="none" /> : null}
            {n.text}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${Math.max(0, c)})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: size * 0.2,
          minWidth: size * 5,
          minHeight: size * 5,
          padding: size * 0.6,
          borderRadius: '50%',
          background: t.c.accentDeep,
          color: t.c.onAccent,
          boxShadow: t.shadow.lift,
          fontFamily: t.font.heading,
          fontWeight: t.font.headingWeight,
          fontSize: size * 1.15,
          textAlign: 'center',
        }}
      >
        {centerIcon ? <Icon icon={centerIcon} size={size * 1.6} color={t.c.onAccent} delay={delay + 4} /> : null}
        {center}
      </div>
    </div>
  );
};

// ── Ablauf ───────────────────────────────────────────────────────────────

type FlowProps = {
  steps: Array<{text: string; icon: IconRef}>;
  direction?: 'row' | 'column';
  delay?: number;
  step?: number;
  size?: number;
  /** Index des Schritts, der ab `at` hervorgehoben wird. */
  active?: {index: number; at: number};
};

/** Ablauf aus Icon-Stationen, verbunden durch sich zeichnende Pfeile. */
export const Flow: React.FC<FlowProps> = ({steps, direction = 'row', delay = 0, step = 14, size = 150, active}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const row = direction === 'row';
  const gap = size * 0.55;
  return (
    <div style={{display: 'flex', flexDirection: row ? 'row' : 'column', alignItems: 'center', gap: size * 0.08}}>
      {steps.map((st, i) => {
        const at = delay + i * step;
        const isActive = active ? active.index === i && frame >= active.at : false;
        const dim = active && frame >= active.at && !isActive ? 0.5 : 1;
        const tone: Tone = isActive ? 'solid' : 'accent';
        const line = progress(frame, at + 8, 12, 'inOut');
        return (
          <React.Fragment key={st.text}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.14, opacity: dim, width: size * 1.5}}>
              <IconBadge icon={st.icon} size={size} tone={tone} delay={at} style={{transform: isActive ? 'scale(1.08)' : undefined}} />
              <div
                style={{
                  fontFamily: t.font.body,
                  fontWeight: 800,
                  fontSize: size * 0.24,
                  color: t.c.ink,
                  textAlign: 'center',
                  opacity: progress(frame, at + 4, 12, 'soft'),
                }}
              >
                {st.text}
              </div>
            </div>
            {i < steps.length - 1 ? (
              <svg width={row ? gap : size * 0.4} height={row ? size * 0.4 : gap} style={{overflow: 'visible', marginBottom: row ? size * 0.35 : 0, flexShrink: 0}}>
                {row ? (
                  <>
                    <line x1={4} y1={size * 0.2} x2={4 + (gap - 22) * line} y2={size * 0.2} stroke={t.c.accentDeep} strokeWidth={7} strokeLinecap="round" />
                    {line > 0.95 ? <path d={`M ${gap - 30} ${size * 0.2 - 12} L ${gap - 14} ${size * 0.2} L ${gap - 30} ${size * 0.2 + 12}`} fill="none" stroke={t.c.accentDeep} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
                  </>
                ) : (
                  <>
                    <line x1={size * 0.2} y1={4} x2={size * 0.2} y2={4 + (gap - 22) * line} stroke={t.c.accentDeep} strokeWidth={7} strokeLinecap="round" />
                    {line > 0.95 ? <path d={`M ${size * 0.2 - 12} ${gap - 30} L ${size * 0.2} ${gap - 14} L ${size * 0.2 + 12} ${gap - 30}`} fill="none" stroke={t.c.accentDeep} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
                  </>
                )}
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

