import {animationLibraryEntrySchema, type AnimationLibraryEntry} from './schema';

type ExpansionSpec = {
  family: string;
  semanticTags: [string, string, ...string[]];
  variants: readonly [
    {
      id: string;
      title: string;
      description: string;
      layout: string;
      motion: string;
      direction: AnimationLibraryEntry['primaryDirection'];
      energy: AnimationLibraryEntry['energy'];
      primitives: [string, ...string[]];
    },
    {
      id: string;
      title: string;
      description: string;
      layout: string;
      motion: string;
      direction: AnimationLibraryEntry['primaryDirection'];
      energy: AnimationLibraryEntry['energy'];
      primitives: [string, ...string[]];
    },
  ];
};

const EXPANSION_SPECS: readonly ExpansionSpec[] = [
  {family:'retrieval-search',semanticTags:['retrieval','search','evidence'],variants:[
    {id:'evidence-radar-sweep-v1',title:'Evidence Radar Sweep',description:'A focused radar sweep discovers only evidence that matches the query and rejects distracting fragments.',layout:'offset-radar-evidence-field',motion:'sweep-detect-rank-lock',direction:'circular',energy:'measured',primitives:['radar-ring','evidence-fragment','relevance-ping']},
    {id:'source-gravity-well-v1',title:'Source Gravity Well',description:'Trusted sources fall into a central answer core while weak sources remain outside the confidence boundary.',layout:'concentric-source-gravity-field',motion:'scatter-attract-filter-settle',direction:'outside-in',energy:'dynamic',primitives:['source-card','gravity-core','trust-boundary']},
  ]},
  {family:'cost-efficiency',semanticTags:['cost','efficiency','savings'],variants:[
    {id:'token-cost-waterfall-v1',title:'Token Cost Waterfall',description:'Token groups descend through priced stages and visibly accumulate into a final cost total.',layout:'vertical-priced-stage-waterfall',motion:'drop-meter-accumulate-total',direction:'top-to-bottom',energy:'measured',primitives:['token-unit','price-stage','cost-total']},
    {id:'efficiency-gear-shift-v1',title:'Efficiency Gear Shift',description:'A process changes gears as batching, caching, and routing reduce time and resource use.',layout:'diagonal-machine-gear-route',motion:'engage-shift-accelerate-stabilize',direction:'left-to-right',energy:'dynamic',primitives:['process-gear','efficiency-lever','speed-readout']},
  ]},
  {family:'context-window',semanticTags:['context','memory','limit'],variants:[
    {id:'memory-shelf-overflow-v1',title:'Memory Shelf Overflow',description:'New messages fill a finite shelf until old context is pushed beyond the visible memory boundary.',layout:'finite-horizontal-memory-shelf',motion:'place-fill-push-evict',direction:'left-to-right',energy:'measured',primitives:['message-block','memory-shelf','eviction-edge']},
    {id:'context-spotlight-crop-v1',title:'Context Spotlight Crop',description:'A moving context spotlight reveals which parts of a long conversation remain visible to the model.',layout:'wide-conversation-strip-window',motion:'scan-crop-focus-release',direction:'right-to-left',energy:'calm',primitives:['conversation-strip','spotlight-window','hidden-region']},
  ]},
  {family:'decision-logic',semanticTags:['decision','branch','choice'],variants:[
    {id:'constraint-gate-maze-v1',title:'Constraint Gate Maze',description:'Options travel through visible rule gates until only the choice satisfying every condition reaches the exit.',layout:'multi-gate-decision-maze',motion:'enter-test-reject-pass',direction:'left-to-right',energy:'dynamic',primitives:['choice-marker','constraint-gate','decision-exit']},
    {id:'tradeoff-balance-orbit-v1',title:'Tradeoff Balance Orbit',description:'Competing criteria orbit a decision core and shift the final choice as their weights change.',layout:'weighted-orbital-decision-core',motion:'orbit-weigh-tilt-resolve',direction:'circular',energy:'measured',primitives:['criteria-node','weight-ring','decision-core']},
  ]},
  {family:'human-ai-collaboration',semanticTags:['human','ai','collaboration'],variants:[
    {id:'copilot-control-handoff-v1',title:'Copilot Control Handoff',description:'Control moves between human judgment and AI execution depending on confidence and responsibility.',layout:'dual-cockpit-control-panel',motion:'suggest-review-handoff-confirm',direction:'left-to-right',energy:'measured',primitives:['human-control','ai-control','handoff-token']},
    {id:'skill-interlock-workbench-v1',title:'Skill Interlock Workbench',description:'Human expertise and AI speed interlock like complementary tools to complete one shared task.',layout:'split-workbench-interlock',motion:'prepare-align-interlock-finish',direction:'outside-in',energy:'dynamic',primitives:['human-tool','ai-tool','shared-result']},
  ]},
  {family:'learning-updates',semanticTags:['learning','update','knowledge'],variants:[
    {id:'knowledge-version-ladder-v1',title:'Knowledge Version Ladder',description:'A fact climbs through dated versions while superseded states remain visible for auditability.',layout:'vertical-version-ladder',motion:'observe-compare-promote-archive',direction:'bottom-to-top',energy:'measured',primitives:['fact-node','version-step','archive-marker']},
    {id:'model-update-delta-map-v1',title:'Model Update Delta Map',description:'Only changed knowledge regions light up between two model versions, revealing what was actually updated.',layout:'paired-delta-knowledge-map',motion:'overlay-diff-highlight-resolve',direction:'center-out',energy:'calm',primitives:['knowledge-region','delta-overlay','change-marker']},
  ]},
  {family:'tokenization',semanticTags:['token','text','split'],variants:[
    {id:'syllable-conveyor-cut-v1',title:'Syllable Conveyor Cut',description:'A sentence moves across a conveyor and is cut into uneven token pieces at model-specific boundaries.',layout:'horizontal-token-conveyor',motion:'travel-scan-cut-space',direction:'left-to-right',energy:'dynamic',primitives:['sentence-strip','cut-blade','token-piece']},
    {id:'token-mosaic-reassembly-v1',title:'Token Mosaic Reassembly',description:'Separated token tiles reorganize into multiple possible word groupings to explain model-dependent segmentation.',layout:'modular-token-mosaic',motion:'separate-shuffle-group-lock',direction:'center-out',energy:'measured',primitives:['token-tile','group-frame','boundary-marker']},
  ]},
  {family:'data-transformation',semanticTags:['data','transform','vector'],variants:[
    {id:'dimension-elevator-v1',title:'Dimension Elevator',description:'Simple labels rise through dimensional floors and become richer numerical representations at each level.',layout:'vertical-dimensional-elevator',motion:'enter-rise-transform-release',direction:'bottom-to-top',energy:'dynamic',primitives:['label-capsule','dimension-floor','vector-readout']},
    {id:'feature-spectrum-split-v1',title:'Feature Spectrum Split',description:'One input beam separates into visible feature channels before recombining as a structured representation.',layout:'prismatic-feature-spectrum',motion:'beam-enter-split-label-recombine',direction:'left-to-right',energy:'impact',primitives:['input-beam','feature-band','vector-output']},
  ]},
  {family:'ranking',semanticTags:['ranking','score','order'],variants:[
    {id:'score-ladder-climb-v1',title:'Score Ladder Climb',description:'Candidates climb a score ladder as live criteria add or remove points from their total.',layout:'vertical-score-ladder',motion:'enter-score-climb-lock',direction:'bottom-to-top',energy:'dynamic',primitives:['candidate-marker','score-rung','winner-lock']},
    {id:'ranking-carousel-snap-v1',title:'Ranking Carousel Snap',description:'Candidates rotate through a carousel and snap into ordered positions when the evaluation closes.',layout:'circular-ranking-carousel',motion:'orbit-evaluate-snap-order',direction:'circular',energy:'measured',primitives:['candidate-card','ranking-ring','position-slot']},
  ]},
  {family:'process-flow',semanticTags:['process','workflow','steps'],variants:[
    {id:'assembly-line-handoff-v1',title:'Assembly Line Handoff',description:'A task object changes form as specialized stations hand it forward through a complete workflow.',layout:'industrial-horizontal-assembly-line',motion:'receive-transform-handoff-complete',direction:'left-to-right',energy:'dynamic',primitives:['task-object','process-station','handoff-arm']},
    {id:'workflow-river-delta-v1',title:'Workflow River Delta',description:'Parallel workstreams branch, process independently, and merge into one final deliverable.',layout:'branching-river-workflow',motion:'flow-branch-process-merge',direction:'top-to-bottom',energy:'measured',primitives:['workstream','branch-channel','merge-basin']},
  ]},
  {family:'input-output',semanticTags:['input','output','compression'],variants:[
    {id:'signal-press-output-v1',title:'Signal Press Output',description:'A noisy input is compressed through a mechanical press into one clean structured output.',layout:'central-signal-press',motion:'scatter-feed-compress-release',direction:'outside-in',energy:'impact',primitives:['input-fragment','compression-press','clean-output']},
    {id:'prompt-lens-result-v1',title:'Prompt Lens Result',description:'A prompt passes through a configurable lens that changes the shape and focus of the generated result.',layout:'lens-mediated-input-output',motion:'prompt-enter-focus-shape-project',direction:'depth-forward',energy:'measured',primitives:['prompt-card','control-lens','result-plane']},
  ]},
  {family:'error-detection',semanticTags:['error','anomaly','debug'],variants:[
    {id:'bug-trace-heatmap-v1',title:'Bug Trace Heatmap',description:'A failure pulse travels backward through a system and reveals the hottest likely source of the error.',layout:'reverse-diagnostic-stack',motion:'fail-freeze-trace-isolate',direction:'right-to-left',energy:'dynamic',primitives:['failure-pulse','system-node','heat-marker']},
    {id:'anomaly-quarantine-ring-v1',title:'Anomaly Quarantine Ring',description:'Normal data flows onward while anomalous elements are detected and trapped inside a quarantine ring.',layout:'flow-with-quarantine-bypass',motion:'stream-detect-divert-contain',direction:'left-to-right',energy:'dynamic',primitives:['data-particle','detector-gate','quarantine-ring']},
  ]},
  {family:'semantic-space',semanticTags:['meaning','similarity','embedding'],variants:[
    {id:'meaning-constellation-v1',title:'Meaning Constellation',description:'Concept stars connect into constellations according to semantic similarity and shared context.',layout:'deep-constellation-field',motion:'appear-drift-connect-name',direction:'depth-forward',energy:'calm',primitives:['concept-star','similarity-line','cluster-label']},
    {id:'semantic-continent-drift-v1',title:'Semantic Continent Drift',description:'Meaning regions move closer or farther apart as context changes the relationship between concepts.',layout:'topographic-semantic-map',motion:'map-form-drift-overlap-settle',direction:'mixed',energy:'measured',primitives:['meaning-region','distance-grid','context-force']},
  ]},
  {family:'relationship-network',semanticTags:['relationship','attention','connection'],variants:[
    {id:'attention-bridge-load-v1',title:'Attention Bridge Load',description:'Connections become thicker under semantic load, revealing which relationships carry the answer.',layout:'suspension-attention-network',motion:'nodes-place-bridges-load-highlight',direction:'center-out',energy:'measured',primitives:['word-node','attention-bridge','load-signal']},
    {id:'dependency-pulse-grid-v1',title:'Dependency Pulse Grid',description:'A pulse crosses a dependency grid and exposes direct, indirect, and blocked relationships.',layout:'orthogonal-dependency-grid',motion:'inject-propagate-block-resolve',direction:'left-to-right',energy:'dynamic',primitives:['dependency-node','pulse-line','block-gate']},
  ]},
  {family:'probability',semanticTags:['probability','prediction','candidate'],variants:[
    {id:'probability-weather-map-v1',title:'Probability Weather Map',description:'Candidate outcomes appear as changing probability zones until one region becomes dominant.',layout:'probability-weather-field',motion:'seed-spread-compete-dominate',direction:'center-out',energy:'measured',primitives:['candidate-zone','percentage-label','dominance-front']},
    {id:'prediction-pinball-v1',title:'Prediction Pinball',description:'A probability token bounces through weighted factors before landing on the next-word candidate.',layout:'vertical-weighted-pinball-board',motion:'drop-deflect-score-land',direction:'top-to-bottom',energy:'dynamic',primitives:['probability-ball','weight-peg','candidate-slot']},
  ]},
  {family:'model-processing',semanticTags:['model','layers','processing'],variants:[
    {id:'residual-spiral-stair-v1',title:'Residual Spiral Stair',description:'Information climbs layered transformations while residual shortcuts preserve useful earlier signals.',layout:'spiral-layer-staircase',motion:'climb-transform-skip-rejoin',direction:'bottom-to-top',energy:'dynamic',primitives:['signal-token','layer-step','residual-bridge']},
    {id:'neural-foundry-pass-v1',title:'Neural Foundry Pass',description:'A rough input is heated, shaped, and refined through successive model chambers.',layout:'depth-foundry-chambers',motion:'feed-heat-shape-refine',direction:'depth-forward',energy:'impact',primitives:['input-ingot','model-chamber','refined-output']},
  ]},
  {family:'answer-generation',semanticTags:['answer','generation','sequence'],variants:[
    {id:'sentence-rail-builder-v1',title:'Sentence Rail Builder',description:'Words are placed one after another onto a moving rail while alternatives remain visible in side tracks.',layout:'horizontal-word-rail-yard',motion:'choose-place-advance-complete',direction:'left-to-right',energy:'measured',primitives:['word-carriage','main-rail','alternative-track']},
    {id:'answer-origami-fold-v1',title:'Answer Origami Fold',description:'Separate evidence and language fragments fold into one coherent answer structure.',layout:'central-origami-answer-stage',motion:'scatter-align-fold-reveal',direction:'outside-in',energy:'dynamic',primitives:['evidence-sheet','language-fold','answer-form']},
  ]},
  {family:'risk-truth',semanticTags:['risk','truth','confidence'],variants:[
    {id:'confidence-ice-thaw-v1',title:'Confidence Ice Thaw',description:'A confident statement appears solid until missing evidence causes cracks and visible melting.',layout:'single-statement-ice-stage',motion:'form-freeze-crack-thaw',direction:'center-out',energy:'impact',primitives:['statement-block','confidence-ice','evidence-gap']},
    {id:'truth-checkpoint-barrier-v1',title:'Truth Checkpoint Barrier',description:'A fluent answer must pass source, date, and evidence checkpoints before receiving a verified state.',layout:'multi-checkpoint-truth-lane',motion:'approach-test-hold-clear',direction:'left-to-right',energy:'measured',primitives:['answer-vehicle','truth-gate','verification-badge']},
  ]},
  {family:'security-privacy',semanticTags:['security','privacy','access'],variants:[
    {id:'permission-airlock-v1',title:'Permission Airlock',description:'Data crosses identity and permission chambers before access is granted or denied.',layout:'depth-security-airlock',motion:'request-scan-authorize-open',direction:'depth-forward',energy:'dynamic',primitives:['data-packet','identity-scan','permission-door']},
    {id:'privacy-redaction-sweep-v1',title:'Privacy Redaction Sweep',description:'A privacy sweep detects sensitive fields and replaces them before the document leaves the secure zone.',layout:'document-redaction-workbench',motion:'scan-detect-mask-release',direction:'top-to-bottom',energy:'measured',primitives:['document-sheet','sensitive-field','redaction-mask']},
  ]},
  {family:'performance-scaling',semanticTags:['performance','scaling','latency'],variants:[
    {id:'load-balancer-hydra-v1',title:'Load Balancer Hydra',description:'One incoming stream divides across multiple workers and recombines into a faster response.',layout:'fanout-worker-hydra',motion:'arrive-split-process-merge',direction:'center-out',energy:'dynamic',primitives:['request-stream','worker-node','response-merge']},
    {id:'latency-domino-chain-v1',title:'Latency Domino Chain',description:'Small delays propagate through dependent stages and expose the bottleneck that controls total response time.',layout:'diagonal-latency-dominoes',motion:'trigger-propagate-slow-freeze',direction:'left-to-right',energy:'impact',primitives:['latency-stage','delay-domino','bottleneck-marker']},
  ]},
  {family:'time-change',semanticTags:['time','change','history'],variants:[
    {id:'version-time-capsules-v1',title:'Version Time Capsules',description:'Dated snapshots open in sequence to reveal exactly how a product or model changed over time.',layout:'depth-timeline-capsules',motion:'approach-open-compare-advance',direction:'depth-forward',energy:'calm',primitives:['time-capsule','version-label','change-highlight']},
    {id:'trend-seismograph-v1',title:'Trend Seismograph',description:'A changing metric draws a live seismograph while key events visibly disturb the trend line.',layout:'wide-event-seismograph',motion:'draw-shock-label-stabilize',direction:'left-to-right',energy:'measured',primitives:['trend-line','event-shock','time-marker']},
  ]},
  {family:'comparison',semanticTags:['compare','difference','benchmark'],variants:[
    {id:'feature-bridge-duel-v1',title:'Feature Bridge Duel',description:'Two options build competing bridges from the same baseline, exposing strengths, gaps, and tradeoffs.',layout:'mirrored-feature-bridge',motion:'baseline-build-compare-mark',direction:'center-out',energy:'dynamic',primitives:['option-platform','feature-span','gap-marker']},
    {id:'comparison-xray-overlay-v1',title:'Comparison X-Ray Overlay',description:'Two systems overlap transparently so structural differences become visible without switching screens.',layout:'layered-xray-comparison',motion:'align-overlay-isolate-conclude',direction:'outside-in',energy:'calm',primitives:['system-layer','xray-overlay','difference-callout']},
  ]},
];

