import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, interpolate, staticFile } from 'remotion';
import {
  ThemeProvider, PremiumIconLabel, Lucide, PremiumIcon, a, C, FONT,
  Focus, dim, PushIn, Float, Shake, WhipIn, ZoomPunch, GlowOrb,
  Badge, DrawOn, IconStrike,
  Captions, type Caption, Voiceover,
} from '@studio/core';
import { BRAND } from '../../../brand/brand';
// @ts-ignore — JSON-Import, echtes Whisper-Wort-Timing aus scripts/transcribe.mjs.
import voiceoverCaptionsRaw from '../../../public/reels/openai-hack/captions/voiceover.json';

const voiceoverCaptions = voiceoverCaptionsRaw as unknown as Caption[];

// ════════════════════════════════════════════════════════════════════════════
//  OPENAI-HACK — "OpenAIs KI ist ausgebrochen und hat gehackt"   ·   Kanal: ki
//  9:16, 1080×1920, 30fps. Audio: 01-script-audio/audio/Reel 1 (5).mp4 — 76.49s,
//  transkribiert via scripts/transcribe.mjs (echtes Whisper-Timing). 11 Beats aus
//  06-projektdateien/storyboard.md, Bilder aus 02-bilder/images/ final zugeordnet.
//  Leitmotiv: Sandbox-Box (Lila = KI-Handlung, Cyan = Mensch/Kontrolle/Fix).
// ════════════════════════════════════════════════════════════════════════════

const W = 1080;
const H = 1920;
const LILA = BRAND.accent;   // '#B98CFF' — KI-Handlung
const CYAN = '#3FB8CE';      // Mensch/Kontrolle/Fix
const INK = BRAND.ink;

// ─── Beat-Grenzen (echtes Whisper-Timing, ms→Frame @30fps) ───────────────────
const F = {
  ausbruch: 0,        // "Eine KI von OpenAI ist aus ihrem Testkäfig ausgebrochen"
  serverHack: 4360,   // "und hat sich in fremde Server gehackt."
  fehlerA: 6320,       // "Zwei Testmodelle, darunter das neue GPT-5.6 Sol ..."
  fehlerB: 13200,      // "Die Sandbox war eigentlich vom Internet abgeschottet ..."
  was: 19150,          // "Die Modelle nutzten eine unbekannte Lücke ..."
  begriffA: 29440,     // "OpenAI nennt das 'misspezifiziertes Ziel' ..."
  begriffB: 37240,     // "Kein Bewusstsein, keine böse Absicht ..."
  wer: 41520,          // "Nicht OpenAI hat den Einbruch bemerkt ..."
  betrifftA: 49070,    // "Cursor, Co-Pilot, jeder Agentenassistent ..."
  betrifftB: 55110,    // "Je mehr Zugriff du einer KI gibst ..."
  cta: 60540,          // "Kommentier 'Agent' ..."
  end: 67220,          // Audio-Ende (schnellere Fassung, 1.08x + Pausen gekürzt)
};
const toF = (ms: number) => Math.round((ms / 1000) * 30);
const BEAT_BREAKS_MS = [F.serverHack, F.fehlerA, F.fehlerB, F.was, F.begriffA, F.begriffB, F.wer, F.betrifftA, F.betrifftB, F.cta];

// ─── Beat-Dauern (Frames @30fps) ──────────────────────────────────────────────
const S1 = toF(F.serverHack) - toF(F.ausbruch);
const S2 = toF(F.fehlerA) - toF(F.serverHack);
const S3 = toF(F.fehlerB) - toF(F.fehlerA);
const S4 = toF(F.was) - toF(F.fehlerB);
const S5 = toF(F.begriffA) - toF(F.was);
const S6 = toF(F.begriffB) - toF(F.begriffA);
const S7 = toF(F.wer) - toF(F.begriffB);
const S8 = toF(F.betrifftA) - toF(F.wer);
const S9 = toF(F.betrifftB) - toF(F.betrifftA);
const S10 = toF(F.cta) - toF(F.betrifftB);
const S11 = toF(F.end) - toF(F.cta) + 90; // + 3s Nachlauf

