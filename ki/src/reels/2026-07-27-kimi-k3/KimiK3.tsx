import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, interpolate, staticFile } from 'remotion';
import {
  ThemeProvider, PremiumIconLabel, Lucide, PremiumIcon, a, C, FONT,
  Focus, dim, KenBurns, PushIn, Float, Shake,
  Badge, MilestoneTimeline,
  IconStrike, RollingNumber, DrawOn,
  Captions, type Caption, Voiceover,
} from '@studio/core';
import { BRAND } from '../../../brand/brand';
// @ts-ignore — JSON-Import, echtes Whisper-Wort-Timing aus scripts/transcribe.mjs.
import voiceoverCaptionsRaw from '../../../public/reels/kimi-k3/captions/voiceover.json';

const voiceoverCaptions = voiceoverCaptionsRaw as unknown as Caption[];

// ════════════════════════════════════════════════════════════════════════════
//  KIMI K3 — "China baut das größte offene KI-Modell der Welt"   ·   Kanal: ki
//  9:16, 1080×1920, 30fps. Audio: 01-script-audio/audio/Reel1 (5).mp4 — 93.87s,
//  transkribiert via scripts/transcribe.mjs (echtes Whisper-Timing). Beats gegen
//  Wort-Zeitstempel aus dem Skript gematcht (siehe F unten). Bilder: 7 kuratierte
//  Editorial-Illustrationen aus 02-bilder/images/, je Szene final zugeordnet.
// ════════════════════════════════════════════════════════════════════════════

const W = 1080;
const H = 1920;
const LILA = BRAND.accent;      // Kimi K3 selbst
const CYAN = '#7FD9E8';         // Kontext/Vergleichsmodelle
const WARN = '#E0684A';         // gedämpftes Rot-Orange — NUR Szene 06

// ─── Beat-Grenzen (echtes Whisper-Timing, ms→Frame @30fps) ───────────────────
const F = {
  hook: 0,          // "Ein chinesisches Start-up hat gerade ..."
  wer: 12700,        // "Moonshot.ai, Start-up aus China ..."
  benchmark: 25700,  // "Im Coding-Benchmark liegt K3 vorn ..."
  openweight: 50200, // "K3 wird 'offen' genannt ..."
  moe: 68200,        // "Wie schafft ein Start-up mit weniger Chip-Zugang ..."
  fakt: 80200,       // "Und der wichtigste Punkt ..."
  cta: 89200,        // "Kommentier 'Kimi' ..."
  end: 93867,        // Audio-Ende
};
const toF = (ms: number) => Math.round((ms / 1000) * 30);
const BEAT_BREAKS_MS = [F.wer, F.benchmark, F.openweight, F.moe, F.fakt, F.cta];

// ─── Beat-Dauern (Frames @30fps) — aus echtem Whisper-Timing (F oben) ────────
const S1 = toF(F.wer) - toF(F.hook);        // Hook
const S2 = toF(F.benchmark) - toF(F.wer);   // Wer steckt dahinter
const S3 = toF(F.openweight) - toF(F.benchmark); // Benchmark
const S4 = toF(F.moe) - toF(F.openweight);  // Open Weight
const S5 = toF(F.fakt) - toF(F.moe);        // MoE-Trick
const S6 = toF(F.cta) - toF(F.fakt);        // verschwiegener Fakt
const S7 = toF(F.end) - toF(F.cta) + 90;    // CTA + 3s Nachlauf

// ─── Globale Kopfzeile — EIN Element, lebt über alle Sequences hinweg ────────
// (verhindert den Doppel-Header-Bug: nicht pro Sequence neu gemountet)
const Header: React.FC = () => (
  <div style={{ position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50 }}>
    <PremiumIconLabel name="brain-circuit" label="KIMI K3 — EINORDNUNG" size="md" at={0} fontSize={30} gap={26} textColor={C.white} />
  </div>
);

// ─── Fade-In/Out-Wrapper für einen Beat (weiche Übergänge statt Hard-Cut) ────
const BeatFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 14, dur - 16, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ─── Bild: Vollbild-Hintergrund (Variante 1, objectFit cover) ────────────────
const ImgFull: React.FC<{ src: string; tint?: string }> = ({ src, tint = LILA }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    {/* Lesbarkeits-Verläufe oben/unten + leichter Marken-Tint */}
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(180deg, ${a('#000', 0.42)} 0%, transparent 22%, transparent 68%, ${a('#000', 0.48)} 100%)` }} />
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(155deg, ${a(tint, 0.08)} 0%, transparent 40%, transparent 70%, ${a(CYAN, 0.06)} 100%)` }} />
  </div>
);

