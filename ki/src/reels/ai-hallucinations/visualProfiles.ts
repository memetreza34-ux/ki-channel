import {getAnimationLibraryEntry} from '../../animation-library/catalog';
import {
  assertAuthoredVisualDiversity,
  evaluateAuthoredVisualDiversity,
  type AuthoredVisualScene,
} from '../../animation-library/authoredProductionGate';
import {deriveVisualFingerprint} from '../../animation-library/visualFingerprint';
import reelJson from '../../../reels/2026-08-10_bis_2026-08-16/01_Warum-KI-Dinge-erfindet/06-projektdateien/reel.json';

type HallucinationVisualSourceScene = {
  sceneId: string;
  animationId: string;
};

const sourceScenes = (reelJson as {scenes: HallucinationVisualSourceScene[]}).scenes;

export const HALLUCINATION_VISUAL_MANIFEST = Object.freeze(
  sourceScenes.map((scene): AuthoredVisualScene => {
    const entry = getAnimationLibraryEntry(scene.animationId);
    if (!entry) {
      throw new Error(
        `hallucination authored visual is missing catalog entry: ${scene.animationId}`,
      );
    }
    return Object.freeze({
      sceneId: scene.sceneId,
      visualId: scene.animationId,
      fingerprint: Object.freeze(deriveVisualFingerprint(entry)),
    });
  }),
);

export const HALLUCINATION_VISUAL_DIVERSITY = Object.freeze(
  evaluateAuthoredVisualDiversity(HALLUCINATION_VISUAL_MANIFEST),
);

export const assertHallucinationVisualDiversity = (): void => {
  assertAuthoredVisualDiversity(HALLUCINATION_VISUAL_MANIFEST);
};

assertHallucinationVisualDiversity();
