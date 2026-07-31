import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, E, a, prog, lerpF, euro } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  METAPHER-BAUSTEINE — abstraktes Konzept als vertrautes Bild (der Qualitäts-Hebel).
//  Prozedural (SVG), theme-fähig. Siehe core/gehirn/METAPHORS.md.
// ════════════════════════════════════════════════════════════════════════════

// ─── Snowball — Zinseszins/exponentielles Wachstum ───────────────────────────
//  Ball startet klein, rollt bergab, wächst, Wert läuft mit. <Snowball to={121997} .../>
export const Snowball: React.FC<{
  start: number; end: number; from?: number; to: number;
  format?: (n: number) => string; ballColor?: string; valueColor?: string; w?: number; h?: number;
}> = ({ start, end, from = 0, to, format = euro, ballColor = '#EAF6FF', valueColor = C.gold, w = 1000, h = 720 }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.inOut);
  const x0 = 190, x1 = w - 260, y0 = 200, y1 = h - 230;
  const x = x0 + p * (x1 - x0);
  const y = y0 + p * (y1 - y0);
  const r = 42 + p * 150;
  const roll = p * 700;
  const val = from + (to - from) * p;
  const lumps: [number, number, number, string][] = [
    [-0.42, -0.28, 0.16, '#FFFFFF'], [0.34, -0.16, 0.12, '#C9DBE8'], [0.08, 0.4, 0.18, '#FFFFFF'],
    [-0.22, 0.26, 0.1, '#B7CCDB'], [0.46, 0.3, 0.13, '#FFFFFF'], [-0.5, 0.08, 0.09, '#C9DBE8'],
  ];
  const puffs = [0.06, 0.13, 0.2, 0.28].map((d) => {
    const tp = Math.max(0, p - d); const bx = x0 + tp * (x1 - x0); const by = y0 + tp * (y1 - y0);
    return { bx, by, rr: r * (0.18 + d), o: (p > d ? 0.5 : 0) * (1 - d * 2) };
  });
  const trail = `M ${x0} ${y0} L ${x} ${y - r * 0.9} L ${x} ${y + r * 0.9} L ${x0} ${y0 + 8} Z`;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <defs>
        <radialGradient id="vk-snow" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFFFFF" /><stop offset="42%" stopColor="#EAF3FA" />
          <stop offset="78%" stopColor="#C2D4E2" /><stop offset="100%" stopColor="#8FA6B9" />
        </radialGradient>
      </defs>
      <path d={`M ${x0 - 80} ${y0 - 30} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 - 20} ${x1 + 180} ${y1 + 60}`}
        fill="none" stroke={a('#D8E6F0', 0.45)} strokeWidth={12} strokeLinecap="round" />
      <path d={trail} fill={a('#D8E6F0', 0.13)} />
      {puffs.map((pf, i) => (pf.o > 0 ? <circle key={i} cx={pf.bx} cy={pf.by} r={pf.rr} fill="#EAF3FA" opacity={pf.o} /> : null))}
      <ellipse cx={x} cy={y + r * 0.92} rx={r * 0.85} ry={r * 0.22} fill="rgba(0,0,0,0.35)" style={{ filter: 'blur(6px)' }} />
      <g transform={`rotate(${roll} ${x} ${y})`}>
        <circle cx={x} cy={y} r={r} fill="url(#vk-snow)" />
        {lumps.map((lp, i) => <circle key={i} cx={x + lp[0] * r} cy={y + lp[1] * r} r={lp[2] * r} fill={lp[3]} opacity={0.5} />)}
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#7E93A6" strokeWidth={2} opacity={0.4} />
      <ellipse cx={x - r * 0.34} cy={y - r * 0.36} rx={r * 0.3} ry={r * 0.2} fill="#FFFFFF" opacity={0.55} style={{ filter: 'blur(3px)' }} />
      <text x={x} y={y - r - 30} textAnchor="middle" fill={valueColor} fontFamily={FONT.title} fontSize={70}
        style={{ filter: `drop-shadow(0 0 22px ${a(valueColor, 0.6)})` }}>{format(val)}</text>
    </svg>
  );
};

