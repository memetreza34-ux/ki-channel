export type MotionReferenceUsageMode =
  | 'official-reference'
  | 'source-reference'
  | 'cli-source-reference'
  | 'inspiration-only';

export type MotionReferenceRuntimePolicy =
  | 'repo-runtime'
  | 'copy-adapt-after-license-check'
  | 'reference-only-do-not-install';

export type MotionReferenceSource = {
  id: string;
  name: string;
  repository: string;
  defaultBranch: string;
  usageMode: MotionReferenceUsageMode;
  runtimePolicy: MotionReferenceRuntimePolicy;
  license: 'MIT' | 'OFFICIAL_DOCS';
  licenseVerified: boolean;
  strengths: readonly string[];
  usefulFor: readonly string[];
  queryHints: readonly string[];
  notes: string;
};

/**
 * Curated implementation references for Phase-1/Phase-3 Remotion work.
 *
 * This catalog is planning metadata only. Production render code must never
 * fetch these repositories or depend on them at render time.
 */
export const MOTION_REFERENCE_SOURCES: readonly MotionReferenceSource[] = [
  {
    id: 'remotion-official',
    name: 'Remotion official docs and repository',
    repository: 'remotion-dev/remotion',
    defaultBranch: 'main',
    usageMode: 'official-reference',
    runtimePolicy: 'repo-runtime',
    license: 'OFFICIAL_DOCS',
    licenseVerified: true,
    strengths: ['frame timing', 'paths', 'shapes', 'effects', 'transitions', 'motion blur', 'three', 'lottie', 'rive'],
    usefulFor: ['api truth', 'version compatibility', 'canonical implementation patterns'],
    queryHints: ['paths morph', 'effects blur', 'transition', 'motion blur', 'three canvas', 'lottie', 'rive'],
    notes: 'First stop for API and version truth. Never infer an API from a third-party example when official docs can confirm it.',
  },
  {
    id: 'onda',
    name: 'Onda',
    repository: 'degueba/onda',
    defaultBranch: 'main',
    usageMode: 'source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['motion tokens', 'word stagger', 'mask reveal', 'draw-on', 'terminal', 'browser', 'code diff', 'charts', 'camera primitives'],
    usefulFor: ['editorial tech motion', 'software explainers', 'kinetic typography', 'consistent motion language'],
    queryHints: ['word stagger', 'mask reveal', 'terminal', 'browser', 'code diff', 'draw on', 'camera', 'chart'],
    notes: 'Use as mechanism/source reference. Adapt timing, layout, color and hierarchy to the KI channel instead of copying the skin.',
  },
  {
    id: 'remocn',
    name: 'Remocn',
    repository: 'Remocn/remocn',
    defaultBranch: 'main',
    usageMode: 'source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['typography', 'blur reveal', 'matrix decode', 'number motion', 'device mockups', 'frosted glass', 'grid pixelation', 'chromatic transitions'],
    usefulFor: ['hero reveals', 'numbers', 'device scenes', 'high-polish short-form motion'],
    queryHints: ['blur reveal', 'number wheel', 'matrix decode', 'device mockup', 'grid pixel', 'chromatic', 'text build'],
    notes: 'Strong visual reference library. Reuse the motion mechanism only when it matches the semantic beat.',
  },
  {
    id: 'remotion-ui',
    name: 'RemotionUI',
    repository: 'riaz37/remotion-ui',
    defaultBranch: 'main',
    usageMode: 'source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['large component catalog', 'captions', 'audio visualization', 'maps', 'social compositions', 'transitions', 'motion tokens'],
    usefulFor: ['broad mechanism discovery', 'social layouts', 'caption ideas', 'audio-reactive visuals'],
    queryHints: ['kinetic typography', 'caption', 'audio waveform', 'map', 'social', 'transition', 'diagram'],
    notes: 'Discovery source, not a replacement design system. Prefer a small exact-fit mechanism over importing a whole visual grammar.',
  },
  {
    id: 'remotion-bits',
    name: 'Remotion Bits',
    repository: 'av/remotion-bits',
    defaultBranch: 'master',
    usageMode: 'cli-source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['agent search', 'CLI fetch', 'MCP', 'animated text', 'counters', 'code blocks', 'matrix rain', 'staggered motion', '3D scenes'],
    usefulFor: ['agent-driven component discovery', 'small reusable primitives', 'fast source inspection'],
    queryHints: ['animated counter', 'typewriter', 'code block', 'stagger', 'matrix rain', 'scene3d', 'gradient transition'],
    notes: 'Repo already exposes bits:find, bits:fetch and bits:mcp scripts. Fetch is allowed only after visual strategy chooses the mechanism.',
  },
  {
    id: 'rve-templates',
    name: 'React Video Editor Remotion Templates',
    repository: 'reactvideoeditor/remotion-templates',
    defaultBranch: 'main',
    usageMode: 'source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['charts', 'data visualization', 'text motion', 'content animation', 'parallax', 'whip pan', 'pixel transition'],
    usefulFor: ['charts', 'benchmarks', 'simple explainers', 'transition studies'],
    queryHints: ['bar chart', 'line chart', 'donut', 'counter', 'text highlight', 'parallax', 'whip pan', 'pixel transition'],
    notes: 'Useful implementation reference, especially for charts and deterministic SVG motion. Avoid generic template look in final production.',
  },
  {
    id: 'snapcn',
    name: 'snapcn',
    repository: 'snapcndev/snapcn',
    defaultBranch: 'main',
    usageMode: 'source-reference',
    runtimePolicy: 'copy-adapt-after-license-check',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['AI chat', 'search typing', 'prompt zoom', 'terminal', 'phone and laptop frames', 'text build', 'logo assembly', 'orbit gallery'],
    usefulFor: ['AI tools', 'software demos', 'terminal and prompt scenes', 'device-centered hero shots'],
    queryHints: ['ai chat', 'prompt', 'search typing', 'terminal', 'phone frame', 'laptop', 'text reveal', 'logo assemble'],
    notes: 'High-value for software/AI stories. Do not force device UI into science or abstract mechanism scenes.',
  },
  {
    id: 'animefx',
    name: 'AnimeFX',
    repository: 'voltwake/animefx',
    defaultBranch: 'master',
    usageMode: 'inspiration-only',
    runtimePolicy: 'reference-only-do-not-install',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['seekable effects', 'shader motion', 'three.js effects', 'effect search', 'composition recipes'],
    usefulFor: ['effect vocabulary', 'shader ideas', 'impact reveals', 'advanced motion studies'],
    queryHints: ['shader', 'premium reveal', 'distortion', 'glitch', 'three', 'seekable effect'],
    notes: 'Reference only: current package requires Node >=22.12 while this repo intentionally runs Node 20. Translate the idea into Remotion-native code instead of installing it.',
  },
  {
    id: 'motion-canvas',
    name: 'Motion Canvas',
    repository: 'motion-canvas/motion-canvas',
    defaultBranch: 'main',
    usageMode: 'inspiration-only',
    runtimePolicy: 'reference-only-do-not-install',
    license: 'MIT',
    licenseVerified: true,
    strengths: ['vector explainers', 'voice-synced choreography', 'diagram animation', 'generator sequencing'],
    usefulFor: ['explanation choreography', 'vector scene design', 'educational motion language'],
    queryHints: ['vector explainer', 'diagram', 'voice sync', 'sequence', 'educational animation'],
    notes: 'Architectural inspiration only. Do not introduce a second video runtime next to Remotion.',
  },
] as const;

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('en-US')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const searchMotionReferences = (query: string): MotionReferenceSource[] => {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return MOTION_REFERENCE_SOURCES
    .map((source) => {
      const corpus = normalize([
        source.id,
        source.name,
        source.repository,
        ...source.strengths,
        ...source.usefulFor,
        ...source.queryHints,
        source.notes,
      ].join(' '));
      const score = tokens.reduce((sum, token) => sum + (corpus.includes(token) ? 1 : 0), 0);
      return {source, score};
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.source.id.localeCompare(b.source.id))
    .map((entry) => entry.source);
};
