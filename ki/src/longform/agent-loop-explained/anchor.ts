import {VOICE_WORDS} from './words.generated';

/**
 * Bilder an gesprochene Woerter binden — statt an Frame-Zahlen.
 *
 * Vorher stand in der Kapiteltabelle `{at: 90}` und daneben als Kommentar das
 * Wort, das gemeint war. Die Zahl und der Kommentar konnten auseinanderlaufen,
 * und bei einer neuen Transkription stimmte keine der beiden mehr.
 *
 * Jetzt steht in der Tabelle das Wort selbst:
 *
 *     {on: 'Aktionen', kind: 'chip', text: 'AKTIONEN AUSFÜHREN'}
 *
 * Der Frame wird daraus abgeleitet. Verschiebt sich die Aufnahme, verschiebt
 * sich das Bild mit.
 */

const norm = (value: string): string => value.toLowerCase().replace(/[^a-zäöüß0-9]/gi, '');

/** Vorbereiteter Suchindex — einmal je Modul-Ladung, nicht je Frame. */
const NORMALIZED = VOICE_WORDS.map((w) => norm(w.t));

export type AnchorMiss = {on: string; from: number; to: number};

/** Gesammelte Fehlschlaege, damit ein vertipptes Ankerwort auffaellt. */
export const ANCHOR_MISSES: AnchorMiss[] = [];

/**
 * Frame, an dem `phrase` innerhalb von [from, to) gesprochen wird.
 *
 * `phrase` darf mehrere Woerter haben ("nur eine Antwort"). Gesucht wird die
 * Wortfolge; zurueckgegeben wird der Beginn des ersten Wortes.
 *
 * @param nth 0 = erstes Vorkommen im Bereich, 1 = zweites, ...
 * @returns Frame absolut zum Videostart, oder `null` wenn nicht gefunden.
 */
export const anchorFrame = (phrase: string, from: number, to: number, nth = 0): number | null => {
  const needle = phrase.split(/\s+/).map(norm).filter(Boolean);
  if (needle.length === 0) return null;

  let seen = 0;
  for (let i = 0; i < VOICE_WORDS.length; i++) {
    const start = VOICE_WORDS[i].a;
    if (start < from) continue;
    if (start >= to) break;

    let hit = true;
    for (let j = 0; j < needle.length; j++) {
      const candidate = NORMALIZED[i + j];
      // Teiltreffer zulassen: "Werkzeug" findet auch "Werkzeuge".
      if (candidate === undefined || !candidate.startsWith(needle[j])) {
        hit = false;
        break;
      }
    }
    if (!hit) continue;
    if (seen === nth) return start;
    seen++;
  }

  ANCHOR_MISSES.push({on: phrase, from, to});
  return null;
};

/**
 * Setzt die Anker einer Kapiteltabelle in Frames um.
 *
 * Nicht gefundene Anker fallen nicht still aus: sie bekommen einen Platz nach
 * dem letzten Treffer, damit das Bild sichtbar bleibt und der Fehler beim
 * Ansehen auffaellt, statt ein Element unsichtbar zu machen.
 */
export const resolveAnchors = <T extends {on: string; nth?: number}>(
  items: T[],
  chapterStart: number,
  chapterEnd: number
): (Omit<T, 'on' | 'nth'> & {at: number; on: string})[] => {
  let fallback = 30;
  return items.map((item) => {
    const absolute = anchorFrame(item.on, chapterStart, chapterEnd, item.nth ?? 0);
    const at = absolute === null ? fallback : absolute - chapterStart;
    fallback = Math.max(fallback + 45, at + 45);
    const {on, nth, ...rest} = item as T & {on: string; nth?: number};
    return {...(rest as Omit<T, 'on' | 'nth'>), at, on};
  });
};
