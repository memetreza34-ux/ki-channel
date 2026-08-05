import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, a, E, prog, sec } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  AiTools — Premium-Bausteine für KI-Tool-/Konzept-Reels. Füllt die Katalog-
//  Lücken: Tokenisierung/Embeddings, Bild-Generierungs-Reveal, Vorher/Nachher-
//  Slider, „KI verarbeitet"-Zustand. Theme-fähig über var(--accent).
// ════════════════════════════════════════════════════════════════════════════

// ─── 1 · TokenStream — Text zerfällt in Token-Chips → wird zu Zahlen-Vektor ───
// Grundkonzept "wie ein LLM Text liest": Wörter poppen als Chips auf, dann
// morphen sie zu Zahlen-Reihen (Embedding). start = Frame des Beginns.
export const TokenStream: React.FC<{
  text: string; start: number; w?: number; accent?: string;
}> = ({ text, start, w = 900, accent = 'var(--accent)' }) => {
  const f = useCurrentFrame();
  const words = useMemo(() => text.split(' '), [text]);
  const perWord = 7;
  const vecStart = start + words.length * perWord + 14;

  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
      {/* Token-Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {words.map((word, i) => {
          const at = start + i * perWord;
          const p = prog(f, at, at + 12, E.spring);
          if (p <= 0) return null;
          const morph = prog(f, vecStart, vecStart + 16);
          return (
            <div key={i} style={{
              padding: '12px 22px', borderRadius: 16,
              background: a(accent, 0.16 + morph * 0.1),
              border: `1.5px solid ${a(accent, 0.5 - morph * 0.3)}`,
              fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.white,
              opacity: Math.min(p * 1.4, 1) * (1 - morph * 0.55),
              transform: `translateY(${(1 - p) * 22}px) scale(${1 - morph * 0.12})`,
            }}>
              {word}
            </div>
          );
        })}
      </div>
      {/* Zahlen-Vektor (Embedding) */}
      <div style={{
        opacity: prog(f, vecStart, vecStart + 20),
        transform: `translateY(${(1 - prog(f, vecStart, vecStart + 20, E.out)) * 16}px)`,
        display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: w,
      }}>
        {words.map((_, i) => (
          <div key={'row' + i} style={{
            display: 'flex', gap: 6, padding: '10px 16px', borderRadius: 12,
            background: a('#000000', 0.3), border: `1px solid ${a(accent, 0.35)}`,
          }}>
            {Array.from({ length: 4 }).map((_, j) => (
              <span key={j} style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700,
                color: a(accent, 0.9), opacity: 0.55 + 0.45 * Math.sin(f * 0.08 + i + j) }}>
                {(Math.sin(i * 12.9898 + j * 78.233) * 0.5).toFixed(2)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 2 · AiCanvasReveal — Bild entsteht progressiv (Diffusion-/Generierungs-Look) ─
// Für "Prompt → Bild/Video" Tool-Demos (Midjourney/Flow/etc). src = fertiges
// Bild, revealFrom/revealTo steuert den progressiven Aufbau (Scan + Rausch→scharf).
export const AiCanvasReveal: React.FC<{
  src: string; w: number; h: number; revealFrom: number; revealTo: number;
  accent?: string; radius?: number;
}> = ({ src, w, h, revealFrom, revealTo, accent = 'var(--accent)', radius = 28 }) => {
  const f = useCurrentFrame();
  const p = prog(f, revealFrom, revealTo, E.out);
  const scanY = p * h;
  const blur = (1 - p) * 18;
  const noise = (1 - p) * 0.5;

  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: radius, overflow: 'hidden',
      border: `1px solid ${a(accent, 0.35)}`, boxShadow: `0 30px 80px ${a('#000000', 0.5)}` }}>
      <img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        filter: `blur(${blur}px) saturate(${0.6 + p * 0.4})`,
        opacity: 0.5 + p * 0.5, transform: `scale(${1.04 - p * 0.04})`,
      }} />
      {/* Rausch-Overlay (verschwindet mit Fortschritt) */}
      {noise > 0.02 && (
        <div style={{ position: 'absolute', inset: 0, opacity: noise, mixBlendMode: 'overlay',
          background: `repeating-linear-gradient(0deg, ${a('#FFFFFF', 0.08)} 0px, transparent 2px, transparent 4px)` }} />
      )}
      {/* Scan-Linie */}
      {p > 0.02 && p < 0.98 && (
        <div style={{ position: 'absolute', left: 0, top: scanY - 2, width: '100%', height: 4,
          background: accent, boxShadow: `0 0 26px 6px ${accent}`, opacity: 0.9 }} />
      )}
      {/* Ungerendert unterhalb Scan-Linie abdunkeln */}
      <div style={{ position: 'absolute', left: 0, top: scanY, width: '100%', height: h - scanY,
        background: a('#0B0F14', 0.55) }} />
    </div>
  );
};

// ─── 3 · BeforeAfterSlider — Wisch-Vergleich (Original vs. KI-bearbeitet) ──────
// sliderAt: 0..1 (Frame-basiert steuerbar) — für "Vorher/Nachher" Tool-Demos.
export const BeforeAfterSlider: React.FC<{
  before: string; after: string; w: number; h: number;
  start: number; holdFrom: number; radius?: number; accent?: string;
  labelBefore?: string; labelAfter?: string;
}> = ({ before, after, w, h, start, holdFrom, radius = 28, accent = 'var(--accent)',
  labelBefore = 'VORHER', labelAfter = 'NACHHER' }) => {
  const f = useCurrentFrame();
  // Slider fährt 0→1 (deckt "after" auf), dann bleibt bei holdFrom stehen.
  const x = prog(f, start, holdFrom, E.inOut) * w;

  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: radius, overflow: 'hidden',
      border: `1px solid ${a(accent, 0.35)}`, boxShadow: `0 30px 80px ${a('#000000', 0.5)}` }}>
      <img src={before} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${x}px)` }}>
        <img src={after} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Griff-Linie */}
      <div style={{ position: 'absolute', left: x - 2, top: 0, width: 4, height: '100%',
        background: accent, boxShadow: `0 0 20px 4px ${accent}` }} />
      <div style={{ position: 'absolute', left: x - 30, top: h / 2 - 30, width: 60, height: 60, borderRadius: 30,
        background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 24px ${a('#000000', 0.4)}`, fontSize: 26, color: '#0B0F14', fontWeight: 900 }}>
        ⇔
      </div>
      {/* Labels */}
      <div style={{ position: 'absolute', left: 24, top: 24, padding: '8px 18px', borderRadius: 10,
        background: a('#000000', 0.55), fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: C.white,
        opacity: prog(f, start, start + 10) }}>{labelBefore}</div>
      <div style={{ position: 'absolute', right: 24, top: 24, padding: '8px 18px', borderRadius: 10,
        background: a(accent, 0.85), fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: '#0B0F14',
        opacity: prog(f, start, start + 10) }}>{labelAfter}</div>
    </div>
  );
};

