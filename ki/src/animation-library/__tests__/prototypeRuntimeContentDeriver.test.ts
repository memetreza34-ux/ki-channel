import {describe, expect, it} from 'vitest';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import {
  derivePrototypeRuntimeContent,
  PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS,
} from '../prototypeRuntimeContentDeriver';
import {PRODUCTION_READY_LIBRARY_ANIMATION_IDS} from '../productionEligibility';

const derive = (animationId: string, spokenText: string) =>
  derivePrototypeRuntimeContent({
    animationId,
    spokenText,
    meaningContract: enhanceSceneMeaning(spokenText),
  });

const REQUIRED_RUNTIME_KEYS: Record<string, string[]> = {
  'retrieval-search-knowledge-magnet-v1': ['query', 'source1', 'evidenceCount'],
  'cost-efficiency-budget-leak-meter-v1': ['leak1', 'meterLabel'],
  'context-window-context-window-train-v1': ['message1', 'capacity', 'pinnedIndex'],
  'decision-logic-decision-tree-burst-v1': ['question', 'branch1', 'branch1Valid'],
  'human-ai-collaboration-human-ai-relay-v1': ['stage1', 'taskLabel', 'resultText'],
  'learning-update-knowledge-tree-graft-v1': ['newInformation', 'confidence', 'verificationThreshold'],
  'tokenization-magnetic-phrase-slicer-v1': ['lanePrimary', 'laneMeaning', 'laneContext'],
  'data-transformation-vector-prism-converter-v1': ['input', 'dimension1', 'vector1'],
  'ranking-dynamic-podium-rise-v1': ['candidate1', 'criterion1', 'candidate1End'],
  'process-flow-subway-workflow-map-v1': ['station1', 'resultText', 'showAlternative'],
  'input-output-funnel-compression-output-v1': ['input1', 'outputTitle', 'input1Keep'],
  'error-detection-anomaly-xray-scanner-v1': ['step1', 'isolatedText', 'errorStep'],
  'semantic-space-meaning-terrain-v1': ['concept1', 'cluster1', 'concept1Cluster'],
  'relationship-network-dependency-bridge-builder-v1': ['node1', 'strongRelationship', 'weight12'],
  'probability-probability-fluid-columns-v1': ['candidate1', 'signal1', 'candidate1End'],
  'model-processing-residual-river-v1': ['inputLabel', 'layer1', 'outputValue'],
  'generation-answer-loom-v1': ['thread1', 'answer'],
  'risk-contrast-confidence-glass-crack-v1': ['claim', 'check1', 'confidence'],
  'security-privacy-encryption-vault-layers-v1': ['dataLabel', 'securityLayer1', 'resultText'],
  'scale-performance-latency-tunnel-race-v1': ['slowPath', 'fastPath', 'slowLatency'],
  'time-change-timeline-microscope-v1': ['milestone1', 'change1'],
  'comparison-benchmark-racetrack-v1': ['competitor1', 'metric1', 'competitor1Final'],
};

const SAMPLE_TEXT: Record<string, string> = {
  'retrieval-search-knowledge-magnet-v1': 'Die Suche prüft Studie, Fachbericht und Kommentar und zieht nur relevante Belege heran.',
  'cost-efficiency-budget-leak-meter-v1': 'Der Prompt kostet zuerst 94 Cent und nach weniger Kontext nur noch 28 Cent.',
  'context-window-context-window-train-v1': 'Vier Nachrichten passen in den Kontext, während die wichtigste Regel angeheftet bleibt.',
  'decision-logic-decision-tree-burst-v1': 'Die Entscheidung prüft Preis, Tempo und Sicherheit und verwirft ungeeignete Wege.',
  'human-ai-collaboration-human-ai-relay-v1': 'Der Mensch setzt das Ziel, die KI entwirft, der Mensch prüft und die KI setzt um.',
  'learning-update-knowledge-tree-graft-v1': 'Eine neue verifizierte Quelle aktualisiert die unsichere alte Aussage.',
  'tokenization-magnetic-phrase-slicer-v1': 'Die KI zerlegt diesen Satz sichtbar in einzelne Tokens.',
  'data-transformation-vector-prism-converter-v1': 'Das Wort Berlin wird in numerische Dimensionen für Bedeutung, Kontext und Ton umgewandelt.',
  'ranking-dynamic-podium-rise-v1': 'Tool A, Tool B und Tool C werden nach Preis, Tempo und Qualität gerankt.',
  'process-flow-subway-workflow-map-v1': 'Die Aufgabe läuft von Eingabe über Prüfung und Planung bis zur Ausführung und zum Ergebnis.',
  'input-output-funnel-compression-output-v1': 'Dokumente und Notizen bleiben, irrelevante Chats werden verworfen und alles wird verdichtet.',
  'error-detection-anomaly-xray-scanner-v1': 'Input und Filter laufen, im Modell entsteht der Fehler und danach wird der Output repariert.',
  'semantic-space-meaning-terrain-v1': 'Hund, Katze und Tier liegen näher zusammen als Auto, Zug und Reise.',
  'relationship-network-dependency-bridge-builder-v1': 'Attention verbindet KI stark mit Text, während eine schwache Verbindung verworfen wird.',
  'probability-probability-fluid-columns-v1': 'Nach dem Kontext steigt die Wahrscheinlichkeit für Text auf 66 Prozent.',
  'model-processing-residual-river-v1': 'Das Eingangssignal fließt durch Attention, Transformation und Residual-Schicht zum Output.',
  'generation-answer-loom-v1': 'Aus Kontext, Thema, Grammatik und Ton entsteht Wort für Wort die Antwort.',
  'risk-contrast-confidence-glass-crack-v1': 'Eine sehr sicher formulierte Behauptung zerbricht, weil Quelle, Datum und Beleg fehlen.',
  'security-privacy-encryption-vault-layers-v1': 'Kundendaten passieren Transport, Verschlüsselung und Berechtigung, bevor Zugriff möglich ist.',
  'scale-performance-latency-tunnel-race-v1': 'Der serielle Pfad braucht 780 Millisekunden, der parallele Pfad nur 340 Millisekunden.',
  'time-change-timeline-microscope-v1': 'Von Version 1 über Version 2 bis heute wächst das System durch schnellere Planung und mehr Kontext.',
  'comparison-benchmark-racetrack-v1': 'Modell A gewinnt bei Tempo und Qualität mit 96 Punkten, Modell B erreicht 88 Punkte.',
};