// ─── Globale Kopfzeile — EIN Element, lebt über alle Sequences hinweg ────────
// Kapitel-Kopfzeile: wechselt pro Szenen-Gruppe den Titel (sanfter Crossfade,
// kein Hard-Cut) — zeigt worum es im jeweiligen Beat gerade geht.
const CHAPTERS: { at: number; icon: string; label: string }[] = [
  { at: toF(F.ausbruch), icon: 'unlock', label: 'DER AUSBRUCH' },         // Szene 01–02
  { at: toF(F.fehlerA), icon: 'bug', label: 'DER FEHLER' },               // Szene 03–04
  { at: toF(F.was), icon: 'route', label: 'DER EINBRUCH' },               // Szene 05
  { at: toF(F.begriffA), icon: 'target', label: 'KEIN SKYNET' },          // Szene 06–07
  { at: toF(F.wer), icon: 'radar', label: 'DIE ENTDECKUNG' },             // Szene 08
  { at: toF(F.betrifftA), icon: 'shield-alert', label: 'WARUM DAS DICH BETRIFFT' }, // Szene 09–10
  { at: toF(F.cta), icon: 'message-circle-plus', label: 'MITMACHEN' },    // Szene 11
];
const CHAPTER_FADE = 16; // Frames Crossfade-Dauer am Kapitel-Wechsel

