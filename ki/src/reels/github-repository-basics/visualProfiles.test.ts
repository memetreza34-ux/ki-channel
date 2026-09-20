import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {GITHUB_REPOSITORY_SCENES} from './contract';
import {GITHUB_REPOSITORY_VISUAL_PROFILES} from './visualProfiles';

const visualsSource = readFileSync(
  resolve('ki/src/reels/github-repository-basics/Visuals.tsx'),
  'utf8',
);

describe('GitHub repository authored visual diversity', () => {
  it('covers every authored scene in production order', () => {
    expect(GITHUB_REPOSITORY_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual(
      GITHUB_REPOSITORY_SCENES.map((scene) => scene.sceneId),
    );
  });

  it('passes the canonical authored diversity gate', () => {
    const result = evaluateAuthoredVisualDiversity(GITHUB_REPOSITORY_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(4);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
  });

  it('does not regress to the former shared card-template implementation', () => {
    expect(visualsSource).not.toContain('const card:React.CSSProperties');
    expect(visualsSource).toContain('perspective:1050');
    expect(visualsSource).toContain('CommitHistoryVisual');
    expect(visualsSource).toContain('BranchPullRequestVisual');
    expect(visualsSource).toContain('RepositoryWholeVisual');
    expect(visualsSource).toContain('<svg');
  });
});
