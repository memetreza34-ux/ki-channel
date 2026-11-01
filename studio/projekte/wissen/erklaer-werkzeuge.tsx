import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {geoInterpolate, geoMercator, geoPath} from 'd3-geo';
import type {GeoPermissibleObjects} from 'd3-geo';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import welt from 'world-atlas/countries-50m.json';
import {AKZENT, BG, HELL, STAHL, clamp, outQuint} from './bausteine';

/**
 * Werkzeuge für Erklärvideos zu jedem Thema – im Denkwürfel-Look:
 * Formel (KaTeX) · Karte (d3-geo, echte Ländergrenzen) · Zeitleiste · Figur (Strichmännchen mit Posen).
 * Beispiele: Composition `Werkzeug-Beispiele` (WerkzeugBeispiele.tsx).
 */

const SPACE = 'Space Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const weich = Easing.inOut(Easing.cubic);

/* ───────────── Formel ───────────── */

let katexBereit = false;

/** Wartet einmal auf die KaTeX-Schriften, damit schon der erste Frame richtig gesetzt ist. */
const useKatexSchriften = () => {
  const [handle] = useState(() => (katexBereit ? null : delayRender('KaTeX-Schriften')));
  useEffect(() => {
    if (!handle) return;
    Promise.all(['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1', 'KaTeX_Size2'].map((f) => document.fonts.load(`40px ${f}`)))
      .catch(() => undefined)
      .then(() => {
        katexBereit = true;
        continueRender(handle);
      });
  }, [handle]);
};

export type FormelSchritt = {tex: string; ab: number};

/**
 * Formel (LaTeX), die sich von links aufdeckt. `\akzent{…}` färbt einen Teil korallrot und lässt ihn bei `pulsAb` pulsieren.
 * Mit `schritte` formt sich die Formel um (z. B. Gleichung lösen): jeder Schritt blendet bei `ab` über.
 */
export const Formel: React.FC<{tex?: string; schritte?: FormelSchritt[]; groesse?: number; aufdecken?: number; pulsAb?: number; farbe?: string}> = ({tex, schritte, groesse = 120, aufdecken = 18, pulsAb, farbe = HELL}) => {
  useKatexSchriften();
  const f = useCurrentFrame();
  const liste = schritte ?? [{tex: tex ?? '', ab: 0}];
  const schluessel = liste.map((s) => s.tex).join('\n');
  const html = useMemo(
    () => liste.map((s) => katex.renderToString(s.tex, {displayMode: true, throwOnError: false, output: 'html', trust: true, strict: false, macros: {'\\akzent': '\\htmlClass{fx-akzent}{#1}'}})),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schluessel],
  );
  const wisch = interpolate(f, [0, aufdecken], [0.3, 1], {...clamp, easing: outQuint});
  const puls = pulsAb !== undefined ? interpolate(f, [pulsAb, pulsAb + 5, pulsAb + 14], [0, 1, 0], clamp) : 0;
  return (
    <div style={{display: 'grid', color: farbe, fontSize: groesse, clipPath: `inset(-30% ${(1 - wisch) * 100}% -30% -5%)`}}>
      <style>{`.fx-akzent{color:${AKZENT};display:inline-block;transform:scale(${1 + puls * 0.12});transform-origin:center bottom}.katex-display{margin:0}`}</style>
      {html.map((h, i) => {
        const ab = liste[i].ab;
        const naechstes = liste[i + 1]?.ab;
        const rein = i === 0 ? 1 : interpolate(f, [ab, ab + 10], [0, 1], {...clamp, easing: outQuint});
        const raus = naechstes === undefined ? 1 : interpolate(f, [naechstes, naechstes + 8], [1, 0], clamp);
        const o = Math.min(rein, raus);
        // Alle Schritte liegen in derselben Grid-Zelle, unsichtbare halten nur den Platz.
        return <div key={i} style={{gridArea: '1 / 1', opacity: Math.max(0, o), transform: `translateY(${(1 - rein) * 18}px)`}} dangerouslySetInnerHTML={{__html: h}} />;
      })}
    </div>
  );
};

