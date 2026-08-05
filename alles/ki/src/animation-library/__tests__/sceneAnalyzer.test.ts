import {describe, expect, it} from 'vitest';
import {
  analyzeSceneForAnimation,
  analyzeScenesForAnimation,
} from '../sceneAnalyzer';

describe('scene animation analyzer', () => {
  it('recognizes tokens, probability, security, and performance sentences', () => {
    const analyses = analyzeScenesForAnimation([
      {sceneId: 'tokens', spokenText: 'Die KI zerlegt den Text zuerst in kleine Tokens.'},
      {sceneId: 'probability', spokenText: 'Dann berechnet sie das wahrscheinlichste nächste Wort.'},
      {sceneId: 'security', spokenText: 'Private Daten werden verschlüsselt und nur mit Berechtigung geöffnet.'},
      {sceneId: 'performance', spokenText: 'Unter hoher Last steigt die Latenz und die Kapazität wird zum Engpass.'},
    ]);

    expect(analyses.map((analysis) => analysis.preferredVisualFamilies[0])).toEqual([
      'tokenization',
      'probability',
      'security-privacy',
      'scale-performance',
    ]);
  });

  it('returns explainable matches and a planner-ready brief', () => {
    const analysis = analyzeSceneForAnimation({
      sceneId: 'scene-1',
      spokenText: 'Die Suche findet passende Dokumente und zieht drei Belege heraus.',
    });

    expect(analysis.preferredVisualFamilies[0]).toBe('retrieval-search');
    expect(analysis.familyScores[0].matchedTerms).toEqual(
      expect.arrayContaining(['suche', 'dokumente', 'belege']),
    );
    expect(analysis.brief.sceneId).toBe('scene-1');
    expect(analysis.brief.semanticTags.length).toBeGreaterThanOrEqual(2);
    expect(analysis.brief.preferredEnergy).toBe('dynamic');
  });

  it('requires a new animation when no family receives enough evidence', () => {
    const analysis = analyzeSceneForAnimation({
      sceneId: 'scene-unknown',
      spokenText: 'Eine ungewöhnliche visuelle Metapher entsteht.',
    });

    expect(analysis.mustBeNew).toBe(true);
    expect(analysis.semanticTags.length).toBeGreaterThanOrEqual(2);
  });

  it('supports explicit new-animation requests', () => {
    expect(
      analyzeSceneForAnimation({
        sceneId: 'scene-forced',
        spokenText: 'Zwei Modelle werden anhand ihrer Kosten verglichen.',
        forceNewAnimation: true,
      }).mustBeNew,
    ).toBe(true);
  });

  it('rejects empty identifiers and text', () => {
    expect(() =>
      analyzeSceneForAnimation({sceneId: '', spokenText: 'Text'}),
    ).toThrow(/sceneId/);
    expect(() =>
      analyzeSceneForAnimation({sceneId: 'scene', spokenText: '   '}),
    ).toThrow(/spokenText/);
  });
});
