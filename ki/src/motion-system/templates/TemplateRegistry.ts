import type {MotionStoryboard} from '../schema';

export type TemplateLayout = {
  positions: Record<string, {x: number; y: number}>;
  title: string;
};

export const TEMPLATE_REGISTRY: Record<MotionStoryboard['visualType'], TemplateLayout> = {
  'input-output': {
    title: 'Eingabe wird Ergebnis',
    positions: {input: {x: 70, y: 650}, ai: {x: 410, y: 650}, output: {x: 750, y: 650}},
  },
  'tool-orchestration': {
    title: 'KI nutzt mehrere Werkzeuge',
    positions: {
      task: {x: 70, y: 650},
      ai: {x: 410, y: 650},
      browser: {x: 730, y: 420},
      files: {x: 730, y: 680},
      result: {x: 410, y: 1040},
    },
  },
  comparison: {
    title: 'Direkter Vergleich',
    positions: {left: {x: 80, y: 660}, right: {x: 740, y: 660}, metric: {x: 410, y: 1030}},
  },
  'before-after': {
    title: 'Vorher und Nachher',
    positions: {input: {x: 80, y: 650}, ai: {x: 410, y: 650}, output: {x: 740, y: 650}},
  },
  'data-flow': {
    title: 'Daten fließen durch die KI',
    positions: {input: {x: 70, y: 650}, ai: {x: 410, y: 650}, output: {x: 750, y: 650}},
  },
  'error-path': {
    title: 'Fehler erkennen und prüfen',
    positions: {input: {x: 60, y: 650}, ai: {x: 380, y: 650}, error: {x: 720, y: 470}, check: {x: 720, y: 830}},
  },
  'context-window': {
    title: 'Nur aktueller Kontext zählt',
    positions: {input: {x: 80, y: 650}, ai: {x: 410, y: 650}, output: {x: 740, y: 650}},
  },
  'agent-loop': {
    title: 'Planen, ausführen, prüfen',
    positions: {input: {x: 80, y: 650}, ai: {x: 410, y: 650}, output: {x: 740, y: 650}},
  },
  ranking: {
    title: 'Ergebnisse werden gerankt',
    positions: {left: {x: 80, y: 830}, metric: {x: 410, y: 620}, right: {x: 740, y: 430}},
  },
  'process-chain': {
    title: 'Schritt für Schritt',
    positions: {input: {x: 60, y: 650}, ai: {x: 410, y: 650}, output: {x: 760, y: 650}},
  },
};
