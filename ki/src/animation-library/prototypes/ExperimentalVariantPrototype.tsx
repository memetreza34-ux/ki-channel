import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {
  ExperimentalAnimationRecipe,
  ExperimentalMechanism,
} from '../experimentalRecipes';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';
import {staggerDelay, type MotionEasingName} from '../../motion/easing';

const C = PROTOTYPE_PALETTE;

const clamp = (value: number): number => Math.max(0, Math.min(1, value));
const phase = (
  frame: number,
  start: number,
  end: number,
  easing: MotionEasingName = 'enter',
): number => prototypeProgress(frame, start, end, easing);
const pulse = (frame: number, speed = 10): number =>
  (Math.sin(frame / speed) + 1) / 2;

const Stage: React.FC<{children: React.ReactNode; label: string}> = ({
  children,
  label,
}) => (
  <GlassSurface
    style={{
      position: 'absolute',
      left: 74,
      right: 74,
      top: 380,
      bottom: 150,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 28,
        top: 24,
        zIndex: 20,
        fontFamily: 'monospace',
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 2,
        color: C.accent,
      }}
    >
      {label}
    </div>
    {children}
  </GlassSurface>
);

const Pill: React.FC<{
  children: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}> = ({children, accent, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 94,
      minHeight: 54,
      padding: '8px 18px',
      borderRadius: 18,
      background: accent ? C.accent : C.white,
      color: accent ? C.white : C.foreground,
      border: accent
        ? '2px solid rgba(255,255,255,.35)'
        : '2px solid rgba(135,87,232,.18)',
      boxShadow: accent
        ? '0 14px 36px rgba(135,87,232,.32)'
        : '0 12px 30px rgba(45,28,75,.10)',
      fontSize: 26,
      fontWeight: 900,
      ...style,
    }}
  >
    {children}
  </div>
);

const SyllableConveyor: React.FC<{frame: number}> = ({frame}) => {
  const travel = phase(frame, 8, 112, 'move');
  const sort = phase(frame, 92, 154, 'move');
  const words = ['Neu', 'ro', 'na', 'les', 'Netz'];
  return (
    <Stage label="ERKENNEN → TRENNEN → SORTIEREN">
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 330,
          height: 132,
          borderRadius: 38,
          background: 'linear-gradient(180deg,#312942,#191522)',
          boxShadow: 'inset 0 16px 28px rgba(255,255,255,.06)',
        }}
      >
        {Array.from({length: 10}, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 28 + index * 79,
              top: 42,
              width: 58,
              height: 48,
              borderRadius: 14,
              background: index % 2 ? '#4B415E' : '#655776',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 126,
          top: 175,
          fontSize: 45,
          fontWeight: 900,
          letterSpacing: -1.5,
          opacity: 1 - phase(frame, 48, 74),
          transform: `translateX(${travel * 520}px)`,
        }}
      >
        Neuronales Netz
      </div>
      {words.map((word, index) => {
        const itemStart = 42 + index * 10;
        const itemTravel = phase(frame, itemStart, itemStart + 65, 'move');
        const targetX = 165 + index * 135;
        const targetY = sort > 0 ? 710 + (index % 2) * 132 : 305;
        const x = interpolate(itemTravel, [0, 1], [130, targetX]);
        const y = interpolate(sort, [0, 1], [300, targetY]);
        return (
          <Pill
            key={`${word}-${index}`}
            accent={index === 0 || index === 4}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              opacity: phase(frame, itemStart - 6, itemStart + 10),
              transform: `translate(-50%,-50%) rotate(${(index - 2) * sort * 4}deg)`,
            }}
          >
            {word}
          </Pill>
        );
      })}
      {[0, 1].map((bin) => (
        <div
          key={bin}
          style={{
            position: 'absolute',
            left: 100 + bin * 430,
            top: 650,
            width: 330,
            height: 250,
            borderRadius: 34,
            border: `3px solid ${bin === 0 ? C.accentSoft : C.accent}`,
            background: 'rgba(135,87,232,.06)',
            opacity: sort,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginTop: 22,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              color: bin === 0 ? C.muted : C.accent,
            }}
          >
            {bin === 0 ? 'TEILSTÜCKE' : 'STABILE TOKENS'}
          </div>
        </div>
      ))}
    </Stage>
  );
};

const MatrixWaterfall: React.FC<{frame: number}> = ({frame}) => {
  const fall = phase(frame, 10, 132);
  const matrix = phase(frame, 92, 162);
  const labels = ['TEXT', 'KONTEXT', 'ZAHLEN'];
  return (
    <Stage label="LESBARER INPUT → NUMERISCHE REPRÄSENTATION">
      {labels.map((label, index) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            left: 160,
            right: 160,
            top: 210 + index * 240,
            height: 18,
            borderRadius: 999,
            background: `linear-gradient(90deg,transparent,${index === 1 ? C.accent : C.accentSoft},transparent)`,
            boxShadow: '0 0 28px rgba(135,87,232,.3)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: -34,
              fontSize: 18,
              fontWeight: 900,
              color: C.muted,
            }}
          >
            {label}
          </span>
        </div>
      ))}
      {Array.from({length: 9}, (_, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const delay = index * 5;
        const p = phase(frame, delay, 118 + delay);
        const x = 250 + column * 210 + Math.sin((frame + index * 17) / 14) * 24;
        const y = interpolate(p, [0, 1], [105, 830]);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 68,
              height: 68,
              borderRadius: matrix > 0.5 ? 10 : 999,
              background: index % 3 === 0 ? C.accent : C.accentSoft,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 900,
              opacity: clamp(p * 1.4),
              transform: `translate(-50%,-50%) scale(${1 - matrix * 0.14}) rotate(${matrix * (row - column) * 8}deg)`,
              boxShadow: '0 0 26px rgba(135,87,232,.32)',
            }}
          >
            {(0.13 + index * 0.09).toFixed(2)}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 205,
          right: 205,
          bottom: 85,
          height: 250,
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 14,
          padding: 24,
          borderRadius: 30,
          border: '2px solid rgba(135,87,232,.25)',
          background: 'rgba(255,255,255,.78)',
          opacity: matrix,
          transform: `perspective(800px) rotateX(${(1 - matrix) * 30}deg)`,
        }}
      >
        {Array.from({length: 9}, (_, index) => (
          <div
            key={index}
            style={{
              borderRadius: 12,
              background: index % 2 ? C.accentSoft : C.accent,
              opacity: 0.42 + index * 0.055,
            }}
          />
        ))}
      </div>
    </Stage>
  );
};