/* ───────────── Karte ───────────── */

type LandFeature = GeoJSON.Feature<GeoJSON.Geometry, {name: string}>;
const topo = welt as unknown as Topology<{countries: GeometryCollection<{name: string}>}>;
const LAENDER = (feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection<GeoJSON.Geometry, {name: string}>).features as LandFeature[];

/** Alle Ländernamen der Karte (englisch, Natural Earth), z. B. "Germany", "Czechia", "United States of America". */
export const landNamen = () => LAENDER.map((l) => l.properties.name).sort();

export type Blick = {lon: number; lat: number; zoom: number};
export type KartenLand = {name: string; ab: number; farbe?: string};
export type KartenPunkt = {lon: number; lat: number; label?: string; ab: number; links?: boolean};
export type KartenRoute = {punkte: Array<[number, number]>; ab: number; dauer: number};

/**
 * Flache Karte mit echten Ländergrenzen (Natural Earth 1:50 Mio., gemeinfrei). Kamera fährt von `von` nach `nach`
 * (Zoom 1 = ganze Welt), Länder färben sich bei `ab`, Punkte poppen mit Label, eine Route zeichnet sich als Großkreis.
 */
export const Karte: React.FC<{breite: number; hoehe: number; von: Blick; nach?: Blick; fahrtAb?: number; fahrtDauer?: number; laender?: KartenLand[]; punkte?: KartenPunkt[]; route?: KartenRoute}> = ({breite, hoehe, von, nach, fahrtAb = 0, fahrtDauer = 40, laender = [], punkte = [], route}) => {
  const f = useCurrentFrame();
  const t = nach ? interpolate(f, [fahrtAb, fahrtAb + fahrtDauer], [0, 1], {...clamp, easing: weich}) : 0;
  const ziel = nach ?? von;
  // Zoom logarithmisch mischen, sonst rast die Fahrt am Ende
  const zoom = Math.exp(Math.log(von.zoom) + (Math.log(ziel.zoom) - Math.log(von.zoom)) * t);
  const projektion = geoMercator()
    .center([von.lon + (ziel.lon - von.lon) * t, von.lat + (ziel.lat - von.lat) * t])
    .scale((breite / (2 * Math.PI)) * zoom)
    .translate([breite / 2, hoehe / 2]);
  const pfad = geoPath(projektion);
  const hervor = new Map(laender.map((l) => [l.name, l]));
  const routePunkte = useMemo(() => {
    if (!route) return null;
    const teile: Array<[number, number]> = [];
    for (let i = 0; i < route.punkte.length - 1; i++) {
      const g = geoInterpolate(route.punkte[i], route.punkte[i + 1]);
      for (let k = 0; k <= 40; k++) teile.push(g(k / 40));
    }
    return teile;
  }, [route]);
  const routeT = route ? interpolate(f, [route.ab, route.ab + route.dauer], [0, 1], {...clamp, easing: weich}) : 0;
  const routeLinie = routePunkte && routeT > 0 ? pfad({type: 'LineString', coordinates: routePunkte.slice(0, Math.max(2, Math.round(routePunkte.length * routeT)))} as GeoPermissibleObjects) : null;
  return (
    <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`} style={{overflow: 'hidden', display: 'block'}}>
      <rect width={breite} height={hoehe} fill="#14213D" />
      {LAENDER.map((l, i) => {
        const d = pfad(l);
        if (!d) return null;
        const h = hervor.get(l.properties.name);
        const an = h ? interpolate(f, [h.ab, h.ab + 10], [0, 1], {...clamp, easing: outQuint}) : 0;
        return (
          <g key={i}>
            <path d={d} fill="#4A5878" stroke="#7F8FB0" strokeWidth={0.8} strokeLinejoin="round" />
            {an > 0 ? <path d={d} fill={h?.farbe ?? AKZENT} opacity={an} stroke={BG} strokeWidth={2} strokeLinejoin="round" /> : null}
          </g>
        );
      })}
      {routeLinie ? <path d={routeLinie} fill="none" stroke={AKZENT} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 14" /> : null}
      {punkte.map((p, i) => {
        const xy = projektion([p.lon, p.lat]);
        if (!xy) return null;
        const s = spring({frame: f - p.ab, fps: 30, config: {damping: 14, stiffness: 160}});
        if (s <= 0.01) return null;
        return (
          <g key={i} transform={`translate(${xy[0]} ${xy[1]})`}>
            <circle r={26 * s} fill={AKZENT} opacity={0.25} />
            <circle r={12 * s} fill={AKZENT} stroke={HELL} strokeWidth={4} />
            {p.label ? (
              <text x={p.links ? -30 : 30} y={14} textAnchor={p.links ? 'end' : 'start'} fontFamily={SPACE} fontWeight={700} fontSize={44} fill={HELL} opacity={s} paintOrder="stroke" stroke={BG} strokeWidth={10} strokeLinejoin="round">
                {p.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/* ───────────── Zeitleiste ───────────── */

export type ZeitEintrag = {jahr: number; text: string; zusatz?: string};

/**
 * Senkrechte Zeitleiste mit echten Abständen: Die Linie wächst von `start` bis `ende` (Jahre),
 * liegen Jahre zu dicht, rutscht der Text nach unten (`abstand`). Jeder Eintrag poppt, sobald die Linie sein Jahr erreicht. `hervor` = Index des Höhepunkts (korallrot).
 */
export const Zeitleiste: React.FC<{eintraege: ZeitEintrag[]; start: number; ende: number; top: number; hoehe: number; ab?: number; dauer?: number; hervor?: number; links?: number; abstand?: number}> = ({eintraege, start, ende, top, hoehe, ab = 6, dauer = 90, hervor, links = 100, abstand = 120}) => {
  const f = useCurrentFrame();
  const lauf = (frame: number) => interpolate(frame, [ab, ab + dauer], [0, 1], {...clamp, easing: weich});
  const y = (jahr: number) => top + ((jahr - start) / (ende - start)) * hoehe;
  const kopf = top + lauf(f) * hoehe;
  const LINIE = links + 166;
  const textY: number[] = [];
  eintraege.forEach((e, i) => textY.push(Math.max(y(e.jahr), i > 0 ? textY[i - 1] + abstand : -Infinity)));
  return (
    <>
      <div style={{position: 'absolute', left: LINIE, top, width: 6, height: hoehe, borderRadius: 3, background: '#24314F'}} />
      <div style={{position: 'absolute', left: LINIE, top, width: 6, height: kopf - top, borderRadius: 3, background: HELL}} />
      <div style={{position: 'absolute', left: LINIE - 9, top: kopf - 12, width: 24, height: 24, borderRadius: 12, background: HELL, boxShadow: `0 0 24px ${HELL}`}} />
      {eintraege.map((e, i) => {
        const ey = y(e.jahr);
        // Frame, an dem die Linie dieses Jahr erreicht
        let erreicht = ab + dauer;
        for (let k = 0; k <= dauer; k++) {
          if (top + lauf(ab + k) * hoehe >= ey - 1) {
            erreicht = ab + k;
            break;
          }
        }
        const s = spring({frame: f - erreicht, fps: 30, config: {damping: 16, stiffness: 150}});
        const farbe = i === hervor ? AKZENT : HELL;
        return (
          <React.Fragment key={i}>
            {textY[i] > ey + 2 ? <div style={{position: 'absolute', left: LINIE + 18, top: ey, width: 2, height: textY[i] - ey, background: STAHL, opacity: 0.5 * s}} /> : null}
            <div style={{position: 'absolute', left: links, top: textY[i] - 30, width: 140, textAlign: 'right', fontFamily: INTER, fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: s > 0.05 ? farbe : STAHL, opacity: 0.35 + 0.65 * s}}>
              {e.jahr}
            </div>
            <div style={{position: 'absolute', left: LINIE + 3 - 16 * s, top: ey - 16 * s, width: 32 * s, height: 32 * s, borderRadius: 16, background: farbe, boxShadow: `0 0 0 5px ${BG}`}} />
            <div style={{position: 'absolute', left: LINIE + 54, right: 70, top: textY[i] - 30, opacity: s, transform: `translateX(${(1 - s) * 24}px)`}}>
              <div style={{fontFamily: SPACE, fontWeight: 700, fontSize: 48, lineHeight: 1.05, color: farbe}}>{e.text}</div>
              {e.zusatz ? <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 32, color: STAHL, marginTop: 6}}>{e.zusatz}</div> : null}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/* ───────────── Figur ───────────── */

/**
 * Winkel in Grad: 0 = gerade nach unten, positiv = Richtung rechter Bildrand.
 * Arme/Beine: [Oberarm/-schenkel, Unterarm/-schenkel relativ dazu].
 */
export type Pose = {rumpf: number; kopf: number; armL: [number, number]; armR: [number, number]; beinL: [number, number]; beinR: [number, number]};

export const POSEN = {
  stehen: {rumpf: 0, kopf: 0, armL: [-12, 4], armR: [12, -4], beinL: [-8, 2], beinR: [8, -2]},
  zeigen: {rumpf: 4, kopf: 8, armL: [-14, 6], armR: [100, -8], beinL: [-8, 2], beinR: [10, -2]},
  denken: {rumpf: -2, kopf: -10, armL: [-16, 8], armR: [30, 140], beinL: [-8, 2], beinR: [8, -2]},
  jubeln: {rumpf: 0, kopf: 0, armL: [-125, -25], armR: [125, 25], beinL: [-14, 4], beinR: [14, -4]},
  schulterzucken: {rumpf: 0, kopf: 10, armL: [-55, -95], armR: [55, 95], beinL: [-8, 2], beinR: [8, -2]},
  erschrocken: {rumpf: -6, kopf: -12, armL: [-125, -40], armR: [125, 40], beinL: [-20, 10], beinR: [20, -10]},
} satisfies Record<string, Pose>;

export type PosenName = keyof typeof POSEN;

const mischePose = (a: Pose, b: Pose, t: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * t;
  const m2 = (x: [number, number], y: [number, number]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return {rumpf: m(a.rumpf, b.rumpf), kopf: m(a.kopf, b.kopf), armL: m2(a.armL, b.armL), armR: m2(a.armR, b.armR), beinL: m2(a.beinL, b.beinL), beinR: m2(a.beinR, b.beinR)};
};

const rad = (g: number) => (g * Math.PI) / 180;

/**
 * Strichmännchen im Kanal-Look. Wechselt weich zwischen Posen (`posen: [{pose, ab}]`, 10 Frames Übergang).
 * `gehen` lässt Arme und Beine pendeln, `atmen` (Standard an) hebt den Körper minimal – so wirkt es nie eingefroren.
 */
export const Figur: React.FC<{posen: Array<{pose: PosenName; ab: number}>; groesse?: number; farbe?: string; gehen?: boolean; atmen?: boolean; spiegeln?: boolean}> = ({posen, groesse = 520, farbe = HELL, gehen = false, atmen = true, spiegeln = false}) => {
  const f = useCurrentFrame();
  let pose: Pose = POSEN[posen[0]?.pose ?? 'stehen'];
  for (let i = 1; i < posen.length; i++) {
    const t = interpolate(f, [posen[i].ab, posen[i].ab + 10], [0, 1], {...clamp, easing: outQuint});
    if (t > 0) pose = mischePose(pose, POSEN[posen[i].pose], t);
  }
  if (gehen) {
    const w = Math.sin(f * 0.32) * 24;
    pose = {...pose, beinL: [pose.beinL[0] + w, pose.beinL[1] - Math.max(0, w) * 0.8], beinR: [pose.beinR[0] - w, pose.beinR[1] - Math.max(0, -w) * 0.8], armL: [pose.armL[0] - w * 0.6, pose.armL[1]], armR: [pose.armR[0] + w * 0.6, pose.armR[1]]};
  }
  const hebung = atmen ? Math.sin(f * 0.12) * 2 : 0;
  // Raster 200 × 320, Hüfte bei y 190
  const OBEN = 54;
  const UNTEN = 50;
  const huefte: [number, number] = [100, 188 + hebung];
  const schulter: [number, number] = [huefte[0] + Math.sin(rad(pose.rumpf)) * 88, huefte[1] - Math.cos(rad(pose.rumpf)) * 88];
  const glied = (start: [number, number], winkel: [number, number], basis: number, l1: number, l2: number) => {
    const a1 = rad(basis + winkel[0]);
    const mitte = [start[0] + Math.sin(a1) * l1, start[1] + Math.cos(a1) * l1];
    const a2 = a1 + rad(winkel[1]);
    const ende = [mitte[0] + Math.sin(a2) * l2, mitte[1] + Math.cos(a2) * l2];
    return `M${start[0]},${start[1]} L${mitte[0]},${mitte[1]} L${ende[0]},${ende[1]}`;
  };
  const kopf: [number, number] = [schulter[0] + Math.sin(rad(pose.rumpf + pose.kopf)) * 44, schulter[1] - Math.cos(rad(pose.rumpf + pose.kopf)) * 44];
  return (
    <svg width={groesse * (200 / 320)} height={groesse} viewBox="0 0 200 320" style={{overflow: 'visible', transform: spiegeln ? 'scaleX(-1)' : undefined}}>
      <ellipse cx={100} cy={300} rx={50} ry={7} fill="#000" opacity={0.3} />
      <g stroke={farbe} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={glied(huefte, pose.beinL, 0, OBEN + 4, UNTEN + 6)} />
        <path d={glied(huefte, pose.beinR, 0, OBEN + 4, UNTEN + 6)} />
        <path d={`M${huefte[0]},${huefte[1]} L${schulter[0]},${schulter[1]}`} />
        <path d={glied(schulter, pose.armL, pose.rumpf, OBEN, UNTEN)} />
        <path d={glied(schulter, pose.armR, pose.rumpf, OBEN, UNTEN)} />
      </g>
      <circle cx={kopf[0]} cy={kopf[1]} r={28} fill={BG} stroke={farbe} strokeWidth={12} />
    </svg>
  );
};

/* ───────────── Rangliste über die Zeit (Bump-Chart) ───────────── */

export type RanglistenReihe = {name: string; plaetze: number[]; farbe?: string};

/**
 * Ranglisten-Linien über Jahre: jede Reihe zeichnet sich von links nach rechts, Name sitzt am Linienkopf,
 * oben läuft das Jahr mit. `plaetze[i]` = Platz im Jahr `jahre[i]` (1 = oben). `hervor` = Name in Akzentfarbe.
 */
export const Rangliste: React.FC<{jahre: number[]; reihen: RanglistenReihe[]; links?: number; top?: number; breite?: number; hoehe?: number; ab?: number; dauer?: number; hervor?: string}> = ({jahre, reihen, links = 140, top = 520, breite = 640, hoehe = 760, ab = 6, dauer = 100, hervor}) => {
  const f = useCurrentFrame();
  const lauf = interpolate(f, [ab, ab + dauer], [0, 1], {...clamp, easing: weich});
  const n = jahre.length;
  const plaetze = Math.max(...reihen.flatMap((r) => r.plaetze));
  const x = (i: number) => (i / (n - 1)) * breite;
  const y = (p: number) => ((p - 1) / Math.max(1, plaetze - 1)) * hoehe;
  const pos = lauf * (n - 1);
  const i0 = Math.floor(pos);
  const anteil = pos - i0;
  const jahr = Math.round(jahre[0] + (jahre[n - 1] - jahre[0]) * lauf);
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: top - 190, fontFamily: INTER, fontWeight: 800, fontSize: 72, letterSpacing: '-0.03em', color: HELL, fontVariantNumeric: 'tabular-nums'}}>{jahr}</div>
      <svg width={breite + 300} height={hoehe + 80} style={{position: 'absolute', left: links, top: top - 40, overflow: 'visible'}}>
        {Array.from({length: plaetze}, (_, p) => (
          <text key={p} x={-30} y={y(p + 1) + 12} textAnchor="end" fontFamily={INTER} fontWeight={800} fontSize={34} fill={STAHL}>
            {p + 1}.
          </text>
        ))}
        {reihen.map((r) => {
          const farbe = r.name === hervor ? AKZENT : (r.farbe ?? '#6E7FA6');
          const punkte: Array<[number, number]> = r.plaetze.slice(0, i0 + 1).map((p, i) => [x(i), y(p)]);
          if (i0 < n - 1) {
            const a = r.plaetze[i0];
            const b = r.plaetze[i0 + 1];
            punkte.push([x(i0) + (x(i0 + 1) - x(i0)) * anteil, y(a + (b - a) * weich(anteil))]);
          }
          const d = punkte.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join('');
          const [kx, ky] = punkte[punkte.length - 1];
          return (
            <g key={r.name}>
              <path d={d} fill="none" stroke={farbe} strokeWidth={r.name === hervor ? 10 : 6} strokeLinejoin="round" strokeLinecap="round" opacity={r.name === hervor ? 1 : 0.85} />
              <circle cx={kx} cy={ky} r={r.name === hervor ? 14 : 10} fill={farbe} stroke={BG} strokeWidth={4} />
              <text x={kx + 24} y={ky + 13} fontFamily={SPACE} fontWeight={700} fontSize={38} fill={farbe} paintOrder="stroke" stroke={BG} strokeWidth={8}>
                {r.name}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
};

/* ───────────── Kästchen-Raster ───────────── */

export type RasterPhase = {name: string; farbe: string; ab: number; trifft: (i: number) => boolean};

/**
 * Viele Kästchen (Tage, Wochen, Menschen …), die sich nacheinander einfärben. Phasen färben ihre Kästchen
 * gestaffelt ab `ab` ein (Welle von oben nach unten); die zuletzt erreichte Phase steht als Legende darunter.
 */
export const Raster: React.FC<{anzahl: number; spalten: number; phasen: RasterPhase[]; links?: number; top?: number; breite?: number; luecke?: number; welle?: number; seitenverhaeltnis?: number}> = ({anzahl, spalten, phasen, links = 80, top = 460, breite = 920, luecke = 6, welle = 40, seitenverhaeltnis = 0.6}) => {
  const f = useCurrentFrame();
  const zelle = (breite - luecke * (spalten - 1)) / spalten;
  const zeilen = Math.ceil(anzahl / spalten);
  return (
    <div style={{position: 'absolute', left: links, top, width: breite}}>
      <svg width={breite} height={zeilen * (zelle * seitenverhaeltnis + luecke)} style={{display: 'block'}}>
        {Array.from({length: anzahl}, (_, i) => {
          const sp = i % spalten;
          const ze = Math.floor(i / spalten);
          let farbe = '#1E2A47';
          for (const p of phasen) {
            if (!p.trifft(i)) continue;
            const t = interpolate(f, [p.ab + (ze / zeilen) * welle, p.ab + (ze / zeilen) * welle + 6], [0, 1], clamp);
            if (t > 0.5) farbe = p.farbe;
          }
          return <rect key={i} x={sp * (zelle + luecke)} y={ze * (zelle * seitenverhaeltnis + luecke)} width={zelle} height={zelle * seitenverhaeltnis} rx={4} fill={farbe} />;
        })}
      </svg>
      <div style={{display: 'flex', gap: 28, marginTop: 24, flexWrap: 'wrap'}}>
        {phasen.map((p) => (
          <div key={p.name} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: f >= p.ab ? 1 : 0.25, fontFamily: SPACE, fontWeight: 700, fontSize: 38, color: HELL}}>
            <div style={{width: 28, height: 20, borderRadius: 4, background: p.farbe}} />
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
};
