// ════════════════════════════════════════════════════════════════════════════
//  PremiumAccents — neue Einzelbausteine (2026-07-21), aus Sichtung von
//  motion.dev/examples abgeleitet (KEIN Copy-Paste — die Originale sind
//  Web-Interaktions-Demos für Maus/Hover/Scroll, hier komplett neu als
//  passive, frame-getriebene Remotion-Bausteine gebaut). Vor dem Bauen gegen
//  KATALOG.md geprüft: keine Übereinstimmung mit bestehenden Bausteinen.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { useCurrentFrame, AbsoluteFill, random } from 'remotion';
import { C, a, E, prog } from '../tokens';
import { FONT } from '../fonts';
import { useTheme } from '../theme';
import { resolveLucide } from './Lucide';

// ── StockTicker — horizontal scrollende Kurs-Leiste (Symbol + Preis + Trend) ──
// Für finanzneo: "Marktüberblick"-Momente, Hintergrund-Atmosphäre für Finanz-Szenen.
// Eigener Typ-Name (nicht `TickerItem`) — `PremiumFinance.tsx` hat schon einen `Ticker`
// (vertikale Liste, gestaffelt reinrutschend). StockTicker ist mechanisch etwas anderes:
// durchgehend horizontal scrollender Streifen (News-Ticker/Börsen-Band-Optik), kein Duplikat.
export type TickerScrollItem = { symbol: string; value: string; up: boolean };
export const StockTicker: React.FC<{
  items: TickerScrollItem[]; width?: number; speed?: number; fontSize?: number;
}> = ({ items, width = 1080, speed = 1.6, fontSize = 30 }) => {
  const f = useCurrentFrame();
  // Breite je Item aus dem längsten Symbol geschätzt (grobe Zeichenbreite ~0.62×fontSize)
  // + Preis + Pfeil + Puffer — verhindert Überlappung bei längeren Namen wie "MSCI World".
  const longest = Math.max(...items.map((it) => it.symbol.length));
  const itemW = longest * fontSize * 0.62 + fontSize * 6.5;
  const totalW = items.length * itemW;
  const offset = (f * speed) % totalW;
  const rendered = [...items, ...items, ...items]; // 3x für nahtlosen Loop
  return (
    <div style={{ width, height: fontSize + 40, overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', position: 'absolute', left: -offset, top: 0, whiteSpace: 'nowrap' }}>
        {rendered.map((it, i) => (
          <div key={i} style={{ width: itemW, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: FONT.body, fontSize, fontWeight: 700 }}>
            <span style={{ color: C.white }}>{it.symbol}</span>
            <span style={{ color: it.up ? C.green : C.negative }}>{it.value}</span>
            <span style={{ color: it.up ? C.green : C.negative, fontSize: fontSize * 0.8 }}>{it.up ? '▲' : '▼'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── NotificationStack — gestapelte Benachrichtigungen, nacheinander reinrutschend ──
// Neuere oben+groß+scharf, ältere dahinter kleiner/blasser (iOS-Notification-Stack-Optik).
export type NotifItem = { title: string; sub: string; at: number };
export const NotificationStack: React.FC<{
  items: NotifItem[]; width?: number; accent?: string;
}> = ({ items, width = 700, accent }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const color = accent ?? th.accent;
  const cardH = 92;
  return (
    <div style={{ position: 'relative', width, height: cardH + 60, overflow: 'hidden' }}>
      {items.map((it, i) => {
        const p = prog(f, it.at, it.at + 14, E.spring);
        if (p <= 0) return null;
        // Position im Stapel: je mehr NACH diesem eins reinkam, desto weiter schiebt es sich zurück.
        // Nur die vorderste Karte (depth 0) zeigt Titel+Untertitel — dahinterliegende nur eine
        // schmale, TEXTLOSE Farb-Kante (echte "gestapelte Kanten"-Optik, kein Text-Überlapp-Risiko
        // mehr — erster Versuch mit verkleinertem Text hat trotzdem überlappt, siehe Render-Test).
        const laterCount = items.filter((o, j) => j > i && f >= o.at).length;
        const depth = Math.min(laterCount, 3);
        const scale = 1 - depth * 0.05;
        const fade = depth === 0 ? 1 : 0.5 - (depth - 1) * 0.12;
        if (depth > 0) {
          // Nur eine dezente Kante andeuten, kein Text — verhindert jede Überlappung. Sitzt
          // knapp UNTER der vorderen Karte (peekt am unteren Rand hervor), nicht dahinter versteckt.
          const yBack = cardH - 14 + (depth - 1) * 14;
          return (
            <div key={i} style={{
              position: 'absolute', left: 10, right: 10, top: yBack, height: 20,
              opacity: fade, transform: `scale(${scale})`, transformOrigin: '50% 0%',
              background: a('#12121A', 0.9), borderRadius: 16,
              border: `1px solid ${a(color, 0.2)}`, zIndex: 100 - depth,
            }} />
          );
        }
        return (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0, top: 0,
            opacity: Math.min(p * 1.3, 1),
            transform: `translateY(${(1 - p) * -50}px)`,
            background: a('#12121A', 0.9), borderRadius: 22, padding: '18px 26px',
            display: 'flex', alignItems: 'center', gap: 18,
            border: `1px solid ${a(color, 0.25)}`,
            boxShadow: `0 14px 40px ${a('#000000', 0.4)}`,
            zIndex: 100,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color, flexShrink: 0,
              boxShadow: `0 0 16px ${a(color, 0.5)}` }} />
            <div>
              <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.white }}>{it.title}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 21, color: a(C.white, 0.65) }}>{it.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── AIRipple — konzentrische Ringe pulsieren von der Mitte nach außen ────────
// Für ki: "KI denkt/verarbeitet"-Signal um ein Icon/Zentrum (vgl. Apple-Intelligence-Glow).
export const AIRipple: React.FC<{
  size?: number; color?: string; rings?: number; loopFrames?: number; children?: React.ReactNode;
}> = ({ size = 200, color, rings = 3, loopFrames = 60, children }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const ringColor = color ?? th.accent;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: rings }, (_, i) => {
        const local = (f + (i * loopFrames) / rings) % loopFrames;
        const p = local / loopFrames;
        const scale = 0.3 + p * 1.4;
        const opacity = (1 - p) * 0.55;
        return (
          <div key={i} style={{
            position: 'absolute', width: size, height: size, borderRadius: '50%',
            border: `2px solid ${ringColor}`, opacity, transform: `scale(${scale})`,
            boxShadow: `0 0 20px ${a(ringColor, opacity * 0.6)}`,
          }} />
        );
      })}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

// ── PulseDotsLoader — 3-5 Punkte pulsieren nacheinander ("verarbeitet gerade") ──
// Generischer Füll-Baustein — kein Finanz-/KI-Bezug nötig, überbrückt kurze Momente
// ohne eigene Aussage (z.B. "Moment, wird berechnet ..."), verhindert toten Frame.
export const PulseDotsLoader: React.FC<{
  dots?: number; size?: number; color?: string; gap?: number;
}> = ({ dots = 4, size = 22, color, gap = 16 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const dotColor = color ?? th.accent;
  return (
    <div style={{ display: 'flex', gap, alignItems: 'center', position: 'relative' }}>
      {Array.from({ length: dots }, (_, i) => {
        const t = (f - i * 6) * 0.15;
        const scale = 0.6 + Math.max(0, Math.sin(t)) * 0.6;
        const opacity = 0.4 + Math.max(0, Math.sin(t)) * 0.6;
        return (
          <div key={i} style={{ width: size, height: size, borderRadius: '50%', background: dotColor,
            opacity, transform: `scale(${scale})`, boxShadow: `0 0 ${size}px ${a(dotColor, opacity * 0.5)}` }} />
        );
      })}
    </div>
  );
};

// ── AccordionReveal — Kopfzeile klappt auf, Inhalt fährt aus ─────────────────
// Für "Schritt-für-Schritt"-Erklär-Beats (z.B. "Was steckt hinter X?" → Antwort aufklappen).
export const AccordionReveal: React.FC<{
  title: string; children: React.ReactNode; at: number; width?: number; openDur?: number;
}> = ({ title, children, at, width = 700, openDur = 20 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const p = prog(f, at, at + openDur, E.inOut);
  const rot = p * 180;
  return (
    <div style={{ width, background: a('#12121A', 0.9), borderRadius: 22, position: 'relative',
      border: `1px solid ${a(th.accent, 0.25)}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 28px', fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: C.white }}>
        {title}
        <span style={{ display: 'inline-block', transform: `rotate(${rot}deg)`, color: th.accent, fontSize: 24 }}>▾</span>
      </div>
      <div style={{ maxHeight: p * 220, overflow: 'hidden' }}>
        <div style={{ padding: '0 28px 24px', fontFamily: FONT.body, fontSize: 22, color: a(C.white, 0.75),
          opacity: prog(f, at + openDur * 0.5, at + openDur + 8) }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ── AutoCarousel — Karten wechseln automatisch, mit Slide-Übergang ───────────
// Für "3 Tipps"/"Vergleich mehrerer Optionen"-Beats — Autoplay statt Wisch-Geste.
export type CarouselCard = { title: string; sub: string };
export const AutoCarousel: React.FC<{
  cards: CarouselCard[]; width?: number; perCard?: number; accent?: string;
}> = ({ cards, width = 700, perCard = 40, accent }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const color = accent ?? th.accent;
  // Bug beim ersten Render-Test: die "nächste" Karte blieb nach dem Einschieben bei x=0
  // hängen und überlappte die aktuelle Karte für den Rest des Zyklus (Formel ließ beide bei
  // slideP=1 auf derselben Position enden). Jetzt sauber getrennt: für den GRÖSSTEN Teil des
  // Zyklus ist NUR eine Karte sichtbar; nur im letzten `transitionWindow` überlappen sich
  // beide kurz beim Vorbeigleiten (eine raus nach links, eine rein von rechts).
  const cycleFrame = f % perCard;
  const idx = Math.floor(f / perCard) % cards.length;
  const transitionWindow = Math.min(10, perCard - 1);
  const restFrames = perCard - transitionWindow;
  const tp = cycleFrame < restFrames ? 0 : prog(cycleFrame, restFrames, perCard, E.out);
  return (
    <div style={{ width, height: 200, position: 'relative', overflow: 'hidden' }}>
      {[0, 1].map((offset) => {
        const cardIdx = (idx + offset) % cards.length;
        const c = cards[cardIdx];
        const isCurrent = offset === 0;
        if (!isCurrent && tp <= 0) return null; // "nächste" Karte nur während des Übergangs rendern
        const x = isCurrent ? -tp * width : (1 - tp) * width;
        const opacity = isCurrent ? 1 : tp;
        return (
          <div key={offset} style={{
            position: 'absolute', inset: 0, transform: `translateX(${x}px)`, opacity,
            background: a('#12121A', 0.9), borderRadius: 24, border: `1px solid ${a(color, 0.3)}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px',
            boxShadow: `0 20px 60px ${a('#000000', 0.4)}`,
          }}>
            <div style={{ fontFamily: FONT.title, fontWeight: 800, fontSize: 36, color: color }}>{c.title}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 24, color: a(C.white, 0.75), marginTop: 10 }}>{c.sub}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
        {cards.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 4,
            background: i === idx ? color : a(C.white, 0.3), transition: 'none' }} />
        ))}
      </div>
    </div>
  );
};

// ── SwitchToggle — Schalter kippt von AUS auf AN ─────────────────────────────
// Für "so aktivierst du X"-Erklär-Momente (Feature-Toggle-Demo, autoplay statt Klick).
export const SwitchToggle: React.FC<{
  label: string; at: number; width?: number; accent?: string;
}> = ({ label, at, width = 500, accent }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const color = accent ?? th.accent;
  const p = prog(f, at, at + 14, E.spring);
  const trackW = 84, trackH = 46, thumbSize = 38;
  return (
    <div style={{ width, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: FONT.body, fontSize: 30, fontWeight: 700, color: C.white, position: 'relative' }}>
      {label}
      <div style={{ width: trackW, height: trackH, borderRadius: trackH / 2,
        background: a(color, 0.2 + p * 0.5), border: `2px solid ${a(color, 0.4 + p * 0.4)}`,
        position: 'relative', boxShadow: p > 0.5 ? `0 0 20px ${a(color, 0.4)}` : undefined }}>
        <div style={{ position: 'absolute', top: 2, left: 2 + p * (trackW - thumbSize - 4),
          width: thumbSize, height: thumbSize, borderRadius: '50%', background: C.white,
          boxShadow: `0 2px 8px ${a('#000000', 0.4)}` }} />
      </div>
    </div>
  );
};

// ── AnimatedBeam — fließende Linie zwischen zwei Punkten (vgl. magic-ui „animated-beam") ──
// Original nutzt DOM-Refs + ResizeObserver (Browser-only, non-deterministisch). Hier: feste
// x/y-Koordinaten + frame-getriebener Gradient-Puls entlang eines SVG-Pfads. Für "Idee fließt
// von A nach B", "Geld/Daten wandert", verbundene Knoten/Konzepte.
export const AnimatedBeam: React.FC<{
  x1: number; y1: number; x2: number; y2: number; curvature?: number;
  color?: string; colorTo?: string; loopFrames?: number; width?: number; reverse?: boolean;
}> = ({ x1, y1, x2, y2, curvature = 40, color, colorTo, loopFrames = 60, width = 3, reverse = false }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const from = color ?? th.accent;
  const to = colorTo ?? th.accentDk ?? th.accent;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - curvature;
  const t = (f % loopFrames) / loopFrames;
  const pos = reverse ? 1 - t : t;
  // Punkt auf der quadratischen Bézier-Kurve manuell berechnet (frame-deterministisch) —
  // NICHT `<animateMotion>`/SMIL nutzen, das läuft auf echter Wanduhrzeit, nicht auf Remotions
  // Frame-Uhr, und würde beim Rendern nicht reproduzierbar sein (Anfänger-Falle bei SVG-Web-Ports).
  const bx = (1 - pos) ** 2 * x1 + 2 * (1 - pos) * pos * mx + pos ** 2 * x2;
  const by = (1 - pos) ** 2 * y1 + 2 * (1 - pos) * pos * my + pos ** 2 * y2;
  return (
    <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none" stroke={a(from, 0.18)} strokeWidth={width} />
      <circle cx={bx} cy={by} r={width * 2.2} fill={to}
        style={{ filter: `drop-shadow(0 0 8px ${a(to, 0.8)})` }} />
    </svg>
  );
};

// ── AvatarCircles — gestapelte, überlappende Nutzer-Kreise (Social Proof) ────
// Für "10.000+ Nutzer/Kunden/Follower"-Momente. Themen-neutral (Initialen statt echter Fotos,
// da keine echten Nutzerdaten). Vgl. magic-ui „avatar-circles" — hier deterministisch gebaut.
export type AvatarItem = { label: string; color?: string };
export const AvatarCircles: React.FC<{
  avatars: AvatarItem[]; extraCount?: number; at: number; size?: number;
}> = ({ avatars, extraCount, at, size = 74 }) => {
  const f = useCurrentFrame();
  const overlap = size * 0.32;
  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      {avatars.map((av, i) => {
        const p = prog(f, at + i * 6, at + i * 6 + 14, E.spring);
        const col = av.color ?? [C.accent, C.gold, C.blue, C.purple][i % 4];
        return (
          <div key={i} style={{
            width: size, height: size, borderRadius: '50%', marginLeft: i === 0 ? 0 : -overlap,
            background: col, border: '3px solid #0B0F14', zIndex: avatars.length - i,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: p, transform: `scale(${0.6 + p * 0.4})`,
            boxShadow: `0 0 16px ${a(col, 0.4)}`,
            fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.36, color: '#0B0F14',
          }}>{av.label}</div>
        );
      })}
      {extraCount != null && (() => {
        // Bug beim ersten Render-Test: "+9600" lief über den Kreisrand hinaus (Schrift zu groß
        // für 5 Zeichen). Jetzt: große Zahlen abgekürzt ("9,6k") + Schriftgröße nach Zeichenlänge.
        const label = extraCount >= 1000 ? `${(extraCount / 1000).toFixed(1).replace('.0', '')}k` : `${extraCount}`;
        const text = `+${label}`;
        const fontSize = text.length > 4 ? size * 0.24 : size * 0.3;
        return (
          <div style={{
            width: size, height: size, borderRadius: '50%', marginLeft: -overlap,
            background: a(C.white, 0.12), border: '3px solid #0B0F14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: prog(f, at + avatars.length * 6 + 6, at + avatars.length * 6 + 20, E.spring),
            fontFamily: FONT.body, fontWeight: 800, fontSize, color: C.white,
          }}>{text}</div>
        );
      })()}
    </div>
  );
};

// ── WordRotate — ein Wort im Satz wechselt durch, Rest bleibt fest stehen ────
// Für "Das ist [schnell/einfach/günstig]." — Satzrahmen konstant, EIN Slot rotiert.
// Vgl. magic-ui „word-rotate" (dort React-State+setInterval) — hier rein frame-basiert.
export const WordRotate: React.FC<{
  prefix?: string; words: string[]; suffix?: string; at: number; perWord?: number;
  size?: number; color?: string;
}> = ({ prefix = '', words, suffix = '', at, perWord = 30, size = 60, color }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const wordColor = color ?? th.accent;
  const local = Math.max(0, f - at);
  const idx = Math.min(Math.floor(local / perWord), words.length - 1);
  const wf = local % perWord;
  const p = prog(wf, 0, 10, E.spring);
  const outP = prog(wf, perWord - 8, perWord, E.in);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, fontFamily: FONT.body,
      fontWeight: 800, fontSize: size, color: C.white, flexWrap: 'wrap', justifyContent: 'center',
      position: 'relative' }}>
      {prefix && <span>{prefix}</span>}
      <span style={{ position: 'relative', display: 'inline-block', color: wordColor,
        opacity: (1 - outP) * Math.min(p * 1.4, 1),
        transform: `translateY(${(1 - p) * 20 - outP * -14}px)`,
        textShadow: `0 0 20px ${a(wordColor, 0.5)}` }}>{words[idx]}</span>
      {suffix && <span>{suffix}</span>}
    </div>
  );
};

