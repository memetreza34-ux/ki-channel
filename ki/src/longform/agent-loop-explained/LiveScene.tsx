import React from 'react';
import {useCurrentFrame} from 'remotion';
import {E, MARGIN, prog} from '@studio/core';
import {
  Ablauf, Chat, Dateien, Ergebnis, Fehlerkette, Fortschritt, Freigabe, Gegenueber,
  Log, Loop, Quelle, Suche, System, Werkzeuge, Zahl, type Tone,
} from './panels';

/**
 * Die Szene eines Kapitels.
 *
 * Aufgabe dieser Datei: die Flaechen aus `panels.tsx` zum richtigen Zeitpunkt
 * an den richtigen Platz stellen. Alles andere kommt aus `@studio/core` —
 * Raster-Mass (`MARGIN`), Easing (`E`) und Fortschritt (`prog`).
 *
 * Aufbau eines Kapitels:
 *   Tafel (`phase`) — eine Gruppe Flaechen, die zusammen gehoeren.
 *                     Beginnt die naechste Tafel, faehrt diese nach oben raus.
 *   Zeile (`row`)   — bis zu drei Spalten breit (`span`), Flaechen ruecken zusammen.
 *
 * Die Zeitpunkte stehen nicht hier: jede Flaeche haengt an dem Wort, das sie
 * erklaert (`on`), aufgeloest in `anchor.ts`.
 */

/** Was auf einer Flaeche zu sehen ist. */
export type PanelSpec =
  | {typ: 'chat'; frage: string; zeilen?: number; wartet?: boolean}
  | {typ: 'log'; schritte: string[]; titel?: string; proSchritt?: number}
  | {typ: 'dateien'; dateien: {name: string; groesse?: string; status?: 'ok' | 'konflikt'}[]; titel?: string}
  | {typ: 'suche'; anfrage: string; treffer: string[]}
  | {typ: 'gegenueber'; links: {titel: string; wert: string; zusatz?: string}; rechts: {titel: string; wert: string; zusatz?: string}; fazit?: string}
  | {typ: 'werkzeuge'; werkzeuge: {name: string; icon: string; an: boolean; hinweis?: string}[]; titel?: string}
  | {typ: 'fortschritt'; eintraege: {text: string; fertig: boolean}[]; titel?: string}
  | {typ: 'ergebnis'; titel: string; zeilen: string[]; geprueft?: boolean}
  | {typ: 'loop'; zustaende: string[]; proZustand?: number}
  | {typ: 'freigabe'; aktion: string; warnung?: string}
  | {typ: 'system'; kern: string; teile: {name: string; icon: string}[]}
  | {typ: 'zahl'; wert: number; label: string; suffix?: string; icon?: string}
  | {typ: 'ablauf'; schritte: string[]; offen?: boolean; titel?: string}
  | {typ: 'fehlerkette'; schritte: string[]; proSchritt?: number}
  | {typ: 'quelle'; quelle: string; harmlos: string[]; eingebettet: string};

/** Eine Flaeche im Kapitel, gebunden an ein gesprochenes Wort. */
export type LiveItem = {
  /** Das Wort, auf dem die Flaeche erscheint (siehe anchor.ts). */
  on: string;
  /** Welches Vorkommen des Wortes, falls es mehrfach faellt. */
  nth?: number;
  col: number;
  row: number;
  /** Spaltenbreite, 1 bis 3. */
  span?: number;
  /** Tafel innerhalb des Kapitels. */
  phase?: number;
  tone?: Tone;
  panel: PanelSpec;
};

/** Dieselbe Flaeche, nachdem ihr Ankerwort in einen Frame aufgeloest wurde. */
export type PlacedItem = Omit<LiveItem, 'on' | 'nth'> & {at: number; on: string};

/* ── Raster ─────────────────────────────────────────────────────────── */

const GAP = 28;
const BREITE = 1920 - MARGIN * 2;
const SPALTE = (BREITE - GAP * 2) / 3;

/** Erlaubte Breite fuer eine Flaeche ueber `span` Spalten. */
const breite = (span = 1) => {
  const s = Math.min(3, Math.max(1, span));
  return s * SPALTE + (s - 1) * GAP;
};