// ─── 4 · AiThinking — "KI verarbeitet"-Zustand (Puls/Partikel-Kern) ────────────
// Kurzer Übergangsmoment zwischen Prompt und Antwort. loop-fähig, dezent.
export const AiThinking: React.FC<{
  start: number; end: number; size?: number; accent?: string; label?: string;
}> = ({ start, end, size = 140, accent = 'var(--accent)', label = 'denkt nach …' }) => {
  const f = useCurrentFrame();
  const life = prog(f, start, start + 10) * (1 - prog(f, end - 10, end));
  if (life <= 0) return null;
  const t = (f - start) * 0.12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: life }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {[0, 1, 2].map((i) => {
          const rot = t * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.3);
          const r = size / 2 - i * 16;
          return (
            <div key={i} style={{
              position: 'absolute', inset: size / 2 - r, width: r * 2, height: r * 2, borderRadius: '50%',
              border: `2.5px solid ${a(accent, 0.5 - i * 0.12)}`,
              borderTopColor: accent, transform: `rotate(${rot}rad)`,
            }} />
          );
        })}
        <div style={{ position: 'absolute', inset: size * 0.32, borderRadius: '50%', background: accent,
          boxShadow: `0 0 ${20 + Math.sin(t * 2) * 10}px ${accent}`,
          transform: `scale(${0.9 + Math.sin(t * 2) * 0.1})` }} />
      </div>
      <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: a(C.white, 0.8),
        letterSpacing: 1 }}>{label}</span>
    </div>
  );
};
