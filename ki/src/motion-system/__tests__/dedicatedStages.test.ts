import {describe, expect, it} from 'vitest';
import {createDefaultStoryboard} from '../router';
import {TEMPLATE_REGISTRY} from '../templates/TemplateRegistry';

const dedicatedTypes = [
  'input-output',
  'before-after',
  'comparison',
  'error-path',
  'context-window',
  'process-chain',
  'ranking',
  'data-flow',
  'tool-orchestration',
  'agent-loop',
] as const;

describe('dedicated premium stages', () => {
  it('deckt alle Visualtypen ab', () => {
    for (const type of dedicatedTypes) {
      expect(TEMPLATE_REGISTRY[type]).toBeDefined();
    }
  });

  it('erzeugt für typische Sätze Storyboards mit erwarteten Typen', () => {
    const cases = [
      ['Die KI erstellt aus einer Eingabe ein Ergebnis.', 'input-output'],
      ['Vorher dauerte es lange, jetzt geht es schneller.', 'before-after'],
      ['Modell A ist besser als Modell B.', 'comparison'],
      ['Die KI kann eine falsche Antwort halluzinieren.', 'error-path'],
      ['Alte Informationen fallen aus dem Kontext.', 'context-window'],
      ['Zuerst analysiert die KI, danach erstellt sie das Ergebnis.', 'process-chain'],
      ['Dieses Modell landet auf Platz eins.', 'ranking'],
      ['Daten fließen aus mehreren Quellen durch die KI.', 'data-flow'],
      ['Der Agent nutzt Browser, Dateien und E-Mail.', 'tool-orchestration'],
      ['Der Agent plant, kontrolliert und arbeitet autonom weiter.', 'agent-loop'],
    ] as const;

    for (const [sentence, expected] of cases) {
      expect(createDefaultStoryboard(sentence).visualType).toBe(expected);
    }
  });
});
