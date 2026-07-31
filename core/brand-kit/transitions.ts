import { random } from 'remotion';
import { E, CLAMP } from './tokens';
import { interpolate } from 'remotion';

// ════════════════════════════════════════════════════════════════════════════
//  ÜBERGÄNGE — als Style-Helfer. p = Fortschritt 0..1.
//  Nutzung:  <div style={{ ...slideIn(prog(f, a, b), 'left') }}>
//  Regel: nie 2× denselben hintereinander.
// ════════════════════════════════════════════════════════════════════════════

type Dir = 'left' | 'right' | 'up' | 'down';

// FADE — ruhig
export const fadeIn = (p: number): React.CSSProperties => ({ opacity: p });

// SLIDE — fließend
export const slideIn = (p: number, dir: Dir = 'up', dist = 120): React.CSSProperties => {
  const e = E.out(p);
  const off = (1 - e) * dist;
  const map: Record<Dir, string> = {
    left: `translateX(${-off}px)`, right: `translateX(${off}px)`,
    up: `translateY(${off}px)`, down: `translateY(${-off}px)`,
  };
  return { opacity: p, transform: map[dir] };
};

// ZOOM — Enthüllung
export const zoomIn = (p: number, from = 0.8): React.CSSProperties => {
  const e = E.spring(p);
  return { opacity: p, transform: `scale(${from + (1 - from) * e})` };
};

// POP — Overshoot
export const popIn = (p: number): React.CSSProperties => {
  const e = E.spring(p);
  return { opacity: Math.min(1, p * 1.5), transform: `scale(${0.6 + e * 0.4})` };
};

// WIPE — Maske von einer Seite (clip-path)
export const wipeIn = (p: number, dir: Dir = 'left'): React.CSSProperties => {
  const e = E.inOut(p);
  const pct = (1 - e) * 100;
  const map: Record<Dir, string> = {
    left:  `inset(0 ${pct}% 0 0)`, right: `inset(0 0 0 ${pct}%)`,
    up:    `inset(0 0 ${pct}% 0)`, down:  `inset(${pct}% 0 0 0)`,
  };
  return { clipPath: map[dir], WebkitClipPath: map[dir] };
};

// GLITCH — dramatisch. Braucht frame für den Jitter.
export const glitchStyle = (frame: number, energy: number): React.CSSProperties => {
  const jx = (random(`gx${frame}`) - 0.5) * 24 * energy;
  const jy = (random(`gy${frame}`) - 0.5) * 8 * energy;
  return { transform: `translate(${jx}px, ${jy}px)` };
};
// RGB-Split-Offsets für Glitch-Text (rote/grüne Kopien)
export const glitchOffset = (frame: number, energy: number) => ({
  x: (random(`go${frame}`) - 0.5) * 30 * energy,
});

// BLUR-IN — weich scharf werden
export const blurIn = (p: number): React.CSSProperties => ({
  opacity: p, filter: `blur(${(1 - E.out(p)) * 16}px)`,
});

// IRIS — Kreis öffnet sich aus der Mitte (cinematisch, für große Reveals)
export const irisIn = (p: number, cx = 50, cy = 50): React.CSSProperties => {
  const e = E.inOut(p);
  const r = e * 120; // 120% deckt jede Ecke ab
  return { clipPath: `circle(${r}% at ${cx}% ${cy}%)`,
           WebkitClipPath: `circle(${r}% at ${cx}% ${cy}%)` };
};

// DIAGONAL-WIPE — schräge Kante zieht durch (passt zum Diagonal-Look)
export const diagonalWipe = (p: number): React.CSSProperties => {
  const e = E.inOut(p);
  const x = -30 + e * 160; // Kante wandert von links-unten nach rechts-oben
  const poly = `polygon(0 0, ${x}% 0, ${x - 30}% 100%, 0 100%)`;
  return { clipPath: poly, WebkitClipPath: poly };
};

// SPLIT — öffnet sich wie ein Vorhang aus der Mitte
export const splitReveal = (p: number, vertical = false): React.CSSProperties => {
  const e = E.inOut(p);
  const half = (1 - e) * 50;
  const ins = vertical ? `inset(${half}% 0 ${half}% 0)` : `inset(0 ${half}% 0 ${half}%)`;
  return { clipPath: ins, WebkitClipPath: ins };
};

