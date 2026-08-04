export type ExperimentalMechanism =
  | 'syllable-conveyor'
  | 'matrix-waterfall'
  | 'concept-constellation'
  | 'graph-bloom'
  | 'candidate-orbit'
  | 'transformer-tunnel'
  | 'sentence-ribbon'
  | 'hallucination-mirage'
  | 'difference-magnifier'
  | 'priority-orbit'
  | 'automation-cells'
  | 'transformation-portal'
  | 'broken-path-repair'
  | 'archive-spotlight'
  | 'permission-city'
  | 'load-balancing-city'
  | 'token-cost-conveyor'
  | 'version-evolution-tree'
  | 'feedback-sculpting'
  | 'if-then-gates'
  | 'memory-carousel'
  | 'belief-ledger';

export type ExperimentalAnimationRecipe = {
  compositionId: string;
  animationId: string;
  family: string;
  title: string;
  subtitle: string;
  mechanism: ExperimentalMechanism;
  accentLabel: string;
};

export const EXPERIMENTAL_ANIMATION_RECIPES: readonly ExperimentalAnimationRecipe[] = [
  {
    compositionId: 'Library-Experimental-Syllable-Conveyor',
    animationId: 'tokenization-syllable-conveyor-v1',
    family: 'tokenization',
    title: 'Syllable Conveyor',
    subtitle: 'Text wird erkannt, getrennt und in wiederverwendbare Sprachstücke sortiert.',
    mechanism: 'syllable-conveyor',
    accentLabel: 'TOKEN-SORTIERUNG',
  },
  {
    compositionId: 'Library-Experimental-Matrix-Waterfall-Encoder',
    animationId: 'data-transformation-matrix-waterfall-encoder-v1',
    family: 'data-transformation',
    title: 'Matrix Waterfall Encoder',
    subtitle: 'Lesbare Information fällt durch Kodierschichten und wird zu einer kompakten Matrix.',
    mechanism: 'matrix-waterfall',
    accentLabel: 'ENCODING',
  },
  {
    compositionId: 'Library-Experimental-Magnetic-Concept-Constellation',
    animationId: 'semantic-space-magnetic-concept-constellation-v1',
    family: 'semantic-space',
    title: 'Magnetic Concept Constellation',
    subtitle: 'Verwandte Begriffe ziehen sich an, unpassende stoßen sich ab und bilden stabile Gruppen.',
    mechanism: 'concept-constellation',
    accentLabel: 'ÄHNLICHKEIT',
  },
  {
    compositionId: 'Library-Experimental-Graph-Bloom',
    animationId: 'relationship-network-graph-bloom-v1',
    family: 'relationship-network',
    title: 'Graph Bloom',
    subtitle: 'Ein Kernbegriff wächst zu einem Netz, während irrelevante Äste sichtbar entfernt werden.',
    mechanism: 'graph-bloom',
    accentLabel: 'BEZIEHUNGEN',
  },
  {
    compositionId: 'Library-Experimental-Candidate-Orbit-Selection',
    animationId: 'probability-candidate-orbit-selection-v1',
    family: 'probability',
    title: 'Candidate Orbit Selection',
    subtitle: 'Mögliche nächste Wörter kreisen mit unterschiedlicher Wahrscheinlichkeit um den Satzkern.',
    mechanism: 'candidate-orbit',
    accentLabel: 'WAHRSCHEINLICHKEIT',
  },
  {
    compositionId: 'Library-Experimental-Transformer-Tunnel',
    animationId: 'model-processing-transformer-tunnel-v1',
    family: 'model-processing',
    title: 'Transformer Tunnel',
    subtitle: 'Information durchläuft Ringe, die jeweils eine sichtbare Eigenschaft verändern.',
    mechanism: 'transformer-tunnel',
    accentLabel: 'MODELLSCHICHTEN',
  },
  {
    compositionId: 'Library-Experimental-Sentence-Ribbon-Fold',
    animationId: 'generation-sentence-ribbon-fold-v1',
    family: 'generation',
    title: 'Sentence Ribbon Fold',
    subtitle: 'Ein leeres Band wird Schritt für Schritt zu einem vollständigen Satz gefaltet.',
    mechanism: 'sentence-ribbon',
    accentLabel: 'WORT FÜR WORT',
  },
  {
    compositionId: 'Library-Experimental-Hallucination-Mirage',
    animationId: 'risk-contrast-hallucination-mirage-v1',
    family: 'risk-contrast',
    title: 'Hallucination Mirage',
    subtitle: 'Eine überzeugende Antwort wirkt stabil, bis eine Quellenprüfung die Illusion auflöst.',
    mechanism: 'hallucination-mirage',
    accentLabel: 'QUELLENCHECK',
  },
  {
    compositionId: 'Library-Experimental-Difference-Magnifier',
    animationId: 'comparison-difference-magnifier-v1',
    family: 'comparison',
    title: 'Difference Magnifier',
    subtitle: 'Eine bewegliche Linse isoliert kleine Unterschiede, die das Ergebnis wirklich verändern.',
    mechanism: 'difference-magnifier',
    accentLabel: 'ENTSCHEIDENDER UNTERSCHIED',
  },
  {
    compositionId: 'Library-Experimental-Priority-Orbit-Stack',
    animationId: 'ranking-priority-orbit-stack-v1',
    family: 'ranking',
    title: 'Priority Orbit Stack',
    subtitle: 'Elemente kreisen um ein Ziel und bilden abhängig von ihrer Priorität eine geordnete Mitte.',
    mechanism: 'priority-orbit',
    accentLabel: 'PRIORITÄT',
  },
  {
    compositionId: 'Library-Experimental-Automation-Conveyor-Cells',
    animationId: 'process-flow-automation-conveyor-cells-v1',
    family: 'process-flow',
    title: 'Automation Conveyor Cells',
    subtitle: 'Ein Objekt durchläuft spezialisierte Stationen und wird an jedem Schritt sichtbar verändert.',
    mechanism: 'automation-cells',
    accentLabel: 'AUTOMATION',
  },
  {
    compositionId: 'Library-Experimental-Transformation-Portal',
    animationId: 'input-output-transformation-portal-v1',
    family: 'input-output',
    title: 'Transformation Portal',
    subtitle: 'Ein klarer Input durchläuft ein sichtbares Portal und verlässt es als anderes Ergebnis.',
    mechanism: 'transformation-portal',
    accentLabel: 'INPUT → OUTPUT',
  },
  {
    compositionId: 'Library-Experimental-Broken-Path-Repair',
    animationId: 'error-detection-broken-path-repair-v1',
    family: 'error-detection',
    title: 'Broken Path Repair',
    subtitle: 'Ein Signal stoppt an einer Bruchstelle, die Diagnose lokalisiert und repariert.',
    mechanism: 'broken-path-repair',
    accentLabel: 'URSACHE GEFUNDEN',
  },
  {
    compositionId: 'Library-Experimental-Archive-Spotlight-Search',
    animationId: 'retrieval-search-archive-spotlight-search-v1',
    family: 'retrieval-search',
    title: 'Archive Spotlight Search',
    subtitle: 'Ein Lichtkegel durchsucht Dokumente und extrahiert nur die Zeilen, die die Antwort belegen.',
    mechanism: 'archive-spotlight',
    accentLabel: 'BELEG GEFUNDEN',
  },
  {
    compositionId: 'Library-Experimental-Permission-Gate-City',
    animationId: 'security-privacy-permission-gate-city-v1',
    family: 'security-privacy',
    title: 'Permission Gate City',
    subtitle: 'Identität, Rolle und Umfang entscheiden, welche Route für eine Anfrage geöffnet bleibt.',
    mechanism: 'permission-city',
    accentLabel: 'ZUGRIFFSPRÜFUNG',
  },
  {
    compositionId: 'Library-Experimental-Load-Balancing-City',
    animationId: 'scale-performance-load-balancing-city-v1',
    family: 'scale-performance',
    title: 'Load Balancing City',
    subtitle: 'Verkehr wird dynamisch umgeleitet, sobald einzelne Dienste ihre Kapazität erreichen.',
    mechanism: 'load-balancing-city',
    accentLabel: 'LASTVERTEILUNG',
  },
  {
    compositionId: 'Library-Experimental-Token-Cost-Conveyor',
    animationId: 'cost-efficiency-token-cost-conveyor-v1',
    family: 'cost-efficiency',
    title: 'Token Cost Conveyor',
    subtitle: 'Prompt- und Ausgabetokens laufen durch eine Preisstrecke, unnötige Teile werden entfernt.',
    mechanism: 'token-cost-conveyor',
    accentLabel: 'KOSTEN SINKEN',
  },
  {
    compositionId: 'Library-Experimental-Version-Evolution-Tree',
    animationId: 'time-change-version-evolution-tree-v1',
    family: 'time-change',
    title: 'Version Evolution Tree',
    subtitle: 'Versionen wachsen als Baum, Funktionen entstehen, verschmelzen oder verschwinden.',
    mechanism: 'version-evolution-tree',
    accentLabel: 'ENTWICKLUNG',
  },
  {
    compositionId: 'Library-Experimental-Feedback-Sculpting',
    animationId: 'human-ai-collaboration-feedback-sculpting-v1',
    family: 'human-ai-collaboration',
    title: 'Feedback Sculpting',
    subtitle: 'Die KI liefert eine Rohform, menschliches Feedback formt sie über mehrere Iterationen.',
    mechanism: 'feedback-sculpting',
    accentLabel: 'MENSCH + KI',
  },
  {
    compositionId: 'Library-Experimental-If-Then-Gate-Array',
    animationId: 'decision-logic-if-then-gate-array-v1',
    family: 'decision-logic',
    title: 'If Then Gate Array',
    subtitle: 'Signale öffnen nur den Pfad, dessen vollständige Bedingungen erfüllt sind.',
    mechanism: 'if-then-gates',
    accentLabel: 'LOGIKPFAD',
  },
  {
    compositionId: 'Library-Experimental-Memory-Shelf-Carousel',
    animationId: 'context-window-memory-shelf-carousel-v1',
    family: 'context-window',
    title: 'Memory Shelf Carousel',
    subtitle: 'Kontext rotiert durch begrenzte Speicherplätze, relevante ältere Inhalte werden zurückgeholt.',
    mechanism: 'memory-carousel',
    accentLabel: 'AKTIVER KONTEXT',
  },
  {
    compositionId: 'Library-Experimental-Belief-Ledger-Revision',
    animationId: 'learning-update-belief-ledger-revision-v1',
    family: 'learning-update',
    title: 'Belief Ledger Revision',
    subtitle: 'Quelle, Aktualität und Vertrauen entscheiden, ob ein Fakt ergänzt oder ersetzt wird.',
    mechanism: 'belief-ledger',
    accentLabel: 'VERSIONIERTES WISSEN',
  },
] as const;
