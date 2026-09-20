import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {AdvancedAnimationRecipe, AdvancedMechanism} from '../advancedRecipes';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';
import {staggerDelay, type MotionEasingName} from '../../motion/easing';

const C = PROTOTYPE_PALETTE;
const p = (
  frame: number,
  start: number,
  end: number,
  easing: MotionEasingName = 'enter',
): number => prototypeProgress(frame, start, end, easing);
const clamp = (value: number): number => Math.max(0, Math.min(1, value));
const wave = (frame: number, speed = 12): number => (Math.sin(frame / speed) + 1) / 2;

const Stage: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => (
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

const Badge: React.FC<{
  children: React.ReactNode;
  accent?: boolean;
  danger?: boolean;
  style?: React.CSSProperties;
}> = ({children, accent, danger, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
      minHeight: 56,
      padding: '8px 18px',
      borderRadius: 18,
      background: danger ? C.danger : accent ? C.accent : C.white,
      color: danger || accent ? C.white : C.foreground,
      border: `2px solid ${danger ? C.danger : accent ? C.accent : C.line}`,
      boxShadow: '0 14px 34px rgba(45,28,75,.12)',
      fontSize: 24,
      fontWeight: 900,
      ...style,
    }}
  >
    {children}
  </div>
);

const CharacterMosaic: React.FC<{frame: number}> = ({frame}) => {
  // Versatz, kein Abgang: die Kacheln ruecken zusammen und bleiben sichtbar.
  const collapse = p(frame, 58, 148, 'move');
  const letters = 'NEURONALESNETZWERK'.split('');
  return (
    <Stage label="BUCHSTABEN → LESBARES MUSTER → TOKEN-GRUPPEN">
      <div style={{position: 'absolute', left: 110, right: 110, top: 190, height: 620}}>
        {letters.map((letter, index) => {
          const col = index % 5;
          const row = Math.floor(index / 5);
          const startX = 175 + col * 145;
          const startY = 190 + row * 135;
          const group = index < 6 ? 0 : index < 12 ? 1 : 2;
          const targetX = 240 + group * 225;
          const targetY = 720;
          return (
            <div
              key={`${letter}-${index}`}
              style={{
                position: 'absolute',
                left: interpolate(collapse, [0, 1], [startX, targetX + (index % 3) * 38]),
                top: interpolate(collapse, [0, 1], [startY, targetY + (index % 2) * 42]),
                width: interpolate(collapse, [0, 1], [88, 54]),
                height: interpolate(collapse, [0, 1], [88, 54]),
                transform: `translate(-50%,-50%) rotate(${(index % 4 - 1.5) * collapse * 6}deg)`,
                borderRadius: interpolate(collapse, [0, 1], [10, 17]),
                background: group === 0 ? C.accent : group === 1 ? C.accentSoft : C.success,
                color: C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: interpolate(collapse, [0, 1], [42, 25]),
                fontWeight: 900,
                boxShadow: '0 12px 30px rgba(45,28,75,.12)',
                opacity: p(frame, index * 2, 20 + index * 2),
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>
      {['NEURON', 'ALES', 'NETZWERK'].map((label, index) => (
        <div
          key={label}
          style={{
            position: 'absolute',
            left: 240 + index * 225,
            top: 870,
            transform: 'translateX(-50%)',
            color: index === 2 ? C.success : C.accent,
            fontSize: 21,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: collapse,
          }}
        >
          {label}
        </div>
      ))}
    </Stage>
  );
};

const BinaryWeave: React.FC<{frame: number}> = ({frame}) => {
  const weave = p(frame, 8, 150);
  return (
    <Stage label="MEHRERE DATENSTRÄNGE WERDEN ZU EINER KODIERTEN FLÄCHE">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 7}, (_, index) => {
          const y = 250 + index * 105;
          return (
            <path
              key={`h-${index}`}
              d={`M80 ${y} C280 ${y - 60}, 620 ${y + 60}, 850 ${y}`}
              fill="none"
              stroke={index % 2 ? C.accentSoft : C.accent}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - weave)}
              opacity={0.65 + index * 0.04}
            />
          );
        })}
        {Array.from({length: 6}, (_, index) => {
          const x = 190 + index * 115;
          return (
            <path
              key={`v-${index}`}
              d={`M${x} 160 C${x + 55} 360, ${x - 55} 710, ${x} 920`}
              fill="none"
              stroke={index % 2 ? C.success : C.warning}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 * (1 - weave)}
              opacity={weave * 0.72}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 466,
          bottom: 80,
          transform: `translateX(-50%) scale(${0.78 + weave * 0.22})`,
          opacity: weave,
        }}
      >
        <Badge accent>KODIERTE STRUKTUR</Badge>
      </div>
    </Stage>
  );
};

const SemanticLens: React.FC<{frame: number}> = ({frame}) => {
  const scan = p(frame, 5, 150);
  const lensX = interpolate(scan, [0, 1], [170, 750]);
  const words = [
    {label: 'Hund', x: 210, y: 350},
    {label: 'Katze', x: 340, y: 470},
    {label: 'Tier', x: 230, y: 620},
    {label: 'Auto', x: 680, y: 330},
    {label: 'Zug', x: 760, y: 520},
    {label: 'Fahrt', x: 650, y: 700},
    {label: 'lernen', x: 450, y: 820},
  ];
  return (
    <Stage label="DIE LINSE ZEIGT LOKALE BEDEUTUNGSNACHBARSCHAFTEN">
      {words.map((word, index) => {
        const distance = Math.abs(word.x - lensX);
        const focused = clamp(1 - distance / 190);
        return (
          <Badge
            key={word.label}
            accent={focused > 0.58}
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y,
              transform: `translate(-50%,-50%) scale(${0.84 + focused * 0.24})`,
              opacity: 0.28 + focused * 0.72,
              filter: `blur(${(1 - focused) * 2.4}px)`,
            }}
          >
            {word.label}
          </Badge>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: lensX,
          top: 550,
          width: 300,
          height: 430,
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          border: `12px solid ${C.foreground}`,
          boxShadow: '0 24px 70px rgba(20,18,26,.22), inset 0 0 45px rgba(135,87,232,.16)',
          pointerEvents: 'none',
        }}
      />
    </Stage>
  );
};

const RelevancePulse: React.FC<{frame: number}> = ({frame}) => {
  const nodes = [
    {x: 170, y: 290, strength: 0.35},
    {x: 400, y: 220, strength: 0.82},
    {x: 740, y: 320, strength: 0.52},
    {x: 210, y: 720, strength: 0.61},
    {x: 500, y: 580, strength: 1},
    {x: 770, y: 760, strength: 0.44},
  ];
  const cycle = p(frame, 0, 150);
  return (
    <Stage label="SIGNAL HIN · RELEVANZSTÄRKE ZURÜCK">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {nodes.filter((_, index) => index !== 4).map((node, index) => {
          const dashOffset = -frame * (1 + node.strength * 2);
          return (
            <line
              key={index}
              x1="500"
              y1="580"
              x2={node.x}
              y2={node.y}
              stroke={node.strength > 0.7 ? C.accent : C.accentSoft}
              strokeWidth={5 + node.strength * 10}
              strokeDasharray="18 14"
              strokeDashoffset={dashOffset}
              opacity={0.25 + node.strength * 0.6}
            />
          );
        })}
      </svg>
      {nodes.map((node, index) => {
        const returnPulse = clamp(1 - Math.abs(cycle * 6 - index) / 1.1);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: 62 + node.strength * 52,
              height: 62 + node.strength * 52,
              borderRadius: 999,
              transform: `translate(-50%,-50%) scale(${1 + returnPulse * 0.3})`,
              background: index === 4 ? C.foreground : node.strength > 0.7 ? C.accent : C.accentSoft,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 18,
              fontWeight: 900,
              boxShadow: `0 0 ${20 + returnPulse * 40}px rgba(135,87,232,.4)`,
            }}
          >
            {index === 4 ? 'QUERY' : Math.round(node.strength * 100)}
          </div>
        );
      })}
    </Stage>
  );
};

