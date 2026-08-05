import {createDefaultStoryboard} from './router';
import type {MotionStoryboard, MotionVisualType} from './schema';

const EXAMPLE_SENTENCES: Record<MotionVisualType, string> = {
  'input-output': 'Die KI erstellt aus einer Eingabe ein fertiges Ergebnis.',
  'tool-orchestration': 'Der KI-Agent nutzt Browser und Dateien für die Aufgabe.',
  comparison: 'Modell A ist im Vergleich schneller als Modell B.',
  'before-after': 'Vorher dauerte der Prozess lange, jetzt läuft er automatisch.',
  'data-flow': 'Daten fließen aus mehreren Quellen durch die KI zum Ergebnis.',
  'error-path': 'Die KI kann eine falsche Antwort halluzinieren und muss geprüft werden.',
  'context-window': 'Alte Informationen fallen aus dem Kontext, wenn neue Nachrichten hinzukommen.',
  'agent-loop': 'Der Agent plant, führt aus, prüft und arbeitet autonom weiter.',
  ranking: 'Dieses Modell landet im Ranking auf Platz eins.',
  'process-chain': 'Zuerst kommt die Eingabe, danach Analyse, Ausführung und Ergebnis.',
};

export const MOTION_EXAMPLES: Record<MotionVisualType, MotionStoryboard> = Object.fromEntries(
  Object.entries(EXAMPLE_SENTENCES).map(([type, sentence]) => {
    const storyboard = createDefaultStoryboard(sentence);
    if (storyboard.visualType !== type) {
      throw new Error(`Beispiel ${type} wurde als ${storyboard.visualType} klassifiziert.`);
    }
    return [type, storyboard];
  }),
) as Record<MotionVisualType, MotionStoryboard>;

export const MOTION_EXAMPLE_LIST = Object.values(MOTION_EXAMPLES);
