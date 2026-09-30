export const VISUAL_QUALITY_V4 = {
  version: 4,
  compositionId: 'KI-Reel-AI-Arithmetic-Reasoning',
  fps: 30,
  scenes: [
    {sceneId: 'arithmetic-01', startFrame: 0, durationFrames: 210, visualVerb: 'fractures'},
    {sceneId: 'arithmetic-02', startFrame: 210, durationFrames: 290, visualVerb: 'decomposes'},
    {sceneId: 'arithmetic-03', startFrame: 500, durationFrames: 280, visualVerb: 'cascades'},
    {sceneId: 'arithmetic-04', startFrame: 780, durationFrames: 250, visualVerb: 'routes'},
    {sceneId: 'arithmetic-05', startFrame: 1030, durationFrames: 230, visualVerb: 'locks'},
  ],
  targetScores: {
    hook: 9,
    semanticClarity: 9,
    storyMotion: 9,
    visualVariety: 9,
    readability: 9,
    overall: 9,
  },
} as const;

export const assertVisualQualityV4 = (
  contract: typeof VISUAL_QUALITY_V4 = VISUAL_QUALITY_V4,
): void => {
  if (contract.version !== 4) throw new Error('Arithmetic reel requires Visual Quality V4.');
  if (contract.scenes.length < 4) throw new Error('Arithmetic reel needs at least four visual story scenes.');
  if (contract.scenes[0]?.startFrame !== 0) throw new Error('Arithmetic hook must start at frame 0.');

  let expectedStart = 0;
  for (const scene of contract.scenes) {
    if (scene.startFrame !== expectedStart) {
      throw new Error(`Visual Quality V4 scene ${scene.sceneId} is not contiguous.`);
    }
    if (scene.durationFrames < 24) throw new Error(`Scene ${scene.sceneId} is too short.`);
    expectedStart += scene.durationFrames;
  }

  for (const score of Object.values(contract.targetScores)) {
    if (score < 8) throw new Error('Arithmetic reel V4 target scores must stay at 8/10 or above.');
  }
};

assertVisualQualityV4();