describe('prototype runtime content deriver', () => {
  it('covers exactly the current production-ready content-render animations', () => {
    expect([...PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS].sort()).toEqual(
      [...PRODUCTION_READY_LIBRARY_ANIMATION_IDS].sort(),
    );
    expect(PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS).toHaveLength(22);
  });

  it('produces prototype-specific runtime keys for all 22 production-ready ids', () => {
    for (const animationId of PROTOTYPE_RUNTIME_CONTENT_DERIVER_IDS) {
      const result = derive(animationId, SAMPLE_TEXT[animationId]);
      const available = new Set([
        ...Object.keys(result.labels),
        ...Object.keys(result.values),
      ]);
      for (const requiredKey of REQUIRED_RUNTIME_KEYS[animationId]) {
        expect(available.has(requiredKey), `${animationId} missing ${requiredKey}`).toBe(true);
      }
    }
  });

  it('extracts explicit latency values including written German number words', () => {
    const numeric = derive(
      'scale-performance-latency-tunnel-race-v1',
      'Der serielle Pfad braucht 780 Millisekunden, während der parallele Pfad in 340 Millisekunden fertig ist.',
    );
    expect(numeric.values.slowLatency).toBe(780);
    expect(numeric.values.fastLatency).toBe(340);

    const written = derive(
      'scale-performance-latency-tunnel-race-v1',
      'Der serielle Pfad braucht siebenhundertachtzig Millisekunden, während der parallele Pfad in dreihundertvierzig Millisekunden fertig ist.',
    );
    expect(written.values.slowLatency).toBe(780);
    expect(written.values.fastLatency).toBe(340);
  });

  it('maps an explicit probability percentage to the dominant candidate', () => {
    const result = derive(
      'probability-probability-fluid-columns-v1',
      'Nach dem Kontext steigt die Wahrscheinlichkeit für Text auf sechsundsechzig Prozent.',
    );
    expect(result.values.candidate1End).toBe(66);
    expect(
      Number(result.values.candidate1End) +
        Number(result.values.candidate2End) +
        Number(result.values.candidate3End),
    ).toBe(100);
  });

  it('keeps an uncertain knowledge update below the verification threshold', () => {
    const result = derive(
      'learning-update-knowledge-tree-graft-v1',
      'Die neue Information ist unsicher und noch nicht verifiziert, deshalb bleibt der alte Stand bestehen.',
    );
    expect(Number(result.values.confidence)).toBeLessThan(
      Number(result.values.verificationThreshold),
    );
    expect(result.values.revisionEnd).toBe(result.values.revisionStart);
  });

  it('derives non-trivial retrieval and funnel filtering from the actual sentence', () => {
    const retrieval = derive(
      'retrieval-search-knowledge-magnet-v1',
      'Studie und Fachbericht sind relevant, der Kommentar ist irrelevant und wird verworfen.',
    );
    const retrievalFlags = Object.entries(retrieval.values)
      .filter(([key]) => /source\d+Relevant/.test(key))
      .map(([, value]) => Number(value));
    expect(retrievalFlags).toContain(1);
    expect(retrievalFlags).toContain(0);

    const funnel = derive(
      'input-output-funnel-compression-output-v1',
      'Dokumente und Notizen bleiben, irrelevante Chats werden verworfen und das Ergebnis wird verdichtet.',
    );
    const keepFlags = Object.entries(funnel.values)
      .filter(([key]) => /input\d+Keep/.test(key))
      .map(([, value]) => Number(value));
    expect(keepFlags).toContain(1);
    expect(keepFlags).toContain(0);
  });

  it('uses explicit relationship percentages as visual link weights', () => {
    const result = derive(
      'relationship-network-dependency-bridge-builder-v1',
      'KI ist mit Text zu 86 Prozent verbunden, Text mit Kontext zu 72 Prozent und die schwache Direktverbindung nur zu 18 Prozent.',
    );
    expect(result.values.weight12).toBe(0.86);
    expect(result.values.weight23).toBe(0.72);
    expect(result.values.weakWeight).toBe(0.18);
  });

  it('returns an empty payload for shell-only or unknown animation ids', () => {
    expect(
      derive('future-shell-only-animation-v1', 'Ein beliebiger Satz.'),
    ).toEqual({labels: {}, values: {}});
  });
});