const ConceptConstellation: React.FC<{frame: number}> = ({frame}) => {
  const settle = phase(frame, 18, 124, 'move');
  const lock = phase(frame, 108, 162);
  const nodes = [
    {label: 'Hund', sx: 90, sy: 210, tx: 280, ty: 440, color: C.accent},
    {label: 'Katze', sx: 820, sy: 170, tx: 360, ty: 540, color: C.accent},
    {label: 'Tier', sx: 110, sy: 860, tx: 310, ty: 650, color: C.accentSoft},
    {label: 'Zug', sx: 830, sy: 850, tx: 690, ty: 430, color: C.success},
    {label: 'Auto', sx: 490, sy: 120, tx: 760, ty: 540, color: C.success},
    {label: 'Fahrt', sx: 520, sy: 900, tx: 700, ty: 650, color: C.success},
  ];
  return (
    <Stage label="ANZIEHUNG = ÄHNLICHKEIT · ABSTOSSUNG = UNTERSCHIED">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {[[0, 1], [1, 2], [3, 4], [4, 5]].map(([a, b], index) => {
          const left = nodes[a];
          const right = nodes[b];
          const x1 = interpolate(settle, [0, 1], [left.sx, left.tx]);
          const y1 = interpolate(settle, [0, 1], [left.sy, left.ty]);
          const x2 = interpolate(settle, [0, 1], [right.sx, right.tx]);
          const y2 = interpolate(settle, [0, 1], [right.sy, right.ty]);
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={index < 2 ? C.accent : C.success}
              strokeWidth={5}
              opacity={lock * 0.65}
              strokeDasharray="12 10"
            />
          );
        })}
      </svg>
      {nodes.map((node, index) => {
        const x = interpolate(settle, [0, 1], [node.sx, node.tx]);
        const y = interpolate(settle, [0, 1], [node.sy, node.ty]);
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${0.82 + settle * 0.18})`,
              opacity: phase(frame, index * 5, 20 + index * 5),
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                margin: '0 auto 8px',
                borderRadius: 999,
                background: node.color,
                boxShadow: `0 0 ${24 + lock * 20}px ${node.color}88`,
              }}
            />
            <Pill>{node.label}</Pill>
          </div>
        );
      })}
      {[
        {x: 310, label: 'TIERE', color: C.accent},
        {x: 720, label: 'REISEN', color: C.success},
      ].map((group) => (
        <div
          key={group.label}
          style={{
            position: 'absolute',
            left: group.x,
            top: 770,
            transform: 'translateX(-50%)',
            color: group.color,
            fontSize: 23,
            fontWeight: 900,
            letterSpacing: 3,
            opacity: lock,
          }}
        >
          {group.label}
        </div>
      ))}
    </Stage>
  );
};

const GraphBloom: React.FC<{frame: number}> = ({frame}) => {
  const grow = phase(frame, 8, 112);
  const prune = phase(frame, 112, 164);
  // Abgang der schwachen Aeste, getrennt vom Eintritt der Bildunterschrift.
  const pruneExit = phase(frame, 112, 164, 'exit');
  const branches = [
    {angle: -125, length: 245, strong: false},
    {angle: -72, length: 320, strong: true},
    {angle: -28, length: 260, strong: true},
    {angle: 26, length: 280, strong: false},
    {angle: 78, length: 320, strong: true},
    {angle: 132, length: 230, strong: true},
  ];
  return (
    <Stage label="KERNBEGRIFF → BEZIEHUNGEN → RELEVANZ">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {branches.map((branch, index) => {
          const angle = (branch.angle * Math.PI) / 180;
          const x = 466 + Math.cos(angle) * branch.length;
          const y = 560 + Math.sin(angle) * branch.length;
          const visible = grow * (branch.strong ? 1 : 1 - pruneExit);
          return (
            <g key={index} opacity={visible}>
              <path
                d={`M466 560 Q${466 + Math.cos(angle) * branch.length * 0.45} ${560 + Math.sin(angle) * branch.length * 0.2} ${x} ${y}`}
                fill="none"
                stroke={branch.strong ? C.accent : C.line}
                strokeWidth={branch.strong ? 13 : 7}
                strokeLinecap="round"
                strokeDasharray="500"
                strokeDashoffset={500 * (1 - grow)}
              />
              <circle cx={x} cy={y} r={branch.strong ? 28 : 20} fill={branch.strong ? C.accentSoft : C.line} />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 560,
          width: 170,
          height: 170,
          borderRadius: 999,
          transform: `translate(-50%,-50%) scale(${0.74 + grow * 0.26})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: `radial-gradient(circle,${C.white},${C.accentSoft})`,
          border: `5px solid ${C.accent}`,
          boxShadow: '0 0 50px rgba(135,87,232,.35)',
          fontWeight: 900,
          fontSize: 29,
        }}
      >
        KI
        <br />
        VERSTEHEN
      </div>
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          bottom: 90,
          padding: '20px 26px',
          borderRadius: 22,
          background: 'rgba(53,197,138,.10)',
          border: '1px solid rgba(53,197,138,.3)',
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 900,
          color: C.success,
          opacity: prune,
        }}
      >
        SCHWACHE ÄSTE WERDEN ENTFERNT
      </div>
    </Stage>
  );
};

