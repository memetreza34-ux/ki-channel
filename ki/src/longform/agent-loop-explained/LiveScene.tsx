import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {breathe, drift, useSpeech, wordsBetween} from './speech';

/**
 * Szene, die durchgehend lebt.
 *
 * Die erste Fassung kannte nur einen Zustandswechsel je Element: einfahren,
 * dann stehen. Hier hat jedes Element drei Zustaende und keiner davon ist
 * still:
 *
 *   wartend   — noch nicht gesprochen, unsichtbar
 *   aktiv     — das zuletzt gesprochene Bild. Gross, farbig, pulst auf jedem
 *               Wort mit der Stimme mit.
 *   gesetzt   — schon erklaert. Tritt sichtbar zurueck, atmet aber weiter.
 *
 * Der Fokus wandert also mit der Stimme durch das Bild. Dazu kommen Bausteine,
 * die von sich aus laufen: Punkte auf Verbindungen, drehende Schleifen,
 * Balken, die mit dem Satz wachsen, und Text, der wortsynchron entsteht.
 */

const purple = BRAND.accentDk;
const accent = BRAND.accent;
const ink = BRAND.ink;
const muted = '#8D8197';
const green = '#31875A';
const red = '#B64D58';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const label: React.CSSProperties = {
  fontFamily: BRAND.font.body,
  fontWeight: 850,
  letterSpacing: -0.5,
  color: ink,
};

export type Tone = 'on' | 'off' | 'good' | 'bad';
const toneColor = (t: Tone) => (t === 'good' ? green : t === 'bad' ? red : t === 'off' ? muted : purple);
const toneBg = (t: Tone) =>
  t === 'good' ? '#EAF6EF' : t === 'bad' ? '#FCEEF0' : t === 'off' ? '#F2EEF7' : 'rgba(185,140,255,.16)';

/**
 * Ein Bild im Kapitel.
 *
 * `on`    — das gesprochene Wort, auf dem das Bild sitzt (siehe anchor.ts)
 * `phase` — Kapitel bestehen aus mehreren Tafeln. Beginnt eine neue Phase,
 *           raeumt die alte sichtbar ab. Dadurch passt mehr in ein Kapitel als
 *           die neun Rasterplaetze, und es gibt alle paar Sekunden eine grosse
 *           Bewegung statt nur kleiner Auftritte.
 */
type Base = {
  on: string;
  nth?: number;
  col: number;
  row: number;
  /** Wieviele Rasterspalten das Bild einnimmt. Breite Bilder brauchen 2 oder 3. */
  span?: number;
  phase?: number;
  tone?: Tone;
};

export type LiveItem =
  | (Base & {kind: 'chip'; text: string; icon?: React.ReactNode})
  | (Base & {kind: 'card'; title: string; text: string; wide?: boolean})
  | (Base & {kind: 'flow'; steps: string[]; stagger?: number})
  | (Base & {kind: 'quote'; text: string})
  | (Base & {kind: 'meter'; title: string; text?: string})
  | (Base & {kind: 'loop'; steps: string[]})
  | (Base & {kind: 'stack'; title: string; rows: string[]})
  | (Base & {kind: 'note'; text: string})
  | (Base & {kind: 'big'; text: string});

/**
 * Dasselbe Bild, nachdem sein Ankerwort in einen Frame aufgeloest wurde.
 *
 * Verteilt ueber die Union, sonst faellt die Unterscheidung nach `kind` weg
 * und TypeScript kennt in den Zweigen nur noch die gemeinsamen Felder.
 */
type Placed<T> = T extends unknown ? Omit<T, 'on' | 'nth'> & {at: number; on: string} : never;
export type PlacedItem = Placed<LiveItem>;

/**
 * Raster unterhalb des Kapitelkopfs.
 *
 * Statt fester Mittelpunkte wird gerechnet: jedes Bild kennt seine erlaubte
 * Breite und bricht innerhalb davon um. Vorher standen nur drei Mitten fest —
 * ein breiteres Bild in einer Randspalte lief aus dem Bild heraus.
 */
