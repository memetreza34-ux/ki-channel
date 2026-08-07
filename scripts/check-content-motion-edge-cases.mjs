import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const EDGE_CASE_PATH = resolve(
  'ki/src/animation-library/content-motion-edge-cases.json',
);

const SOURCE_CONTRACTS = new Map([
  [
    'learning-update-knowledge-tree-graft-v1',
    {
      file: 'KnowledgeTreeGraftPrototype.tsx',
      required: [
        "key: 'verificationThreshold'",
        'acceptedSupersede',
        'WISSEN BLEIBT UNVERÄNDERT',
      ],
    },
  ],
  [
    'retrieval-search-knowledge-magnet-v1',
    {
      file: 'KnowledgeMagnetPrototype.tsx',
      required: [
        'source${index + 1}Relevant',
        'requestedEvidenceCount',
        'relevantDocuments',
      ],
    },
  ],
  [
    'input-output-funnel-compression-output-v1',
    {
      file: 'FunnelCompressionOutputPrototype.tsx',
      required: ['input${index + 1}Keep', 'keptInputs', 'VERWORFEN'],
    },
  ],
  [
    'process-flow-subway-workflow-map-v1',
    {
      file: 'SubwayWorkflowMapPrototype.tsx',
      required: ["key: 'showAlternative'", 'inferredAlternative', 'showAlternative ?'],
    },
  ],
  [
    'semantic-space-meaning-terrain-v1',
    {
      file: 'MeaningTerrainPrototype.tsx',
      required: ['concept${index + 1}Cluster', 'clusterForm', 'concept.cluster'],
    },
  ],
  [
    'relationship-network-dependency-bridge-builder-v1',
    {
      file: 'DependencyBridgeBuilderPrototype.tsx',
      required: ["key: 'weight12'", "key: 'weight23'", "key: 'weakWeight'", 'VERWORFEN'],
    },
  ],
]);

const edgeCaseConfig = JSON.parse(readFileSync(EDGE_CASE_PATH, 'utf8'));
if (edgeCaseConfig.version !== 1 || !Array.isArray(edgeCaseConfig.cases)) {
  throw new Error('Content-Motion-Edge-Cases besitzen kein gültiges Version-1-Schema.');
}

if (edgeCaseConfig.cases.length !== SOURCE_CONTRACTS.size) {
  throw new Error(
    `Edge-Case-Gate erwartet ${SOURCE_CONTRACTS.size} Szenarien, gefunden: ${edgeCaseConfig.cases.length}.`,
  );
}

const caseIds = edgeCaseConfig.cases.map((entry) => entry.id);
const animationIds = edgeCaseConfig.cases.map((entry) => entry.animationId);
if (new Set(caseIds).size !== caseIds.length) {
  throw new Error('Content-Motion-Edge-Cases enthalten doppelte IDs.');
}
if (new Set(animationIds).size !== animationIds.length) {
  throw new Error('Jede Edge-Case-Animation darf in dieser Gate-Datei nur einmal vorkommen.');
}

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildKeyMatcher = (source) => {
  const literalKeys = new Set();
  const templatePatterns = [];

  for (const match of source.matchAll(/key:\s*['"]([^'"]+)['"]/g)) {
    literalKeys.add(match[1]);
  }
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

  return (key) =>
    literalKeys.has(key) || templatePatterns.some((pattern) => pattern.test(key));
};

const toNumber = (value) => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const isTruthy = (value) => {
  if (typeof value === 'number') return value !== 0;
  return ['true', 'yes', 'ja', '1'].includes(
    String(value).trim().toLocaleLowerCase('de-DE'),
  );
};

const failures = [];
let checkedKeys = 0;