// ── GooBlobs — mehrere Blobs verschmelzen organisch ineinander (Metaball-Look) ─
// Klassischer SVG-„Goo"-Filter (Blur + Kontrast-Matrix), deterministisch bewegt. Für organische,
// weiche Hintergrund-Atmosphäre — Unterschied zu `LiquidBlob`: dort EINE wabbelnde Form, hier
// MEHRERE Kreise, die sich beim Näherkommen sichtbar zu einer Form verbinden.
export const GooBlobs: React.FC<{
  count?: number; width?: number; height?: number; color?: string; speed?: number;
}> = ({ count = 5, width = 1080, height = 1920, color, speed = 1 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const blobColor = color ?? th.accent;
  const filterId = 'goo-filter';
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <svg width={0} height={0}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, filter: `url(#${filterId})` }}>
        {Array.from({ length: count }, (_, i) => {
          const seedX = random(`goo-x${i}`), seedY = random(`goo-y${i}`), seedP = random(`goo-p${i}`) * 6.28;
          const t = f * 0.012 * speed;
          const cx = (0.2 + seedX * 0.6) * width + Math.sin(t + seedP) * width * 0.14;
          const cy = (0.2 + seedY * 0.6) * height + Math.cos(t * 0.8 + seedP) * height * 0.1;
          const r = 90 + random(`goo-r${i}`) * 70;
          return <div key={i} style={{ position: 'absolute', left: cx - r, top: cy - r,
            width: r * 2, height: r * 2, borderRadius: '50%', background: blobColor }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── ScrollingImageStrip — endlos scrollender Bilderstreifen ──────────────────
// Für "viele Beispiele/Referenzen/Vorher-Ergebnisse" als Hintergrund-Textur. Kontinuierlicher
// Loop, deterministisch (nicht scroll-getrieben wie das react-bits-Original).
export const ScrollingImageStrip: React.FC<{
  images: string[]; itemWidth?: number; height?: number; speed?: number; reverse?: boolean;
}> = ({ images, itemWidth = 320, height = 420, speed = 1, reverse = false }) => {
  const f = useCurrentFrame();
  const totalW = images.length * (itemWidth + 24);
  const offset = ((f * speed * 2) % totalW + totalW) % totalW;
  const rendered = [...images, ...images, ...images];
  return (
    <div style={{ width: '100%', height, overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 24, position: 'absolute', top: 0,
        left: reverse ? offset - totalW : -offset }}>
        {rendered.map((src, i) => (
          <img key={i} src={src} style={{ width: itemWidth, height, objectFit: 'cover',
            borderRadius: 24, flexShrink: 0 }} />
        ))}
      </div>
    </div>
  );
};

// ── IconOrbit — rotierende Kugel aus Icons ────────────────────────────────────
// Für "viele Tools/Kategorien/Bereiche" (Tech-Stack, Themenvielfalt). Deterministisch
// per Fibonacci-Sphäre + Frame-Rotation (aus magic-ui IconCloud abgeleitet, komplett
// neu ohne Canvas/Maus-Drag — reine 3D-Projektion via CSS transform, frame-getrieben).
export const IconOrbit: React.FC<{
  icons: string[]; radius?: number; iconSize?: number; speed?: number; color?: string;
}> = ({ icons, radius = 260, iconSize = 56, speed = 1, color }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const tint = color ?? th.accent;
  const angle = f * 0.012 * speed;
  const n = icons.length;
  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2,
      perspective: 1000, margin: '0 auto' }}>
      {icons.map((name, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + angle;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const scale = (z + radius * 1.4) / (radius * 2.4);
        const Cmp = resolveLucide(name);
        if (!Cmp) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: radius + x - iconSize / 2,
            top: radius + y - iconSize / 2, opacity: 0.35 + scale * 0.65,
            transform: `scale(${0.5 + scale * 0.6})`, zIndex: Math.round(z) }}>
            <Cmp size={iconSize} color={tint} strokeWidth={2} />
          </div>
        );
      })}
    </div>
  );
};

