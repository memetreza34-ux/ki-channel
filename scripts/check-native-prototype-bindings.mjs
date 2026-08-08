import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const CONTENT_BOUND_PROTOTYPES = [
  ['error-detection-anomaly-xray-scanner-v1', 'AnomalyXRayScannerPrototype.tsx'],
  ['generation-answer-loom-v1', 'AnswerLoomPrototype.tsx'],
  ['comparison-benchmark-racetrack-v1', 'BenchmarkRacetrackPrototype.tsx'],
  ['cost-efficiency-budget-leak-meter-v1', 'BudgetLeakMeterPrototype.tsx'],
  ['risk-contrast-confidence-glass-crack-v1', 'ConfidenceGlassCrackPrototype.tsx'],
  ['context-window-context-window-train-v1', 'ContextWindowTrainPrototype.tsx'],
  ['decision-logic-decision-tree-burst-v1', 'DecisionTreeBurstPrototype.tsx'],
  ['relationship-network-dependency-bridge-builder-v1', 'DependencyBridgeBuilderPrototype.tsx'],
  ['ranking-dynamic-podium-rise-v1', 'DynamicPodiumRisePrototype.tsx'],
  ['security-privacy-encryption-vault-layers-v1', 'EncryptionVaultLayersPrototype.tsx'],
  ['input-output-funnel-compression-output-v1', 'FunnelCompressionOutputPrototype.tsx'],
  ['human-ai-collaboration-human-ai-relay-v1', 'HumanAIRelayPrototype.tsx'],
  ['retrieval-search-knowledge-magnet-v1', 'KnowledgeMagnetPrototype.tsx'],
  ['learning-update-knowledge-tree-graft-v1', 'KnowledgeTreeGraftPrototype.tsx'],
  ['scale-performance-latency-tunnel-race-v1', 'LatencyTunnelRacePrototype.tsx'],
  ['tokenization-magnetic-phrase-slicer-v1', 'MagneticPhraseSlicerPrototype.tsx'],
  ['semantic-space-meaning-terrain-v1', 'MeaningTerrainPrototype.tsx'],
  ['probability-probability-fluid-columns-v1', 'ProbabilityFluidColumnsPrototype.tsx'],
  ['model-processing-residual-river-v1', 'ResidualRiverPrototype.tsx'],
  ['process-flow-subway-workflow-map-v1', 'SubwayWorkflowMapPrototype.tsx'],
  ['time-change-timeline-microscope-v1', 'TimelineMicroscopePrototype.tsx'],
  ['data-transformation-vector-prism-converter-v1', 'VectorPrismConverterPrototype.tsx'],
];

