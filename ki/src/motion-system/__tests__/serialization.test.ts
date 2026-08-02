import {describe, expect, it} from 'vitest';
import {buildMotionScene} from '../runtime';
import {
  parseMotionStoryboardJson,
  parseMotionTimelineJson,
  serializeMotionStoryboard,
  serializeMotionTimeline,
} from '../serialization';
import {buildMotionTimeline} from '../timeline';

describe('Motion-JSON-Serialisierung', () => {
  it('serialisiert und lädt ein Storyboard verlustfrei', () => {
    const storyboard = buildMotionScene({
      sentence: 'Die KI fasst einen Bericht zusammen.',
      elementLabels: {input: 'Bericht', output: 'Kurzfassung'},
    }).storyboard;

    const json = serializeMotionStoryboard(storyboard);
    const parsed = parseMotionStoryboardJson(json);

    expect(parsed).toEqual(storyboard);
    expect(json.endsWith('\n')).toBe(true);
    expect(serializeMotionStoryboard(storyboard)).toBe(json);
  });

  it('serialisiert und lädt eine Timeline mit Qualitätsdaten verlustfrei', () => {
    const timeline = buildMotionTimeline({
      fps: 60,
      gapFrames: 12,
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
        {sentence: 'Der Agent plant und arbeitet autonom weiter.'},
      ],
    });

    const json = serializeMotionTimeline(timeline);
    const parsed = parseMotionTimelineJson(json);

    expect(parsed).toEqual(timeline);
    expect(serializeMotionTimeline(parsed)).toBe(json);
  });

  it('lehnt syntaktisch ungültiges JSON verständlich ab', () => {
    expect(() => parseMotionStoryboardJson('{broken')).toThrow('Ungültiges Motion-JSON');
    expect(() => parseMotionTimelineJson('not-json')).toThrow('Ungültiges Motion-JSON');
  });

  it('lehnt unbekannte Dokumentversionen ab', () => {
    const storyboard = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    }).storyboard;
    const document = JSON.parse(serializeMotionStoryboard(storyboard)) as Record<string, unknown>;
    document.version = 2;

    expect(() => parseMotionStoryboardJson(JSON.stringify(document))).toThrow();
  });

  it('lehnt manipulierte Timeline-Positionen und Gesamtdauern ab', () => {
    const timeline = buildMotionTimeline({
      gapFrames: 10,
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
      ],
    });
    const document = JSON.parse(serializeMotionTimeline(timeline)) as {
      totalDurationInFrames: number;
      scenes: Array<{startFrame: number}>;
    };

    document.scenes[1].startFrame += 1;
    document.totalDurationInFrames += 1;

    expect(() => parseMotionTimelineJson(JSON.stringify(document))).toThrow();
  });

  it('begrenzt die JSON-Einrückung', () => {
    const storyboard = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    }).storyboard;

    expect(() => serializeMotionStoryboard(storyboard, -1)).toThrow('JSON-Einrückung');
    expect(() => serializeMotionStoryboard(storyboard, 9)).toThrow('JSON-Einrückung');
    expect(serializeMotionStoryboard(storyboard, 0)).not.toContain('\n  ');
  });
});