for (const edgeCase of edgeCaseConfig.cases) {
  const sourceContract = SOURCE_CONTRACTS.get(edgeCase.animationId);
  if (!sourceContract) {
    failures.push(`${edgeCase.id}: keine Source-Regel für ${edgeCase.animationId}`);
    continue;
  }

  if (typeof edgeCase.expectedBehavior !== 'string' || !edgeCase.expectedBehavior.trim()) {
    failures.push(`${edgeCase.id}: expectedBehavior fehlt`);
  }

  const content = edgeCase.content;
  const meaning = content?.meaningContract;
  if (typeof content?.spokenText !== 'string' || !content.spokenText.trim()) {
    failures.push(`${edgeCase.id}: spokenText fehlt`);
  }
  for (const field of ['startState', 'visibleChange', 'endState']) {
    if (typeof meaning?.[field] !== 'string' || !meaning[field].trim()) {
      failures.push(`${edgeCase.id}: meaningContract.${field} fehlt`);
    }
  }
  if (!Array.isArray(meaning?.requiredVisualCues) || meaning.requiredVisualCues.length === 0) {
    failures.push(`${edgeCase.id}: requiredVisualCues fehlen`);
  }

  const source = readFileSync(
    resolve('ki/src/animation-library/prototypes', sourceContract.file),
    'utf8',
  );
  const acceptsKey = buildKeyMatcher(source);
  const explicitKeys = [
    ...Object.keys(content?.labels ?? {}),
    ...Object.keys(content?.values ?? {}),
  ];
  for (const key of explicitKeys) {
    checkedKeys += 1;
    if (!acceptsKey(key)) {
      failures.push(
        `${edgeCase.id}: Runtime-Key "${key}" wird von ${sourceContract.file} nicht gelesen`,
      );
    }
  }
  for (const fragment of sourceContract.required) {
    if (!source.includes(fragment)) {
      failures.push(
        `${edgeCase.id}: semantischer Source-Vertrag fehlt in ${sourceContract.file}: ${fragment}`,
      );
    }
  }

  const values = content?.values ?? {};
  switch (edgeCase.id) {
    case 'knowledge-update-rejects-low-confidence': {
      const confidence = toNumber(values.confidence);
      const threshold = toNumber(values.verificationThreshold);
      if (confidence === null || threshold === null || confidence >= threshold) {
        failures.push(
          `${edgeCase.id}: Gegenbeispiel muss confidence < verificationThreshold erzwingen`,
        );
      }
      break;
    }
    case 'retrieval-respects-explicit-relevance': {
      const relevance = Array.from({length: 6}, (_, index) =>
        isTruthy(values[`source${index + 1}Relevant`]),
      );
      const relevantCount = relevance.filter(Boolean).length;
      const evidenceCount = toNumber(values.evidenceCount);
      if (!relevance.includes(true) || !relevance.includes(false)) {
        failures.push(`${edgeCase.id}: benötigt relevante und irrelevante Quellen`);
      }
      if (evidenceCount !== relevantCount) {
        failures.push(
          `${edgeCase.id}: evidenceCount (${evidenceCount}) muss der expliziten Relevanzmenge (${relevantCount}) entsprechen`,
        );
      }
      break;
    }
    case 'funnel-drops-explicit-noise': {
      const keep = Array.from({length: 6}, (_, index) =>
        isTruthy(values[`input${index + 1}Keep`]),
      );
      if (!keep.includes(true) || !keep.includes(false)) {
        failures.push(`${edgeCase.id}: benötigt gleichzeitig Keep- und Drop-Inputs`);
      }
      if (keep.filter(Boolean).length !== 3) {
        failures.push(`${edgeCase.id}: erwartet exakt drei behaltene Inputs`);
      }
      break;
    }
    case 'workflow-shows-explicit-retry-route': {
      if (!isTruthy(values.showAlternative)) {
        failures.push(`${edgeCase.id}: showAlternative muss explizit aktiv sein`);
      }
      if (!/fehler|zurück|retry|wiederhol/i.test(content.spokenText)) {
        failures.push(`${edgeCase.id}: Sprechertext muss die Rückfallroute semantisch begründen`);
      }
      break;
    }
    case 'semantic-space-respects-nonpositional-clusters': {
      const clusters = Array.from({length: 6}, (_, index) =>
        toNumber(values[`concept${index + 1}Cluster`]),
      );
      if (clusters.some((cluster) => cluster === null || ![1, 2].includes(cluster))) {
        failures.push(`${edgeCase.id}: alle sechs Begriffe benötigen Cluster 1 oder 2`);
      }
      const firstThree = clusters.slice(0, 3).join(',');
      const lastThree = clusters.slice(3).join(',');
      if (firstThree === '1,1,1' && lastThree === '2,2,2') {
        failures.push(`${edgeCase.id}: Cluster dürfen nicht dem alten Positionsschema entsprechen`);
      }
      if (new Set(clusters).size !== 2) {
        failures.push(`${edgeCase.id}: beide Cluster müssen tatsächlich verwendet werden`);
      }
      break;
    }
    case 'attention-weights-drive-relationship-strength': {
      const weight12 = toNumber(values.weight12);
      const weight23 = toNumber(values.weight23);
      const weakWeight = toNumber(values.weakWeight);
      if ([weight12, weight23, weakWeight].some((value) => value === null)) {
        failures.push(`${edgeCase.id}: alle drei Gewichte müssen numerisch sein`);
        break;
      }
      if (!(weakWeight < weight12 && weakWeight < weight23)) {
        failures.push(`${edgeCase.id}: weakWeight muss kleiner als beide starken Gewichte sein`);
      }
      if (weakWeight > 0.2) {
        failures.push(`${edgeCase.id}: schwache Kante muss klar unter 20 Prozent liegen`);
      }
      break;
    }
    default:
      failures.push(`${edgeCase.id}: unbekannter Edge-Case ohne semantische Prüfung`);
  }
}

for (const animationId of SOURCE_CONTRACTS.keys()) {
  if (!animationIds.includes(animationId)) {
    failures.push(`Edge-Case für ${animationId} fehlt`);
  }
}

if (failures.length > 0) {
  console.error('Content-Motion-Edge-Case-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Content-Motion-Edge-Case-Gate bestanden: ${edgeCaseConfig.cases.length} Gegenbeispiele und ${checkedKeys} explizite Runtime-Keys sind abgesichert.`,
);
