// ════════════════════════════════════════════════════════════════════════════
//  STUDIO CORE · TOKENS  (neutral, kanal-unabhängig)
//  Geteilte Farb-/Easing-/Helper-Quelle für ALLE Kanäle.
//  ⚠️ Hier lebt KEINE Kanal-Identität. Akzent + Hintergrund pro Kanal kommen aus
//     channels/<name>/brand/brand.ts via ThemeProvider/useTheme (siehe theme.tsx).
//  Die Farben unten sind eine SEMANTISCHE Palette (Bedeutung), kein Branding.
// ════════════════════════════════════════════════════════════════════════════
import { Easing, interpolate } from 'remotion';

// ─── Semantische Palette (Farbe = Bedeutung, für alle Kanäle gleich) ─────────
// Weiß dominiert Text. Akzente nach Sinn (nie zufällig). KEINE „Signaturfarbe" hier.
export const C = {
  // Hintergründe — NEUTRAL (Kanäle setzen ihren eigenen BG via brand.ts)
  bg:       '#0B0F14',   // neutral-dunkel — Standard-Fallback
  bgDeep:   '#070A0E',   // tiefer (Vignette)
  bgNeutral:'#0B0F14',   // Alias
  bgLight:  '#F5F7FA',   // heller BG (für seltene Hell-Szenen)

  // Neutral / Text
  white:    '#FFFFFF',   // ⚪ neutral, clean, Aussagen — Haupt-Textfarbe
  gray:     '#9AA6B2',   // gedämpfter Text (neutral)
  grayDk:   '#5A6470',
  ink:      '#0A0E14',   // dunkler Text auf hellem BG

  // 🟢 Grün — positiv, Wachstum, Lösung (semantisch, NICHT die Kanal-Signatur)
  green:    '#00D26A',
  greenLt:  '#5CFFAD',
  greenDk:  '#00803F',
  // Aliasse (Abwärtskompatibilität — Default-Akzent, von Kanälen überschrieben)
  accent:   '#00D26A',
  accentLt: '#5CFFAD',
  accentDk: '#00803F',

  // 🔴 Rot — Verlust, Problem, Gefahr
  negative: '#FF3333',
  negativeLt:'#FF6B6B',
  negativeDk:'#B01030',

  // 🟡 Gold — Geld, Zahlen, Highlight
  gold:     '#FFC83D',
  goldLt:   '#FFE49A',

  // 🔵 Blau — Vertrauen, ruhig, Info
  blue:     '#3D8BFF',
  blueLt:   '#8FBEFF',

  // 🟣 Lila — premium, besonders
  purple:   '#B98CFF',
  purpleLt: '#D9C4FF',
} as const;

// Semantische Kurz-Wahl: nach Bedeutung statt Farbname denken.
export const MEANING = {
  positive: C.accent,   // Wachstum/Lösung
  problem:  C.negative, // Verlust/Gefahr
  money:    C.gold,     // Zahlen/Geld
  trust:    C.blue,     // sicher/Info
  premium:  C.purple,   // besonders
  neutral:  C.white,    // Aussage
} as const;

// ─── Format ───────────────────────────────────────────────────────────────────
export const FORMAT = {
  landscape: { width: 1920, height: 1080 },  // YouTube
  vertical:  { width: 1080, height: 1920 },  // Shorts/TikTok/Reels
  fps: 30,
} as const;

// ─── Easing (Spring Physics als Standard) ────────────────────────────────────
export const E = {
  out:    Easing.bezier(0.16, 1, 0.3, 1),     // smooth ease-out
  inOut:  Easing.bezier(0.65, 0, 0.35, 1),
  in:     Easing.bezier(0.5, 0, 0.75, 0),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1), // natürlicher Overshoot
} as const;

export const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ─── Sekunde → Frame ──────────────────────────────────────────────────────────
export const sec = (s: number, fps = FORMAT.fps) => Math.round(s * fps);

// ─── Animations-Helfer ────────────────────────────────────────────────────────
// Fortschritt 0→1 zwischen zwei Frames
export const prog = (f: number, a: number, b: number, e = E.out) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: e });

// Wert va→vb zwischen zwei Frames
export const lerpF = (f: number, va: number, vb: number, a: number, b: number, e = E.out) =>
  interpolate(f, [a, b], [va, vb], { ...CLAMP, easing: e });

// Lebenszyklus: rein → halten → raus (für sauberes Erscheinen + Verschwinden)
export const life = (f: number, inF: number, outF: number, ramp = 9) =>
  interpolate(f, [inF, inF + ramp, outF - ramp, outF], [0, 1, 1, 0], CLAMP);

// ─── Bewegungs-Feinschliff (Animationsprinzipien) ─────────────────────────────
// Anticipation: kurzer Gegenzug VOR der Hauptbewegung (0..1, für den Aufrufer
// mit eigenem Pixel-/Scale-Betrag multiplizieren). pullFrames = wie viele Frames
// vor moveStart der Gegenzug beginnt.
export const anticipate = (f: number, moveStart: number, pullFrames = 8) =>
  prog(f, moveStart - pullFrames, moveStart, E.in) * (1 - prog(f, moveStart, moveStart + 4, E.out));

// Secondary Motion: Nebenteil (Badge/Icon/Akzent) schwingt nach, NACHDEM die
// Hauptbewegung schon steht — abklingende Sinus-Rotation in Grad.
export const settleWobble = (f: number, settleAt: number, amplitude = 10, decayFrames = 26) =>
  f > settleAt
    ? Math.sin((f - settleAt) * 0.5) * amplitude * Math.max(0, 1 - (f - settleAt) / decayFrames)
    : 0;

// Deutsche Euro-Formatierung
export const euro = (n: number) => Math.round(n).toLocaleString('de-DE') + ' €';
export const num = (n: number) => Math.round(n).toLocaleString('de-DE');

// Farbe + Alpha (0..1). Nutzt color-mix → funktioniert mit Hex UND CSS-Vars (var(--accent)).
export const a = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${Math.round(Math.min(1, Math.max(0, alpha)) * 100)}%, transparent)`;