const MOTION_SEMANTIC_RULES = new Map([
  ['AnomalyXRayScannerPrototype.tsx', {required: ['errorScanned', 'repairAtStep', 'REPAIR'], forbidden: []}],
  ['AnswerLoomPrototype.tsx', {required: ['semanticAnswer', 'generatedWordCount', 'WORT {generatedWordCount}'], forbidden: ['Math.sin(frame / 5)']}],
  ['BenchmarkRacetrackPrototype.tsx', {required: ['metricLeaders', 'WIRD GEMESSEN', 'FÜHRT:'], forbidden: ['position * 450']}],
  ['BudgetLeakMeterPrototype.tsx', {required: ['sealedWeight', 'currentSavings', 'POTENZIAL'], forbidden: ['Math.sin((frame']}],
  ['ConfidenceGlassCrackPrototype.tsx', {required: ['checkProgresses', 'failedChecks', 'CHECKS FEHLEN'], forbidden: ['const crack = prototypeProgress']}],
  ['ContextWindowTrainPrototype.tsx', {required: ['overflowCount', 'shiftedSlots', 'keepPinned'], forbidden: ['windowStart = interpolate']}],
  ['DecisionTreeBurstPrototype.tsx', {required: ['validBranches.map', 'Kriterien tragen den Weg'], forbidden: ['routeDistance(']}],
  ['DependencyBridgeBuilderPrototype.tsx', {required: ['weight12', 'weakWeight', 'VERWORFEN'], forbidden: []}],
  ['DynamicPodiumRisePrototype.tsx', {required: ['criterionProgresses', 'currentRanks', 'EINGERECHNET ✓'], forbidden: []}],
  ['EncryptionVaultLayersPrototype.tsx', {required: ['allLayersActive', 'SCHICHTEN AKTIV', 'AKTIV ✓'], forbidden: ['frame * 1.8', 'frame * 0.22']}],
  ['FunnelCompressionOutputPrototype.tsx', {required: ['input${index + 1}Keep', 'keptInputs', 'VERWORFEN'], forbidden: []}],
  ['HumanAIRelayPrototype.tsx', {required: ['stageProgresses', 'currentOwnerColor', 'ÜBERGABE →'], forbidden: ['taskProgress < 0.2']}],
  ['KnowledgeMagnetPrototype.tsx', {required: ['source${index + 1}Relevant', 'requestedEvidenceCount', 'relevantDocuments'], forbidden: []}],
  ['KnowledgeTreeGraftPrototype.tsx', {required: ['verificationThreshold', 'acceptedSupersede', 'WISSEN BLEIBT UNVERÄNDERT'], forbidden: ['rotate(${(1 - newFact)']}],
  ['LatencyTunnelRacePrototype.tsx', {required: ['maximumLatency / tunnel.finalValue', 'latencyDelta', 'speedup'], forbidden: ['race * 360']}],
  ['MagneticPhraseSlicerPrototype.tsx', {required: ['finalPositions', 'REIHENFOLGE BLEIBT ERHALTEN'], forbidden: ['lane: index % 3']}],
  ['MeaningTerrainPrototype.tsx', {required: ['concept${index + 1}Cluster', 'clusterForm', 'CLUSTER {concept.cluster}'], forbidden: ['const lift = concept.height']}],
  ['ProbabilityFluidColumnsPrototype.tsx', {required: ['signalProgresses', 'contextProgress'], forbidden: ['const context = prototypeProgress']}],
  ['ResidualRiverPrototype.tsx', {required: ['progress: prototypeProgress', 'completedLayers', 'SCHICHTEN VERARBEITET'], forbidden: ['Math.sin(', 'rotate(${gateFlow']}],
  ['SubwayWorkflowMapPrototype.tsx', {required: ['showAlternative', 'inferredAlternative', 'completedStations'], forbidden: ['travel * 420']}],
  ['TimelineMicroscopePrototype.tsx', {required: ['inferredFocus', 'changeProgresses', 'FOKUS {focusIndex + 1}'], forbidden: []}],
  ['VectorPrismConverterPrototype.tsx', {required: ['dimensionReveals', 'ZERLEGT MERKMALE'], forbidden: []}],
]);

if (CONTENT_BOUND_PROTOTYPES.length !== 22) throw new Error(`Native Content-Binding-Gate erwartet 22 Komponenten, gefunden: ${CONTENT_BOUND_PROTOTYPES.length}.`);
if (MOTION_SEMANTIC_RULES.size !== CONTENT_BOUND_PROTOTYPES.length) throw new Error(`Motion-Semantik-Gate erwartet Regeln für alle 22 Komponenten, gefunden: ${MOTION_SEMANTIC_RULES.size}.`);
const animationIds = CONTENT_BOUND_PROTOTYPES.map(([animationId]) => animationId);
const fileNames = CONTENT_BOUND_PROTOTYPES.map(([, fileName]) => fileName);
const fileByAnimationId = new Map(CONTENT_BOUND_PROTOTYPES);
if (new Set(animationIds).size !== animationIds.length) throw new Error('Native Content-Binding-Gate enthält doppelte Animation-IDs.');
if (new Set(fileNames).size !== fileNames.length) throw new Error('Native Content-Binding-Gate enthält doppelte Komponenten.');
for (const fileName of fileNames) if (!MOTION_SEMANTIC_RULES.has(fileName)) throw new Error(`Motion-Semantik-Gate fehlt für ${fileName}.`);

