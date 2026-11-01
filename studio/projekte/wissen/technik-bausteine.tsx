import React, {useMemo} from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AdditiveBlending, Color, DoubleSide, PerspectiveCamera, ShaderMaterial, Vector3} from 'three';
import {AKZENT, BG, HELL, STAHL, clamp} from './bausteine';

/**
 * Bausteine für die Bildwelt „Technik“ (Vorbild-Machart scroll.engineer, Skill wissens-short):
 * Callout am 3D-Bauteil, Messwert-Panel, Ecken-Tag, Röntgen-Material, 3D→Bild-Projektion.
 */

const MONO = 'JetBrains Mono, monospace';
const SPACE = 'Space Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

/* ───────────── Kamera teilen: Szene + Projektion ───────────── */

export type KameraStand = {pos: [number, number, number]; ziel: [number, number, number]; fov: number};

/** Bildschirmposition (px) eines 3D-Punkts für denselben Kamerastand wie in der Szene. */
export const projiziere3D = (punkt: [number, number, number], k: KameraStand, breite = 1080, hoehe = 1920): [number, number] => {
  const cam = new PerspectiveCamera(k.fov, breite / hoehe, 0.1, 500);
  cam.position.set(...k.pos);
  cam.lookAt(...k.ziel);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const v = new Vector3(...punkt).project(cam);
  return [((v.x + 1) / 2) * breite, ((1 - v.y) / 2) * hoehe];
};

/* ───────────── Röntgen-Material ───────────── */

/** Durchsichtiges Leuchten an den Kanten (Fresnel) – Bauteile wirken wie durchleuchtet. */
export const roentgen = (farbe = '#9FB8FF', staerke = 1.4, kante = 2.2) =>
  new ShaderMaterial({
    uniforms: {farbe: {value: new Color(farbe)}, staerke: {value: staerke}, kante: {value: kante}},
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 farbe; uniform float staerke; uniform float kante; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), kante); gl_FragColor = vec4(farbe * (0.08 + f) * staerke, 0.08 + f); }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

/* ───────────── Callout ───────────── */

/**
 * Beschriftung am Bauteil: Kreis am Punkt, Linie, Pille mit Text. `punkt` = Bildschirm-px (aus `projiziere3D`),
 * `versatz` = wohin die Pille zeigt. Erscheint ab `ab` (Kreis → Linie → Pille), blendet ab `bis` aus.
 */
export const Callout: React.FC<{punkt: [number, number]; text: string; ab: number; bis?: number; versatz?: [number, number]; akzent?: boolean}> = ({punkt, text, ab, bis, versatz = [140, -150], akzent = false}) => {
  const f = useCurrentFrame();
  const kreis = spring({frame: f - ab, fps: 30, config: {damping: 14, stiffness: 180}});
  const linie = interpolate(f, [ab + 3, ab + 12], [0, 1], clamp);
  const pille = spring({frame: f - ab - 9, fps: 30, config: {damping: 15, stiffness: 170}});
  const sicht = bis === undefined ? 1 : interpolate(f, [bis, bis + 8], [1, 0], clamp);
  if (f < ab || sicht <= 0) return null;
  const [x, y] = punkt;
  const ex = x + versatz[0];
  const ey = y + versatz[1];
  // Knick: erst senkrecht, dann waagerecht – wie eine technische Zeichnung
  const kx = x;
  const lx = x + (kx - x) * linie;
  const ly = y + (ey - y) * Math.min(1, linie * 2);
  const lx2 = kx + (ex - kx) * Math.max(0, linie * 2 - 1);
  const farbe = akzent ? AKZENT : HELL;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: sicht}}>
        <circle cx={x} cy={y} r={16 * kreis} fill="none" stroke={farbe} strokeWidth={4} />
        <circle cx={x} cy={y} r={5 * kreis} fill={farbe} />
        {linie > 0 ? <polyline points={`${x},${y - 16} ${lx},${ly} ${lx2},${ly}`} fill="none" stroke={farbe} strokeWidth={3} /> : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: ex,
          top: ey,
          transform: `translate(${versatz[0] >= 0 ? '0' : '-100%'}, -50%) scale(${pille})`,
          transformOrigin: versatz[0] >= 0 ? 'left center' : 'right center',
          padding: '12px 28px',
          borderRadius: 999,
          background: 'rgba(14,20,36,0.82)',
          border: `3px solid ${farbe}`,
          fontFamily: SPACE,
          fontWeight: 700,
          fontSize: 44,
          color: farbe,
          whiteSpace: 'nowrap',
          opacity: sicht,
        }}
      >
        {text}
      </div>
    </>
  );
};

