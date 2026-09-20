import {getAnimationLibraryEntry} from '../../animation-library/catalog';
import {
  assertAuthoredVisualDiversity,
  evaluateAuthoredVisualDiversity,
  type AuthoredVisualScene,
} from '../../animation-library/authoredProductionGate';
import {deriveVisualFingerprint} from '../../animation-library/visualFingerprint';
import reelJson from '../../../reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/06-projektdateien/reel.json';

type ContextOverloadVisualSourceScene = {
  sceneId: string;
  animationId: string;
};

const sourceScenes = (reelJson as {scenes: ContextOverloadVisualSourceScene[]}).scenes;

export const CONTEXT_OVERLOAD_VISUAL_MANIFEST = Object.freeze(
  sourceScenes.map((scene): AuthoredVisualScene => {
    const entry = getAnimationLibraryEntry(scene.animationId);
    if (!entry) {
      throw new Error(
        `context-overload authored visual is missing catalog entry: ${scene.animationId}`,
      );
    }
    return Object.freeze({
      sceneId: scene.sceneId,
      visualId: scene.animationId,
      fingerprint: Object.freeze(deriveVisualFingerprint(entry)),
    });
  }),
);

export const CONTEXT_OVERLOAD_VISUAL_DIVERSITY = Object.freeze(
  evaluateAuthoredVisualDiversity(CONTEXT_OVERLOAD_VISUAL_MANIFEST),
);

export const assertContextOverloadVisualDiversity = (): void => {
  assertAuthoredVisualDiversity(CONTEXT_OVERLOAD_VISUAL_MANIFEST);
};

assertContextOverloadVisualDiversity();
