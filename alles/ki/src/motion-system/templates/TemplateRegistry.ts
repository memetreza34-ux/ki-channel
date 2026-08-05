import type {MotionStoryboard} from '../schema';

export type TemplateMetadata = {
  title: string;
  purpose: string;
};

export const TEMPLATE_REGISTRY: Record<
  MotionStoryboard['visualType'],
  TemplateMetadata
> = {
  'input-output': {
    title: 'Eingabe wird Ergebnis',
    purpose: 'Zeigt eine direkte Verarbeitung von einer Eingabe zu einem Ergebnis.',
  },
  'tool-orchestration': {
    title: 'KI nutzt mehrere Werkzeuge',
    purpose: 'Zeigt einen Agenten, der mehrere Werkzeuge für eine Aufgabe koordiniert.',
  },
  comparison: {
    title: 'Direkter Vergleich',
    purpose: 'Stellt zwei Varianten und ein gemeinsames Vergleichskriterium gegenüber.',
  },
  'before-after': {
    title: 'Vorher und Nachher',
    purpose: 'Visualisiert eine erkennbare Veränderung zwischen zwei Zuständen.',
  },
  'data-flow': {
    title: 'Daten fließen durch die KI',
    purpose: 'Zeigt den Weg von einer Datenquelle durch die Verarbeitung zum Ergebnis.',
  },
  'error-path': {
    title: 'Fehler erkennen und prüfen',
    purpose: 'Zeigt einen problematischen Pfad und die anschließende Kontrolle.',
  },
  'context-window': {
    title: 'Nur aktueller Kontext zählt',
    purpose: 'Visualisiert, wie alter, aktueller und neuer Kontext behandelt werden.',
  },
  'agent-loop': {
    title: 'Planen, ausführen, prüfen',
    purpose: 'Zeigt die wiederholte Arbeitsfolge eines autonomen Agenten.',
  },
  ranking: {
    title: 'Ergebnisse werden gerankt',
    purpose: 'Ordnet mehrere Ergebnisse nach einem numerischen Wert.',
  },
  'process-chain': {
    title: 'Schritt für Schritt',
    purpose: 'Zeigt eine geordnete Folge von bis zu vier Prozessschritten.',
  },
};