/* ───────────── Messwert-Panel ───────────── */

export type MessZeile = {label: string; wert: string; akzent?: boolean; puls?: number};

/** Live-Anzeige unten links: farbiger Balken, Zeilen mit Label + Wert (Mono-Labels, große Werte). */
export const MessPanel: React.FC<{zeilen: MessZeile[]; top?: number}> = ({zeilen, top = 1170}) => (
  <div style={{position: 'absolute', left: 80, right: 80, top, padding: '26px 34px 26px 44px', borderRadius: 28, background: 'rgba(10,15,28,0.86)', border: '2px solid #2A3654', display: 'flex', flexDirection: 'column', gap: 14}}>
    <div style={{position: 'absolute', left: 0, top: 24, bottom: 24, width: 10, borderRadius: 5, background: AKZENT}} />
    {zeilen.map((z, i) => (
      <div key={i} style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20}}>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 30, letterSpacing: '0.06em', color: STAHL, textTransform: 'uppercase'}}>{z.label}</div>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: z.akzent ? 92 : 58, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', color: z.akzent ? AKZENT : HELL, transform: `scale(${1 + (z.puls ?? 0) * 0.08})`, transformOrigin: 'right bottom'}}>
          {z.wert}
        </div>
      </div>
    ))}
  </div>
);

/* ───────────── Ecken-Tag ───────────── */

/** Kleiner Hinweis oben rechts, z. B. „Illustration“, „nachgebaut“, „Zeitlupe ×4“. Pflicht bei nachgebauten Geräten. */
export const EckTag: React.FC<{texte: string[]; top?: number}> = ({texte, top = 150}) => (
  <div style={{position: 'absolute', right: 130, top, display: 'flex', gap: 12}}>
    {texte.map((t) => (
      <div key={t} style={{fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: '0.08em', color: STAHL, padding: '6px 14px', border: `2px solid #3A4766`, borderRadius: 8, background: `${BG}CC`, textTransform: 'uppercase'}}>
        {t}
      </div>
    ))}
  </div>
);

/* ───────────── Untertitel ───────────── */

/**
 * Wort für Wort zum Voiceover (Machart scroll.engineer, Kanal-Look): 3–4 Wörter pro Seite, aktives Wort hell und fett,
 * gesprochene Wörter hell, kommende grau; Kasten mit Akzentbalken. `schluessel` = Wörter, die unterstrichen werden.
 * `captions` = Wortzeiten aus `npm run untertitel` (untertitel.json).
 */
export const Untertitel: React.FC<{captions: Caption[]; schluessel?: string[]; top?: number; seiteMs?: number}> = ({captions, schluessel = [], top = 1080, seiteMs = 900}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {pages} = useMemo(() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: seiteMs}), [captions, seiteMs]);
  const jetzt = (f / fps) * 1000;
  const seite = pages.find((p) => jetzt >= p.startMs && jetzt < p.startMs + p.durationMs);
  if (!seite) return null;
  const rein = interpolate(jetzt - seite.startMs, [0, 120], [0, 1], clamp);
  const wichtig = new Set(schluessel.map((w) => w.toLowerCase()));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{position: 'relative', maxWidth: 860, padding: '14px 28px 16px 40px', borderRadius: 16, background: 'rgba(10,15,28,0.88)', opacity: rein, transform: `translateY(${(1 - rein) * 10}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 12, bottom: 12, width: 8, borderRadius: 4, background: AKZENT}} />
        <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 58, lineHeight: 1.15, whiteSpace: 'pre-wrap', textAlign: 'left'}}>
          {seite.tokens.map((t, i) => {
            const aktiv = jetzt >= t.fromMs && jetzt < t.toMs;
            const gesagt = jetzt >= t.toMs;
            const wort = t.text.trim().replace(/[.,!?;:„“"]/g, '').toLowerCase();
            const unterstrichen = wichtig.has(wort) && (aktiv || gesagt);
            return (
              <span key={i} style={{color: aktiv || gesagt ? HELL : '#5D6886', textDecoration: unterstrichen ? `underline ${AKZENT} 6px` : 'none', textUnderlineOffset: 10}}>
                {t.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
