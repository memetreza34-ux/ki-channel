// ════════════════════════════════════════════════════════════════════════════
//  PremiumGrade — EIN Post-Processing-Layer für den ganzen Reel/Scene-Baum.
//  Bündelt: Bloom/Glow (helle Bereiche strahlen), Farbrand-Fringing (billige
//  Overlay-Annäherung an chromatische Aberration, KEIN Full-Tree-SVG-Filter —
//  das kostet reale Renderzeit, siehe unten), Filmkorn (echtes SVG-Noise,
//  bewegt), Vignette. Macht aus "sauberem Remotion-Render" den cineastischen
//  Look, den fertige Creator per DaVinci/AE-Grading drüberlegen.
//
//  WICHTIG — Performance: eine erste Version hat `filter: url(#chroma)` auf
//  den kompletten Kinder-Baum gelegt (SVG-Filter über die ganze Szene). Das
//  drückt die Remotion-Preview-FPS von normal auf ~1 FPS, weil der Browser den
//  Filter jeden Frame über den kompletten DOM-Teilbaum neu rechnet — bei einem
//  60-90s-Reel wäre das 30-45 Min Renderzeit nur für den Grading-Layer. Darum:
//  NUR reine Overlays (Gradients/Opacity/Blend-Mode), nichts das den
//  bestehenden Inhalt selbst filtert.
//
//  Einsatz: reines Overlay, KEIN Wrapper — einmal ganz oben in der Szene,
//  über allem Inhalt (letztes Kind):
//    <AbsoluteFill>
//      ...ganzer Szeneninhalt...
//      <PremiumGrade />
//    </AbsoluteFill>
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export type GradeIntensity = 'subtle' | 'normal' | 'strong';

const PRESET: Record<GradeIntensity, { bloom: number; fringe: number; grain: number; vignette: number }> = {
  subtle: { bloom: 0.1, fringe: 0.05, grain: 0.03, vignette: 0.4 },
  normal: { bloom: 0.16, fringe: 0.09, grain: 0.045, vignette: 0.55 },
  strong: { bloom: 0.24, fringe: 0.14, grain: 0.065, vignette: 0.68 },
};

export const PremiumGrade: React.FC<{
  intensity?: GradeIntensity;
  bloomColor?: string;
}> = ({ intensity = 'normal', bloomColor = '255,255,255' }) => {
  const f = useCurrentFrame();
  const cfg = PRESET[intensity];
  const grainId = 'pg-grain';

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Bloom: helle Bildmitte weich überstrahlt (screen = nur Aufhellung) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% 38%, rgba(${bloomColor},${cfg.bloom}), transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Farbrand-Fringing: dünner Rot/Cyan-Farbsaum an den Bildrändern —
          billige Annäherung an chromatische Aberration ohne Full-Tree-Filter */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, rgba(255,40,40,${cfg.fringe}) 0%, transparent 6%, transparent 94%, rgba(40,220,255,${cfg.fringe}) 100%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Filmkorn — echtes bewegtes Noise, kein statisches Punktraster */}
      <AbsoluteFill style={{ opacity: cfg.grain, mixBlendMode: 'overlay' }}>
        <svg width="100%" height="100%">
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={f % 90} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </AbsoluteFill>

      {/* Vignette — dunkler Bildrand, lenkt Blick zur Mitte */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 90% at 50% 45%, transparent 42%, rgba(0,0,0,${cfg.vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
