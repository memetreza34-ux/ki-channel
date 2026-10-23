import React from 'react';
import {clamp01, EASE, mix} from '../../kit';
import {
  AboKnopf,
  Bild,
  ChipRaster,
  DEUTSCHLAND,
  Eingabefeld,
  Fernseher,
  Filmklappe,
  Flasche,
  GRAU,
  GrosseZahl,
  GRUEN,
  GRUEN_D,
  GRUEN_T,
  GRUEN_T2,
  Glas,
  INK,
  IRLAND,
  Kapitaelchen,
  kartenPfad,
  Kuehlturm,
  LedLampe,
  NORDIRLAND,
  Papierstapel,
  projiziere,
  Punktefeld,
  Quelle,
  ROT,
  Serverhalle,
  SOFT,
  Steckdose,
  Strich,
  Stromzaehler,
  tropfenPfad,
  Uhrbogen,
  Wasserkocher,
  ZAEHLER,
  type Kartenrahmen,
} from './bausteine';
import {A1, A10, A11, A12, A13, A14, A15, A2, A3, A4, A5, A6, A7, A8, A9, p, puls, raus, S} from './zeit';

export const BODEN = 935;

/** Volle Ebene einer Station (damit Text darin nicht auf Mindestbreite umbricht). */
const EBENE: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1920, height: 1080};

/** Ein-/Ausblenden mit leichtem Anheben. */
const rein = (q: number, dy = 24): React.CSSProperties => ({opacity: q, transform: `translateY(${(1 - q) * dy}px)`});

/** Gezeichneter SVG-Pfad (Länge grob geschätzt reicht für dasharray). */
const Gezeichnet: React.FC<{d: string; q: number; farbe?: string; dicke?: number; laenge?: number; gestrichelt?: boolean; fill?: string; fillQ?: number}> = ({
  d,
  q,
  farbe = GRUEN,
  dicke = 5,
  laenge = 3000,
  gestrichelt,
  fill,
  fillQ = 0,
}) =>
  q <= 0 ? null : (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {fill ? <path d={d} fill={fill} opacity={fillQ} /> : null}
      <path
        d={d}
        fill="none"
        stroke={farbe}
        strokeWidth={dicke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={gestrichelt ? '16 14' : `${laenge}`}
        strokeDashoffset={gestrichelt ? 0 : laenge * (1 - q)}
        opacity={gestrichelt ? q : 1}
      />
    </svg>
  );

/** Punkt, der entlang eines kubischen Bézier wandert. */
const bez = (u: number, a: number, b: number, c: number, d: number) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u ** 2 * c + u ** 3 * d;
const Puls: React.FC<{q: number; pts: [number, number, number, number, number, number, number, number]}> = ({q, pts}) => {
  if (q <= 0 || q >= 1) return null;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = pts;
  const u = EASE.inOut(q);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <circle cx={bez(u, x0, x1, x2, x3)} cy={bez(u, y0, y1, y2, y3)} r={22} fill={GRUEN} opacity={0.18} />
      <circle cx={bez(u, x0, x1, x2, x3)} cy={bez(u, y0, y1, y2, y3)} r={10} fill={GRUEN} />
    </svg>
  );
};

/** Scheibenwinkel aus Abschnitten konstanter Drehzahl (stetig). */
const scheibe = (t: number, stufen: [number, number][]) => {
  let phase = 0;
  for (let i = 0; i < stufen.length; i++) {
    const [ab, w] = stufen[i];
    const bis = stufen[i + 1]?.[0] ?? Infinity;
    if (t <= ab) break;
    phase += (Math.min(t, bis) - ab) * w;
  }
  return phase;
};

/* ═════════════ 0 · Hook: der berühmte Satz ═════════════ */

const GEISTER = [
  {x: 1130, y: 96, w: 330, rot: 4, art: 'zeitung'},
  {x: 1020, y: 560, w: 340, rot: -3, art: 'folie'},
  {x: 1500, y: 330, w: 300, rot: 2.5, art: 'kommentar'},
] as const;

export const Station0: React.FC<{t: number}> = ({t}) => {
  const streich = p(t, A1.heutigen, 0.45, 'inOut');
  const alt = p(t, A1.heutigen + 0.7, 0.6, 'inOut');
  const neu = p(t, A1.heutigen + 0.9, 0.5);
  const rollen = p(t, A1.heutigen + 1.1, A1.hoch - A1.heutigen - 0.7, 'inOut');
  const zehnPuls = puls(t, A1.frage + 1.5, 0.5);
  const geisterWeg = raus(t, A1.heutigen - 0.2, 0.5);
  return (
    <>
      <div style={{...EBENE, opacity: mix(1, 0.28, alt)}}>
        <Kapitaelchen style={{left: 200, top: 214}}>Eine Frage an ChatGPT braucht</Kapitaelchen>
        <div style={{position: 'absolute', left: 186, top: 250, fontSize: 330, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: INK, transform: `scale(${1 + zehnPuls * 0.035})`, transformOrigin: '20% 60%'}}>
          10<span style={{fontWeight: 300, color: SOFT}}>×</span>
        </div>
        <Strich x={176} y={420} w={560} q={streich} farbe={ROT} dicke={14} rot={-4} />
        <Kapitaelchen style={{left: 200, top: 600}}>So viel Strom wie eine Google-Suche</Kapitaelchen>
        <Strich x={200} y={644} w={560} q={p(t, A1.frage + 2.8, 0.6, 'inOut') * raus(t, A1.problem, 0.4)} />
        <div style={{position: 'absolute', left: 200, top: 690, display: 'flex', alignItems: 'baseline', gap: 16, ...rein(p(t, A1.j2023 - 0.25, 0.45))}}>
          <span style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: SOFT}}>RECHNUNG AUS</span>
          <span style={{fontSize: 64, fontWeight: 800, color: INK, letterSpacing: '-0.02em'}}>2023</span>
        </div>
      </div>

      {/* Erste Frage: Impuls läuft von Tokis Stecker die Leitung entlang */}
      {(() => {
        const q = clamp01((t - A1.frage) / 1.4);
        if (q <= 0 || q >= 1) return null;
        const x = mix(1480, 160, EASE.inOut(q));
        return (
          <>
            <div style={{position: 'absolute', left: x - 60, top: BODEN + 6, width: 120, height: 48, borderRadius: 24, background: 'radial-gradient(closest-side, rgba(14,159,142,0.35), rgba(14,159,142,0))'}} />
            <div style={{position: 'absolute', left: x - 12, top: BODEN + 18, width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', border: `5px solid ${GRUEN}`, boxSizing: 'border-box'}} />
          </>
        );
      })()}

      {/* Die Behauptung als Bild: 1 Einheit Google, 10 Einheiten ChatGPT */}
      {(() => {
        const weg = raus(t, A1.zeitungen - 0.35, 0.4);
        if (weg <= 0 || t < A1.frage - 0.2) return null;
        const zeile = (y: number, name: string, n: number, an: number, farbe: string) => (
          <div style={{position: 'absolute', left: 1080, top: y, opacity: p(t, an - 0.15, 0.4) * weg}}>
            <Kapitaelchen style={{left: 0, top: 0}}>{name}</Kapitaelchen>
            {Array.from({length: n}, (_, i) => {
              const q = p(t, an + 0.1 + i * 0.09, 0.3);
              return <div key={i} style={{position: 'absolute', left: i * 42, top: 44, width: 30, height: 30, borderRadius: 15, background: farbe, transform: `scale(${q})`}} />;
            })}
          </div>
        );
        return (
          <>
            {zeile(300, 'ChatGPT-Frage', 10, A1.frage + 1.4, GRUEN)}
            {zeile(440, 'Google-Suche', 1, A1.frage + 2.9, '#9AA0AB')}
          </>
        );
      })()}

      {/* Der Satz steht überall */}
      {GEISTER.map((g, i) => {
        const an = [A1.zeitungen, A1.praesentationen, A1.kommentaren][i];
        const q = p(t, an - 0.1, 0.55);
        if (q <= 0 || geisterWeg <= 0) return null;
        const h = g.art === 'folie' ? g.w * 0.5625 : g.art === 'zeitung' ? g.w * 1.05 : g.w * 0.42;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: g.x,
              top: g.y,
              width: g.w,
              height: h,
              borderRadius: g.art === 'kommentar' ? 26 : 10,
              background: '#FFFFFF',
              border: '2px solid #E6E3DC',
              boxShadow: '0 18px 40px rgba(30,35,50,0.08)',
              transform: `translate(${(1 - q) * 120}px, ${(1 - q) * 40}px) rotate(${g.rot * q}deg)`,
              opacity: q * mix(1, 0.45, p(t, A1.problem, 0.5)) * geisterWeg,
              padding: 22,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {g.art === 'zeitung' ? (
              <>
                <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.2em', color: GRAU, borderBottom: '2px solid #E6E3DC', paddingBottom: 8}}>DIE ZEITUNG</div>
                <div style={{fontSize: 38, fontWeight: 800, lineHeight: 1.05, marginTop: 14, color: INK}}>KI frisst 10× so viel Strom</div>
                {[1, 0.9, 1, 0.8, 1, 0.7].map((f, k) => (
                  <div key={k} style={{height: 8, width: `${f * 100}%`, borderRadius: 4, background: '#E3E0D8', marginTop: 12}} />
                ))}
              </>
            ) : g.art === 'folie' ? (
              <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{fontSize: 96, fontWeight: 800, color: INK, letterSpacing: '-0.04em', lineHeight: 1}}>10×</div>
                <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: GRAU, marginTop: 8}}>STROM PRO ANFRAGE</div>
              </div>
            ) : (
              <div style={{fontSize: 28, fontWeight: 600, color: INK, lineHeight: 1.25}}>„Jede KI-Frage = 10 Google-Suchen!“</div>
            )}
          </div>
        );
      })}

      {/* Nach heutigen Zahlen */}
      <div style={{...EBENE, opacity: neu}}>
        <Kapitaelchen style={{left: 905, top: 300}} farbe={GRUEN_D}>
          Heute · pro Frage
        </Kapitaelchen>
        <GrosseZahl wert={mix(2.9, 0.3, rollen)} dezimalen={1} size={210} einheit="Wh" vor="≈" style={{left: 890, top: 340}} unschaerfe={Math.min(3, puls(t, A1.heutigen + 1.1 + (A1.hoch - A1.heutigen - 0.7) / 2, A1.hoch - A1.heutigen - 0.7) * 3)} />
        <Strich x={905} y={580} w={520} q={p(t, A1.hoch, 0.5, 'inOut')} />
      </div>
    </>
  );
};

