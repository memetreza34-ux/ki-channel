import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {MOTION_BEAT_FRAMES, MOTION_DURATION, MOTION_HOLD_FRAMES} from '../easing';

/**
 * Maschinelle Pruefung der Bewegungssprache aus ki/gehirn/BEWEGUNG.md.
 *
 * Eine Regel, die nur in einem Dokument steht, rutscht beim naechsten Umbau
 * wieder raus. Diese Datei prueft die Teile, die pruefbar sind.
 */

const PRODUCTION_DIRS = [
  'ki/src/animation-library/prototypes',
  'ki/src/motion-system/components',
];

const productionSources = (): {path: string; source: string}[] =>
  PRODUCTION_DIRS.flatMap((dir) =>
    readdirSync(dir)
      .filter((name) => name.endsWith('.tsx'))
      .map((name) => ({
        path: join(dir, name),
        source: readFileSync(join(dir, name), 'utf8'),
      })),
  );


/**
 * Zaehlt frame-basierte interpolate-Aufrufe ohne Easing-Kurve.
 *
 * Wertbasierte Remaps wie interpolate(progress, [0, 1], [24, 0]) sitzen bereits
 * auf einer geeasten Zeitachse und bleiben bewusst linear.
 */
const uneasedFrameInterpolations = (source: string): number => {
  let offenders = 0;
  const needle = 'interpolate(';

  for (let at = source.indexOf(needle); at >= 0; at = source.indexOf(needle, at + 1)) {
    let depth = 0;
    let end = at + needle.length - 1;
    for (; end < source.length; end += 1) {
      if (source[end] === '(') depth += 1;
      else if (source[end] === ')') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const call = source.slice(at, end + 1);
    const firstArgument = call.slice(needle.length).trimStart();
    if (!/^frame\s*,/.test(firstArgument)) continue;
    if (call.includes('easing:')) continue;
    offenders += 1;
  }

  return offenders;
};

describe('Bewegungssprache', () => {
  it('haelt die Dauernskala als Vielfache des Grundtakts', () => {
    expect(MOTION_BEAT_FRAMES).toBe(12);
    expect(MOTION_DURATION.standard).toBe(MOTION_BEAT_FRAMES);
    expect(MOTION_DURATION.micro * 2).toBe(MOTION_BEAT_FRAMES);
    expect(MOTION_DURATION.hero).toBe(MOTION_BEAT_FRAMES * 2);
    expect(MOTION_HOLD_FRAMES).toBeGreaterThan(0);
  });

  it('nutzt die Corporate-Signaturkurve als Standard', () => {
    const source = readFileSync('ki/src/motion/easing.ts', 'utf8');
    expect(source).toContain('enter: Easing.bezier(0.2, 0, 0, 1)');
  });

  it('sperrt den Ueberschwinger im Produktionscode', () => {
    const offenders = productionSources()
      .filter(({source}) => /['"]pop['"]/.test(source))
      .map(({path}) => path);

    // Ueberschwinger liest sich als Spielzeug und widerspricht dem
    // Kanalversprechen "keine Fake-Wunder".
    expect(offenders).toEqual([]);
  });

  it('laesst keine rohe lineare Zeitachse zurueck', () => {
    const offenders = productionSources()
      .filter(({source}) => uneasedFrameInterpolations(source) > 0)
      .map(({path}) => path);

    // interpolate(frame, ...) ohne Easing-Kurve ist lineare Bewegung.
    // Zeitachsen laufen ueber easedProgress beziehungsweise prototypeProgress -
    // oder tragen, wie mehrstufige Zaehlwerte, eine ausdrueckliche Kurve.
    expect(offenders).toEqual([]);
  });

  it('deckelt jede Staffelung', () => {
    const offenders = productionSources()
      .filter(({source}) =>
        /(?:prototypeProgress|easedProgress|prog|phase|p)\(\s*frame,\s*\d+\s*\+\s*index\s*\*\s*\d+/.test(
          source,
        ),
      )
      .map(({path}) => path);

    // Handgerollte Versaetze haben keine Obergrenze: bei langen Listen
    // schleppt der Schwanz laenger als die Aussage dauert.
    expect(offenders).toEqual([]);
  });

  it('haelt die Bewegungssprache im Gehirn fest', () => {
    const doc = readFileSync('ki/gehirn/BEWEGUNG.md', 'utf8');
    expect(doc).toContain('Corporate');
    expect(doc).toContain('cubic-bezier(0.2, 0, 0, 1)');
    expect(doc).toContain(`${MOTION_BEAT_FRAMES} Frames`);
  });
});
