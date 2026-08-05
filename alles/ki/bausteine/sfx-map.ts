// ════════════════════════════════════════════════════════════════════════════
//  SFX-MAP — ordnet jedem KI-Kanal-Baustein (aus @studio/core, Kategorie
//  "KI-Tool-Bausteine" + Standard-Bausteine im Tech-Deck-Stil) den passenden
//  Sound aus dem kuratierten Set (channels/ki/public/sfx/, Lizenz-/Prompt-Log
//  siehe public/ASSETS.md — Set noch nicht generiert, siehe dort) + Frame-Offset
//  zum visuellen Höhepunkt zu.
//
//  offsetFrames ist relativ zum Start-Frame, den der Baustein selbst für seine
//  Einstiegs-Animation nimmt (meist Prop `at`/`start`). Sound liegt also bei
//  `<Sfx atSec={(at + SFX_MAP.X.offsetFrames) / fps} />`, NICHT bei `at` selbst.
//
//  Benutzung in einer Szene:
//
//    import { staticFile } from 'remotion';
//    import { Sfx } from '@studio/core';
//    import { SFX_MAP } from '../../bausteine/sfx-map';
//
//    const at = 40; // Frame, an dem der Baustein startet
//    const cue = SFX_MAP.TokenStreamMorph as SfxCue;
//    <Sfx src={staticFile(cue.file)} atSec={(at + cue.offsetFrames) / fps} />
//
//  Sparsam bleiben (SOUND.md): nicht bei jedem Baustein automatisch einen Sfx
//  feuern — nur bei den Beats, die wirklich betont werden sollen.
// ════════════════════════════════════════════════════════════════════════════

export type SfxCue = { file: string; offsetFrames: number; label?: string };

export const SFX_MAP: Record<string, SfxCue | SfxCue[]> = {
  // ── ChatUI (chatgpt.com-Mockup, Tipp-/Antwort-Momente) ────────────────────
  ChatUiKeystroke: { file: 'sfx/click-key.ogg', offsetFrames: 4, label: 'einzelner Tastenanschlag' },
  ChatUiTypingLoop: { file: 'sfx/keyboard-loop-texture.ogg', offsetFrames: 0, label: 'durchgehendes Tipp-Bett, solange Cursor blinkt' },
  ChatUiReply: { file: 'sfx/chime-notification.ogg', offsetFrames: 8, label: 'KI-Antwort-Bubble erscheint' },

  // ── TokenStream (Text → Chips → Zahlen-Vektor) ────────────────────────────
  TokenChipPop: { file: 'sfx/pop-soft.ogg', offsetFrames: 6, label: 'einzelnes Wort-Chip poppt auf' },
  TokenStreamMorph: { file: 'sfx/glitch-blip.ogg', offsetFrames: 4, label: 'Chips morphen zu Zahlen-Vektor' },

  // ── AiCanvasReveal (Bild/Seite entsteht progressiv) ───────────────────────
  AiCanvasScan: { file: 'sfx/whoosh-digital.ogg', offsetFrames: 0, label: 'Scan-Linie läuft durchs Bild' },
  AiCanvasDone: { file: 'sfx/reveal-swell.ogg', offsetFrames: -10, label: 'Bild ist fertig scharf (Ende Reveal)' },

  // ── BeforeAfterSlider (Wisch-Vergleich) ────────────────────────────────────
  SliderWipe: { file: 'sfx/whoosh-soft.ogg', offsetFrames: 0, label: 'Griff fährt über den Vergleich' },

  // ── AiThinking (Verarbeitungs-Puls zwischen Prompt und Antwort) ───────────
  AiThinkingLoop: { file: 'sfx/ai-thinking-pulse.ogg', offsetFrames: 0, label: 'durchgehend, solange Puls sichtbar ist' },

  // ── NeuralNet (Signal-/Backprop-Welle) ────────────────────────────────────
  NeuralNetWave: { file: 'sfx/whoosh-digital.ogg', offsetFrames: 10, label: 'Signal-Welle durchläuft die Schichten' },

  // ── LiveCodeCompile / Terminal (tippt → läuft → Output) ───────────────────
  CodeTypingLoop: { file: 'sfx/keyboard-loop-texture.ogg', offsetFrames: 0, label: 'Code tippt sich' },
  CodeRunResult: { file: 'sfx/chime-success.ogg', offsetFrames: 6, label: 'Output erscheint / Ausführung erfolgreich' },

  // ── Reveal-Momente (BigStat, Badge, Ranking, Tool-Namen) ──────────────────
  BigStatReveal: { file: 'sfx/reveal-swell.ogg', offsetFrames: -12, label: 'Zahl/Stat schlägt ein (Ende Count-up)' },
  BadgeStamp: { file: 'sfx/impact-soft.ogg', offsetFrames: 4, label: 'Tool-/Label-Badge landet' },
  RankingItemPop: { file: 'sfx/pop-soft.ogg', offsetFrames: 6, label: 'einzelne Ranking-Zeile schiebt rein' },

  // ── Mythos-Check / "das NICHT tun" (IconStrike, DontDoInstead) ────────────
  StrikeThrough: { file: 'sfx/error-buzz.ogg', offsetFrames: 10, label: 'Durchstreich-Linie zieht durch' },

  // ── WindowMock / Mockup-Einstiege (Browser-/App-Fenster erscheint) ────────
  WindowMockIn: { file: 'sfx/whoosh-soft.ogg', offsetFrames: 4, label: 'Mockup fährt/poppt rein' },

  // ── Kamera-/Beat-Übergänge (WhipIn/ZoomPunch/PushThrough) ─────────────────
  CameraWhip: { file: 'sfx/whoosh-digital.ogg', offsetFrames: 2, label: 'WhipIn-Übergang' },
  CameraZoomPunch: { file: 'sfx/impact-soft.ogg', offsetFrames: 6, label: 'ZoomPunch-Einschlag' },

  // ── Icon-Kicker (Zwischenüberschrift oben, PremiumIconLabel) ──────────────
  IconKickerIn: { file: 'sfx/click-ui.ogg', offsetFrames: 4, label: 'Icon-Kicker poppt auf' },

  // ── Loop/CTA (rotierendes Repeat-Icon am Reel-Ende) ───────────────────────
  LoopCtaChime: { file: 'sfx/chime-success.ogg', offsetFrames: 6, label: 'Loop-Icon erscheint, Übergang zu Follow-CTA' },
};
