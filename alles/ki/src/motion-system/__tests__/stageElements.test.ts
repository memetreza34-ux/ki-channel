import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {
  findUnrenderedStageElements,
  getRenderedStageElementIds,
} from '../stageElements';

describe('Stage-Element-Verträge', () => {
  it('stellt alle Elemente der zehn Standardbeispiele dar', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(findUnrenderedStageElements(storyboard)).toEqual([]);
      expect(getRenderedStageElementIds(storyboard).size).toBeGreaterThanOrEqual(2);
    }
  });

  it('erfasst den KI-Core des Fehlerpfads als sichtbares Element', () => {
    const rendered = getRenderedStageElementIds(MOTION_EXAMPLES['error-path']);
    expect(rendered).toEqual(new Set(['input', 'ai', 'error', 'check']));
  });

  it('begrenzt dynamische Werkzeug- und Prozesslisten wie die Komponenten', () => {
    const toolStoryboard = MOTION_EXAMPLES['tool-orchestration'];
    const tools = {
      ...toolStoryboard,
      elements: [
        ...toolStoryboard.elements,
        {id: 'email', kind: 'tool' as const, label: 'E-Mail', emphasis: 'normal' as const},
        {id: 'calendar', kind: 'tool' as const, label: 'Kalender', emphasis: 'normal' as const},
      ],
    };
    expect(findUnrenderedStageElements(tools).map((element) => element.id)).toEqual([
      'calendar',
    ]);

    const processStoryboard = MOTION_EXAMPLES['process-chain'];
    const process = {
      ...processStoryboard,
      elements: [
        ...processStoryboard.elements,
        {id: 'step-5', kind: 'node' as const, label: 'Archiv', emphasis: 'normal' as const},
      ],
    };
    expect(findUnrenderedStageElements(process).map((element) => element.id)).toEqual([
      'step-5',
    ]);
  });

  it('erkennt Prozessschritte nach stabiler ID statt nach Array-Reihenfolge', () => {
    const storyboard = MOTION_EXAMPLES['process-chain'];
    const reordered = {
      ...storyboard,
      elements: [
        {id: 'step-5', kind: 'node' as const, label: 'Archiv', emphasis: 'normal' as const},
        ...storyboard.elements.slice().reverse(),
      ],
    };

    expect(getRenderedStageElementIds(reordered)).toEqual(
      new Set(['step-1', 'step-2', 'step-3', 'step-4']),
    );
    expect(findUnrenderedStageElements(reordered).map((element) => element.id)).toEqual([
      'step-5',
    ]);
  });
});
