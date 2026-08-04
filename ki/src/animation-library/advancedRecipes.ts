export type AdvancedMechanism =
  | 'character-mosaic'
  | 'binary-weave'
  | 'semantic-lens'
  | 'relevance-pulse'
  | 'confidence-weather'
  | 'expert-switchboard'
  | 'type-orchestra'
  | 'source-checkpoints'
  | 'tradeoff-seesaw-landscape'
  | 'ranking-ladder'
  | 'workflow-domino'
  | 'cause-effect-bridge'
  | 'red-flag-cascade'
  | 'query-radar'
  | 'data-leak-containment'
  | 'throughput-pipes'
  | 'value-seesaw'
  | 'before-after-clock'
  | 'multi-agent-roundtable'
  | 'evidence-jury'
  | 'context-elevator'
  | 'feedback-weight-tuning';

export type AdvancedAnimationRecipe = {
  compositionId: string;
  animationId: string;
  family: string;
  title: string;
  subtitle: string;
  mechanism: AdvancedMechanism;
};

export const ADVANCED_ANIMATION_RECIPES: readonly AdvancedAnimationRecipe[] = [
  {
    compositionId: 'Library-Advanced-Character-Mosaic-Collapse',
    animationId: 'tokenization-character-mosaic-collapse-v1',
    family: 'tokenization',
    title: 'Character Mosaic Collapse',
    subtitle: 'Ein Buchstabenmosaik wird lesbar und verdichtet sich anschließend zu stabilen Token-Gruppen.',
    mechanism: 'character-mosaic',
  },
  {
    compositionId: 'Library-Advanced-Binary-Weave-Loom',
    animationId: 'data-transformation-binary-weave-loom-v1',
    family: 'data-transformation',
    title: 'Binary Weave Loom',
    subtitle: 'Mehrere Datenstränge werden zu einer kompakten kodierten Struktur verwoben.',
    mechanism: 'binary-weave',
  },
  {
    compositionId: 'Library-Advanced-Semantic-Lens-Focus',
    animationId: 'semantic-space-semantic-lens-focus-v1',
    family: 'semantic-space',
    title: 'Semantic Lens Focus',
    subtitle: 'Eine Linse macht lokale Bedeutungsnachbarschaften sichtbar und blendet unpassende Begriffe aus.',
    mechanism: 'semantic-lens',
  },
  {
    compositionId: 'Library-Advanced-Relevance-Pulse-Map',
    animationId: 'relationship-network-relevance-pulse-map-v1',
    family: 'relationship-network',
    title: 'Relevance Pulse Map',
    subtitle: 'Signale laufen durch ein Begriffsnetz und kehren mit unterschiedlichen Relevanzstärken zurück.',
    mechanism: 'relevance-pulse',
  },
  {
    compositionId: 'Library-Advanced-Confidence-Weather-Map',
    animationId: 'probability-confidence-weather-map-v1',
    family: 'probability',
    title: 'Confidence Weather Map',
    subtitle: 'Wahrscheinlichkeitsfelder wachsen, kollidieren und klären sich zu einer stabilen Vorhersage.',
    mechanism: 'confidence-weather',
  },
  {
    compositionId: 'Library-Advanced-Expert-Routing-Switchboard',
    animationId: 'model-processing-expert-routing-switchboard-v1',
    family: 'model-processing',
    title: 'Expert Routing Switchboard',
    subtitle: 'Ein Router verteilt Teile der Eingabe auf spezialisierte Experten und führt Ergebnisse zusammen.',
    mechanism: 'expert-switchboard',
  },
  {
    compositionId: 'Library-Advanced-Predictive-Type-Orchestra',
    animationId: 'generation-predictive-type-orchestra-v1',
    family: 'generation',
    title: 'Predictive Type Orchestra',
    subtitle: 'Kandidaten reagieren wie Instrumentengruppen; nur die stärkste Gruppe fügt ihr Wort hinzu.',
    mechanism: 'type-orchestra',
  },
  {
    compositionId: 'Library-Advanced-Source-Checkpoint-Gates',
    animationId: 'risk-contrast-source-checkpoint-gates-v1',
    family: 'risk-contrast',
    title: 'Source Checkpoint Gates',
    subtitle: 'Behauptungen passieren Quellen-, Aktualitäts- und Evidenzprüfungen oder werden umgeleitet.',
    mechanism: 'source-checkpoints',
  },
  {
    compositionId: 'Library-Advanced-Tradeoff-Seesaw-Landscape',
    animationId: 'comparison-tradeoff-seesaw-landscape-v1',
    family: 'comparison',
    title: 'Tradeoff Seesaw Landscape',
    subtitle: 'Metriken verändern die Landschaft und kippen Optionen sichtbar in unterschiedliche Richtungen.',
    mechanism: 'tradeoff-seesaw-landscape',
  },
  {
    compositionId: 'Library-Advanced-Ranking-Ladder-Climb',
    animationId: 'ranking-ranking-ladder-climb-v1',
    family: 'ranking',
    title: 'Ranking Ladder Climb',
    subtitle: 'Kandidaten steigen, rutschen und überholen sich, sobald neue Kriterien erscheinen.',
    mechanism: 'ranking-ladder',
  },
  {
    compositionId: 'Library-Advanced-Workflow-Domino-Logic',
    animationId: 'process-flow-workflow-domino-logic-v1',
    family: 'process-flow',
    title: 'Workflow Domino Logic',
    subtitle: 'Jeder Prozessschritt aktiviert den nächsten erst nach erfüllter Abhängigkeit.',
    mechanism: 'workflow-domino',
  },
  {
    compositionId: 'Library-Advanced-Cause-Effect-Bridge',
    animationId: 'input-output-cause-effect-bridge-v1',
    family: 'input-output',
    title: 'Cause Effect Bridge',
    subtitle: 'Ein Input baut sichtbare Transformationsschritte, um die Lücke zum Ergebnis zu überqueren.',
    mechanism: 'cause-effect-bridge',
  },
  {
    compositionId: 'Library-Advanced-Red-Flag-Cascade',
    animationId: 'error-detection-red-flag-cascade-v1',
    family: 'error-detection',
    title: 'Red Flag Cascade',
    subtitle: 'Ein kleiner Ursprungsfehler löst Warnungen aus; die Root-Cause stoppt die gesamte Kaskade.',
    mechanism: 'red-flag-cascade',
  },
  {
    compositionId: 'Library-Advanced-Query-Radar-Sweep',
    animationId: 'retrieval-search-query-radar-sweep-v1',
    family: 'retrieval-search',
    title: 'Query Radar Sweep',
    subtitle: 'Ein Suchradar findet starke Quellen-Echos und ordnet sie in einem Evidenzring.',
    mechanism: 'query-radar',
  },
  {
    compositionId: 'Library-Advanced-Data-Leak-Containment',
    animationId: 'security-privacy-data-leak-containment-v1',
    family: 'security-privacy',
    title: 'Data Leak Containment',
    subtitle: 'Entweichende Daten zeigen ein Leck; Barrieren schließen die Schwachstelle segmentweise.',
    mechanism: 'data-leak-containment',
  },
  {
    compositionId: 'Library-Advanced-Throughput-Pipe-Pressure',
    animationId: 'scale-performance-throughput-pipe-pressure-v1',
    family: 'scale-performance',
    title: 'Throughput Pipe Pressure',
    subtitle: 'Datenpressure zeigt Engpässe, Stau und die Wirkung zusätzlicher paralleler Kanäle.',
    mechanism: 'throughput-pipes',
  },
  {
    compositionId: 'Library-Advanced-Value-Seesaw',
    animationId: 'cost-efficiency-value-seesaw-v1',
    family: 'cost-efficiency',
    title: 'Value Seesaw',
    subtitle: 'Kosten und Ergebnisqualität bewegen eine Waage, bis ein sinnvoller Wertpunkt entsteht.',
    mechanism: 'value-seesaw',
  },
  {
    compositionId: 'Library-Advanced-Before-After-Clock-Face',
    animationId: 'time-change-before-after-clock-face-v1',
    family: 'time-change',
    title: 'Before After Clock Face',
    subtitle: 'Eine Uhr bewegt zwei Zustände kontinuierlich von vorher zu nachher.',
    mechanism: 'before-after-clock',
  },
  {
    compositionId: 'Library-Advanced-Multi-Agent-Roundtable',
    animationId: 'human-ai-collaboration-multi-agent-roundtable-v1',
    family: 'human-ai-collaboration',
    title: 'Multi Agent Roundtable',
    subtitle: 'Spezialisierte Agenten bringen Belege ein; ein Koordinator löst Konflikte und kombiniert.',
    mechanism: 'multi-agent-roundtable',
  },
  {
    compositionId: 'Library-Advanced-Evidence-Jury',
    animationId: 'decision-logic-evidence-jury-v1',
    family: 'decision-logic',
    title: 'Evidence Jury',
    subtitle: 'Belege gewinnen oder verlieren Glaubwürdigkeit und kippen gemeinsam die Entscheidung.',
    mechanism: 'evidence-jury',
  },
  {
    compositionId: 'Library-Advanced-Context-Capacity-Elevator',
    animationId: 'context-window-context-capacity-elevator-v1',
    family: 'context-window',
    title: 'Context Capacity Elevator',
    subtitle: 'Nachrichten füllen begrenzte Ebenen; Zusammenfassung komprimiert mehrere Etagen.',
    mechanism: 'context-elevator',
  },
  {
    compositionId: 'Library-Advanced-Feedback-Weight-Tuning',
    animationId: 'learning-update-feedback-weight-tuning-v1',
    family: 'learning-update',
    title: 'Feedback Weight Tuning',
    subtitle: 'Feedback verschiebt Bewertungsgewichte und verändert zukünftige Animationsauswahlen.',
    mechanism: 'feedback-weight-tuning',
  },
] as const;
