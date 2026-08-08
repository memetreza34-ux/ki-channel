import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const read = (fileName) =>
  readFileSync(
    resolve('ki/src/animation-library/prototypes', fileName),
    'utf8',
  );

describe('visible precision grounding bindings', () => {
  it('keeps retrieval counts qualitative unless an explicit count is spoken', () => {
    const source = read('KnowledgeMagnetPrototype.tsx');
    expect(source).toContain('parseExplicitCountNear');
    expect(source).toContain('RELEVANTE BELEGE');
    expect(source).toContain('explicitEvidenceCount');
  });

  it('keeps context capacity qualitative unless an explicit count is spoken', () => {
    const source = read('ContextWindowTrainPrototype.tsx');
    expect(source).toContain('parseExplicitCountNear');
    expect(source).toContain('BEGRENZTE KAPAZITÄT');
    expect(source).toContain('ÜBERLAUF SICHTBAR');
  });

  it('keeps relationship weights qualitative without explicit percentages', () => {
    const source = read('DependencyBridgeBuilderPrototype.tsx');
    expect(source).toContain('parseExplicitPercentages');
    expect(source).toContain('qualitativeWeight');
    expect(source).toContain("'STARK'");
    expect(source).toContain("'SCHWACH'");
  });

  it('keeps confidence qualitative without a grounded confidence percentage', () => {
    const source = read('ConfidenceGlassCrackPrototype.tsx');
    expect(source).toContain('parseExplicitPercentageNear');
    expect(source).toContain('qualitativeConfidence');
    expect(source).toContain('HOHE SICHERHEIT IM TON');
  });

  it('keeps knowledge confidence, threshold and revision qualitative without explicit values', () => {
    const source = read('KnowledgeTreeGraftPrototype.tsx');
    expect(source).toContain('parseExplicitPercentageNear');
    expect(source).toContain('KEINE EXAKTE SCHWELLE GENANNT');
    expect(source).toContain('QUALITATIV BESTÄTIGT');
    expect(source).toContain('VERSIONIERT');
    expect(source).toContain('STAND UNVERÄNDERT');
  });

  it('keeps vector coordinates schematic unless a vector triplet is spoken', () => {
    const source = read('VectorPrismConverterPrototype.tsx');
    expect(source).toContain('parseExplicitVectorTriplet');
    expect(source).toContain('SCHEMATISCH · KEINE DEZIMALWERTE GENANNT');
    expect(source).toContain('relative numerische Dimension');
  });

  it('does not expose internal repair animation progress as a content fact', () => {
    const source = read('AnomalyXRayScannerPrototype.tsx');
    expect(source).toContain("content ? 'REPARATUR LÄUFT'");
  });

  it('does not expose internal layer animation progress as a content fact', () => {
    const source = read('ResidualRiverPrototype.tsx');
    expect(source).toContain("content ? 'WIRD VERARBEITET'");
    expect(source).toContain("content ? 'VERARBEITUNG ABGESCHLOSSEN'");
  });

  it('does not expose inferred funnel source counts as content facts', () => {
    const source = read('FunnelCompressionOutputPrototype.tsx');
    expect(source).toContain('IRRELEVANTE QUELLEN VERWORFEN');
    expect(source).toContain('RELEVANTE QUELLEN BLEIBEN');
    expect(source).toContain('content\n    ?');
  });
});
