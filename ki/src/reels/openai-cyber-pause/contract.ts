export const OPENAI_CYBER_PAUSE_COMPOSITION_ID = 'KI-OpenAICyberPause';
export const OPENAI_CYBER_PAUSE_FPS = 30;
export const OPENAI_CYBER_PAUSE_WIDTH = 1080;
export const OPENAI_CYBER_PAUSE_HEIGHT = 1920;

// 61.888 s measured from the supplied Phase-3 render/audio on 2026-08-22.
// The timeline is now voice-locked instead of using the former 54.8 s Phase-1 estimate.
export const OPENAI_CYBER_PAUSE_DURATION_IN_FRAMES = 1857;

export type OpenAICyberPauseIcon = 'brake' | 'pause' | 'shield' | 'sandbox' | 'balance';

export type OpenAICyberPauseScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: OpenAICyberPauseIcon;
};

export type OpenAICyberPauseWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type OpenAICyberPauseCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words: OpenAICyberPauseWord[];
};

type PhraseWindow = readonly [startFrame: number, endFrame: number, wordCount: number];

const spreadWords = (tokens: string[], startFrame: number, endFrame: number): OpenAICyberPauseWord[] => {
  const weights = tokens.map((token) => Math.max(2, token.replace(/[^\p{L}\p{N}]/gu, '').length));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let accumulated = 0;
  let cursor = startFrame;

  return tokens.map((token, index) => {
    accumulated += weights[index];
    const next = index === tokens.length - 1
      ? endFrame
      : Math.max(cursor + 1, Math.round(startFrame + ((endFrame - startFrame) * accumulated) / total));
    const word = {text: token, startFrame: cursor, endFrame: next};
    cursor = next;
    return word;
  });
};

const cue = (
  sceneId: string,
  startFrame: number,
  endFrame: number,
  text: string,
  phraseWindows: PhraseWindow[],
): OpenAICyberPauseCue => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const words: OpenAICyberPauseWord[] = [];
  let tokenCursor = 0;

  phraseWindows.forEach(([phraseStart, phraseEnd, wordCount]) => {
    const phraseTokens = tokens.slice(tokenCursor, tokenCursor + wordCount);
    if (phraseTokens.length !== wordCount) {
      throw new Error(`Invalid voice-lock phrase window for ${sceneId}: expected ${wordCount} words`);
    }
    words.push(...spreadWords(phraseTokens, phraseStart, phraseEnd));
    tokenCursor += wordCount;
  });

  if (tokenCursor !== tokens.length) {
    throw new Error(`Voice-lock timing does not cover full cue text for ${sceneId}`);
  }

  return {sceneId, startFrame, endFrame, text, words};
};

export const OPENAI_CYBER_PAUSE_SCENES: OpenAICyberPauseScene[] = [
  {sceneId: 'cyber-01', startFrame: 0, endFrame: 387, headline: 'OpenAI tritt auf die Bremse', icon: 'brake'},
  {sceneId: 'cyber-02', startFrame: 387, endFrame: 751, headline: 'Zwei Wochen Trainingspause', icon: 'pause'},
  {sceneId: 'cyber-03', startFrame: 751, endFrame: 1192, headline: 'Drei Schutzschichten', icon: 'shield'},
  {sceneId: 'cyber-04', startFrame: 1192, endFrame: 1523, headline: 'Astra läuft strenger isoliert', icon: 'sandbox'},
  {sceneId: 'cyber-05', startFrame: 1523, endFrame: 1857, headline: 'Fähigkeit und Schutz zusammen', icon: 'balance'},
];

// Voice-locked against the supplied 61.888 s render. Pauses are intentionally left without captions.
export const OPENAI_CYBER_PAUSE_SUBTITLES: OpenAICyberPauseCue[] = [
  cue('cyber-01', 15, 133, 'OpenAI hat die Entwicklung seiner neuesten Modelle bewusst verlangsamt.', [[15, 133, 9]]),
  cue('cyber-01', 147, 366, 'Der Grund: Ein kommendes Modell namens Astra könnte laut internen Tests eine kritische Schwelle bei Cyber-Fähigkeiten erreichen.', [[147, 160, 2], [176, 366, 15]]),
  cue('cyber-02', 387, 577, 'Deshalb pausierte OpenAI zwei Wochen lang das Reinforcement-Learning-Training für Modelle, die für den Einsatz vorgesehen sind.', [[387, 577, 16]]),
  cue('cyber-02', 597, 724, 'Der größte geplante Frontier-RL-Lauf ist laut OpenAI weiterhin angehalten.', [[597, 724, 9]]),
  cue('cyber-03', 751, 954, 'Statt einfach weiterzuskalieren, baut OpenAI drei Schutzschichten aus: Monitoring, Alignment und Security.', [[751, 798, 3], [807, 870, 5], [885, 904, 1], [912, 954, 3]]),
  cue('cyber-03', 976, 1169, 'Riskante Modellaktivität soll erkannt, unerlaubtes Verhalten reduziert und der Zugriff auf Systeme begrenzt werden.', [[976, 1039, 4], [1052, 1101, 3], [1111, 1169, 7]]),
  cue('cyber-04', 1192, 1254, 'Bei Astra gelten inzwischen strengere Regeln.', [[1192, 1254, 6]]),
  cue('cyber-04', 1273, 1499, 'Workloads mit Code oder Tools werden stärker isoliert, Netzwerkzugriffe eingeschränkt und verdächtige Aktivitäten mehrstufig überwacht.', [[1273, 1358, 8], [1370, 1414, 2], [1424, 1499, 5]]),
  cue('cyber-05', 1523, 1649, 'Das bedeutet nicht, dass Astra außer Kontrolle geraten ist.', [[1523, 1600, 5], [1615, 1649, 4]]),
  cue('cyber-05', 1666, 1845, 'Es zeigt etwas anderes: Je leistungsfähiger KI wird, desto stärker müssen Sicherheitsmaßnahmen schon während Training und Tests mitwachsen.', [[1666, 1714, 4], [1724, 1845, 14]]),
];
