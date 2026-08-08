import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const read = (fileName) =>
  readFileSync(
    resolve('ki/src/animation-library/prototypes', fileName),
    'utf8',
  );

describe('visible precision grounding bindings', () => {
  it('keeps retrieval counts qualitative unless an explicit consistent count is spoken', () => {
    const source = read('KnowledgeMagnetPrototype.tsx');
    expect(source).toContain('parseExplicitCountNear');
    expect(source).toContain('CONTENT_SOURCE_FALLBACKS');
    expect(source).toContain('parsedEvidenceCount === evidenceCount');
    expect(source).toContain("terms: ['Belege', 'Treffer', 'Nachweise']");
    expect(source).toContain('RELEVANTE BELEGE');
  });

  it('keeps context capacity and pin behavior grounded in explicit context language', () => {
    const source = read('ContextWindowTrainPrototype.tsx');
    expect(source).toContain('parseExplicitCountNear');
    expect(source).toContain("terms: ['Plätze', 'Slots', 'Kapazität', 'Kontextfenster']");
    expect(source).toContain('const hasPinMeaning =');
    expect(source).toContain('const pinGrounded =');
    expect(source).toContain('BEGRENZTE KAPAZITÄT');
    expect(source).toContain('ÜBERLAUF SICHTBAR');
    expect(source).toContain("{content ? '•' : `#${index + 1}`}");
  });

  it('keeps relationship weights qualitative without explicit relationship context', () => {
    const source = read('DependencyBridgeBuilderPrototype.tsx');
    expect(source).toContain('parseExplicitPercentages');
    expect(source).toContain('hasRelationshipMeasurementContext');
    expect(source).toContain('qualitativeWeight');
    expect(source).toContain("'STARK'");
    expect(source).toContain("'SCHWACH'");
  });

  it('keeps confidence qualitative without a grounded confidence percentage', () => {
    const source = read('ConfidenceGlassCrackPrototype.tsx');
    expect(source).toContain('parseExplicitPercentageNear');
    expect(source).toContain("'Sicherheit im Ton'");
    expect(source).toContain('qualitativeConfidence');
    expect(source).toContain('HOHE SICHERHEIT IM TON');
    expect(source).toContain('const checkStatus = content');
  });

  it('keeps knowledge confidence, threshold, fallbacks and revision conservative', () => {
    const source = read('KnowledgeTreeGraftPrototype.tsx');
    expect(source).toContain('parseExplicitPercentageNear');
    expect(source).toContain('CONTENT_OLD_STATE_FALLBACKS');
    expect(source).toContain("content ? 'Neue Information' : 'Stand 2026'");
    expect(source).toContain('Quelle im Sprechertext prüfen');
    expect(source).not.toContain('verifiziert|belegt|bestatigt|primarquelle|');
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

  it('does not expose demo years, artificial stand numbers or focus counters in content timelines', () => {
    const source = read('TimelineMicroscopePrototype.tsx');
    expect(source).toContain('CONTENT_MILESTONE_FALLBACKS');
    expect(source).toContain("'FRÜHER'");
    expect(source).toContain("'NEUER STAND'");
    expect(source).toContain("content ? 'ENTWICKLUNG IM ZEITVERLAUF' : 'MODEL EVOLUTION · 2023–2026'");
    expect(source).toContain('content ? `FOKUS: ${milestones[focusIndex].label}`');
    expect(source).not.toContain('`STAND ${index + 1}`');
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

  it('derives human-ai owners from stage text and keeps handoff counts qualitative', () => {
    const source = read('HumanAIRelayPrototype.tsx');
    expect(source).toContain('const inferOwner =');
    expect(source).toContain("return 'ROLLE'");
    expect(source).toContain("content ? 'ÜBERGABEN ABGESCHLOSSEN'");
  });

  it('never falls back to demo tokens for short content and marks token boundaries schematic', () => {
    const source = read('MagneticPhraseSlicerPrototype.tsx');
    expect(source).toContain("contentWords.length > 0 ? contentWords.slice(0, 5) : ['TEXT']");
    expect(source).toContain('SCHEMATISCHE TOKEN-FOLGE');
    expect(source).toContain('TEXTTEIL ${index + 1}');
    expect(source).toContain('SCHEMATISCHE REIHENFOLGE');
  });
});
