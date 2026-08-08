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
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
    meaningContract: {
      communicationGoal: 'show-limitation',
      startState:
        'Anfragen bewegen sich unterhalb der sichtbaren Kapazitätsgrenze.',
      visibleChange:
        'Die Last steigt, ein Engpass entsteht und die Latenz nimmt sichtbar zu.',
      endState:
        'Engpass, Kapazitätsgrenze und Latenz bleiben gemeinsam erkennbar.',
      subjectTerms: ['Last', 'Latenz', 'Kapazität', 'Engpass'],
      actionTerms: ['steigt', 'wird'],
      resultTerms: ['Engpass', 'Latenz'],
      preferredVisualFamilies: ['scale-performance'],
      preferredExplanationPatterns: ['bottleneck', 'capacity-limit'],
      requiredVisualCues: [
        'load-level',
        'request-flow',
        'visible-bottleneck',
        'latency-or-capacity-result',
      ],
      forbiddenVisualCues: [
        'podium-without-ranking-meaning',
        'decorative-motion-without-semantic-state-change',
      ],
    },
    labels: {
      slowPath: 'Überlasteter Dienst',
      fastPath: 'Optimierter Dienst',
      bottleneckLabel: 'Kapazitätsengpass',
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
    'Kanonischer Release-Pfad bleibt Deriver -> Sanitizer -> Association -> Render-Props',
  );
  await run(
    'node',
    ['scripts/check-content-review-finalization-path.mjs'],
    'Manuelle 22+6 Review-ID, Export-Nachweis und Finalizer-Reihenfolge bleiben verpflichtend',
  );
  await run(
    'npx',
    ['--no-install', 'tsc', '-p', 'ki/tsconfig.animation-library.json'],
    'TypeScript-Prüfung der gesamten Animationsbibliothek',
  );
  await run(
    'npx',
    ['--no-install', 'vitest', 'run', ...tests],
    'Gezielte Content-Matching-, Produktions-, Varianten-Promotion-, Manifest-, Registry-, Deriver-, Sanitizer-, Association-, Winner-Cue-, Messwert-, Sichtpräzisions-, Production-Shell-, Cross-Label-, Masterplan-Props-, Key-Consumer-, Diagnostics- und Runtime-Regressionstests',
  );
  await run(
    'node',
    [
      'scripts/render-content-matched-prototype.mjs',
      'scale-performance-latency-tunnel-race-v1',
      samplePropsPath,
      'plan',
    ],
    'Validierung des Remotion-Props- und Renderauftrags',
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
