import type {AnimationLibraryEntry} from './schema';

export type VisualPrimaryPrimitive =
  | 'card'
  | 'ui'
  | 'typography'
  | 'path'
  | 'nodes'
  | 'object'
  | 'particles'
  | 'chart'
  | 'illustration'
  | 'three-object'
  | 'mixed';

export type VisualCameraMotion =
  | 'locked'
  | 'push'
  | 'pull'
  | 'pan'
  | 'orbit'
  | 'parallax'
  | 'mixed';

export type VisualDepthStyle =
  | 'flat'
  | 'layered-2d'
  | 'pseudo-3d'
  | 'three-3d';

export type VisualEntryMechanism =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'draw'
  | 'assemble'
  | 'morph'
  | 'mask'
  | 'cut'
  | 'depth'
  | 'mixed';

export type VisualMedium =
  | 'remotion-native'
  | 'lottie'
  | 'rive'
  | 'three'
  | 'hybrid';

export type VisualFingerprint = {
  primaryPrimitive: VisualPrimaryPrimitive;
  cameraMotion: VisualCameraMotion;
  depthStyle: VisualDepthStyle;
  entryMechanism: VisualEntryMechanism;
  medium: VisualMedium;
  direction: AnimationLibraryEntry['primaryDirection'];
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
};

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('en-US')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');

const includesAny = (corpus: string, values: readonly string[]): boolean =>
  values.some((value) => corpus.includes(value));

const hasExplicitThreeMarker = (corpus: string): boolean =>
  includesAny(corpus, [
    'three-js',
    'react-three',
    'three-canvas',
    'three-object',
    'webgl',
    'webgpu',
    'r3f-',
  ]);

const entryCorpus = (entry: AnimationLibraryEntry): string =>
  normalize(
    [
      entry.title,
      entry.description,
      entry.visualFamily,
      entry.layoutFamily,
      entry.motionSignature,
      entry.noveltyGroup,
      entry.cameraStyle,
      ...entry.semanticTags,
      ...entry.explanationPatterns,
      ...entry.primitiveTags,
      ...entry.transitionInTags,
      ...entry.transitionOutTags,
    ].join(' '),
  );

const primitiveCorpus = (entry: AnimationLibraryEntry): string =>
  normalize(entry.primitiveTags.join(' '));

const structuralCorpus = (entry: AnimationLibraryEntry): string =>
  normalize(
    [
      entry.title,
      entry.visualFamily,
      entry.layoutFamily,
      entry.motionSignature,
      entry.noveltyGroup,
      ...entry.explanationPatterns,
    ].join(' '),
  );