/* ═════════════ 1 · Der Widerspruch ═════════════ */

export const Station1: React.FC<{t: number}> = ({t}) => {
  const turmA = p(t, A2.gleichzeitig, 1.3);
  const turmB = p(t, A2.gleichzeitig + 0.35, 1.3);
  const dampf = 1 + 0.6 * p(t, A2.trotzdem, 1.2, 'inOut');
  const titel = p(t, A2.genau, 0.6);
  return (
    <>
      <Kuehlturm cx={1260} boden={BODEN} h={520} t={t} wachsen={turmA} dampf={dampf} seed={1} />
      <Kuehlturm cx={1610} boden={BODEN} h={580} t={t} wachsen={turmB} dampf={dampf} seed={2} />
      <Kapitaelchen style={{left: 1260 - 120, width: 240, textAlign: 'center', top: BODEN - 520 * 0.5, ...rein(p(t, A2.microsoft - 0.1, 0.4), 10)}}>Microsoft</Kapitaelchen>
      <Kapitaelchen style={{left: 1610 - 120, width: 240, textAlign: 'center', top: BODEN - 580 * 0.5, ...rein(p(t, A2.google - 0.1, 0.4), 10)}}>Google</Kapitaelchen>
      <Gezeichnet d={`M1610,${BODEN - 30} H1960`} q={p(t, A2.rechenzentren - 0.2, 0.6, 'inOut')} dicke={10} laenge={360} />
      <Puls q={clamp01((t - A2.trotzdem) / 0.9)} pts={[1250, BODEN - 30, 1450, BODEN - 30, 1700, BODEN - 30, 1960, BODEN - 30]} />
      <Kapitaelchen style={{left: 1180, top: BODEN - 650, ...rein(p(t, A2.atom, 0.5), 10)}} farbe={GRUEN_D}>
        Stillgelegte Atomkraftwerke
      </Kapitaelchen>

      {/* Die einzelne Frage – winzig */}
      <div style={{...EBENE, opacity: 1 - 0.15 * titel}}>
        <Kapitaelchen style={{left: 200, top: 640}}>Eine Frage</Kapitaelchen>
        <GrosseZahl wert={0.3} dezimalen={1} size={110} einheit="Wh" vor="≈" style={{left: 190, top: 676, transform: `scale(${1 + 0.08 * puls(t, A2.einzelne, 0.7)})`, transformOrigin: '0 50%'}} />
      </div>

      {/* Titel */}
      <div style={{position: 'absolute', left: 196, top: 150, fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.02, color: INK}}>
        {['Wie viel Strom', 'frisst KI'].map((z, i) => {
          const q = p(t, A2.genau + i * 0.18, 0.55);
          return (
            <div key={i} style={{...rein(q, 40)}}>
              {z}
            </div>
          );
        })}
        <div style={{...rein(p(t, A2.genau + 0.5, 0.6), 40), color: GRUEN}}>wirklich?</div>
      </div>
      <Strich x={200} y={500} w={420} q={p(t, A2.echten, 0.6, 'inOut') * titel} />
    </>
  );
};

/* ═════════════ 2 · Eine Frage ═════════════ */

const FELD = {x: 470, y: 708, w: 520};
const Z_X = 1040;
const LISTE_X = 1590;

