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

export const BranchingPromptVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 125}});
  const branch = p(frame, 42, 165);
  const options = [
    {label: 'Ton', x: 160, y: 720},
    {label: 'Länge', x: 390, y: 850},
    {label: 'Struktur', x: 690, y: 850},
    {label: 'Inhalt', x: 920, y: 720},
  ];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="ambPromptCore" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEE4FF" />
          </radialGradient>
        </defs>
        <ellipse cx="540" cy="310" rx={250 * enter} ry={112 * enter} fill="url(#ambPromptCore)" stroke={accent} strokeWidth="6" />
        {options.map((option, index) => {
          const reveal = p(frame, 54 + index * 16, 126 + index * 16);
          return (
            <path
              key={option.label}
              d={`M540 405 C540 520, ${option.x} 545, ${option.x} ${option.y - 76}`}
              fill="none"
              stroke={index === 2 ? purple : line}
              strokeWidth={index === 2 ? 9 : 5}
              strokeLinecap="round"
              strokeDasharray="920"
              strokeDashoffset={920 * (1 - reveal * branch)}
            />
          );
        })}
        <text x="540" y="295" textAnchor="middle" fontFamily={BRAND.font} fontSize="27" fontWeight="850" fill={muted}>UNKLARER PROMPT</text>
        <text x="540" y="350" textAnchor="middle" fontFamily={BRAND.font} fontSize="49" fontWeight="950" fill={ink}>„Mach das besser“</text>
      </svg>

      {options.map((option, index) => {
        const show = p(frame, 78 + index * 21, 126 + index * 21);
        const focus = index === 2;
        return (
          <div
            key={option.label}
            style={{
              position: 'absolute',
              left: option.x - 78,
              top: option.y - 58,
              width: 156,
              height: 116,
              borderRadius: '50%',
              background: focus ? purple : '#fff',
              border: `4px solid ${focus ? purple : line}`,
              color: focus ? '#fff' : ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 27,
              fontWeight: 950,
              opacity: show,
              transform: `scale(${0.76 + show * 0.24})`,
              boxShadow: focus ? '0 16px 42px rgba(110,69,201,.22)' : '0 10px 28px rgba(52,35,80,.08)',
            }}
          >
            {option.label}
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 230, right: 230, top: 990, textAlign: 'center', fontSize: 30, fontWeight: 900, color: muted, opacity: p(frame, 190, 248)}}>
        ein Satz – mehrere plausible Richtungen
      </div>
    </div>
  );
};

export const ChoiceVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const choiceProgress = p(frame, 35, 220);
  const selected = Math.min(3, Math.floor(choiceProgress * 4));
  const routes = ['Ton', 'Länge', 'Struktur', 'Inhalt'];
  const angles = [-135, -45, 45, 135];
  const pointerAngle = interpolate(choiceProgress, [0, 1], [-150, 132]);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <circle cx="500" cy="500" r="315" fill="rgba(255,255,255,.55)" stroke="#E9E1F2" strokeWidth="26" />
        <circle cx="500" cy="500" r="190" fill={soft} stroke={accent} strokeWidth="5" />
        {angles.map((angle, index) => {
          const radians = (angle * Math.PI) / 180;
          const x = 500 + Math.cos(radians) * 315;
          const y = 500 + Math.sin(radians) * 315;
          const active = selected === index;
          return (
            <g key={routes[index]} opacity={p(frame, 20 + index * 24, 62 + index * 24)}>
              <circle cx={x} cy={y} r={active ? 72 : 58} fill={active ? purple : '#fff'} stroke={active ? purple : line} strokeWidth="5" />
              <text x={x} y={y + 9} textAnchor="middle" fontFamily={BRAND.font} fontSize="24" fontWeight="950" fill={active ? '#fff' : ink}>{routes[index]}</text>
            </g>
          );
        })}
        <g transform={`rotate(${pointerAngle} 500 500)`}>
          <path d="M500 500 L500 245" stroke={danger} strokeWidth="12" strokeLinecap="round" />
          <circle cx="500" cy="500" r="25" fill={danger} />
        </g>
        <text x="500" y="480" textAnchor="middle" fontFamily={BRAND.font} fontSize="26" fontWeight="850" fill={muted}>KI WÄHLT</text>
        <text x="500" y="535" textAnchor="middle" fontFamily={BRAND.font} fontSize="43" fontWeight="950" fill={purple}>plausibel</text>
        <path d="M810 610 C900 680 925 760 900 855" fill="none" stroke={danger} strokeWidth="6" strokeDasharray="16 14" opacity={p(frame, 190, 245)} />
        <circle cx="900" cy="875" r="82" fill="rgba(227,93,106,.08)" stroke={danger} strokeWidth="5" opacity={p(frame, 210, 265)} />
        <text x="900" y="865" textAnchor="middle" fontFamily={BRAND.font} fontSize="21" fontWeight="850" fill={danger} opacity={p(frame, 210, 265)}>DEIN</text>
        <text x="900" y="900" textAnchor="middle" fontFamily={BRAND.font} fontSize="29" fontWeight="950" fill={danger} opacity={p(frame, 210, 265)}>ZIEL</text>
      </svg>

      <div style={{position: 'absolute', left: 125, top: 900, fontSize: 34, fontWeight: 950, color: danger, opacity: p(frame, 228, 280)}}>
        plausibel ≠ gemeint
      </div>
    </div>
  );
};