// ─── Bild: klein+mittig (Variante 2, gerahmt, objectFit cover) ──────────────
const IMG_W = 700, IMG_H = 760, IMG_TOP = 470;
const IMG_LEFT = (W - IMG_W) / 2;
const ImgSmall: React.FC<{ src: string; tint?: string }> = ({ src, tint = LILA }) => (
  <>
    <div style={{ position: 'absolute', left: IMG_LEFT - 130, top: IMG_TOP - 130, width: IMG_W + 260, height: IMG_H + 260,
      borderRadius: '50%', pointerEvents: 'none',
      background: `radial-gradient(circle, ${a(tint, 0.16)} 0%, transparent 62%)`, filter: 'blur(2px)' }} />
    <div style={{ position: 'absolute', left: IMG_LEFT - 2, top: IMG_TOP - 2, width: IMG_W + 4, height: IMG_H + 4,
      borderRadius: 30, padding: 2,
      background: `linear-gradient(155deg, ${a(tint, 0.5)} 0%, ${a('#000', 0)} 35%, ${a('#000', 0)} 70%, ${a(CYAN, 0.3)} 100%)` }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden',
        boxShadow: `0 36px 70px ${a('#000', 0.55)}` }}>
        <img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  </>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 01 — Hook  (Bild-Var. 1 Vollbild + Anim.-Platz. 1 oben-mittig)
// ════════════════════════════════════════════════════════════════════════════
const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S1}>
      {/* Bild trägt bereits "2,8 Billionen Parameter" + Kimi-K3-Karte + Claude/GPT-Kontextkarten —
          keine doppelten Text-Overlays, nur Kamerabewegung für Spannung. */}
      <PushIn durFrames={S1} from={1} to={1.09}>
        <KenBurns durFrames={S1} from={1.02} to={1.1} panX={-30} panY={-18}>
          <ImgFull src="reels/kimi-k3/images/01-hook.jpeg" />
        </KenBurns>
      </PushIn>

      {/* Kicker-Chip unterhalb der Kopfzeile, kündigt den Hook an */}
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [4, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(f, [4, 20], [-16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 999,
          background: a(LILA, 0.14), border: `2px solid ${a(LILA, 0.4)}` }}>
          <Lucide name="flag" size={20} color={LILA} />
          <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 19, color: C.white }}>CHINA · MOONSHOT.AI</span>
        </div>
      </div>

      {/* Kontrastierendes Detail unten: Größenvergleich als Chip */}
      <Float amp={5} speed={0.8} style={{ position: 'absolute', bottom: 180, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [S1 - 60, S1 - 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 999,
          background: a(CYAN, 0.12), border: `2px solid ${a(CYAN, 0.35)}` }}>
          <Lucide name="scale" size={22} color={CYAN} />
          <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 20, color: a(C.white, 0.9) }}>Größer als Claude & GPT</span>
        </div>
      </Float>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 02 — Wer steckt dahinter  (Bild-Var. 2 + Anim.-Platz. 2 Lücke oben)