const renderConfig = JSON.parse(readFileSync(resolve('ki/src/animation-library/prototype-render-config.json'), 'utf8'));
if (renderConfig.version !== 1 || !Array.isArray(renderConfig.prototypes)) throw new Error('Prototype-Render-Config fehlt oder besitzt eine ungültige Version.');
const renderAnimationIds = renderConfig.prototypes.map((prototype) => prototype.animationId);
const renderCompositionIds = renderConfig.prototypes.map((prototype) => prototype.compositionId);
if (new Set(renderAnimationIds).size !== renderAnimationIds.length) throw new Error('Prototype-Render-Config enthält doppelte Animation-IDs.');
if (new Set(renderCompositionIds).size !== renderCompositionIds.length) throw new Error('Prototype-Render-Config enthält doppelte Composition-IDs.');
if (renderAnimationIds.length !== animationIds.length) throw new Error(`Prototype-Render-Config erwartet dieselben ${animationIds.length} nativen Content-Animationen, gefunden: ${renderAnimationIds.length}.`);
for (const animationId of animationIds) if (!renderAnimationIds.includes(animationId)) throw new Error(`Prototype-Render-Config fehlt für native Content-Animation ${animationId}.`);
for (const animationId of renderAnimationIds) if (!animationIds.includes(animationId)) throw new Error(`Prototype-Render-Config enthält ${animationId}, aber dafür fehlt native Content-Bindung im Source-Gate.`);

const fixtureConfig = JSON.parse(readFileSync(resolve('ki/src/animation-library/content-render-fixtures.json'), 'utf8'));
if (!Array.isArray(fixtureConfig.fixtures)) throw new Error('Content-Render-Fixtures fehlen oder sind ungültig.');
const fixtureByAnimationId = new Map(fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]));
if (fixtureByAnimationId.size !== 22) throw new Error(`Content-Fixture-Gate erwartet 22 eindeutige Fixtures, gefunden: ${fixtureByAnimationId.size}.`);

