import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {
  compileReelImplementationBrief,
  renderReelImplementationBriefMarkdown,
} from '../implementationBrief';
import {prepareReelAnimationProduction} from '../reelLifecycle';

const brain = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: '2026-08-04T13:00:00.000Z',
});

describe('reel implementation brief compiler', () => {
  it('creates a complete agent-ready brief for a planned reel', () => {
    const prepared = prepareReelAnimationProduction({
      reelId: 'implementation-brief-reel',
      reelIndex: 40,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {sceneId: 'scene-1', spokenText: 'Die Suche findet passende Dokumente und Belege.'},
        {sceneId: 'scene-2', spokenText: 'Private Daten werden verschlüsselt und geschützt.'},
        {sceneId: 'scene-3', spokenText: 'Unter hoher Last steigt die Latenz.'},
        {sceneId: 'scene-4', spokenText: 'Zwei Modelle werden nach Kosten verglichen.'},
      ],
    });

    const brief = compileReelImplementationBrief(prepared);
    expect(brief.sceneCount).toBe(4);
    expect(brief.readyForImplementation).toBe(true);
    expect(brief.globalRules.length).toBeGreaterThanOrEqual(6);
    expect(brief.reviewGates.length).toBeGreaterThanOrEqual(5);
    expect(brief.scenes.every((scene) => scene.phases.length >= 3)).toBe(true);
    expect(brief.scenes.every((scene) => scene.implementationRules.length >= 5)).toBe(true);
    expect(new Set(brief.scenes.map((scene) => scene.animationId)).size).toBe(4);
  });

  it('renders readable Markdown with all scene contracts', () => {
    const prepared = prepareReelAnimationProduction({
      reelId: 'markdown-brief-reel',
      reelIndex: 41,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
      scenes: [
        {
          sceneId: 'scene-new',
          spokenText: 'Eine neue visuelle Metapher verbindet Unsicherheit mit Wetter.',
          forceNewAnimation: true,
        },
      ],
    });
    const markdown = renderReelImplementationBriefMarkdown(
      compileReelImplementationBrief(prepared),
    );

    expect(markdown).toContain('# Reel-Implementierungsbrief: markdown-brief-reel');
    expect(markdown).toContain('## Szene 1: scene-new');
    expect(markdown).toContain('**Quelle:** new-build');
    expect(markdown).toContain('### Choreografiephasen');
    expect(markdown).toContain('### Implementierungsregeln');
    expect(markdown).toContain('Review-Gates');
  });

  it('keeps diagnostic blockers visible instead of hiding them', () => {
    const prepared = prepareReelAnimationProduction({
      reelId: 'blocked-brief-reel',
      reelIndex: 42,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      scenes: [
        {sceneId: 'scene-1', spokenText: 'Die KI zerlegt Text in Tokens.'},
      ],
    });
    const blocked = {
      ...prepared,
      readyForImplementation: false,
      diagnostics: {
        ...prepared.diagnostics,
        passed: false,
        diagnostics: [
          ...prepared.diagnostics.diagnostics,
          {
            code: 'manual-test-blocker',
            severity: 'blocker' as const,
            sceneIds: ['scene-1'],
            message: 'Ein manueller Qualitätsblocker bleibt offen.',
          },
        ],
      },
    };

    const brief = compileReelImplementationBrief(blocked);
    expect(brief.readyForImplementation).toBe(false);
    expect(brief.blockers).toContain('Ein manueller Qualitätsblocker bleibt offen.');
  });
});
