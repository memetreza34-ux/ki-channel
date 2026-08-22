export const OPENAI_CYBER_PAUSE_COMPOSITION_ID = 'KI-OpenAICyberPause';
export const OPENAI_CYBER_PAUSE_FPS = 30;
export const OPENAI_CYBER_PAUSE_WIDTH = 1080;
export const OPENAI_CYBER_PAUSE_HEIGHT = 1920;
export const OPENAI_CYBER_PAUSE_DURATION_IN_FRAMES = 1644;

export type OpenAICyberPauseIcon = 'brake' | 'pause' | 'shield' | 'sandbox' | 'balance';

export type OpenAICyberPauseScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: OpenAICyberPauseIcon;
};

export type OpenAICyberPauseCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text: string; startFrame: number; endFrame: number}>;
};

export const OPENAI_CYBER_PAUSE_SCENES: OpenAICyberPauseScene[] = [
  {sceneId: 'cyber-01', startFrame: 0, endFrame: 324, headline: 'OpenAI tritt auf die Bremse', icon: 'brake'},
  {sceneId: 'cyber-02', startFrame: 324, endFrame: 660, headline: 'Zwei Wochen Trainingspause', icon: 'pause'},
  {sceneId: 'cyber-03', startFrame: 660, endFrame: 1020, headline: 'Drei Schutzschichten', icon: 'shield'},
  {sceneId: 'cyber-04', startFrame: 1020, endFrame: 1308, headline: 'Astra läuft strenger isoliert', icon: 'sandbox'},
  {sceneId: 'cyber-05', startFrame: 1308, endFrame: 1644, headline: 'Fähigkeit und Schutz zusammen', icon: 'balance'},
];

export const OPENAI_CYBER_PAUSE_SUBTITLES: OpenAICyberPauseCue[] = [
  {sceneId: 'cyber-01', startFrame: 0, endFrame: 144, text: 'OpenAI hat die Entwicklung seiner neuesten Modelle bewusst verlangsamt.'},
  {sceneId: 'cyber-01', startFrame: 144, endFrame: 324, text: 'Der Grund: Ein kommendes Modell namens Astra könnte laut internen Tests eine kritische Schwelle bei Cyber-Fähigkeiten erreichen.'},
  {sceneId: 'cyber-02', startFrame: 324, endFrame: 504, text: 'Deshalb pausierte OpenAI zwei Wochen lang das Reinforcement-Learning-Training für Modelle, die für den Einsatz vorgesehen sind.'},
  {sceneId: 'cyber-02', startFrame: 504, endFrame: 660, text: 'Der größte geplante Frontier-RL-Lauf ist laut OpenAI weiterhin angehalten.'},
  {sceneId: 'cyber-03', startFrame: 660, endFrame: 828, text: 'Statt einfach weiterzuskalieren, baut OpenAI drei Schutzschichten aus: Monitoring, Alignment und Security.'},
  {sceneId: 'cyber-03', startFrame: 828, endFrame: 1020, text: 'Riskante Modellaktivität soll erkannt, unerlaubtes Verhalten reduziert und der Zugriff auf Systeme begrenzt werden.'},
  {sceneId: 'cyber-04', startFrame: 1020, endFrame: 1128, text: 'Bei Astra gelten inzwischen strengere Regeln.'},
  {sceneId: 'cyber-04', startFrame: 1128, endFrame: 1308, text: 'Workloads mit Code oder Tools werden stärker isoliert, Netzwerkzugriffe eingeschränkt und verdächtige Aktivitäten mehrstufig überwacht.'},
  {sceneId: 'cyber-05', startFrame: 1308, endFrame: 1446, text: 'Das bedeutet nicht, dass Astra außer Kontrolle geraten ist.'},
  {sceneId: 'cyber-05', startFrame: 1446, endFrame: 1644, text: 'Es zeigt etwas anderes: Je leistungsfähiger KI wird, desto stärker müssen Sicherheitsmaßnahmen schon während Training und Tests mitwachsen.'},
];
