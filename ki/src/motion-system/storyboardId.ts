import type {MotionVisualType} from './schema';

const hashText = (value: string): string => {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
};

export const createMotionStoryboardId = (
  sentence: string,
  visualType: MotionVisualType,
): string => {
  const normalizedSentence = sentence.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!normalizedSentence) {
    throw new Error('Für die Storyboard-ID wird ein nicht leerer Satz benötigt.');
  }

  return `motion-${visualType}-${hashText(`${visualType}:${normalizedSentence}`)}`;
};
