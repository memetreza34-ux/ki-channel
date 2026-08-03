import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {buildMotionScene} from '../runtime';

const showFrame = (
  storyboard: ReturnType<typeof buildMotionScene>['storyboard'],
  targetId: string,
) => storyboard.beats.find(
  (beat) => beat.targetId === targetId && beat.action === 'show',
)?.atFrame;

describe('Explizite Audio-Keywords', () => {
  it('synchronisiert angepasste sichtbare Labels über gesprochene Aliasbegriffe', () => {
    const result = buildMotionScene({
      sentence: 'Die KI nutzt Dateien.',
      elementLabels: {files: 'Dokumente'},
      audioKeywords: {files: ['Dateien']},
      words: [
        {text: 'Die', startMs: 0, endMs: 100},
        {text: 'KI', startMs: 200, endMs: 350},
        {text: 'nutzt', startMs: 500, endMs: 650},
        {text: 'Dateien', startMs: 1000, endMs: 1250},
      ],
    });

    expect(
      result.storyboard.elements.find((element) => element.id === 'files')?.label,
    ).toBe('Dokumente');
    expect(showFrame(result.storyboard, 'files')).toBe(30);
  });

  it('bevorzugt explizite Keywords vor einem später gesprochenen sichtbaren Label', () => {
    const base = buildMotionScene({
      sentence: 'Die KI nutzt Dateien.',
      elementLabels: {files: 'Dokumente'},
    }).storyboard;
    const aligned = alignStoryboardToWords(
      base,
      [
        {text: 'Dateien', startMs: 1000, endMs: 1200},
        {text: 'Dokumente', startMs: 2000, endMs: 2300},
      ],
      30,
      {elementKeywords: {files: ['Dateien']}},
    );

    expect(showFrame(aligned, 'files')).toBe(30);
  });

  it('entfernt doppelte Keywords nach Normalisierung', () => {
    const base = buildMotionScene({sentence: 'Die KI nutzt Dateien.'}).storyboard;
    const aligned = alignStoryboardToWords(
      base,
      [{text: 'Dateien', startMs: 1000, endMs: 1200}],
      30,
      {elementKeywords: {files: [' Dateien ', 'dateien', 'DATEIEN']}},
    );

    expect(showFrame(aligned, 'files')).toBe(30);
  });

  it('lehnt unbekannte Element-IDs und ungültige Keywordlisten ab', () => {
    const base = buildMotionScene({sentence: 'Die KI nutzt Dateien.'}).storyboard;
    const words = [{text: 'Dateien', startMs: 1000, endMs: 1200}];

    expect(() =>
      alignStoryboardToWords(base, words, 30, {
        elementKeywords: {unknown: ['Dateien']},
      }),
    ).toThrow('Unbekannte Element-IDs für Audio-Keywords');

    expect(() =>
      alignStoryboardToWords(base, words, 30, {
        elementKeywords: {files: ['   ']},
      }),
    ).toThrow('darf nicht leer sein');

    expect(() =>
      alignStoryboardToWords(base, words, 30, {
        elementKeywords: {files: Array.from({length: 9}, (_, index) => `Wort ${index}`)},
      }),
    ).toThrow('höchstens 8 Einträge');

    expect(() =>
      alignStoryboardToWords(base, words, 30, {
        elementKeywords: {files: ['x'.repeat(65)]},
      }),
    ).toThrow('höchstens 64 Zeichen');
  });

  it('validiert die Keywordkonfiguration auch ohne Wort-Timestamps', () => {
    expect(() =>
      buildMotionScene({
        sentence: 'Die KI nutzt Dateien.',
        audioKeywords: {unknown: ['Dateien']},
      }),
    ).toThrow('Unbekannte Element-IDs für Audio-Keywords');

    const result = buildMotionScene({
      sentence: 'Die KI nutzt Dateien.',
      audioKeywords: {files: ['Dateien']},
    });
    expect(result.quality.passed).toBe(true);
  });

  it('verändert Storyboard, Wortliste und Keywordkonfiguration nicht', () => {
    const base = buildMotionScene({sentence: 'Die KI nutzt Dateien.'}).storyboard;
    const words = [{text: 'Dateien', startMs: 1000, endMs: 1200}];
    const elementKeywords = {files: ['Dateien']};
    const baseSnapshot = structuredClone(base);
    const wordsSnapshot = structuredClone(words);
    const keywordSnapshot = structuredClone(elementKeywords);

    alignStoryboardToWords(base, words, 30, {elementKeywords});

    expect(base).toEqual(baseSnapshot);
    expect(words).toEqual(wordsSnapshot);
    expect(elementKeywords).toEqual(keywordSnapshot);
  });
});