const inferPrimaryPrimitive = (
  entry: AnimationLibraryEntry,
  corpus: string,
): VisualPrimaryPrimitive => {
  const primitives = primitiveCorpus(entry);
  const structure = structuralCorpus(entry);
  const strong = `${primitives}-${structure}`;

  if (hasExplicitThreeMarker(strong) || hasExplicitThreeMarker(corpus)) {
    return 'three-object';
  }
  if (includesAny(strong, ['chart', 'bar-chart', 'plot-', 'meter-', 'axis-', 'histogram'])) {
    return 'chart';
  }
  if (includesAny(strong, ['kinetic-type', 'typography', 'word-form', 'word-', 'text-strip', 'headline-'])) {
    return 'typography';
  }
  if (includesAny(strong, ['particle', 'spark', 'fragment-cloud', 'data-particles'])) {
    return 'particles';
  }

  // Explicit path primitives are stronger evidence than incidental words such as
  // "node" inside `path-node`. Keep this before network detection.
  if (
    includesAny(primitives, [
      'flow-path',
      'path-node',
      'path-segment',
      'path-line',
      'trace-marker',
      'route-line',
      'route-path',
      'metro-line',
      'track-line',
      'bezier-path',
    ]) ||
    includesAny(structure, [
      'open-path',
      'path-trace',
      'trace-field',
      'workflow-map',
      'route-field',
      'single-route',
      'path-flow',
    ])
  ) {
    return 'path';
  }

  if (
    includesAny(primitives, [
      'network-node',
      'graph-node',
      'node-leaf',
      'star-node',
      'cluster-node',
    ]) ||
    includesAny(structure, [
      'network',
      'cluster',
      'constellation',
      'dependency-bridge',
      'graph-bloom',
      'node-field',
    ])
  ) {
    return 'nodes';
  }

  // Generic connectors/lines only count as a path after stronger network grammar
  // has been ruled out. Do not use broad `route-`/`path-` substring checks here:
  // layout names such as `card-route` are still card-first compositions.
  if (includesAny(primitives, ['connector-line', 'route-connector', 'path-connector'])) {
    return 'path';
  }

  if (includesAny(strong, ['browser', 'terminal', 'window', 'app-', 'interface', 'ui-', 'ui-surface', 'state-control'])) {
    return 'ui';
  }
  if (includesAny(strong, ['illustration', 'metaphor', 'scene-', 'environment'])) {
    return 'illustration';
  }
  if (
    includesAny(strong, [
      'semantic-object',
      'object',
      'device',
      'document',
      'folder',
      'token',
      'phone',
      'cube',
      'prism',
      'layer-plane',
    ])
  ) {
    return 'object';
  }

  const cardDominantInPrimitives = includesAny(primitives, ['card', 'panel', 'tile']);
  const cardDominantInLayout = includesAny(structure, [
    'card-grid',
    'card-stack',
    'card-route',
    'panel-grid',
    'tile-grid',
  ]);
  if (cardDominantInPrimitives || cardDominantInLayout) return 'card';

  return 'mixed';
};

const inferCameraMotion = (
  entry: AnimationLibraryEntry,
  corpus: string,
): VisualCameraMotion => {
  const camera = normalize(entry.cameraStyle);
  if (includesAny(camera, ['orbit', 'arc'])) return 'orbit';
  if (includesAny(camera, ['parallax', 'layer-drift'])) return 'parallax';
  if (includesAny(camera, ['push', 'dolly-in', 'zoom-in'])) return 'push';
  if (includesAny(camera, ['pull', 'dolly-out', 'zoom-out'])) return 'pull';
  if (includesAny(camera, ['pan', 'track', 'lateral'])) return 'pan';
  if (includesAny(camera, ['locked', 'static', 'fixed'])) return 'locked';
  if (includesAny(corpus, ['camera-push', 'depth-forward'])) return 'push';
  if (includesAny(corpus, ['camera-pull', 'depth-backward'])) return 'pull';
  return 'mixed';
};

const inferDepthStyle = (corpus: string): VisualDepthStyle => {
  if (hasExplicitThreeMarker(corpus)) return 'three-3d';
  if (includesAny(corpus, ['pseudo-3d', 'perspective', 'depth-', 'corridor', 'z-axis'])) {
    return 'pseudo-3d';
  }
  if (includesAny(corpus, ['layer', 'stack', 'overlap', 'foreground', 'background'])) {
    return 'layered-2d';
  }
  return 'flat';
};

const inferEntryMechanism = (corpus: string): VisualEntryMechanism => {
  if (includesAny(corpus, ['assemble', 'construct', 'build-up'])) return 'assemble';
  if (includesAny(corpus, ['morph', 'transform-shape', 'shape-match'])) return 'morph';
  if (includesAny(corpus, ['mask', 'iris', 'wipe', 'reveal-window'])) return 'mask';
  if (includesAny(corpus, ['draw', 'trace', 'stroke', 'path-reveal'])) return 'draw';
  if (includesAny(corpus, ['depth', 'camera-push', 'camera-pull', 'z-axis'])) return 'depth';
  if (includesAny(corpus, ['slide', 'travel', 'translate', 'directional-entry'])) return 'slide';
  if (includesAny(corpus, ['scale', 'grow', 'shrink', 'zoom'])) return 'scale';
  if (includesAny(corpus, ['hard-cut', 'cut-impact', 'snap-cut'])) return 'cut';
  if (includesAny(corpus, ['fade', 'opacity'])) return 'fade';
  return 'mixed';
};

