export const CREATIVE_RECIPE_IDS = Object.freeze([
  'object-morph-stage',
  'path-trace-field',
  'network-bloom',
  'xray-overlay',
  'typographic-construct',
  'cutaway-stack',
  'depth-corridor',
  'ui-state-machine',
]);

export const CREATIVE_RECIPE_RENDER_CONTRACT = Object.freeze({
  version: 1,
  entryPoint: 'ki/src/animation-library/remotion-entry.tsx',
  outputDir: 'out/creative-recipes',
  fps: 30,
  width: 1080,
  height: 1100,
  durationInFrames: 180,
  checkpoints: Object.freeze([0, 30, 60, 90, 120, 150, 179]),
  smokeCheckpoints: Object.freeze([0, 90, 179]),
  videoFileName: 'recipe.mp4',
});

export const CREATIVE_RECIPE_REVIEW_EXPECTATIONS = Object.freeze({
  'object-morph-stage': Object.freeze({
    label: 'Object Morph Stage',
    expectedBehavior:
      'Ein semantisches Objekt muss sichtbar seine Form und Bedeutung verändern; das Ergebnis darf nicht nur ein umbeschriftetes Panel sein.',
  }),
  'path-trace-field': Object.freeze({
    label: 'Path Trace Field',
    expectedBehavior:
      'Ein klar verfolgbarer Pfad muss Ursache, Prozess oder Übergabe erklären und in einem eindeutigen Endzustand landen.',
  }),
  'network-bloom': Object.freeze({
    label: 'Network Bloom',
    expectedBehavior:
      'Beziehungen zwischen Knoten müssen sichtbar entstehen, gewichtet oder entfernt werden; das Netzwerk braucht eine verständliche Aussage.',
  }),
  'xray-overlay': Object.freeze({
    label: 'X-Ray Overlay',
    expectedBehavior:
      'Ein Scan oder eine Maske muss verborgene Ursache, Fehler oder Struktur aufdecken und den relevanten Befund klar isolieren.',
  }),
  'typographic-construct': Object.freeze({
    label: 'Typographic Construct',
    expectedBehavior:
      'Typografie selbst muss die Bedeutung konstruieren, ordnen oder transformieren statt nur als Überschrift über einer Karte zu stehen.',
  }),
  'cutaway-stack': Object.freeze({
    label: 'Cutaway Stack',
    expectedBehavior:
      'Mehrere Bedeutungsebenen müssen räumlich getrennt werden, damit innere Struktur, Ursache oder Schichtung lesbar wird.',
  }),
  'depth-corridor': Object.freeze({
    label: 'Depth Corridor',
    expectedBehavior:
      'Die Kamera muss durch Bedeutungsebenen führen; Tiefe und Bewegung müssen den inhaltlichen Fortschritt erklären.',
  }),
  'ui-state-machine': Object.freeze({
    label: 'UI State Machine',
    expectedBehavior:
      'UI ist nur zulässig, wenn ein echter Zustandswechsel mit Trigger, Transition und bestätigtem Ergebnis sichtbar wird.',
  }),
});

export const assertCreativeRecipeReleaseContract = () => {
  const uniqueIds = new Set(CREATIVE_RECIPE_IDS);
  if (uniqueIds.size !== CREATIVE_RECIPE_IDS.length) {
    throw new Error('Creative-Recipe-Release-Contract enthält doppelte Recipe-IDs.');
  }
  for (const recipeId of CREATIVE_RECIPE_IDS) {
    if (!CREATIVE_RECIPE_REVIEW_EXPECTATIONS[recipeId]) {
      throw new Error(`Creative-Recipe-Review-Erwartung fehlt: ${recipeId}`);
    }
  }
  const {checkpoints, smokeCheckpoints, durationInFrames, width, height, fps} =
    CREATIVE_RECIPE_RENDER_CONTRACT;
  if (width !== 1080 || height !== 1100 || fps !== 30 || durationInFrames !== 180) {
    throw new Error('Creative-Recipe-Renderformat ist unerwartet verändert worden.');
  }
  for (const frame of [...checkpoints, ...smokeCheckpoints]) {
    if (!Number.isInteger(frame) || frame < 0 || frame >= durationInFrames) {
      throw new Error(`Ungültiger Creative-Recipe-Checkpoint: ${frame}`);
    }
  }
};

assertCreativeRecipeReleaseContract();
