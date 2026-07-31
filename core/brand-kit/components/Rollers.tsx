// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · ROLLERS — Slot-Machine / Flap / Drum Zahlen- & Wort-Roller
//  Mechanik inspiriert von remotion-scenes (MIT, lifeprompt-team), komplett
//  auf Brand umgebaut: einbettbar (kein eigener BG), Bebas/Inter, Tokens.
//  Einsatz: große Geld-Zahlen dramatisch enthüllen, Wortwechsel, Countdowns.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, Easing, interpolate } from 'remotion';
import { C, CLAMP } from '../tokens';
import { FONT } from '../fonts';

// ─── 1) SlotRoller — rollt vertikal durch Begriffe, stoppt auf dem letzten ────
//     <SlotRoller items={['Sparen','Hoffen','Warten','INVESTIEREN']} />
export const SlotRoller: React.FC<{
  items: string[];
  fontSize?: number;
  color?: string;          // Farbe des finalen Begriffs
  rollColor?: string;      // Farbe während des Rollens
  cycleFrames?: number;    // Frames pro Begriff
  startAt?: number;
  fontFamily?: string;
  fontWeight?: number;
}> = ({ items, fontSize = 96, color = 'var(--accent)', rollColor = C.gray,
        cycleFrames = 16, startAt = 0, fontFamily = FONT.title, fontWeight = 400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = Math.round(fontSize * 1.15);
  const last = items.length - 1;

  const t = Math.max(0, frame - startAt);
  const idx = Math.min(Math.floor(t / cycleFrames), last);
  const done = idx >= last;
  const cycleT = done ? cycleFrames : t % cycleFrames;
  const p = spring({ frame: cycleT, fps, config: { damping: 15, stiffness: 300 } });
  const offsetY = done ? 0 : (1 - p) * h;

  // kleiner „Snap"-Pop wenn der letzte Begriff einrastet
  const popP = done
    ? spring({ frame: t - last * cycleFrames, fps, config: { damping: 9, stiffness: 180 } })
    : 0;
  const pop = done ? 1 + 0.06 * (1 - Math.abs(1 - 2 * Math.min(popP, 1))) : 1;

  const style = (c: string): React.CSSProperties => ({
    fontFamily, fontWeight, fontSize, color: c, height: h, lineHeight: `${h}px`,
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ height: h, overflow: 'hidden', position: 'relative',
                  display: 'inline-block', transform: `scale(${pop})` }}>
      <div style={{ ...style(done ? color : rollColor), transform: `translateY(${offsetY}px)` }}>
        {items[idx]}
      </div>
      {!done && (
        <div style={{ ...style(idx + 1 === last ? color : rollColor), position: 'absolute',
                      top: 0, left: 0, transform: `translateY(${offsetY - h}px)` }}>
          {items[Math.min(idx + 1, last)]}
        </div>
      )}
    </div>
  );
};