export const Station2: React.FC<{t: number}> = ({t}) => {
  const tipp = p(t, A3.fangen + 0.2, A3.frage - A3.fangen + 0.1, 'soft');
  const leitung = p(t, A3.fangen + 0.4, 0.8, 'inOut');
  const pulsQ = clamp01((t - A3.seit) / 0.6);
  const fluss = p(t, A3.seit + 0.5, 0.4);
  // Das Zählwerk rollt, während die Quelle genannt wird, und rastet beim Wert ein.
  const w = 0.24 * p(t, A3.google, A3.v024 - A3.google + 0.2, 'inOut') + 0.1 * p(t, A3.openai + 0.3, A3.v034 - A3.openai, 'inOut') - 0.04 * p(t, A3.epoch, A3.v03 - A3.epoch + 0.2, 'inOut');
  const unsch = Math.min(2.5, Math.abs(w - (0.24 * p(t - 1 / 30, A3.google, A3.v024 - A3.google + 0.2, 'inOut') + 0.1 * p(t - 1 / 30, A3.openai + 0.3, A3.v034 - A3.openai, 'inOut') - 0.04 * p(t - 1 / 30, A3.epoch, A3.v03 - A3.epoch + 0.2, 'inOut'))) * 600);
  const phase = scheibe(t, [
    [0, 0.6],
    [A3.seit + 0.5, 4.5],
  ]);
  const quellen = [
    {name: 'Google', wert: '0,24', an: A3.v024},
    {name: 'OpenAI', wert: '0,34', an: A3.v034},
    {name: 'Epoch AI', wert: '0,3', an: A3.v03},
  ];
  const aktiv = t >= A3.v03 - 0.2 ? 2 : t >= A3.v034 - 0.2 ? 1 : 0;
  const skala = p(t, A3.drei, 0.8, 'inOut');
  const sx = (v: number) => LISTE_X + (v / 0.5) * 270;
  return (
    <>
      <Kapitaelchen style={{left: FELD.x + 10, top: FELD.y - 56, ...rein(p(t, A3.fangen, 0.4), 10)}}>Eine typische Textfrage</Kapitaelchen>
      <Eingabefeld x={FELD.x} y={FELD.y} w={FELD.w} text="Wie lange kocht ein Ei?" tipp={tipp} senden={clamp01((t - A3.seit) / 0.3)} t={t} />
      <Gezeichnet d={`M${FELD.x + FELD.w},${FELD.y + 46} C${Z_X - 30},${FELD.y + 46} ${Z_X - 40},${BODEN - 121} ${Z_X},${BODEN - 121}`} q={leitung} dicke={6} laenge={220} />
      <Puls q={pulsQ} pts={[FELD.x + FELD.w, FELD.y + 46, Z_X - 30, FELD.y + 46, Z_X - 40, BODEN - 121, Z_X, BODEN - 121]} />
      <Stromzaehler x={Z_X} boden={BODEN} wert={w} dezimalen={t > A3.v03 + 0.3 ? 1 : 2} phase={phase} fluss={fluss} unschaerfe={unsch} />

      {quellen.map((q, i) => {
        const r = p(t, q.an - 0.2, 0.45);
        const farbe = i === aktiv ? INK : '#B4B9C2';
        return (
          <div key={i} style={{position: 'absolute', left: LISTE_X, top: 230 + i * 150, ...rein(r, 18)}}>
            <Kapitaelchen style={{left: 0, top: 0}} farbe={i === aktiv ? GRUEN_D : GRAU}>
              {q.name}
            </Kapitaelchen>
            <div style={{position: 'absolute', left: -4, top: 30, display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', color: farbe, lineHeight: 1}}>
              {q.wert}
              <span style={{fontWeight: 300, fontSize: 42, marginLeft: 10, color: i === aktiv ? SOFT : '#C5C9CF'}}>Wh</span>
            </div>
          </div>
        );
      })}

      {/* Drei Quellen auf einer Skala – dicht beieinander */}
      <Strich x={LISTE_X} y={740} w={270} q={skala} farbe="#CFCBC2" dicke={5} />
      {[0, 0.5].map((v) => (
        <div key={v} style={{position: 'absolute', left: sx(v) - 50, width: 100, top: 762, textAlign: 'center', fontSize: 24, fontWeight: 600, color: GRAU, opacity: skala, whiteSpace: 'nowrap'}}>
          {v === 0 ? '0' : '0,5 Wh'}
        </div>
      ))}
      {[0.24, 0.3, 0.34].map((v, i) => {
        const q = p(t, A3.drei + 0.3 + i * 0.18, 0.4);
        return <div key={v} style={{position: 'absolute', left: sx(v) - 13, top: 727 - (1 - q) * 30, width: 26, height: 26, borderRadius: 13, background: GRUEN, border: '3px solid #FFFFFF', boxSizing: 'border-box', opacity: q}} />;
      })}
      <div style={{position: 'absolute', left: LISTE_X, top: 816, fontSize: 24, fontWeight: 600, color: GRAU, lineHeight: 1.3, whiteSpace: 'nowrap', ...rein(p(t, A3.unabhaengig, 0.5), 10)}}>
        Firmenangaben,
        <br />
        nicht unabhängig geprüft
      </div>
    </>
  );
};

/* ═════════════ 3 · Zum Vergleich + Quiz ═════════════ */

export const Station3: React.FC<{t: number}> = ({t}) => {
  const phaseA = raus(t, A4.rate - 0.1, 0.5);
  const led = p(t, A4.led, 0.4);
  const tv = p(t, A4.fernseher, 0.3);
  const frage = p(t, A4.mehr - 0.2, 0.5);
  const hundert = p(t, A4.hundert - 0.2, 0.9, 'inOut');
  const kocher = p(t, A4.liter - 0.3, 0.6);
  const loesung = p(t, A4.das, 0.4);
  const mehr = p(t, A4.deutlich + 0.3, A4.dreihundert - A4.deutlich + 0.2, 'inOut');
  const zahl = 100 + 240 * mehr;
  return (
    <>
      {phaseA > 0 ? (
        <div style={{...EBENE, opacity: phaseA, transform: `translateY(${(1 - phaseA) * -40}px)`}}>
          <Kapitaelchen style={{left: 200, top: 150}}>Eine Frage</Kapitaelchen>
          <GrosseZahl wert={0.3} dezimalen={1} size={160} einheit="Wh" vor="≈" style={{left: 186, top: 180}} />
          <LedLampe cx={780} cy={560} r={78} an={led} />
          <Uhrbogen cx={780} cy={580} r={180} q={p(t, A4.led + 0.4, A4.minuten - A4.led - 0.2, 'inOut')} sichtbar={led} />
          <div style={{position: 'absolute', left: 580, width: 400, textAlign: 'center', top: 776, ...rein(p(t, A4.minuten - 0.1, 0.4))}}>
            <div style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', color: INK}}>
              ≈ 2 <span style={{fontWeight: 300, color: SOFT}}>min</span>
            </div>
            <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: GRAU, marginTop: 6}}>LED-LAMPE · 10 W</div>
          </div>
          <Fernseher cx={1320} cy={560} w={290} an={tv} />
          <Uhrbogen cx={1320} cy={580} r={200} q={p(t, A4.fernseher + 0.2, A4.sekunden - A4.fernseher, 'inOut') * (10 / 120)} sichtbar={tv} />
          <div style={{position: 'absolute', left: 1120, width: 400, textAlign: 'center', top: 796, ...rein(p(t, A4.sekunden - 0.1, 0.4))}}>
            <div style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', color: INK}}>
              ≈ 10 <span style={{fontWeight: 300, color: SOFT}}>s</span>
            </div>
            <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: GRAU, marginTop: 6}}>FERNSEHER · ≈ 100 W</div>
          </div>
        </div>
      ) : null}

      {/* Quiz */}
      <div style={{position: 'absolute', left: 0, width: 1920, textAlign: 'center', top: 170, fontSize: 64, fontWeight: 800, letterSpacing: '-0.025em', color: INK, ...rein(frage, 20)}}>
        Was braucht mehr Strom?
      </div>
      <div style={{...EBENE, ...rein(hundert, 12)}}>
        <Kapitaelchen style={{left: 336, top: 268}}>KI-Fragen · je 0,34 Wh</Kapitaelchen>
        <GrosseZahl wert={zahl} size={130} farbe={loesung > 0.5 && mehr < 0.05 ? GRAU : INK} style={{left: 326, top: 300}} unschaerfe={Math.min(2.5, puls(t, A4.deutlich + 0.3 + (A4.dreihundert - A4.deutlich + 0.2) / 2, A4.dreihundert - A4.deutlich + 0.2) * 2.5)} />
      </div>
      <Punktefeld x={330} y={450} spalten={10} zeilen={10} dx={22} dy={22} r={7} q={hundert} farbe={GRUEN} />
      <Punktefeld x={330} y={450} spalten={20} zeilen={17} dx={22} dy={22} r={7} q={mehr} farbe={GRUEN} />

      <div style={{...EBENE, opacity: kocher, transform: `translateY(${(1 - kocher) * 60}px)`}}>
        <Wasserkocher cx={1420} boden={790} k={1.2} an={loesung} t={t} wasser={0.55} />
        <div style={{position: 'absolute', left: 1220, width: 400, textAlign: 'center', top: 330, fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: SOFT}}>1 LITER TEEWASSER</div>
      </div>
      <Strich x={1250} y={826} w={340} q={p(t, A4.das + 0.2, 0.5, 'inOut')} dicke={8} />
      <div style={{position: 'absolute', left: 1080, top: 520, fontSize: 120, fontWeight: 300, color: GRUEN, opacity: p(t, A4.deutlich, 0.4)}}>=</div>
    </>
  );
};


/* ═════════════ 4 · Warum die alte Zahl so hoch war ═════════════ */