// ─── DebtSpiral — Schulden/Zinseszins GEGEN dich (Kreditkarten-Falle) ────────
// Lücke geschlossen (2026-07-22): `Snowball` zeigt Zinseszins nur positiv (Eis/Weiß, rollt
// bergab zum Gewinn). Für "Schulden wachsen dir über den Kopf" gab's keine Gegenversion —
// gleiche Zinseszins-Mechanik, aber als Gefahr geframt: rot/Warnfarbe, spiralt nach UNTEN in
// einen dunklen Abgrund statt fröhlich bergab zu rollen. <DebtSpiral start={0} end={70} to={4800} />
export const DebtSpiral: React.FC<{
  start: number; end: number; from?: number; to: number;
  format?: (n: number) => string; w?: number; h?: number;
}> = ({ start, end, from = 0, to, format = euro, w = 1000, h = 780 }) => {
  const f = useCurrentFrame();
  const p = prog(f, start, end, E.inOut);
  const cx = w / 2, cy = h - 170;
  // Spirale nach innen/unten — Radius UND Winkel wachsen, Ball sinkt in den Abgrund
  const turns = 2.4;
  const angle = p * turns * Math.PI * 2;
  const rSpiral = 260 * (1 - p * 0.72);
  const x = cx + Math.sin(angle) * rSpiral;
  const y = cy - 260 + p * 260 + Math.cos(angle) * rSpiral * 0.35;
  const r = 30 + p * 78;
  const val = from + (to - from) * p;
  const shake = p > 0.75 ? Math.sin(f * 2.2) * (p - 0.75) * 18 : 0;

  // Spiral-Pfad als sichtbare Spur (gestrichelt, Warnfarbe)
  const trailPts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const tp = (i / 40) * p;
    const a2 = tp * turns * Math.PI * 2;
    const rr = 260 * (1 - tp * 0.72);
    const tx = cx + Math.sin(a2) * rr;
    const ty = cy - 260 + tp * 260 + Math.cos(a2) * rr * 0.35;
    trailPts.push(`${tx},${ty}`);
  }

  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <defs>
        <radialGradient id="vk-debtball" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FF8A6B" /><stop offset="45%" stopColor="#FF4D3D" />
          <stop offset="100%" stopColor="#8A1206" />
        </radialGradient>
        <radialGradient id="vk-abyss" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Abgrund unten — dunkler Trichter, in den die Spirale fällt */}
      <ellipse cx={cx} cy={cy + 40} rx={220} ry={64} fill="url(#vk-abyss)" />
      <ellipse cx={cx} cy={cy + 40} rx={180} ry={46} fill="none" stroke={a(C.negative, 0.4)} strokeWidth={3} />
      {/* Spiral-Spur */}
      <polyline points={trailPts.join(' ')} fill="none" stroke={a(C.negative, 0.45)} strokeWidth={5}
        strokeDasharray="14 10" strokeLinecap="round" />
      {/* Fallender Schulden-Ball mit Stachel-Warnkontur */}
      <g transform={`translate(${shake} 0)`}>
        <ellipse cx={x} cy={y + r * 0.95} rx={r * 0.85} ry={r * 0.22} fill="rgba(0,0,0,0.45)" style={{ filter: 'blur(6px)' }} />
        <circle cx={x} cy={y} r={r} fill="url(#vk-debtball)" />
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.negative} strokeWidth={3}
          style={{ filter: `drop-shadow(0 0 16px ${a(C.negative, 0.7)})` }} />
        <ellipse cx={x - r * 0.34} cy={y - r * 0.36} rx={r * 0.28} ry={r * 0.18} fill="#FFFFFF" opacity={0.35} style={{ filter: 'blur(3px)' }} />
        {/* Warn-Dreieck erscheint, sobald der Ball groß genug ist */}
        {p > 0.35 && (
          <text x={x} y={y + r * 0.32} textAnchor="middle" fontSize={r * 0.7} style={{ opacity: prog(f, start + (end - start) * 0.35, start + (end - start) * 0.35 + 10) }}>⚠</text>
        )}
      </g>
      <text x={cx} y={cy - 300} textAnchor="middle" fill={C.negative} fontFamily={FONT.title} fontSize={70}
        style={{ filter: `drop-shadow(0 0 22px ${a(C.negative, 0.6)})` }}>{format(val)}</text>
    </svg>
  );
};