const CandidateOrbit: React.FC<{frame: number}> = ({frame}) => {
  const converge = phase(frame, 102, 160);
  const candidates = [
    {label: 'Text', radius: 175, score: 62, accent: true},
    {label: 'Daten', radius: 260, score: 27, accent: false},
    {label: 'Wörter', radius: 335, score: 11, accent: false},
  ];
  return (
    <Stage label="KLEINERER RADIUS = HÖHERE WAHRSCHEINLICHKEIT">
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 560,
          width: 220,
          height: 220,
          borderRadius: 999,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle,#FFFFFF,#EEE7FF)',
          border: `4px solid ${C.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 31,
          fontWeight: 900,
          boxShadow: '0 0 55px rgba(135,87,232,.25)',
        }}
      >
        Die KI
        <br />
        liest …
      </div>
      {candidates.map((candidate, index) => {
        const angle = frame / (18 + index * 5) + index * 2.1;
        const targetRadius = candidate.accent ? 0 : candidate.radius;
        const radius = interpolate(converge, [0, 1], [candidate.radius, targetRadius]);
        const x = 466 + Math.cos(angle) * radius;
        const y = 560 + Math.sin(angle) * radius * 0.72;
        return (
          <div
            key={candidate.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${candidate.accent ? 1 + converge * 0.3 : 1 - converge * 0.18})`,
              opacity: candidate.accent ? 1 : 1 - converge * 0.65,
            }}
          >
            <Pill accent={candidate.accent && converge > 0.55}>{candidate.label}</Pill>
            <div
              style={{
                marginTop: 8,
                textAlign: 'center',
                fontFamily: 'monospace',
                fontWeight: 900,
                color: candidate.accent ? C.accent : C.muted,
              }}
            >
              {candidate.score}%
            </div>
          </div>
        );
      })}
      {[175, 260, 335].map((radius) => (
        <div
          key={radius}
          style={{
            position: 'absolute',
            left: 466,
            top: 560,
            width: radius * 2,
            height: radius * 1.44,
            borderRadius: '50%',
            border: '2px solid rgba(135,87,232,.12)',
            transform: 'translate(-50%,-50%)',
          }}
        />
      ))}
    </Stage>
  );
};

const TransformerTunnel: React.FC<{frame: number}> = ({frame}) => {
  const travel = phase(frame, 4, 158, 'move');
  const rings = ['KONTEXT', 'MUSTER', 'GEWICHT', 'AUSWAHL'];
  return (
    <Stage label="JEDE SCHICHT VERÄNDERT EINE SICHTBARE EIGENSCHAFT">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: 900,
          overflow: 'hidden',
        }}
      >
        {rings.map((label, index) => {
          const z = interpolate(travel, [0, 1], [index * -250, 850 + index * -250]);
          const scale = Math.max(0.18, 1 + z / 950);
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: 466,
                top: 555,
                width: 470,
                height: 470,
                borderRadius: 999,
                transform: `translate(-50%,-50%) scale(${scale})`,
                border: `${10 + index * 2}px solid ${index % 2 ? C.accentSoft : C.accent}`,
                opacity: clamp(1.2 - Math.abs(z) / 900),
                boxShadow: '0 0 45px rgba(135,87,232,.2)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 42,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 20,
                  letterSpacing: 2,
                  fontWeight: 900,
                  color: C.accent,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 466,
            top: 555,
            width: 112,
            height: 112,
            borderRadius: 28,
            transform: `translate(-50%,-50%) rotate(${travel * 180}deg) scale(${0.82 + pulse(frame, 9) * 0.1})`,
            background: C.accent,
            color: C.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 26,
            boxShadow: '0 0 60px rgba(135,87,232,.55)',
          }}
        >
          INFO
        </div>
      </div>
    </Stage>
  );
};

