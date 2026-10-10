import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, type IconRef} from './Icon';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme} from './themes';

// ── Code-Fenster ─────────────────────────────────────────────────────────

const KEYWORDS = /\b(def|return|import|from|const|let|var|function|if|else|for|while|in|print|await|async|class|new|true|false|True|False|None|null|export)\b/g;

/** Sehr einfache Einfärbung: Strings, Kommentare, Schlüsselwörter, Zahlen. */
const highlight = (line: string, c: {str: string; com: string; key: string; num: string; text: string}) => {
  const out: React.ReactNode[] = [];
  const re = /("[^"]*"?|'[^']*'?|`[^`]*`?)|(#.*$|\/\/.*$)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    const [tok, str, com, num, word] = m;
    const color = str ? c.str : com ? c.com : num ? c.num : word && word.match(KEYWORDS) ? c.key : c.text;
    out.push(
      <span key={i++} style={{color}}>
        {tok}
      </span>,
    );
  }
  return out;
};

export type CodeZeile = string | {text: string; diff?: 'add' | 'remove'};

type CodeWindowProps = {
  lines: CodeZeile[];
  title?: string;
  /** Ausgabe nach dem Tippen, z. B. Programmergebnis oder KI-Antwort. */
  output?: string;
  delay?: number;
  /** Tippgeschwindigkeit in Zeichen pro Sekunde (0 = sofort komplett). */
  cps?: number;
  width?: number;
  fontSize?: number;
  /** Zeilennummern anzeigen. */
  numbers?: boolean;
};

