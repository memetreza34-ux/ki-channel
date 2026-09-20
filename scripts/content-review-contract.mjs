import {CREATIVE_RECIPE_IDS} from './creative-recipe-release-contract.mjs';

export const CONTENT_REVIEW_COUNTS = Object.freeze({
  production: 22,
  edge: 6,
  recipe: CREATIVE_RECIPE_IDS.length,
  total: 22 + 6 + CREATIVE_RECIPE_IDS.length,
});

export const CONTENT_REVIEW_CHECK_KEYS = Object.freeze([
  'approved',
  'contentCorrect',
  'noDemoDebug',
  'noFakePrecision',
  'stateChangeClear',
  'endHoldClear',
]);

export const CONTENT_REVIEW_REQUIRED_CHECK_KEYS = Object.freeze(
  CONTENT_REVIEW_CHECK_KEYS.filter((key) => key !== 'approved'),
);

export const assertContentReviewCounts = ({
  production,
  edge,
  recipe,
  total,
  label = 'Content Review',
}) => {
  const actual = {production, edge, recipe, total};
  for (const key of Object.keys(CONTENT_REVIEW_COUNTS)) {
    if (actual[key] !== CONTENT_REVIEW_COUNTS[key]) {
      throw new Error(
        `${label}: erwartet ${key}=${CONTENT_REVIEW_COUNTS[key]}, gefunden ${actual[key]}.`,
      );
    }
  }
};