const SentenceRibbon: React.FC<{frame: number}> = ({frame}) => {
  const words = ['KI', 'setzt', 'Muster', 'Wort', 'für', 'Wort', 'fort.'];
  return (
    <Stage label="JEDER FALTPUNKT FÜGT EIN AUSGEWÄHLTES WORT EIN">
      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          top: 470,
          height: 230,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 900,
        }}
      >
        {words.map((word, index) => {
          const p = phase(frame, 12 + staggerDelay(index, 17), 34 + staggerDelay(index, 17));
          const fold = interpolate(p, [0, 1], [88, 0]);
          return (
            <div
              key={`${word}-${index}`}
              style={{
                width: word.length > 5 ? 155 : 100,
                height: 116,
                marginLeft: index === 0 ? 0 : -3,
                borderRadius: index === 0 ? '26px 0 0 26px' : index === words.length - 1 ? '0 26px 26px 0' : 0,
                background: index % 2 ? C.accentSoft : C.accent,
                color: index % 2 ? C.foreground : C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 25,
                fontWeight: 900,
                opacity: p,
                transformOrigin: 'left center',
                transform: `rotateY(${fold}deg) translateZ(${(1 - p) * 90}px)`,
                boxShadow: '0 20px 40px rgba(45,28,75,.13)',
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 760,
          height: 8,
          borderRadius: 999,
          background: C.line,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${phase(frame, 10, 145) * 100}%`,
            background: `linear-gradient(90deg,${C.accentSoft},${C.accent})`,
          }}
        />
      </div>
    </Stage>
  );
};

const HallucinationMirage: React.FC<{frame: number}> = ({frame}) => {
  const approach = phase(frame, 0, 105);
  const verify = phase(frame, 92, 160);
  const distortion = Math.sin(frame / 3) * verify * 12;
  return (
    <Stage label="SICHERER KLANG ≠ SICHERE WAHRHEIT">
      <div
        style={{
          position: 'absolute',
          left: 466 + distortion,
          top: interpolate(approach, [0, 1], [420, 560]),
          width: interpolate(approach, [0, 1], [330, 570]),
          minHeight: 240,
          padding: 34,
          borderRadius: 38,
          transform: 'translate(-50%,-50%)',
          background: 'linear-gradient(145deg,rgba(255,255,255,.96),rgba(198,168,255,.36))',
          border: `3px solid ${verify > 0.3 ? C.danger : C.accent}`,
          boxShadow: `0 25px 80px rgba(${verify > 0.3 ? '255,93,108' : '135,87,232'},.25)`,
          opacity: 1 - verify * 0.48,
          filter: `blur(${verify * 3}px)`,
        }}
      >
        <div style={{fontSize: 24, fontWeight: 900, color: C.accent}}>ÜBERZEUGENDE ANTWORT</div>
        <div style={{fontSize: 34, lineHeight: 1.18, fontWeight: 900, marginTop: 24}}>
          „Diese Aussage klingt absolut eindeutig.“
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: interpolate(verify, [0, 1], [110, 466]),
          top: 830,
          width: 112,
          height: 112,
          borderRadius: 999,
          background: C.foreground,
          color: C.white,
          transform: 'translate(-50%,-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
          boxShadow: '0 20px 50px rgba(20,18,26,.25)',
        }}
      >
        ✓
      </div>
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 950,
          transform: 'translateX(-50%)',
          color: C.danger,
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 2,
          opacity: verify,
        }}
      >
        KEINE BELASTBARE QUELLE
      </div>
    </Stage>
  );
};

const DifferenceMagnifier: React.FC<{frame: number}> = ({frame}) => {
  const scan = phase(frame, 10, 145);
  const lensX = interpolate(scan, [0, 1], [210, 720]);
  return (
    <Stage label="ZWEI ÄHNLICHE OPTIONEN · EIN ENTSCHEIDENDER UNTERSCHIED">
      {['MODELL A', 'MODELL B'].map((label, index) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            left: index === 0 ? 92 : 484,
            top: 220,
            width: 355,
            height: 650,
            borderRadius: 32,
            padding: 26,
            boxSizing: 'border-box',
            background: index === 0 ? 'rgba(135,87,232,.08)' : 'rgba(53,197,138,.08)',
            border: `2px solid ${index === 0 ? C.accentSoft : C.success}`,
          }}
        >
          <div style={{fontSize: 25, fontWeight: 900, color: index === 0 ? C.accent : C.success}}>{label}</div>
          {['Geschwindigkeit', 'Kosten', 'Qualität', 'Quellen'].map((item, row) => (
            <div
              key={item}
              style={{
                marginTop: 48,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              <span>{item}</span>
              <span style={{color: row === 3 && index === 1 ? C.success : C.muted}}>
                {row === 3 && index === 1 ? 'JA' : row === 3 ? 'NEIN' : `${72 + row * 6}%`}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: lensX,
          top: 690,
          width: 225,
          height: 225,
          borderRadius: 999,
          border: `13px solid ${C.foreground}`,
          transform: 'translate(-50%,-50%)',
          boxShadow: '0 24px 60px rgba(20,18,26,.23), inset 0 0 34px rgba(135,87,232,.16)',
          background: 'rgba(255,255,255,.24)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -92,
            bottom: -72,
            width: 120,
            height: 24,
            borderRadius: 999,
            background: C.foreground,
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    </Stage>
  );
};

const PriorityOrbit: React.FC<{frame: number}> = ({frame}) => {
  const stack = phase(frame, 92, 160);
  const items = [
    {label: 'Sicherheit', score: 1, color: C.danger},
    {label: 'Qualität', score: 2, color: C.accent},
    {label: 'Tempo', score: 3, color: C.warning},
    {label: 'Kosten', score: 4, color: C.success},
  ];
  return (
    <Stage label="ELEMENTE BEWEGEN SICH NACH PRIORITÄT ZUM ZIEL">
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 540,
          width: 210,
          height: 210,
          borderRadius: 999,
          transform: 'translate(-50%,-50%)',
          background: C.foreground,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        BESTE
        <br />
        ENTSCHEIDUNG
      </div>
      {items.map((item, index) => {
        const angle = frame / 18 + index * (Math.PI / 2);
        const radius = 310 - index * 34;
        const orbitX = 466 + Math.cos(angle) * radius;
        const orbitY = 540 + Math.sin(angle) * radius * 0.7;
        const targetX = 466;
        const targetY = 820 + index * 72;
        const x = interpolate(stack, [0, 1], [orbitX, targetX]);
        const y = interpolate(stack, [0, 1], [orbitY, targetY]);
        return (
          <div
            key={item.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${1 - stack * index * 0.035})`,
              zIndex: 10 - item.score,
            }}
          >
            <Pill accent={index === 0}>{`${item.score}. ${item.label}`}</Pill>
          </div>
        );
      })}
    </Stage>
  );
};

const AutomationCells: React.FC<{frame: number}> = ({frame}) => {
  const travel = phase(frame, 8, 158, 'move');
  const cells = [
    {label: 'LESEN', icon: 'A'},
    {label: 'PRÜFEN', icon: '✓'},
    {label: 'UMFORMEN', icon: '↻'},
    {label: 'AUSGEBEN', icon: '→'},
  ];
  return (
    <Stage label="EIN OBJEKT · VIER SPEZIALISIERTE ARBEITSSCHRITTE">
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 590,
          height: 36,
          borderRadius: 999,
          background: C.foreground,
        }}
      />
      {cells.map((cell, index) => {
        const x = 150 + index * 210;
        const active = Math.max(0, 1 - Math.abs(travel * 3.6 - index));
        return (
          <div
            key={cell.label}
            style={{
              position: 'absolute',
              left: x,
              top: 320,
              width: 168,
              height: 330,
              borderRadius: 32,
              border: `3px solid ${active > 0.4 ? C.accent : C.line}`,
              background: active > 0.4 ? 'rgba(135,87,232,.10)' : 'rgba(255,255,255,.72)',
              boxShadow: active > 0.4 ? '0 0 45px rgba(135,87,232,.22)' : 'none',
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                margin: '48px auto 28px',
                borderRadius: 24,
                background: active > 0.4 ? C.accent : C.accentSoft,
                color: C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 42,
                fontWeight: 900,
                transform: `rotate(${active * 35}deg)`,
              }}
            >
              {cell.icon}
            </div>
            <div style={{textAlign: 'center', fontSize: 21, fontWeight: 900}}>{cell.label}</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: interpolate(travel, [0, 1], [105, 815]),
          top: 608,
          width: 86,
          height: 86,
          borderRadius: 24,
          transform: `translate(-50%,-50%) rotate(${travel * 270}deg)`,
          background: C.warning,
          boxShadow: '0 0 36px rgba(255,182,72,.45)',
          zIndex: 10,
        }}
      />
    </Stage>
  );
};