const buildEntry = (
  spec: ExpansionSpec,
  variant: ExpansionSpec['variants'][number],
): AnimationLibraryEntry => animationLibraryEntrySchema.parse({
  animationId: variant.id,
  version: 1,
  title: variant.title,
  description: variant.description,
  status: 'concept',
  visualFamily: spec.family,
  layoutFamily: variant.layout,
  motionSignature: variant.motion,
  noveltyGroup: `${spec.family}-${variant.direction}`,
  semanticTags: spec.semanticTags,
  explanationPatterns: ['semantic-cause-and-effect','visible-transformation'],
  avoidWhen: ['the spoken sentence has no semantic connection to this family'],
  primitiveTags: variant.primitives,
  transitionInTags: [`${variant.direction}-entry`, variant.primitives[0]],
  transitionOutTags: [`${variant.direction}-result`, variant.primitives[variant.primitives.length - 1]],
  cameraStyle: variant.direction.startsWith('depth')
    ? 'controlled-depth-camera-with-locked-text-plane'
    : 'locked-camera-with-directed-object-choreography',
  primaryDirection: variant.direction,
  energy: variant.energy,
  density: 'balanced',
  complexity: 'medium',
  durationSeconds: {min: 4, max: 7},
  qualityPrior: {
    semanticClarity: 78,
    novelty: 91,
    productionConfidence: 42,
  },
});

export const ANIMATION_LIBRARY_EXPANSION_ENTRIES: readonly AnimationLibraryEntry[] =
  EXPANSION_SPECS.flatMap((spec) => spec.variants.map((variant) => buildEntry(spec, variant)));
