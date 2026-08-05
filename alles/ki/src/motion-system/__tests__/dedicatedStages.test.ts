import {describe, expect, it} from 'vitest';
import {createDefaultStoryboard} from '../router';
import {motionVisualTypeSchema} from '../schema';
import {TEMPLATE_REGISTRY} from '../templates/TemplateRegistry';

describe('dedicated premium stages', () => {
  it('deckt exakt alle Visualtypen mit verständlichen Metadaten ab', () => {
    expect(Object.keys(TEMPLATE_REGISTRY).sort()).toEqual(
      [...motionVisualTypeSchema.options].sort(),
    );

    for (const type of motionVisualTypeSchema.options) {
      expect(TEMPLATE_REGISTRY[type].title.trim().length).toBeGreaterThan(0);
      expect(TEMPLATE_REGISTRY[type].purpose.trim().length).toBeGreaterThan(20);
      expect(TEMPLATE_REGISTRY[type].title.length).toBeLessThanOrEqual(40);
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