export const Station4: React.FC<{t: number}> = ({t}) => {
  const achsen = p(t, A5.warum - 0.2, 0.7, 'inOut');
  const linie = p(t, A5.alte, 1.0, 'inOut');
  const y = (v: number) => 820 - (v / 3) * 560;
  const P1 = {x: 360, y: y(2.9)};
  const P2 = {x: 1000, y: y(0.3)};
  const faktor = 1 + 32 * p(t, A5.innerhalb, A5.dreiunddreissigstel - A5.innerhalb + 0.4, 'inOut');
  return (
    <>
      <Strich x={260} y={820} w={860} q={achsen} farbe="#CFCBC2" dicke={4} />
      <div style={{position: 'absolute', left: 258, top: 820 - 600 * achsen, width: 4, height: 600 * achsen, background: '#CFCBC2', borderRadius: 2}} />
      <Gezeichnet d={`M${P1.x},${P1.y} C${P1.x + 260},${P1.y + 40} ${P2.x - 320},${P2.y - 10} ${P2.x},${P2.y}`} q={linie} dicke={6} laenge={900} farbe={INK} />
      <div style={{position: 'absolute', left: P1.x - 13, top: P1.y - 13, width: 26, height: 26, borderRadius: 13, background: INK, opacity: achsen}} />
      <div style={{position: 'absolute', left: P1.x + 40, top: P1.y - 96, opacity: achsen, whiteSpace: 'nowrap'}}>
        <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: GRAU}}>SCHÄTZUNG 2023</div>
        <div style={{fontSize: 56, fontWeight: 800, color: INK, letterSpacing: '-0.02em'}}>≈ 2,9 Wh</div>
      </div>
      <div style={{position: 'absolute', left: P2.x - 15, top: P2.y - 15, width: 30, height: 30, borderRadius: 15, background: GRUEN, opacity: p(t, A5.alte + 0.9, 0.3)}} />
      <div style={{position: 'absolute', left: P2.x - 80, top: P2.y - 120, ...rein(p(t, A5.alte + 0.9, 0.4), 10)}}>
        <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: GRUEN_D}}>HEUTE</div>
        <div style={{fontSize: 56, fontWeight: 800, color: INK, letterSpacing: '-0.02em'}}>≈ 0,3 Wh</div>
      </div>

      {[
        {an: A5.erstens, nr: '1', text: 'Sehr lange Antworten angenommen', x: 700, y: 300},
        {an: A5.zweitens, nr: '2', text: 'Sparsamere Chips & Modelle', x: 820, y: 470},
      ].map((a) => (
        <div key={a.nr} style={{position: 'absolute', left: a.x, top: a.y, display: 'flex', alignItems: 'center', gap: 16, ...rein(p(t, a.an - 0.1, 0.45), 14)}}>
          <div style={{width: 46, height: 46, borderRadius: 23, border: `3px solid ${GRUEN}`, color: GRUEN_D, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{a.nr}</div>
          <div style={{fontSize: 30, fontWeight: 700, color: INK, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>{a.text}</div>
        </div>
      ))}

      <div style={{...EBENE, ...rein(p(t, A5.google, 0.5), 20)}}>
        <Kapitaelchen style={{left: 1370, top: 250}} farbe={GRUEN_D}>
          Google · Gemini
        </Kapitaelchen>
        <GrosseZahl wert={faktor} size={250} einheit="×" farbe={GRUEN} style={{left: 1356, top: 290}} />
        <div style={{position: 'absolute', left: 1370, top: 560, fontSize: 36, fontWeight: 700, color: INK, whiteSpace: 'nowrap'}}>weniger Strom pro Frage</div>
        <Kapitaelchen style={{left: 1370, top: 616, fontSize: 22}}>Mai 2024 → Mai 2025</Kapitaelchen>
      </div>
    </>
  );
};

/* ═════════════ 5 · Lange Dokumente ═════════════ */

/** Stapel balanciert auf Tokis Helm (Toki steht bei x = 210). */
export const STAPEL_START = {x: 132, y: 470};

export const Station5: React.FC<{t: number}> = ({t}) => {
  const anhang = p(t, A6.hoch, 0.4);
  const tipp = p(t, A6.hoch + 0.3, 1.1, 'soft');
  const senden = A6.hoch + 1.5;
  const roll = p(t, A6.epoch, A6.v40 - A6.epoch + 0.6, 'inOut');
  const w = mix(0.3, 40, roll);
  const unsch = Math.min(4, puls(t, A6.epoch + (A6.v40 - A6.epoch + 0.6) / 2, A6.v40 - A6.epoch + 0.6) * 4);
  const phase = scheibe(t, [
    [0, 4.5],
    [senden + 0.5, 14],
  ]);
  const flug = p(t, A6.dokument, A6.hoch - A6.dokument + 0.05, 'inOut');
  return (
    <>
      <Eingabefeld x={FELD.x} y={FELD.y} w={FELD.w} text="Fasse zusammen." tipp={tipp} senden={clamp01((t - senden) / 0.3)} anhang={anhang} t={t} />
      <Gezeichnet d={`M${FELD.x + FELD.w},${FELD.y + 46} C${Z_X - 30},${FELD.y + 46} ${Z_X - 40},${BODEN - 121} ${Z_X},${BODEN - 121}`} q={1} dicke={6} laenge={220} />
      <Puls q={clamp01((t - senden) / 0.6)} pts={[FELD.x + FELD.w, FELD.y + 46, Z_X - 30, FELD.y + 46, Z_X - 40, BODEN - 121, Z_X, BODEN - 121]} />
      <Stromzaehler x={Z_X} boden={BODEN} wert={w} dezimalen={roll >= 0.999 ? 0 : 1} phase={phase + (t > A6.modelle ? Math.sin(t * 40) * 0.08 : 0)} fluss={0.4 + 0.6 * roll} unschaerfe={unsch} />

      {/* Papierstapel fliegt ins Feld */}
      {flug > 0 && flug < 1 ? (
        <div style={{...EBENE, opacity: 1 - p(t, A6.hoch - 0.15, 0.2)}}>
          <Papierstapel x={mix(STAPEL_START.x, FELD.x + 40, flug)} y={mix(STAPEL_START.y, FELD.y + 10, flug)} w={mix(150, 50, flug)} blaetter={14} rot={mix(-6, 0, flug)} />
        </div>
      ) : null}

      <div style={{position: 'absolute', left: LISTE_X, top: 230, ...rein(p(t, A6.kurze - 0.2, 0.45), 14), opacity: p(t, A6.kurze - 0.2, 0.45) * mix(1, 0.45, p(t, A6.v40, 0.4))}}>
        <Kapitaelchen style={{left: 0, top: 0}}>Kurze Frage</Kapitaelchen>
        <div style={{position: 'absolute', left: -4, top: 30, fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', color: INK, whiteSpace: 'nowrap'}}>
          0,3<span style={{fontWeight: 300, fontSize: 42, marginLeft: 10, color: SOFT}}>Wh</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: LISTE_X, top: 390, ...rein(p(t, A6.v40 - 0.1, 0.45), 14)}}>
        <Kapitaelchen style={{left: 0, top: 0}} farbe={GRUEN_D}>
          Langes Dokument
        </Kapitaelchen>
        <div style={{position: 'absolute', left: -4, top: 30, fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', color: GRUEN, whiteSpace: 'nowrap'}}>
          bis 40<span style={{fontWeight: 300, fontSize: 42, marginLeft: 10, color: SOFT}}>Wh</span>
        </div>
      </div>
      <div style={{...EBENE, ...rein(p(t, A6.hundertmal - 0.1, 0.4), 10)}}>
        <Kapitaelchen style={{left: LISTE_X, top: 548}}>Über</Kapitaelchen>
        <GrosseZahl wert={100} size={110} einheit="×" style={{left: LISTE_X - 6, top: 580}} />
      </div>
      <Kapitaelchen style={{left: LISTE_X, top: 730, ...rein(p(t, A6.modelle, 0.45), 10)}} farbe={GRUEN_D}>
        + Denk-Modelle
      </Kapitaelchen>
    </>
  );
};

/* ═════════════ 6 · Bilder & Video ═════════════ */

export const FELD6 = {x: 600, y: 360, spalten: 70, zeilen: 40, d: 13};

export const Station6: React.FC<{t: number}> = ({t}) => {
  const da = p(t, S[6] - 0.1, 0.5);
  const bild = p(t, A7.bild - 0.2, 0.5);
  const zwei = p(t, A7.zwei - 0.1, 0.4);
  const video = p(t, A7.fuenf, 0.5);
  const wh = 940 * p(t, A7.v940 - 0.3, 1.3, 'inOut');
  const feld = p(t, A7.v3000 - 0.8, 2.4, 'inOut');
  const andere = p(t, A7.andere + 0.4, 0.6, 'inOut') * raus(t, A7.teuerste, 0.5);
  return (
    <>
      <Kapitaelchen style={{left: 160, top: 110, ...rein(p(t, A7.mit - 0.1, 0.45), 10)}}>MIT Technology Review · offene Modelle</Kapitaelchen>
      <div style={{position: 'absolute', left: 160, top: 150, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', opacity: da}}>
        <div style={{width: 18, height: 18, borderRadius: 9, background: GRUEN}} />
        <span style={{fontSize: 28, fontWeight: 600, color: SOFT}}>1 Punkt = 1 ChatGPT-Frage (≈ 0,34 Wh)</span>
      </div>

      <div style={{...EBENE, opacity: mix(0.35, 1, bild) * da}}>
        <Bild x={160} y={360} w={300} />
        <Kapitaelchen style={{left: 160, top: 600, opacity: bild}}>1 Bild</Kapitaelchen>
        <div style={{position: 'absolute', left: 160, top: 642, display: 'flex', gap: 10, alignItems: 'center', opacity: zwei, whiteSpace: 'nowrap'}}>
          <div style={{width: 22, height: 22, borderRadius: 11, background: GRUEN}} />
          <div style={{width: 22, height: 22, borderRadius: 11, background: GRUEN}} />
          <span style={{fontSize: 34, fontWeight: 700, color: INK, marginLeft: 8}}>≈ 2 Fragen</span>
        </div>
      </div>

      <div style={{...EBENE, ...rein(video, 20)}}>
        <Kapitaelchen style={{left: 1010, top: 112}} farbe={GRUEN_D}>
          5 Sekunden Video
        </Kapitaelchen>
        <GrosseZahl wert={wh} size={170} einheit="Wh" vor="≈" style={{left: 990, top: 150, opacity: p(t, A7.v940 - 0.5, 0.4)}} />
      </div>
      <Punktefeld x={FELD6.x} y={FELD6.y} spalten={FELD6.spalten} zeilen={FELD6.zeilen} dx={FELD6.d} dy={FELD6.d} r={4.2} q={feld} farbe={GRUEN} />
      {andere > 0 ? (
        <div style={{position: 'absolute', left: FELD6.x + FELD6.spalten * FELD6.d * 0.25, top: FELD6.y - 6, width: FELD6.spalten * FELD6.d * 0.75 + 6, height: FELD6.zeilen * FELD6.d + 12, background: 'rgba(247,246,242,0.8)', opacity: andere, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 40, fontWeight: 800, color: INK, textAlign: 'center', lineHeight: 1.2}}>
            Andere Videomodelle:
            <br />
            <span style={{color: SOFT, fontWeight: 600}}>deutlich weniger</span>
          </div>
        </div>
      ) : null}
      <div style={{...EBENE, opacity: p(t, A7.v3000 - 0.6, 0.4)}}>
        <GrosseZahl wert={2800 * feld} size={64} vor="≈" tausender style={{left: FELD6.x - 4, top: FELD6.y + FELD6.zeilen * FELD6.d + 14}} />
        <Kapitaelchen style={{left: FELD6.x + 262, top: FELD6.y + FELD6.zeilen * FELD6.d + 44}}>Fragen</Kapitaelchen>
      </div>
    </>
  );
};

/* ═════════════ 7 · Die Masse ═════════════ */

const KNOTEN = {x: 1180, y: 640};
const ZUFLUESSE = [
  {name: 'Gemini', y: 500, an: A8.gemini},
  {name: 'Meta', y: 560, an: A8.meta},
  {name: 'Copilot', y: 720, an: A8.copilot},
  {name: 'Apps', y: 780, an: A8.apps},
  {name: 'Firmen', y: 840, an: A8.firmen},
];

export const Station7: React.FC<{t: number}> = ({t}) => {
  const mrd = 2.5 * p(t, A8.chatgpt + 0.4, A8.milliarden - A8.chatgpt + 0.2, 'inOut');
  const haupt = p(t, S[7] - 0.2, 1.2, 'inOut');
  const raus7 = p(t, A8.firmen + 0.5, 0.8, 'inOut');
  const chips = p(t, A8.trainiert - 0.3, 0.5);
  const welle = (i: number, j: number) => clamp01((t - A8.wochen - (i * 0.09 + j * 0.05)) / 0.35) * (0.6 + 0.4 * Math.sin(t * 5 + i + j * 2));
  const dimm = mix(1, 0.35, p(t, A8.trainiert - 0.3, 0.6));
  return (
    <>
      <div style={{...EBENE, opacity: dimm}}>
        <Kapitaelchen style={{left: 200, top: 170, ...rein(p(t, S[7] + 0.2, 0.4), 10)}}>ChatGPT · Mitte 2025</Kapitaelchen>
        <GrosseZahl wert={mrd} dezimalen={1} size={170} einheit="Mrd." style={{left: 190, top: 206, opacity: p(t, A8.chatgpt + 0.3, 0.3)}} unschaerfe={Math.min(2.5, puls(t, A8.chatgpt + 0.4 + (A8.milliarden - A8.chatgpt + 0.2) / 2, A8.milliarden - A8.chatgpt + 0.2) * 2.5)} />
        <Kapitaelchen style={{left: 200, top: 394, ...rein(p(t, A8.tag - 0.1, 0.4), 10)}} farbe={GRUEN_D}>
          Anfragen pro Tag
        </Kapitaelchen>

        <Gezeichnet d={`M200,${KNOTEN.y} H${KNOTEN.x}`} q={haupt} dicke={8} laenge={1000} />
        {haupt >= 1
          ? Array.from({length: 6}, (_, i) => {
              const q = ((t * 0.45 + i / 6) % 1 + 1) % 1;
              return <div key={i} style={{position: 'absolute', left: 200 + q * (KNOTEN.x - 200) - 7, top: KNOTEN.y - 7, width: 14, height: 14, borderRadius: 7, background: GRUEN}} />;
            })
          : null}
        {ZUFLUESSE.map((z) => {
          const q = p(t, z.an - 0.1, 0.9, 'inOut');
          return (
            <React.Fragment key={z.name}>
              <Gezeichnet d={`M200,${z.y} C700,${z.y} ${KNOTEN.x - 380},${KNOTEN.y} ${KNOTEN.x},${KNOTEN.y}`} q={q} dicke={4} laenge={1100} farbe="#B9BEC7" />
              <Kapitaelchen style={{left: 200, top: z.y - 36, ...rein(p(t, z.an - 0.1, 0.4), 8)}}>{z.name}</Kapitaelchen>
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: KNOTEN.x - 22, top: KNOTEN.y - 22, width: 44, height: 44, borderRadius: 22, background: GRUEN, opacity: haupt, boxShadow: `0 0 0 ${10 + 8 * raus7}px rgba(14,159,142,0.15)`}} />
        <Gezeichnet d={`M${KNOTEN.x},${KNOTEN.y} H1960`} q={raus7} dicke={14} laenge={800} />
      </div>

      <div style={{...EBENE, opacity: chips}}>
        <Kapitaelchen style={{left: 1240, top: 150}} farbe={GRUEN_D}>
          Training
        </Kapitaelchen>
        <ChipRaster x={1240} y={204} spalten={10} zeilen={4} size={34} abstand={14} licht={welle} />
        <div style={{position: 'absolute', left: 1240, top: 418, fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2, ...rein(p(t, A8.zehntausenden, 0.45), 10)}}>
          zehntausende Chips
          <br />
          <span style={{color: SOFT, fontWeight: 600}}>Wochen bis Monate</span>
        </div>
      </div>
    </>
  );
};

/* ═════════════ 8 · Rechenzentren ═════════════ */

const KARTE_D: Kartenrahmen = {lon: [5.85, 15.1], lat: [47.25, 55.1], x: 1330, y: 150, h: 560};

export const Station8: React.FC<{t: number}> = ({t}) => {
  const halle = p(t, S[8] - 0.2, 1.8, 'inOut');
  const zahl = 485 * p(t, A9.alle + 0.4, A9.v485 - A9.alle + 0.1, 'inOut');
  const dWeg = raus(t, A9.speziell - 0.2, 0.5);
  const dZeichnen = p(t, A9.deutschland - 0.2, 1.2, 'inOut');
  const ki = p(t, A9.speziell + 0.5, A9.v50 - A9.speziell, 'inOut');
  return (
    <>
      <Serverhalle x={160} boden={BODEN} w={760} h={320} t={t} aufbau={halle} reihen={4} />
      <Kapitaelchen style={{left: 170, top: 176, ...rein(p(t, A9.alle - 0.1, 0.4), 10)}}>Alle Rechenzentren der Welt · 2025</Kapitaelchen>
      <GrosseZahl wert={zahl} size={190} einheit="TWh" style={{left: 156, top: 214, opacity: p(t, A9.alle + 0.3, 0.3)}} unschaerfe={Math.min(2, puls(t, A9.alle + 0.4 + (A9.v485 - A9.alle) / 2, A9.v485 - A9.alle) * 2)} />
      {[
        {text: 'Cloud', an: A9.cloud, x: 190},
        {text: 'Streaming', an: A9.streaming, x: 360},
        {text: 'Webseiten', an: A9.webseiten, x: 580},
      ].map((g) => (
        <Kapitaelchen key={g.text} style={{left: g.x, top: 540, ...rein(p(t, g.an - 0.1, 0.4), 10), opacity: p(t, g.an - 0.1, 0.4) * mix(1, 0.5, p(t, A9.schnellsten, 0.4))}}>
          {g.text}
        </Kapitaelchen>
      ))}
      <div style={{position: 'absolute', left: 800, top: 520, fontSize: 52, fontWeight: 800, color: GRUEN, transform: `scale(${1 + 0.25 * p(t, A9.schnellsten, 0.6)})`, transformOrigin: '0 100%', ...rein(p(t, A9.schnellsten - 0.3, 0.4), 10)}}>KI</div>

      {dWeg > 0 ? (
        <div style={{...EBENE, opacity: dWeg}}>
          <Gezeichnet d={kartenPfad(DEUTSCHLAND, KARTE_D)} q={dZeichnen} dicke={5} laenge={2600} fill={GRUEN_T} fillQ={p(t, A9.deutschland + 0.6, 0.6)} />
          <Kapitaelchen style={{left: 1310, top: 744, ...rein(p(t, A9.deutschland + 0.4, 0.4), 10)}}>Deutschland · ganzes Jahr</Kapitaelchen>
          <GrosseZahl wert={526} size={150} einheit="TWh" style={{left: 1300, top: 780, ...rein(p(t, A9.deutschland + 0.6, 0.45), 10)}} />
        </div>
      ) : null}

      <div style={{...EBENE, ...rein(p(t, A9.speziell + 0.4, 0.4), 20)}}>
        <Kapitaelchen style={{left: 1250, top: 280}} farbe={GRUEN_D}>
          Rechenzentren speziell für KI
        </Kapitaelchen>
        <GrosseZahl wert={50 * ki} size={220} vor="+" einheit="%" farbe={GRUEN} style={{left: 1236, top: 320}} />
        <Kapitaelchen style={{left: 1250, top: 570, fontSize: 22}}>Strom 2025 gegenüber 2024</Kapitaelchen>
      </div>
    </>
  );
};

/* ═════════════ 9 · Bis 2030 ═════════════ */

export const Station9: React.FC<{t: number}> = ({t}) => {
  const x0 = 380;
  const x1 = 1100;
  const y = (v: number) => 820 - (v / 1000) * 600;
  const achsen = p(t, S[9] - 0.2, 0.8, 'inOut');
  const linie = p(t, A10.j2030 - 0.1, A10.v950 - A10.j2030 + 0.4, 'inOut');
  const ki = p(t, A10.teil, A10.verdreifachen - A10.teil + 0.6, 'inOut');
  const wert = mix(485, 950, linie);
  const kiWert = mix(155, 465, ki);
  const lx = mix(x0, x1, linie);
  const kx = mix(x0, x1, ki);
  return (
    <>
      <Kapitaelchen style={{left: 300, top: 110, opacity: achsen}}>Strom für Rechenzentren · TWh pro Jahr · Prognose IEA</Kapitaelchen>
      <Strich x={300} y={820} w={1240} q={achsen} farbe="#CFCBC2" dicke={4} />
      {[
        {j: '2025', x: x0},
        {j: '2030', x: x1},
      ].map((a) => (
        <div key={a.j} style={{position: 'absolute', left: a.x - 60, width: 120, textAlign: 'center', top: 844, fontSize: 30, fontWeight: 700, color: a.j === '2030' ? INK : SOFT, opacity: achsen}}>
          {a.j}
        </div>
      ))}
      {/* KI-Anteil */}
      {ki > 0 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <path d={`M${x0},820 V${y(155)} L${kx},${y(kiWert)} V820 Z`} fill={GRUEN} opacity={0.22} />
          <path d={`M${x0},${y(155)} L${kx},${y(kiWert)}`} stroke={GRUEN} strokeWidth={6} strokeLinecap="round" />
        </svg>
      ) : null}
      {/* Alle Rechenzentren */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: achsen}}>
        <path d={`M${x0},${y(485)} L${lx},${y(wert)}`} stroke={INK} strokeWidth={6} strokeLinecap="round" strokeDasharray={linie > 0 ? '2 16' : undefined} />
        <circle cx={x0} cy={y(485)} r={13} fill={INK} />
        {linie > 0.02 ? <circle cx={lx} cy={y(wert)} r={13} fill={INK} /> : null}
      </svg>
      <div style={{position: 'absolute', left: x0 - 20, top: y(485) - 90, fontSize: 52, fontWeight: 800, color: SOFT, opacity: achsen}}>485</div>
      <GrosseZahl wert={wert} size={150} einheit="TWh" style={{left: lx + 34, top: y(wert) - 75, opacity: linie}} />
      <Kapitaelchen style={{left: x0 + 40, top: y(485) + 34, opacity: linie}}>Alle Rechenzentren</Kapitaelchen>
      <div style={{position: 'absolute', left: kx + 30, top: y(kiWert) - 40, display: 'flex', alignItems: 'baseline', gap: 14, opacity: ki}}>
        <span style={{fontSize: 130, fontWeight: 800, color: GRUEN, letterSpacing: '-0.03em'}}>×3</span>
        <span style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: GRUEN_D}}>KI</span>
      </div>
      <Kapitaelchen style={{left: x0 + 40, top: 740, opacity: ki}} farbe={GRUEN_D}>
        KI-Rechenzentren
      </Kapitaelchen>
    </>
  );
};

/* ═════════════ 10 · Wo es eng wird ═════════════ */

const KARTE_I: Kartenrahmen = {lon: [-10.6, -5.3], lat: [51.35, 55.45], x: 400, y: 170, h: 640};
const DUBLIN = projiziere(KARTE_I)([-6.35, 53.35]);
const BLOECKE = Array.from({length: 16}, (_, i) => ({
  dx: ((i * 37) % 9) * 11 - 44 + (i % 2) * 6,
  dy: (Math.floor(i / 4) - 1.5) * 22 + ((i * 13) % 5) * 3,
  sx: ((i * 211) % 1700) + 100,
  sy: ((i * 97) % 600) + 150,
}));

export const Station10: React.FC<{t: number}> = ({t}) => {
  const sammeln = p(t, A11.eng + 0.3, A11.fleck - A11.eng + 0.4, 'inOut');
  const umriss = p(t, A11.eng - 0.3, 1.4, 'inOut');
  const pegel = p(t, A11.viertel - 0.4, 1.3, 'inOut');
  const anteil = 23 * pegel;
  const pr = projiziere(KARTE_I);
  const oben = pr([-8, 55.4])[1];
  const unten = pr([-8, 51.4])[1];
  const pegelY = mix(unten, oben, 0.23 * pegel);
  const balken = p(t, A11.haushalte - 0.2, 0.8, 'inOut');
  return (
    <>
      {umriss > 0 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id="irland-clip">
              <path d={kartenPfad(IRLAND, KARTE_I)} />
            </clipPath>
          </defs>
          <path d={kartenPfad(NORDIRLAND, KARTE_I)} fill="#ECEAE4" stroke="#D9D5CB" strokeWidth={3} strokeLinejoin="round" opacity={umriss} />
          <path d={kartenPfad(IRLAND, KARTE_I)} fill={GRUEN_T2} opacity={umriss} />
          <rect x={300} y={pegelY} width={800} height={unten - pegelY + 40} fill={GRUEN} opacity={0.45} clipPath="url(#irland-clip)" />
        </svg>
      ) : null}
      <Gezeichnet d={kartenPfad(IRLAND, KARTE_I)} q={umriss} dicke={5} laenge={2600} />
      {BLOECKE.map((b, i) => {
        const q = clamp01(sammeln * 1.25 - (i % 5) * 0.06);
        const x = mix(b.sx, DUBLIN[0] + b.dx, EASE.inOut(q));
        const y = mix(b.sy, DUBLIN[1] + b.dy, EASE.inOut(q));
        return <div key={i} style={{position: 'absolute', left: x - 10, top: y - 7, width: 20, height: 14, borderRadius: 4, background: GRUEN_D, boxShadow: '0 0 0 3px rgba(255,255,255,0.8)', opacity: p(t, A11.eng - 0.2 + i * 0.03, 0.3)}} />;
      })}
      <Kapitaelchen style={{left: DUBLIN[0] + 56, top: DUBLIN[1] - 14, opacity: p(t, A11.fleck, 0.4)}}>Dublin</Kapitaelchen>

      <div style={{...EBENE, ...rein(p(t, A11.irland, 0.45), 16)}}>
        <Kapitaelchen style={{left: 1060, top: 250}} farbe={GRUEN_D}>
          Irland · Strom für Rechenzentren
        </Kapitaelchen>
        <GrosseZahl wert={anteil} size={220} einheit="%" style={{left: 1046, top: 290, opacity: p(t, A11.viertel - 0.5, 0.3)}} />
      </div>
      <div style={{position: 'absolute', left: 1060, top: 560, opacity: balken}}>
        {[
          {text: 'Rechenzentren', wert: 23, farbe: GRUEN, zahl: false},
          {text: 'Alle Haushalte', wert: 27, farbe: '#B9BEC7', zahl: true},
        ].map((b, i) => (
          <div key={b.text} style={{position: 'absolute', left: 0, top: i * 84}}>
            <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: SOFT, textTransform: 'uppercase'}}>
              {b.zahl ? `${b.text} · ${b.wert} %` : b.text}
            </div>
            <div style={{marginTop: 8, height: 22, width: b.wert * 22 * balken, borderRadius: 11, background: b.farbe}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 1060, top: 760, fontSize: 30, fontWeight: 700, color: INK, ...rein(p(t, A11.virginia - 0.1, 0.45), 10)}}>
        Virginia (USA): <span style={{color: GRUEN_D}}>über 25 %</span>
      </div>
    </>
  );
};

/* ═════════════ 11 · Atomstrom für KI ═════════════ */

export const HALLE11 = {x: 1470, w: 360, h: 230};

export const Station11: React.FC<{t: number}> = ({t}) => {
  const tuerme = p(t, A12.deshalb - 0.4, 1.2);
  const kabel = p(t, A12.strom - 0.3, 0.8, 'inOut');
  const licht = mix(0.15, 1, p(t, A12.strom + 0.4, 0.6));
  const zeit = p(t, A12.ausgerechnet, 0.8, 'inOut');
  const iowa = p(t, A12.google - 0.1, 0.9);
  const tx = (j: number) => mix(380, 1560, (j - 1979) / (2027 - 1979));
  return (
    <>
      <Kuehlturm cx={330} boden={BODEN} h={250} t={t} wachsen={iowa} dampf={0.7} seed={5} />
      <Kapitaelchen style={{left: 230, top: BODEN - 320, width: 200, textAlign: 'center', ...rein(iowa, 10)}}>Google · Iowa</Kapitaelchen>
      <Kuehlturm cx={760} boden={BODEN} h={520} t={t} wachsen={tuerme} seed={3} />
      <Kuehlturm cx={1080} boden={BODEN} h={560} t={t} wachsen={p(t, A12.deshalb - 0.1, 1.2)} seed={4} />
      <Serverhalle x={HALLE11.x} boden={BODEN} w={HALLE11.w} h={HALLE11.h} t={t} reihen={3} aufbau={p(t, A12.microsoft - 0.4, 0.8)} licht={licht} />
      <Kapitaelchen style={{left: HALLE11.x, top: BODEN - HALLE11.h - 110, ...rein(p(t, A12.microsoft - 0.1, 0.4), 10)}} farbe={GRUEN_D}>
        Microsoft
      </Kapitaelchen>
      <div style={{position: 'absolute', left: HALLE11.x, top: BODEN - HALLE11.h - 78, fontSize: 34, fontWeight: 700, color: INK, ...rein(p(t, A12.zwanzig - 0.1, 0.4), 10)}}>
        Vertrag über 20 Jahre
      </div>
      <Gezeichnet d={`M1250,${BODEN - 40} C1330,${BODEN - 40} 1390,${BODEN - 80} ${HALLE11.x},${BODEN - 80}`} q={kabel} dicke={8} laenge={260} />
      <Puls q={clamp01((t - A12.strom - 0.4) / 0.7)} pts={[1250, BODEN - 40, 1330, BODEN - 40, 1390, BODEN - 80, HALLE11.x, BODEN - 80]} />
      <Kapitaelchen style={{left: 600, top: BODEN - 300, width: 640, textAlign: 'center', ...rein(p(t, A12.three - 0.1, 0.45), 10)}} farbe={INK}>
        Three Mile Island · Block 1
      </Kapitaelchen>

      {/* Zeitleiste 1979 → 2027 */}
      <Strich x={380} y={190} w={1180} q={zeit} farbe="#CFCBC2" dicke={4} />
      {[
        {j: 1979, text: 'Unfall in Block 2', an: A12.j1979, farbe: SOFT},
        {j: 2027, text: 'Neustart geplant', an: A12.j2027, farbe: GRUEN},
      ].map((m) => {
        const q = p(t, m.an - 0.2, 0.45);
        return (
          <div key={m.j} style={{position: 'absolute', left: tx(m.j) - (m.j === 2027 ? 380 : 0), top: 120, width: 380, textAlign: m.j === 2027 ? 'right' : 'left', opacity: q}}>
            <div style={{position: 'absolute', left: m.j === 2027 ? 368 : -12, top: 58, width: 24, height: 24, borderRadius: 12, background: m.farbe}} />
            <div style={{fontSize: 52, fontWeight: 800, color: m.j === 2027 ? GRUEN : INK, letterSpacing: '-0.02em', transform: `translateY(${(1 - q) * -14}px)`}}>{m.j}</div>
            <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: m.farbe, textTransform: 'uppercase', marginTop: 34}}>{m.text}</div>
          </div>
        );
      })}
    </>
  );
};

/* ═════════════ 12 · Wasser ═════════════ */

export const Station12: React.FC<{t: number}> = ({t}) => {
  const tropfen = p(t, S[12] - 0.2, 0.6);
  const teilen = p(t, A13.gekuehlt, 1.0, 'inOut');
  const glas = p(t, A13.google - 0.2, 0.5);
  const flasche = p(t, A13.vielleicht, 0.5);
  const fuell = p(t, A13.flasche - 0.2, 1.4, 'inOut') * 0.95;
  const ungleich = p(t, A13.beide - 0.1, 0.5);
  return (
    <>
      {/* Der große Tropfen teilt sich */}
      {teilen < 1 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: tropfen * (1 - teilen)}}>
          <path d={tropfenPfad(mix(960, 560, teilen), mix(430, 640, teilen) + Math.sin(t * 2.4) * 6, mix(70, 26, teilen))} fill={GRUEN} opacity={0.8} />
          <path d={tropfenPfad(mix(960, 1180, teilen), mix(430, 640, teilen) + Math.sin(t * 2.4) * 6, mix(70, 26, teilen))} fill={GRUEN} opacity={0.8 * Math.min(1, teilen * 4)} />
        </svg>
      ) : null}

      <div style={{...EBENE, opacity: glas}}>
        <Glas cx={560} boden={820} fuell={0.06 * p(t, A13.fuenf + 1.2, 0.4)} />
        {Array.from({length: 5}, (_, i) => {
          const s = A13.fuenf + i * 0.22;
          const q = clamp01((t - s) / 0.5);
          if (q <= 0 || q >= 1) return null;
          return (
            <svg key={i} width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <path d={tropfenPfad(560 + (i - 2) * 8, mix(470, 790, EASE.in(q)), 12)} fill={GRUEN} />
            </svg>
          );
        })}
        <Kapitaelchen style={{left: 400, top: 364}} farbe={GRUEN_D}>
          Google · pro Textfrage
        </Kapitaelchen>
        <GrosseZahl wert={0.26} dezimalen={2} size={140} einheit="ml" vor="≈" style={{left: 380, top: 400}} />
        <Kapitaelchen style={{left: 470, top: 850, ...rein(p(t, A13.fuenf + 0.4, 0.4), 8)}}>≈ 5 Tropfen</Kapitaelchen>
        <div style={{position: 'absolute', left: 330, top: 896, width: 460, textAlign: 'center', fontSize: 22, fontWeight: 700, color: SOFT, letterSpacing: '0.04em', opacity: ungleich}}>nur Kühlung im Rechenzentrum</div>
      </div>

      <div style={{...EBENE, opacity: flasche}}>
        <Flasche cx={1180} boden={880} h={420} fuell={fuell} />
        <Kapitaelchen style={{left: 1340, top: 364}}>2024 · pro E-Mail</Kapitaelchen>
        <GrosseZahl wert={0.5} dezimalen={1} size={140} einheit="l" vor="≈" style={{left: 1330, top: 400, opacity: p(t, A13.flasche, 0.4)}} />
        {[
          {text: 'ganze E-Mail', an: A13.komplette},
          {text: 'älteres Modell (GPT-4)', an: A13.aelteren},
          {text: '+ Wasser im Kraftwerk', an: A13.kraftwerken},
        ].map((m, i) => (
          <div key={m.text} style={{position: 'absolute', left: 1340, top: 590 + i * 56, fontSize: 32, fontWeight: 700, whiteSpace: 'nowrap', color: i === 2 ? GRUEN_D : INK, ...rein(p(t, m.an - 0.1, 0.4), 10)}}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 930, top: 470, fontSize: 200, fontWeight: 300, color: GRUEN, opacity: ungleich, transform: `scale(${0.8 + 0.2 * ungleich})`}}>≠</div>
    </>
  );
};

