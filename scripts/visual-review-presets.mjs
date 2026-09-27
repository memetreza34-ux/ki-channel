export const VISUAL_REVIEW_PRESETS = Object.freeze({
  gpt56: {
    compositionId: 'KI-Gpt56ChatGPT',
    frames: [36, 150, 270, 390, 520, 610, 700, 815, 910, 1010, 1125, 1230, 1340, 1440],
    outputDir: 'ki/reels/2026-09-21_bis_2026-09-27/03_GPT-5-6-welches-ChatGPT-nutzt-du/05-export/visual-review',
  },
  gpt55: {
    compositionId: 'KI-Gpt55Retirement',
    frames: [30, 120, 210, 330, 390, 510, 570, 690, 750, 870, 930, 1050],
    outputDir: 'ki/reels/2026-09-21_bis_2026-09-27/04_GPT-5-5-fliegt-aus-ChatGPT-raus/05-export/visual-review',
  },
  voiceplugins: {
    compositionId: 'KI-ChatGPTVoicePlugins',
    frames: [24, 120, 240, 330, 450, 540, 660, 750, 870, 960, 1080, 1170, 1290, 1380],
    outputDir: 'ki/reels/2026-09-28_bis_2026-10-04/01_ChatGPT-Voice-kann-jetzt-Plugins-benutzen/05-export/visual-review',
  },
});

export const getVisualReviewPreset = (name) => {
  const preset = VISUAL_REVIEW_PRESETS[name];
  if (!preset) {
    throw new Error(`unknown visual review preset: ${name}`);
  }
  return preset;
};