export const ConstraintCollapseVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const tighten = p(frame, 120, 265);
  const constraints = [
    {label: 'ZIEL', y: 215, start: 20},
    {label: 'KONTEXT', y: 360, start: 60},
    {label: 'GRENZEN', y: 505, start: 100},
  ];
  const endpoints = [170, 355, 540, 725, 910];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <path d="M150 165 H930 L675 665 V835 H405 V665 Z" fill="rgba(185,140,255,.05)" stroke={line} strokeWidth="5" />
        {constraints.map((constraint, index) => {
          const show = p(frame, constraint.start, constraint.start + 42);
          const width = 760 - index * 165;
          return (
            <g key={constraint.label} opacity={show}>
              <line x1={540 - width / 2} x2={540 + width / 2} y1={constraint.y} y2={constraint.y} stroke={index === 2 ? purple : accent} strokeWidth={index === 2 ? 10 : 7} strokeLinecap="round" />
              <text x="540" y={constraint.y - 22} textAnchor="middle" fontFamily={BRAND.font} fontSize="24" fontWeight="950" fill={index === 2 ? purple : muted}>{constraint.label}</text>
            </g>
          );
        })}
        {endpoints.map((x, index) => {
          const targetX = interpolate(tighten, [0, 1], [x, 540]);
          const opacity = index === 2 ? 1 : 1 - tighten;
          return (
            <path key={x} d={`M${x} 115 C${x} 620, ${targetX} 680, ${targetX} 835`} fill="none" stroke={index === 2 ? purple : line} strokeWidth={index === 2 ? 8 : 4} opacity={opacity} />
          );
        })}
        <circle cx="540" cy="880" r={64 + tighten * 14} fill={soft} stroke={purple} strokeWidth="6" />
        <path d="M515 880 l18 19 39-45" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={p(frame, 235, 285)} />
      </svg>

      <div style={{position: 'absolute', left: 250, right: 250, top: 980, textAlign: 'center', fontSize: 38, fontWeight: 950, color: purple, opacity: p(frame, 235, 285)}}>
        eine klare Richtung
      </div>
    </div>
  );
};