/* ═════════════ 13 · Was heißt das für dich? ═════════════ */

export const SPALTEN = [380, 960, 1540];

export const Station13: React.FC<{t: number}> = ({t}) => {
  const da = p(t, S[13] - 0.1, 0.5);
  const aktiv = t >= A14.drittens - 0.2 ? 2 : t >= A14.zweitens - 0.2 ? 1 : t >= A14.erstens - 0.2 ? 0 : -1;
  const hell = (i: number) => (t >= A15.halten - 1 ? 1 : i === aktiv ? 1 : i < aktiv ? 0.45 : 0.25);
  const kopf = (i: number, label: string) => (
    <>
      <div style={{position: 'absolute', left: SPALTEN[i] - 200, width: 400, top: 120, textAlign: 'center', fontSize: 120, fontWeight: 800, color: i === aktiv ? GRUEN : '#C9CDD3', lineHeight: 1}}>{i + 1}</div>
      <Kapitaelchen style={{left: SPALTEN[i] - 270, width: 540, textAlign: 'center', top: 262}} farbe={i === aktiv ? INK : GRAU}>
        {label}
      </Kapitaelchen>
    </>
  );
  return (
    <>
      <div style={{...EBENE, opacity: hell(0) * da}}>
        {kopf(0, 'Normale Fragen: entspannt')}
        <Wasserkocher cx={SPALTEN[0]} boden={600} k={0.95} an={p(t, A14.liter, 0.3)} t={t} />
        <div style={{position: 'absolute', left: SPALTEN[0] - 250, width: 500, top: 612, textAlign: 'center', whiteSpace: 'nowrap', fontSize: 44, fontWeight: 800, color: INK, ...rein(p(t, A14.v300 - 0.2, 0.4), 10)}}>
          Tee &gt; <span style={{color: GRUEN}}>300 Fragen</span>
        </div>
      </div>
      <div style={{...EBENE, opacity: hell(1) * da}}>
        {kopf(1, 'Bild · Video · Dokument: bewusst')}
        <Filmklappe x={SPALTEN[1] - 200} y={380} w={230} offen={0.7 - 0.7 * p(t, A14.zweitens + 0.9, 0.12)} rot={-4} />
        <Papierstapel x={SPALTEN[1] + 60} y={340} w={150} blaetter={12} rot={5} />
      </div>
      <div style={{...EBENE, opacity: hell(2) * da}}>
        {kopf(2, 'Woher kommt der Strom?')}
        <Steckdose cx={SPALTEN[2]} cy={400} s={130} />
        {[
          {art: 'kohle' as const, x: -215, an: A14.kohle, gruen: false},
          {art: 'gas' as const, x: -105, an: A14.gas, gruen: false},
          {art: 'sonne' as const, x: 40, an: A14.sonne, gruen: true},
          {art: 'wind' as const, x: 140, an: A14.wind, gruen: true},
          {art: 'atom' as const, x: 240, an: A14.atom, gruen: true},
        ].map((q) => {
          const r = p(t, q.an - 0.15, 0.45);
          return (
            <div key={q.art} style={{...EBENE, opacity: r, transform: `translateY(${(1 - r) * 20}px)`}}>
              <Gezeichnet d={`M${SPALTEN[2]},${465} C${SPALTEN[2]},${530} ${SPALTEN[2] + q.x},${510} ${SPALTEN[2] + q.x},${548}`} q={r} dicke={4} laenge={200} farbe={q.gruen ? GRUEN : '#B9BEC7'} />
              <Quelle art={q.art} cx={SPALTEN[2] + q.x} boden={650} t={t} farbe={q.gruen ? GRUEN : '#9AA0AB'} s={0.62} />
            </div>
          );
        })}
        <Kapitaelchen style={{left: SPALTEN[2] - 270, top: 664, ...rein(p(t, A14.gas, 0.4), 6)}}>viel CO₂</Kapitaelchen>
        <Kapitaelchen style={{left: SPALTEN[2] + 30, top: 664, ...rein(p(t, A14.atom, 0.4), 6)}} farbe={GRUEN_D}>
          wenig CO₂
        </Kapitaelchen>
      </div>
    </>
  );
};

