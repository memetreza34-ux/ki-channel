import {
  CHANNEL_CONTENT_MODES,
  planChannelContentMode,
  type ChannelContentModePlan,
} from './channelContentModes';

export const resolveChannelContentMode = (
  text: string,
): ChannelContentModePlan => {
  const planned = planChannelContentMode(text);
  const highestScore = planned.scores[0]?.score ?? 0;
  if (highestScore > 0) return planned;

  const fallback = CHANNEL_CONTENT_MODES.find(
    (mode) => mode.modeId === 'concept-explainer',
  );
  if (!fallback) throw new Error('concept-explainer fallback mode is missing');

  return {
    ...planned,
    primaryMode: fallback,
    secondaryModes: [],
    visualSources: [
      ...new Set([
        ...fallback.requiredVisualSources,
        ...fallback.optionalVisualSources.slice(0, 1),
      ]),
    ],
    productionRules: [
      'Animate the sentence through one visible cause, transformation, relationship, or result.',
      'Use kinetic subtitles for every spoken word and semantic emphasis only on important words.',
      'Keep Hold → Movement → Hold and reject decorative motion without explanatory value.',
      ...fallback.forbiddenShortcuts.map((shortcut) => `Avoid: ${shortcut}.`),
    ],
  };
};
