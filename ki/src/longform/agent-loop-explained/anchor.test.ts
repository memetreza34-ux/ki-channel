import {describe, expect, it} from 'vitest';
import {anchorFrame} from './anchor';
import {CHAPTER_SCENES} from './chapterScenes';
import {AGENT_LOOP_CHAPTERS} from './contract';
import {VOICE_WORDS} from './words.generated';

/**
 * Der Vertrag zwischen Bild und Stimme.
 *
 * Frueher stand in der Kapiteltabelle eine Framezahl und daneben als Kommentar
 * das gemeinte Wort. Lief beides auseinander, fiel das erst beim Ansehen des
 * fertigen Videos auf — oder gar nicht. Diese Tests pruefen stattdessen, dass
 * jedes Bild ein Wort hat, das im richtigen Kapitel wirklich gesprochen wird.
 */
describe('Bilder haengen an gesprochenen Woertern', () => {
  it('hat eine Transkription mit Wort-Timestamps', () => {
    expect(VOICE_WORDS.length).toBeGreaterThan(600);
    VOICE_WORDS.forEach((word) => {
      expect(word.b).toBeGreaterThanOrEqual(word.a);
    });
  });

  it('laeuft chronologisch', () => {
    VOICE_WORDS.slice(1).forEach((word, i) => {
      expect(word.a).toBeGreaterThanOrEqual(VOICE_WORDS[i].a);
    });
  });

  it('findet jedes Ankerwort im eigenen Kapitel', () => {
    const misses: string[] = [];
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      items.forEach((item) => {
        const at = anchorFrame(item.on, chapter.startFrame, chapter.endFrame, item.nth ?? 0);
        if (at === null) misses.push(`${chapter.id}: "${item.on}"`);
      });
    });
    expect(misses).toEqual([]);
  });

  it('haelt die Bilder eines Kapitels in der geplanten Reihenfolge', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      const frames = items.map((item) =>
        anchorFrame(item.on, chapter.startFrame, chapter.endFrame, item.nth ?? 0)
      );
      // Phasen duerfen sich nicht ueberholen: eine spaetere Phase darf nicht
      // vor einer frueheren beginnen, sonst raeumt die Szene in die falsche
      // Richtung ab.
      const firstOfPhase = new Map<number, number>();
      items.forEach((item, i) => {
        const frame = frames[i];
        if (frame === null) return;
        const phase = item.phase ?? 0;
        const known = firstOfPhase.get(phase);
        if (known === undefined || frame < known) firstOfPhase.set(phase, frame);
      });
      const phases = [...firstOfPhase.entries()].sort((a, b) => a[0] - b[0]);
      phases.slice(1).forEach(([phase, start], i) => {
        expect(
          start,
          `${chapter.id}: Phase ${phase} beginnt vor Phase ${phases[i][0]}`
        ).toBeGreaterThan(phases[i][1]);
      });
    });
  });

  it('legt kein Bild hinter das Kapitelende', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      items.forEach((item) => {
        const at = anchorFrame(item.on, chapter.startFrame, chapter.endFrame, item.nth ?? 0);
        if (at === null) return;
        expect(at).toBeLessThan(chapter.endFrame);
        expect(at).toBeGreaterThanOrEqual(chapter.startFrame);
      });
    });
  });

  /**
   * Ein Kapitel darf nicht mit einem leeren Bild anfangen. Vor dieser Regel
   * blieb „Ein konkretes Beispiel" 5,8 Sekunden lang weiss, weil das erste
   * Bild erst am Wort „Entscheidungsvorlage" haengt — mitten im zweiten Satz.
   */
  it('faengt jedes Kapitel ohne langes Leerbild an', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      const first = Math.min(
        ...items
          .map((item) => anchorFrame(item.on, chapter.startFrame, chapter.endFrame, item.nth ?? 0))
          .filter((at): at is number => at !== null)
      );
      const seconds = (first - chapter.startFrame) / 30;
      expect(seconds, `${chapter.id}: ${seconds.toFixed(1)}s leer am Kapitelanfang`).toBeLessThan(2.6);
    });
  });

  /**
   * Und es darf innerhalb eines Kapitels keine lange Strecke ohne neues Bild
   * geben — genau das war die Kritik an der ersten Fassung.
   */
  it('laesst nirgends zu lange nichts passieren', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      const frames = items
        .map((item) => anchorFrame(item.on, chapter.startFrame, chapter.endFrame, item.nth ?? 0))
        .filter((at): at is number => at !== null)
        .sort((a, b) => a - b);
      frames.forEach((frame, i) => {
        const next = frames[i + 1] ?? chapter.endFrame;
        const seconds = (next - frame) / 30;
        expect(seconds, `${chapter.id}: ${seconds.toFixed(1)}s ohne neues Bild ab Frame ${frame}`).toBeLessThan(9);
      });
    });
  });

  /**
   * Eine Zeile hat drei Rasterspalten. Passen die Bilder einer Zeile nicht
   * hinein, bricht der Flex-Container sie um — und die umgebrochene Zeile legt
   * sich ueber die naechste. Genau so ueberlappten in der ersten Fassung die
   * Bausteinkarten mit dem Grenzen-Block.
   */
  it('ueberfuellt keine Zeile', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      const used = new Map<string, number>();
      items.forEach((item) => {
        const key = `Phase ${item.phase ?? 0}, Zeile ${item.row}`;
        used.set(key, (used.get(key) ?? 0) + (item.span ?? 1));
      });
      used.forEach((span, key) => {
        expect(span, `${chapter.id} — ${key}: ${span} Spalten`).toBeLessThanOrEqual(3);
      });
    });
  });

  /** Mehr als drei Zeilen je Tafel passen nicht in die Flaeche. */
  it('haelt jede Tafel bei hoechstens drei Zeilen', () => {
    AGENT_LOOP_CHAPTERS.forEach((chapter) => {
      const items = CHAPTER_SCENES[chapter.id];
      if (!items) return;
      const rowsPerPhase = new Map<number, Set<number>>();
      items.forEach((item) => {
        const phase = item.phase ?? 0;
        if (!rowsPerPhase.has(phase)) rowsPerPhase.set(phase, new Set());
        rowsPerPhase.get(phase)!.add(item.row);
      });
      rowsPerPhase.forEach((rows, phase) => {
        expect(rows.size, `${chapter.id} Phase ${phase}: ${rows.size} Zeilen`).toBeLessThanOrEqual(3);
      });
    });
  });
});
