import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, E, Lucide, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';

/**
 * Helle Flaechen fuer das Longform-Video.
 *
 * Das Fundament kommt aus `@studio/core`: Easing-Kurven (`E`), Fortschritt
 * (`prog`) und die Lucide-Icons. Die Flaechen selbst sind hier hell gehalten —
 * die fertigen Bausteine im Brand-Kit sind auf dunkle Hintergruende gebaut,
 * und der Kanal ist seit Juli weiss. Was farbneutral ist, wird uebernommen;
 * was dunkel ist, wird hier hell nachgezogen, ohne `core/` anzufassen.
 *
 * Gegenueber der ersten Fassung faellt viel weg: keine selbstgemalten Icons
 * mehr (3474 Lucide-Icons stehen bereit), kein eigenes Raster, keine eigenen
 * Easings.
 */

const purple = BRAND.accentDk;
const accent = BRAND.accent;
const ink = BRAND.ink;
const muted = '#8D8197';
const green = '#2E7D51';
const red = '#C0485A';
const hair = 'rgba(26,26,46,.09)';

const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const sans = BRAND.font.body;

export type Tone = 'on' | 'off' | 'good' | 'bad';
export const toneColor = (t: Tone = 'on') =>
  t === 'good' ? green : t === 'bad' ? red : t === 'off' ? muted : purple;

export type PanelProps = {at: number; width?: number; tone?: Tone};

/**
 * Karte, auf der alles sitzt.
 *
 * Auftritt ueber `E.out` — dieselbe Kurve, die Remotion selbst empfiehlt
 * (`Easing.bezier(0.16, 1, 0.3, 1)`). Danach atmet sie weiter, damit nie ein
 * totes Rechteck im Bild steht.
 */
const Karte: React.FC<{
  at: number;
  width: number;
  kopf?: {icon: string; text: string; tone?: Tone};
  dunkel?: boolean;
  seed?: number;
  children: React.ReactNode;
}> = ({at, width, kopf, dunkel, seed = 0, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 26, E.out);
  const atem = Math.sin((f / 170) * Math.PI * 2 + seed) * 0.004;
  if (f < at - 2) return null;
  return (
    <div
      style={{
        width,
        background: dunkel ? '#1A1922' : '#fff',
        border: `1px solid ${dunkel ? 'rgba(255,255,255,.10)' : hair}`,
        borderRadius: 20,
        boxShadow: dunkel ? '0 26px 60px rgba(26,26,46,.22)' : '0 22px 56px rgba(26,26,46,.10)',
        overflow: 'hidden',
        opacity: p,
        translate: `0px ${(1 - p) * 20}px`,
        scale: 1 + atem,
      }}
    >
      {kopf ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 22px',
            borderBottom: `1px solid ${dunkel ? 'rgba(255,255,255,.08)' : hair}`,
            background: dunkel ? 'rgba(255,255,255,.03)' : '#FBFAFD',
          }}
        >
          <Lucide
            name={kopf.icon}
            size={26}
            color={dunkel ? accent : toneColor(kopf.tone)}
            stroke={2.2}
            glow={false}
          />
          <div
            style={{
              fontFamily: sans,
              fontWeight: 750,
              fontSize: 22,
              color: dunkel ? 'rgba(255,255,255,.7)' : muted,
            }}
          >
            {kopf.text}
          </div>
        </div>
      ) : null}
      <div style={{padding: 24}}>{children}</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */

