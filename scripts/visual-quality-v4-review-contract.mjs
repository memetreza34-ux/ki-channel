export const SEVERE_V4_WARNINGS = new Set([
  'EMPTY_HOOK_START',
  'HOOK_TOO_STATIC_FIRST_SECOND',
  'NO_VISIBLE_STORY_CHANGE',
  'STATIC_SCENE_HOLD',
  'WASHED_OUT_SCENE',
  'UNDERBUILT_SCENE',
  'HERO_FOOTPRINT_TOO_SMALL',
]);

export const evaluateHookReview = ({frame0, earlyPairDifferences = []}) => {
  const warnings = [];
  const tinyFootprint = !frame0 || ((frame0.activeCellRatio ?? 0) < 0.08 && (frame0.edgeDensity ?? 0) < 0.012);
  const smoothEmpty = !frame0 || ((frame0.edgeDensity ?? 0) < 0.006 && (frame0.luminanceStdDev ?? 0) < 18);
  if (tinyFootprint || smoothEmpty || frame0?.warnings?.includes('EMPTY_OR_UNDERBUILT_FRAME')) warnings.push('EMPTY_HOOK_START');

  const meaningfulChanges = earlyPairDifferences.filter((value) => value >= 7).length;
  if (earlyPairDifferences.length >= 2 && meaningfulChanges < 2) warnings.push('HOOK_TOO_STATIC_FIRST_SECOND');
  return warnings;
};

export const evaluateSceneReview = ({scene, samples = [], pairDifferences = [], startEndDifference = 0}) => {
  const warnings = [];
  if (startEndDifference < 7) warnings.push('NO_VISIBLE_STORY_CHANGE');

  const nearStatic = pairDifferences.filter((value) => value < 3.5).length;
  const lowChange = pairDifferences.filter((value) => value < 7).length;
  if (scene?.motionPlan?.intentionalStillness !== true && (nearStatic >= 2 || lowChange >= 3)) warnings.push('STATIC_SCENE_HOLD');

  const washed = samples.filter((sample) => sample.warnings?.includes('LOW_CONTRAST_WASHED_OUT')).length;
  if (washed >= Math.max(1, Math.ceil(samples.length / 2))) warnings.push('WASHED_OUT_SCENE');

  const underbuilt = samples.filter((sample) => sample.warnings?.includes('EMPTY_OR_UNDERBUILT_FRAME')).length;
  if (underbuilt >= Math.max(1, Math.ceil(samples.length / 2))) warnings.push('UNDERBUILT_SCENE');

  const footprint = samples.map((sample) => sample.activeCellRatio ?? 0);
  const maxFootprint = footprint.length ? Math.max(...footprint) : 0;
  const target = scene?.hero?.screenAreaTarget ?? 0.22;
  if (target >= 0.28 && maxFootprint < 0.16) warnings.push('HERO_FOOTPRINT_TOO_SMALL');

  return [...new Set(warnings)];
};

export const summarizeV4Review = ({hookWarnings = [], sceneReports = []}) => {
  const warnings = [
    ...hookWarnings.map((type) => ({type, scope: 'hook'})),
    ...sceneReports.flatMap((report) => report.warnings.map((type) => ({type, scope: report.sceneId}))),
  ];
  const severeWarnings = warnings.filter((warning) => SEVERE_V4_WARNINGS.has(warning.type));
  return {
    automatedStatus: severeWarnings.length === 0 ? 'PASS' : 'FAIL',
    humanCreativeStatus: 'REQUIRED',
    warnings,
    severeWarnings,
  };
};
