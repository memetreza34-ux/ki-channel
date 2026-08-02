import type {MotionStoryboard, MotionVisualType} from './schema';

const includesAny = (text: string, words: readonly string[]): boolean =>
  words.some((word) => text.includes(word));

export const classifySentence = (sentence: string): MotionVisualType => {
  const text = sentence.toLowerCase();

  if (includesAny(text, ['statt', 'vergleich', 'besser als', 'schlechter als', 'gegenüber'])) {
    return 'comparison';
  }

  if (includesAny(text, ['vorher', 'nachher', 'früher', 'jetzt'])) {
    return 'before-after';
  }

  if (includesAny(text, ['fehler', 'falsch', 'halluzin', 'risiko', 'bricht ab'])) {
    return 'error-path';
  }

  if (includesAny(text, ['kontext', 'erinner', 'verlauf', 'alte information'])) {
    return 'context-window';
  }

  if (includesAny(text, ['werkzeug', 'tools', 'browser', 'e-mail', 'datei', 'kalender'])) {
    return 'tool-orchestration';
  }

  if (includesAny(text, ['agent', 'selbstständig', 'autonom', 'plant', 'kontrolliert'])) {
    return 'agent-loop';
  }

  if (includesAny(text, ['daten', 'fließen', 'überträgt', 'verbindet', 'quelle'])) {
    return 'data-flow';
  }

  if (includesAny(text, ['ranking', 'platz', 'top', 'schneller', 'größer', 'mehr'])) {
    return 'ranking';
  }

  if (includesAny(text, ['schritt', 'zuerst', 'danach', 'anschließend', 'prozess'])) {
    return 'process-chain';
  }

  return 'input-output';
};

const base = (sentence: string, visualType: MotionVisualType): MotionStoryboard => ({
  id: `motion-${visualType}`,
  sentence,
  visualType,
  durationInFrames: 150,
  fps: 30,
  elements: [],
  beats: [],
  labels: [],
});

export const createDefaultStoryboard = (sentence: string): MotionStoryboard => {
  const visualType = classifySentence(sentence);
  const storyboard = base(sentence, visualType);

  switch (visualType) {
    case 'tool-orchestration':
      return {
        ...storyboard,
        elements: [
          {id: 'task', kind: 'card', label: 'Aufgabe', emphasis: 'normal'},
          {id: 'ai', kind: 'ai-core', label: 'KI-Agent', emphasis: 'focus'},
          {id: 'browser', kind: 'tool', label: 'Browser', emphasis: 'normal'},
          {id: 'files', kind: 'tool', label: 'Dateien', emphasis: 'normal'},
          {id: 'result', kind: 'result', label: 'Ergebnis', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'task', durationFrames: 18},
          {id: 'b2', atFrame: 22, action: 'show', targetId: 'ai', durationFrames: 18},
          {id: 'b3', atFrame: 45, action: 'show', targetId: 'browser', durationFrames: 16},
          {id: 'b4', atFrame: 58, action: 'show', targetId: 'files', durationFrames: 16},
          {id: 'b5', atFrame: 76, action: 'connect', sourceId: 'ai', targetId: 'browser', durationFrames: 20},
          {id: 'b6', atFrame: 82, action: 'connect', sourceId: 'ai', targetId: 'files', durationFrames: 20},
          {id: 'b7', atFrame: 112, action: 'show', targetId: 'result', durationFrames: 20},
          {id: 'b8', atFrame: 126, action: 'complete', targetId: 'result', durationFrames: 16},
        ],
        labels: ['Aufgabe', 'KI-Agent', 'Werkzeuge', 'Ergebnis'],
      };

    case 'comparison':
      return {
        ...storyboard,
        elements: [
          {id: 'left', kind: 'card', label: 'Variante A', emphasis: 'warning'},
          {id: 'right', kind: 'card', label: 'Variante B', emphasis: 'success'},
          {id: 'metric', kind: 'metric', label: 'Vergleich', emphasis: 'focus'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'left', durationFrames: 20},
          {id: 'b2', atFrame: 18, action: 'show', targetId: 'right', durationFrames: 20},
          {id: 'b3', atFrame: 52, action: 'show', targetId: 'metric', durationFrames: 18},
          {id: 'b4', atFrame: 88, action: 'dim', targetId: 'left', durationFrames: 18},
          {id: 'b5', atFrame: 98, action: 'highlight', targetId: 'right', durationFrames: 20},
        ],
        labels: ['Variante A', 'Variante B', 'Vergleich'],
      };

    case 'error-path':
      return {
        ...storyboard,
        elements: [
          {id: 'input', kind: 'card', label: 'Eingabe', emphasis: 'normal'},
          {id: 'ai', kind: 'ai-core', label: 'KI', emphasis: 'focus'},
          {id: 'error', kind: 'result', label: 'Fehler', emphasis: 'danger'},
          {id: 'check', kind: 'result', label: 'Prüfen', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'input', durationFrames: 16},
          {id: 'b2', atFrame: 24, action: 'show', targetId: 'ai', durationFrames: 16},
          {id: 'b3', atFrame: 58, action: 'show', targetId: 'error', durationFrames: 18},
          {id: 'b4', atFrame: 64, action: 'shake', targetId: 'error', durationFrames: 14},
          {id: 'b5', atFrame: 103, action: 'show', targetId: 'check', durationFrames: 20},
          {id: 'b6', atFrame: 122, action: 'complete', targetId: 'check', durationFrames: 16},
        ],
        labels: ['Eingabe', 'KI', 'Fehler', 'Prüfen'],
      };

    default:
      return {
        ...storyboard,
        elements: [
          {id: 'input', kind: 'card', label: 'Eingabe', emphasis: 'normal'},
          {id: 'ai', kind: 'ai-core', label: 'KI', emphasis: 'focus'},
          {id: 'output', kind: 'result', label: 'Ergebnis', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'input', durationFrames: 18},
          {id: 'b2', atFrame: 34, action: 'show', targetId: 'ai', durationFrames: 18},
          {id: 'b3', atFrame: 62, action: 'connect', sourceId: 'input', targetId: 'ai', durationFrames: 24},
          {id: 'b4', atFrame: 98, action: 'show', targetId: 'output', durationFrames: 20},
          {id: 'b5', atFrame: 120, action: 'complete', targetId: 'output', durationFrames: 16},
        ],
        labels: ['Eingabe', 'KI', 'Ergebnis'],
      };
  }
};