/** Chat: die Frage wird getippt, die Antwort laeuft ein — und hoert auf. */
export const Chat: React.FC<PanelProps & {frage: string; zeilen?: number; wartet?: boolean}> = ({
  at, width = 640, frage, zeilen = 3, wartet,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(frage.length, Math.floor((f - at - 10) * 1.8)));
  const antwortAb = at + 14 + frage.length / 1.8;
  return (
    <Karte at={at} width={width} kopf={{icon: 'message-square', text: 'Chat'}} seed={1}>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 20}}>
        <div style={{
          maxWidth: '84%', background: 'rgba(185,140,255,.14)',
          border: '1px solid rgba(110,69,201,.18)', borderRadius: '18px 18px 5px 18px',
          padding: '15px 20px', fontFamily: sans, fontWeight: 650, fontSize: 26,
          color: ink, lineHeight: 1.32,
        }}>
          {frage.slice(0, n)}
          {n < frage.length && Math.floor(f / 8) % 2 === 0 ? <span style={{color: purple}}>|</span> : null}
        </div>
      </div>
      <div style={{display: 'flex', gap: 14}}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: purple,
          opacity: prog(f, antwortAb, antwortAb + 12, E.out),
        }} />
        <div style={{flex: 1}}>
          {Array.from({length: zeilen}).map((_, i) => (
            <div key={i} style={{
              height: 14, borderRadius: 7, background: '#DED7E6',
              marginTop: i === 0 ? 5 : 12,
              width: `${[96, 82, 68, 90][i % 4] * prog(f, antwortAb + 6 + i * 9, antwortAb + 22 + i * 9, E.out)}%`,
            }} />
          ))}
          {wartet ? (
            <div style={{
              marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: sans, fontWeight: 700, fontSize: 21, color: muted,
              opacity: prog(f, antwortAb + 44, antwortAb + 60, E.out),
            }}>
              <Lucide name="pause" size={20} color={muted} stroke={2.4} glow={false} />
              wartet auf deine nächste Eingabe
            </div>
          ) : null}
        </div>
      </div>
    </Karte>
  );
};

/** Log: Schritte laufen ein und bekommen nacheinander ihren Haken. */
export const Log: React.FC<PanelProps & {schritte: string[]; proSchritt?: number; titel?: string}> = ({
  at, width = 680, schritte, proSchritt = 32, titel = 'agent',
}) => {
  const f = useCurrentFrame();
  const dreh = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'][Math.floor(f / 3) % 8];
  return (
    <Karte at={at} width={width} kopf={{icon: 'terminal', text: titel}} dunkel seed={2}>
      {schritte.map((s, i) => {
        const a = at + 16 + i * proSchritt;
        if (f < a) return <div key={s} style={{height: 38}} />;
        const fertig = f >= a + proSchritt - 8;
        return (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 14, height: 38,
            fontFamily: mono, fontSize: 23,
            color: fertig ? 'rgba(255,255,255,.52)' : '#fff',
            opacity: prog(f, a, a + 10, E.out),
            translate: `${(1 - prog(f, a, a + 12, E.out)) * -14}px 0px`,
          }}>
            <span style={{width: 22, color: fertig ? '#6BB77B' : accent}}>{fertig ? '✓' : dreh}</span>
            <span>{s}</span>
          </div>
        );
      })}
    </Karte>
  );
};

/** Dateien mit Namen, Groesse und Status. */
export const Dateien: React.FC<PanelProps & {
  dateien: {name: string; groesse?: string; status?: 'ok' | 'konflikt'}[];
  titel?: string;
}> = ({at, width = 600, dateien, titel = 'Dokumente'}) => {
  const f = useCurrentFrame();
  return (
    <Karte at={at} width={width} kopf={{icon: 'folder-open', text: titel}} seed={3}>
      {dateien.map((d, i) => {
        const a = at + 16 + i * 13;
        const p = prog(f, a, a + 18, E.out);
        const farbe = d.status === 'konflikt' ? red : d.status === 'ok' ? green : muted;
        return (
          <div key={d.name} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '15px 4px',
            borderBottom: i < dateien.length - 1 ? `1px solid ${hair}` : 'none',
            opacity: p, translate: `${(1 - p) * -18}px 0px`,
          }}>
            <Lucide name="file-text" size={28} color={farbe} stroke={1.9} glow={false} />
            <div style={{flex: 1, fontFamily: mono, fontSize: 23, color: ink}}>{d.name}</div>
            {d.groesse ? (
              <div style={{fontFamily: mono, fontSize: 21, color: muted}}>{d.groesse}</div>
            ) : null}
            {d.status ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: sans, fontWeight: 780, fontSize: 19, color: farbe,
                background: d.status === 'konflikt' ? '#FCEEF0' : '#EAF6EF',
                padding: '6px 13px', borderRadius: 999,
                opacity: prog(f, a + 12, a + 26, E.out),
              }}>
                <Lucide name={d.status === 'konflikt' ? 'triangle-alert' : 'check'}
                  size={17} color={farbe} stroke={2.6} glow={false} />
                {d.status === 'konflikt' ? 'Konflikt' : 'geprüft'}
              </div>
            ) : null}
          </div>
        );
      })}
    </Karte>
  );
};

