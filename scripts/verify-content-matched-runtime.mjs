import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const run = (command, args, label) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n[content-runtime] ${label}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`${label} endete mit Code ${code}.`));
    });
  });

const tests = [
  'ki/src/animation-library/__tests__/contentMatching.test.ts',
  'ki/src/animation-library/__tests__/stableContentMatchedPlanner.test.ts',
  'ki/src/animation-library/__tests__/extendedMeaningContract.test.ts',
  'ki/src/animation-library/__tests__/reelPlanningPipeline.test.ts',
  'ki/src/animation-library/__tests__/productionPlanner.test.ts',
  'ki/src/animation-library/__tests__/productionExecutableGuard.test.ts',
  'ki/src/animation-library/__tests__/executionCatalog.test.ts',
  'ki/src/animation-library/__tests__/contentVariantPromotion.test.ts',
  'ki/src/animation-library/__tests__/executableAnimationManifest.test.ts',
  'ki/src/animation-library/__tests__/executableRegistryAlignment.test.ts',
  'ki/src/animation-library/__tests__/planDiagnostics.test.ts',
  'ki/src/animation-library/__tests__/reelLifecycle.test.ts',
  'ki/src/animation-library/__tests__/universalMotionPlan.test.ts',
  'ki/src/animation-library/__tests__/universalMotionMeaning.test.ts',
  'ki/src/animation-library/__tests__/remotionChoreographyCompiler.test.ts',
  'ki/src/animation-library/__tests__/prototypeRegistry.test.ts',
  'ki/src/animation-library/__tests__/prototypeContentCoverage.test.ts',
  'ki/src/animation-library/__tests__/prototypeRenderPayload.test.ts',
  'ki/src/animation-library/__tests__/prototypeRuntimeContentDeriver.test.ts',
  'ki/src/animation-library/__tests__/prototypeRuntimeContentSanitizer.test.ts',
  'ki/src/animation-library/__tests__/prototypeRuntimeContentAssociation.test.ts',
  'ki/src/animation-library/__tests__/prototypeWinnerCueGrounding.test.ts',
  'ki/src/animation-library/__tests__/prototypeMeasurementAssociation.test.ts',
  'ki/src/animation-library/__tests__/prototypeMeasurementGrounding.test.ts',
  'ki/src/animation-library/__tests__/prototypeCrossLabelGrounding.test.ts',
  'ki/src/animation-library/__tests__/prototypeVisiblePrecisionGrounding.test.mjs',
  'ki/src/animation-library/__tests__/prototypeProductionShell.test.mjs',
  'ki/src/animation-library/__tests__/masterplanFixtureIsolation.test.mjs',
  'ki/src/animation-library/__tests__/masterplanProductionFixtureContract.test.mjs',
  'ki/src/animation-library/__tests__/runtimeContentSanitizerBindings.test.mjs',
  'ki/src/animation-library/__tests__/productionDerivedRuntimeKeys.test.mjs',
  'ki/src/animation-library/__tests__/masterplanPayloadLoaders.test.mjs',
  'ki/src/animation-library/__tests__/prototypeContentContext.test.ts',
  'ki/src/animation-library/__tests__/channelReelMasterPlanContentBinding.test.ts',
  'ki/src/animation-library/__tests__/channelMasterplanSanitizedProps.test.ts',
];

const outputDir = resolve('out/content-matched/runtime-verification');
await mkdir(outputDir, {recursive: true});
const samplePropsPath = resolve(outputDir, 'sample-performance-props.json');

const sampleProps = {
  content: {
    title: 'Latenz · Kapazität · Engpass',
    spokenText:
      'Der überlastete Dienst braucht 780 Millisekunden, der optimierte Dienst nur 340 Millisekunden.',
    meaningContract: {
      communicationGoal: 'show-result',
      startState:
        'Der überlastete Dienst beginnt mit einer gemessenen Laufzeit von 780 Millisekunden.',
      visibleChange:
        'Die Optimierung verändert denselben Ablauf und senkt die gemessene Laufzeit auf 340 Millisekunden.',
      endState:
        'Beide gemessenen Laufzeiten bleiben auf derselben Vergleichsbasis sichtbar.',
      subjectTerms: ['Dienst', 'Latenz', 'Optimierung'],
      actionTerms: ['braucht', 'senkt'],
      resultTerms: ['780 Millisekunden', '340 Millisekunden'],
      preferredVisualFamilies: ['scale-performance'],
      preferredExplanationPatterns: ['performance-improvement'],
      requiredVisualCues: [
        'baseline-performance',
        'optimization-change',
        'latency-or-throughput-improvement',
        'measured-or-relative-result',
      ],
      forbiddenVisualCues: [
        'podium-without-ranking-meaning',
        'decorative-motion-without-semantic-state-change',
      ],
    },
    labels: {
      slowPath: 'Überlasteter Dienst',
      fastPath: 'Optimierter Dienst',
      bottleneckLabel: 'Ausgangszustand',
      latencyUnit: 'ms',
    },
    values: {
      slowLatency: 780,
      fastLatency: 340,
      measurementExact: 1,
    },
  },
};