// ─── LeakyBucket — Inflation / Kaufkraftverlust ──────────────────────────────
//  Eimer mit Löchern, Geld tropft raus, Füllstand sinkt. <LeakyBucket at={10} />
export const LeakyBucket: React.FC<{
  at: number; dur?: number; color?: string; w?: number; h?: number;
}> = ({ at, dur = 100, color = C.gold, w = 700, h = 780 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const bx = w / 2, topW = 320, botW = 230, bTop = 190, bBot = 620;
  const fillTop = bTop + 40;
  const level = fillTop + (bBot - fillTop) * (p * 0.62);       // sinkt
  const poly = `${bx - topW / 2},${bTop} ${bx + topW / 2},${bTop} ${bx + botW / 2},${bBot} ${bx - botW / 2},${bBot}`;
  // Wand verjüngt sich linear von topW (bTop) zu botW (bBot) — Löcher exakt auf diese Kontur legen.
  const wallX = (side: -1 | 1, hy: number) => {
    const t = (hy - bTop) / (bBot - bTop);
    return bx + side * (topW / 2 + t * (botW / 2 - topW / 2));
  };
  const holes = [
    { hx: wallX(-1, 470), hy: 470, side: -1 as const },
    { hx: wallX(1, 530), hy: 530, side: 1 as const },
    { hx: wallX(-1, 575), hy: 575, side: -1 as const },
  ];
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <clipPath id="lbk"><polygon points={poly} /></clipPath>
      <rect x={bx - topW / 2} y={level} width={topW} height={bBot - level}
        fill={a(color, 0.85)} clipPath="url(#lbk)" style={{ filter: `drop-shadow(0 0 16px ${a(color, 0.4)})` }} />
      <polygon points={poly} fill="none" stroke={C.white} strokeWidth={8} strokeLinejoin="round" />
      {/* Henkel */}
      <path d={`M ${bx - topW / 2 + 10} ${bTop} Q ${bx} ${bTop - 90} ${bx + topW / 2 - 10} ${bTop}`}
        fill="none" stroke={a(C.white, 0.7)} strokeWidth={7} />
      {holes.map((ho, i) => (
        <g key={i}>
          {/* Loch sitzt auf der Eimerkontur: dunkler Kern + heller Rand, damit es als Loch statt als Fleck liest */}
          <ellipse cx={ho.hx} cy={ho.hy} rx={16} ry={12} fill={C.bgDeep} stroke={a(C.white, 0.55)} strokeWidth={2.5} />
          <ellipse cx={ho.hx - ho.side * 3} cy={ho.hy - 3} rx={5} ry={3} fill={a('#000000', 0.5)} />
          {[0, 1, 2].map((k) => {
            const dp = (((f * 2.6) + i * 22 + k * 34) % 100) / 100;
            const dy = ho.hy + 14 + dp * 150;
            const op = (1 - dp) * (level < bBot - 20 ? 1 : 0);
            return (
              <text key={k} x={ho.hx} y={dy} textAnchor="middle" fill={color} fontFamily={FONT.title}
                fontWeight={800} fontSize={44} opacity={op}
                style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.85)})` }}>€</text>
            );
          })}
        </g>
      ))}
    </svg>
  );
};

// ─── DIVERSIFICATION — "nicht alle Eier in einen Korb" ────────────────────────
//  Ein Korb mit allen Eiern wackelt/knackt, dann verteilen sich die Eier auf
//  mehrere Körbe. <Diversification at={10} labels={['Aktien','Anleihen','Gold','Cash']} />
export const Diversification: React.FC<{
  at: number; dur?: number; labels?: string[]; colors?: string[]; w?: number; h?: number;
}> = ({
  at, dur = 90,
  labels = ['Aktien', 'Anleihen', 'Gold', 'Cash'],
  colors = [C.accent, C.blue, C.gold, C.purple],
  w = 1000, h = 620,
}) => {
  const f = useCurrentFrame();
  // Phase 1 (0–0.35): einzelner Korb wackelt (Risiko). Phase 2 (0.35–1): Eier verteilen sich.
  const wobbleEnd = at + dur * 0.32;
  const spreadStart = wobbleEnd;
  const spreadEnd = at + dur;
  const wobbleP = prog(f, at, wobbleEnd, E.inOut);
  const spreadP = prog(f, spreadStart, spreadEnd, E.inOut);

  const n = labels.length;
  const centerX = w / 2, centerY = h - 150;
  const singleBasketY = h - 150;
  const wobbleAngle = Math.sin(f * 0.9) * (1 - spreadP) * 6 * (wobbleP > 0 && wobbleP < 1 ? 1 : 0);
  const crackP = prog(f, at + dur * 0.14, wobbleEnd, E.inOut); // Korb bekommt Risse

  const targetX = (i: number) => {
    const spacing = w / (n + 1);
    return spacing * (i + 1);
  };

  const Basket: React.FC<{ x: number; y: number; scale?: number; color: string; cracked?: number }> = ({
    x, y, scale = 1, color, cracked = 0,
  }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -70,-10 L 70,-10 L 55,60 L -55,60 Z" fill={a(color, 0.22)} stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -55,-10 L -35,-10 M -15,-10 L 5,-10 M 25,-10 L 45,-10" stroke={color} strokeWidth={4} opacity={0.5} />
      {cracked > 0 && (
        <path d="M -8,-8 L 6,18 L -4,22 L 10,52" fill="none" stroke={C.negative} strokeWidth={3}
          opacity={cracked} strokeLinecap="round" />
      )}
    </g>
  );

  const Egg: React.FC<{ x: number; y: number; color: string; scale?: number; opacity?: number }> = ({
    x, y, color, scale = 1, opacity = 1,
  }) => (
    <ellipse cx={x} cy={y} rx={18 * scale} ry={24 * scale} fill={color}
      opacity={opacity} style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.5)})` }} />
  );

  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      {/* Phase 2: Zielkörbe erscheinen */}
      {spreadP > 0 && labels.map((label, i) => {
        const tx = targetX(i);
        const p2 = Math.min(1, Math.max(0, (spreadP - i * 0.06) / 0.7));
        return (
          <g key={i} opacity={p2}>
            <Basket x={tx} y={singleBasketY + (1 - p2) * 20} scale={0.72 + p2 * 0.1} color={colors[i % colors.length]} />
            <text x={tx} y={singleBasketY + 100} textAnchor="middle" fill={C.white} fontFamily={FONT.body}
              fontWeight={700} fontSize={26} opacity={p2}>{label}</text>
          </g>
        );
      })}

      {/* Phase 1: einzelner (wackelnder, rissiger) Korb — verblasst wenn Phase 2 einsetzt */}
      <g opacity={1 - spreadP} transform={`rotate(${wobbleAngle} ${centerX} ${singleBasketY})`}>
        <Basket x={centerX} y={singleBasketY} scale={1.3} color={C.negative} cracked={crackP} />
      </g>

      {/* Eier: liegen erst gebündelt im einen Korb, fliegen dann zu ihren Zielkörben */}
      {Array.from({ length: n * 3 }, (_, idx) => {
        const target = idx % n;
        const seed = idx * 37 % 100;
        const startX = centerX + ((seed % 5) - 2) * 16;
        const startY = singleBasketY - 20 - Math.floor(idx / n) * 22;
        const tx = targetX(target) + ((idx * 13) % 5 - 2) * 14;
        const ty = singleBasketY - 15 - (Math.floor(idx / n)) * 16;
        const flightDelay = (idx % n) * 0.05;
        const flightP = Math.min(1, Math.max(0, (spreadP - flightDelay) / (1 - flightDelay)));
        const arcLift = Math.sin(flightP * Math.PI) * 70;
        const ex = lerpF(f, startX, tx, spreadStart, spreadEnd, E.inOut);
        const ey = lerpF(f, startY, ty, spreadStart, spreadEnd, E.inOut) - arcLift;
        return <Egg key={idx} x={ex} y={ey} color={colors[target % colors.length]} scale={0.9} />;
      })}
    </svg>
  );
};

// ─── DOLLARCOSTAVERAGE — Sparplan-Effekt: Kurs schwankt, Käufe glätten Preis ─
//  <DollarCostAverage at={10} />
export const DollarCostAverage: React.FC<{ at: number; dur?: number; w?: number; h?: number }> = ({
  at, dur = 130, w = 1000, h = 560,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const pts = [0.5, 0.75, 0.35, 0.9, 0.25, 0.6, 0.4, 0.8, 0.3, 0.55]; // relative Kursverläufe
  const n = Math.max(2, Math.floor(1 + p * (pts.length - 1)));
  const x0 = 100, x1 = w - 100, y0 = 80, y1 = h - 120;
  const stepX = (x1 - x0) / (pts.length - 1);
  const priceY = (v: number) => y1 - v * (y1 - y0);
  const path = pts.slice(0, n).map((v, i) => `${i === 0 ? 'M' : 'L'} ${x0 + i * stepX} ${priceY(v)}`).join(' ');
  const avg = pts.slice(0, n).reduce((s, v) => s + v, 0) / n;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <path d={path} fill="none" stroke={C.gray} strokeWidth={3} />
      {pts.slice(0, n).map((v, i) => (
        <circle key={i} cx={x0 + i * stepX} cy={priceY(v)} r={9} fill={C.gold}
          style={{ filter: `drop-shadow(0 0 8px ${a(C.gold, 0.6)})` }} />
      ))}
      <line x1={x0} y1={priceY(avg)} x2={x0 + (n - 1) * stepX} y2={priceY(avg)}
        stroke={C.accent} strokeWidth={4} strokeDasharray="10 6"
        style={{ filter: `drop-shadow(0 0 10px ${a(C.accent, 0.6)})` }} />
      <text x={x0 + (n - 1) * stepX + 20} y={priceY(avg) + 8} fill={C.accent} fontFamily={FONT.title} fontSize={34}>
        Ø Kaufpreis
      </text>
      <text x={x0} y={y1 + 44} fill={C.gray} fontFamily={FONT.body} fontSize={26}>Jeden Monat gekauft — egal ob hoch oder tief</text>
    </svg>
  );
};

// ─── RULEOF72 — 72 ÷ Zinssatz = Jahre bis Verdopplung ───────────────────────
export const RuleOf72: React.FC<{ rate: number; at: number; dur?: number; w?: number; h?: number }> = ({
  rate, at, dur = 60, w = 900, h = 420,
}) => {
  const f = useCurrentFrame();
  const p1 = prog(f, at, at + dur * 0.4, E.spring);
  const p2 = prog(f, at + dur * 0.35, at + dur * 0.7, E.spring);
  const p3 = prog(f, at + dur * 0.65, at + dur, E.spring);
  const years = Math.round(72 / rate);
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <text x={w * 0.18} y={h * 0.5} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={90}
        opacity={p1} style={{ filter: `drop-shadow(0 0 16px ${a(C.white, 0.3)})` }}>72</text>
      <text x={w * 0.32} y={h * 0.5} textAnchor="middle" fill={C.gray} fontFamily={FONT.title} fontSize={60} opacity={p1}>÷</text>
      <text x={w * 0.46} y={h * 0.5} textAnchor="middle" fill={C.gold} fontFamily={FONT.title} fontSize={90} opacity={p2}
        style={{ filter: `drop-shadow(0 0 16px ${a(C.gold, 0.5)})` }}>{rate}%</text>
      <text x={w * 0.6} y={h * 0.5} textAnchor="middle" fill={C.gray} fontFamily={FONT.title} fontSize={60} opacity={p2}>=</text>
      <text x={w * 0.82} y={h * 0.5} textAnchor="middle" fill={C.accent} fontFamily={FONT.title} fontSize={100} opacity={p3}
        style={{ filter: `drop-shadow(0 0 20px ${a(C.accent, 0.6)})` }}>{years}</text>
      <text x={w * 0.82} y={h * 0.5 + 50} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={26} opacity={p3}>
        Jahre bis Verdopplung
      </text>
    </svg>
  );
};

