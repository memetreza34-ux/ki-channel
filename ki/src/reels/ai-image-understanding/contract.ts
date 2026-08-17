export const AI_IMAGE_UNDERSTANDING_COMPOSITION_ID = 'KI-AIImageUnderstanding';
export const AI_IMAGE_UNDERSTANDING_FPS = 30;
export const AI_IMAGE_UNDERSTANDING_WIDTH = 1080;
export const AI_IMAGE_UNDERSTANDING_HEIGHT = 1920;
export const AI_IMAGE_UNDERSTANDING_DURATION_IN_FRAMES = 1710;
export const AI_IMAGE_UNDERSTANDING_CAPTION_ZONE_Y = 1440;

export type AIImageScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: 'image' | 'grid' | 'link' | 'warning' | 'target';
};

export type AIImageCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text: string; startFrame: number; endFrame: number}>;
};

export const AI_IMAGE_UNDERSTANDING_SCENES: AIImageScene[] = [
  {sceneId: 'image-01', startFrame: 0, endFrame: 285, headline: 'Ein Bild beginnt als Zahlen', icon: 'image'},
  {sceneId: 'image-02', startFrame: 285, endFrame: 620, headline: 'Bildteile werden Merkmale', icon: 'grid'},
  {sceneId: 'image-03', startFrame: 620, endFrame: 955, headline: 'Sehen trifft Sprache', icon: 'link'},
  {sceneId: 'image-04', startFrame: 955, endFrame: 1225, headline: 'Auch Bild-KI irrt', icon: 'warning'},
  {sceneId: 'image-05', startFrame: 1225, endFrame: 1710, headline: 'Gib der KI Fokus', icon: 'target'},
];

export const AI_IMAGE_UNDERSTANDING_SUBTITLES: AIImageCue[] = [
  {sceneId: 'image-01', startFrame: 0, endFrame: 145, text: 'Für eine KI ist ein Foto nicht zuerst Katze, Auto oder Text.'},
  {sceneId: 'image-01', startFrame: 145, endFrame: 285, text: 'Es beginnt als Bilddaten: viele Zahlen für Helligkeit und Farbe.'},
  {sceneId: 'image-02', startFrame: 285, endFrame: 460, text: 'Moderne Bildmodelle zerlegen diese Daten häufig in kleinere Bereiche und übersetzen sie in interne Zahlenrepräsentationen.'},
  {sceneId: 'image-02', startFrame: 460, endFrame: 620, text: 'Dadurch entstehen Merkmale für Formen, Kanten, Farben und Beziehungen zwischen Bildteilen.'},
  {sceneId: 'image-03', startFrame: 620, endFrame: 760, text: 'Diese visuellen Informationen werden anschließend mit Sprache verknüpft.'},
  {sceneId: 'image-03', startFrame: 760, endFrame: 955, text: 'Deshalb kann ein multimodales Modell beschreiben, was es erkennt, Fragen zum Bild beantworten oder Text im Bild einordnen.'},
  {sceneId: 'image-04', startFrame: 955, endFrame: 1060, text: 'Aber das ist kein menschliches Sehen.'},
  {sceneId: 'image-04', startFrame: 1060, endFrame: 1225, text: 'Kleine Schrift, ungewöhnliche Perspektiven, verdeckte Objekte oder komplizierte räumliche Beziehungen können das Modell trotzdem verwirren.'},
  {sceneId: 'image-05', startFrame: 1225, endFrame: 1465, text: 'Genau deshalb hilft ein präziser Bild-Prompt: Sag, welche Aufgabe du hast, welcher Bereich wichtig ist und in welchem Format du die Antwort brauchst.'},
  {sceneId: 'image-05', startFrame: 1465, endFrame: 1710, text: 'Je klarer der Fokus, desto weniger muss die KI aus dem gesamten Bild selbst erraten.'},
];
