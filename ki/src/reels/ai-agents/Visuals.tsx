import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const soft = '#EFE7FF';
const line = '#D8CCE9';
const muted = '#777083';
const danger = '#E35D6A';
const success = '#35A779';

const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div
    style={{
      background: '#fff',
      border: '2px solid #E9E1F2',
      borderRadius: 34,
      boxShadow: '0 20px 52px rgba(52,35,80,.11)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const ChatVsAgentVisual: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rawEnter = spring({frame: f, fps, config: {damping: 18, stiffness: 120}});
  const enter = 0.16 + rawEnter * 0.84;
  const plan = p(f, 100, 245);
  const steps = [
    ['1', 'Ziel verstehen'],
    ['2', 'Schritt planen'],
    ['3', 'Aktion wählen'],
  ] as const;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Card style={{position: 'absolute', left: 42, top: 90, width: 448, height: 635, padding: 36, opacity: enter}}>
        <div style={{fontSize: 28, fontWeight: 900, color: muted}}>CHATBOT</div>
        <div style={{marginTop: 30, padding: 28, borderRadius: 24, background: '#F6F3F8', fontSize: 35, fontWeight: 900}}>
          Deine Nachricht
        </div>
        <div style={{marginTop: 22, padding: 28, borderRadius: 24, background: soft, fontSize: 35, fontWeight: 900}}>
          Antwort
        </div>
        <div style={{marginTop: 112, textAlign: 'center', fontSize: 31, lineHeight: 1.18, fontWeight: 900, color: muted, opacity: p(f, 40, 85)}}>
          wartet auf deine<br />nächste Eingabe
        </div>
      </Card>

      <Card style={{position: 'absolute', left: 590, top: 90, width: 448, height: 800, padding: 36, opacity: enter, borderColor: BRAND.accent}}>
        <div style={{fontSize: 28, fontWeight: 900, color: purple}}>KI-AGENT</div>
        <div style={{marginTop: 26, padding: 28, borderRadius: 24, background: soft, fontSize: 34, fontWeight: 950, color: purple}}>
          Ziel: Aufgabe erledigen
        </div>
        <div style={{marginTop: 38}}>
          {steps.map(([n, t], i) => {
            const show = p(f, 95 + i * 45, 138 + i * 45);
            return (
              <div key={n} style={{display: 'flex', gap: 20, alignItems: 'center', marginBottom: 27, opacity: show, transform: `translateX(${(1 - show) * 28}px)`}}>
                <div style={{width: 64, height: 64, borderRadius: 21, background: purple, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 950}}>
                  {n}
                </div>
                <div style={{fontSize: 33, fontWeight: 950}}>{t}</div>
              </div>
            );
          })}
        </div>
        <div style={{height: 11, borderRadius: 999, background: '#EAE4EF', marginTop: 34, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${plan * 100}%`, background: purple, borderRadius: 999}} />
        </div>
      </Card>
    </div>
  );
};

export const ToolUseVisual: React.FC = () => {
  const f = useCurrentFrame();
  const tools = [
    ['⌕', 'Suche'],
    ['▤', 'Datei'],
    ['</>', 'Code'],
    ['▦', 'Daten'],
  ] as const;
  const positions: Array<[number, number]> = [
    [55, 105],
    [755, 105],
    [55, 680],
    [755, 680],
  ];
  const activeIndex = Math.min(3, Math.floor(p(f, 80, 250) * 4));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Card style={{position: 'absolute', left: 350, top: 345, width: 380, height: 285, padding: 32, textAlign: 'center', borderColor: BRAND.accent}}>
        <div style={{width: 104, height: 104, margin: '0 auto', borderRadius: 32, background: soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 950, color: purple}}>
          A
        </div>
        <div style={{fontSize: 38, fontWeight: 950, marginTop: 20}}>Agent</div>
      </Card>

      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        {positions.map(([x, y], i) => {
          const q = p(f, 35 + i * 32, 88 + i * 32);
          return (
            <path
              key={i}
              d={`M540 488 C540 420, ${x + 135} 420, ${x + 135} ${y + 100}`}
              fill="none"
              stroke={i === activeIndex ? purple : line}
              strokeWidth={i === activeIndex ? 9 : 6}
              strokeLinecap="round"
              strokeDasharray="760"
              strokeDashoffset={760 * (1 - q)}
            />
          );
        })}
      </svg>

      {tools.map(([icon, label], i) => {
        const show = p(f, 25 + i * 28, 72 + i * 28);
        const active = i === activeIndex;
        const [x, y] = positions[i];
        return (
          <Card key={label} style={{position: 'absolute', left: x, top: y, width: 270, height: 205, padding: 26, textAlign: 'center', opacity: show, transform: `scale(${0.94 + 0.06 * show})`, borderColor: active ? BRAND.accent : '#E9E1F2'}}>
            <div style={{fontSize: 46, lineHeight: 1, fontWeight: 950, color: active ? purple : ink}}>{icon}</div>
            <div style={{fontSize: 34, fontWeight: 950, marginTop: 18}}>{label}</div>
          </Card>
        );
      })}

      <div style={{position: 'absolute', left: 205, right: 205, top: 930, display: 'flex', justifyContent: 'center', gap: 18, opacity: p(f, 215, 275)}}>
        {['Fund', 'Datei', 'Resultat'].map((x, i) => (
          <div key={x} style={{padding: '18px 27px', borderRadius: 999, background: i === 2 ? soft : '#F4F1F7', fontSize: 28, fontWeight: 900, color: i === 2 ? purple : ink}}>
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PlanLoopVisual: React.FC = () => {
  const f = useCurrentFrame();
  const stage = Math.min(2, Math.floor(p(f, 25, 225) * 3));
  const nodes = [
    ['1', 'PLAN', 'Schritt wählen'],
    ['2', 'ACT', 'Tool ausführen'],
    ['3', 'CHECK', 'Ergebnis prüfen'],
  ] as const;
  const xs = [45, 385, 725];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', top: 130, left: 0, right: 0}}>
        {nodes.map(([n, label, sub], i) => {
          const show = p(f, 20 + i * 42, 68 + i * 42);
          const active = stage === i;
          return (
            <Card key={label} style={{position: 'absolute', left: xs[i], width: 310, height: 310, padding: 30, opacity: show, borderColor: active ? BRAND.accent : '#E9E1F2', transform: `translateY(${active ? -12 : 0}px)`}}>
              <div style={{fontSize: 27, fontWeight: 950, color: active ? purple : muted}}>{n} · {label}</div>
              <div style={{fontSize: 40, lineHeight: 1.08, fontWeight: 950, marginTop: 52}}>{sub}</div>
              <div style={{height: 13, borderRadius: 999, background: active ? BRAND.accent : '#EDE8F2', marginTop: 48}} />
            </Card>
          );
        })}
      </div>

      <svg width="1080" height="1100" style={{position: 'absolute', inset: 0}}>
        <path d="M200 485 C330 590 440 590 540 485 C650 370 790 370 880 485" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round" opacity={p(f, 105, 175)} />
        <path d="M880 485 C930 675 780 820 540 820 C300 820 150 675 200 485" fill="none" stroke={line} strokeWidth="7" strokeLinecap="round" strokeDasharray="19 17" opacity={p(f, 165, 235)} />
      </svg>

      <Card style={{position: 'absolute', left: 260, top: 700, width: 560, padding: 34, textAlign: 'center', opacity: p(f, 195, 260), borderColor: success}}>
        <div style={{fontSize: 28, fontWeight: 900, color: success}}>ERGEBNIS PRÜFEN</div>
        <div style={{fontSize: 40, lineHeight: 1.08, fontWeight: 950, marginTop: 12}}>nächsten Schritt wählen</div>
      </Card>
    </div>
  );
};

export const PermissionCascadeVisual: React.FC = () => {
  const f = useCurrentFrame();
  const expand = p(f, 25, 145);
  const cascade = p(f, 145, 285);
  const actions = ['Datei ändern', 'Mail senden', 'Daten löschen'] as const;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 540 - (165 + 220 * expand), top: 95, width: 330 + 440 * expand, height: 330 + 440 * expand, borderRadius: '50%', border: `6px solid ${expand > 0.65 ? danger : BRAND.accent}`, background: expand > 0.65 ? 'rgba(227,93,106,.05)' : 'rgba(185,140,255,.08)'}} />

      <Card style={{position: 'absolute', left: 365, top: 240, width: 350, padding: 34, textAlign: 'center', borderColor: expand > 0.65 ? danger : BRAND.accent}}>
        <div style={{fontSize: 28, fontWeight: 900, color: muted}}>BERECHTIGUNGEN</div>
        <div style={{fontSize: 44, fontWeight: 950, marginTop: 12, color: expand > 0.65 ? danger : purple}}>{expand > 0.65 ? 'zu weit' : 'begrenzt'}</div>
      </Card>

      <div style={{position: 'absolute', left: 90, right: 90, top: 700, display: 'flex', gap: 18, justifyContent: 'center'}}>
        {actions.map((a, i) => {
          const show = p(f, 155 + i * 34, 198 + i * 34);
          const fail = i <= Math.floor(cascade * 3);
          return (
            <Card key={a} style={{width: 270, height: 170, padding: 22, textAlign: 'center', opacity: show, borderColor: fail ? danger : '#E9E1F2', transform: `translateY(${fail ? 11 : 0}px)`}}>
              <div style={{fontSize: 29, fontWeight: 950, color: fail ? danger : ink}}>{fail ? '!' : '✓'}</div>
              <div style={{fontSize: 28, lineHeight: 1.08, fontWeight: 900, marginTop: 18}}>{a}</div>
            </Card>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 205, right: 205, top: 925, textAlign: 'center', fontSize: 35, fontWeight: 950, color: danger, opacity: p(f, 225, 290)}}>
        ein Fehler → mehrere Folgeaktionen
      </div>
    </div>
  );
};

export const GuardrailVisual: React.FC = () => {
  const f = useCurrentFrame();
  const autonomy = p(f, 20, 105);
  const approve = p(f, 120, 185);
  const execute = p(f, 195, 275);
  const tools = [
    ['Suche', true],
    ['Datei lesen', true],
    ['Löschen', false],
  ] as const;
  const pipeline = ['Sprache', 'Plan', 'Tool', 'Aktion'] as const;
  const pulseProgress = Math.max(0, f - 250) % 92 / 92;
  const pulseX = interpolate(pulseProgress, [0, 1], [160, 920]);
  const pulseOpacity = f >= 250 ? 0.55 + 0.45 * Math.sin((f - 250) / 6) ** 2 : 0;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Card style={{position: 'absolute', left: 50, top: 75, width: 430, padding: 32}}>
        <div style={{fontSize: 28, fontWeight: 900, color: purple}}>ERLAUBTE TOOLS</div>
        <div style={{marginTop: 25}}>
          {tools.map(([t, ok], i) => (
            <div key={t} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < tools.length - 1 ? '1px solid #EEE8F2' : 'none', opacity: p(f, 18 + i * 24, 58 + i * 24)}}>
              <span style={{fontSize: 31, fontWeight: 900}}>{t}</span>
              <span style={{width: 52, height: 31, borderRadius: 999, background: ok ? success : '#D8D1DD', position: 'relative'}}>
                <span style={{position: 'absolute', top: 4, left: ok ? 25 : 4, width: 23, height: 23, borderRadius: '50%', background: '#fff'}} />
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{position: 'absolute', left: 540, top: 75, width: 490, padding: 32, textAlign: 'center', borderColor: approve > 0.8 ? success : BRAND.accent}}>
        <div style={{fontSize: 28, fontWeight: 900, color: muted}}>KRITISCHE AKTION</div>
        <div style={{fontSize: 40, lineHeight: 1.08, fontWeight: 950, marginTop: 20}}>vor Ausführung stoppen</div>
        <div style={{marginTop: 32, padding: '22px 28px', borderRadius: 24, background: approve > 0.8 ? 'rgba(53,167,121,.12)' : soft, fontSize: 32, fontWeight: 950, color: approve > 0.8 ? success : purple}}>
          {approve > 0.8 ? 'Mensch bestätigt ✓' : 'Bestätigung erforderlich'}
        </div>
      </Card>

      <div style={{position: 'absolute', left: 90, right: 90, top: 535}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
          <span style={{fontSize: 28, fontWeight: 900, color: muted}}>Autonomie</span>
          <span style={{fontSize: 28, fontWeight: 950, color: purple, opacity: p(f, 70, 125)}}>mehr Freiheit → genauere Grenzen</span>
        </div>
        <div style={{height: 15, borderRadius: 999, background: '#EAE4EF', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${autonomy * 100}%`, borderRadius: 999, background: purple}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 95, right: 95, top: 690, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {pipeline.map((label, i) => {
          const show = p(f, 175 + i * 30, 215 + i * 30);
          const active = execute > i / pipeline.length;
          return (
            <React.Fragment key={label}>
              <Card style={{width: 190, height: 135, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: show, borderColor: active ? BRAND.accent : '#E9E1F2', background: active ? '#FCFAFF' : '#fff'}}>
                <div style={{fontSize: 30, fontWeight: 950, color: active ? purple : ink}}>{label}</div>
              </Card>
              {i < pipeline.length - 1 ? <div style={{width: 28, height: 7, borderRadius: 999, background: active ? BRAND.accent : line, opacity: show}} /> : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 757, height: 8, pointerEvents: 'none', opacity: pulseOpacity}}>
        <div style={{position: 'absolute', left: pulseX, width: 18, height: 18, marginTop: -5, borderRadius: '50%', background: purple, boxShadow: '0 0 20px rgba(110,69,201,.45)'}} />
      </div>

      <Card style={{position: 'absolute', left: 305, top: 900, width: 470, padding: 28, textAlign: 'center', opacity: p(f, 250, 305), borderColor: success}}>
        <div style={{fontSize: 29, fontWeight: 900, color: success}}>KONTROLLIERTE AKTION</div>
        <div style={{fontSize: 35, fontWeight: 950, marginTop: 9}}>mit klaren Grenzen</div>
      </Card>
    </div>
  );
};