const TransformationPortal: React.FC<{frame: number}> = ({frame}) => {
  const travel = phase(frame, 10, 154, 'move');
  const x = interpolate(travel, [0, 1], [130, 820]);
  const morph = phase(frame, 62, 115);
  return (
    <Stage label="DER INTERNE PROZESS BLEIBT SICHTBAR">
      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          style={{
            position: 'absolute',
            left: 466,
            top: 560,
            width: 300 + ring * 105,
            height: 300 + ring * 105,
            borderRadius: 999,
            border: `${8 + ring * 2}px solid ${ring % 2 ? C.accentSoft : C.accent}`,
            transform: `translate(-50%,-50%) rotate(${frame * (ring % 2 ? -0.8 : 0.6)}deg) scale(${0.93 + pulse(frame + ring * 9, 14) * 0.08})`,
            opacity: 0.3 + ring * 0.18,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: 560,
          width: interpolate(morph, [0, 1], [115, 150]),
          height: interpolate(morph, [0, 1], [115, 88]),
          borderRadius: interpolate(morph, [0, 1], [28, 999]),
          transform: `translate(-50%,-50%) rotate(${travel * 180}deg)`,
          background: morph < 0.5 ? C.foreground : C.success,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 900,
          zIndex: 10,
        }}
      >
        {morph < 0.5 ? 'INPUT' : 'OUTPUT'}
      </div>
    </Stage>
  );
};