const ConfidenceWeather: React.FC<{frame: number}> = ({frame}) => {
  const settle = p(frame, 20, 150, 'move');
  const zones = [
    {x: 250, y: 500, radius: 185, color: C.accent, label: 'Text'},
    {x: 615, y: 390, radius: 145, color: C.success, label: 'Daten'},
    {x: 625, y: 735, radius: 120, color: C.warning, label: 'Wörter'},
  ];
  return (
    <Stage label="WAHRSCHEINLICHKEITSFELDER WACHSEN UND VERDRÄNGEN SICH">
      {zones.map((zone, index) => {
        const winner = index === 0;
        const radius = zone.radius * (winner ? 0.75 + settle * 0.55 : 1 - settle * 0.35);
        return (
          <div
            key={zone.label}
            style={{
              position: 'absolute',
              left: zone.x,
              top: zone.y,
              width: radius * 2,
              height: radius * 1.45,
              borderRadius: '50%',
              transform: `translate(-50%,-50%) rotate(${index * 14 - 10}deg)`,
              background: `radial-gradient(circle,${zone.color}55 0%,${zone.color}18 58%,transparent 72%)`,
              border: `3px solid ${zone.color}55`,
              filter: `blur(${winner ? 0 : settle * 1.6}px)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: winner ? 31 : 24,
                fontWeight: 900,
                color: zone.color,
              }}
            >
              {zone.label}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 835,
          transform: 'translateX(-50%)',
          opacity: settle,
        }}
      >
        <Badge accent>STABILE REGION</Badge>
      </div>
    </Stage>
  );
};

const ExpertSwitchboard: React.FC<{frame: number}> = ({frame}) => {
  const route = p(frame, 10, 145);
  const experts = [
    {label: 'CODE', x: 180, y: 300, color: C.accent},
    {label: 'SPRACHE', x: 750, y: 300, color: C.success},
    {label: 'LOGIK', x: 180, y: 780, color: C.warning},
    {label: 'WISSEN', x: 750, y: 780, color: C.accentSoft},
  ];
  return (
    <Stage label="INPUT TEILEN · SPEZIALISTEN ROUTEN · BEITRÄGE KOMBINIEREN">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {experts.map((expert, index) => (
          <path
            key={expert.label}
            d={`M466 550 Q${466 + (expert.x - 466) * 0.42} ${550 + (expert.y - 550) * 0.1} ${expert.x} ${expert.y}`}
            fill="none"
            stroke={expert.color}
            strokeWidth="10"
            strokeDasharray="850"
            strokeDashoffset={850 * (1 - route)}
            opacity={0.6}
          />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 550,
          width: 190,
          height: 190,
          borderRadius: 40,
          transform: `translate(-50%,-50%) rotate(${route * 90}deg)`,
          background: C.foreground,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 25,
          fontWeight: 900,
          zIndex: 5,
        }}
      >
        ROUTER
      </div>
      {experts.map((expert, index) => (
        <div
          key={expert.label}
          style={{
            position: 'absolute',
            left: expert.x,
            top: expert.y,
            width: 180,
            height: 145,
            borderRadius: 28,
            transform: `translate(-50%,-50%) scale(${0.75 + p(frame, 28 + staggerDelay(index, 12), 58 + staggerDelay(index, 12)) * 0.25})`,
            background: `${expert.color}18`,
            border: `4px solid ${expert.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 23,
            fontWeight: 900,
          }}
        >
          {expert.label}
        </div>
      ))}
      <div style={{position: 'absolute', left: 466, bottom: 60, transform: 'translateX(-50%)', opacity: p(frame, 130, 170)}}>
        <Badge accent>KOMBINIERTES ERGEBNIS</Badge>
      </div>
    </Stage>
  );
};

const TypeOrchestra: React.FC<{frame: number}> = ({frame}) => {
  const cue = p(frame, 48, 132);
  const groups = [
    {label: 'Text', angle: -125, score: 0.82, color: C.accent},
    {label: 'Daten', angle: -72, score: 0.48, color: C.success},
    {label: 'Wort', angle: -20, score: 0.31, color: C.warning},
    {label: 'Satz', angle: 32, score: 0.21, color: C.accentSoft},
  ];
  return (
    <Stage label="NUR DIE STÄRKSTE KANDIDATENGRUPPE SPIELT IHR WORT">
      {groups.map((group, index) => {
        const angle = (group.angle * Math.PI) / 180;
        const x = 466 + Math.cos(angle) * 345;
        const y = 700 + Math.sin(angle) * 310;
        const active = index === 0 ? cue : cue * 0.22;
        return (
          <div
            key={group.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 190,
              height: 165,
              borderRadius: '50% 50% 28px 28px',
              transform: `translate(-50%,-50%) scale(${0.88 + active * 0.2})`,
              background: `${group.color}18`,
              border: `4px solid ${group.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: active > 0.4 ? `0 0 42px ${group.color}66` : 'none',
            }}
          >
            <div style={{fontSize: 28, fontWeight: 900}}>{group.label}</div>
            <div style={{fontFamily: 'monospace', marginTop: 10, color: group.color, fontSize: 22, fontWeight: 900}}>{Math.round(group.score * 100)}%</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 800,
          width: 94,
          height: 270,
          transform: `translate(-50%,-50%) rotate(${interpolate(cue, [0, 1], [-18, -120])}deg)`,
          transformOrigin: '50% 90%',
          borderRadius: 999,
          background: C.foreground,
        }}
      />
      <div style={{position: 'absolute', left: 466, top: 240, transform: `translateX(-50%) scale(${0.7 + cue * 0.3})`, opacity: cue}}>
        <Badge accent>TEXT</Badge>
      </div>
    </Stage>
  );
};

const SourceCheckpoints: React.FC<{frame: number}> = ({frame}) => {
  const travel = p(frame, 8, 160, 'move');
  const gates = [
    {label: 'QUELLE', x: 250, pass: true},
    {label: 'DATUM', x: 470, pass: true},
    {label: 'EVIDENZ', x: 690, pass: false},
  ];
  return (
    <Stage label="UNTERSTÜTZTE BEHAUPTUNGEN PASSIEREN · ANDERE WERDEN UMGELENKT">
      <div style={{position: 'absolute', left: 90, right: 90, top: 570, height: 30, borderRadius: 999, background: C.line}} />
      {gates.map((gate, index) => {
        const reached = p(frame, 34 + staggerDelay(index, 38), 56 + staggerDelay(index, 38));
        return (
          <div
            key={gate.label}
            style={{
              position: 'absolute',
              left: gate.x,
              top: 500,
              width: 150,
              height: 230,
              borderRadius: 30,
              transform: 'translate(-50%,-50%)',
              background: 'rgba(255,255,255,.9)',
              border: `5px solid ${reached > 0.7 ? (gate.pass ? C.success : C.danger) : C.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            {gate.label}<br />{reached > 0.7 ? (gate.pass ? '✓' : '✕') : '…'}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: interpolate(travel, [0, 1], [100, 810]),
          top: travel > 0.72 ? interpolate(travel, [0.72, 1], [570, 850]) : 570,
          width: 92,
          height: 72,
          borderRadius: 20,
          transform: 'translate(-50%,-50%)',
          background: travel > 0.72 ? C.danger : C.foreground,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        CLAIM
      </div>
    </Stage>
  );
};

const TradeoffLandscape: React.FC<{frame: number}> = ({frame}) => {
  const adjust = p(frame, 18, 150);
  const tilt = interpolate(adjust, [0, 1], [-7, 9]);
  return (
    <Stage label="KEINE OPTION GEWINNT JEDE METRIK">
      <div
        style={{
          position: 'absolute',
          left: 466,
          top: 570,
          width: 690,
          height: 38,
          borderRadius: 999,
          background: C.foreground,
          transform: `translate(-50%,-50%) rotate(${tilt}deg)`,
          transformOrigin: '50% 50%',
          boxShadow: '0 20px 50px rgba(20,18,26,.18)',
        }}
      >
        {[0, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: side === 0 ? 95 : 595,
              top: -215,
              width: 230,
              height: 190,
              borderRadius: 32,
              background: side === 0 ? 'rgba(135,87,232,.12)' : 'rgba(53,197,138,.12)',
              border: `4px solid ${side === 0 ? C.accent : C.success}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            OPTION {side === 0 ? 'A' : 'B'}
            <span style={{fontSize: 19, color: C.muted, marginTop: 14}}>{side === 0 ? 'schneller' : 'günstiger'}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 466, top: 590, width: 42, height: 270, transform: 'translateX(-50%)', background: C.foreground, clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)'}} />
      {['TEMPO', 'KOSTEN', 'QUALITÄT'].map((metric, index) => (
        <div
          key={metric}
          style={{
            position: 'absolute',
            left: 220 + index * 250,
            bottom: 130,
            opacity: p(frame, 30 + staggerDelay(index, 22), 55 + staggerDelay(index, 22)),
          }}
        >
          <Badge accent={index === 2}>{metric}</Badge>
        </div>
      ))}
    </Stage>
  );
};

const RankingLadder: React.FC<{frame: number}> = ({frame}) => {
  const candidates = [
    {label: 'A', base: 0.72, color: C.accent},
    {label: 'B', base: 0.48, color: C.success},
    {label: 'C', base: 0.32, color: C.warning},
  ];
  return (
    <Stage label="KRITERIEN VERÄNDERN POSITIONEN SICHTBAR">
      <div style={{position: 'absolute', left: 330, right: 330, top: 170, bottom: 120, borderLeft: `12px solid ${C.foreground}`, borderRight: `12px solid ${C.foreground}`}}>
        {Array.from({length: 8}, (_, index) => (
          <div key={index} style={{position: 'absolute', left: 0, right: 0, bottom: index * 100, height: 12, background: C.foreground}} />
        ))}
      </div>
      {candidates.map((candidate, index) => {
        const shift = Math.sin((frame + index * 35) / 24) * 0.08;
        const height = clamp(candidate.base + shift + p(frame, 100, 155) * (index === 1 ? 0.22 : index === 0 ? -0.08 : 0.02));
        return (
          <div
            key={candidate.label}
            style={{
              position: 'absolute',
              left: 410 + index * 62,
              bottom: 140 + height * 700,
              width: 72,
              height: 72,
              borderRadius: 999,
              transform: 'translate(-50%,50%)',
              background: candidate.color,
              color: C.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              boxShadow: `0 0 28px ${candidate.color}66`,
            }}
          >
            {candidate.label}
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 85, top: 250, display: 'flex', flexDirection: 'column', gap: 22}}>
        {['TEMPO', 'PREIS', 'QUALITÄT'].map((criterion, index) => (
          <Badge key={criterion} accent={index === 2 && frame > 100}>{criterion}</Badge>
        ))}
      </div>
    </Stage>
  );
};

const WorkflowDomino: React.FC<{frame: number}> = ({frame}) => {
  const trigger = p(frame, 8, 155);
  const steps = ['INPUT', 'PRÜFEN', 'VERARBEITEN', 'FREIGEBEN', 'OUTPUT'];
  return (
    <Stage label="ABHÄNGIGKEIT ERFÜLLT → NÄCHSTER SCHRITT STARTET">
      <div style={{position: 'absolute', left: 90, right: 90, top: 520, height: 430, perspective: 1000}}>
        {steps.map((step, index) => {
          const local = clamp(trigger * steps.length - index);
          return (
            <div
              key={step}
              style={{
                position: 'absolute',
                left: 80 + index * 165,
                top: 80 + Math.sin(index * 1.4) * 50,
                width: 85,
                height: 230,
                borderRadius: 18,
                transformOrigin: '50% 100%',
                transform: `rotateX(${local * 78}deg)`,
                background: index === steps.length - 1 ? C.success : index % 2 ? C.accentSoft : C.accent,
                color: C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                writingMode: 'vertical-rl',
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 2,
                boxShadow: '0 18px 40px rgba(45,28,75,.15)',
              }}
            >
              {step}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const CauseEffectBridge: React.FC<{frame: number}> = ({frame}) => {
  const build = p(frame, 14, 132);
  const cross = p(frame, 120, 170);
  return (
    <Stage label="JEDE BRÜCKE = EIN TRANSFORMATIONSSCHRITT">
      <div style={{position: 'absolute', left: 65, top: 680, width: 250, height: 280, background: 'linear-gradient(150deg,#463B58,#201B2A)', clipPath: 'polygon(0 0,100% 14%,100% 100%,0 100%)'}} />
      <div style={{position: 'absolute', right: 65, top: 550, width: 250, height: 410, background: 'linear-gradient(210deg,#3B6A58,#19352C)', clipPath: 'polygon(0 14%,100% 0,100% 100%,0 100%)'}} />
      {Array.from({length: 6}, (_, index) => {
        const local = p(frame, 18 + staggerDelay(index, 15), 42 + staggerDelay(index, 15));
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 286 + index * 73,
              top: 665 - index * 18,
              width: 82,
              height: 28,
              borderRadius: 8,
              transform: `rotate(${-14}deg) scaleX(${local})`,
              transformOrigin: 'left center',
              background: index % 2 ? C.accentSoft : C.accent,
              boxShadow: '0 10px 26px rgba(45,28,75,.18)',
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: interpolate(cross, [0, 1], [185, 790]),
          top: interpolate(cross, [0, 1], [650, 500]),
          transform: 'translate(-50%,-50%)',
        }}
      >
        <Badge accent={cross > 0.7}>{cross > 0.7 ? 'OUTPUT' : 'INPUT'}</Badge>
      </div>
    </Stage>
  );
};

const RedFlagCascade: React.FC<{frame: number}> = ({frame}) => {
  const cascade = p(frame, 10, 112);
  const isolate = p(frame, 110, 164);
  return (
    <Stage label="EIN ROOT-FEHLER LÖST DIE GESAMTE WARNKETTE AUS">
      {Array.from({length: 5}, (_, level) => {
        const count = level + 1;
        return Array.from({length: count}, (_, item) => {
          const x = 466 - (count - 1) * 78 + item * 156;
          const y = 220 + level * 145;
          const local = p(frame, 12 + level * 15, 34 + level * 15);
          return (
            <div
              key={`${level}-${item}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 88,
                height: 70,
                transform: `translate(-50%,-50%) scale(${0.7 + local * 0.3})`,
                opacity: local * (level === 0 ? 1 : 1 - isolate * 0.85),
                borderRadius: 16,
                background: level === 0 ? C.danger : C.warning,
                color: C.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                fontWeight: 900,
                boxShadow: '0 14px 34px rgba(255,93,108,.2)',
              }}
            >
              !
            </div>
          );
        });
      })}
      <div style={{position: 'absolute', left: 466, top: 115, transform: `translateX(-50%) scale(${0.8 + isolate * 0.2})`, opacity: isolate}}>
        <Badge danger>ROOT CAUSE</Badge>
      </div>
    </Stage>
  );
};

const QueryRadar: React.FC<{frame: number}> = ({frame}) => {
  const sweepAngle = frame * 3.4;
  const select = p(frame, 105, 165);
  const sources = [
    {x: 280, y: 330, strength: 0.44},
    {x: 670, y: 300, strength: 0.88},
    {x: 750, y: 660, strength: 0.63},
    {x: 310, y: 760, strength: 0.76},
  ];
  return (
    <Stage label="STARKE QUELLEN-ECHOS WERDEN IN DEN EVIDENZRING GEHOLT">
      {[150, 270, 390].map((radius) => (
        <div key={radius} style={{position: 'absolute', left: 466, top: 555, width: radius * 2, height: radius * 2, borderRadius: 999, transform: 'translate(-50%,-50%)', border: '2px solid rgba(135,87,232,.16)'}} />
      ))}
      <div style={{position: 'absolute', left: 466, top: 555, width: 390, height: 8, transformOrigin: '0 50%', transform: `rotate(${sweepAngle}deg)`, background: `linear-gradient(90deg,${C.accent},transparent)`, boxShadow: '0 0 25px rgba(135,87,232,.45)'}} />
      {sources.map((source, index) => {
        const chosen = source.strength > 0.7;
        const targetAngle = index * Math.PI;
        const x = interpolate(select, [0, 1], [source.x, chosen ? 466 + Math.cos(targetAngle) * 165 : source.x]);
        const y = interpolate(select, [0, 1], [source.y, chosen ? 555 + Math.sin(targetAngle) * 165 : source.y]);
        return (
          <div key={index} style={{position: 'absolute', left: x, top: y, width: 42 + source.strength * 38, height: 42 + source.strength * 38, borderRadius: 999, transform: 'translate(-50%,-50%)', background: chosen ? C.success : C.accentSoft, opacity: chosen ? 1 : 1 - select * 0.7, boxShadow: `0 0 ${20 + source.strength * 25}px rgba(135,87,232,.4)`}} />
        );
      })}
      <div style={{position: 'absolute', left: 466, top: 555, width: 120, height: 120, borderRadius: 999, transform: 'translate(-50%,-50%)', background: C.foreground, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900}}>QUERY</div>
    </Stage>
  );
};

const DataLeakContainment: React.FC<{frame: number}> = ({frame}) => {
  const leak = p(frame, 12, 78);
  const contain = p(frame, 82, 158);
  return (
    <Stage label="LECK ERKENNEN · BARRIERE SCHLIESSEN · GESCHÜTZTEN ZUSTAND WIEDERHERSTELLEN">
      <div style={{position: 'absolute', left: 466, top: 520, width: 560, height: 430, borderRadius: 70, transform: 'translate(-50%,-50%)', border: `12px solid ${contain > 0.7 ? C.success : C.accent}`, background: 'rgba(135,87,232,.06)', overflow: 'visible'}}>
        {Array.from({length: 12}, (_, index) => (
          <div key={index} style={{position: 'absolute', left: 70 + index % 4 * 125, top: 70 + Math.floor(index / 4) * 110, width: 42, height: 42, borderRadius: 12, background: index % 3 ? C.accentSoft : C.accent}} />
        ))}
        <div style={{position: 'absolute', right: -20, top: 150, width: 46, height: 120, background: contain > 0.5 ? C.success : C.danger, clipPath: contain > 0.5 ? 'none' : 'polygon(0 0,100% 15%,72% 40%,100% 62%,48% 100%,0 70%)'}} />
      </div>
      {Array.from({length: 8}, (_, index) => (
        <div key={index} style={{position: 'absolute', left: 760 + leak * (70 + index * 12) - contain * (50 + index * 9), top: 500 + Math.sin(index * 1.7) * 130, width: 24, height: 24, borderRadius: 8, background: C.danger, opacity: leak * (1 - contain)}} />
      ))}
      <div style={{position: 'absolute', left: 466, bottom: 110, transform: 'translateX(-50%)', opacity: contain}}><Badge accent={contain > 0.7}>{contain > 0.7 ? 'LECK GESCHLOSSEN' : 'BARRIERE AKTIV'}</Badge></div>
    </Stage>
  );
};

const ThroughputPipes: React.FC<{frame: number}> = ({frame}) => {
  const parallel = p(frame, 88, 158);
  return (
    <Stage label="ENGPASS ÖFFNEN · PARALLELE KANÄLE ERHÖHEN DEN DURCHSATZ">
      {[0, 1, 2].map((pipe, index) => {
        const y = 350 + index * 230;
        const active = index === 1 || parallel > 0.45;
        return (
          <div key={pipe} style={{position: 'absolute', left: 90, right: 90, top: y, height: index === 1 ? 84 : 62, borderRadius: 999, background: active ? C.foreground : C.line, overflow: 'hidden', opacity: active ? 1 : 0.25}}>
            {Array.from({length: 7}, (_, packet) => (
              <div key={packet} style={{position: 'absolute', left: ((frame * (2.4 + index * 0.4) + packet * 150) % 980) - 80, top: '50%', width: 58, height: 34, borderRadius: 12, transform: 'translateY(-50%)', background: index === 1 ? C.warning : C.success, boxShadow: '0 0 20px rgba(53,197,138,.3)'}} />
            ))}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 466, top: 980, transform: 'translateX(-50%)', opacity: parallel}}><Badge accent>3 KANÄLE · STAU GELÖST</Badge></div>
    </Stage>
  );
};

const ValueSeesaw: React.FC<{frame: number}> = ({frame}) => {
  const optimize = p(frame, 20, 150);
  const angle = interpolate(optimize, [0, 1], [-13, 1]);
  return (
    <Stage label="KOSTEN UND QUALITÄT FINDEN EINEN SINNVOLLEN WERTPUNKT">
      <div style={{position: 'absolute', left: 466, top: 560, width: 680, height: 34, borderRadius: 999, background: C.foreground, transform: `translate(-50%,-50%) rotate(${angle}deg)`, boxShadow: '0 20px 50px rgba(20,18,26,.18)'}}>
        <div style={{position: 'absolute', left: 70, top: -210, width: 240, height: 180, borderRadius: 34, background: 'rgba(255,182,72,.14)', border: `4px solid ${C.warning}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 900}}>KOSTEN<div style={{fontFamily: 'monospace', marginTop: 16, color: C.warning}}>{Math.round(interpolate(optimize, [0, 1], [100, 62]))}</div></div>
        <div style={{position: 'absolute', right: 70, top: -210, width: 240, height: 180, borderRadius: 34, background: 'rgba(53,197,138,.14)', border: `4px solid ${C.success}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 900}}>QUALITÄT<div style={{fontFamily: 'monospace', marginTop: 16, color: C.success}}>{Math.round(interpolate(optimize, [0, 1], [67, 91]))}</div></div>
      </div>
      <div style={{position: 'absolute', left: 466, top: 580, width: 44, height: 290, transform: 'translateX(-50%)', background: C.foreground, clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)'}} />
      <div style={{position: 'absolute', left: 466, bottom: 105, transform: 'translateX(-50%)', opacity: optimize}}><Badge accent>VALUE ZONE</Badge></div>
    </Stage>
  );
};

const BeforeAfterClock: React.FC<{frame: number}> = ({frame}) => {
  const sweep = p(frame, 8, 160);
  const angle = interpolate(sweep, [0, 1], [-135, 135]);
  return (
    <Stage label="DER ZEIGER VERBINDET VORHER UND NACHHER KONTINUIERLICH">
      <div style={{position: 'absolute', left: 466, top: 555, width: 650, height: 650, borderRadius: 999, transform: 'translate(-50%,-50%)', background: `conic-gradient(from -135deg, ${C.accent} 0deg, ${C.accentSoft} ${sweep * 270}deg, ${C.success} ${sweep * 270}deg, ${C.success} 270deg, ${C.line} 270deg)`, border: '14px solid white', boxShadow: '0 24px 70px rgba(45,28,75,.18)'}}>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 260, height: 260, borderRadius: 999, transform: 'translate(-50%,-50%)', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, textAlign: 'center'}}>{sweep < 0.5 ? 'VORHER' : 'NACHHER'}</div>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 260, height: 18, borderRadius: 999, background: C.foreground, transformOrigin: '0 50%', transform: `rotate(${angle}deg)`, boxShadow: '0 0 22px rgba(20,18,26,.25)'}} />
      </div>
      <div style={{position: 'absolute', left: 160, top: 910}}><Badge>ALT</Badge></div>
      <div style={{position: 'absolute', right: 160, top: 910}}><Badge accent>NEU</Badge></div>
    </Stage>
  );
};

const MultiAgentRoundtable: React.FC<{frame: number}> = ({frame}) => {
  const combine = p(frame, 105, 168);
  const agents = [
    {label: 'RECHERCHE', angle: -135, color: C.accent},
    {label: 'LOGIK', angle: -45, color: C.success},
    {label: 'SCHREIBEN', angle: 45, color: C.warning},
    {label: 'PRÜFEN', angle: 135, color: C.danger},
  ];
  return (
    <Stage label="SPEZIALISTEN LIEFERN BEITRÄGE · KOORDINATOR LÖST KONFLIKTE">
      <div style={{position: 'absolute', left: 466, top: 555, width: 420, height: 420, borderRadius: 999, transform: 'translate(-50%,-50%)', background: 'rgba(135,87,232,.06)', border: `8px solid ${C.foreground}`}} />
      {agents.map((agent, index) => {
        const angle = (agent.angle * Math.PI) / 180;
        const x = 466 + Math.cos(angle) * 340;
        const y = 555 + Math.sin(angle) * 340;
        const inwardX = 466 + Math.cos(angle) * 150;
        const inwardY = 555 + Math.sin(angle) * 150;
        return (
          <React.Fragment key={agent.label}>
            <div style={{position: 'absolute', left: x, top: y, width: 170, height: 115, borderRadius: 28, transform: 'translate(-50%,-50%)', background: `${agent.color}18`, border: `4px solid ${agent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 20, fontWeight: 900}}>{agent.label}</div>
            <div style={{position: 'absolute', left: interpolate(combine, [0, 1], [x, inwardX]), top: interpolate(combine, [0, 1], [y, inwardY]), width: 82, height: 60, borderRadius: 16, transform: 'translate(-50%,-50%)', background: agent.color, opacity: p(frame, 20 + staggerDelay(index, 12), 45 + staggerDelay(index, 12)) * (1 - combine * 0.2)}} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 466, top: 555, width: 160, height: 160, borderRadius: 999, transform: `translate(-50%,-50%) scale(${0.78 + combine * 0.3})`, background: C.foreground, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 22, fontWeight: 900, zIndex: 5}}>KOORDINATOR</div>
    </Stage>
  );
};

const EvidenceJury: React.FC<{frame: number}> = ({frame}) => {
  const verdict = p(frame, 106, 166);
  const evidence = [
    {label: 'QUELLE A', weight: 0.82, angle: -135},
    {label: 'QUELLE B', weight: 0.61, angle: -45},
    {label: 'DATUM', weight: 0.9, angle: 45},
    {label: 'GEGENBELEG', weight: 0.34, angle: 135},
  ];
  return (
    <Stage label="GLAUBWÜRDIGKEIT DER BELEGE KIPPT DIE ENTSCHEIDUNG">
      {evidence.map((item, index) => {
        const angle = (item.angle * Math.PI) / 180;
        const x = 466 + Math.cos(angle) * 330;
        const y = 545 + Math.sin(angle) * 300;
        return (
          <div key={item.label} style={{position: 'absolute', left: x, top: y, width: 180, height: 140, borderRadius: 30, transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,.92)', border: `4px solid ${item.weight > 0.7 ? C.success : item.weight < 0.4 ? C.danger : C.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900}}>
            {item.label}
            <div style={{fontFamily: 'monospace', marginTop: 12, color: item.weight > 0.7 ? C.success : C.muted}}>{Math.round(item.weight * 100)}%</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 466, top: 545, width: 230, height: 230, borderRadius: 999, transform: `translate(-50%,-50%) scale(${0.74 + verdict * 0.32})`, background: verdict > 0.5 ? C.success : C.foreground, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 28, fontWeight: 900, boxShadow: '0 24px 70px rgba(20,18,26,.2)'}}>{verdict > 0.5 ? 'ENTSCHEIDUNG' : 'BERATUNG'}</div>
    </Stage>
  );
};

const ContextElevator: React.FC<{frame: number}> = ({frame}) => {
  const compress = p(frame, 100, 165, 'move');
  const messages = ['Frage', 'Antwort', 'Quelle', 'Notiz', 'Korrektur'];
  return (
    <Stage label="KAPAZITÄT ERREICHT · MEHRERE EBENEN WERDEN ZUSAMMENGEFASST">
      <div style={{position: 'absolute', left: 250, right: 250, top: 150, bottom: 100, border: `8px solid ${C.foreground}`, borderRadius: 34, overflow: 'hidden'}}>
        {messages.map((message, index) => {
          const visible = p(frame, 12 + staggerDelay(index, 18), 38 + staggerDelay(index, 18));
          const y = interpolate(compress, [0, 1], [770 - index * 135, index < 3 ? 680 : 770 - index * 135]);
          const hidden = compress * (index < 3 ? 1 : 0);
          return (
            <div key={message} style={{position: 'absolute', left: 35, right: 35, top: y, height: 105, borderRadius: 24, transform: `scaleY(${1 - hidden * 0.72})`, opacity: visible * (1 - hidden * 0.7), background: index % 2 ? C.accentSoft : C.accent, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900}}>{message}</div>
          );
        })}
        <div style={{position: 'absolute', left: 35, right: 35, top: 560, height: 160, borderRadius: 28, background: C.success, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 24, fontWeight: 900, opacity: compress, transform: `scale(${0.72 + compress * 0.28})`}}>ZUSAMMENFASSUNG<br />3 EBENEN → 1 BLOCK</div>
      </div>
    </Stage>
  );
};

const FeedbackWeightTuning: React.FC<{frame: number}> = ({frame}) => {
  const tune = p(frame, 20, 150);
  const weights = [
    {label: 'SEMANTIK', from: 45, to: 54, color: C.accent},
    {label: 'NEUHEIT', from: 24, to: 30, color: C.success},
    {label: 'SICHERHEIT', from: 10, to: 16, color: C.warning},
    {label: 'ÜBERGANG', from: 21, to: 0, color: C.muted},
  ];
  return (
    <Stage label="FEEDBACK VERSCHIEBT GEWICHTE UND ORDNET KANDIDATEN NEU">
      <div style={{position: 'absolute', left: 95, right: 95, top: 180, bottom: 160, display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 42}}>
        <div>
          {weights.map((weight, index) => {
            const value = interpolate(tune, [0, 1], [weight.from, weight.to]);
            return (
              <div key={weight.label} style={{marginTop: index === 0 ? 20 : 56}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 900}}><span>{weight.label}</span><span style={{fontFamily: 'monospace', color: weight.color}}>{Math.round(value)}%</span></div>
                <div style={{height: 24, borderRadius: 999, background: C.line, marginTop: 14, overflow: 'hidden'}}><div style={{height: '100%', width: `${value}%`, background: weight.color, borderRadius: 999}} /></div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'relative'}}>
          {['Animation A', 'Animation B', 'NEUER BUILD'].map((candidate, index) => {
            const orderShift = tune * (index === 2 ? -220 : index === 0 ? 110 : 60);
            return (
              <div key={candidate} style={{position: 'absolute', left: 0, right: 0, top: 80 + index * 220 + orderShift, height: 145, borderRadius: 30, background: index === 2 ? C.accent : C.white, color: index === 2 ? C.white : C.foreground, border: `4px solid ${index === 2 ? C.accent : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, boxShadow: '0 18px 42px rgba(45,28,75,.12)'}}>{candidate}</div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

const renderers: Record<AdvancedMechanism, React.FC<{frame: number}>> = {
  'character-mosaic': CharacterMosaic,
  'binary-weave': BinaryWeave,
  'semantic-lens': SemanticLens,
  'relevance-pulse': RelevancePulse,
  'confidence-weather': ConfidenceWeather,
  'expert-switchboard': ExpertSwitchboard,
  'type-orchestra': TypeOrchestra,
  'source-checkpoints': SourceCheckpoints,
  'tradeoff-seesaw-landscape': TradeoffLandscape,
  'ranking-ladder': RankingLadder,
  'workflow-domino': WorkflowDomino,
  'cause-effect-bridge': CauseEffectBridge,
  'red-flag-cascade': RedFlagCascade,
  'query-radar': QueryRadar,
  'data-leak-containment': DataLeakContainment,
  'throughput-pipes': ThroughputPipes,
  'value-seesaw': ValueSeesaw,
  'before-after-clock': BeforeAfterClock,
  'multi-agent-roundtable': MultiAgentRoundtable,
  'evidence-jury': EvidenceJury,
  'context-elevator': ContextElevator,
  'feedback-weight-tuning': FeedbackWeightTuning,
};

export const AdvancedVariantPrototype: React.FC<{
  recipe: AdvancedAnimationRecipe;
}> = ({recipe}) => {
  const frame = useCurrentFrame();
  const Renderer = renderers[recipe.mechanism];
  return (
    <PrototypeShell
      family={`${recipe.family} · advanced`}
      title={recipe.title}
      subtitle={recipe.subtitle}
    >
      <Renderer frame={frame} />
    </PrototypeShell>
  );
};

export const createAdvancedVariantComponent = (
  recipe: AdvancedAnimationRecipe,
): React.FC => {
  const Component: React.FC = () => <AdvancedVariantPrototype recipe={recipe} />;
  Component.displayName = `Advanced_${recipe.mechanism}`;
  return Component;
};
