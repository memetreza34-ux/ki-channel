import {staticFile} from 'remotion';

export const contextWindowAsset = (id: 'voiceover'): string => {
  if (id === 'voiceover') {
    return staticFile('reels/why-ai-forgets-earlier-messages/audio/voiceover.wav');
  }
  throw new Error(`Unbekanntes Asset: ${String(id)}`);
};