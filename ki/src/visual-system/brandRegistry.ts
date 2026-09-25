export type BrandAnchorId = 'chatgpt' | 'github' | 'generic-ai';

export type BrandAnchorDefinition = {
  id: BrandAnchorId;
  label: string;
  categoryIcon: 'bot' | 'git-branch' | 'sparkles';
  officialAssetPath: string | null;
  markKind: 'official-asset' | 'generic-category-icon';
  ownershipNote: string;
};

export const BRAND_ANCHORS: Readonly<Record<BrandAnchorId, BrandAnchorDefinition>> = Object.freeze({
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT',
    categoryIcon: 'bot',
    officialAssetPath: null,
    markKind: 'generic-category-icon',
    ownershipNote: 'ChatGPT is a trademark of OpenAI. Use an official provided asset only when it is stored unmodified in the repository.',
  },
  github: {
    id: 'github',
    label: 'GitHub',
    categoryIcon: 'git-branch',
    officialAssetPath: null,
    markKind: 'generic-category-icon',
    ownershipNote: 'GitHub is a trademark of GitHub, Inc. Use an official provided asset only when it is stored unmodified in the repository.',
  },
  'generic-ai': {
    id: 'generic-ai',
    label: 'AI',
    categoryIcon: 'sparkles',
    officialAssetPath: null,
    markKind: 'generic-category-icon',
    ownershipNote: 'Generic channel-owned category anchor.',
  },
});

export const getBrandAnchor = (id: BrandAnchorId): BrandAnchorDefinition => BRAND_ANCHORS[id];
