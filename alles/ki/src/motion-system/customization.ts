import type {MotionStoryboard} from './schema';

export type MotionStoryboardCustomization = {
  elementLabels?: Record<string, string>;
  labels?: string[];
};

const normalizeLabel = (label: string, context: string): string => {
  const normalized = label.trim();
  if (!normalized) {
    throw new Error(`${context} darf nicht leer sein.`);
  }
  return normalized;
};

export const customizeMotionStoryboard = (
  storyboard: MotionStoryboard,
  customization: MotionStoryboardCustomization = {},
): MotionStoryboard => {
  const elementLabels = customization.elementLabels ?? {};
  const knownElementIds = new Set(storyboard.elements.map((element) => element.id));
  const unknownElementIds = Object.keys(elementLabels).filter(
    (elementId) => !knownElementIds.has(elementId),
  );

  if (unknownElementIds.length > 0) {
    throw new Error(
      `Unbekannte Element-IDs für Label-Anpassung: ${unknownElementIds.join(', ')}`,
    );
  }

  const elements = storyboard.elements.map((element) => {
    const customLabel = elementLabels[element.id];
    if (customLabel === undefined) return element;

    return {
      ...element,
      label: normalizeLabel(customLabel, `Label für ${element.id}`),
    };
  });

  const labels = customization.labels === undefined
    ? storyboard.labels
    : customization.labels.map((label, index) =>
        normalizeLabel(label, `Sichtbares Label ${index + 1}`),
      );

  return {
    ...storyboard,
    elements,
    labels,
  };
};
