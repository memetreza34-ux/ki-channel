import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

/**
 * Kapitel 1, Wort fuer Wort.
 *
 * Die Frames stammen aus einer Whisper-Transkription des echten Voiceovers
 * mit Wort-Timestamps. Jedes Schluesselwort bekommt genau dann sein Bild,
 * wenn der Sprecher es sagt:
 *
 *    34f  "KI"                 128f  (Antwort bleibt stehen, wird blass)
 *    57f  "Ziel"               171f  "Informationen"
 *   115f  "Antwort"            221f  "Werkzeuge"
 *   263f  "Zwischenschritte"   294f  "arbeitet so lange weiter"
 *   360f  "Ergebnis"           463f  "KI-Agenten"
 */
export const W = {
  ki: 34,
  ziel: 57,
  antwort: 115,
  antwortEnde: 140,
  informationen: 171,
  werkzeuge: 221,
  zwischenschritte: 263,
  weiter: 294,
  ergebnis: 360,
  agenten: 463,
} as const;

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const accent = BRAND.accent;
const muted = '#8D8197';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(110,69,201,.16)',
  borderRadius: 26,
  boxShadow: '0 24px 70px rgba(26,26,46,.10)',
};
const label: React.CSSProperties = {
  fontFamily: BRAND.font.body,
  fontWeight: 850,
  letterSpacing: -0.6,
  color: ink,
};

const useEnter = (at: number, duration = 26) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping: 190, mass: 0.7}, durationInFrames: duration});
};

/** Element faehrt zum gesprochenen Wort ein. */
const Word: React.FC<{
  at: number;
  from?: 'bottom' | 'left' | 'right' | 'scale';
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, from = 'bottom', style, children}) => {
  const e = useEnter(at);
  const d = (1 - e) * 36;
  const t =
    from === 'left' ? `translateX(${-d}px)`
    : from === 'right' ? `translateX(${d}px)`
    : from === 'scale' ? `scale(${0.7 + e * 0.3})`
    : `translateY(${d}px)`;
  return <div style={{...style, opacity: Math.min(1, e * 1.3), transform: t}}>{children}</div>;
};

const Icon: React.FC<{d: React.ReactNode; size?: number; color?: string; at: number}> = ({
  d, size = 34, color = purple, at,
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 22], [0, 1], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color}
      strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
      style={{strokeDasharray: 120, strokeDashoffset: 120 * (1 - draw)}}>
      {d}
    </svg>
  );
};

