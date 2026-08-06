import {staticFile} from 'remotion';

export const misunderstandingAsset = (id: 'voiceover'): string => {
  if (id === 'voiceover') {
    return staticFile('reels/why-ai-misunderstands-you/audio/voiceover.wav');
  }
  throw new Error(`Unbekanntes Asset: ${id satisfies never}`);
};