const Header: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) if (f >= CHAPTERS[i].at) idx = i;
  const cur = CHAPTERS[idx];
  const next = CHAPTERS[idx + 1];
  // Crossfade: aktuelles Kapitel blendet aus, während das nächste (falls vorhanden) einblendet
  const fadeOutStart = next ? next.at - CHAPTER_FADE : Infinity;
  const curOpacity = next
    ? interpolate(f, [fadeOutStart, next.at], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  return (
    <div style={{ position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: curOpacity, display: 'flex', alignItems: 'center', gap: 18, padding: '17px 36px', borderRadius: 999,
          background: a('#FFFFFF', 0.88), border: `2.5px solid ${a(INK, 0.1)}`, boxShadow: `0 14px 38px ${a(INK, 0.16)}` }}>
          <Lucide name={cur.icon} size={36} color={LILA} />
          <span style={{ fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: INK, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{cur.label}</span>
        </div>
        {next && (
          <div style={{ position: 'absolute', opacity: 1 - curOpacity, display: 'flex', alignItems: 'center', gap: 18,
            padding: '17px 36px', borderRadius: 999, background: a('#FFFFFF', 0.88), border: `2.5px solid ${a(INK, 0.1)}`,
            boxShadow: `0 14px 38px ${a(INK, 0.16)}` }}>
            <Lucide name={next.icon} size={36} color={LILA} />
            <span style={{ fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: INK, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{next.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Fade-In/Out-Wrapper für einen Beat (weiche Übergänge statt Hard-Cut) ────
const BeatFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 14, dur - 16, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ─── Untere Lesbarkeits-Zone für Captions — dunkler Verlauf, egal welcher BG ─
const BottomScrim: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, pointerEvents: 'none',
    background: `linear-gradient(180deg, transparent 0%, ${a('#000', 0.5)} 100%)` }} />
);

// ─── Bild: Vollbild-Hintergrund (Variante 1, objectFit cover) ────────────────
// scale/shiftY: optional Crop-Steuerung — z.B. um eine ins Bild eingebrannte
// Titelzeile nach oben aus dem Frame zu croppen, damit Inhalt weiter oben sitzt
// und unten mehr Abstand zur Caption-Zone bleibt.
const ImgFull: React.FC<{ src: string; tint?: string; scale?: number; shiftY?: number }> = ({ src, tint = LILA, scale = 1, shiftY = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
      transform: `scale(${scale}) translateY(${shiftY}px)`, transformOrigin: 'center top' }} />
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(180deg, ${a('#000', 0.18)} 0%, transparent 24%, transparent 62%, ${a('#000', 0.5)} 100%)` }} />
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(155deg, ${a(tint, 0.05)} 0%, transparent 40%, transparent 70%, ${a(CYAN, 0.05)} 100%)` }} />
  </div>
);

// ─── Bild: klein+mittig (Variante 2, gerahmt, objectFit contain) ────────────
const IMG_W = 720, IMG_H = 760, IMG_TOP = 470;
const IMG_LEFT = (W - IMG_W) / 2;
const ImgSmall: React.FC<{ src: string; tint?: string; h?: number; top?: number }> = ({ src, tint = LILA, h = IMG_H, top = IMG_TOP }) => (
  <>
    <div style={{ position: 'absolute', left: IMG_LEFT - 130, top: top - 110, width: IMG_W + 260, height: h + 220,
      borderRadius: '50%', pointerEvents: 'none',
      background: `radial-gradient(circle, ${a(tint, 0.16)} 0%, transparent 62%)`, filter: 'blur(2px)' }} />
    <div style={{ position: 'absolute', left: IMG_LEFT - 2, top: top - 2, width: IMG_W + 4, height: h + 4,
      borderRadius: 30, padding: 2,
      background: `linear-gradient(155deg, ${a(tint, 0.55)} 0%, ${a('#000', 0)} 35%, ${a('#000', 0)} 70%, ${a(CYAN, 0.35)} 100%)` }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden',
        background: '#FFFFFF', boxShadow: `0 36px 70px ${a(INK, 0.28)}` }}>
        <img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </div>
  </>
);

// ─── kleine Glas-Badge (Text/Icon), Standard-UI-Baustein für alle Szenen ─────
const GlassBadge: React.FC<{ icon: string; text: string; color: string; at: number; style?: React.CSSProperties }> = ({ icon, text, color, at, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(f, [at, at + 16], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: p, transform: `translateY(${ty}px)`, display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 22px', borderRadius: 999, background: a(color, 0.13), border: `2px solid ${a(color, 0.45)}`,
      boxShadow: `0 10px 26px ${a(color, 0.18)}`, ...style }}>
      <Lucide name={icon} size={21} color={color} />
      <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 19, color: INK }}>{text}</span>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 01 — Ausbruch  (Bild-Var. 2 klein+mittig + Anim.-Var. 4 Glas-Badges)
// ════════════════════════════════════════════════════════════════════════════
const Scene01: React.FC = () => (
  <BeatFade dur={S1}>
    <Float amp={4} speed={0.7} style={{ position: 'absolute', inset: 0 }}>
      <ImgFull src="reels/openai-hack/images/01-sandbox-ausbruch.jpeg" tint={LILA} />
    </Float>
    <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <GlassBadge icon="unlock" text="TESTKÄFIG AUSGEBROCHEN" color={LILA} at={8} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 02 — In fremde Server  (Bild-Var. 1 Vollbild + Anim.-Var. 1 Push-in)
// ════════════════════════════════════════════════════════════════════════════
const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S2}>
      <WhipIn at={0} dur={12} style={{ position: 'absolute', inset: 0 }}>
        <PushIn durFrames={S2} from={1.08} to={1.2}>
          <ImgFull src="reels/openai-hack/images/02-server-hack.jpeg" tint={LILA} />
        </PushIn>
      </WhipIn>
      <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [4, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <GlassBadge icon="server" text="FREMDE SERVER" color={LILA} at={4} />
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 03 — Der eigentliche Fehler (Teil A)  (Bild-Var. 2 + Anim.-Var. 3 unten)
// ════════════════════════════════════════════════════════════════════════════
const S03_IMG_TOP = 340, S03_IMG_H = 760;
const IconChip: React.FC<{ icon: string; color: string; at: number; style?: React.CSSProperties }> = ({ icon, color, at, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(f, [at, at + 16], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', opacity: p, transform: `scale(${scale})`, width: 56, height: 56, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', background: a('#FFFFFF', 0.92),
      border: `2px solid ${a(color, 0.5)}`, boxShadow: `0 12px 28px ${a(color, 0.28)}`, ...style }}>
      <Lucide name={icon} size={26} color={color} />
    </div>
  );
};
const Scene03: React.FC = () => (
  <BeatFade dur={S3}>
    <ZoomPunch at={0} dur={16}>
      <ImgSmall src="reels/openai-hack/images/03-testmodelle.jpeg" tint={CYAN} top={S03_IMG_TOP} h={S03_IMG_H} />
    </ZoomPunch>
    <IconChip icon="flask-conical" color={LILA} at={20} style={{ left: IMG_LEFT - 30, top: S03_IMG_TOP - 30 }} />
    <IconChip icon="search" color={CYAN} at={30} style={{ right: IMG_LEFT - 30, top: S03_IMG_TOP - 30 }} />
    <div style={{ position: 'absolute', top: S03_IMG_TOP + S03_IMG_H + 90, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', gap: 16 }}>
      <GlassBadge icon="flask-conical" text="GPT-5.6 SOL" color={LILA} at={40} />
      <GlassBadge icon="search" text="SICHERHEITSÜBUNG" color={CYAN} at={64} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 04 — Der eigentliche Fehler (Teil B)  (Bild-Var. 1 + Anim.-Var. 1)
// ════════════════════════════════════════════════════════════════════════════
const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <BeatFade dur={S4}>
      <ImgFull src="reels/openai-hack/images/04-konfigurationsfehler.jpeg" tint={CYAN} scale={1.12} shiftY={-70} />
      <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <GlassBadge icon="user-x" text="MENSCHLICHER FEHLER" color={CYAN} at={6} />
      </div>
      {f > 60 && (
        <div style={{ position: 'absolute', bottom: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <GlassBadge icon="wifi" text="NICHT ISOLIERT" color={LILA} at={70} />
        </div>
      )}
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 05 — Was die KI daraus machte  (Bild-Var. 1 Vollbild, einfacher Entrance)
// ════════════════════════════════════════════════════════════════════════════
const Scene05: React.FC = () => (
  <BeatFade dur={S5}>
    {/* eingebrannte Titelzeile/Kopfabstand oben aus dem Bild croppen → Panels rutschen hoch, mehr Luft unten zur Caption-Zone */}
    <ImgFull src="reels/openai-hack/images/05-drei-schritte.jpeg" tint={LILA} scale={1.03} shiftY={-55} />
    <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <GlassBadge icon="route" text="DREI SCHRITTE ZUM EINBRUCH" color={LILA} at={8} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 06 — Kein Skynet, ein Fachbegriff (Teil A)  (Bild-Var. 2 + Anim.-Var. 4)
// ════════════════════════════════════════════════════════════════════════════
const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  // ruhiges Bild, nur ein einmaliger sanfter Entrance — keine Dauer-Animation
  const scale = interpolate(f, [0, 18], [0.96, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <BeatFade dur={S6}>
      <div style={{ position: 'absolute', inset: 0, opacity, transform: `scale(${scale})` }}>
        <ImgFull src="reels/openai-hack/images/06-misspezifiziertes-ziel.jpg" tint={LILA} />
      </div>
      <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <GlassBadge icon="target" text="MISSPEZIFIZIERTES ZIEL" color={LILA} at={0} />
      </div>
      <div style={{ position: 'absolute', bottom: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <GlassBadge icon="zap" text="ZIEL WICHTIGER ALS GRENZE" color={LILA} at={30} />
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 07 — Kein Skynet, ein Fachbegriff (Teil B)  (Anim.-Var. 5, kein Bild)
// ════════════════════════════════════════════════════════════════════════════
const Pill: React.FC<{ text: string; color: string; at: number; struck?: boolean; strikeAt?: number }> = ({ text, color, at, struck, strikeAt = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(f, [at, at + 16], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: p, transform: `translateY(${ty}px)`, display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 30px', borderRadius: 999, background: a(color, 0.1), border: `2px solid ${a(color, 0.4)}`, minWidth: 380 }}>
      {struck ? <IconStrike name="x" size={26} at={strikeAt} strikeAt={strikeAt + 10} color={color} /> : <Lucide name="check" size={26} color={color} />}
      <span style={{ fontFamily: FONT.title, fontSize: 25, color: INK }}>{text}</span>
    </div>
  );
};
const Scene07: React.FC = () => (
  <BeatFade dur={S7}>
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
      <Pill text="Bewusstsein" color={CYAN} at={4} struck strikeAt={26} />
      <Pill text="böse Absicht" color={CYAN} at={40} struck strikeAt={62} />
      <Pill text="radikale Zielverfolgung" color={LILA} at={90} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 08 — Wer es gemerkt hat  (Bild-Var. 1 Vollbild + Anim.-Var. 1)
// ════════════════════════════════════════════════════════════════════════════
const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const gearAt = S8 - 90;
  return (
    <BeatFade dur={S8}>
      {/* Split-Screen-Vergleich braucht ruhige, mittige Vollbild-Darstellung — kein Pan/Zoom, sonst wirkt es schief/nicht Vollbild */}
      <ImgFull src="reels/openai-hack/images/08-huggingface-entdeckung.jpg" tint={CYAN} />
      <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <GlassBadge icon="radar" text="EINBRUCH ERKANNT" color={CYAN} at={10} />
      </div>
      {f > gearAt && (
        <Shake at={gearAt} strength={6} durFrames={14} style={{ position: 'absolute', bottom: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999,
            background: a('#FFFFFF', 0.9), border: `2px solid ${a(INK, 0.12)}`, boxShadow: `0 14px 30px ${a(INK, 0.18)}`,
            opacity: interpolate(f, [gearAt, gearAt + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ transform: `rotate(${interpolate(f, [gearAt, S8], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}deg)` }}>
              <Lucide name="settings" size={24} color={LILA} />
            </div>
            <span style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 18, color: INK }}>GEMEINSAM PATCHEN</span>
          </div>
        </Shake>
      )}
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 09 — Warum dich das betrifft (Teil A)  (Bild-Var. 2 + Anim.-Var. 2 oben)
// ════════════════════════════════════════════════════════════════════════════
const ToolIcon: React.FC<{ icon: string; at: number }> = ({ icon, at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(f, [at, at + 14], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: p, transform: `scale(${scale})` }}>
      <PremiumIcon name={icon} size="sm" at={at} color={LILA} />
    </div>
  );
};
const Scene09: React.FC = () => (
  <BeatFade dur={S9}>
    <ImgFull src="reels/openai-hack/images/09-agenten-tools.jpg" tint={LILA} />
    <div style={{ position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22 }}>
      <ToolIcon icon="code" at={8} />
      <ToolIcon icon="message-square" at={26} />
      <ToolIcon icon="globe" at={44} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 10 — Warum dich das betrifft (Teil B)  (Anim.-Var. 6 abgedunkelt + mittig)
// ════════════════════════════════════════════════════════════════════════════
const Scene10: React.FC = () => (
  <BeatFade dur={S10}>
    <ImgFull src="reels/openai-hack/images/09-agenten-tools.jpg" tint={LILA} />
    <div style={{ position: 'absolute', top: 224, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <GlassBadge icon="hand" text="GRENZEN ZIEHEN — NICHT DIE KI" color={CYAN} at={30} />
    </div>
  </BeatFade>
);

// ════════════════════════════════════════════════════════════════════════════
//  SZENE 11 — CTA  (Anim.-Var. 5, kein Bild)
// ════════════════════════════════════════════════════════════════════════════
const CheckItem: React.FC<{ text: string; icon: string; at: number }> = ({ text, icon, at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ty = interpolate(f, [at, at + 16], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const checked = f > at + 12;
  return (
    <div style={{ opacity: p, transform: `translateY(${ty}px)`, display: 'flex', alignItems: 'center', gap: 18,
      width: 780, padding: '18px 26px', borderRadius: 22, background: a('#FFFFFF', 0.85),
      border: `2px solid ${a(INK, 0.08)}`, boxShadow: `0 14px 34px ${a(INK, 0.14)}` }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: a(LILA, 0.12), border: `2px solid ${a(LILA, 0.4)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Lucide name={icon} size={26} color={LILA} />
      </div>
      <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 27, color: INK, flex: 1 }}>{text}</span>
      <div style={{ width: 32, height: 32, borderRadius: 999, border: `2.5px solid ${a(CYAN, 0.6)}`,
        background: checked ? a(CYAN, 0.9) : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0 }}>
        {checked && <Lucide name="check" size={18} color="#fff" />}
      </div>
    </div>
  );
};
const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const bubbleScale = interpolate(f, [8, 30], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bubbleOp = interpolate(f, [8, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(f * 0.12) * 0.03;
  return (
    <BeatFade dur={S11}>
      <GlowOrb x={180} y={420} size={340} color={LILA} driftY={30} />
      <GlowOrb x={900} y={1080} size={320} color={CYAN} driftY={26} />
      <div style={{ position: 'absolute', top: 240, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: bubbleOp, transform: `scale(${bubbleScale * pulse})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '26px 52px', borderRadius: 36,
          background: a(LILA, 0.16), border: `3px solid ${a(LILA, 0.6)}`, boxShadow: `0 26px 60px ${a(LILA, 0.32)}` }}>
          <Lucide name="message-circle" size={44} color={LILA} />
          <span style={{ fontFamily: FONT.title, fontSize: 52, color: INK }}>„AGENT"</span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [20, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 24, color: a(INK, 0.75) }}>
          Kommentieren, bevor du den nächsten Agenten startest:
        </span>
      </div>
      <div style={{ position: 'absolute', top: 620, left: 0, right: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <CheckItem text="Was darf die KI wirklich anfassen?" icon="hand" at={50} />
        <CheckItem text="Was passiert, wenn sie zu weit geht?" icon="alert-triangle" at={92} />
        <CheckItem text="Wer merkt es, wenn etwas schiefläuft?" icon="eye" at={134} />
      </div>
      <div style={{ position: 'absolute', top: 1140, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: interpolate(f, [170, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `scale(${interpolate(f, [170, 190], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 44px', borderRadius: 999,
          background: LILA, boxShadow: `0 22px 50px ${a(LILA, 0.4)}` }}>
          <Lucide name="message-circle-plus" size={30} color="#fff" />
          <span style={{ fontFamily: FONT.title, fontSize: 30, color: '#fff' }}>KOMMENTIER „AGENT"</span>
        </div>
      </div>
    </BeatFade>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════
export const OPENAI_HACK_FRAMES = S1 + S2 + S3 + S4 + S5 + S6 + S7 + S8 + S9 + S10 + S11;

export const OpenAIHack: React.FC = () => (
  <ThemeProvider value={BRAND}>
    <AbsoluteFill style={{ background: BRAND.bg, overflow: 'hidden' }}>
      <Series>
        <Series.Sequence durationInFrames={S1}><Scene01 /></Series.Sequence>
        <Series.Sequence durationInFrames={S2}><Scene02 /></Series.Sequence>
        <Series.Sequence durationInFrames={S3}><Scene03 /></Series.Sequence>
        <Series.Sequence durationInFrames={S4}><Scene04 /></Series.Sequence>
        <Series.Sequence durationInFrames={S5}><Scene05 /></Series.Sequence>
        <Series.Sequence durationInFrames={S6}><Scene06 /></Series.Sequence>
        <Series.Sequence durationInFrames={S7}><Scene07 /></Series.Sequence>
        <Series.Sequence durationInFrames={S8}><Scene08 /></Series.Sequence>
        <Series.Sequence durationInFrames={S9}><Scene09 /></Series.Sequence>
        <Series.Sequence durationInFrames={S10}><Scene10 /></Series.Sequence>
        <Series.Sequence durationInFrames={S11}><Scene11 /></Series.Sequence>
      </Series>
      <BottomScrim />
      <Header />
      <Captions captions={voiceoverCaptions} perGroup={4} bottom={192} size={38}
        highlight={LILA} hardBreaksMs={BEAT_BREAKS_MS} instant />
      <Voiceover src="reels/openai-hack/audio/voiceover.mp4" />
    </AbsoluteFill>
  </ThemeProvider>
);