const BrokenPathRepair: React.FC<{frame: number}> = ({frame}) => {
  const signal = phase(frame, 8, 82);
  const repair = phase(frame, 82, 138);
  const resume = phase(frame, 132, 174);
  const signalX = signal < 1
    ? interpolate(signal, [0, 1], [120, 450])
    : interpolate(resume, [0, 1], [450, 820]);
  return (
    <Stage label="STOPPEN → DIAGNOSE → REPARIEREN → WEITERLAUFEN">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path d="M120 560 C280 440 360 680 450 560" fill="none" stroke={C.accent} strokeWidth="16" strokeLinecap="round" />
        <path d="M510 560 C620 420 720 660 820 560" fill="none" stroke={repair > 0.7 ? C.success : C.line} strokeWidth="16" strokeLinecap="round" />
        <path
          d="M450 560 L510 560"
          fill="none"
          stroke={C.success}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset={80 * (1 - repair)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: signalX,
          top: 560,
          width: 48,
          height: 48,
          borderRadius: 999,
          transform: 'translate(-50%,-50%)',
          background: resume > 0 ? C.success : C.accent,
          boxShadow: `0 0 35px ${resume > 0 ? 'rgba(53,197,138,.55)' : 'rgba(135,87,232,.55)'}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 480,
          top: 420,
          transform: `translate(-50%,-50%) scale(${0.8 + repair * 0.2})`,
          color: repair < 0.7 ? C.danger : C.success,
          fontSize: 34,
          fontWeight: 900,
          opacity: phase(frame, 72, 94),
        }}
      >
        {repair < 0.7 ? 'BRUCHSTELLE' : 'REPARIERT'}
      </div>
    </Stage>
  );
};

const ArchiveSpotlight: React.FC<{frame: number}> = ({frame}) => {
  const scan = phase(frame, 6, 125);
  const extract = phase(frame, 116, 168);
  const lightX = interpolate(scan, [0, 1], [150, 760]);
  return (
    <Stage label="DOKUMENTE DURCHSUCHEN · BELEGZEILEN EXTRAHIEREN">
      {Array.from({length: 4}, (_, shelf) => (
        <div
          key={shelf}
          style={{
            position: 'absolute',
            left: 95,
            right: 95,
            top: 210 + shelf * 170,
            height: 115,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-end',
            borderBottom: `12px solid ${C.foreground}`,
          }}
        >
          {Array.from({length: 8}, (_, book) => (
            <div
              key={book}
              style={{
                width: 65,
                height: 70 + ((book + shelf) % 4) * 11,
                borderRadius: '8px 8px 0 0',
                background: (book + shelf) % 3 === 0 ? C.accent : C.accentSoft,
                opacity: 0.4 + ((book + shelf) % 4) * 0.12,
              }}
            />
          ))}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: lightX,
          top: 120,
          width: 250,
          height: 780,
          transform: 'translateX(-50%)',
          clipPath: 'polygon(44% 0,56% 0,100% 100%,0 100%)',
          background: 'linear-gradient(180deg,rgba(255,255,255,.95),rgba(198,168,255,.16))',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 466,
          bottom: 80,
          width: 650,
          minHeight: 130,
          padding: 24,
          borderRadius: 26,
          transform: `translateX(-50%) translateY(${(1 - extract) * 80}px)`,
          opacity: extract,
          background: C.white,
          border: `3px solid ${C.success}`,
          boxShadow: '0 20px 55px rgba(53,197,138,.18)',
          fontSize: 26,
          lineHeight: 1.25,
          fontWeight: 800,
        }}
      >
        „Die relevante Quelle bestätigt genau diesen Zusammenhang.“
      </div>
    </Stage>
  );
};

const PermissionCity: React.FC<{frame: number}> = ({frame}) => {
  const route = phase(frame, 8, 160);
  const gates = [
    {label: 'IDENTITÄT', x: 230, y: 720},
    {label: 'ROLLE', x: 470, y: 470},
    {label: 'UMFANG', x: 730, y: 250},
  ];
  return (
    <Stage label="NUR DER VOLLSTÄNDIG GEPRÜFTE PFAD BLEIBT OFFEN">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path d="M110 920 C210 760 330 720 470 560 C600 410 700 330 840 170" fill="none" stroke={C.line} strokeWidth="28" strokeLinecap="round" />
        <path d="M110 920 C210 760 330 720 470 560 C600 410 700 330 840 170" fill="none" stroke={C.success} strokeWidth="12" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - route)} />
      </svg>
      {gates.map((gate, index) => {
        const active = phase(frame, 32 + staggerDelay(index, 34), 50 + staggerDelay(index, 34));
        return (
          <div
            key={gate.label}
            style={{
              position: 'absolute',
              left: gate.x,
              top: gate.y,
              width: 190,
              height: 150,
              transform: `translate(-50%,-50%) rotate(${-8 + index * 7}deg)`,
              borderRadius: '22px 22px 8px 8px',
              border: `5px solid ${active > 0.6 ? C.success : C.accent}`,
              background: 'rgba(255,255,255,.93)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 21,
              fontWeight: 900,
              boxShadow: active > 0.6 ? '0 0 36px rgba(53,197,138,.28)' : '0 16px 35px rgba(45,28,75,.12)',
            }}
          >
            {gate.label}
            <br />
            {active > 0.6 ? '✓' : '…'}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: interpolate(route, [0, 1], [110, 840]),
          top: interpolate(route, [0, 1], [920, 170]),
          width: 62,
          height: 62,
          borderRadius: 18,
          transform: 'translate(-50%,-50%)',
          background: C.foreground,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          zIndex: 10,
        }}
      >
        ID
      </div>
    </Stage>
  );
};

const LoadBalancingCity: React.FC<{frame: number}> = ({frame}) => {
  const distribute = phase(frame, 15, 150);
  const services = [
    {x: 220, y: 365, load: 0.92},
    {x: 470, y: 570, load: 0.55},
    {x: 720, y: 340, load: 0.68},
    {x: 690, y: 790, load: 0.43},
    {x: 260, y: 810, load: 0.58},
  ];
  return (
    <Stage label="VERKEHR WIRD VOR DER ÜBERLASTUNG UMGELEITET">
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 560,
          width: 150,
          height: 150,
          borderRadius: 999,
          transform: 'translate(-50%,-50%)',
          background: C.foreground,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 900,
          zIndex: 5,
        }}
      >
        ROUTER
      </div>
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {services.map((service, index) => (
          <line
            key={index}
            x1="466"
            y1="560"
            x2={service.x}
            y2={service.y}
            stroke={service.load > 0.85 ? C.warning : C.accentSoft}
            strokeWidth={8}
            strokeDasharray="16 12"
            strokeDashoffset={-frame * (1 + index * 0.12)}
            opacity={0.65}
          />
        ))}
      </svg>
      {services.map((service, index) => {
        const currentLoad = service.load - distribute * (index === 0 ? 0.34 : -0.05 * (index % 2));
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: service.x,
              top: service.y,
              width: 150,
              height: 180,
              transform: 'translate(-50%,-50%)',
              borderRadius: '20px 20px 8px 8px',
              background: 'linear-gradient(180deg,#FFFFFF,#EEE8F7)',
              border: `3px solid ${currentLoad > 0.8 ? C.warning : C.success}`,
              padding: 16,
              boxSizing: 'border-box',
            }}
          >
            <div style={{fontSize: 20, fontWeight: 900}}>SERVICE {index + 1}</div>
            <div style={{position: 'absolute', left: 20, right: 20, bottom: 20, height: 90, borderRadius: 12, background: C.line, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${clamp(currentLoad) * 100}%`, background: currentLoad > 0.8 ? C.warning : C.success}} />
            </div>
          </div>
        );
      })}
    </Stage>
  );
};

