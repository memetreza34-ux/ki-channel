export type FinalMechanism =
  | 'contextual-token-river'
  | 'representation-morph-cascade'
  | 'concept-neighborhood-elevator'
  | 'context-thread-braider'
  | 'predictive-domino-fork'
  | 'model-layer-book'
  | 'response-constellation-write'
  | 'truth-shadow-comparison'
  | 'parallel-worlds-split'
  | 'constellation-rank-align'
  | 'circular-feedback-workshop'
  | 'machine-blueprint-reveal'
  | 'debugger-time-scrub'
  | 'evidence-fishing-lines'
  | 'privacy-redaction-wave'
  | 'scaling-staircase'
  | 'resource-packing-puzzle'
  | 'decay-renewal-cycle'
  | 'copilot-dual-track'
  | 'tradeoff-landscape-route'
  | 'attention-spotlight-stage'
  | 'stale-fact-renewal-cycle';

export type FinalAnimationRecipe = {
  compositionId: string;
  animationId: string;
  family: string;
  title: string;
  subtitle: string;
  mechanism: FinalMechanism;
};

export const FINAL_ANIMATION_RECIPES: readonly FinalAnimationRecipe[] = [
  {
    compositionId: 'Library-Final-Contextual-Token-River',
    animationId: 'tokenization-contextual-token-river-v1',
    family: 'tokenization',
    title: 'Contextual Token River',
    subtitle: 'Wörter fließen, teilen oder verbinden sich abhängig von ihrem direkten Kontext.',
    mechanism: 'contextual-token-river',
  },
  {
    compositionId: 'Library-Final-Representation-Morph-Cascade',
    animationId: 'data-transformation-representation-morph-cascade-v1',
    family: 'data-transformation',
    title: 'Representation Morph Cascade',
    subtitle: 'Dasselbe Konzept verändert seine Darstellung von Wort zu Symbol, Koordinate und Vektor.',
    mechanism: 'representation-morph-cascade',
  },
  {
    compositionId: 'Library-Final-Concept-Neighborhood-Elevator',
    animationId: 'semantic-space-concept-neighborhood-elevator-v1',
    family: 'semantic-space',
    title: 'Concept Neighborhood Elevator',
    subtitle: 'Semantische Etagen wechseln von allgemeinen zu immer spezifischeren Bedeutungen.',
    mechanism: 'concept-neighborhood-elevator',
  },
  {
    compositionId: 'Library-Final-Context-Thread-Braider',
    animationId: 'relationship-network-context-thread-braider-v1',
    family: 'relationship-network',
    title: 'Context Thread Braider',
    subtitle: 'Mehrere Kontextstränge bilden eine Interpretation; ein fehlender Strang verändert das Ergebnis.',
    mechanism: 'context-thread-braider',
  },
  {
    compositionId: 'Library-Final-Predictive-Domino-Fork',
    animationId: 'probability-predictive-domino-fork-v1',
    family: 'probability',
    title: 'Predictive Domino Fork',
    subtitle: 'Kontext stabilisiert eine von mehreren möglichen Fortsetzungen, bevor die Kette fällt.',
    mechanism: 'predictive-domino-fork',
  },
  {
    compositionId: 'Library-Final-Model-Layer-Book',
    animationId: 'model-processing-model-layer-book-v1',
    family: 'model-processing',
    title: 'Model Layer Book',
    subtitle: 'Transparente Seiten verfeinern dieselbe Information Schicht für Schicht.',
    mechanism: 'model-layer-book',
  },
  {
    compositionId: 'Library-Final-Response-Constellation-Write',
    animationId: 'generation-response-constellation-write-v1',
    family: 'generation',
    title: 'Response Constellation Write',
    subtitle: 'Ausgewählte Konzeptpunkte sinken herab, werden zu Wörtern und bilden eine Antwort.',
    mechanism: 'response-constellation-write',
  },
  {
    compositionId: 'Library-Final-Truth-Shadow-Comparison',
    animationId: 'risk-contrast-truth-shadow-comparison-v1',
    family: 'risk-contrast',
    title: 'Truth Shadow Comparison',
    subtitle: 'Eine sichere Aussage wirft einen Schatten, der fehlende Belege und Widersprüche sichtbar macht.',
    mechanism: 'truth-shadow-comparison',
  },
  {
    compositionId: 'Library-Final-Parallel-Worlds-Split',
    animationId: 'comparison-parallel-worlds-split-v1',
    family: 'comparison',
    title: 'Parallel Worlds Split',
    subtitle: 'Eine Ausgangslage teilt sich in zwei Welten, die sich unter verschiedenen Methoden entwickeln.',
    mechanism: 'parallel-worlds-split',
  },
  {
    compositionId: 'Library-Final-Constellation-Rank-Align',
    animationId: 'ranking-constellation-rank-align-v1',
    family: 'ranking',
    title: 'Constellation Rank Align',
    subtitle: 'Verstreute Kandidaten ordnen sich über Höhe und Helligkeit zu einer Rangfolge.',
    mechanism: 'constellation-rank-align',
  },
  {
    compositionId: 'Library-Final-Circular-Feedback-Workshop',
    animationId: 'process-flow-circular-feedback-workshop-v1',
    family: 'process-flow',
    title: 'Circular Feedback Workshop',
    subtitle: 'Ein Entwurf durchläuft Prüfung und Verbesserung, bis seine Qualität stabil wird.',
    mechanism: 'circular-feedback-workshop',
  },
  {
    compositionId: 'Library-Final-Machine-Blueprint-Reveal',
    animationId: 'input-output-machine-blueprint-reveal-v1',
    family: 'input-output',
    title: 'Machine Blueprint Reveal',
    subtitle: 'Eine Blackbox öffnet sich und zeigt, wie jeder innere Zustand zum Ergebnis beiträgt.',
    mechanism: 'machine-blueprint-reveal',
  },
  {
    compositionId: 'Library-Final-Debugger-Time-Scrub',
    animationId: 'error-detection-debugger-time-scrub-v1',
    family: 'error-detection',
    title: 'Debugger Time Scrub',
    subtitle: 'Die Timeline läuft vom Fehler zurück bis zum ersten abweichenden Zustand.',
    mechanism: 'debugger-time-scrub',
  },
  {
    compositionId: 'Library-Final-Evidence-Fishing-Lines',
    animationId: 'retrieval-search-evidence-fishing-lines-v1',
    family: 'retrieval-search',
    title: 'Evidence Fishing Lines',
    subtitle: 'Mehrere Suchlinien prüfen Quellen; schwache Treffer lösen sich, belastbare Belege werden eingeholt.',
    mechanism: 'evidence-fishing-lines',
  },
  {
    compositionId: 'Library-Final-Privacy-Redaction-Wave',
    animationId: 'security-privacy-privacy-redaction-wave-v1',
    family: 'security-privacy',
    title: 'Privacy Redaction Wave',
    subtitle: 'Eine Datenschutzwelle maskiert persönliche Daten und bewahrt nur benötigte Informationen.',
    mechanism: 'privacy-redaction-wave',
  },
  {
    compositionId: 'Library-Final-Scaling-Staircase',
    animationId: 'scale-performance-scaling-staircase-v1',
    family: 'scale-performance',
    title: 'Scaling Staircase',
    subtitle: 'Nachfrage steigt stufenweise, Kapazität wird rechtzeitig hinzugefügt und schließt die Lücke.',
    mechanism: 'scaling-staircase',
  },
  {
    compositionId: 'Library-Final-Resource-Packing-Puzzle',
    animationId: 'cost-efficiency-resource-packing-puzzle-v1',
    family: 'cost-efficiency',
    title: 'Resource Packing Puzzle',
    subtitle: 'Aufgaben werden neu angeordnet, damit dieselbe Rechenfläche effizienter genutzt wird.',
    mechanism: 'resource-packing-puzzle',
  },
  {
    compositionId: 'Library-Final-Decay-Renewal-Cycle',
    animationId: 'time-change-decay-renewal-cycle-v1',
    family: 'time-change',
    title: 'Decay Renewal Cycle',
    subtitle: 'Information altert sichtbar, wird geprüft und durch eine aktuelle Version erneuert.',
    mechanism: 'decay-renewal-cycle',
  },
  {
    compositionId: 'Library-Final-Copilot-Dual-Track',
    animationId: 'human-ai-collaboration-copilot-dual-track-v1',
    family: 'human-ai-collaboration',
    title: 'Copilot Dual Track',
    subtitle: 'Menschliche Absicht und KI-Ausführung laufen parallel und treffen sich an Freigabepunkten.',
    mechanism: 'copilot-dual-track',
  },
  {
    compositionId: 'Library-Final-Tradeoff-Landscape-Route',
    animationId: 'decision-logic-tradeoff-landscape-route-v1',
    family: 'decision-logic',
    title: 'Tradeoff Landscape Route',
    subtitle: 'Kosten, Risiko, Tempo und Qualität formen das Gelände einer Entscheidung.',
    mechanism: 'tradeoff-landscape-route',
  },
  {
    compositionId: 'Library-Final-Attention-Spotlight-Stage',
    animationId: 'context-window-attention-spotlight-stage-v1',
    family: 'context-window',
    title: 'Attention Spotlight Stage',
    subtitle: 'Der gesamte Kontext bleibt sichtbar, aber nur relevante Wörter werden für den aktuellen Schritt aktiviert.',
    mechanism: 'attention-spotlight-stage',
  },
  {
    compositionId: 'Library-Final-Stale-Fact-Renewal-Cycle',
    animationId: 'learning-update-stale-fact-renewal-cycle-v1',
    family: 'learning-update',
    title: 'Stale Fact Renewal Cycle',
    subtitle: 'Veraltete Fakten werden gesucht, erneuert oder kontrolliert ausgemustert.',
    mechanism: 'stale-fact-renewal-cycle',
  },
] as const;