await writeFile(
  samplePropsPath,
  `${JSON.stringify(sampleProps, null, 2)}\n`,
  'utf8',
);

try {
  await run(
    'node',
    ['scripts/check-masterplan-production-inputs.mjs'],
    'Test 0: 22 Production-Sprechertexte und Render-IDs sind deckungsgleich und geerdet',
  );
  await run(
    'node',
    ['scripts/check-masterplan-production-fixtures.mjs'],
    'Dependency-freier Preflight für 22 Production-Fixtures und die kanonische Grounding-Reihenfolge',
  );
  await run(
    'node',
    ['scripts/check-first-content-grounding-test-contract.mjs'],
    'Vertrag für offiziellen Test 1: Kosten-Grounding bis zum Content-Matched-Render-Plan',
  );
  await run(
    'node',
    ['scripts/check-native-prototype-bindings.mjs'],
    'Quellcode-Gate für native Objektbindung, Runtime-Deriver und Motion-Semantik aller 22 Kernprototypen',
  );
  await run(
    'node',
    ['scripts/check-production-derived-runtime-keys.mjs'],
    'Finale Production-Runtime-Keys nach Deriver, Sanitizer und Association werden von den ausgewählten TSX-Komponenten konsumiert',
  );
  await run(
    'node',
    ['scripts/check-content-motion-edge-cases.mjs'],
    'Semantische Gegenbeispiele für kritische Content-Motion-Steuerwerte',
  );
  await run(
    'node',
    ['scripts/check-canonical-content-release-paths.mjs'],
    'Kanonischer Release-Pfad bleibt Meaning -> Deriver -> Sanitizer -> Association -> Render-Props',
  );
  await run(
    'node',
    ['scripts/check-content-review-finalization-path.mjs'],
    'Manuelle 22+6 Review-ID, Export-Nachweis und Finalizer-Reihenfolge bleiben verpflichtend',
  );
  await run(
    'node',
    ['scripts/check-content-release-worktree-contract.mjs'],
    'Release-Nachweise verlangen einen sauberen tracked Worktree und aktuellen Git-HEAD',
  );
  await run(
    'node',
    ['scripts/check-content-release-status-contract.mjs'],
    'Release-Status meldet Full-, Artefakt-, Visual-Review- und Finalisierungsblocker in fester Reihenfolge',
  );
  await run(
    'npx',
    ['--no-install', 'tsc', '-p', 'ki/tsconfig.animation-library.json'],
    'TypeScript-Prüfung der gesamten Animationsbibliothek',
  );
  await run(
    'npx',
    ['--no-install', 'vitest', 'run', ...tests],
    'Gezielte Content-Matching-, Produktions-, Varianten-Promotion-, Production-Fixture-, Fixture-Isolation-, Manifest-, Registry-, Deriver-, Sanitizer-, Association-, Winner-Cue-, Messwert-, Sichtpräzisions-, Production-Shell-, Cross-Label-, Masterplan-Props-, Key-Consumer-, Diagnostics- und Runtime-Regressionstests',
  );
  await run(
    'node',
    [
      'scripts/render-content-matched-prototype.mjs',
      'scale-performance-latency-tunnel-race-v1',
      samplePropsPath,
      'plan',
    ],
    'Validierung eines geerdeten Remotion-Props- und Renderauftrags',
  );

  console.log('\n[content-runtime] Technische Runtime-Prüfung bestanden.');
  console.log(
    '[content-runtime] Noch erforderlich: echte Kontrollframes und Videos für alle 22 Kompositionen visuell prüfen und visual-review.json finalisieren.',
  );
} catch (error) {
  console.error('\n[content-runtime] Prüfung fehlgeschlagen.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