const Chip: React.FC<{at: number; icon: React.ReactNode; text: string; tone?: 'on' | 'off'}> = ({
  at, icon, text, tone = 'on',
}) => {
  const e = useEnter(at, 24);
  const on = tone === 'on';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11,
      padding: '14px 20px', borderRadius: 999,
      background: on ? 'rgba(185,140,255,.16)' : '#F2EEF7',
      border: `1.5px solid ${on ? 'rgba(110,69,201,.28)' : 'rgba(26,26,46,.10)'}`,
      opacity: Math.min(1, e * 1.4),
      transform: `scale(${0.76 + e * 0.24})`,
    }}>
      <Icon at={at} size={26} color={on ? purple : muted} d={icon} />
      <div style={{...label, fontSize: 23, color: on ? purple : muted}}>{text}</div>
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // "statt dir nur eine Antwort" — die Chatblase kommt und tritt zurueck.
  const antwortFade = interpolate(frame, [W.antwortEnde, W.informationen], [1, 0.22], clamp);
  // "arbeitet so lange weiter" — die Schleife kreist, solange gearbeitet wird.
  const loopTurn = interpolate(frame, [W.weiter, W.ergebnis], [0, 360], clamp);
  const ergebnisPulse = 1 + Math.sin(Math.max(0, frame - W.ergebnis) / 8) * 0.03;

  return (
    <div style={{position: 'absolute', inset: 0}}>

      {/* "einer KI" */}
      <Word at={W.ki} from="scale" style={{position: 'absolute', left: 120, top: 262}}>
        <div style={{...card, width: 210, height: 210, borderRadius: 34, display: 'grid', placeItems: 'center',
          background: 'linear-gradient(150deg,#fff,#F4EDFF)', border: '2px solid rgba(110,69,201,.26)'}}>
          <Icon at={W.ki} size={58} d={<><circle cx="16" cy="16" r="9" /><circle cx="16" cy="16" r="3" />
            <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M26 6l-3 3M9 23l-3 3" /></>} />
          <div style={{...label, fontSize: 26, color: purple, marginTop: 12}}>KI</div>
        </div>
      </Word>

      {/* "ein Ziel" */}
      <Word at={W.ziel} from="left" style={{position: 'absolute', left: 372, top: 300}}>
        <div style={{...card, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon at={W.ziel} size={34} d={<><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="6" /><circle cx="16" cy="16" r="1.6" /></>} />
          <div>
            <div style={{...label, fontSize: 19, color: muted, letterSpacing: 1.6}}>ZIEL</div>
            <div style={{...label, fontSize: 26, marginTop: 4, maxWidth: 300}}>Vergleiche die Tools</div>
          </div>
        </div>
      </Word>

      {/* "statt dir nur eine Antwort zu schreiben" */}
      <Word at={W.antwort} style={{position: 'absolute', left: 120, top: 560, opacity: antwortFade}}>
        <div style={{...card, width: 470, padding: '24px 28px', borderStyle: 'dashed', borderColor: 'rgba(26,26,46,.18)'}}>
          <div style={{...label, fontSize: 19, color: muted, letterSpacing: 1.6}}>NUR EINE ANTWORT</div>
          {[92, 74, 84].map((w, i) => (
            <div key={w} style={{height: 12, width: `${w}%`, borderRadius: 8, background: '#DCD4E4',
              marginTop: i === 0 ? 18 : 11,
              transform: `scaleX(${interpolate(frame, [W.antwort + i * 7, W.antwort + 20 + i * 7], [0, 1], clamp)})`,
              transformOrigin: 'left'}} />
          ))}
        </div>
      </Word>

      {/* "öffnet sie Informationen" — die Blätter klappen auf */}
      <div style={{position: 'absolute', left: 830, top: 258}}>
        {[0, 1, 2].map((i) => {
          const e = interpolate(frame, [W.informationen + i * 8, W.informationen + 30 + i * 8], [0, 1], clamp);
          return (
            <div key={i} style={{
              position: 'absolute', left: i * 34, top: 0, width: 150, height: 196, ...card, borderRadius: 16,
              opacity: e, transformOrigin: 'left center',
              transform: `perspective(700px) rotateY(${(1 - e) * -72}deg) translateX(${(1 - e) * -20}px)`,
            }}>
              <div style={{padding: 18}}>
                {[80, 62, 72, 54].map((w, k) => (
                  <div key={k} style={{height: 8, width: `${w}%`, borderRadius: 6,
                    background: k === 0 ? accent : '#E3DCEA', marginTop: k === 0 ? 0 : 12}} />
                ))}
              </div>
            </div>
          );
        })}
        <Word at={W.informationen + 34} style={{position: 'absolute', top: 214, left: 4}}>
          <div style={{...label, fontSize: 21, color: purple, letterSpacing: 1.4}}>INFORMATIONEN</div>
        </Word>
      </div>

      {/* "benutzt Werkzeuge" */}
      <div style={{position: 'absolute', left: 1330, top: 252, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
        {[
          {t: 'SUCHE', d: <><circle cx="14" cy="14" r="8" /><path d="M20 20l7 7" /></>},
          {t: 'DATEIEN', d: <><path d="M4 8a2 2 0 012-2h7l3 4h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z" /></>},
          {t: 'CODE', d: <><path d="M11 10l-7 6 7 6M21 10l7 6-7 6" /></>},
          {t: 'BROWSER', d: <><rect x="3" y="6" width="26" height="20" rx="3" /><path d="M3 12h26M8 9h.01M12 9h.01" /></>},
        ].map((w, i) => (
          <Chip key={w.t} at={W.werkzeuge + i * 11} icon={w.d} text={w.t} />
        ))}
      </div>
      <Word at={W.werkzeuge + 46} style={{position: 'absolute', left: 1330, top: 452}}>
        <div style={{...label, fontSize: 21, color: purple, letterSpacing: 1.4}}>WERKZEUGE</div>
      </Word>

      {/* "trifft Zwischenschritte" */}
      <div style={{position: 'absolute', left: 640, top: 596, display: 'flex', alignItems: 'center', gap: 10}}>
        {['PRÜFEN', 'VERGLEICHEN', 'WÄHLEN'].map((s, i) => (
          <React.Fragment key={s}>
            <Word at={W.zwischenschritte + i * 12} from="scale">
              <div style={{...card, padding: '13px 18px', ...label, fontSize: 20, color: purple,
                background: 'rgba(185,140,255,.14)'}}>{s}</div>
            </Word>
            {i < 2 ? (
              <Word at={W.zwischenschritte + 6 + i * 12} from="left">
                <div style={{...label, fontSize: 22, color: accent}}>→</div>
              </Word>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      {/* "arbeitet so lange weiter" — die Schleife dreht sich */}
      <Word at={W.weiter} from="scale" style={{position: 'absolute', left: 640, top: 700}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke={accent} strokeWidth="2.6"
            strokeLinecap="round" style={{transform: `rotate(${loopTurn}deg)`}}>
            <path d="M27 16a11 11 0 11-3.6-8.1" />
            <path d="M27 5v7h-7" />
          </svg>
          <div style={{...label, fontSize: 24, color: muted}}>… und weiter, bis es reicht</div>
        </div>
      </Word>

      {/* "bis ein Ergebnis vorliegt" */}
      <Word at={W.ergebnis} from="right" style={{position: 'absolute', left: 1250, top: 566}}>
        <div style={{...card, padding: '26px 30px', width: 430, border: `2px solid ${purple}`,
          background: 'linear-gradient(150deg,#fff,#F3ECFF)', transform: `scale(${ergebnisPulse})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Icon at={W.ergebnis} size={30} d={<><circle cx="16" cy="16" r="12" /><path d="M10 16.5l4 4 8-8.5" /></>} />
            <div style={{...label, fontSize: 21, color: purple, letterSpacing: 1.4}}>ERGEBNIS</div>
          </div>
          <div style={{...label, fontSize: 27, marginTop: 14, lineHeight: 1.22}}>Eine begründete Empfehlung</div>
        </div>
      </Word>

      {/* "Genau das ist die Idee hinter KI-Agenten." */}
      <Word at={W.agenten} style={{position: 'absolute', left: 0, right: 0, top: 838, display: 'flex', justifyContent: 'center'}}>
        <div style={{...card, padding: '22px 44px', borderRadius: 999, background: 'linear-gradient(90deg,#F6F0FF,#fff,#F6F0FF)'}}>
          <div style={{...label, fontSize: 32, color: purple}}>
            Das ist die Idee hinter <span style={{
              background: 'rgba(185,140,255,.32)', borderRadius: 8, padding: '2px 10px',
            }}>KI-Agenten</span>
          </div>
        </div>
      </Word>
    </div>
  );
};