// SKEW-SLIDE — cinematisch: schräg reinziehen, richtet sich auf
export const skewSlide = (p: number, dir: 'left' | 'right' = 'left'): React.CSSProperties => {
  const e = E.out(p);
  const sgn = dir === 'left' ? -1 : 1;
  return {
    opacity: Math.min(1, p * 1.4),
    transform: `translateX(${sgn * (1 - e) * 220}px) skewX(${sgn * (1 - e) * 10}deg)`,
  };
};

// LIQUID — weiche Blob-Kante morpht auf (organisch, sparsam einsetzen)
export const liquidIn = (p: number): React.CSSProperties => {
  const e = E.inOut(p);
  const r = e * 130;
  // Ellipse statt Kreis + leichte Versetzung wirkt „flüssiger"
  const cy = 60 - e * 10;
  return { clipPath: `ellipse(${r}% ${r * 0.8}% at 50% ${cy}%)`,
           WebkitClipPath: `ellipse(${r}% ${r * 0.8}% at 50% ${cy}%)` };
};

// BLINDS — parallele Streifen öffnen nacheinander (Jalousie-Look, vgl. motion.dev "blinds").
// Anders als WIPE (eine durchgehende Kante) oder SPLIT (2 Hälften): mehrere schmale Streifen,
// die EINZELN und leicht gestaffelt aufklappen — eigener Rhythmus, nicht verwechseln.
export const blindsWipe = (p: number, slats = 8, dir: Dir = 'up'): React.CSSProperties => {
  const e = E.inOut(p);
  const stagger = 0.5; // wie viel Überlappung zwischen den Streifen (0=alle gleichzeitig, 1=streng nacheinander)
  const stops: string[] = [];
  for (let i = 0; i < slats; i++) {
    const start = (i / slats) * stagger;
    const local = Math.max(0, Math.min(1, (e - start) / (1 - stagger + 1 / slats)));
    const a0 = (i / slats) * 100, a1 = ((i + 1) / slats) * 100;
    const reveal = a0 + (a1 - a0) * local;
    // CSS-Masken-Alpha: opak (schwarz) = SICHTBAR, transparent = UNSICHTBAR — genau umgekehrt zu
    // dem, was man intuitiv erwartet. Erster Versuch hatte das vertauscht (Box blieb fast leer).
    stops.push(`black ${a0}%`, `black ${reveal}%`, `transparent ${reveal}%`, `transparent ${a1}%`);
  }
  const isVertical = dir === 'up' || dir === 'down';
  const mask = `linear-gradient(${isVertical ? 'to bottom' : 'to right'}, ${stops.join(', ')})`;
  return {
    WebkitMaskImage: mask, maskImage: mask,
    WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  } as React.CSSProperties;
};

// Hilfsfunktion: kombiniere mehrere Style-Objekte
export const combine = (...styles: React.CSSProperties[]): React.CSSProperties =>
  Object.assign({}, ...styles);

// Auto-Übergang für eine Szene (rein UND raus), per absoluter Frame.
// type wählt den Effekt; gibt fertiges Style-Objekt zurück.
export const sceneTransition = (
  frame: number, inF: number, outF: number,
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'blur' | 'iris' | 'diagonal' | 'split' | 'skew' | 'liquid' = 'fade',
  ramp = 12,
): React.CSSProperties => {
  const pIn = interpolate(frame, [inF, inF + ramp], [0, 1], CLAMP);
  const pOut = interpolate(frame, [outF - ramp, outF], [1, 0], CLAMP);
  const p = Math.min(pIn, pOut);
  switch (type) {
    case 'slide':    return slideIn(p, 'up');
    case 'zoom':     return zoomIn(p);
    case 'wipe':     return { ...fadeIn(p), ...wipeIn(pIn, 'left') };
    case 'blur':     return blurIn(p);
    case 'iris':     return { ...fadeIn(Math.min(1, p * 2)), ...irisIn(p) };
    case 'diagonal': return { ...fadeIn(Math.min(1, p * 2)), ...diagonalWipe(p) };
    case 'split':    return { ...fadeIn(Math.min(1, p * 2)), ...splitReveal(p) };
    case 'skew':     return skewSlide(p);
    case 'liquid':   return { ...fadeIn(Math.min(1, p * 2)), ...liquidIn(p) };
    default:         return fadeIn(p);
  }
};
