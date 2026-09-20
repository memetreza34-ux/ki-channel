import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const accent = BRAND.accent;
const soft = '#EFE7FF';
const line = '#D8CCE9';
const muted = '#777083';
const danger = '#E35D6A';
const success = '#35A779';

const p = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const GlassLabel: React.FC<React.PropsWithChildren<{x: number; y: number; width?: number; active?: boolean}>> = ({
  x,
  y,
  width = 220,
  active = false,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      padding: '18px 20px',
      borderRadius: 999,
      background: active ? 'rgba(185,140,255,.20)' : 'rgba(255,255,255,.76)',
      border: `1.5px solid ${active ? 'rgba(110,69,201,.40)' : 'rgba(216,204,233,.82)'}`,
      boxShadow: active ? '0 10px 34px rgba(110,69,201,.16)' : '0 8px 28px rgba(52,35,80,.07)',
      backdropFilter: 'blur(8px)',
      textAlign: 'center',
      fontSize: 29,
      fontWeight: 900,
      color: active ? purple : ink,
    }}
  >
    {children}
  </div>
);

export const ChatVsAgentVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 19, stiffness: 115}});
  const pathProgress = p(frame, 82, 250);
  const result = p(frame, 225, 292);
  const steps = [
    {label: 'ZIEL', x: 650, y: 210},
    {label: 'PLAN', x: 790, y: 405},
    {label: 'AKTION', x: 650, y: 610},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 185,
          width: 370,
          height: 520,
          opacity: enter,
          transform: `translateX(${(1 - enter) * -46}px)`,
        }}
      >
        <div style={{fontSize: 27, fontWeight: 950, color: muted, letterSpacing: 1.2}}>CHATBOT</div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 82,
            width: 310,
            padding: '30px 34px',
            borderRadius: '34px 34px 34px 9px',
            background: '#F4F0F7',
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          Deine Nachricht
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 230,
            width: 294,
            padding: '30px 34px',
            borderRadius: '34px 34px 9px 34px',
            background: soft,
            color: purple,
            fontSize: 34,
            fontWeight: 950,
            opacity: p(frame, 30, 72),
          }}
        >
          Antwort
        </div>
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 0,
            height: 3,
            background: line,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 26,
            bottom: -68,
            fontSize: 27,
            fontWeight: 850,
            color: muted,
            opacity: p(frame, 70, 112),
          }}
        >
          wartet auf den nächsten Prompt
        </div>
      </div>

      <div style={{position: 'absolute', left: 490, top: 108, width: 530, height: 850}}>
        <svg width="530" height="850" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <filter id="agentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path
            d="M260 125 C430 190 455 330 340 415 C230 500 250 650 410 720"
            fill="none"
            stroke="rgba(110,69,201,.16)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M260 125 C430 190 455 330 340 415 C230 500 250 650 410 720"
            fill="none"
            stroke={purple}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="980"
            strokeDashoffset={980 * (1 - pathProgress)}
          />
          <circle cx="260" cy="125" r="92" fill="#fff" stroke={accent} strokeWidth="7" filter="url(#agentGlow)" />
          <circle cx="260" cy="125" r="58" fill={soft} />
          <text x="260" y="139" textAnchor="middle" fontFamily={BRAND.font} fontSize="40" fontWeight="950" fill={purple}>AGENT</text>
          <circle cx="410" cy="720" r={44 + result * 12} fill="rgba(53,167,121,.14)" stroke={success} strokeWidth="6" opacity={result} />
          <path d="M390 720 l15 16 30-36" fill="none" stroke={success} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={result} />
        </svg>
        {steps.map((step, index) => {
          const show = p(frame, 74 + index * 48, 112 + index * 48);
          return (
            <div
              key={step.label}
              style={{
                position: 'absolute',
                left: step.x - 490,
                top: step.y - 108,
                width: 152,
                height: 70,
                borderRadius: 35,
                background: index === 1 ? purple : '#fff',
                border: `2px solid ${index === 1 ? purple : line}`,
                color: index === 1 ? '#fff' : ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 25,
                fontWeight: 950,
                opacity: show,
                transform: `scale(${0.82 + show * 0.18})`,
              }}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ToolUseVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const tools = [
    {label: 'Suche', symbol: '⌕', x: 175, y: 235},
    {label: 'Datei', symbol: '▤', x: 825, y: 235},
    {label: 'Code', symbol: '</>', x: 175, y: 760},
    {label: 'Daten', symbol: '▦', x: 825, y: 760},
  ];
  const route = p(frame, 48, 246);
  const activeIndex = Math.min(3, Math.floor(route * 4));
  const orbit = frame * 0.022;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="core" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E9DFFF" />
          </radialGradient>
        </defs>
        <circle cx="540" cy="520" r="180" fill="none" stroke="rgba(110,69,201,.08)" strokeWidth="42" />
        <circle cx="540" cy="520" r="132" fill="url(#core)" stroke={accent} strokeWidth="7" />
        <circle cx={540 + Math.cos(orbit) * 172} cy={520 + Math.sin(orbit) * 172} r="15" fill={purple} opacity={0.35 + 0.65 * p(frame, 20, 80)} />
        {tools.map((tool, index) => {
          const reveal = p(frame, 28 + index * 28, 72 + index * 28);
          const path = `M540 520 Q${(540 + tool.x) / 2 + (index % 2 === 0 ? -80 : 80)} ${(520 + tool.y) / 2} ${tool.x} ${tool.y}`;
          return (
            <path
              key={tool.label}
              d={path}
              fill="none"
              stroke={index === activeIndex ? purple : line}
              strokeWidth={index === activeIndex ? 9 : 5}
              strokeLinecap="round"
              strokeDasharray="620"
              strokeDashoffset={620 * (1 - reveal)}
            />
          );
        })}
        <text x="540" y="505" textAnchor="middle" fontFamily={BRAND.font} fontSize="30" fontWeight="850" fill={muted}>AGENT</text>
        <text x="540" y="560" textAnchor="middle" fontFamily={BRAND.font} fontSize="46" fontWeight="950" fill={purple}>wählt Tools</text>
      </svg>

      {tools.map((tool, index) => {
        const show = p(frame, 28 + index * 28, 72 + index * 28);
        const active = index === activeIndex;
        return (
          <div
            key={tool.label}
            style={{
              position: 'absolute',
              left: tool.x - 83,
              top: tool.y - 83,
              width: 166,
              height: 166,
              borderRadius: '50%',
              background: active ? purple : 'rgba(255,255,255,.94)',
              border: `5px solid ${active ? purple : '#E5DBEF'}`,
              boxShadow: active ? '0 18px 45px rgba(110,69,201,.26)' : '0 13px 34px rgba(52,35,80,.09)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: show,
              transform: `scale(${0.72 + 0.28 * show})`,
            }}
          >
            <div style={{fontSize: tool.symbol === '</>' ? 29 : 46, fontWeight: 950, color: active ? '#fff' : purple}}>{tool.symbol}</div>
            <div style={{fontSize: 24, fontWeight: 900, marginTop: 9, color: active ? '#fff' : ink}}>{tool.label}</div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 260, right: 260, top: 935, textAlign: 'center', fontSize: 30, fontWeight: 900, color: muted, opacity: p(frame, 205, 270)}}>
        Anfrage → passendes Werkzeug → Ergebnis
      </div>
    </div>
  );
};

export const PlanLoopVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = p(frame, 25, 245);
  const active = Math.min(2, Math.floor(phase * 3));
  const nodes = [
    {label: 'PLAN', sub: 'Schritt wählen', angle: -90},
    {label: 'ACT', sub: 'Tool ausführen', angle: 30},
    {label: 'CHECK', sub: 'Ergebnis prüfen', angle: 150},
  ];
  const centerX = 540;
  const centerY = 500;
  const radius = 285;
  const pulseAngle = -Math.PI / 2 + phase * Math.PI * 2;
  const pulseX = centerX + Math.cos(pulseAngle) * radius;
  const pulseY = centerY + Math.sin(pulseAngle) * radius;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#E9E1F2" strokeWidth="28" />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={purple}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * radius}`}
          strokeDashoffset={(2 * Math.PI * radius) * (1 - phase)}
          transform={`rotate(-90 ${centerX} ${centerY})`}
        />
        <circle cx={pulseX} cy={pulseY} r="22" fill={purple} />
        <circle cx={pulseX} cy={pulseY} r="42" fill="none" stroke="rgba(110,69,201,.18)" strokeWidth="18" />
        <circle cx={centerX} cy={centerY} r="122" fill="#fff" stroke={line} strokeWidth="4" />
        <text x={centerX} y={centerY - 8} textAnchor="middle" fontFamily={BRAND.font} fontSize="29" fontWeight="850" fill={muted}>AGENT LOOP</text>
        <text x={centerX} y={centerY + 48} textAnchor="middle" fontFamily={BRAND.font} fontSize="43" fontWeight="950" fill={purple}>weiterdenken</text>
      </svg>

      {nodes.map((node, index) => {
        const radians = (node.angle * Math.PI) / 180;
        const x = centerX + Math.cos(radians) * radius;
        const y = centerY + Math.sin(radians) * radius;
        const show = p(frame, 18 + index * 36, 60 + index * 36);
        const isActive = active === index;
        return (
          <div key={node.label} style={{position: 'absolute', left: x - 105, top: y - 72, width: 210, opacity: show, textAlign: 'center'}}>
            <div
              style={{
                width: 118,
                height: 118,
                margin: '0 auto',
                borderRadius: '50%',
                background: isActive ? purple : '#fff',
                border: `5px solid ${isActive ? purple : line}`,
                color: isActive ? '#fff' : purple,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 27,
                fontWeight: 950,
                boxShadow: isActive ? '0 18px 42px rgba(110,69,201,.22)' : '0 10px 30px rgba(52,35,80,.08)',
                transform: `scale(${isActive ? 1.08 : 1})`,
              }}
            >
              {node.label}
            </div>
            <div style={{marginTop: 14, fontSize: 25, fontWeight: 900, color: ink}}>{node.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

export const PermissionCascadeVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const boundary = p(frame, 28, 132);
  const cascade = p(frame, 132, 282);
  const actions = ['Datei ändern', 'Mail senden', 'Daten löschen'];
  const ringRadii = [138, 235, 332];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        {ringRadii.map((radius, index) => {
          const reveal = p(frame, 20 + index * 28, 65 + index * 28);
          const risky = index === 2 && boundary > 0.62;
          return (
            <circle
              key={radius}
              cx="540"
              cy="440"
              r={radius}
              fill={risky ? 'rgba(227,93,106,.035)' : 'none'}
              stroke={risky ? danger : index === 0 ? accent : line}
              strokeWidth={index === 2 ? 7 : 4}
              strokeDasharray={2 * Math.PI * radius}
              strokeDashoffset={(2 * Math.PI * radius) * (1 - reveal)}
              transform="rotate(-90 540 440)"
            />
          );
        })}
        <circle cx="540" cy="440" r="86" fill={soft} stroke={accent} strokeWidth="5" />
        <text x="540" y="430" textAnchor="middle" fontFamily={BRAND.font} fontSize="26" fontWeight="900" fill={muted}>RECHTE</text>
        <text x="540" y="472" textAnchor="middle" fontFamily={BRAND.font} fontSize="37" fontWeight="950" fill={boundary > 0.62 ? danger : purple}>{boundary > 0.62 ? 'zu weit' : 'begrenzt'}</text>
        <path d="M540 110 L540 770" stroke="rgba(110,69,201,.10)" strokeWidth="3" strokeDasharray="12 18" />
      </svg>

      {actions.map((action, index) => {
        const start = 126 + index * 36;
        const progress = p(frame, start, start + 100);
        const x = 160 + index * 380;
        const drift = (index - 1) * 46 * progress;
        const y = 760 + progress * 180;
        const failed = cascade > (index + 0.25) / 3;
        return (
          <div
            key={action}
            style={{
              position: 'absolute',
              left: x + drift,
              top: y,
              width: 230,
              padding: '18px 22px',
              borderRadius: 18,
              background: failed ? 'rgba(227,93,106,.10)' : 'rgba(255,255,255,.90)',
              border: `2px solid ${failed ? danger : line}`,
              color: failed ? danger : ink,
              textAlign: 'center',
              fontSize: 25,
              fontWeight: 900,
              opacity: p(frame, start - 28, start + 8),
              transform: `rotate(${(index - 1) * 4 * progress}deg)`,
            }}
          >
            {failed ? '!' : '✓'} {action}
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 155, right: 155, top: 1010, textAlign: 'center', fontSize: 31, fontWeight: 950, color: danger, opacity: p(frame, 228, 292)}}>
        ein zu großes Recht kann mehrere Folgeaktionen auslösen
      </div>
    </div>
  );
};

export const GuardrailVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = p(frame, 52, 270);
  const approval = p(frame, 125, 190);
  const labels = ['Sprache', 'Plan', 'Tool', 'Aktion'];
  const gateX = [180, 410, 650, 885];
  const pulseX = interpolate(flow, [0, 1], [115, 930]);
  const blockedY = interpolate(clamp01((flow - 0.58) / 0.22), [0, 1], [600, 780]);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 80, top: 115, right: 80, fontSize: 28, fontWeight: 900, color: muted}}>
        Nur erlaubte Fähigkeiten kommen durch die Kontrollstrecke
      </div>

      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <path d="M105 530 H950" stroke="#E6DFEC" strokeWidth="34" strokeLinecap="round" />
        <path d="M105 530 H950" stroke={purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="845" strokeDashoffset={845 * (1 - flow)} />
        <path d="M650 530 C705 585 725 675 725 795" fill="none" stroke={danger} strokeWidth="6" strokeDasharray="15 14" opacity={p(frame, 150, 205)} />
        <circle cx={pulseX} cy="530" r="19" fill={purple} />
        <circle cx={pulseX} cy="530" r="39" fill="none" stroke="rgba(110,69,201,.20)" strokeWidth="14" />
        <circle cx="725" cy={blockedY} r="18" fill={danger} opacity={p(frame, 150, 205)} />
      </svg>

      {gateX.map((x, index) => {
        const show = p(frame, 18 + index * 30, 58 + index * 30);
        const passed = flow > index / 4;
        const isPermissionGate = index === 2;
        return (
          <div key={labels[index]} style={{position: 'absolute', left: x - 68, top: 390, width: 136, textAlign: 'center', opacity: show}}>
            <div
              style={{
                width: 18,
                height: 170,
                margin: '0 auto',
                borderRadius: 9,
                background: isPermissionGate ? (approval > 0.55 ? success : danger) : passed ? accent : line,
                boxShadow: isPermissionGate ? '0 0 0 12px rgba(53,167,121,.05)' : undefined,
              }}
            />
            <div style={{marginTop: 16, fontSize: 25, fontWeight: 950, color: isPermissionGate ? (approval > 0.55 ? success : danger) : ink}}>{labels[index]}</div>
          </div>
        );
      })}

      <GlassLabel x={470} y={245} width={265} active={approval > 0.55}>
        {approval > 0.55 ? 'Freigabe erteilt' : 'Freigabe prüfen'}
      </GlassLabel>

      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 815,
          width: 250,
          padding: '19px 24px',
          borderRadius: 18,
          background: 'rgba(227,93,106,.08)',
          border: `2px solid ${danger}`,
          color: danger,
          textAlign: 'center',
          fontSize: 27,
          fontWeight: 950,
          opacity: p(frame, 170, 220),
        }}
      >
        Löschen blockiert
      </div>

      <div style={{position: 'absolute', left: 245, right: 245, top: 970, textAlign: 'center', fontSize: 31, fontWeight: 950, color: success, opacity: p(frame, 230, 292)}}>
        mehr Autonomie – aber mit klaren Grenzen
      </div>
    </div>
  );
};
