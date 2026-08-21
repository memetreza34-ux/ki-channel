import {staticFile} from 'remotion';

export const todayKnowledgeAsset = (id: 'voiceover'): string => {
  if (id === 'voiceover') return staticFile('reels/why-ai-does-not-know-today/audio/voiceover.wav');
  throw new Error(`Unbekanntes Asset: ${String(id)}`);
};