const zeichne = (spec: PanelSpec, at: number, width: number, tone: Tone): React.ReactNode => {
  const g = {at, width, tone};
  switch (spec.typ) {
    case 'chat': return <Chat {...g} frage={spec.frage} zeilen={spec.zeilen} wartet={spec.wartet} />;
    case 'log': return <Log {...g} schritte={spec.schritte} titel={spec.titel} proSchritt={spec.proSchritt} />;
    case 'dateien': return <Dateien {...g} dateien={spec.dateien} titel={spec.titel} />;
    case 'suche': return <Suche {...g} anfrage={spec.anfrage} treffer={spec.treffer} />;
    case 'gegenueber': return <Gegenueber {...g} links={spec.links} rechts={spec.rechts} fazit={spec.fazit} />;
    case 'werkzeuge': return <Werkzeuge {...g} werkzeuge={spec.werkzeuge} titel={spec.titel} />;
    case 'fortschritt': return <Fortschritt {...g} eintraege={spec.eintraege} titel={spec.titel} />;
    case 'ergebnis': return <Ergebnis {...g} titel={spec.titel} zeilen={spec.zeilen} geprueft={spec.geprueft} />;
    case 'loop': return <Loop {...g} zustaende={spec.zustaende} proZustand={spec.proZustand} />;
    case 'freigabe': return <Freigabe {...g} aktion={spec.aktion} warnung={spec.warnung} />;
    case 'system': return <System {...g} kern={spec.kern} teile={spec.teile} />;
    case 'zahl': return <Zahl {...g} wert={spec.wert} label={spec.label} suffix={spec.suffix} icon={spec.icon} />;
    case 'ablauf': return <Ablauf {...g} schritte={spec.schritte} offen={spec.offen} titel={spec.titel} />;
    case 'fehlerkette': return <Fehlerkette {...g} schritte={spec.schritte} proSchritt={spec.proSchritt} />;
    case 'quelle': return <Quelle {...g} quelle={spec.quelle} harmlos={spec.harmlos} eingebettet={spec.eingebettet} />;
  }
};

/* ── Tafel ──────────────────────────────────────────────────────────── */

/**
 * Alle Flaechen einer Tafel.
 *
 * Sie stehen von Anfang an im Layout, auch die noch ungesprochenen — nur
 * sichtbar sind sie noch nicht. Dadurch bleibt die Anordnung stehen, wenn eine
 * Flaeche dazukommt, statt bei jedem Auftritt umzuspringen.
 */
const Tafel: React.FC<{
  items: PlacedItem[];
  /** Frame, ab dem die naechste Tafel uebernimmt. */
  raeumtAb: number | null;
  /** Frame, ab dem diese Tafel ganz weg ist. */
  wegAb: number | null;
}> = ({items, raeumtAb, wegAb}) => {
  const f = useCurrentFrame();
  const raus = raeumtAb === null ? 0 : prog(f, raeumtAb - 14, raeumtAb + 8, E.out);
  const weg = wegAb === null ? 0 : prog(f, wegAb - 14, wegAb, E.out);
  if (weg >= 1) return null;

  const zeilen = [...new Set(items.map((i) => i.row))].sort((a, b) => a - b);

  return (
    <div
      style={{
        position: 'absolute',
        left: MARGIN, right: MARGIN, top: 232, height: 776,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        gap: zeilen.length > 2 ? 30 : 48,
        opacity: (1 - raus) * (1 - weg),
        translate: `0px ${raus * -300}px`,
      }}
    >
      {zeilen.map((row) => (
        <div key={row} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: GAP, width: '100%', flexWrap: 'wrap',
        }}>
          {items
            .filter((i) => i.row === row)
            .sort((a, b) => a.col - b.col)
            .map((item) => (
              <div key={`${item.on}-${item.at}-${item.col}`}>
                {zeichne(item.panel, item.at, breite(item.span), item.tone ?? 'on')}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export const LiveScene: React.FC<{items: PlacedItem[]}> = ({items}) => {
  const nachPhase = new Map<number, PlacedItem[]>();
  items.forEach((item) => {
    const p = item.phase ?? 0;
    if (!nachPhase.has(p)) nachPhase.set(p, []);
    nachPhase.get(p)!.push(item);
  });

  /** Wann beginnt eine Tafel? Das ist der frueheste Auftritt in ihr. */
  const beginn = new Map<number, number>();
  nachPhase.forEach((gruppe, phase) => {
    beginn.set(phase, Math.min(...gruppe.map((i) => i.at)));
  });

  const phasen = [...nachPhase.keys()].sort((a, b) => a - b);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {phasen.map((phase) => (
        <Tafel
          key={phase}
          items={nachPhase.get(phase)!}
          raeumtAb={beginn.get(phase + 1) ?? null}
          wegAb={beginn.get(phase + 2) ?? null}
        />
      ))}
    </div>
  );
};