// ─── COMPOUNDVSSIMPLE — Zinseszins-Kurve vs. lineare Verzinsung, Schere öffnet sich ─
export const CompoundVsSimple: React.FC<{
  principal: number; rate: number; years: number; at: number; dur?: number; w?: number; h?: number;
}> = ({ principal, rate, years, at, dur = 130, w = 1000, h = 580 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const x0 = 110, x1 = w - 60, y0 = 60, y1 = h - 100;
  const simpleEnd = principal * (1 + (rate / 100) * years);
  const compoundEnd = principal * Math.pow(1 + rate / 100, years);
  const maxV = compoundEnd;
  const yFor = (v: number) => y1 - (v / maxV) * (y1 - y0);
  const N = 40;
  const curP = Math.max(2, Math.floor(p * N));
  const simplePath = Array.from({ length: curP }, (_, i) => {
    const t = (i / (N - 1)) * years;
    const v = principal * (1 + (rate / 100) * t);
    const x = x0 + (i / (N - 1)) * (x1 - x0);
    return `${i === 0 ? 'M' : 'L'} ${x} ${yFor(v)}`;
  }).join(' ');
  const compoundPath = Array.from({ length: curP }, (_, i) => {
    const t = (i / (N - 1)) * years;
    const v = principal * Math.pow(1 + rate / 100, t);
    const x = x0 + (i / (N - 1)) * (x1 - x0);
    return `${i === 0 ? 'M' : 'L'} ${x} ${yFor(v)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <path d={simplePath} fill="none" stroke={C.gray} strokeWidth={4} />
      <path d={compoundPath} fill="none" stroke={C.accent} strokeWidth={5}
        style={{ filter: `drop-shadow(0 0 12px ${a(C.accent, 0.6)})` }} />
      {p > 0.05 && (
        <>
          <text x={x1 + 14} y={yFor(principal * (1 + (rate / 100) * years * Math.min(1, curP / N))) + 6}
            fill={C.gray} fontFamily={FONT.body} fontSize={26}>Linear</text>
          <text x={x1 + 14} y={yFor(principal * Math.pow(1 + rate / 100, years * Math.min(1, curP / N))) + 6}
            fill={C.accent} fontFamily={FONT.title} fontSize={30}>Zinseszins</text>
        </>
      )}
      <text x={x0} y={y0 - 20} fill={C.white} fontFamily={FONT.body} fontSize={24}>
        Start: {euro(principal)} · {rate}%/Jahr über {years} Jahre
      </text>
    </svg>
  );
};

// ─── TAXDRAG — jährlicher Steuerabzug bremst das Wachstum ───────────────────
export const TaxDrag: React.FC<{
  principal: number; rate: number; taxRate: number; years: number; at: number; dur?: number; w?: number; h?: number;
}> = ({ principal, rate, taxRate, years, at, dur = 120, w = 1000, h = 560 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const x0 = 110, x1 = w - 60, y0 = 60, y1 = h - 100;
  const withoutTax = principal * Math.pow(1 + rate / 100, years);
  const netRate = (rate / 100) * (1 - taxRate / 100);
  const withTax = principal * Math.pow(1 + netRate, years);
  const maxV = withoutTax;
  const yFor = (v: number) => y1 - (v / maxV) * (y1 - y0);
  const N = 36;
  const curP = Math.max(2, Math.floor(p * N));
  const line = (growthRate: number) => Array.from({ length: curP }, (_, i) => {
    const t = (i / (N - 1)) * years;
    const v = principal * Math.pow(1 + growthRate, t);
    const x = x0 + (i / (N - 1)) * (x1 - x0);
    return `${i === 0 ? 'M' : 'L'} ${x} ${yFor(v)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <path d={line(rate / 100)} fill="none" stroke={C.accent} strokeWidth={4} strokeDasharray="8 6" opacity={0.6} />
      <path d={line(netRate)} fill="none" stroke={C.gold} strokeWidth={5}
        style={{ filter: `drop-shadow(0 0 12px ${a(C.gold, 0.5)})` }} />
      {p > 0.6 && (
        <>
          <text x={x1 - 220} y={yFor(withoutTax) - 14} fill={C.accent} fontFamily={FONT.body} fontSize={24} opacity={0.7}>
            ohne Steuer: {euro(withoutTax)}
          </text>
          <text x={x1 - 220} y={yFor(withTax) + 34} fill={C.gold} fontFamily={FONT.title} fontSize={28}>
            mit {taxRate}% Steuer: {euro(withTax)}
          </text>
        </>
      )}
    </svg>
  );
};

// ─── CORRELATION — zwei Linien: synchron (korreliert) vs. unabhängig ────────
export const Correlation: React.FC<{ at: number; dur?: number; w?: number; h?: number }> = ({
  at, dur = 130, w = 1000, h = 500,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const N = 60;
  const curN = Math.max(2, Math.floor(p * N));
  const x0 = 80, x1 = w - 80;
  const rowH = 190;
  const line = (fn: (t: number) => number, cy: number, color: string) => {
    const d = Array.from({ length: curN }, (_, i) => {
      const t = i / (N - 1);
      const x = x0 + t * (x1 - x0);
      const y = cy + fn(t) * 55;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return <path d={d} fill="none" stroke={color} strokeWidth={4} style={{ filter: `drop-shadow(0 0 8px ${a(color, 0.4)})` }} />;
  };
  const wave = (t: number) => Math.sin(t * Math.PI * 4);
  const waveIndependent = (t: number) => Math.sin(t * Math.PI * 4 + 2.1) * 0.7 + Math.sin(t * 11) * 0.25;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <text x={x0} y={70} fill={C.white} fontFamily={FONT.body} fontSize={26} fontWeight={700}>Aktien A + Aktien B (bewegen sich gleich)</text>
      {line(wave, 130, C.negative)}
      {line(wave, 130, C.negativeLt)}
      <text x={x0} y={h / 2 + 40} fill={C.white} fontFamily={FONT.body} fontSize={26} fontWeight={700}>Aktien + Gold (bewegen sich unabhängig)</text>
      {line(wave, h / 2 + 110, C.accent)}
      {line(waveIndependent, h / 2 + 110, C.gold)}
    </svg>
  );
};

// ─── SEQUENCERISK — gleiche Durchschnittsrendite, andere Reihenfolge = anderes Ergebnis ─
export const SequenceRisk: React.FC<{
  principal: number; returns: number[]; at: number; dur?: number; w?: number; h?: number;
}> = ({ principal, returns, at, dur = 130, w = 1000, h = 560 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const reversed = [...returns].reverse();
  const compute = (seq: number[]) => seq.reduce((acc: number[], r) => [...acc, acc[acc.length - 1] * (1 + r / 100)], [principal]);
  const pathA = compute(returns), pathB = compute(reversed);
  const maxV = Math.max(...pathA, ...pathB);
  const x0 = 110, x1 = w - 60, y0 = 60, y1 = h - 120;
  const yFor = (v: number) => y1 - (v / maxV) * (y1 - y0);
  const N = returns.length;
  const curN = Math.max(1, Math.floor(1 + p * N));
  const line = (path: number[], color: string) => {
    const d = path.slice(0, curN + 1).map((v, i) => {
      const x = x0 + (i / N) * (x1 - x0);
      return `${i === 0 ? 'M' : 'L'} ${x} ${yFor(v)}`;
    }).join(' ');
    return <path d={d} fill="none" stroke={color} strokeWidth={5} style={{ filter: `drop-shadow(0 0 10px ${a(color, 0.5)})` }} />;
  };
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      {line(pathA, C.accent)}
      {line(pathB, C.gold)}
      {p > 0.5 && (
        <>
          <text x={x1 - 260} y={yFor(pathA[pathA.length - 1]) - 16} fill={C.accent} fontFamily={FONT.title} fontSize={28}>
            Verluste zuerst: {euro(pathA[pathA.length - 1])}
          </text>
          <text x={x1 - 260} y={yFor(pathB[pathB.length - 1]) + 34} fill={C.gold} fontFamily={FONT.title} fontSize={28}>
            Gewinne zuerst: {euro(pathB[pathB.length - 1])}
          </text>
        </>
      )}
      <text x={x0} y={y0 - 20} fill={C.gray} fontFamily={FONT.body} fontSize={24}>Gleiche Renditen, andere Reihenfolge — anderes Ergebnis</text>
    </svg>
  );
};

// ─── INFLATIONADJUSTED — Nominalwert vs. realer (inflationsbereinigter) Wert ─
export const InflationAdjusted: React.FC<{
  nominal: number; inflationRate: number; years: number; at: number; dur?: number; w?: number; h?: number;
}> = ({ nominal, inflationRate, years, at, dur = 60, w = 700, h = 500 }) => {
  const f = useCurrentFrame();
  const p1 = prog(f, at, at + dur * 0.5, E.spring);
  const p2 = prog(f, at + dur * 0.4, at + dur, E.spring);
  const real = nominal / Math.pow(1 + inflationRate / 100, years);
  const barH = 300, barW = 180, baseY = h - 90;
  const nomH = barH * p1, realH = barH * (real / nominal) * p2;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <rect x={w * 0.25 - barW / 2} y={baseY - nomH} width={barW} height={nomH} fill={a(C.white, 0.14)}
        stroke={C.white} strokeWidth={2} rx={10} />
      <text x={w * 0.25} y={baseY - nomH - 20} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={36} opacity={p1}>
        {euro(nominal)}
      </text>
      <text x={w * 0.25} y={baseY + 40} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={24}>Nominal</text>

      <rect x={w * 0.68 - barW / 2} y={baseY - realH} width={barW} height={realH} fill={a(C.gold, 0.22)}
        stroke={C.gold} strokeWidth={2} rx={10} style={{ filter: `drop-shadow(0 0 14px ${a(C.gold, 0.4)})` }} />
      <text x={w * 0.68} y={baseY - realH - 20} textAnchor="middle" fill={C.gold} fontFamily={FONT.title} fontSize={36} opacity={p2}>
        {euro(real)}
      </text>
      <text x={w * 0.68} y={baseY + 40} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={24}>Real (Kaufkraft)</text>
      <text x={w / 2} y={40} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={22}>
        nach {years} Jahren bei {inflationRate}% Inflation
      </text>
    </svg>
  );
};

// ─── YIELDCURVE — Zinssatz nach Laufzeit (typisch ansteigende Kurve) ────────
export const YieldCurve: React.FC<{
  points: { term: string; rate: number }[]; at: number; dur?: number; w?: number; h?: number;
}> = ({ points, at, dur = 90, w = 900, h = 480 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const x0 = 90, x1 = w - 60, y0 = 60, y1 = h - 100;
  const maxRate = Math.max(...points.map((pt) => pt.rate)) * 1.2;
  const xFor = (i: number) => x0 + (i / (points.length - 1)) * (x1 - x0);
  const yFor = (r: number) => y1 - (r / maxRate) * (y1 - y0);
  const N = points.length;
  const curN = Math.max(2, Math.floor(1 + p * (N - 1)));
  const path = points.slice(0, curN).map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(pt.rate)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <path d={path} fill="none" stroke={C.accent} strokeWidth={5}
        style={{ filter: `drop-shadow(0 0 12px ${a(C.accent, 0.5)})` }} />
      {points.slice(0, curN).map((pt, i) => (
        <g key={pt.term}>
          <circle cx={xFor(i)} cy={yFor(pt.rate)} r={9} fill={C.accent} />
          <text x={xFor(i)} y={yFor(pt.rate) - 20} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={26}>
            {pt.rate}%
          </text>
          <text x={xFor(i)} y={y1 + 36} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={22}>{pt.term}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── MARKETCYCLE — Boom-Bust-Psychologie: Euphorie → Panik → Erholung ───────
export const MarketCycle: React.FC<{ at: number; dur?: number; w?: number; h?: number }> = ({
  at, dur = 160, w = 1000, h = 560,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.out);
  const x0 = 60, x1 = w - 60, midY = h / 2;
  const N = 100;
  const curN = Math.max(2, Math.floor(p * N));
  const curve = (t: number) => Math.sin(t * Math.PI * 2 - Math.PI / 2) * 160 + Math.sin(t * Math.PI * 6) * 12;
  const path = Array.from({ length: curN }, (_, i) => {
    const t = i / (N - 1);
    const x = x0 + t * (x1 - x0);
    const y = midY - curve(t);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const labels = [
    { t: 0.12, txt: 'Optimismus', col: C.accent },
    { t: 0.28, txt: 'Euphorie', col: C.gold },
    { t: 0.5, txt: 'Angst', col: C.negativeLt },
    { t: 0.62, txt: 'Panik', col: C.negative },
    { t: 0.85, txt: 'Erholung', col: C.accent },
  ];
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={midY} x2={x1} y2={midY} stroke={a(C.white, 0.1)} strokeWidth={2} strokeDasharray="6 6" />
      <path d={path} fill="none" stroke={C.white} strokeWidth={4} />
      {labels.map((lb) => {
        const shown = p > lb.t;
        const x = x0 + lb.t * (x1 - x0);
        const y = midY - curve(lb.t);
        return shown ? (
          <g key={lb.txt}>
            <circle cx={x} cy={y} r={8} fill={lb.col} style={{ filter: `drop-shadow(0 0 8px ${a(lb.col, 0.6)})` }} />
            <text x={x} y={y - 18} textAnchor="middle" fill={lb.col} fontFamily={FONT.title} fontSize={26}>{lb.txt}</text>
          </g>
        ) : null;
      })}
    </svg>
  );
};

// ─── PRESENTVALUE — Geld heute ist mehr wert als Geld morgen (Barwert) ──────
export const PresentValue: React.FC<{
  amount: number; rate: number; years: number; at: number; dur?: number; w?: number; h?: number;
}> = ({ amount, rate, years, at, dur = 90, w = 900, h = 420 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + dur, E.inOut);
  const pv = amount / Math.pow(1 + rate / 100, years);
  const x0 = 140, x1 = w - 140;
  const x = lerpF(f, x0, x1, at, at + dur, E.inOut);
  const scale = lerpF(f, 1, pv / amount, at, at + dur, E.inOut);
  const size = 90 * scale;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', position: 'relative' }}>
      <line x1={x0} y1={h - 80} x2={x1} y2={h - 80} stroke={a(C.white, 0.15)} strokeWidth={2} />
      <text x={x0} y={h - 40} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={24}>heute</text>
      <text x={x1} y={h - 40} textAnchor="middle" fill={C.gray} fontFamily={FONT.body} fontSize={24}>in {years} Jahren</text>
      <circle cx={x} cy={h - 80 - size} r={size} fill={a(C.gold, 0.18)} stroke={C.gold} strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 20px ${a(C.gold, 0.4)})` }} />
      <text x={x} y={h - 80 - size + 12} textAnchor="middle" fill={C.gold} fontFamily={FONT.title} fontSize={30 * Math.max(scale, 0.6)}>
        {euro(lerpF(f, amount, pv, at, at + dur, E.inOut))}
      </text>
      <text x={w / 2} y={50} textAnchor="middle" fill={C.white} fontFamily={FONT.body} fontSize={24}>
        {euro(amount)} in {years} Jahren ≈ {euro(pv)} heute
      </text>
    </svg>
  );
};