/** Code tippt sich, optional mit +/− Diff-Zeilen und Ausgabe darunter. */
export const CodeWindow: React.FC<CodeWindowProps> = ({lines, title = 'code', output, delay = 0, cps = 40, width = 900, fontSize = 32, numbers = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const rows = lines.map((l) => (typeof l === 'string' ? {text: l} : l));
  const total = rows.reduce((n, r) => n + r.text.length + 1, 0);
  // Gleichmäßiger Tipptakt: lineare Zeitachse ist hier richtig.
  const typed = cps <= 0 ? total : Math.floor(interpolate(frame, [delay + 8, delay + 8 + (total / cps) * fps], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const doneAt = delay + 8 + (cps <= 0 ? 0 : (total / cps) * fps);
  const outIn = progress(frame, doneAt + 6, 14, 'out');
  const s = pop(frame, fps, delay, 'smooth');
  const colors = {str: '#9BE28F', com: '#7C7690', key: '#C9A6FF', num: '#FFB86B', text: '#ECE8F5'};
  let left = typed;
  return (
    <div
      style={{
        width,
        borderRadius: 28 * t.radius,
        background: t.c.dark,
        border: t.border ?? undefined,
        boxShadow: t.shadow.lift,
        overflow: 'hidden',
        opacity: clamp01(s * 1.5),
        transform: `translateY(${(1 - s) * 60}px) scale(${mix(0.96, 1, s)})`,
      }}
    >
      <div style={{height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', background: t.c.darkSoft}}>
        {['#FF6159', '#FFBD2E', '#28C941'].map((c) => (
          <div key={c} style={{width: 15, height: 15, borderRadius: '50%', background: c}} />
        ))}
        <span style={{marginLeft: 14, fontFamily: t.font.mono, fontSize: 22, color: '#8D86A0'}}>{title}</span>
      </div>
      <div style={{padding: '22px 0', fontFamily: t.font.mono, fontSize, lineHeight: 1.6}}>
        {rows.map((r, i) => {
          const shown = Math.max(0, Math.min(r.text.length, left));
          const isCurrent = left >= 0 && left <= r.text.length;
          left -= r.text.length + 1;
          const bg = r.diff === 'add' ? 'rgba(61,220,151,0.14)' : r.diff === 'remove' ? 'rgba(255,92,122,0.14)' : undefined;
          const mark = r.diff === 'add' ? '+' : r.diff === 'remove' ? '−' : ' ';
          const markColor = r.diff === 'add' ? '#3DDC97' : '#FF5C7A';
          return (
            <div key={i} style={{display: 'flex', background: shown > 0 || r.text.length === 0 ? bg : undefined, padding: '0 28px', whiteSpace: 'pre', minHeight: fontSize * 1.6}}>
              {numbers ? <span style={{width: fontSize * 1.6, color: '#5A5468', flexShrink: 0}}>{i + 1}</span> : null}
              {r.diff ? <span style={{width: fontSize * 0.9, color: markColor, flexShrink: 0}}>{mark}</span> : null}
              <span style={{textDecoration: r.diff === 'remove' ? 'line-through' : undefined, opacity: r.diff === 'remove' ? 0.7 : 1}}>
                {highlight(r.text.slice(0, shown), colors)}
              </span>
              {isCurrent && frame < doneAt ? <span style={{color: t.c.accent}}>▍</span> : null}
            </div>
          );
        })}
      </div>
      {output ? (
        <div
          style={{
            borderTop: '2px solid #2B2638',
            padding: '18px 28px 22px',
            fontFamily: t.font.mono,
            fontSize: fontSize * 0.92,
            color: '#5FD3A0',
            opacity: outIn,
            transform: `translateY(${(1 - outIn) * 10}px)`,
            whiteSpace: 'pre-wrap',
          }}
        >
          ✓ {output}
        </div>
      ) : null}
    </div>
  );
};

// ── Dateibaum ────────────────────────────────────────────────────────────

export type BaumKnoten = {name: string; tiefe: number; ordner?: boolean};

type FileTreeProps = {
  nodes: BaumKnoten[];
  delay?: number;
  step?: number;
  size?: number;
  /** Index einer Datei, die ab `at` hervorgehoben wird. */
  highlight?: {index: number; at: number};
  width?: number;
};

/** Ordner-/Dateistruktur, Zeile für Zeile aufgebaut (z. B. GitHub-Repo). */
export const FileTree: React.FC<FileTreeProps> = ({nodes, delay = 0, step = 6, size = 40, highlight, width = 760}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const hl = highlight ? progress(frame, highlight.at, 12, 'out') : 0;
  return (
    <div style={{width, padding: size * 0.7, borderRadius: 30 * t.radius, background: t.c.surface, border: t.border ?? `2px solid ${t.c.line}`, boxShadow: t.shadow.soft}}>
      {nodes.map((n, i) => {
        const p = progress(frame, delay + i * step, 12, 'out');
        const active = highlight?.index === i;
        return (
          <div
            key={`${n.name}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: size * 0.4,
              paddingLeft: n.tiefe * size * 1.1,
              height: size * 1.7,
              borderRadius: 14 * t.radius,
              boxShadow: active && hl > 0 ? `inset 0 0 0 ${3 * hl}px ${t.c.accentDeep}` : undefined,
              opacity: p,
              transform: `translateX(${(1 - p) * -24}px)`,
            }}
          >
            <Icon icon={n.ordner ? 'ph:folder-simple-duotone' : 'ph:file-text-duotone'} size={size * 1.05} color={n.ordner ? t.c.accentDeep : t.c.inkSoft} animate="none" />
            <span style={{fontFamily: t.font.mono, fontSize: size * 0.8, fontWeight: n.ordner ? 700 : 500, color: active && hl > 0 ? t.c.accentDeep : t.c.ink}}>{n.name}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Benachrichtigungen ───────────────────────────────────────────────────

export type Meldung = {titel: string; text: string; icon?: IconRef; at: number; zeit?: string};

type NotificationsProps = {items: Meldung[]; width?: number; size?: number};

/** Benachrichtigungen stapeln sich wie auf dem Handy – neueste oben. */
export const Notifications: React.FC<NotificationsProps> = ({items, width = 860, size = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const visible = items.filter((it) => frame >= it.at - 2).sort((a, b) => b.at - a.at);
  const cardH = size * 3.1;
  return (
    <div style={{position: 'relative', width, height: cardH + (items.length - 1) * (cardH + 18)}}>
      {visible.map((it, idx) => {
        const s = pop(frame, fps, it.at, 'snappy');
        // Ältere Karten rutschen weich nach unten, wenn eine neue kommt.
        const newer = visible.slice(0, idx);
        const shift = newer.reduce((acc, n) => acc + progress(frame, n.at, 14, 'out'), 0);
        return (
          <div
            key={`${it.titel}-${it.at}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: shift * (cardH + 18),
              height: cardH,
              display: 'flex',
              alignItems: 'center',
              gap: size * 0.6,
              padding: `0 ${size * 0.7}px`,
              borderRadius: 30 * t.radius,
              background: t.c.surface,
              border: t.border ?? undefined,
              boxShadow: t.shadow.lift,
              opacity: clamp01(s * 2) * (1 - Math.min(0.45, shift * 0.15)),
              transform: `translateY(${(1 - s) * -50}px) scale(${mix(0.9, 1, s) - shift * 0.03})`,
            }}
          >
            <div style={{width: size * 1.9, height: size * 1.9, borderRadius: size * 0.5 * t.radius, background: t.c.accentDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icon icon={it.icon ?? 'ph:bell-ringing-fill'} size={size * 1.15} color={t.c.onAccent} animate="none" />
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: t.font.body, fontSize: size * 0.85, fontWeight: 800, color: t.c.ink}}>
                <span>{it.titel}</span>
                <span style={{fontWeight: 600, color: t.c.inkFaint, fontSize: size * 0.7}}>{it.zeit ?? 'jetzt'}</span>
              </div>
              <div style={{fontFamily: t.font.body, fontSize: size * 0.78, fontWeight: 600, color: t.c.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{it.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