/* ═════════════ 14 · Ende ═════════════ */

export const KNOPF = {cx: 1000, cy: 760};

export const Station14: React.FC<{t: number}> = ({t}) => {
  const eins = p(t, A15.halten, 0.5) * raus(t, A15.wenn, 0.5);
  const klein = p(t, A15.winzig - 0.1, 0.5, 'inOut');
  const viele = p(t, A15.milliarden - 0.2, 2.0, 'inOut');
  const dimm = mix(1, 0.2, p(t, A15.wenn, 0.8, 'inOut'));
  const knopf = p(t, A15.abonnieren - 1.0, 0.5);
  return (
    <>
      <div style={{...EBENE, opacity: dimm}}>
        <Punktefeld x={-24} y={36} spalten={82} zeilen={36} dx={24} dy={24} r={5} q={viele} radial farbe={GRUEN} />
      </div>
      <div style={{position: 'absolute', left: 960 - 16, top: 444 - 16, width: 32, height: 32, borderRadius: 16, background: GRUEN, opacity: eins, transform: `scale(${mix(1.6, 0.4, klein)})`, boxShadow: `0 0 0 ${18 * (1 - klein)}px rgba(14,159,142,0.15)`}} />
      <Kapitaelchen style={{left: 760, width: 400, textAlign: 'center', top: 372, opacity: eins * raus(t, A15.milliarden, 0.4)}} farbe={GRUEN_D}>
        1 Frage
      </Kapitaelchen>
      <div style={{position: 'absolute', left: 0, width: 1920, textAlign: 'center', top: 220, fontSize: 64, fontWeight: 800, letterSpacing: '-0.025em', color: INK, ...rein(p(t, A15.wenn + 0.3, 0.6), 20)}}>
        KI verstehen – <span style={{color: SOFT, fontWeight: 600}}>ohne Panik, ohne Hype</span>
      </div>
      <AboKnopf cx={KNOPF.cx} cy={KNOPF.cy} q={knopf} gedrueckt={clamp01((t - A15.abonnieren) / 0.3)} />
      <div style={{position: 'absolute', left: 0, width: 1920, textAlign: 'center', top: 990, fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: GRAU, opacity: p(t, A15.toki, 0.6)}}>
        QUELLEN IN DER BESCHREIBUNG
      </div>
    </>
  );
};