/** Suche mit getippter Anfrage und einlaufenden Treffern. */
export const Suche: React.FC<PanelProps & {anfrage: string; treffer: string[]}> = ({
  at, width = 620, anfrage, treffer,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(anfrage.length, Math.floor((f - at - 12) * 1.8)));
  const trefferAb = at + 18 + anfrage.length / 1.8;
  return (
    <Karte at={at} width={width} kopf={{icon: 'search', text: 'Suche'}} seed={4}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 13,
        border: `1.5px solid ${n >= anfrage.length ? 'rgba(110,69,201,.3)' : hair}`,
        borderRadius: 13, padding: '15px 18px', background: '#FBFAFD',
      }}>
        <Lucide name="search" size={24} color={purple} stroke={2.4} glow={false} />
        <div style={{fontFamily: mono, fontSize: 24, color: ink}}>
          {anfrage.slice(0, n)}
          {n < anfrage.length && Math.floor(f / 8) % 2 === 0 ? <span style={{color: purple}}>|</span> : null}
        </div>
      </div>
      <div style={{marginTop: 18}}>
        {treffer.map((tr, i) => {
          const a = trefferAb + i * 11;
          const p = prog(f, a, a + 16, E.out);
          return (
            <div key={tr} style={{
              display: 'flex', alignItems: 'center', gap: 13, padding: '12px 4px',
              opacity: p, translate: `0px ${(1 - p) * 10}px`,
            }}>
              <Lucide name="file-search" size={22} color={accent} stroke={2.1} glow={false} />
              <div style={{fontFamily: sans, fontWeight: 650, fontSize: 23, color: ink}}>{tr}</div>
            </div>
          );
        })}
      </div>
    </Karte>
  );
};

/** Zwei Werte gegenueber, darunter das Fazit. */
export const Gegenueber: React.FC<PanelProps & {
  links: {titel: string; wert: string; zusatz?: string};
  rechts: {titel: string; wert: string; zusatz?: string};
  fazit?: string;
}> = ({at, width = 760, links, rechts, fazit}) => {
  const f = useCurrentFrame();
  const Seite = ({d, farbe, delay, icon}: {d: typeof links; farbe: string; delay: number; icon: string}) => {
    const p = prog(f, at + delay, at + delay + 22, E.out);
    return (
      <div style={{
        flex: 1, padding: '22px 24px', borderRadius: 16,
        background: farbe === red ? '#FDF2F4' : '#EFF8F3',
        border: `1.5px solid ${farbe}30`,
        opacity: p, translate: `0px ${(1 - p) * 14}px`,
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
          <Lucide name={icon} size={22} color={muted} stroke={2.2} glow={false} />
          <div style={{fontFamily: sans, fontWeight: 700, fontSize: 21, color: muted}}>{d.titel}</div>
        </div>
        <div style={{fontFamily: sans, fontWeight: 900, fontSize: 46, color: farbe, marginTop: 10}}>{d.wert}</div>
        {d.zusatz ? (
          <div style={{fontFamily: sans, fontWeight: 650, fontSize: 21, color: muted, marginTop: 5}}>{d.zusatz}</div>
        ) : null}
      </div>
    );
  };
  return (
    <Karte at={at} width={width} seed={5}>
      <div style={{display: 'flex', gap: 18}}>
        <Seite d={links} farbe={red} delay={10} icon="message-square-off" />
        <Seite d={rechts} farbe={green} delay={22} icon="workflow" />
      </div>
      {fazit ? (
        <div style={{
          marginTop: 20, textAlign: 'center',
          fontFamily: sans, fontWeight: 900, fontSize: 36, color: green,
          opacity: prog(f, at + 42, at + 62, E.out),
          scale: interpolate(prog(f, at + 42, at + 62, E.spring), [0, 1], [0.9, 1], CLAMP),
        }}>{fazit}</div>
      ) : null}
    </Karte>
  );
};

/** Werkzeuge mit Schaltern — was freigegeben ist und was nicht. */
export const Werkzeuge: React.FC<PanelProps & {
  werkzeuge: {name: string; icon: string; an: boolean; hinweis?: string}[];
  titel?: string;
}> = ({at, width = 620, werkzeuge, titel = 'Werkzeuge'}) => {
  const f = useCurrentFrame();
  return (
    <Karte at={at} width={width} kopf={{icon: 'wrench', text: titel}} seed={6}>
      {werkzeuge.map((w, i) => {
        const a = at + 16 + i * 13;
        const p = prog(f, a, a + 18, E.out);
        const kipp = prog(f, a + 10, a + 26, E.out);
        return (
          <div key={w.name} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '15px 4px',
            borderBottom: i < werkzeuge.length - 1 ? `1px solid ${hair}` : 'none',
            opacity: p,
          }}>
            <Lucide name={w.icon} size={26} color={w.an ? purple : muted} stroke={2.1} glow={false} />
            <div style={{flex: 1}}>
              <div style={{fontFamily: sans, fontWeight: 750, fontSize: 24, color: w.an ? ink : muted}}>{w.name}</div>
              {w.hinweis ? (
                <div style={{fontFamily: sans, fontWeight: 600, fontSize: 19, color: muted, marginTop: 3}}>{w.hinweis}</div>
              ) : null}
            </div>
            <div style={{
              width: 56, height: 31, borderRadius: 999, flexShrink: 0, position: 'relative',
              background: w.an ? `rgba(46,125,81,${0.14 + kipp * 0.1})` : '#EDEAF2',
              border: `1.5px solid ${w.an ? green : hair}`,
            }}>
              <div style={{
                position: 'absolute', top: 2.5, left: 2.5 + (w.an ? kipp * 24 : 0),
                width: 24, height: 24, borderRadius: 999,
                background: w.an ? green : '#C9C2D4',
              }} />
            </div>
          </div>
        );
      })}
    </Karte>
  );
};

