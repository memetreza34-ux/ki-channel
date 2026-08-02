import type {MotionStoryboard, MotionVisualType} from './schema';

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9äöüß]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string): string[] =>
  normalizeText(value).split(/\s+/).filter(Boolean);

type ClassificationRule = {
  visualType: Exclude<MotionVisualType, 'input-output'>;
  patterns: readonly string[];
};

const CLASSIFICATION_RULES: readonly ClassificationRule[] = [
  {
    visualType: 'comparison',
    patterns: ['statt', 'vergleich*', 'besser als', 'schlechter als', 'gegenuber', 'vs', 'versus'],
  },
  {
    visualType: 'before-after',
    patterns: ['vorher', 'nachher', 'fruher', 'jetzt', 'zuvor', 'danach besser'],
  },
  {
    visualType: 'error-path',
    patterns: ['fehler*', 'falsch*', 'halluzin*', 'risiko*', 'bricht ab', 'scheiter*', 'problem*'],
  },
  {
    visualType: 'context-window',
    patterns: ['kontext*', 'erinner*', 'verlauf*', 'alte information*', 'context window', 'gedachtnis*'],
  },
  {
    visualType: 'tool-orchestration',
    patterns: ['werkzeug*', 'tool*', 'browser*', 'e mail', 'email*', 'datei*', 'kalender*', 'api'],
  },
  {
    visualType: 'agent-loop',
    patterns: ['agent*', 'selbststandig', 'autonom*', 'plant', 'planen', 'kontrollier*', 'wiederhol*'],
  },
  {
    visualType: 'data-flow',
    patterns: ['daten', 'datenfluss*', 'fließ*', 'ubertrag*', 'verbind*', 'quelle*', 'pipeline*', 'rag'],
  },
  {
    visualType: 'ranking',
    patterns: ['ranking*', 'platz*', 'top', 'schneller', 'großer', 'mehr', 'beste*', 'rangliste*'],
  },
  {
    visualType: 'process-chain',
    patterns: ['schritt*', 'zuerst', 'danach', 'anschließend', 'prozess*', 'ablauf*', 'folge*'],
  },
] as const;

type PatternToken = {
  value: string;
  prefix: boolean;
};

const parsePattern = (pattern: string): PatternToken[] =>
  pattern
    .trim()
    .split(/\s+/)
    .flatMap((rawToken) => {
      const prefix = rawToken.endsWith('*');
      const normalized = normalizeText(prefix ? rawToken.slice(0, -1) : rawToken);
      const values = normalized.split(/\s+/).filter(Boolean);
      return values.map((value, index) => ({
        value,
        prefix: prefix && index === values.length - 1,
      }));
    });

const tokenMatches = (token: string, pattern: PatternToken): boolean =>
  pattern.prefix ? token.startsWith(pattern.value) : token === pattern.value;

const matchesPattern = (tokens: string[], pattern: string): boolean => {
  const patternTokens = parsePattern(pattern);
  if (patternTokens.length === 0 || patternTokens.length > tokens.length) return false;

  for (let start = 0; start <= tokens.length - patternTokens.length; start += 1) {
    if (
      patternTokens.every((patternToken, offset) =>
        tokenMatches(tokens[start + offset], patternToken),
      )
    ) {
      return true;
    }
  }

  return false;
};

const patternScore = (pattern: string): number => {
  const tokens = parsePattern(pattern);
  const phraseBonus = tokens.length > 1 ? tokens.length * 2 : 0;
  return tokens.length + phraseBonus + 1;
};

export type SentenceClassificationCandidate = {
  visualType: Exclude<MotionVisualType, 'input-output'>;
  matchedPatterns: string[];
  score: number;
};

export type SentenceClassificationExplanation = {
  visualType: MotionVisualType;
  normalizedText: string;
  candidates: SentenceClassificationCandidate[];
};

export const explainSentenceClassification = (
  sentence: string,
): SentenceClassificationExplanation => {
  const normalizedText = normalizeText(sentence);
  const tokens = tokenize(sentence);
  const candidates = CLASSIFICATION_RULES.map((rule, priority) => {
    const matchedPatterns = rule.patterns.filter((pattern) =>
      matchesPattern(tokens, pattern),
    );
    return {
      visualType: rule.visualType,
      matchedPatterns: [...matchedPatterns],
      score: matchedPatterns.reduce(
        (total, pattern) => total + patternScore(pattern),
        0,
      ),
      priority,
    };
  })
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.priority - right.priority,
    )
    .map(({priority: _priority, ...candidate}) => candidate);

  return {
    visualType: candidates[0]?.visualType ?? 'input-output',
    normalizedText,
    candidates,
  };
};

export const classifySentence = (sentence: string): MotionVisualType =>
  explainSentenceClassification(sentence).visualType;

const base = (sentence: string, visualType: MotionVisualType): MotionStoryboard => ({
  id: `motion-${visualType}`,
  sentence: sentence.trim(),
  visualType,
  durationInFrames: 150,
  fps: 30,
  elements: [],
  beats: [],
  labels: [],
});