export const STATIONEN = [Station0, Station1, Station2, Station3, Station4, Station5, Station6, Station7, Station8, Station9, Station10, Station11, Station12, Station13, Station14];

/* ═════════════ Kapitel & Quellen ═════════════ */

export const KAPITEL: (string | null)[] = [
  null,
  null,
  'Eine Frage',
  'Zum Vergleich',
  'Die alte Zahl',
  'Lange Dokumente',
  'Bilder & Video',
  'Die Masse',
  'Rechenzentren',
  'Bis 2030',
  'Wo es eng wird',
  'Atomstrom für KI',
  'Und das Wasser?',
  'Was heißt das für dich?',
  null,
];

export const QUELLEN: (string | null)[] = [
  'Schätzung 2023: Alex de Vries · Neubewertung: Epoch AI, Feb. 2025',
  'Microsoft & Constellation, Sept. 2024 · Google & NextEra, Okt. 2025',
  'Google, Aug. 2025 · Sam Altman, Juni 2025 · Epoch AI, Feb. 2025',
  'Eigene Rechnung: LED 10 W, Fernseher ≈ 100 W, Wasserkocher 0,115 kWh pro Liter (Stiftung Warentest)',
  'Epoch AI, Feb. 2025 · Google, Aug. 2025',
  'Epoch AI, Feb. 2025 (Eingabe mit ca. 100.000 Tokens)',
  'MIT Technology Review, Mai 2025 (Stable Diffusion 3 Medium, CogVideoX)',
  'OpenAI über Axios, Juli 2025',
  'IEA, Key Questions on Energy and AI, April 2026 · Umweltbundesamt, Mai 2026',
  'IEA, April 2026 – Prognose',
  'CSO Irland, Juli 2026 · Our World in Data, Juli 2026',
  'Constellation/Microsoft, Sept. 2024 · NextEra/Google, Okt. 2025',
  'Google, Aug. 2025 · UC Riverside für die Washington Post, 2024',
  null,
  null,
];
