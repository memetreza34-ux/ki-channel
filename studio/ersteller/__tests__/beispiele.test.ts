import {readdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {erklaererSchema, spotSchema} from '../schema';

const DIR = resolve(__dirname, '..', 'beispiele');

describe('Ersteller-Beispiele', () => {
  for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
    it(`${file} passt zum Schema`, () => {
      const {vorlage, formate, ...props} = JSON.parse(readFileSync(resolve(DIR, file), 'utf8'));
      expect(['spot', 'erklaerer']).toContain(vorlage);
      expect(Array.isArray(formate)).toBe(true);
      const schema = vorlage === 'spot' ? spotSchema : erklaererSchema;
      const result = schema.safeParse(props);
      expect(result.success, JSON.stringify(result.error?.issues ?? [])).toBe(true);
    });
  }

  it('Zahlen ohne Beleg sind als Beispiel markiert', () => {
    for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
      const spec = JSON.parse(readFileSync(resolve(DIR, file), 'utf8'));
      for (const s of spec.szenen ?? []) if (s.typ === 'zahl') expect(s.beispiel, `${file}: Zahl-Szene ohne "beispiel"`).toBe(true);
    }
  });
});
