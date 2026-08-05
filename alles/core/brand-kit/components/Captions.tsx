import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Caption } from '@remotion/captions';
import { C, E, prog, a } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  UNTERTITEL — TikTok/Shorts-Style, wortgenau, theme-fähig.
//  Daten: Caption[] aus @remotion/captions ({ text, startMs, endMs }) —
//  direkt das, was scripts/transcribe.mjs liefert. Zeigt N Wörter, hebt das
//  aktuell gesprochene im Kanal-Akzent hervor.
// ════════════════════════════════════════════════════════════════════════════

export type { Caption };

// Satzende-Zeichen — nach so einem Wort MUSS eine neue Gruppe beginnen, unabhängig von `size`.
// Verhindert, dass zwei inhaltlich getrennte Sätze/Beats (z.B. "...aufnimmst." + "Genau...")
// in derselben Untertitel-Zeile zusammenkleben.
const SENTENCE_END = /[.!?—]\s*$/;

const chunk = (items: Caption[], size: number, hardBreaksMs: number[] = []): Caption[][] => {
  const out: Caption[][] = [];
  let cur: Caption[] = [];
  for (const item of items) {
    // Beat-/Szenengrenze überschritten → neue Gruppe erzwingen, auch wenn `size` noch nicht erreicht ist.
    const crossesBreak = cur.length > 0 && hardBreaksMs.some((b) => cur[cur.length - 1].startMs < b && item.startMs >= b);
    // Vorheriges Wort war ein Satzende → auch ohne explizite Szenengrenze neue Gruppe erzwingen.
    const afterSentenceEnd = cur.length > 0 && SENTENCE_END.test(cur[cur.length - 1].text);
    if (cur.length >= size || crossesBreak || afterSentenceEnd) { out.push(cur); cur = []; }
    cur.push(item);
  }
  if (cur.length) out.push(cur);
  return out;
};

// Whisper liefert Sub-Word-Tokens (BPE-Fragmente, z.B. "D" + "rei" statt "Drei").
// Ein Token startet nur dann ein neues Wort, wenn es mit einem Leerzeichen beginnt —
// alle anderen (inkl. Satzzeichen wie ",") werden ohne Leerzeichen an das vorherige angehängt.
const mergeWordTokens = (tokens: Caption[]): Caption[] => {
  const words: Caption[] = [];
  for (const t of tokens) {
    const startsNewWord = words.length === 0 || /^\s/.test(t.text);
    if (startsNewWord) {
      words.push({ ...t });
    } else {
      const last = words[words.length - 1];
      last.text += t.text;
      last.endMs = t.endMs;
    }
  }
  return words;
};

export const Captions: React.FC<{
  captions: Caption[];
  perGroup?: number;          // Wörter pro Einblendung (3–4)
  bottom?: number;
  size?: number;
  highlight?: string;         // Farbe des aktiven Worts (Default = Kanal-Akzent)
  color?: string;
  hardBreaksMs?: number[];    // Szenen-/Beat-Grenzen (ms) — Gruppe wird hier nie überschritten
  instant?: boolean;          // true: ganze Gruppe erscheint sofort, nur die Hervorhebung wandert live mit
}> = ({ captions, perGroup = 3, bottom = 360, size = 72, highlight = 'var(--accent)', color = C.white,
  hardBreaksMs, instant = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (f / fps) * 1000;
  const groups = chunk(mergeWordTokens(captions), perGroup, hardBreaksMs);

  const g = groups.find((grp) => tMs >= grp[0].startMs && tMs <= grp[grp.length - 1].endMs + 150);
  if (!g) return null;
  const groupStartF = (g[0].startMs / 1000) * fps;

  return (
    <div style={{ position: 'absolute', bottom, left: 60, right: 60, textAlign: 'center',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 10px',
      fontFamily: FONT.body, fontWeight: 700, fontSize: size, lineHeight: 1.2 }}>
      {g.map((w, i) => {
        const wordStartF = instant ? groupStartF : (w.startMs / 1000) * fps;
        // Jedes Wort poppt einzeln ein, genau wenn es gesprochen wird — dezenter Bounce, kein Fett-Overkill.
        // Bei instant=true poppt die ganze Gruppe gemeinsam beim Gruppen-Start ein, nur die
        // Hervorhebung (active) wandert danach noch live mit dem gesprochenen Wort mit.
        const pop = prog(f, wordStartF, wordStartF + 6, E.spring);
        const scale = 0.85 + pop * 0.15; // 0.85 → 1.0, spürbar aber nicht clownig
        const opacity = Math.min(1, prog(f, wordStartF, wordStartF + 4, E.out));
        const active = tMs >= w.startMs && tMs <= w.endMs + 50;
        return (
          <span key={i} style={{
            display: 'inline-block', opacity, transform: `scale(${scale})`,
            color: active ? highlight : color,
            textShadow: active
              ? `0 0 18px ${a(highlight, 0.5)}, 0 2px 6px rgba(0,0,0,0.85)`
              : '0 2px 6px rgba(0,0,0,0.85)',
          }}>{w.text.trim()}</span>
        );
      })}
    </div>
  );
};

// Box-Variante (Pille hinter den Wörtern)
export const CaptionsBoxed: React.FC<React.ComponentProps<typeof Captions>> = (props) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (f / fps) * 1000;
  const has = props.captions.some((c) => tMs >= c.startMs && tMs <= c.endMs + 150);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {has && (
        <div style={{ position: 'absolute', bottom: (props.bottom ?? 360) - 24, left: 0, right: 0,
          display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '70%', height: 120, borderRadius: 24,
            background: a('#000000', 0.45) }} />
        </div>
      )}
      <Captions {...props} />
    </div>
  );
};