const inferMedium = (corpus: string): VisualMedium => {
  if (includesAny(corpus, ['lottie'])) return 'lottie';
  if (includesAny(corpus, ['rive'])) return 'rive';
  if (hasExplicitThreeMarker(corpus)) return 'three';
  if (includesAny(corpus, ['hybrid', 'image-required', 'photo-', 'bitmap-'])) return 'hybrid';
  return 'remotion-native';
};

export const deriveVisualFingerprint = (
  entry: AnimationLibraryEntry,
): VisualFingerprint => {
  const corpus = entryCorpus(entry);
  return {
    primaryPrimitive: inferPrimaryPrimitive(entry, corpus),
    cameraMotion: inferCameraMotion(entry, corpus),
    depthStyle: inferDepthStyle(corpus),
    entryMechanism: inferEntryMechanism(corpus),
    medium: inferMedium(corpus),
    direction: entry.primaryDirection,
    visualFamily: entry.visualFamily,
    layoutFamily: entry.layoutFamily,
    motionSignature: entry.motionSignature,
  };
};

export const visualFingerprintSimilarityScore = (
  a: VisualFingerprint,
  b: VisualFingerprint,
): number => {
  let score = 0;
  if (a.primaryPrimitive === b.primaryPrimitive) score += 0.24;
  if (a.cameraMotion === b.cameraMotion) score += 0.14;
  if (a.depthStyle === b.depthStyle) score += 0.12;
  if (a.entryMechanism === b.entryMechanism) score += 0.14;
  if (a.medium === b.medium) score += 0.08;
  if (a.direction === b.direction) score += 0.08;
  if (a.visualFamily === b.visualFamily) score += 0.1;
  if (a.layoutFamily === b.layoutFamily) score += 0.05;
  if (a.motionSignature === b.motionSignature) score += 0.05;
  return Number(score.toFixed(4));
};

export const visualSimilarityScore = (
  left: AnimationLibraryEntry,
  right: AnimationLibraryEntry,
): number =>
  visualFingerprintSimilarityScore(
    deriveVisualFingerprint(left),
    deriveVisualFingerprint(right),
  );

export const VISUAL_SIMILARITY_SOFT_LIMIT = 0.7;
export const VISUAL_SIMILARITY_HARD_LIMIT = 0.82;

export const findVisualDiversityWarnings = (
  entries: readonly AnimationLibraryEntry[],
): string[] => {
  const warnings: string[] = [];
  for (let index = 1; index < entries.length; index += 1) {
    const previous = entries[index - 1];
    const current = entries[index];
    const similarity = visualSimilarityScore(previous, current);
    if (similarity >= VISUAL_SIMILARITY_SOFT_LIMIT) {
      const fingerprint = deriveVisualFingerprint(current);
      warnings.push(
        `adjacent animations ${previous.animationId} and ${current.animationId} are visually similar (${Math.round(similarity * 100)}%): ${fingerprint.primaryPrimitive}/${fingerprint.cameraMotion}/${fingerprint.depthStyle}/${fingerprint.entryMechanism}`,
      );
    }
  }

  for (let index = 2; index < entries.length; index += 1) {
    const trio = entries.slice(index - 2, index + 1).map(deriveVisualFingerprint);
    if (new Set(trio.map((item) => item.primaryPrimitive)).size === 1) {
      warnings.push(
        `three consecutive animations repeat primary primitive ${trio[0].primaryPrimitive}`,
      );
    }
    if (trio.every((item) => item.cameraMotion === 'locked')) {
      warnings.push('three consecutive animations use a locked camera');
    }
    if (trio.every((item) => item.depthStyle === 'flat')) {
      warnings.push('three consecutive animations remain visually flat');
    }
  }

  return [...new Set(warnings)];
};
