import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {FinalAnimationRecipe, FinalMechanism} from '../finalRecipes';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const C = PROTOTYPE_PALETTE;
const prog = (frame: number, start: number, end: number): number =>
  prototypeProgress(frame, start, end);
const clamp = (value: number): number => Math.max(0, Math.min(1, value));

const Stage: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
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
        top: 24,
        left: 28,
        zIndex: 20,
        color: C.accent,
        fontFamily: 'monospace',
        fontWeight: 900,
        fontSize: 18,
        letterSpacing: 2,
      }}
    >
      {label}
    </div>
    {children}
  </GlassSurface>
);

const Chip: React.FC<{
  children: React.ReactNode;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'plain';
  style?: React.CSSProperties;
}> = ({children, tone = 'plain', style}) => {
  const fill = tone === 'accent'
    ? C.accent
    : tone === 'success'
      ? C.success
      : tone === 'warning'
        ? C.warning
        : tone === 'danger'
          ? C.danger
          : C.white;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 92,
        minHeight: 54,
        padding: '8px 18px',
        borderRadius: 18,
        background: fill,
        color: tone === 'plain' ? C.foreground : C.white,
        border: `2px solid ${tone === 'plain' ? C.line : fill}`,
        boxShadow: '0 14px 34px rgba(45,28,75,.12)',
        fontSize: 23,
        fontWeight: 900,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ContextualTokenRiver: React.FC<{frame: number}> = ({frame}) => {
  const split = prog(frame, 45, 118);
  const words = ['Das', 'Modell', 'liest', 'Kontext', 'anders'];
  return (
    <Stage label="NACHBARN VERÄNDERN DIE GRENZEN DER TOKENS">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path
          d="M50 610 C210 350 390 800 560 500 C690 290 790 630 900 430"
          fill="none"
          stroke={C.accentSoft}
          strokeWidth="120"
          strokeLinecap="round"
          opacity=".28"
        />
        <path
          d="M50 610 C210 350 390 800 560 500 C690 290 790 630 900 430"
          fill="none"
          stroke={C.accent}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="18 16"
          strokeDashoffset={-frame * 3}
        />
      </svg>
      {words.map((word, index) => {
        const travel = prog(frame, index * 8, 120 + index * 3);
        const x = interpolate(travel, [0, 1], [60, 820]);
        const baseY = 610 - Math.sin((x / 900) * Math.PI * 3 + index) * 150;
        const splitOffset = split * (index === 1 ? -75 : index === 2 ? 65 : 0);
        return (
          <Chip
            key={word}
            tone={index === 1 || index === 3 ? 'accent' : 'plain'}
            style={{
              position: 'absolute',
              left: x,
              top: baseY + splitOffset,
              transform: `translate(-50%,-50%) rotate(${Math.sin(index + travel * 3) * 7}deg)`,
              opacity: prog(frame, index * 6, 18 + index * 6),
            }}
          >
            {word}
          </Chip>
        );
      })}
      <div style={{position: 'absolute', left: 466, bottom: 80, transform: 'translateX(-50%)', opacity: split}}>
        <Chip tone="success">KONTEXT BESTIMMT GRUPPIERUNG</Chip>
      </div>
    </Stage>
  );
};

const RepresentationMorphCascade: React.FC<{frame: number}> = ({frame}) => {
  const stages = [
    {label: 'WORT', value: 'Apfel', x: 120},
    {label: 'SYMBOL', value: '●', x: 330},
    {label: 'KOORDINATE', value: '(2,7)', x: 560},
    {label: 'VEKTOR', value: '[.2,.7,.8]', x: 800},
  ];
  return (
    <Stage label="GLEICHES KONZEPT · ANDERE DARSTELLUNGSEBENE">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path d="M100 760 C300 690 420 540 560 430 C690 330 760 250 840 180" fill="none" stroke={C.line} strokeWidth="18" strokeLinecap="round" />
        <path d="M100 760 C300 690 420 540 560 430 C690 330 760 250 840 180" fill="none" stroke={C.accent} strokeWidth="8" strokeLinecap="round" strokeDasharray="1300" strokeDashoffset={1300 * (1 - prog(frame, 5, 155))} />
      </svg>
      {stages.map((stage, index) => {
        const reveal = prog(frame, 18 + index * 30, 42 + index * 30);
        const y = 800 - index * 190;
        return (
          <div key={stage.label} style={{position: 'absolute', left: stage.x, top: y, transform: `translate(-50%,-50%) scale(${0.68 + reveal * 0.32})`, opacity: reveal}}>
            <div style={{width: 150, height: 150, borderRadius: index === 1 ? 999 : 28, background: index % 2 ? C.success : C.accent, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: index >= 2 ? 'monospace' : 'Arial', fontSize: index === 3 ? 20 : 30, fontWeight: 900, boxShadow: '0 20px 50px rgba(45,28,75,.15)'}}>{stage.value}</div>
            <div style={{marginTop: 12, textAlign: 'center', fontSize: 18, fontWeight: 900, color: C.muted}}>{stage.label}</div>
          </div>
        );
      })}
    </Stage>
  );
};

const ConceptNeighborhoodElevator: React.FC<{frame: number}> = ({frame}) => {
  const rise = prog(frame, 5, 158);
  const floors = [
    {label: 'OBJEKT', words: ['Ding', 'Gegenstand']},
    {label: 'LEBENSMITTEL', words: ['Obst', 'Gemüse']},
    {label: 'OBST', words: ['Apfel', 'Birne']},
    {label: 'APFELSORTE', words: ['Gala', 'Elstar']},
  ];
  return (
    <Stage label="VON ALLGEMEIN ZU SPEZIFISCH DURCH SEMANTISCHE ETAGEN">
      {floors.map((floor, index) => {
        const y = interpolate(rise, [0, 1], [840 - index * 230, 1040 - index * 230]);
        const active = clamp(1 - Math.abs(rise * 3.1 - index) / 1.1);
        return (
          <div key={floor.label} style={{position: 'absolute', left: 115, right: 115, top: y, height: 175, borderRadius: 30, background: active > 0.4 ? 'rgba(135,87,232,.12)' : 'rgba(255,255,255,.8)', border: `4px solid ${active > 0.4 ? C.accent : C.line}`, transform: `scale(${0.92 + active * 0.08})`, boxShadow: active > 0.4 ? '0 0 45px rgba(135,87,232,.2)' : 'none', padding: 25, boxSizing: 'border-box'}}>
            <div style={{fontSize: 22, fontWeight: 900, color: active > 0.4 ? C.accent : C.muted}}>{floor.label}</div>
            <div style={{display: 'flex', gap: 16, marginTop: 26}}>{floor.words.map((word) => <Chip key={word} tone={active > 0.4 ? 'accent' : 'plain'}>{word}</Chip>)}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 55, top: 190, bottom: 120, width: 24, borderRadius: 999, background: C.line}}><div style={{position: 'absolute', left: -18, top: `${rise * 88}%`, width: 60, height: 60, borderRadius: 999, background: C.success, boxShadow: '0 0 28px rgba(53,197,138,.4)'}} /></div>
    </Stage>
  );
};

const ContextThreadBraider: React.FC<{frame: number}> = ({frame}) => {
  const braid = prog(frame, 5, 125);
  const remove = prog(frame, 120, 168);
  const colors = [C.accent, C.success, C.warning];
  return (
    <Stage label="DREI KONTEXTE BILDEN EINE INTERPRETATION · EIN FEHLENDER STRANG ÄNDERT SIE">
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {colors.map((color, index) => (
          <path
            key={color}
            d={`M70 ${270 + index * 220} C300 ${270 + ((index + 1) % 3) * 220}, 610 ${270 + ((index + 2) % 3) * 220}, 860 ${470 + index * 35}`}
            fill="none"
            stroke={color}
            strokeWidth="34"
            strokeLinecap="round"
            strokeDasharray="1300"
            strokeDashoffset={1300 * (1 - braid)}
            opacity={index === 2 ? 1 - remove : 1}
          />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 790, top: 760, width: 250, height: 160, borderRadius: 34, background: remove > 0.5 ? 'rgba(255,93,108,.12)' : 'rgba(53,197,138,.12)', border: `4px solid ${remove > 0.5 ? C.danger : C.success}`, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 25, fontWeight: 900}}>{remove > 0.5 ? 'BEDEUTUNG VERÄNDERT' : 'INTERPRETATION A'}</div>
    </Stage>
  );
};

const PredictiveDominoFork: React.FC<{frame: number}> = ({frame}) => {
  const context = prog(frame, 25, 95);
  const fall = prog(frame, 100, 170);
  const routes = [
    {label: 'Text', y: 320, stable: true, color: C.accent},
    {label: 'Daten', y: 570, stable: false, color: C.success},
    {label: 'Satz', y: 820, stable: false, color: C.warning},
  ];
  return (
    <Stage label="KONTEXT STABILISIERT EINE FORTSETZUNG · NUR DIESE KETTE FÄLLT">
      {routes.map((route, routeIndex) => (
        <React.Fragment key={route.label}>
          <div style={{position: 'absolute', left: 90, top: route.y, transform: 'translateY(-50%)'}}><Chip tone={route.stable && context > 0.5 ? 'accent' : 'plain'}>{route.label}</Chip></div>
          {Array.from({length: 7}, (_, index) => {
            const localFall = route.stable ? clamp(fall * 8 - index) : 0;
            const wobble = route.stable ? 0 : Math.sin(frame / 5 + index) * context * 8;
            return (
              <div key={index} style={{position: 'absolute', left: 300 + index * 82, top: route.y + wobble, width: 34, height: 118, borderRadius: 10, transformOrigin: '50% 100%', transform: `translate(-50%,-50%) rotate(${localFall * 72}deg)`, background: route.color, opacity: route.stable ? 1 : 0.38 + context * 0.2}} />
            );
          })}
        </React.Fragment>
      ))}
    </Stage>
  );
};

const ModelLayerBook: React.FC<{frame: number}> = ({frame}) => {
  const turn = prog(frame, 5, 160);
  const pages = ['KONTEXT', 'MUSTER', 'GEWICHTUNG', 'AUSWAHL'];
  return (
    <Stage label="JEDE TRANSPARENTE SEITE VERFEINERT DIESELBE INFORMATION">
      <div style={{position: 'absolute', left: 466, top: 580, width: 690, height: 610, transform: 'translate(-50%,-50%) perspective(1100px) rotateX(12deg)'}}>
        {pages.map((page, index) => {
          const local = clamp(turn * pages.length - index);
          return (
            <div key={page} style={{position: 'absolute', inset: 0, borderRadius: '16px 42px 42px 16px', transformOrigin: '0 50%', transform: `translate(${index * 16}px,${-index * 14}px) rotateY(${-local * 138}deg)`, background: `rgba(${index % 2 ? '198,168,255' : '135,87,232'},${0.12 + index * 0.05})`, border: `4px solid ${index % 2 ? C.accentSoft : C.accent}`, boxShadow: '0 22px 55px rgba(45,28,75,.12)', backfaceVisibility: 'hidden'}}>
              <div style={{position: 'absolute', left: 55, top: 48, fontSize: 26, fontWeight: 900, color: C.accent}}>{page}</div>
              <div style={{position: 'absolute', left: 55, right: 55, top: 150, height: 22, borderRadius: 999, background: C.line}}><div style={{height: '100%', width: `${45 + index * 15}%`, background: index % 2 ? C.success : C.accent, borderRadius: 999}} /></div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const ResponseConstellationWrite: React.FC<{frame: number}> = ({frame}) => {
  const words = ['KI', 'ordnet', 'Konzepte', 'zu', 'einer', 'Antwort.'];
  return (
    <Stage label="KONZEPTPUNKTE SINKEN HERAB UND WERDEN ZU WÖRTERN">
      {words.map((word, index) => {
        const reveal = prog(frame, 12 + index * 20, 42 + index * 20);
        const startX = 130 + (index * 137) % 720;
        const startY = 130 + (index % 3) * 90;
        const targetX = 105 + index * 137;
        const targetY = 720;
        return (
          <div key={`${word}-${index}`} style={{position: 'absolute', left: interpolate(reveal, [0, 1], [startX, targetX]), top: interpolate(reveal, [0, 1], [startY, targetY]), transform: `translate(-50%,-50%) scale(${0.25 + reveal * 0.75})`, opacity: reveal}}>
            <div style={{width: interpolate(reveal, [0, 1], [36, word.length > 6 ? 135 : 95]), height: interpolate(reveal, [0, 1], [36, 65]), borderRadius: interpolate(reveal, [0, 1], [999, 18]), background: index % 2 ? C.accentSoft : C.accent, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: interpolate(reveal, [0, 1], [0, 22]), fontWeight: 900, boxShadow: '0 0 28px rgba(135,87,232,.32)'}}>{word}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 70, right: 70, top: 770, height: 6, borderRadius: 999, background: `linear-gradient(90deg,${C.accentSoft},${C.accent})`, transform: `scaleX(${prog(frame, 112, 168)})`, transformOrigin: 'left'}} />
    </Stage>
  );
};

const TruthShadowComparison: React.FC<{frame: number}> = ({frame}) => {
  const light = prog(frame, 12, 135);
  return (
    <Stage label="DIE AUSSAGE BLEIBT SAUBER · IHR SCHATTEN ZEIGT DAS FEHLENDE">
      <div style={{position: 'absolute', left: interpolate(light, [0, 1], [120, 720]), top: 210, width: 100, height: 100, borderRadius: 999, background: C.warning, boxShadow: '0 0 70px rgba(255,182,72,.65)'}} />
      <div style={{position: 'absolute', left: 466, top: 520, width: 560, minHeight: 220, padding: 38, borderRadius: 38, transform: 'translate(-50%,-50%)', background: C.white, border: `4px solid ${C.accent}`, boxShadow: '0 25px 70px rgba(45,28,75,.16)', fontSize: 35, lineHeight: 1.2, fontWeight: 900}}>„Diese Aussage ist eindeutig richtig.“</div>
      <div style={{position: 'absolute', left: interpolate(light, [0, 1], [670, 240]), top: 730, width: 500, height: 220, borderRadius: '50%', transform: `translate(-50%,-50%) skewX(${interpolate(light, [0, 1], [-18, 22])}deg)`, background: 'rgba(20,18,26,.18)', filter: 'blur(12px)', opacity: light}} />
      <div style={{position: 'absolute', left: 466, bottom: 95, display: 'flex', gap: 18, transform: 'translateX(-50%)', opacity: light}}><Chip tone="danger">QUELLE FEHLT</Chip><Chip tone="warning">DATUM OFFEN</Chip></div>
    </Stage>
  );
};

const ParallelWorldsSplit: React.FC<{frame: number}> = ({frame}) => {
  const split = prog(frame, 10, 65);
  const evolve = prog(frame, 62, 155);
  return (
    <Stage label="EIN START · ZWEI METHODEN · ZWEI UNTERSCHIEDLICHE ENTWICKLUNGEN">
      <div style={{position: 'absolute', left: 466, top: 180, transform: 'translateX(-50%)'}}><Chip tone="accent">GLEICHER START</Chip></div>
      {[0, 1].map((world) => (
        <div key={world} style={{position: 'absolute', left: world === 0 ? 65 : interpolate(split, [0, 1], [65, 490]), top: 300, width: interpolate(split, [0, 1], [800, 375]), height: 650, borderRadius: 40, overflow: 'hidden', background: world === 0 ? 'linear-gradient(160deg,#EEE7FF,#FFFFFF)' : 'linear-gradient(160deg,#E5FAF1,#FFFFFF)', border: `4px solid ${world === 0 ? C.accent : C.success}`, opacity: world === 1 ? split : 1}}>
          <div style={{textAlign: 'center', marginTop: 35, fontSize: 24, fontWeight: 900, color: world === 0 ? C.accent : C.success}}>METHODE {world === 0 ? 'A' : 'B'}</div>
          {Array.from({length: 4}, (_, index) => (
            <div key={index} style={{position: 'absolute', left: 50 + index * 76, bottom: 70, width: 58, height: interpolate(evolve, [0, 1], [80, 150 + index * (world === 0 ? 52 : 30)]), borderRadius: '14px 14px 0 0', background: world === 0 ? C.accent : C.success, opacity: 0.45 + index * 0.14}} />
          ))}
          <div style={{position: 'absolute', left: 35, right: 35, top: 180, height: 8, borderRadius: 999, background: C.line}}><div style={{height: '100%', width: `${interpolate(evolve, [0, 1], [20, world === 0 ? 82 : 65])}%`, background: world === 0 ? C.accent : C.success, borderRadius: 999}} /></div>
        </div>
      ))}
    </Stage>
  );
};

const ConstellationRankAlign: React.FC<{frame: number}> = ({frame}) => {
  const align = prog(frame, 28, 150);
  const candidates = [
    {label: 'A', sx: 160, sy: 760, rank: 1, color: C.accent},
    {label: 'B', sx: 720, sy: 300, rank: 2, color: C.success},
    {label: 'C', sx: 250, sy: 280, rank: 3, color: C.warning},
    {label: 'D', sx: 700, sy: 790, rank: 4, color: C.accentSoft},
  ];
  return (
    <Stage label="HÖHE UND HELLIGKEIT KODIEREN DIE RANGFOLGE">
      {candidates.map((candidate, index) => {
        const x = interpolate(align, [0, 1], [candidate.sx, 250 + index * 155]);
        const y = interpolate(align, [0, 1], [candidate.sy, 250 + (candidate.rank - 1) * 190]);
        return (
          <div key={candidate.label} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${1.25 - candidate.rank * 0.1})`, width: 82, height: 82, borderRadius: 999, background: candidate.color, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, boxShadow: `0 0 ${55 - candidate.rank * 7}px ${candidate.color}88`}}>{candidate.label}</div>
        );
      })}
      {align > 0.7 && [1, 2, 3, 4].map((rank, index) => <div key={rank} style={{position: 'absolute', left: 115, top: 250 + index * 190, color: C.muted, fontSize: 21, fontWeight: 900}}>{rank}.</div>)}
    </Stage>
  );
};

const CircularFeedbackWorkshop: React.FC<{frame: number}> = ({frame}) => {
  const cycle = (frame % 150) / 150;
  const quality = Math.min(100, 42 + frame * 0.31);
  const stations = [
    {label: 'ENTWURF', angle: -90, color: C.accent},
    {label: 'PRÜFEN', angle: 0, color: C.warning},
    {label: 'VERBESSERN', angle: 90, color: C.success},
    {label: 'WIEDERHOLEN', angle: 180, color: C.accentSoft},
  ];
  return (
    <Stage label="JEDE RUNDE VERÄNDERT DAS OBJEKT UND ERHÖHT DIE QUALITÄT">
      <div style={{position: 'absolute', left: 466, top: 550, width: 590, height: 590, borderRadius: 999, transform: 'translate(-50%,-50%)', border: `18px solid ${C.line}`}} />
      {stations.map((station) => {
        const angle = (station.angle * Math.PI) / 180;
        return <div key={station.label} style={{position: 'absolute', left: 466 + Math.cos(angle) * 295, top: 550 + Math.sin(angle) * 295, transform: 'translate(-50%,-50%)'}}><Chip tone={station.color === C.success ? 'success' : station.color === C.warning ? 'warning' : 'accent'}>{station.label}</Chip></div>;
      })}
      <div style={{position: 'absolute', left: 466 + Math.cos(cycle * Math.PI * 2 - Math.PI / 2) * 295, top: 550 + Math.sin(cycle * Math.PI * 2 - Math.PI / 2) * 295, width: 72, height: 72, borderRadius: 22, transform: `translate(-50%,-50%) rotate(${frame * 3}deg)`, background: C.foreground, boxShadow: '0 0 28px rgba(20,18,26,.35)'}} />
      <div style={{position: 'absolute', left: 466, top: 550, transform: 'translate(-50%,-50%)', textAlign: 'center'}}><div style={{fontFamily: 'monospace', fontSize: 70, fontWeight: 900, color: C.success}}>{Math.round(quality)}%</div><div style={{fontSize: 21, fontWeight: 900, color: C.muted}}>QUALITÄT</div></div>
    </Stage>
  );
};

const MachineBlueprintReveal: React.FC<{frame: number}> = ({frame}) => {
  const open = prog(frame, 38, 118);
  return (
    <Stage label="BLACKBOX ÖFFNET SICH · INTERNE ZUSTÄNDE WERDEN NACHVOLLZIEHBAR">
      <div style={{position: 'absolute', left: 466, top: 550, width: 650, height: 520, transform: 'translate(-50%,-50%)', borderRadius: 48, background: C.foreground, overflow: 'hidden', boxShadow: '0 28px 80px rgba(20,18,26,.25)'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(198,168,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(198,168,255,.15) 1px,transparent 1px)', backgroundSize: '45px 45px', opacity: open}} />
        {[0, 1].map((door) => <div key={door} style={{position: 'absolute', top: 0, bottom: 0, left: door === 0 ? 0 : '50%', width: '50%', background: 'linear-gradient(145deg,#352D43,#1A1622)', transform: `translateX(${door === 0 ? -open * 100 : open * 100}%)`, borderRight: door === 0 ? '4px solid #625570' : undefined, zIndex: 5}} />)}
        {['INPUT', 'FILTER', 'GEWICHT', 'OUTPUT'].map((label, index) => <div key={label} style={{position: 'absolute', left: 75 + index * 150, top: 215 + Math.sin(index * 1.6) * 85, width: 120, height: 90, borderRadius: 22, background: index === 3 ? C.success : C.accent, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, opacity: open}}>{label}</div>)}
      </div>
      <div style={{position: 'absolute', left: 466, bottom: 110, transform: 'translateX(-50%)', opacity: open}}><Chip tone="accent">BLUEPRINT AKTIV</Chip></div>
    </Stage>
  );
};

const DebuggerTimeScrub: React.FC<{frame: number}> = ({frame}) => {
  const backward = prog(frame, 10, 125);
  const replay = prog(frame, 125, 172);
  const position = backward < 1 ? interpolate(backward, [0, 1], [850, 260]) : interpolate(replay, [0, 1], [260, 850]);
  const states = ['OK', 'OK', 'ABWEICHUNG', 'FEHLER', 'CRASH'];
  return (
    <Stage label="VOM CRASH ZUR ERSTEN ABWEICHUNG · DANACH KORREKTER REPLAY">
      <div style={{position: 'absolute', left: 90, right: 90, top: 590, height: 16, borderRadius: 999, background: C.line}} />
      {states.map((state, index) => <div key={state + index} style={{position: 'absolute', left: 130 + index * 170, top: 590, width: 72, height: 72, borderRadius: 999, transform: 'translate(-50%,-50%)', background: index < 2 ? C.success : index === 2 ? C.warning : C.danger, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900}}>{state}</div>)}
      <div style={{position: 'absolute', left: position, top: 590, width: 20, height: 280, borderRadius: 999, transform: 'translate(-50%,-50%)', background: replay > 0 ? C.success : C.foreground, boxShadow: '0 0 30px rgba(20,18,26,.35)'}} />
      <div style={{position: 'absolute', left: position, top: 390, transform: 'translateX(-50%)'}}><Chip tone={replay > 0 ? 'success' : backward > 0.7 ? 'warning' : 'danger'}>{replay > 0 ? 'REPLAY' : backward > 0.7 ? 'ROOT FRAME' : 'SCRUB'}</Chip></div>
    </Stage>
  );
};

const EvidenceFishingLines: React.FC<{frame: number}> = ({frame}) => {
  const cast = prog(frame, 5, 85);
  const reel = prog(frame, 88, 165);
  const sources = [
    {label: 'PDF', x: 180, strong: true},
    {label: 'BLOG', x: 400, strong: false},
    {label: 'STUDIE', x: 620, strong: true},
    {label: 'POST', x: 820, strong: false},
  ];
  return (
    <Stage label="STARKE BELEGE WERDEN EINGEHOLT · SCHWACHE TREFFER LÖSEN SICH">
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, bottom: 0, background: 'linear-gradient(180deg,rgba(135,87,232,.08),rgba(135,87,232,.22))'}} />
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        {sources.map((source, index) => <path key={source.label} d={`M466 170 Q${source.x} 380 ${source.x} 770`} fill="none" stroke={source.strong ? C.success : C.line} strokeWidth={source.strong ? 8 : 5} strokeDasharray="900" strokeDashoffset={900 * (1 - cast)} opacity={source.strong ? 1 : 1 - reel * 0.8} />)}
      </svg>
      <div style={{position: 'absolute', left: 466, top: 150, transform: 'translateX(-50%)'}}><Chip tone="accent">QUERY</Chip></div>
      {sources.map((source) => <div key={source.label} style={{position: 'absolute', left: interpolate(reel, [0, 1], [source.x, source.strong ? 466 : source.x]), top: interpolate(reel, [0, 1], [790, source.strong ? 420 : 850]), transform: 'translate(-50%,-50%)', opacity: source.strong ? 1 : 1 - reel}}><Chip tone={source.strong ? 'success' : 'plain'}>{source.label}</Chip></div>)}
    </Stage>
  );
};

const PrivacyRedactionWave: React.FC<{frame: number}> = ({frame}) => {
  const scan = prog(frame, 5, 155);
  const waveY = interpolate(scan, [0, 1], [150, 920]);
  const lines = [
    {text: 'Name: Maria Beispiel', private: true},
    {text: 'Bestellung: Laptop', private: false},
    {text: 'Adresse: Musterstraße 10', private: true},
    {text: 'Status: versendet', private: false},
    {text: 'Telefon: 0170 123456', private: true},
  ];
  return (
    <Stage label="PERSÖNLICHE DATEN MASKIEREN · NUTZINFORMATION ERHALTEN">
      <div style={{position: 'absolute', left: 150, right: 150, top: 150, bottom: 120, borderRadius: 36, background: C.white, border: `4px solid ${C.line}`, padding: '55px 42px', boxSizing: 'border-box', overflow: 'hidden'}}>
        {lines.map((line, index) => {
          const y = 70 + index * 145;
          const redacted = scan > (y + 120) / 900;
          return <div key={line.text} style={{position: 'relative', marginTop: index === 0 ? 0 : 75, height: 68, fontSize: 26, fontWeight: 800, color: C.foreground}}>{line.text}{line.private && redacted ? <div style={{position: 'absolute', left: 0, right: 0, top: -4, height: 54, borderRadius: 10, background: C.foreground}} /> : null}</div>;
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: waveY - 150, height: 70, background: 'linear-gradient(180deg,transparent,rgba(135,87,232,.35),white,rgba(135,87,232,.28),transparent)', boxShadow: '0 0 40px rgba(135,87,232,.4)'}} />
      </div>
    </Stage>
  );
};

const ScalingStaircase: React.FC<{frame: number}> = ({frame}) => {
  const demand = prog(frame, 5, 145);
  const capacity = prog(frame, 35, 165);
  return (
    <Stage label="NACHFRAGE STEIGT · KAPAZITÄT WIRD VORAUSSCHAUEND BEREITGESTELLT">
      {Array.from({length: 7}, (_, index) => {
        const x = 95 + index * 115;
        const stepHeight = 90 + index * 100;
        const capReveal = prog(frame, 35 + index * 14, 58 + index * 14);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: x, bottom: 105, width: 105, height: stepHeight, background: 'rgba(135,87,232,.12)', border: `3px solid ${C.accentSoft}`, borderRadius: '16px 16px 0 0'}} />
            <div style={{position: 'absolute', left: x + 12, bottom: 105, width: 81, height: stepHeight * capReveal * 0.9, background: C.success, borderRadius: '12px 12px 0 0', opacity: capacity}} />
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: interpolate(demand, [0, 1], [105, 795]), bottom: interpolate(demand, [0, 1], [180, 800]), width: 72, height: 72, borderRadius: 999, transform: 'translate(-50%,50%)', background: C.danger, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, boxShadow: '0 0 32px rgba(255,93,108,.45)'}}>LOAD</div>
    </Stage>
  );
};

const ResourcePackingPuzzle: React.FC<{frame: number}> = ({frame}) => {
  const repack = prog(frame, 82, 160);
  const pieces = [
    {w: 170, h: 150, x: 115, y: 220, tx: 165, ty: 330, color: C.accent},
    {w: 130, h: 210, x: 360, y: 180, tx: 330, ty: 300, color: C.success},
    {w: 220, h: 110, x: 610, y: 250, tx: 475, ty: 350, color: C.warning},
    {w: 145, h: 165, x: 250, y: 560, tx: 675, ty: 300, color: C.accentSoft},
    {w: 180, h: 130, x: 600, y: 620, tx: 650, ty: 500, color: C.danger},
  ];
  return (
    <Stage label="GLEICHE RESSOURCEN · BESSERE ANORDNUNG · WENIGER LEERRAUM">
      <div style={{position: 'absolute', left: 105, right: 105, top: 170, bottom: 120, borderRadius: 32, border: `8px solid ${C.foreground}`, background: 'linear-gradient(rgba(135,87,232,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(135,87,232,.06) 1px,transparent 1px)', backgroundSize: '50px 50px'}}>
        {pieces.map((piece, index) => <div key={index} style={{position: 'absolute', left: interpolate(repack, [0, 1], [piece.x, piece.tx]), top: interpolate(repack, [0, 1], [piece.y, piece.ty]), width: piece.w, height: piece.h, borderRadius: 22, transform: `translate(-50%,-50%) rotate(${interpolate(repack, [0, 1], [index % 2 ? 8 : -7, 0])}deg)`, background: piece.color, opacity: 0.85, boxShadow: '0 15px 38px rgba(45,28,75,.14)'}} />)}
      </div>
      <div style={{position: 'absolute', left: 466, bottom: 60, transform: 'translateX(-50%)', opacity: repack}}><Chip tone="success">KAPAZITÄT BESSER GENUTZT</Chip></div>
    </Stage>
  );
};

const DecayRenewalCycle: React.FC<{frame: number}> = ({frame}) => {
  const cycle = prog(frame, 5, 165);
  const angle = cycle * Math.PI * 2 - Math.PI / 2;
  const states = [
    {label: 'FRISCH', angle: -90, color: C.success},
    {label: 'ALTERT', angle: 0, color: C.warning},
    {label: 'PRÜFEN', angle: 90, color: C.danger},
    {label: 'ERNEUERN', angle: 180, color: C.accent},
  ];
  return (
    <Stage label="WISSEN ALTERT · WIRD GEPRÜFT · UND ERNEUERT">
      <div style={{position: 'absolute', left: 466, top: 550, width: 590, height: 590, borderRadius: 999, transform: 'translate(-50%,-50%)', border: `20px solid ${C.line}`}} />
      {states.map((state) => {
        const a = (state.angle * Math.PI) / 180;
        return <div key={state.label} style={{position: 'absolute', left: 466 + Math.cos(a) * 295, top: 550 + Math.sin(a) * 295, transform: 'translate(-50%,-50%)'}}><Chip tone={state.color === C.success ? 'success' : state.color === C.warning ? 'warning' : state.color === C.danger ? 'danger' : 'accent'}>{state.label}</Chip></div>;
      })}
      <div style={{position: 'absolute', left: 466 + Math.cos(angle) * 295, top: 550 + Math.sin(angle) * 295, width: 64, height: 64, borderRadius: 999, transform: 'translate(-50%,-50%)', background: C.foreground, boxShadow: '0 0 30px rgba(20,18,26,.4)'}} />
      <div style={{position: 'absolute', left: 466, top: 550, width: 210, height: 150, borderRadius: 34, transform: 'translate(-50%,-50%)', background: cycle > 0.7 ? C.success : C.white, color: cycle > 0.7 ? C.white : C.foreground, border: `4px solid ${cycle > 0.7 ? C.success : C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 25, fontWeight: 900}}>FAKT<br />VERSION {cycle > 0.7 ? '2' : '1'}</div>
    </Stage>
  );
};

const CopilotDualTrack: React.FC<{frame: number}> = ({frame}) => {
  const travel = prog(frame, 5, 160);
  const checkpoints = [0.25, 0.55, 0.82];
  return (
    <Stage label="MENSCHLICHE ABSICHT UND KI-AUSFÜHRUNG TREFFEN SICH AN FREIGABEPUNKTEN">
      {[0, 1].map((track) => <div key={track} style={{position: 'absolute', left: 90, right: 90, top: track === 0 ? 390 : 710, height: 32, borderRadius: 999, background: track === 0 ? C.accentSoft : C.success, opacity: 0.65}} />)}
      {checkpoints.map((checkpoint, index) => {
        const x = 90 + checkpoint * 752;
        return <div key={checkpoint} style={{position: 'absolute', left: x, top: 550, width: 28, height: 350, transform: 'translate(-50%,-50%)', background: C.line}}><div style={{position: 'absolute', left: -58, top: 145, width: 145, minHeight: 58, borderRadius: 17, background: frame / 180 > checkpoint ? C.success : C.white, color: frame / 180 > checkpoint ? C.white : C.foreground, border: `3px solid ${frame / 180 > checkpoint ? C.success : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900}}>CHECK {index + 1}</div></div>;
      })}
      <div style={{position: 'absolute', left: interpolate(travel, [0, 1], [90, 842]), top: 390, transform: 'translate(-50%,-50%)'}}><Chip tone="accent">MENSCH</Chip></div>
      <div style={{position: 'absolute', left: interpolate(travel, [0, 1], [90, 842]), top: 710, transform: 'translate(-50%,-50%)'}}><Chip tone="success">KI</Chip></div>
    </Stage>
  );
};

const TradeoffLandscapeRoute: React.FC<{frame: number}> = ({frame}) => {
  const route = prog(frame, 5, 160);
  const beacons = [
    {label: 'KOSTEN', x: 180, y: 320, color: C.warning},
    {label: 'RISIKO', x: 720, y: 300, color: C.danger},
    {label: 'TEMPO', x: 210, y: 790, color: C.accent},
    {label: 'QUALITÄT', x: 720, y: 780, color: C.success},
  ];
  return (
    <Stage label="PRIORITÄTEN FORMEN DAS GELÄNDE UND DAMIT DIE BESTE ROUTE">
      {beacons.map((beacon) => <div key={beacon.label} style={{position: 'absolute', left: beacon.x, top: beacon.y, width: 180, height: 180, borderRadius: 999, transform: 'translate(-50%,-50%)', background: `radial-gradient(circle,${beacon.color}55,transparent 68%)`, border: `3px solid ${beacon.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: beacon.color, fontSize: 21, fontWeight: 900}}>{beacon.label}</div>)}
      <svg width="932" height="1100" viewBox="0 0 932 1100" style={{position: 'absolute', inset: 0}}>
        <path d="M90 920 C200 730 300 690 410 560 C540 410 630 560 840 150" fill="none" stroke={C.line} strokeWidth="26" strokeLinecap="round" />
        <path d="M90 920 C200 730 300 690 410 560 C540 410 630 560 840 150" fill="none" stroke={C.success} strokeWidth="10" strokeLinecap="round" strokeDasharray="1500" strokeDashoffset={1500 * (1 - route)} />
      </svg>
      <div style={{position: 'absolute', left: interpolate(route, [0, 1], [90, 840]), top: interpolate(route, [0, 1], [920, 150]), width: 66, height: 66, borderRadius: 20, transform: 'translate(-50%,-50%)', background: C.foreground, boxShadow: '0 0 30px rgba(20,18,26,.4)'}} />
    </Stage>
  );
};

const AttentionSpotlightStage: React.FC<{frame: number}> = ({frame}) => {
  const scan = prog(frame, 5, 150);
  const spotlightX = interpolate(scan, [0, 1], [140, 780]);
  const words = [
    {label: 'Die', x: 160, y: 400},
    {label: 'KI', x: 310, y: 400},
    {label: 'nutzt', x: 485, y: 400},
    {label: 'den', x: 640, y: 400},
    {label: 'Kontext', x: 790, y: 400},
    {label: 'für', x: 265, y: 650},
    {label: 'das', x: 445, y: 650},
    {label: 'nächste', x: 615, y: 650},
    {label: 'Wort', x: 785, y: 650},
  ];
  return (
    <Stage label="DER GESAMTE KONTEXT BLEIBT · RELEVANTE WÖRTER WERDEN AKTIV">
      {words.map((word) => {
        const focus = clamp(1 - Math.abs(word.x - spotlightX) / 170);
        return <Chip key={word.label} tone={focus > 0.62 ? 'accent' : 'plain'} style={{position: 'absolute', left: word.x, top: word.y, transform: `translate(-50%,-50%) scale(${0.86 + focus * 0.18})`, opacity: 0.35 + focus * 0.65}}>{word.label}</Chip>;
      })}
      <div style={{position: 'absolute', left: spotlightX, top: 120, width: 320, height: 750, transform: 'translateX(-50%)', clipPath: 'polygon(46% 0,54% 0,100% 100%,0 100%)', background: 'linear-gradient(180deg,rgba(255,255,255,.95),rgba(198,168,255,.12))', opacity: 0.58, pointerEvents: 'none'}} />
    </Stage>
  );
};

const StaleFactRenewalCycle: React.FC<{frame: number}> = ({frame}) => {
  const age = prog(frame, 5, 70);
  const search = prog(frame, 68, 125);
  const renew = prog(frame, 120, 170);
  return (
    <Stage label="ALTER FAKT → REFRESH-SUCHE → ERNEUERN ODER AUSMUSTERN">
      <div style={{position: 'absolute', left: 466, top: 500, width: 560, height: 310, borderRadius: 42, transform: `translate(-50%,-50%) rotate(${age * -3}deg) scale(${1 - age * 0.08 + renew * 0.12})`, background: renew > 0.55 ? 'rgba(53,197,138,.12)' : `rgba(255,255,255,${1 - age * 0.35})`, border: `5px solid ${renew > 0.55 ? C.success : age > 0.7 ? C.warning : C.accent}`, filter: `grayscale(${age * (1 - renew)})`, boxShadow: '0 24px 70px rgba(45,28,75,.15)', padding: 42, boxSizing: 'border-box'}}>
        <div style={{fontSize: 24, fontWeight: 900, color: renew > 0.55 ? C.success : C.accent}}>FAKT · VERSION {renew > 0.55 ? '2' : '1'}</div>
        <div style={{fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginTop: 34}}>„Das aktuelle Modell unterstützt diese Funktion.“</div>
        <div style={{marginTop: 28, fontFamily: 'monospace', color: C.muted}}>Stand: {renew > 0.55 ? '2026-08-04' : '2025-02-10'}</div>
      </div>
      <div style={{position: 'absolute', left: interpolate(search, [0, 1], [110, 466]), top: 850, width: 120, height: 120, borderRadius: 999, transform: 'translate(-50%,-50%)', background: search > 0.7 ? C.success : C.foreground, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 900, opacity: search}}>↻</div>
      <div style={{position: 'absolute', left: 466, bottom: 85, transform: 'translateX(-50%)', opacity: renew}}><Chip tone="success">AKTUELLER BELEG ÜBERNOMMEN</Chip></div>
    </Stage>
  );
};

const renderers: Record<FinalMechanism, React.FC<{frame: number}>> = {
  'contextual-token-river': ContextualTokenRiver,
  'representation-morph-cascade': RepresentationMorphCascade,
  'concept-neighborhood-elevator': ConceptNeighborhoodElevator,
  'context-thread-braider': ContextThreadBraider,
  'predictive-domino-fork': PredictiveDominoFork,
  'model-layer-book': ModelLayerBook,
  'response-constellation-write': ResponseConstellationWrite,
  'truth-shadow-comparison': TruthShadowComparison,
  'parallel-worlds-split': ParallelWorldsSplit,
  'constellation-rank-align': ConstellationRankAlign,
  'circular-feedback-workshop': CircularFeedbackWorkshop,
  'machine-blueprint-reveal': MachineBlueprintReveal,
  'debugger-time-scrub': DebuggerTimeScrub,
  'evidence-fishing-lines': EvidenceFishingLines,
  'privacy-redaction-wave': PrivacyRedactionWave,
  'scaling-staircase': ScalingStaircase,
  'resource-packing-puzzle': ResourcePackingPuzzle,
  'decay-renewal-cycle': DecayRenewalCycle,
  'copilot-dual-track': CopilotDualTrack,
  'tradeoff-landscape-route': TradeoffLandscapeRoute,
  'attention-spotlight-stage': AttentionSpotlightStage,
  'stale-fact-renewal-cycle': StaleFactRenewalCycle,
};

export const FinalVariantPrototype: React.FC<{
  recipe: FinalAnimationRecipe;
}> = ({recipe}) => {
  const frame = useCurrentFrame();
  const Renderer = renderers[recipe.mechanism];
  return (
    <PrototypeShell
      family={`${recipe.family} · final-wave`}
      title={recipe.title}
      subtitle={recipe.subtitle}
    >
      <Renderer frame={frame} />
    </PrototypeShell>
  );
};

export const createFinalVariantComponent = (
  recipe: FinalAnimationRecipe,
): React.FC => {
  const Component: React.FC = () => <FinalVariantPrototype recipe={recipe} />;
  Component.displayName = `Final_${recipe.mechanism}`;
  return Component;
};