export const createDefaultStoryboard = (sentence: string): MotionStoryboard => {
  const cleanSentence = sentence.trim();
  if (!cleanSentence) {
    throw new Error('Der Satz darf nicht leer sein.');
  }

  const visualType = classifySentence(cleanSentence);
  const storyboard = base(cleanSentence, visualType);

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

    case 'before-after':
      return {
        ...storyboard,
        elements: [
          {id: 'input', kind: 'card', label: 'Vorher', emphasis: 'warning'},
          {id: 'output', kind: 'result', label: 'Nachher', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'input', durationFrames: 20},
          {id: 'b2', atFrame: 42, action: 'dim', targetId: 'input', durationFrames: 18},
          {id: 'b3', atFrame: 62, action: 'show', targetId: 'output', durationFrames: 20},
          {id: 'b4', atFrame: 102, action: 'highlight', targetId: 'output', durationFrames: 18},
        ],
        labels: ['Vorher', 'Nachher'],
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

    case 'context-window':
      return {
        ...storyboard,
        elements: [
          {id: 'old', kind: 'document', label: 'Alter Kontext', emphasis: 'warning'},
          {id: 'current', kind: 'document', label: 'Aktueller Kontext', emphasis: 'focus'},
          {id: 'new', kind: 'document', label: 'Neue Information', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'old', durationFrames: 18},
          {id: 'b2', atFrame: 18, action: 'show', targetId: 'current', durationFrames: 18},
          {id: 'b3', atFrame: 52, action: 'dim', targetId: 'old', durationFrames: 20},
          {id: 'b4', atFrame: 74, action: 'show', targetId: 'new', durationFrames: 20},
        ],
        labels: ['Alter Kontext', 'Aktueller Kontext', 'Neue Information'],
      };

    case 'data-flow':
      return {
        ...storyboard,
        elements: [
          {id: 'input', kind: 'database', label: 'Datenquelle', emphasis: 'normal'},
          {id: 'ai', kind: 'ai-core', label: 'KI', emphasis: 'focus'},
          {id: 'output', kind: 'result', label: 'Ergebnis', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'input', durationFrames: 18},
          {id: 'b2', atFrame: 20, action: 'show', targetId: 'ai', durationFrames: 18},
          {id: 'b3', atFrame: 38, action: 'connect', sourceId: 'input', targetId: 'ai', durationFrames: 30},
          {id: 'b4', atFrame: 72, action: 'connect', sourceId: 'ai', targetId: 'output', durationFrames: 30},
          {id: 'b5', atFrame: 104, action: 'show', targetId: 'output', durationFrames: 20},
        ],
        labels: ['Datenquelle', 'KI', 'Ergebnis'],
      };

    case 'ranking':
      return {
        ...storyboard,
        elements: [
          {id: 'rank-1', kind: 'metric', label: 'Modell A', emphasis: 'success'},
          {id: 'rank-2', kind: 'metric', label: 'Modell B', emphasis: 'focus'},
          {id: 'rank-3', kind: 'metric', label: 'Modell C', emphasis: 'normal'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'rank-1', durationFrames: 18},
          {id: 'b2', atFrame: 12, action: 'show', targetId: 'rank-2', durationFrames: 18},
          {id: 'b3', atFrame: 24, action: 'show', targetId: 'rank-3', durationFrames: 18},
          {id: 'b4', atFrame: 80, action: 'highlight', targetId: 'rank-1', durationFrames: 20},
        ],
        labels: ['Platz 1', 'Platz 2', 'Platz 3'],
      };

    case 'process-chain':
      return {
        ...storyboard,
        elements: [
          {id: 'step-1', kind: 'node', label: 'Eingabe', emphasis: 'normal'},
          {id: 'step-2', kind: 'node', label: 'Analyse', emphasis: 'focus'},
          {id: 'step-3', kind: 'node', label: 'Ausführung', emphasis: 'normal'},
          {id: 'step-4', kind: 'result', label: 'Ergebnis', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'step-1', durationFrames: 16},
          {id: 'b2', atFrame: 28, action: 'show', targetId: 'step-2', durationFrames: 16},
          {id: 'b3', atFrame: 56, action: 'show', targetId: 'step-3', durationFrames: 16},
          {id: 'b4', atFrame: 84, action: 'show', targetId: 'step-4', durationFrames: 18},
          {id: 'b5', atFrame: 112, action: 'complete', targetId: 'step-4', durationFrames: 18},
        ],
        labels: ['Eingabe', 'Analyse', 'Ausführung', 'Ergebnis'],
      };

    case 'agent-loop':
      return {
        ...storyboard,
        elements: [
          {id: 'ai', kind: 'ai-core', label: 'KI-Agent', emphasis: 'focus'},
          {id: 'plan', kind: 'node', label: 'Planen', emphasis: 'normal'},
          {id: 'act', kind: 'node', label: 'Ausführen', emphasis: 'normal'},
          {id: 'check', kind: 'node', label: 'Prüfen', emphasis: 'success'},
        ],
        beats: [
          {id: 'b1', atFrame: 0, action: 'show', targetId: 'ai', durationFrames: 18},
          {id: 'b2', atFrame: 24, action: 'show', targetId: 'plan', durationFrames: 16},
          {id: 'b3', atFrame: 50, action: 'show', targetId: 'act', durationFrames: 16},
          {id: 'b4', atFrame: 76, action: 'show', targetId: 'check', durationFrames: 16},
          {id: 'b5', atFrame: 104, action: 'pulse', targetId: 'ai', durationFrames: 24},
        ],
        labels: ['Planen', 'Ausführen', 'Prüfen'],
      };

    case 'input-output':
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
