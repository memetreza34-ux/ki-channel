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
    expect(source).toContain('const droppedLabel = content');
    expect(source).toContain('const keptLabel = content');
    expect(source).toContain('IRRELEVANTE QUELLEN VERWORFEN');
    expect(source).toContain('RELEVANTE QUELLEN BLEIBEN');
  });

  it('does not expose internal semantic cluster ids or group sizes as content facts', () => {
    const source = read('MeaningTerrainPrototype.tsx');
    expect(source).toContain("concept.cluster === 1 ? 'GRUPPE A' : 'GRUPPE B'");
    expect(source).toContain("{content ? '' : ` · ${concepts.filter");
  });

  it('does not expose demo years or focus counters in content timelines', () => {
    const source = read('TimelineMicroscopePrototype.tsx');
    expect(source).toContain("content ? 'ENTWICKLUNG IM ZEITVERLAUF' : 'MODEL EVOLUTION · 2023–2026'");
    expect(source).toContain('content ? `FOKUS: ${milestones[focusIndex].label}`');
  });

  it('does not pad short generated answers with demo words or show word counters', () => {
    const source = read('AnswerLoomPrototype.tsx');
    expect(source).toContain('const wordSlots = content');
    expect(source).toContain("content ? 'WORT FÜR WORT'");
    expect(source).toContain("extractedWords[index] ?? 'Antwort'");
  });

  it('does not expose internal decision branch counts as content facts', () => {
    const source = read('DecisionTreeBurstPrototype.tsx');
    expect(source).toContain('UNPASSENDE ÄSTE VERWORFEN');
    expect(source).toContain('TRAGENDE KRITERIEN BLEIBEN');
  });

  it('does not expose workflow station counters or demo route branding in content', () => {
    const source = read('SubwayWorkflowMapPrototype.tsx');
    expect(source).toContain("content ? 'PROZESSROUTE' : 'AUTOMATION LINE · LIVE ROUTE'");
    expect(source).toContain("travel >= 1 ? 'ROUTE ABGESCHLOSSEN' : 'ROUTE LÄUFT'");
  });

  it('does not expose security layer counters or unsupported zero-trust branding in content', () => {
    const source = read('EncryptionVaultLayersPrototype.tsx');
    expect(source).toContain("content ? 'GESCHÜTZTE DATENROUTE' : 'ZERO-TRUST DATA ROUTE'");
    expect(source).toContain('SCHUTZSCHICHTEN WERDEN GEPRÜFT');
    expect(source).toContain('SCHUTZSCHICHTEN AKTIV');
  });
});
