import {describe, expect, it} from 'vitest';
import {
  durationForDistance,
  easedProgress,
  followThrough,
  MOTION_EASING,
  staggerDelay,
} from '../easing';

describe('easedProgress', () => {
  it('klemmt sauber an beiden Enden', () => {
    expect(easedProgress(-10, 0, 20)).toBe(0);
    expect(easedProgress(0, 0, 20)).toBe(0);
    expect(easedProgress(20, 0, 20)).toBe(1);
    expect(easedProgress(500, 0, 20)).toBe(1);
  });

  it('ist bei "enter" nicht linear, sondern vorne schneller', () => {
    const mid = easedProgress(10, 0, 20, 'enter');
    expect(mid).toBeGreaterThan(0.5);
  });

  it('ist bei "exit" vorne langsamer als linear', () => {
    const mid = easedProgress(10, 0, 20, 'exit');
    expect(mid).toBeLessThan(0.5);
  });

  it('liefert fuer "loop" exakt lineares Verhalten', () => {
    expect(easedProgress(10, 0, 20, 'loop')).toBeCloseTo(0.5, 5);
  });

  it('bleibt monoton steigend', () => {
    let previous = -1;
    for (let frame = 0; frame <= 20; frame += 1) {
      const value = easedProgress(frame, 0, 20);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('faellt bei entarteter Spanne nicht auseinander', () => {
    expect(easedProgress(5, 10, 10)).toBe(0);
    expect(easedProgress(11, 10, 10)).toBe(1);
  });

  it('haelt "pop" als einzige Kurve einen Ueberschwinger bereit', () => {
    const values = Array.from({length: 21}, (_, frame) =>
      easedProgress(frame, 0, 20, 'pop'),
    );
    expect(Math.max(...values)).toBeGreaterThan(1);
  });

  it('kennt fuer jede benannte Kurve eine Funktion', () => {
    for (const curve of Object.values(MOTION_EASING)) {
      expect(typeof curve).toBe('function');
    }
  });
});

describe('staggerDelay', () => {
  it('startet das erste Element ohne Verzoegerung', () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it('staffelt kleine Gruppen mit vollem Versatz', () => {
    expect(staggerDelay(1, 3, 21)).toBe(3);
    expect(staggerDelay(2, 3, 21)).toBe(6);
  });

  it('deckelt die Gesamtdauer bei grossen Gruppen', () => {
    expect(staggerDelay(20, 3, 21)).toBeLessThanOrEqual(21);
  });
});

describe('durationForDistance', () => {
  it('gibt langen Wegen mehr Zeit, aber unterproportional', () => {
    const short = durationForDistance(20, 200, 200);
    const long = durationForDistance(20, 800, 200);
    expect(short).toBe(20);
    expect(long).toBeGreaterThan(short);
    expect(long).toBeLessThan(short * 4);
  });

  it('faellt nie unter einen Frame', () => {
    expect(durationForDistance(1, 0, 200)).toBeGreaterThanOrEqual(1);
  });
});

describe('followThrough', () => {
  it('laesst angehaengte Ebenen spaeter zur Ruhe kommen', () => {
    expect(followThrough(30, 0)).toBe(30);
    expect(followThrough(30, 1)).toBeGreaterThan(30);
    expect(followThrough(30, 2)).toBeGreaterThan(followThrough(30, 1));
  });
});
