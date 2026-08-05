import {staticFile} from 'remotion';

export const HALLUCINATION_PUBLIC_ROOT = 'reels/why-ai-hallucinates';

export const HALLUCINATION_ASSETS = {
  scene01: `${HALLUCINATION_PUBLIC_ROOT}/images/scene-01-confident-answer.png`,
  scene03: `${HALLUCINATION_PUBLIC_ROOT}/images/scene-03-pattern-gap-machine.png`,
  scene04: `${HALLUCINATION_PUBLIC_ROOT}/images/scene-04-risk-documents.png`,
  scene08: `${HALLUCINATION_PUBLIC_ROOT}/images/scene-08-verification-desk.png`,
  voiceover: `${HALLUCINATION_PUBLIC_ROOT}/audio/voiceover.wav`,
} as const;

export type HallucinationAssetId = keyof typeof HALLUCINATION_ASSETS;

export const hallucinationAsset = (assetId: HallucinationAssetId): string =>
  staticFile(HALLUCINATION_ASSETS[assetId]);
