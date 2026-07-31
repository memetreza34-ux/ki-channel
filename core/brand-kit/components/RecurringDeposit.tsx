import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, a, prog, lerpF, E } from '../tokens';
import { FONT } from '../fonts';
import { Lucide } from './Lucide';
import { PremiumIconLabel } from './PremiumIcon';
import { Float } from './motion';

// ════════════════════════════════════════════════════════════════════════════
//  <RecurringDeposit> — visualisiert einen WIEDERKEHRENDEN Vorgang (z.B. "jeden
//  Monat 100€ in den ETF-Sparplan"), NICHT nur ein statisches Label. Eine Münze
//  fällt pro Zyklus von oben in einen Behälter, der Behälter füllt sich
//  Schritt für Schritt, ein Zyklus-Zähler tickt mit ("Monat 1", "Monat 2", …).
//  Bug-Auslöser: reiner Text + statisches Tag zeigt einen wiederkehrenden
//  Vorgang NICHT — man muss die Wiederholung sehen, nicht nur lesen.
//    <RecurringDeposit cycles={4} start={10} perCycle={22} amountLabel="100 €"
//      cyclePrefix="Monat" width={500} height={620} />
// ════════════════════════════════════════════════════════════════════════════
export const RecurringDeposit: React.FC<{
  cycles: number;            // wie viele Zyklen sichtbar animiert werden (z.B. 4)
  start: number;             // Startframe des 1. Zyklus
  perCycle?: number;         // Frames pro Zyklus (Fall + Landung + Pause)
  containerIcon?: string;    // Lucide-Icon-Name, WAS hier wächst (z.B. "chart-line" für ETF)
  containerLabel?: string;   // optionale kurze Beschriftung NEBEN dem Icon (Icon+Text-Pille erlaubt,
                              // nur alleinstehender Text ohne Icon nicht — siehe REEL-PRINZIPIEN Punkt 7)
  showLabels?: boolean;      // false = reine Visual-Prüfung ohne jedes Icon-Label (z.B. Voiceover/Captions übernehmen)
  width?: number;
  height?: number;
  color?: string;
}> = ({
  cycles, start, perCycle = 24,
  containerIcon, containerLabel, showLabels = true, width = 460, height = 600, color = 'var(--accent)',
}) => {
  const f = useCurrentFrame();
  // Behälter füllt den Großteil der übergebenen Fläche (kein winziges Element in viel
  // Leerraum, siehe REEL-AUFBAU Regel 6 "nicht am oberen Rand bauen, aber auch nicht
  // zu klein") und der Zähler/Münzfall sitzen DIREKT am Behälter, nicht am Rand der Box.
  const containerW = width * 0.62, containerH = height * 0.6;
  const containerX = width / 2 - containerW / 2, containerY = height - containerH - 70;
  const counterY = containerY - 76;
  const coinDropStart = containerY - 150;

  const t = f - start;
  const cycleIdx = Math.max(0, Math.min(cycles - 1, Math.floor(t / perCycle)));
  const cycleLocalF = Math.max(0, t - cycleIdx * perCycle);
  const activeCycle = t >= 0 ? cycleIdx + 1 : 0;
  const doneCycles = t >= 0 ? Math.min(cycles, Math.floor(t / perCycle) + (cycleLocalF > perCycle * 0.55 ? 1 : 0)) : 0;

  // Münze: fällt (0..~55% des Zyklus), landet mit Spring-Squash, dann Pause
  const fallP = prog(cycleLocalF, 0, perCycle * 0.5, E.in);
  const coinY = lerpF(cycleLocalF, coinDropStart, containerY - 20, 0, perCycle * 0.5, E.in);
  const landed = cycleLocalF >= perCycle * 0.5;
  const squash = landed ? Math.max(0, 1 - (cycleLocalF - perCycle * 0.5) / (perCycle * 0.25)) : 0;
  const coinOpacity = t >= 0 && cycleLocalF < perCycle * 0.75 ? 1 : 0;

  const fillPct = doneCycles / cycles;

  // Treppen-Wachstumslinie im Füllstand — macht aus "Behälter füllt sich" klar
  // erkennbar "Investment wächst" (Chart-Optik statt Flüssigkeits-Optik).
  const innerX0 = containerX + 10, innerX1 = containerX + containerW - 10;
  const innerBottom = containerY + containerH - 8;
  const stepX = (i: number) => innerX0 + (innerX1 - innerX0) * (i / cycles);
  const stepY = (i: number) => innerBottom - (containerH - 16) * (i / cycles);
  let stairPath = `M ${stepX(0)},${innerBottom}`;
  for (let i = 1; i <= doneCycles; i++) {
    stairPath += ` L ${stepX(i)},${stepY(i - 1)} L ${stepX(i)},${stepY(i)}`;
  }

  // Kalender-Flip statt Text: dreht sich einmal ganz um den Moment des Aufschlags
  // ("ein neuer Monat beginnt"), keine getippte "Monat X"-Zeile.
  const flipP = prog(cycleLocalF, 0, perCycle * 0.45, E.inOut);
  const flipDeg = activeCycle > 0 ? flipP * 360 : 0;
  const dotSize = width * 0.036, dotGap = width * 0.05;
  const dotsW = cycles * dotSize + (cycles - 1) * dotGap;

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Kalender-Icon (flippt pro Zyklus) + Punkte-Reihe (füllt sich) — ERSETZT
          die frühere "Monat X · 100€"-Textzeile, siehe REEL-PRINZIPIEN.md:
          keine langweilige Text-Zeile für wiederkehrende Vorgänge, Icon+Animation. */}
      {showLabels && (
        <div style={{ position: 'absolute', top: counterY - 14, left: 0, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: width * 0.03 }}>
          <div style={{ transform: `perspective(300px) rotateX(${flipDeg}deg)`, opacity: activeCycle > 0 ? 1 : 0 }}>
            <Lucide name="calendar" size={width * 0.11} color={color} glow />
          </div>
          <div style={{ display: 'flex', gap: dotGap, width: dotsW }}>
            {Array.from({ length: cycles }, (_, i) => {
              const filled = i < doneCycles;
              const justFilled = i === doneCycles - 1 && cycleLocalF < perCycle * 0.5 + 8;
              return (
                <div key={i} style={{
                  width: dotSize, height: dotSize, borderRadius: '50%',
                  background: filled ? color : a(C.gray, 0.25),
                  boxShadow: filled ? `0 0 ${dotSize}px ${a(color, 0.7)}` : undefined,
                  transform: `scale(${justFilled ? 1.5 : 1})`,
                  transition: undefined,
                }} />
              );
            })}
          </div>
        </div>
      )}

      {/* Fallende Münze */}
      {coinOpacity > 0 && (
        <div style={{
          position: 'absolute', left: width / 2 - width * 0.074, top: coinY,
          transform: `scaleY(${1 - squash * 0.5}) scaleX(${1 + squash * 0.3})`,
          transformOrigin: 'bottom center', opacity: fallP,
        }}>
          <div style={{
            width: width * 0.148, height: width * 0.148, borderRadius: '50%', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 24px ${a(color, 0.7)}`,
          }}>
            <span style={{ fontFamily: FONT.title, fontWeight: 900, fontSize: width * 0.065, color: '#0a0a0a' }}>€</span>
          </div>
        </div>
      )}

      {/* Behälter, füllt sich Zyklus für Zyklus */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="rdFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect x={containerX} y={containerY} width={containerW} height={containerH} rx={18}
          fill={a(C.gray, 0.08)} stroke={a(C.gray, 0.35)} strokeWidth={3} />
        <rect
          x={containerX + 4} width={containerW - 8}
          y={containerY + containerH - (containerH - 8) * fillPct - 4}
          height={(containerH - 8) * fillPct}
          rx={12} fill="url(#rdFill)"
          style={{ filter: `drop-shadow(0 0 16px ${a(color, 0.5)})` }}
        />
        {/* Treppen-Linie — jeder Zyklus ein Stufensprung nach oben, klar als
            Wachstums-/Chart-Linie lesbar, nicht als Flüssigkeitsfüllstand */}
        {doneCycles > 0 && (
          <path d={stairPath} fill="none" stroke={C.white} strokeWidth={4} strokeLinejoin="round"
            opacity={0.85} style={{ filter: `drop-shadow(0 0 8px ${a(C.white, 0.6)})` }} />
        )}
      </svg>

      {/* Slot unter dem Behälter — lebendig statt starr: Icon(+kurzer Text als Pille, kein
          alleinstehender Text) mit durchgehender Float-Bewegung, dann Überblend zu einem
          pulsierenden, ebenfalls schwebenden Unendlich-Icon ("das geht so weiter").
          Siehe REEL-PRINZIPIEN.md Punkt 7 — Icon+Text-Kombi ist erlaubt, nur Text allein nicht. */}
      {showLabels && (
        <div style={{ position: 'absolute', top: containerY + containerH + 20, left: 0, width: '100%',
          textAlign: 'center' }}>
          {containerIcon && (
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              opacity: prog(f, start + 6, start + 20, E.spring)
                * (1 - prog(f, start + cycles * perCycle, start + cycles * perCycle + 12, E.out)),
            }}>
              <Float amp={5} speed={0.7}>
                {containerLabel ? (
                  <PremiumIconLabel name={containerIcon} label={containerLabel} size="sm" at={start + 6}
                    color={color} fontSize={width * 0.045} />
                ) : (
                  <Lucide name={containerIcon} size={width * 0.08} color={a(C.white, 0.8)} glow />
                )}
              </Float>
            </div>
          )}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            opacity: prog(f, start + cycles * perCycle, start + cycles * perCycle + 16, E.out),
          }}>
            <Float amp={6} speed={0.6}>
              <div style={{ transform: `scale(${1 + Math.sin(f * 0.08) * 0.1})` }}>
                <Lucide name="infinity" size={width * 0.1} color={color} glow />
              </div>
            </Float>
          </div>
        </div>
      )}
    </div>
  );
};