const TokenCostConveyor: React.FC<{frame: number}> = ({frame}) => {
  const filter = phase(frame, 74, 132);
  const tokens = ['Bitte', 'wirklich', 'sehr', 'kurz', 'erklären', 'KI'];
  const cost = Math.round(interpolate(filter, [0, 1], [18.4, 9.7]));
  return (
    <Stage label="UNNÖTIGE TOKENS ENTFERNEN · KOSTEN SOFORT NEU BERECHNEN">
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 590,
          height: 120,
          borderRadius: 34,
          background: C.foreground,
        }}
      />
      {tokens.map((token, index) => {
        const enter = phase(frame, index * 7, 30 + index * 7);
        const remove = filter * (index === 1 || index === 2 ? 1 : 0);
        return (
          <Pill
            key={token}
            accent={index === 3 || index === 5}
            style={{
              position: 'absolute',
              left: 120 + index * 135 + frame * 2.2 % 110,
              top: 650 - remove * 230,
              opacity: enter * (1 - remove),
              transform: `translate(-50%,-50%) rotate(${remove * 28}deg)`,
            }}
          >
            {token}
          </Pill>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 290,
          width: 390,
          height: 180,
          borderRadius: 34,
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,.9)',
          border: `3px solid ${C.success}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '0 20px 55px rgba(53,197,138,.16)',
        }}
      >
        <div style={{fontSize: 22, fontWeight: 900, color: C.muted}}>GESCHÄTZTE KOSTEN</div>
        <div style={{fontFamily: 'monospace', fontSize: 62, fontWeight: 900, color: C.success}}>{cost} CT</div>
      </div>
    </Stage>
  );
};

const VersionEvolutionTree: React.FC<{frame: number}> = ({frame}) => {
  const grow = phase(frame, 4, 145);
  const versions = [
    {x: 160, y: 760, label: 'V1'},
    {x: 340, y: 610, label: 'V2'},
    {x: 520, y: 470, label: 'V3'},
    {x: 700, y: 300, label: 'V4'},
    {x: 820, y: 690, label: 'V3.1'},
  ];
  return (
    <Stage label="FUNKTIONEN ENTSTEHEN · VERSCHMELZEN · VERSCHWINDEN">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path d="M100 900 C210 760 350 650 520 470 C650 330 760 260 850 170" fill="none" stroke={C.accent} strokeWidth="18" strokeLinecap="round" strokeDasharray="1500" strokeDashoffset={1500 * (1 - grow)} />
        <path d="M520 470 C650 520 740 610 820 690" fill="none" stroke={C.accentSoft} strokeWidth="12" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - grow)} />
      </svg>
      {versions.map((version, index) => {
        const p = phase(frame, 18 + staggerDelay(index, 18), 42 + staggerDelay(index, 18));
        return (
          <div
            key={version.label}
            style={{
              position: 'absolute',
              left: version.x,
              top: version.y,
              width: 104,
              height: 104,
              borderRadius: 999,
              transform: `translate(-50%,-50%) scale(${0.65 + p * 0.35})`,
              opacity: p,
              background: index === 3 ? C.success : index === 4 ? C.accentSoft : C.accent,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 25,
              fontWeight: 900,
              boxShadow: '0 16px 38px rgba(45,28,75,.16)',
            }}
          >
            {version.label}
          </div>
        );
      })}
    </Stage>
  );
};

const FeedbackSculpting: React.FC<{frame: number}> = ({frame}) => {
  const refine = phase(frame, 25, 150);
  const rotate = frame * 0.45;
  const roughRadius = interpolate(refine, [0, 1], [18, 999]);
  return (
    <Stage label="KI-ROHFORM + MENSCHLICHES FEEDBACK = ZIELFORM">
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 560,
          width: interpolate(refine, [0, 1], [390, 300]),
          height: interpolate(refine, [0, 1], [330, 300]),
          transform: `translate(-50%,-50%) rotate(${rotate * (1 - refine)}deg)`,
          borderRadius: roughRadius,
          background: `linear-gradient(${120 + refine * 80}deg,${C.accent},${C.accentSoft})`,
          boxShadow: '0 30px 80px rgba(135,87,232,.28)',
          clipPath: refine < 0.7 ? 'polygon(8% 18%,76% 0,100% 43%,82% 100%,22% 90%,0 52%)' : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 560,
          width: 320,
          height: 320,
          borderRadius: 999,
          transform: 'translate(-50%,-50%)',
          border: `4px dashed ${C.success}`,
          opacity: 0.35 + refine * 0.65,
        }}
      />
      {['KÜRZER', 'KLARER', 'BELEGT'].map((tool, index) => {
        const angle = index * (Math.PI * 2 / 3) + frame / 24;
        return (
          <div
            key={tool}
            style={{
              position: 'absolute',
              left: 466 + Math.cos(angle) * 310,
              top: 560 + Math.sin(angle) * 220,
              transform: 'translate(-50%,-50%)',
            }}
          >
            <Pill accent={index === 2 && refine > 0.65}>{tool}</Pill>
          </div>
        );
      })}
    </Stage>
  );
};

const IfThenGates: React.FC<{frame: number}> = ({frame}) => {
  const signals = [
    {label: 'QUELLE?', y: 310, pass: true},
    {label: 'AKTUELL?', y: 555, pass: true},
    {label: 'RELEVANT?', y: 800, pass: false},
  ];
  return (
    <Stage label="NUR EIN VOLLSTÄNDIG ERFÜLLTER REGELSATZ ÖFFNET DEN AUSGANG">
      {signals.map((signal, index) => {
        const p = phase(frame, 18 + staggerDelay(index, 36), 62 + staggerDelay(index, 36));
        return (
          <React.Fragment key={signal.label}>
            <div
              style={{
                position: 'absolute',
                left: interpolate(p, [0, 1], [90, 350]),
                top: signal.y,
                width: 74,
                height: 42,
                borderRadius: 999,
                transform: 'translate(-50%,-50%)',
                background: signal.pass ? C.success : C.danger,
                boxShadow: `0 0 28px ${signal.pass ? 'rgba(53,197,138,.5)' : 'rgba(255,93,108,.5)'}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 480,
                top: signal.y,
                width: 250,
                height: 150,
                borderRadius: 32,
                transform: 'translate(-50%,-50%)',
                background: 'rgba(255,255,255,.9)',
                border: `4px solid ${p > 0.8 ? (signal.pass ? C.success : C.danger) : C.line}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 25,
                fontWeight: 900,
              }}
            >
              {signal.label}
              <br />
              {p > 0.8 ? (signal.pass ? 'JA' : 'NEIN') : '…'}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 280,
          bottom: 220,
          width: 135,
          borderRadius: 34,
          background: 'rgba(255,93,108,.10)',
          border: `4px solid ${C.danger}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          writingMode: 'vertical-rl',
          fontSize: 23,
          fontWeight: 900,
          letterSpacing: 3,
          color: C.danger,
          opacity: phase(frame, 120, 160),
        }}
      >
        PFAD GESPERRT
      </div>
    </Stage>
  );
};