// ─── 2) DigitSlots — Slot-Machine pro Ziffer, rastet gestaffelt ein ───────────
//     DAS Geld-Zahl-Reveal: <DigitSlots value="121.997 €" />
//     Jede Ziffer rollt 0-9 durch und stoppt nacheinander (links → rechts).
export const DigitSlots: React.FC<{
  value: string;            // z.B. "121.997 €" — nur Ziffern rollen
  fontSize?: number;
  color?: string;
  startAt?: number;
  spinFrames?: number;      // Roll-Dauer der ERSTEN Ziffer
  stagger?: number;         // zusätzl. Frames pro weiterer Ziffer
  fontFamily?: string;
}> = ({ value, fontSize = 140, color = C.gold, startAt = 0,
        spinFrames = 22, stagger = 7, fontFamily = FONT.title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = Math.round(fontSize * 1.1);
  const t = Math.max(0, frame - startAt);
  const chars = value.split('');
  let digitIdx = -1;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      {chars.map((ch, i) => {
        const isDigit = /\d/.test(ch);
        if (isDigit) digitIdx += 1;
        const base: React.CSSProperties = {
          fontFamily, fontSize, color, height: h, lineHeight: `${h}px`,
        };
        if (!isDigit) {
          if (ch === ' ') return <span key={i} style={{ width: Math.round(fontSize * 0.22) }} />;
          return <span key={i} style={base}>{ch}</span>;
        }

        const settle = spinFrames + digitIdx * stagger;       // wann diese Ziffer stoppt
        const target = parseInt(ch, 10);
        if (t >= settle) {
          // eingerastet — mit Mini-Bounce
          const bp = spring({ frame: t - settle, fps, config: { damping: 10, stiffness: 240 } });
          const dy = (1 - bp) * h * 0.18;
          return (
            <span key={i} style={{ ...base, display: 'inline-block', overflow: 'hidden' }}>
              <span style={{ display: 'inline-block', transform: `translateY(${dy}px)` }}>{ch}</span>
            </span>
          );
        }
        // noch am Rollen: Ziffern rotieren deterministisch durch
        const speed = 0.55 + (digitIdx % 3) * 0.13;
        const rolling = Math.floor((t * speed + digitIdx * 3 + target)) % 10;
        const subP = (t * speed + digitIdx * 3) % 1;
        return (
          <span key={i} style={{ ...base, display: 'inline-block', overflow: 'hidden', opacity: 0.55 }}>
            <span style={{ display: 'inline-block', transform: `translateY(${-subP * h * 0.4}px)`,
                           filter: 'blur(1.5px)' }}>
              {rolling}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ─── 3) SplitFlap — Flughafen-Anzeigetafel (Kacheln klappen um) ───────────────
//     <SplitFlap text="121.000 €" /> — jede Kachel klappt gestaffelt ein.
export const SplitFlap: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  tileBg?: string;
  startAt?: number;
  staggerFrames?: number;   // Versatz pro Kachel
  flapFrames?: number;      // Dauer einer Klappe
}> = ({ text, fontSize = 72, color = C.white, tileBg = '#11241A',
        startAt = 0, staggerFrames = 3, flapFrames = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - startAt);
  const w = Math.round(fontSize * 0.78);
  const h = Math.round(fontSize * 1.18);

  return (
    <div style={{ display: 'inline-flex', gap: Math.round(fontSize * 0.1) }}>
      {text.split('').map((ch, i) => {
        const local = Math.max(0, t - i * staggerFrames);
        const p = spring({ frame: Math.min(local, flapFrames), fps,
                           config: { damping: 16, stiffness: 320 } });
        const showing = local > 0;
        // Vor dem Einrasten: zufällig wirkende Zeichen (deterministisch)
        const POOL = '0123456789ABCDEFGHKMNPRSTUWXZ€.,%';
        const pre = POOL[(i * 7 + Math.floor(local * 1.4)) % POOL.length];
        const settled = local >= flapFrames;
        const shown = settled ? ch : (showing ? pre : '');
        if (ch === ' ') return <span key={i} style={{ width: Math.round(w * 0.45) }} />;
        return (
          <span key={i} style={{
            width: w, height: h, background: tileBg, borderRadius: Math.round(fontSize * 0.09),
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.title, fontSize, color: settled ? color : C.gray,
            position: 'relative', overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 6px rgba(0,0,0,0.35)',
          }}>
            {/* Mittel-Fuge der Klappe */}
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2,
                           background: 'rgba(0,0,0,0.55)', transform: 'translateY(-50%)', zIndex: 1 }} />
            <span style={{ transform: `rotateX(${(1 - p) * 88}deg)`, display: 'inline-block' }}>
              {shown}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ─── 4) DrumRoller — 3D-Trommel, dreht durch Begriffe ─────────────────────────
//     <DrumRoller items={['10 Jahre','20 Jahre','30 Jahre','40 JAHRE']} />
export const DrumRoller: React.FC<{
  items: string[];
  fontSize?: number;
  color?: string;
  finalColor?: string;
  cycleFrames?: number;
  startAt?: number;
}> = ({ items, fontSize = 84, color = C.gray, finalColor = 'var(--accent)',
        cycleFrames = 22, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - startAt);
  const last = items.length - 1;
  const idx = Math.min(Math.floor(t / cycleFrames), last);
  const cycleT = idx >= last ? cycleFrames : t % cycleFrames;
  const p = spring({ frame: cycleT, fps, config: { damping: 15, stiffness: 150 } });

  const anglePer = 90;
  const rotation = idx >= last ? last * anglePer : idx * anglePer + p * anglePer;
  const h = Math.round(fontSize * 1.2);
  const z = Math.round(fontSize * 1.45);

  return (
    <div style={{ perspective: 600, height: h, display: 'inline-block',
                  width: 'auto', minWidth: fontSize * 4 }}>
      <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(-${rotation}deg)`,
                    height: '100%', position: 'relative' }}>
        {items.map((word, i) => (
          <div key={i} style={{
            position: 'absolute', width: '100%', height: h,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT.title, fontSize, whiteSpace: 'nowrap',
            color: i === last ? finalColor : color,
            transform: `rotateX(${i * anglePer}deg) translateZ(${z}px)`,
            backfaceVisibility: 'hidden',
          }}>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 5) DramaticNumber — Zähler mit Fake-Stopp + Re-Beschleunigung + Bounce ───
//     Spannung pur: zählt hoch, stockt kurz („war's das?"), zieht dann durch.
//     <DramaticNumber to={121997} format={euro} durationFrames={80} />
export const DramaticNumber: React.FC<{
  to: number;
  from?: number;
  format?: (n: number) => string;
  fontSize?: number;
  color?: string;
  startAt?: number;
  durationFrames?: number;
  fakeStopAt?: number;      // 0..1 — wo der Fake-Stopp liegt (Anteil v. Zielwert)
}> = ({ to, from = 0, format = (n) => Math.round(n).toLocaleString('de-DE'),
        fontSize = 150, color = C.gold, startAt = 0, durationFrames = 80,
        fakeStopAt = 0.22 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - startAt);
  const x = Math.min(t / durationFrames, 1);

  // 4 Phasen: anrollen → Fake-Stopp → Re-Beschleunigung → Endspurt + sanft stoppen
  const dramatic = (p: number): number => {
    const s = fakeStopAt;
    if (p < 0.25)   return s * Easing.out(Easing.quad)(p / 0.25);
    if (p < 0.4375) return s + 0.05 * (1 - Math.pow(1 - (p - 0.25) / 0.1875, 3));
    if (p < 0.5625) return s + 0.05 + 0.1 * Easing.in(Easing.quad)((p - 0.4375) / 0.125);
    return s + 0.15 + (1 - s - 0.15) * (1 - Math.pow(1 - (p - 0.5625) / 0.4375, 4));
  };

  const value = from + (to - from) * dramatic(x);

  // Einrasten: kurzer Scale-Punch
  const landed = t >= durationFrames;
  const punchP = landed
    ? spring({ frame: t - durationFrames, fps, config: { damping: 9, stiffness: 170 } })
    : 0;
  const scale = landed ? 1 + 0.07 * (1 - Math.abs(1 - 2 * Math.min(punchP, 1))) : 1;
  // leichtes Zittern während der Hochgeschwindigkeitsphase
  const shaking = !landed && x > 0.6;
  const shakeY = shaking ? Math.sin(t * 2.7) * 2 : 0;

  return (
    <span style={{
      fontFamily: FONT.title, fontSize, color, display: 'inline-block',
      transform: `scale(${scale}) translateY(${shakeY}px)`,
      whiteSpace: 'nowrap',
    }}>
      {format(landed ? to : value)}
    </span>
  );
};

// ─── 6) CountdownRoller — 3 · 2 · 1 mit Zoom-Durchfall ────────────────────────
//     <CountdownRoller from={3} framesPerCount={22} /> — endet optional mit Wort.
export const CountdownRoller: React.FC<{
  from?: number;
  finalWord?: string;       // z.B. „LOS!" — erscheint nach der 1
  framesPerCount?: number;
  fontSize?: number;
  color?: string;
  finalColor?: string;
  startAt?: number;
}> = ({ from = 3, finalWord, framesPerCount = 22, fontSize = 220,
        color = C.white, finalColor = 'var(--accent)', startAt = 0 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - startAt);
  const steps = from + (finalWord ? 1 : 0);
  const idx = Math.min(Math.floor(t / framesPerCount), steps - 1);
  const local = t - idx * framesPerCount;
  const p = interpolate(local, [0, framesPerCount], [0, 1], CLAMP);

  const isWord = finalWord !== undefined && idx === steps - 1;
  const label = isWord ? finalWord : String(from - idx);
  const isLast = idx === steps - 1;

  // jede Zahl: rein-zoomen, kurz stehen, weg-zoomen (letzte bleibt)
  const inP = interpolate(p, [0, 0.25], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.8)) });
  const outP = isLast ? 0 : interpolate(p, [0.7, 1], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const scale = 0.6 + inP * 0.4 + outP * 1.6;
  const opacity = Math.min(inP, 1) * (1 - outP);

  return (
    <span style={{
      fontFamily: FONT.title, fontSize, color: isWord ? finalColor : color,
      display: 'inline-block', transform: `scale(${scale})`, opacity,
      filter: outP > 0 ? `blur(${outP * 8}px)` : undefined,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
};