/** Fortschritt: was erledigt ist, was offen. */
export const Fortschritt: React.FC<PanelProps & {
  eintraege: {text: string; fertig: boolean}[];
  titel?: string;
}> = ({at, width = 620, eintraege, titel = 'Stand der Arbeit'}) => {
  const f = useCurrentFrame();
  const anteil = eintraege.filter((e) => e.fertig).length / Math.max(1, eintraege.length);
  return (
    <Karte at={at} width={width} kopf={{icon: 'list-checks', text: titel}} seed={7}>
      <div style={{height: 11, borderRadius: 7, background: '#EDE8F3', overflow: 'hidden'}}>
        <div style={{
          height: '100%', borderRadius: 7,
          width: `${prog(f, at + 28, at + 68, E.out) * anteil * 100}%`,
          background: `linear-gradient(90deg, ${accent}, ${purple})`,
        }} />
      </div>
      <div style={{marginTop: 18}}>
        {eintraege.map((e, i) => {
          const a = at + 18 + i * 13;
          const p = prog(f, a, a + 18, E.out);
          return (
            <div key={e.text} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '11px 2px',
              opacity: p, translate: `${(1 - p) * -14}px 0px`,
            }}>
              <Lucide name={e.fertig ? 'square-check-big' : 'circle-slash'}
                size={25} color={e.fertig ? green : muted} stroke={2.2} glow={false} />
              <div style={{
                fontFamily: sans, fontWeight: 680, fontSize: 23,
                color: e.fertig ? muted : ink,
              }}>{e.text}</div>
            </div>
          );
        })}
      </div>
    </Karte>
  );
};

/** Fertiges Dokument mit lesbarem Text. */
export const Ergebnis: React.FC<PanelProps & {
  titel: string; zeilen: string[]; geprueft?: boolean;
}> = ({at, width = 640, titel, zeilen, geprueft}) => {
  const f = useCurrentFrame();
  return (
    <Karte at={at} width={width} kopf={{icon: 'file-check', text: 'Entwurf', tone: geprueft ? 'good' : 'on'}} seed={8}>
      <div style={{
        fontFamily: sans, fontWeight: 900, fontSize: 33, color: ink,
        opacity: prog(f, at + 14, at + 30, E.out),
      }}>{titel}</div>
      {zeilen.map((z, i) => {
        const a = at + 22 + i * 13;
        const p = prog(f, a, a + 20, E.out);
        return (
          <div key={z} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 15,
            opacity: p, translate: `0px ${(1 - p) * 9}px`,
          }}>
            <div style={{width: 7, height: 7, borderRadius: 999, background: accent, marginTop: 11, flexShrink: 0}} />
            <div style={{fontFamily: sans, fontWeight: 620, fontSize: 24, color: '#4A4356', lineHeight: 1.35}}>{z}</div>
          </div>
        );
      })}
      {geprueft ? (
        <div style={{
          marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#EAF6EF', border: `1px solid ${green}30`, borderRadius: 999,
          padding: '10px 18px',
          opacity: prog(f, at + 22 + zeilen.length * 13 + 10, at + 22 + zeilen.length * 13 + 28, E.out),
        }}>
          <Lucide name="check" size={19} color={green} stroke={2.8} glow={false} />
          <span style={{fontFamily: sans, fontWeight: 800, fontSize: 21, color: green}}>
            Anforderungen enthalten
          </span>
        </div>
      ) : null}
    </Karte>
  );
};