export const ExampleAnchorVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const align = p(frame, 70, 180);
  const build = p(frame, 155, 292);

  const rows = [0, 1, 2, 3];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <path d="M180 170 H430 V540 H180 Z" fill="#fff" stroke={line} strokeWidth="5" />
        <path d="M650 170 H900 V540 H650 Z" fill={soft} stroke={accent} strokeWidth="5" />
        <text x="305" y="135" textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="900" fill={muted}>PROMPT</text>
        <text x="775" y="135" textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="900" fill={purple}>BEISPIEL</text>
        {rows.map((row) => (
          <React.Fragment key={row}>
            <line x1="220" x2={360 - row * 8} y1={235 + row * 65} y2={235 + row * 65} stroke={row === 0 ? purple : '#D8D1DF'} strokeWidth="16" strokeLinecap="round" />
            <line x1="690" x2={830 - (row % 2) * 26} y1={235 + row * 65} y2={235 + row * 65} stroke={row < 2 ? accent : '#CFC5DA'} strokeWidth="16" strokeLinecap="round" />
          </React.Fragment>
        ))}
        <path d="M430 355 C505 355 575 355 650 355" fill="none" stroke={purple} strokeWidth="8" strokeDasharray="220" strokeDashoffset={220 * (1 - align)} />
        <path d="M540 560 V690" stroke={purple} strokeWidth="7" strokeLinecap="round" opacity={p(frame, 125, 175)} />
        <path d="M520 670 L540 695 L560 670" fill="none" stroke={purple} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity={p(frame, 125, 175)} />
        <path d="M205 735 H875 V945 H205 Z" fill="rgba(255,255,255,.8)" stroke={success} strokeWidth="5" />
        <text x="540" y="785" textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="900" fill={success}>GEWÜNSCHTE FORM</text>
        <rect x="260" y="830" width={250 * build} height="32" rx="16" fill={accent} />
        <rect x="560" y="830" width={210 * p(frame, 180, 260)} height="32" rx="16" fill="#CFC5DA" />
        <rect x="260" y="890" width={510 * p(frame, 210, 292)} height="28" rx="14" fill="#E7E1EA" />
      </svg>

      <div style={{position: 'absolute', left: 220, right: 220, top: 990, textAlign: 'center', fontSize: 31, fontWeight: 950, color: purple, opacity: p(frame, 245, 300)}}>
        Beispiel verankert die Form
      </div>
    </div>
  );
};

export const ThreeStepPromptVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    {label: 'ZIEL', sub: 'Was soll erreicht werden?', x: 190, start: 25},
    {label: 'KONTEXT', sub: 'Was muss die KI wissen?', x: 540, start: 85},
    {label: 'FORMAT', sub: 'Wie soll es aussehen?', x: 890, start: 145},
  ];
  const route = p(frame, 30, 255);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <path d="M115 575 C270 400 350 720 540 575 C720 435 800 690 965 575" fill="none" stroke="#E9E1F2" strokeWidth="32" strokeLinecap="round" />
        <path d="M115 575 C270 400 350 720 540 575 C720 435 800 690 965 575" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round" strokeDasharray="1080" strokeDashoffset={1080 * (1 - route)} />
        {steps.map((step, index) => {
          const show = p(frame, step.start, step.start + 45);
          const y = index === 1 ? 620 : 500;
          return (
            <g key={step.label} opacity={show}>
              <circle cx={step.x} cy={y} r="82" fill={index === 1 ? soft : '#fff'} stroke={index === 1 ? accent : line} strokeWidth="5" />
              <text x={step.x} y={y + 10} textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="950" fill={index === 1 ? purple : ink}>{index + 1} · {step.label}</text>
              <text x={step.x} y={y + 130} textAnchor="middle" fontFamily={BRAND.font} fontSize="21" fontWeight="800" fill={muted}>{step.sub}</text>
            </g>
          );
        })}
        <circle cx="965" cy="575" r={44 + p(frame, 230, 292) * 12} fill="rgba(53,167,121,.12)" stroke={success} strokeWidth="6" opacity={p(frame, 230, 292)} />
        <path d="M945 575 l14 15 29-34" fill="none" stroke={success} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={p(frame, 240, 292)} />
      </svg>

      <div style={{position: 'absolute', left: 255, right: 255, top: 880, textAlign: 'center', fontSize: 42, fontWeight: 950, color: purple, opacity: p(frame, 245, 300)}}>
        Weniger Rätsel. Mehr Richtung.
      </div>
    </div>
  );
};