const MARGIN = 96;
const GAP = 26;
const GRID_WIDTH = 1920 - MARGIN * 2;
const COL_WIDTH = (GRID_WIDTH - GAP * 2) / 3;
const ROW = [300, 566, 806];

/** Mitte und Maximalbreite fuer ein Bild ab Spalte `col` ueber `span` Spalten. */
const place = (col: number, span: number) => {
  const c = Math.min(2, Math.max(0, col));
  const s = Math.min(3 - c, Math.max(1, span));
  const left = MARGIN + c * (COL_WIDTH + GAP);
  const width = s * COL_WIDTH + (s - 1) * GAP;
  return {center: left + width / 2, maxWidth: width};
};

/* ------------------------------------------------------------------ */
/* Bausteine, die von sich aus laufen                                   */
/* ------------------------------------------------------------------ */

/**
 * Text, der im Rhythmus der echten Stimme entsteht.
 *
 * Ab `at` wird gezaehlt, wieviele Woerter der Sprecher seitdem gesagt hat —
 * genauso viele Woerter des Textes stehen da. Der Satz auf dem Schirm waechst
 * damit im Takt des gesprochenen Satzes, nicht in einer geschaetzten Rate.
 */
const SpokenText: React.FC<{at: number; offset: number; text: string; style?: React.CSSProperties}> = ({
  at, offset, text, style,
}) => {
  const frame = useCurrentFrame() + offset;
  const startFrame = at + offset;
  const words = text.split(' ');

  // Wieviele Voiceover-Woerter sind seit dem Start dieses Textes gefallen?
  const spokenSince = wordsBetween(startFrame, frame);

  return (
    <span style={style}>
      {words.map((word, i) => {
        const shown = i < spokenSince;
        // Das zuletzt erschienene Wort bekommt noch einen kurzen Nachlauf.
        const fresh = i === spokenSince - 1;
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              opacity: shown ? 1 : 0,
              transform: shown ? `translateY(${fresh ? -2 : 0}px)` : 'translateY(9px)',
              color: fresh ? purple : undefined,
              transition: 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

/** Verbindung, auf der dauerhaft Punkte laufen. Zeigt: hier fliesst etwas. */
const FlowLine: React.FC<{width: number; color?: string; speed?: number; on: number}> = ({
  width, color = accent, speed = 78, on,
}) => {
  const frame = useCurrentFrame();
  const dots = [0, 1, 2];
  return (
    <svg width={width} height={14} style={{overflow: 'visible', opacity: on}}>
      <line x1={0} y1={7} x2={width} y2={7} stroke="rgba(110,69,201,.22)" strokeWidth={2.4} strokeLinecap="round" />
      {dots.map((d) => {
        const t = ((frame / speed) + d / dots.length) % 1;
        return <circle key={d} cx={t * width} cy={7} r={4.2} fill={color} opacity={0.35 + 0.65 * Math.sin(t * Math.PI)} />;
      })}
    </svg>
  );
};

/** Schleife, die sich dreht, solange das Kapitel laeuft. */
const TurningLoop: React.FC<{steps: string[]; on: number; tone: Tone}> = ({steps, on, tone}) => {
  const frame = useCurrentFrame();
  const speech = useSpeech(0);
  const radius = 168;
  const turn = (frame / 210) * 360;
  // Der Zeiger springt im Sprechtakt weiter, statt gleichmaessig zu gleiten.
  const head = Math.floor(frame / 46) % steps.length;
  return (
    <div style={{position: 'relative', width: radius * 2 + 130, height: radius * 2 + 40, opacity: on}}>
      <svg width={radius * 2 + 130} height={radius * 2 + 40} style={{position: 'absolute', inset: 0}}>
        <circle
          cx={(radius * 2 + 130) / 2} cy={(radius * 2 + 40) / 2} r={radius}
          fill="none" stroke="rgba(110,69,201,.16)" strokeWidth={2.6}
          strokeDasharray="10 12"
          style={{transformOrigin: 'center', transform: `rotate(${turn}deg)`}}
        />
      </svg>
      {steps.map((step, i) => {
        const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
        const active = i === head;
        const cx = (radius * 2 + 130) / 2 + Math.cos(angle) * radius;
        const cy = (radius * 2 + 40) / 2 + Math.sin(angle) * radius;
        const grow = active ? 1 + speech.pulse * 0.05 : 1;
        return (
          <div
            key={step}
            style={{
              position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${grow})`,
              padding: '14px 22px', borderRadius: 999, whiteSpace: 'nowrap',
              background: active ? toneBg(tone) : '#fff',
              border: `1.5px solid ${active ? toneColor(tone) : 'rgba(26,26,46,.10)'}`,
              boxShadow: active ? '0 12px 30px rgba(110,69,201,.18)' : 'none',
              ...label, fontSize: 24, color: active ? toneColor(tone) : muted,
            }}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Zustand eines Elements                                               */
/* ------------------------------------------------------------------ */

/**
 * Wie praesent ist dieses Element gerade?
 *
 * `enter` 0..1 — faehrt es noch ein
 * `focus` 1..0 — ist es das aktuell erklaerte Bild, oder schon abgelegt
 * `exit`  0..1 — raeumt seine Phase gerade ab
 */
const usePresence = (at: number, nextAt: number | null, exitAt: number | null) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - at, fps, config: {damping: 16, mass: 0.62, stiffness: 118}, durationInFrames: 30});
  // Sobald das naechste Bild kommt, tritt dieses ueber 30 Frames zurueck.
  const focus = nextAt === null ? 1 : interpolate(frame, [nextAt - 4, nextAt + 30], [1, 0], clamp);
  const exit = exitAt === null ? 0 : interpolate(frame, [exitAt - 16, exitAt + 4], [0, 1], clamp);
  return {enter, focus, exit};
};

const Item: React.FC<{
  item: PlacedItem;
  next: number | null;
  exitAt: number | null;
  seed: number;
  offset: number;
  maxWidth: number;
}> = ({item, next, exitAt, seed, offset, maxWidth}) => {
  const frame = useCurrentFrame();
  const speech = useSpeech(offset);
  const {enter, focus, exit} = usePresence(item.at, next, exitAt);
  const tone: Tone = item.tone ?? 'on';

  if (frame < item.at - 2) return null;
  if (exit >= 1) return null;

  // Aktives Bild pulst mit der Stimme. Abgelegtes atmet nur noch.
  const livePulse = speech.pulse * focus * 0.035;
  const breath = breathe(frame, seed, 0.006 * (0.4 + focus));
  const wander = drift(frame, seed, 3.2 * (0.35 + focus * 0.65));
  const scale = (0.86 + enter * 0.14) * (1 + livePulse + breath) * (0.93 + focus * 0.07) * (1 - exit * 0.16);
  const lift = (1 - enter) * 26;

  const wrap: React.CSSProperties = {
    opacity: Math.min(1, enter * 1.3) * (0.52 + focus * 0.48) * (1 - exit),
    // Beim Abraeumen zieht die ganze Tafel nach oben aus dem Bild.
    transform: `translate(${wander.x}px, ${wander.y + lift - exit * 54}px) scale(${scale})`,
    filter: focus < 0.5 ? `saturate(${0.45 + focus})` : undefined,
  };

  const shadow = `0 ${16 + focus * 14}px ${44 + focus * 26}px rgba(26,26,46,${0.05 + focus * 0.07})`;
  const card: React.CSSProperties = {
    background: '#fff',
    border: `1px solid rgba(110,69,201,${0.12 + focus * 0.16})`,
    borderRadius: 24,
    boxShadow: shadow,
  };

  if (item.kind === 'chip') {
    return (
      <div style={wrap}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 13, padding: '19px 30px', borderRadius: 999,
          background: toneBg(tone),
          border: `1.5px solid ${tone === 'off' ? 'rgba(26,26,46,.10)' : `rgba(110,69,201,${0.2 + focus * 0.3})`}`,
          boxShadow: focus > 0.6 ? '0 14px 34px rgba(110,69,201,.16)' : 'none',
        }}>
          {item.icon ? (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={toneColor(tone)}
              strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
              style={{
                strokeDasharray: 120,
                strokeDashoffset: 120 * (1 - interpolate(frame, [item.at, item.at + 24], [0, 1], clamp)),
                transform: `rotate(${breathe(frame, seed + 3, 2.4)}deg)`,
              }}>{item.icon}</svg>
          ) : null}
          <div style={{...label, fontSize: 30, color: toneColor(tone)}}>{item.text}</div>
        </div>
      </div>
    );
  }

  if (item.kind === 'card') {
    return (
      <div style={wrap}>
        <div style={{...card, padding: '32px 38px', width: maxWidth,
          border: tone === 'on' ? card.border : `1.5px solid ${toneColor(tone)}${focus > 0.5 ? '55' : '2A'}`}}>
          <div style={{...label, fontSize: 24, color: toneColor(tone), letterSpacing: 1.6}}>{item.title}</div>
          <div style={{...label, fontSize: 35, marginTop: 15, lineHeight: 1.22}}>
            <SpokenText at={item.at + 6} offset={offset} text={item.text} />
          </div>
          <div style={{marginTop: 16}}>
            <FlowLine width={maxWidth - 60} on={focus} color={toneColor(tone)} speed={92 + seed * 7} />
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === 'flow') {
    const stagger = item.stagger ?? 16;
    return (
      <div style={wrap}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, flexWrap: 'wrap', maxWidth}}>
          {item.steps.map((s, i) => {
            const stepAt = item.at + i * stagger;
            const stepIn = interpolate(frame, [stepAt, stepAt + 18], [0, 1], clamp);
            // Der Schritt, der gerade "dran" ist, hebt sich rhythmisch.
            const cycle = Math.floor(Math.max(0, frame - item.at) / 38) % item.steps.length;
            const hot = cycle === i && focus > 0.4;
            return (
              <React.Fragment key={s}>
                <div style={{
                  padding: '17px 25px', borderRadius: 16,
                  background: hot ? toneBg(tone) : '#F7F5FA',
                  border: `1.5px solid ${hot ? toneColor(tone) : 'rgba(26,26,46,.08)'}`,
                  ...label, fontSize: 26, color: hot ? toneColor(tone) : muted, whiteSpace: 'nowrap',
                  opacity: stepIn, transform: `translateY(${(1 - stepIn) * 14}px) scale(${hot ? 1.05 : 1})`,
                  boxShadow: hot ? '0 12px 28px rgba(110,69,201,.16)' : 'none',
                }}>{s}</div>
                {i < item.steps.length - 1 ? (
                  <FlowLine width={34} on={stepIn * focus} color={toneColor(tone)} speed={54} />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (item.kind === 'quote') {
    return (
      <div style={wrap}>
        <div style={{...card, padding: '34px 40px', width: maxWidth, borderLeft: `7px solid ${toneColor(tone)}`}}>
          {/* Kein Anfuehrungszeichen-Paar: das schliessende haenge sonst hinter
              den noch ungesprochenen Woertern in der Luft. Der farbige Balken
              links markiert das Zitat. */}
          <div style={{...label, fontSize: 36, lineHeight: 1.28, color: ink}}>
            <SpokenText at={item.at} offset={offset} text={item.text} />
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === 'meter') {
    // Waechst mit dem laufenden Satz — nicht mit einer festen Dauer.
    const fill = Math.max(interpolate(frame, [item.at, item.at + 70], [0, 0.55], clamp), speech.flow);
    return (
      <div style={wrap}>
        <div style={{...card, padding: '24px 28px', width: maxWidth}}>
          <div style={{...label, fontSize: 23, color: toneColor(tone), letterSpacing: 1.6}}>{item.title}</div>
          <div style={{height: 16, borderRadius: 11, background: '#EDE8F3', marginTop: 22, overflow: 'hidden'}}>
            <div style={{
              height: '100%', width: `${fill * 100}%`, borderRadius: 9,
              background: `linear-gradient(90deg, ${accent}, ${toneColor(tone)})`,
            }} />
          </div>
          {item.text ? (
            <div style={{...label, fontSize: 27, color: muted, marginTop: 18}}>
              <SpokenText at={item.at + 8} offset={offset} text={item.text} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (item.kind === 'loop') {
    return (
      <div style={wrap}>
        <TurningLoop steps={item.steps} on={Math.min(1, enter * 1.2)} tone={tone} />
      </div>
    );
  }

  if (item.kind === 'stack') {
    return (
      <div style={wrap}>
        <div style={{...card, padding: '24px 28px', width: maxWidth}}>
          <div style={{...label, fontSize: 23, color: toneColor(tone), letterSpacing: 1.6}}>{item.title}</div>
          {item.rows.map((row, i) => {
            const rowAt = item.at + 14 + i * 20;
            const grow = interpolate(frame, [rowAt, rowAt + 22], [0, 1], clamp);
            return (
              <div key={row} style={{
                display: 'flex', alignItems: 'center', gap: 12, marginTop: i === 0 ? 18 : 12,
                opacity: grow, transform: `translateX(${(1 - grow) * -18}px)`,
              }}>
                <div style={{
                  width: 11, height: 11, borderRadius: 999, background: toneColor(tone),
                  transform: `scale(${1 + Math.sin((frame - rowAt) / 24 + i) * 0.22 * focus})`,
                }} />
                <div style={{...label, fontSize: 29, color: ink}}>{row}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (item.kind === 'big') {
    const sweep = interpolate(frame, [item.at, item.at + 34], [0, 1], clamp);
    return (
      <div style={wrap}>
        <div style={{
          ...card, padding: '30px 54px', borderRadius: 999, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(90deg,#F6F0FF,#fff,#F6F0FF)',
        }}>
          {/* Lichtkante laeuft einmal durch, dann bleibt ein ruhiger Schimmer. */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: 160,
            left: `${(-20 + ((frame / 150) % 1) * 140)}%`,
            background: 'linear-gradient(90deg,transparent,rgba(185,140,255,.20),transparent)',
            opacity: focus,
          }} />
          <div style={{...label, fontSize: 44, color: toneColor(tone), position: 'relative',
            maxWidth: maxWidth - 96, textAlign: 'center', lineHeight: 1.16,
            clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`}}>{item.text}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{...label, fontSize: 32, color: toneColor(tone), maxWidth, lineHeight: 1.26, textAlign: 'center'}}>
        <SpokenText at={item.at} offset={offset} text={item.text} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

/**
 * Eine Tafel: alle Bilder einer Phase.
 *
 * Die Bilder stehen nicht auf festen Rasterpunkten, sondern ruecken zusammen.
 * Ein Raster mit neun festen Mitten liess bei vier Bildern zwangslaeufig fuenf
 * Loecher im Bild — genau der leere Eindruck, den die erste Fassung hatte.
 *
 * Alle Bilder der Phase stehen von Anfang an im Layout, auch die noch nicht
 * gesprochenen. Nur sichtbar sind sie noch nicht. Dadurch bleibt die Anordnung
 * stehen, wenn ein Bild dazukommt, statt bei jedem Auftritt umzuspringen.
 */
const Board: React.FC<{
  items: PlacedItem[];
  offset: number;
  nextOf: Map<PlacedItem, number | null>;
  exitAt: number | null;
  /** Wann die uebernaechste Phase beginnt — dann ist diese hier ganz vorbei. */
  goneAt: number | null;
  seedOf: Map<PlacedItem, number>;
}> = ({items, offset, nextOf, exitAt, goneAt, seedOf}) => {
  const frame = useCurrentFrame();
  const rows = [...new Set(items.map((i) => i.row))].sort((a, b) => a - b);

  // Abgeloeste Tafel: schrumpft nach oben in eine Ablage-Leiste, statt zu
  // verschwinden. Ein leerer Bildschirm nach jedem Phasenwechsel war der
  // Hauptgrund, warum die Szene trotz Bewegung leer wirkte.
  const shelved = exitAt === null ? 0 : interpolate(frame, [exitAt - 14, exitAt + 20], [0, 1], clamp);
  const gone = goneAt === null ? 0 : interpolate(frame, [goneAt - 14, goneAt + 12], [0, 1], clamp);
  if (gone >= 1) return null;

  // Zwei feste Zonen, damit Ablage und aktive Tafel sich nie ueberlagern:
  // die Ablage-Leiste liegt bei y≈250, die aktive Tafel darunter.
  const scale = 1 - shelved * 0.58;
  const shift = shelved * -212;

  return (
    <div style={{
      position: 'absolute',
      // Unter der Ablage-Leiste, ueber dem Fortschrittsbalken (ab ~1010).
      left: MARGIN, right: MARGIN, top: 300, height: 690,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: rows.length > 2 ? 34 : 54,
      transform: `translateY(${shift}px) scale(${scale})`,
      transformOrigin: 'center top',
      opacity: (1 - gone) * (1 - shelved * 0.38),
      filter: shelved > 0 ? `saturate(${1 - shelved * 0.5})` : undefined,
      pointerEvents: 'none',
    }}>
      {rows.map((row) => {
        const inRow = items.filter((i) => i.row === row).sort((a, b) => a.col - b.col);
        return (
          <div key={row} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: GAP, width: '100%', flexWrap: 'wrap',
          }}>
            {inRow.map((item) => (
              <Item
                key={`${item.on}-${item.at}-${item.col}`}
                item={item}
                next={nextOf.get(item) ?? null}
                exitAt={null}
                seed={seedOf.get(item) ?? 0}
                offset={offset}
                maxWidth={place(item.col, item.span ?? 1).maxWidth}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const LiveScene: React.FC<{items: PlacedItem[]; offset: number}> = ({items, offset}) => {
  const order = [...items].sort((a, b) => a.at - b.at);

  // Fuer jedes Element: wann kommt das naechste? Daran haengt der Fokuswechsel.
  const nextOf = new Map<PlacedItem, number | null>();
  order.forEach((item, i) => nextOf.set(item, order[i + 1]?.at ?? null));

  const seedOf = new Map<PlacedItem, number>();
  items.forEach((item, i) => seedOf.set(item, i));

  // Wann beginnt die jeweils naechste Phase? Dann raeumt diese hier ab.
  const phaseStart = new Map<number, number>();
  order.forEach((item) => {
    const phase = item.phase ?? 0;
    const known = phaseStart.get(phase);
    if (known === undefined || item.at < known) phaseStart.set(phase, item.at);
  });

  const phases = [...new Set(items.map((i) => i.phase ?? 0))].sort((a, b) => a - b);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {phases.map((phase) => (
        <Board
          key={phase}
          items={items.filter((i) => (i.phase ?? 0) === phase)}
          offset={offset}
          nextOf={nextOf}
          exitAt={phaseStart.get(phase + 1) ?? null}
          goneAt={phaseStart.get(phase + 2) ?? null}
          seedOf={seedOf}
        />
      ))}
    </div>
  );
};

export {ICONS} from './icons';