/** Der Loop als Zustandsmaschine mit Rundenzaehler. */
export const Loop: React.FC<PanelProps & {zustaende: string[]; proZustand?: number}> = ({
  at, width = 820, zustaende, proZustand = 42,
}) => {
  const f = useCurrentFrame();
  const seit = Math.max(0, f - at - 18);
  const idx = Math.floor(seit / proZustand) % zustaende.length;
  const runde = Math.floor(seit / (proZustand * zustaende.length)) + 1;
  const teil = (seit % proZustand) / proZustand;
  return (
    <Karte at={at} width={width} kopf={{icon: 'repeat', text: `Agenten-Loop · Runde ${runde}`}} seed={9}>
      <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
        {zustaende.map((z, i) => {
          const aktiv = i === idx;
          const fertig = i < idx;
          return (
            <React.Fragment key={z}>
              <div style={{
                flex: 1, padding: '20px 12px', borderRadius: 14, textAlign: 'center',
                background: aktiv ? 'rgba(185,140,255,.16)' : fertig ? '#F4F7F5' : '#FBFAFD',
                border: `1.5px solid ${aktiv ? purple : fertig ? `${green}30` : hair}`,
                scale: aktiv ? 1.06 : 1,
                boxShadow: aktiv ? '0 12px 28px rgba(110,69,201,.15)' : 'none',
              }}>
                <div style={{
                  fontFamily: sans, fontWeight: 800, fontSize: 22,
                  color: aktiv ? purple : fertig ? green : muted,
                }}>{z}</div>
                {aktiv ? (
                  <div style={{height: 4, borderRadius: 3, background: 'rgba(110,69,201,.16)', marginTop: 10}}>
                    <div style={{height: '100%', width: `${teil * 100}%`, background: purple, borderRadius: 3}} />
                  </div>
                ) : null}
              </div>
              {i < zustaende.length - 1 ? (
                <Lucide name="arrow-right" size={22} color={i < idx ? green : muted} stroke={2.4} glow={false} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{
        marginTop: 18, display: 'flex', alignItems: 'center', gap: 11,
        fontFamily: sans, fontWeight: 700, fontSize: 21, color: muted,
      }}>
        <div style={{rotate: `${(f / 3) % 360}deg`, display: 'flex'}}>
          <Lucide name="refresh-cw" size={22} color={accent} stroke={2.4} glow={false} />
        </div>
        Ergebnis fließt zurück in den Kontext
      </div>
    </Karte>
  );
};

/** Freigabe-Dialog fuer eine riskante Aktion. */
export const Freigabe: React.FC<PanelProps & {aktion: string; warnung?: string}> = ({
  at, width = 640, aktion, warnung,
}) => {
  const f = useCurrentFrame();
  const puls = 1 + Math.sin(Math.max(0, f - at - 40) / 13) * 0.022;
  return (
    <Karte at={at} width={width} kopf={{icon: 'shield-check', text: 'Bestätigung nötig', tone: 'bad'}} seed={10}>
      <div style={{fontFamily: sans, fontWeight: 800, fontSize: 29, color: ink, lineHeight: 1.3}}>{aktion}</div>
      {warnung ? (
        <div style={{
          marginTop: 14, padding: '14px 17px', borderRadius: 12,
          background: '#FDF2F4', border: `1px solid ${red}30`,
          display: 'flex', alignItems: 'center', gap: 11,
          fontFamily: sans, fontWeight: 650, fontSize: 22, color: red,
          opacity: prog(f, at + 22, at + 40, E.out),
        }}>
          <Lucide name="triangle-alert" size={22} color={red} stroke={2.3} glow={false} />
          {warnung}
        </div>
      ) : null}
      <div style={{display: 'flex', gap: 13, marginTop: 22, opacity: prog(f, at + 30, at + 48, E.out)}}>
        <div style={{
          padding: '14px 28px', borderRadius: 12, background: purple,
          fontFamily: sans, fontWeight: 800, fontSize: 22, color: '#fff', scale: puls,
        }}>Bestätigen</div>
        <div style={{
          padding: '14px 28px', borderRadius: 12, background: '#F3F0F7',
          fontFamily: sans, fontWeight: 800, fontSize: 22, color: muted,
        }}>Abbrechen</div>
      </div>
    </Karte>
  );
};

/** Systemdiagramm: Kern mit Bausteinen und laufenden Impulsen. */
export const System: React.FC<PanelProps & {kern: string; teile: {name: string; icon: string}[]}> = ({
  at, width = 860, kern, teile,
}) => {
  const f = useCurrentFrame();
  const spalte = Math.min(260, (width - 130) / 2 - 40);
  const zeilen = Math.ceil(teile.length / 2);
  return (
    <Karte at={at} width={width} kopf={{icon: 'cpu', text: 'System'}} seed={11}>
      <div style={{position: 'relative', height: zeilen * 128 + 30}}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          translate: '-50% -50%',
          padding: '22px 34px', borderRadius: 16, background: purple, zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 16px 36px rgba(110,69,201,.28)',
          opacity: prog(f, at + 6, at + 22, E.out),
        }}>
          <Lucide name="brain" size={28} color="#fff" stroke={2.2} glow={false} />
          <span style={{fontFamily: sans, fontWeight: 850, fontSize: 28, color: '#fff'}}>{kern}</span>
        </div>
        {teile.map((teil, i) => {
          const links = i % 2 === 0;
          const a = at + 12 + i * 7;
          const p = prog(f, a, a + 16, E.out);
          const lauf = ((f - at) / 70 + i / teile.length) % 1;
          return (
            <div key={teil.name} style={{
              position: 'absolute', top: 10 + Math.floor(i / 2) * 128, width: spalte,
              [links ? 'left' : 'right']: 0,
              padding: '17px 20px', borderRadius: 14,
              background: '#FBFAFD', border: `1.5px solid ${hair}`,
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: p, translate: `${(1 - p) * (links ? -24 : 24)}px 0px`,
            }}>
              <Lucide name={teil.icon} size={26} color={purple} stroke={2.1} glow={false} />
              <span style={{fontFamily: sans, fontWeight: 780, fontSize: 23, color: ink}}>{teil.name}</span>
              <div style={{
                position: 'absolute', top: '50%',
                [links ? 'left' : 'right']: spalte,
                width: (width - 90) / 2 - spalte - 32,
                height: 2, background: 'rgba(110,69,201,.16)', opacity: p,
              }}>
                <div style={{
                  position: 'absolute', top: -3.5,
                  left: `${(links ? lauf : 1 - lauf) * 100}%`,
                  width: 9, height: 9, borderRadius: 999, background: accent,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </Karte>
  );
};

/** Grosse Zahl, die hochzaehlt. */
export const Zahl: React.FC<PanelProps & {
  wert: number; label: string; suffix?: string; icon?: string;
}> = ({at, width = 480, wert, label, suffix = '', icon, tone}) => {
  const f = useCurrentFrame();
  const p = prog(f, at + 10, at + 50, E.out);
  const farbe = toneColor(tone);
  return (
    <Karte at={at} width={width} seed={12}>
      <div style={{textAlign: 'center', padding: '14px 0'}}>
        {icon ? (
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 12}}>
            <Lucide name={icon} size={38} color={farbe} stroke={2} glow={false} />
          </div>
        ) : null}
        <div style={{
          fontFamily: sans, fontWeight: 900, fontSize: 88, color: farbe,
          lineHeight: 1, letterSpacing: -2,
        }}>{Math.round(wert * p)}{suffix}</div>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 24, color: muted, marginTop: 12}}>{label}</div>
      </div>
    </Karte>
  );
};

/** Starrer Ablauf gegen offenen Weg — je nach `offen`. */
export const Ablauf: React.FC<PanelProps & {
  schritte: string[]; offen?: boolean; titel?: string;
}> = ({at, width = 720, schritte, offen, titel}) => {
  const f = useCurrentFrame();
  const seit = Math.max(0, f - at - 22);
  const laeufer = Math.floor(seit / 26) % schritte.length;
  return (
    <Karte at={at} width={width}
      kopf={{icon: offen ? 'git-branch' : 'workflow', text: titel ?? (offen ? 'Agent' : 'Klassischer Workflow')}}
      seed={13}>
      <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
        {schritte.map((s, i) => {
          const aktiv = laeufer === i;
          return (
            <React.Fragment key={s}>
              <div style={{
                flex: 1, padding: '18px 10px', borderRadius: 12, textAlign: 'center',
                background: aktiv ? (offen ? 'rgba(185,140,255,.16)' : '#F0EDF6') : '#FBFAFD',
                border: `1.5px solid ${aktiv ? (offen ? purple : 'rgba(26,26,46,.18)') : hair}`,
                fontFamily: sans, fontWeight: 780, fontSize: 21,
                color: aktiv ? (offen ? purple : ink) : muted,
                opacity: prog(f, at + 14 + i * 8, at + 30 + i * 8, E.out),
              }}>{s}</div>
              {i < schritte.length - 1 ? (
                <Lucide name="arrow-right" size={20} color={muted} stroke={2.3} glow={false} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{
        marginTop: 16, fontFamily: sans, fontWeight: 700, fontSize: 21, color: muted,
        opacity: prog(f, at + 48, at + 66, E.out),
      }}>
        {offen ? 'entscheidet unterwegs · je nach Lage' : 'immer gleich · vorhersehbar'}
      </div>
    </Karte>
  );
};

/** Fehler, der sich durch die Schritte fortpflanzt. */
export const Fehlerkette: React.FC<PanelProps & {schritte: string[]; proSchritt?: number}> = ({
  at, width = 700, schritte, proSchritt = 28,
}) => {
  const f = useCurrentFrame();
  return (
    <Karte at={at} width={width} kopf={{icon: 'triangle-alert', text: 'agent', tone: 'bad'}} dunkel seed={14}>
      {schritte.map((s, i) => {
        const a = at + 16 + i * proSchritt;
        if (f < a) return <div key={s} style={{height: 38}} />;
        return (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 14, height: 38,
            fontFamily: mono, fontSize: 23, color: '#F0868F',
            opacity: prog(f, a, a + 10, E.out),
            translate: `${(1 - prog(f, a, a + 12, E.out)) * -14 + i * 10}px 0px`,
          }}>
            <span style={{width: 22, color: '#E06C75'}}>{i === 0 ? '✗' : '↳'}</span>
            <span>{s}</span>
          </div>
        );
      })}
    </Karte>
  );
};

/** Quelle mit eingebetteter fremder Anweisung. */
export const Quelle: React.FC<PanelProps & {
  quelle: string; harmlos: string[]; eingebettet: string;
}> = ({at, width = 700, quelle, harmlos, eingebettet}) => {
  const f = useCurrentFrame();
  const zeigen = prog(f, at + 34, at + 54, E.out);
  const markiert = prog(f, at + 56, at + 74, E.out);
  return (
    <Karte at={at} width={width} kopf={{icon: 'globe', text: quelle, tone: 'bad'}} seed={15}>
      {harmlos.map((h, i) => (
        <div key={h} style={{
          fontFamily: mono, fontSize: 22, color: muted, padding: '8px 0',
          opacity: prog(f, at + 16 + i * 9, at + 32 + i * 9, E.out),
        }}>{h}</div>
      ))}
      <div style={{
        marginTop: 12, padding: '16px 18px', borderRadius: 12,
        background: markiert > 0.2 ? '#FDF2F4' : '#FBFAFD',
        border: `1.5px solid ${markiert > 0.2 ? `${red}50` : hair}`,
        opacity: zeigen,
        fontFamily: mono, fontSize: 23, color: markiert > 0.2 ? red : ink,
      }}>{eingebettet}</div>
      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: markiert,
      }}>
        <Lucide name="ban" size={22} color={red} stroke={2.3} glow={false} />
        <span style={{fontFamily: sans, fontWeight: 800, fontSize: 22, color: red}}>
          Inhalt — kein Befehl
        </span>
      </div>
    </Karte>
  );
};