const scenarioConfig = JSON.parse(readFileSync(resolve('ki/src/animation-library/motion-semantic-scenarios.json'), 'utf8'));
if (scenarioConfig.version !== 1 || !Array.isArray(scenarioConfig.scenarios)) throw new Error('Motion-Semantik-Szenarien fehlen oder besitzen eine ungültige Version.');
if (scenarioConfig.scenarios.length < 9) throw new Error(`Motion-Semantik-Gate erwartet mindestens 9 Edge-Case-Szenarien, gefunden: ${scenarioConfig.scenarios.length}.`);
const scenarioIds = scenarioConfig.scenarios.map((scenario) => scenario.id);
if (new Set(scenarioIds).size !== scenarioIds.length) throw new Error('Motion-Semantik-Szenarien enthalten doppelte IDs.');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const buildKeyMatcher = (source) => {
  const literalKeys = new Set();
  const templatePatterns = [];
  for (const match of source.matchAll(/key:\s*['"]([^'"]+)['"]/g)) literalKeys.add(match[1]);
  for (const match of source.matchAll(/key:\s*`([^`]+)`/g)) {
    const template = match[1];
    const parts = template.split(/\$\{[^}]+\}/g).map(escapeRegex);
    const interpolationCount = (template.match(/\$\{/g) ?? []).length;
    if (interpolationCount === 0) {
      literalKeys.add(template);
      continue;
    }
    templatePatterns.push(new RegExp(`^${parts.join('\\d+')}$`));
  }
  return {accepts: (key) => literalKeys.has(key) || templatePatterns.some((pattern) => pattern.test(key))};
};

const sourceByFile = new Map(
  fileNames.map((fileName) => [
    fileName,
    readFileSync(resolve('ki/src/animation-library/prototypes', fileName), 'utf8'),
  ]),
);
const failures = [];
let checkedFixtureKeys = 0;
let checkedMotionRules = 0;
let checkedScenarioKeys = 0;
for (const [animationId, fileName] of CONTENT_BOUND_PROTOTYPES) {
  const source = sourceByFile.get(fileName);
  const missing = [];
  if (!source.includes('usePrototypeContent')) missing.push('usePrototypeContent');
  if (!source.includes('getPrototypeLabel') && !source.includes('getPrototypeValue')) missing.push('getPrototypeLabel/getPrototypeValue');
  if (!source.includes('content')) missing.push('content usage');
  if (missing.length > 0) {
    failures.push(`${fileName}: ${missing.join(', ')}`);
    continue;
  }

  const motionRule = MOTION_SEMANTIC_RULES.get(fileName);
  checkedMotionRules += 1;
  for (const requiredFragment of motionRule.required) if (!source.includes(requiredFragment)) failures.push(`${fileName}: semantische Bewegungsregel fehlt: ${requiredFragment}`);
  for (const forbiddenFragment of motionRule.forbidden) if (source.includes(forbiddenFragment)) failures.push(`${fileName}: verbotener dekorativer/inhaltlich falscher Bewegungsmechanismus gefunden: ${forbiddenFragment}`);

  const fixture = fixtureByAnimationId.get(animationId);
  if (!fixture) {
    failures.push(`${animationId}: Content-Render-Fixture fehlt`);
    continue;
  }
  if (typeof fixture.content?.spokenText !== 'string' || !fixture.content.spokenText.trim()) failures.push(`${animationId}: spokenText fehlt`);
  const matcher = buildKeyMatcher(source);
  const explicitKeys = [...Object.keys(fixture.content?.labels ?? {}), ...Object.keys(fixture.content?.values ?? {})];
  if (explicitKeys.length === 0) failures.push(`${animationId}: Fixture prüft keine expliziten Render-Keys`);
  for (const key of explicitKeys) {
    checkedFixtureKeys += 1;
    if (!matcher.accepts(key)) failures.push(`${animationId}: Fixture-Key "${key}" wird von ${fileName} nicht konsumiert`);
  }
}
for (const fixture of fixtureConfig.fixtures) if (!animationIds.includes(fixture.animationId)) failures.push(`${fixture.animationId}: Fixture besitzt keine registrierte native Kernkomponente`);

for (const scenario of scenarioConfig.scenarios) {
  if (typeof scenario.id !== 'string' || !scenario.id.trim()) {
    failures.push('Motion-Semantik-Szenario ohne ID gefunden');
    continue;
  }
  if (!animationIds.includes(scenario.animationId)) {
    failures.push(`${scenario.id}: unbekannte Animation ${scenario.animationId}`);
    continue;
  }
  if (typeof scenario.purpose !== 'string' || !scenario.purpose.trim()) failures.push(`${scenario.id}: purpose fehlt`);
  if (typeof scenario.content?.spokenText !== 'string' || !scenario.content.spokenText.trim()) failures.push(`${scenario.id}: spokenText fehlt`);
  const fileName = fileByAnimationId.get(scenario.animationId);
  const matcher = buildKeyMatcher(sourceByFile.get(fileName));
  const scenarioKeys = [...Object.keys(scenario.content?.labels ?? {}), ...Object.keys(scenario.content?.values ?? {})];
  if (scenarioKeys.length === 0) failures.push(`${scenario.id}: Szenario enthält keine expliziten Runtime-Keys`);
  for (const key of scenarioKeys) {
    checkedScenarioKeys += 1;
    if (!matcher.accepts(key)) failures.push(`${scenario.id}: Runtime-Key "${key}" wird von ${fileName} nicht konsumiert`);
  }
}

if (failures.length > 0) {
  console.error('Native Content-Binding-/Fixture-/Motion-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Native Content-Binding-/Fixture-/Motion-Gate bestanden: 22/22 Komponenten, 22/22 Content-Render-Config-Einträge, ${checkedFixtureKeys} Release-Fixture-Keys, ${checkedMotionRules}/22 semantische Bewegungsregeln und ${checkedScenarioKeys} Edge-Case-Runtime-Keys sind abgesichert.`);
