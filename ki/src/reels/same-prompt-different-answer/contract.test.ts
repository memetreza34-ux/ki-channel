import {describe, expect, it} from 'vitest';
import {
  SAME_PROMPT_CAPTIONS,
  SAME_PROMPT_DURATION_IN_FRAMES,
  SAME_PROMPT_FPS,
  SAME_PROMPT_SCENES,
  assertSamePromptContract,
} from './ReelSamePromptDifferentAnswer';

const normalize = (value: string): string => value
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const FINAL_SCRIPT = 'Dieselbe Frage. Dieselbe KI. Zwei verschiedene Antworten. Das ist nicht automatisch ein Fehler. Viele Sprachmodelle berechnen für den nächsten Token mehrere mögliche Fortsetzungen mit unterschiedlichen Wahrscheinlichkeiten. Beim Sampling wird daraus eine Möglichkeit gewählt. Nicht zwingend immer dieselbe. Jetzt passiert der wichtige Teil: Schon ein anderes Token verändert die nächsten Wahrscheinlichkeiten. Eine kleine Abzweigung kann so den ganzen Satz verändern. Temperatur kann die Auswahl enger oder breiter machen, wenn Sampling verwendet wird. Für reproduzierbarere Antworten: Prompt, Modell und Einstellungen fixieren und Zufall reduzieren, soweit das System es erlaubt. Bei kreativen Aufgaben kann Variation dagegen genau gewollt sein.';

describe('same-prompt-different-answer production contract', () => {
  it('passes the authored production contract', () => {
    expect(() => assertSamePromptContract()).not.toThrow();
  });

  it('covers the full 47 second timeline with eight unique scenes', () => {
    expect(SAME_PROMPT_DURATION_IN_FRAMES).toBe(1410);
    expect(SAME_PROMPT_FPS).toBe(30);
    expect(SAME_PROMPT_SCENES).toHaveLength(8);
    expect(new Set(SAME_PROMPT_SCENES.map((scene) => scene.visualId)).size).toBe(8);
    expect(SAME_PROMPT_SCENES[0].startFrame).toBe(0);
    expect(SAME_PROMPT_SCENES.at(-1)?.endFrame).toBe(1410);
  });

  it('keeps phase-one captions text-identical to the final voiceover', () => {
    expect(normalize(SAME_PROMPT_CAPTIONS.map((caption) => caption.text).join(' '))).toBe(normalize(FINAL_SCRIPT));
    expect(Math.max(...SAME_PROMPT_CAPTIONS.map((caption) => caption.text.trim().split(/\s+/).length))).toBeLessThanOrEqual(6);
  });
});