// ════════════════════════════════════════════════════════════════════════════
const Scene02: React.FC = () => (
  <BeatFade dur={S2}>
    <Float amp={4} speed={0.7} style={{ position: 'absolute', inset: 0 }}>
      <ImgSmall src="reels/kimi-k3/images/02-wer-steckt-dahinter.jpeg" tint={CYAN} />
    </Float>

    {/* Animation in der Lücke OBEN (zwischen Kopfzeile ~150 und Bild bei 470) */}
    <div style={{ position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <MilestoneTimeline
        at={10} per={40} width={780}
        items={[
          { label: 'Januar', title: '500 Mio. $ Investment', color: CYAN },
          { label: '17. Juli', title: 'Kimi K3 vorgestellt', color: LILA },
        ]}
      />
    </div>

    {/* Karten links/rechts unter dem Bild */}
    <div style={{ position: 'absolute', top: IMG_TOP + IMG_H + 40, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', gap: 20 }}>
      <Focus on={false}>
        <div style={{ ...dim(true) }}>
          <StatChip icon="banknote" value="500 Mio $" label="Investment" color={CYAN} at={60} />
        </div>
      </Focus>
      <div style={{ ...dim(true) }}>
        <StatChip icon="landmark" value="4,3 Mrd $" label="Bewertung" color={CYAN} at={72} />
      </div>
      <Focus on amount={0.08}>
        <StatChip icon="rocket" value="17. Juli" label="Kimi K3" color={LILA} at={84} />
      </Focus>
    </div>
  </BeatFade>
);

const StatChip: React.FC<{ icon: string; value: string; label: string; color: string; at: number }> = ({ icon, value, label, color, at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(f, [at, at + 14], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: p, transform: `translateY(${ty}px)`, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8, padding: '18px 16px', borderRadius: 20, width: 168,
      background: a(color, 0.1), border: `2px solid ${a(color, 0.4)}` }}>
      <Lucide name={icon} size={30} color={color} />
      <div style={{ fontFamily: FONT.title, fontSize: 26, color }}>{value}</div>
      <div style={{ fontFamily: FONT.body, fontSize: 17, color: a(C.white, 0.7) }}>{label}</div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 03 — Der Benchmark, richtig gelesen  (Vollbild + Anim. mittig)
// ════════════════════════════════════════════════════════════════════════════
const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S3}>
      {/* Bild trägt bereits den vollständigen Balken-Chart (K3 — 1.679, Fable 5, Sol, GLM-5.2) —
          kein doppelter Chart-Overlay, nur Kamerabewegung. Die Korrektur unten ist neue Info. */}
      <KenBurns durFrames={S3} from={1.02} to={1.08} panX={20} panY={-14}>
        <ImgFull src="reels/kimi-k3/images/03-benchmark.jpeg" tint={LILA} />
      </KenBurns>

      {/* Kicker oben, per Hand unterstrichen — "vorn im Coding-Benchmark" */}
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', opacity: interpolate(f, [4, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <span style={{ fontFamily: FONT.title, fontSize: 30, color: C.white }}>Vorn im Coding-Benchmark</span>
          <DrawOn variant="underline" w={420} h={20} at={20} durFrames={22} color={LILA}
            style={{ left: '50%', transform: 'translateX(-50%)', bottom: -14 }} />
        </div>
      </div>

      {/* Korrektur-Panel — schiebt sich bei "Aber Moonshot selbst sagt" ein */}
      {f > 240 && (
        <Shake at={260} strength={9} durFrames={16} style={{ position: 'absolute', bottom: 260, left: 60, right: 60 }}>
          <Focus on amount={0.06}>
            <div style={{ borderRadius: 26, padding: '30px 34px', background: a('#1A1420', 0.9),
              border: `2px solid ${a(WARN, 0.45)}`, boxShadow: `0 20px 50px ${a('#000', 0.5)}`,
              opacity: interpolate(f, [246, 268], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(f, [246, 268], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <Lucide name="arrow-down" size={30} color={WARN} />
                <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.white }}>
                  Gesamtleistung: hinter Fable 5 / Sol
                </div>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 20, color: a(C.white, 0.65), paddingLeft: 44 }}>
                Geschlagen: Opus 4.8 · GPT-5.5 (Vorgänger-Gen.)
              </div>
            </div>
          </Focus>
        </Shake>
      )}
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 04 — Open Weight ist nicht Open Source  (Vollbild Split + Anim. auf Split)
// ════════════════════════════════════════════════════════════════════════════
const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S4}>
      {/* Bild trägt bereits den kompletten Split (Gewichte laden ✓ / Zuhause nutzbar · 700 GB ·
          64 Beschleuniger) — kein doppelter Vergleichs-Overlay, nur sanfte Kamerabewegung. */}
      <PushIn durFrames={S4} from={1} to={1.05}>
        <ImgFull src="reels/kimi-k3/images/04-open-weight.jpeg" tint={CYAN} />
      </PushIn>

      {/* Titel-Chip oben — "Open Weight ≠ Open Source" */}
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 999,
          background: a(CYAN, 0.12), border: `2px solid ${a(CYAN, 0.4)}` }}>
          <span style={{ fontFamily: FONT.title, fontSize: 26, color: C.white }}>Open Weight</span>
          <Lucide name="not-equal" size={22} color={WARN} />
          <span style={{ fontFamily: FONT.title, fontSize: 26, color: a(C.white, 0.6) }}>Open Source</span>
        </div>
      </div>

      {/* Durchgestrichenes Zuhause-Icon-Detail unten — betont "nicht selbst hostbar" */}
      <div style={{ position: 'absolute', bottom: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <IconStrike name="house" size={48} at={S4 - 130} strikeAt={S4 - 108} color={WARN} />
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 05 — Der Trick dahinter  (Bild-Var. 2 + Anim. Lücke unten)
// ════════════════════════════════════════════════════════════════════════════
const Scene05: React.FC = () => {
  const dotStart = 20, dotEnd = 140;
  return (
    <BeatFade dur={S5}>
      {/* Bild trägt bereits das Raster (896 Punkte, 16 lila aktiv) — kein doppeltes
          Overlay-Raster, nur Kamerabewegung + Zähler unten. */}
      <ImgSmall src="reels/kimi-k3/images/05-moe-trick.jpeg" tint={LILA} />

      {/* Zähler + Icon in der Lücke UNTEN */}
      <div style={{ position: 'absolute', top: IMG_TOP + IMG_H + 36, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Lucide name="cpu" size={34} color={LILA} />
          <RollingNumber to={16} start={dotStart} end={dotEnd} size={70} color={LILA} suffix=" / 896" />
        </div>
        <Badge text="< 2 %" at={150} color={LILA} rotate={-2} size={24} />
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 06 — Der verschwiegene Fakt  (Vollbild, oben Chart-Lücke + unten 51%)
// ════════════════════════════════════════════════════════════════════════════
const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const revealAt = 90;
  // Bild trägt bereits den vollständigen Chart mit Lücke + 51%-Panel + Verbindungslinie, sauber
  // gestapelt (Chart oben, 51%-Reveal darunter, kein Overlap). Sanfter PushIn statt hartem Crop-Zoom.
  return (
    <BeatFade dur={S6}>
      <PushIn durFrames={S6} from={1} to={1.06}>
        <ImgFull src="reels/kimi-k3/images/06-verschwiegener-fakt.jpeg" tint={LILA} />
      </PushIn>

      {/* Warn-Chip oben, kündigt den verschwiegenen Fakt an */}
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(f, [0, 16], [-14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', borderRadius: 999,
          background: a(WARN, 0.14), border: `2px solid ${a(WARN, 0.4)}` }}>
          <Lucide name="eye-off" size={22} color={WARN} />
          <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 20, color: C.white }}>NICHT IM CHART</span>
        </div>
      </div>

      {/* Reveal-Glow um das 51%-Panel herum, sobald es im Bild sichtbar wird — weicher Radial-Schein statt harter Kante */}
      <Shake at={revealAt} strength={6} durFrames={14} style={{ position: 'absolute', bottom: 240, left: 0, right: 0, height: 420, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0,
          opacity: interpolate(f, [revealAt, revealAt + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${a(WARN, 0.28)} 0%, transparent 70%)` }} />
      </Shake>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 07 — CTA  (Bild-Var. 2, abgedunkelt + Anim. mittig)
// ════════════════════════════════════════════════════════════════════════════
const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S7}>
      <ImgSmall src="reels/kimi-k3/images/07-cta.jpeg" tint={LILA} />
      <div style={{ position: 'absolute', left: IMG_LEFT - 2, top: IMG_TOP - 2, width: IMG_W + 4, height: IMG_H + 4,
        borderRadius: 30, background: a('#000', 0.42) }} />

      <div style={{ position: 'absolute', top: IMG_TOP + IMG_H / 2 - 90, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ opacity: interpolate(f, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${interpolate(f, [10, 30], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
          <PremiumIcon name="table" size="lg" at={10} color={LILA} />
        </div>
        <Float amp={5} speed={1} style={{
          opacity: interpolate(f, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 30px', borderRadius: 999,
            background: a(LILA, 0.16), border: `2px solid ${a(LILA, 0.5)}`,
            boxShadow: `0 0 40px ${a(LILA, 0.35)}` }}>
            <Lucide name="message-circle" size={30} color={LILA} />
            <span style={{ fontFamily: FONT.title, fontSize: 34, color: C.white }}>„KIMI"</span>
          </div>
        </Float>
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════
export const KIMI_K3_FRAMES = S1 + S2 + S3 + S4 + S5 + S6 + S7;

export const KimiK3: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: '#0D0A14', overflow: 'hidden' }}>
      <Series>
        <Series.Sequence durationInFrames={S1}><Scene01 /></Series.Sequence>
        <Series.Sequence durationInFrames={S2}><Scene02 /></Series.Sequence>
        <Series.Sequence durationInFrames={S3}><Scene03 /></Series.Sequence>
        <Series.Sequence durationInFrames={S4}><Scene04 /></Series.Sequence>
        <Series.Sequence durationInFrames={S5}><Scene05 /></Series.Sequence>
        <Series.Sequence durationInFrames={S6}><Scene06 /></Series.Sequence>
        <Series.Sequence durationInFrames={S7}><Scene07 /></Series.Sequence>
      </Series>
      <Header />
      <Captions captions={voiceoverCaptions} perGroup={4} bottom={170} size={40}
        hardBreaksMs={BEAT_BREAKS_MS} instant />
      <Voiceover src="reels/kimi-k3/audio/voiceover.mp4" />
    </AbsoluteFill>
  </ThemeProvider>
);