// ── CodeCompare — Vorher/Nachher-Code nebeneinander ──────────────────────────
// Für "so kompliziert war es, so einfach ist es jetzt"-Momente. Statt schwerer
// Shiki-Syntax-Highlighting-Pipeline (magic-ui CodeComparison, async/Browser-only,
// nicht deterministisch): einfache Monospace-Blöcke mit +/− Zeilen-Markern,
// zeilenweise gestaffelt eingeblendet.
export type CodeCompareLine = { text: string; kind?: 'add' | 'remove' | 'neutral' };
export const CodeCompare: React.FC<{
  before: CodeCompareLine[]; after: CodeCompareLine[]; beforeLabel?: string; afterLabel?: string;
  at: number; width?: number; fontSize?: number;
}> = ({ before, after, beforeLabel = 'vorher', afterLabel = 'nachher', at, width = 900, fontSize = 26 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const lineColor = (kind?: string) =>
    kind === 'add' ? '#3ECF7A' : kind === 'remove' ? '#FF5C5C' : 'rgba(255,255,255,0.85)';
  const lineBg = (kind?: string) =>
    kind === 'add' ? a('#3ECF7A', 0.14) : kind === 'remove' ? a('#FF5C5C', 0.14) : 'transparent';
  const Col: React.FC<{ label: string; lines: CodeCompareLine[]; colorAccent: string }> = ({ label, lines, colorAccent }) => (
    <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${a(colorAccent, 0.3)}` }}>
      <div style={{ padding: '10px 18px', background: a(colorAccent, 0.16), color: colorAccent,
        fontFamily: FONT.body, fontSize: fontSize * 0.6, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 1 }}>{label}</div>
      <div style={{ padding: '14px 0' }}>
        {lines.map((ln, i) => {
          const lp = prog(f, at + i * 4, at + i * 4 + 8, E.out);
          return (
            <div key={i} style={{ padding: '4px 18px', background: lineBg(ln.kind),
              color: lineColor(ln.kind), fontFamily: 'Menlo, Consolas, monospace', fontSize,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', opacity: lp,
              transform: `translateX(${(1 - lp) * 16}px)` }}>
              {ln.kind === 'add' ? '+ ' : ln.kind === 'remove' ? '− ' : '  '}{ln.text}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={{ position: 'relative', display: 'flex', gap: 20, width }}>
      <Col label={beforeLabel} lines={before} colorAccent="#FF5C5C" />
      <Col label={afterLabel} lines={after} colorAccent="#3ECF7A" />
    </div>
  );
};

// ── FileTreeReveal — Ordner-/Dateistruktur baut sich zeilenweise auf ─────────
// Für "so ist das aufgebaut/strukturiert" (Ordner, Kategorien, Hierarchie). Aus magic-ui
// FileTree abgeleitet, komplett neu ohne Radix-Accordion/Interaktion — reine
// frame-getriebene Zeilen-Reveal-Liste mit Einrückung nach Tiefe.
export type FileTreeNode = { label: string; depth: number; kind?: 'folder' | 'file' };
export const FileTreeReveal: React.FC<{
  nodes: FileTreeNode[]; at: number; width?: number; fontSize?: number; perLine?: number;
}> = ({ nodes, at, width = 640, fontSize = 30, perLine = 6 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const FolderIcon = resolveLucide('folder');
  const FileIcon = resolveLucide('file');
  return (
    <div style={{ position: 'relative', width, background: 'rgba(0,0,0,0.45)', borderRadius: 20,
      padding: '20px 24px', border: `1px solid ${a(th.accent, 0.25)}` }}>
      {nodes.map((node, i) => {
        const lp = prog(f, at + i * perLine, at + i * perLine + 10, E.out);
        const Icon = node.kind === 'file' ? FileIcon : FolderIcon;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
            paddingLeft: node.depth * 34, padding: '6px 0 6px ' + node.depth * 34,
            opacity: lp, transform: `translateX(${(1 - lp) * -14}px)` }}>
            {Icon && <Icon size={fontSize * 0.7} color={node.kind === 'file' ? 'rgba(255,255,255,0.55)' : th.accent}
              strokeWidth={2} />}
            <span style={{ fontFamily: FONT.body, fontSize, color: node.kind === 'file' ? 'rgba(255,255,255,0.85)' : '#fff',
              fontWeight: node.kind === 'file' ? 400 : 700 }}>{node.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── TagMarquee — endlos scrollender Streifen aus Text-Chips/Tags ────────────
// Für "viele Begriffe/Stichworte/Kategorien" als Reihe (anders als ScrollingImageStrip:
// Text-Chips statt Bilder). Aus magic-ui Marquee abgeleitet, deterministisch statt CSS-Animation.
export const TagMarquee: React.FC<{
  tags: string[]; speed?: number; reverse?: boolean; size?: number; color?: string;
}> = ({ tags, speed = 1, reverse = false, size = 32, color }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const tint = color ?? th.accent;
  const gap = 28;
  const widths = tags.map((t) => t.length * size * 0.62 + 48);
  const totalW = widths.reduce((s, w) => s + w + gap, 0);
  const offset = ((f * speed * 3) % totalW + totalW) % totalW;
  const rendered = [...tags, ...tags, ...tags];
  return (
    <div style={{ width: '100%', overflow: 'hidden', position: 'relative', height: size * 2 }}>
      <div style={{ display: 'flex', gap, position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        left: reverse ? offset - totalW : -offset }}>
        {rendered.map((t, i) => (
          <div key={i} style={{ padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: size,
            border: `1px solid ${a(tint, 0.4)}`, background: a(tint, 0.1), whiteSpace: 'nowrap',
            fontFamily: FONT.body, fontSize: size * 0.62, fontWeight: 700, color: tint }}>{t}</div>
        ))}
      </div>
    </div>
  );
};

// ── TextHighlightSweep — Textmarker-Strich zieht unter dem Text durch ───────
// Für "genau DAS betonen" ohne dass der Text selbst poppt (anders als `Emphasis`, das
// skaliert/wackelt). Aus magic-ui Highlighter abgeleitet, deterministisch per Frame.
export const TextHighlightSweep: React.FC<{
  children: React.ReactNode; at: number; color?: string; fontSize?: number; durFrames?: number;
}> = ({ children, at, color, fontSize = 56, durFrames = 14 }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const tint = color ?? th.accent;
  const p = prog(f, at, at + durFrames, E.out);
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontFamily: FONT.body,
      fontSize, fontWeight: 700, color: '#fff' }}>
      <span style={{ position: 'absolute', left: -6, right: `${(1 - p) * 100}%`, bottom: 2,
        top: '18%', background: a(tint, 0.55), borderRadius: 4, zIndex: 0 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
};

// ── HyperText — Buchstaben scrambeln zufällig, lösen sich zum Zielwort auf ──
// Für "die Antwort/Zahl enthüllen" (Rätsel-Moment, Reveal). Aus magic-ui HyperText abgeleitet,
// deterministisch per Frame statt Interval/Timeout.
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const HyperText: React.FC<{
  text: string; at: number; durFrames?: number; fontSize?: number; color?: string;
}> = ({ text, at, durFrames = 24, fontSize = 64, color }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const tint = color ?? th.accent;
  return (
    <div style={{ fontFamily: FONT.title, fontSize, color: tint, display: 'flex' }}>
      {text.split('').map((ch, i) => {
        if (ch === ' ') return <span key={i} style={{ width: fontSize * 0.3 }} />;
        const settleAt = at + (i / text.length) * durFrames * 0.6 + durFrames * 0.4;
        const settled = f >= settleAt;
        const shown = settled ? ch : SCRAMBLE_CHARS[Math.floor(random(`hyper-${i}-${Math.floor(f / 2)}`) * SCRAMBLE_CHARS.length)];
        const visible = f >= at;
        return <span key={i} style={{ opacity: visible ? 1 : 0, minWidth: fontSize * 0.6, textAlign: 'center' }}>{shown}</span>;
      })}
    </div>
  );
};

// ── DockRow — horizontale App-/Tool-Icon-Leiste ──────────────────────────────
// Für "diese Tools/Apps nutzt du dafür" (Lineup, kein Kreis/Orbit wie IconOrbit).
// Aus magic-ui Dock abgeleitet, komplett neu ohne Maus-Hover-Vergrößerung — Icons erscheinen
// zeitversetzt und pulsieren einmal beim Erscheinen.
export const DockRow: React.FC<{
  icons: string[]; at: number; size?: number; gap?: number; color?: string;
}> = ({ icons, at, size = 88, gap = 24, color }) => {
  const f = useCurrentFrame();
  const th = useTheme();
  const tint = color ?? th.accent;
  return (
    <div style={{ display: 'flex', gap, alignItems: 'flex-end' }}>
      {icons.map((name, i) => {
        const st = at + i * 5;
        const p = prog(f, st, st + 14, E.spring);
        const Cmp = resolveLucide(name);
        if (!Cmp) return null;
        return (
          <div key={i} style={{ width: size, height: size, borderRadius: size * 0.28,
            background: a(tint, 0.14), border: `1px solid ${a(tint, 0.35)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: p, transform: `scale(${p}) translateY(${(1 - p) * 20}px)` }}>
            <Cmp size={size * 0.5} color={tint} strokeWidth={2} />
          </div>
        );
      })}
    </div>
  );
};