const MemoryCarousel: React.FC<{frame: number}> = ({frame}) => {
  const focus = phase(frame, 108, 164);
  const cards = ['Frage 1', 'Antwort 1', 'Quelle', 'Frage 2', 'Notiz', 'Aktuell'];
  return (
    <Stage label="BEGRENZTER SPEICHER · RELEVANTES WIRD ZURÜCKGEHOLT">
      {cards.map((card, index) => {
        const angle = frame / 30 + index * (Math.PI * 2 / cards.length);
        const radiusX = 330;
        const radiusY = 245;
        const isSelected = index === 2;
        const orbitX = 466 + Math.cos(angle) * radiusX;
        const orbitY = 560 + Math.sin(angle) * radiusY;
        const x = interpolate(focus, [0, 1], [orbitX, isSelected ? 466 : orbitX]);
        const y = interpolate(focus, [0, 1], [orbitY, isSelected ? 560 : orbitY]);
        const depth = (Math.sin(angle) + 1) / 2;
        return (
          <div
            key={card}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 180,
              height: 115,
              borderRadius: 24,
              transform: `translate(-50%,-50%) scale(${isSelected ? 1 + focus * 0.6 : 0.72 + depth * 0.25 - focus * 0.2})`,
              opacity: isSelected ? 1 : 0.42 + depth * 0.5 - focus * 0.45,
              background: isSelected ? C.accent : C.white,
              color: isSelected ? C.white : C.foreground,
              border: `2px solid ${isSelected ? C.accent : C.line}`,
              boxShadow: '0 18px 45px rgba(45,28,75,.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 900,
              zIndex: isSelected ? 10 : Math.round(depth * 5),
            }}
          >
            {card}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 466,
          bottom: 90,
          transform: 'translateX(-50%)',
          fontSize: 23,
          fontWeight: 900,
          color: C.accent,
          opacity: focus,
        }}
      >
        RELEVANTE QUELLE REAKTIVIERT
      </div>
    </Stage>
  );
};

const BeliefLedger: React.FC<{frame: number}> = ({frame}) => {
  const compare = phase(frame, 46, 108);
  const adopt = phase(frame, 104, 162);
  const rows = [
    {label: 'Alter Fakt', confidence: 0.82, source: 'Quelle A', old: true},
    {label: 'Neuer Fakt', confidence: 0.94, source: 'Quelle B', old: false},
  ];
  return (
    <Stage label="AKTUALITÄT + QUELLE + VERTRAUEN ENTSCHEIDEN">
      <div
        style={{
          position: 'absolute',
          left: 100,
          right: 100,
          top: 230,
          bottom: 190,
          borderRadius: 34,
          background: 'rgba(255,255,255,.9)',
          border: '2px solid rgba(135,87,232,.18)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 100,
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1.2fr',
            alignItems: 'center',
            padding: '0 34px',
            background: C.foreground,
            color: C.white,
            fontSize: 21,
            fontWeight: 900,
          }}
        >
          <span>FAKT</span><span>VERTRAUEN</span><span>QUELLE</span>
        </div>
        {rows.map((row, index) => (
          <div
            key={row.label}
            style={{
              height: 230,
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1.2fr',
              alignItems: 'center',
              padding: '0 34px',
              borderBottom: '1px solid rgba(135,87,232,.12)',
              opacity: index === 1 ? phase(frame, 12, 42) : 1,
              background: index === 1 && adopt > 0.6 ? 'rgba(53,197,138,.08)' : 'transparent',
            }}
          >
            <div>
              <div style={{fontSize: 28, fontWeight: 900}}>{row.label}</div>
              <div style={{fontSize: 18, color: C.muted, marginTop: 8}}>{row.old ? '2025-11-01' : '2026-08-04'}</div>
            </div>
            <div>
              <div style={{height: 20, borderRadius: 999, background: C.line, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${row.confidence * 100}%`, background: index === 1 ? C.success : C.accent}} />
              </div>
              <div style={{fontFamily: 'monospace', fontSize: 22, fontWeight: 900, marginTop: 10}}>{Math.round(row.confidence * 100)}%</div>
            </div>
            <Pill accent={index === 1 && adopt > 0.6}>{row.source}</Pill>
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            right: 54,
            bottom: 45,
            padding: '18px 26px',
            borderRadius: 18,
            background: adopt > 0.55 ? C.success : C.warning,
            color: C.white,
            fontSize: 23,
            fontWeight: 900,
            transform: `rotate(${interpolate(compare, [0, 1], [-12, -3])}deg) scale(${0.75 + adopt * 0.25})`,
            opacity: compare,
          }}
        >
          {adopt > 0.55 ? 'NEUER FAKT ÜBERNOMMEN' : 'WIRD GEPRÜFT'}
        </div>
      </div>
    </Stage>
  );
};

const mechanismRenderers: Record<
  ExperimentalMechanism,
  React.FC<{frame: number}>
> = {
  'syllable-conveyor': SyllableConveyor,
  'matrix-waterfall': MatrixWaterfall,
  'concept-constellation': ConceptConstellation,
  'graph-bloom': GraphBloom,
  'candidate-orbit': CandidateOrbit,
  'transformer-tunnel': TransformerTunnel,
  'sentence-ribbon': SentenceRibbon,
  'hallucination-mirage': HallucinationMirage,
  'difference-magnifier': DifferenceMagnifier,
  'priority-orbit': PriorityOrbit,
  'automation-cells': AutomationCells,
  'transformation-portal': TransformationPortal,
  'broken-path-repair': BrokenPathRepair,
  'archive-spotlight': ArchiveSpotlight,
  'permission-city': PermissionCity,
  'load-balancing-city': LoadBalancingCity,
  'token-cost-conveyor': TokenCostConveyor,
  'version-evolution-tree': VersionEvolutionTree,
  'feedback-sculpting': FeedbackSculpting,
  'if-then-gates': IfThenGates,
  'memory-carousel': MemoryCarousel,
  'belief-ledger': BeliefLedger,
};

export const ExperimentalVariantPrototype: React.FC<{
  recipe: ExperimentalAnimationRecipe;
}> = ({recipe}) => {
  const frame = useCurrentFrame();
  const Renderer = mechanismRenderers[recipe.mechanism];
  return (
    <PrototypeShell
      family={`${recipe.family} · experimental`}
      title={recipe.title}
      subtitle={recipe.subtitle}
    >
      <Renderer frame={frame} />
    </PrototypeShell>
  );
};

export const createExperimentalVariantComponent = (
  recipe: ExperimentalAnimationRecipe,
): React.FC => {
  const Component: React.FC = () => <ExperimentalVariantPrototype recipe={recipe} />;
  Component.displayName = `Experimental_${recipe.mechanism}`;
  return Component;
};
