export type SemanticBeatRole =
  | 'subject'
  | 'action'
  | 'transformation'
  | 'quantity'
  | 'comparison'
  | 'negation'
  | 'cause'
  | 'effect'
  | 'risk'
  | 'source'
  | 'time'
  | 'sequence'
  | 'tool'
  | 'result'
  | 'definition'
  | 'emphasis';

export type MicroMotionLayer =
  | 'kinetic-type'
  | 'main-object'
  | 'connector'
  | 'measurement'
  | 'annotation'
  | 'ui-simulation'
  | 'transition'
  | 'sound-cue';

export type MicroMotionIntensity = 'quiet' | 'support' | 'strong';

export type MicroMotionMechanism = {
  mechanismId: string;
  roles: readonly SemanticBeatRole[];
  layer: MicroMotionLayer;
  intensity: MicroMotionIntensity;
  motionSignature: string;
  semanticPurpose: string;
  maximumDurationFrames: number;
  requiresVisibleObject: boolean;
  soundCue: 'none' | 'tick' | 'click' | 'sweep' | 'impact' | 'warning' | 'resolve';
};

export const MICRO_MOTION_CATALOG: readonly MicroMotionMechanism[] = [
  {mechanismId:'keyword-rise-lock',roles:['subject','definition','emphasis'],layer:'kinetic-type',intensity:'support',motionSignature:'rise-ease-lock',semanticPurpose:'Introduce a key term and hold it long enough to read.',maximumDurationFrames:18,requiresVisibleObject:false,soundCue:'click'},
  {mechanismId:'keyword-width-expand',roles:['emphasis','result'],layer:'kinetic-type',intensity:'support',motionSignature:'width-expand-settle',semanticPurpose:'Make an important word visibly gain significance.',maximumDurationFrames:16,requiresVisibleObject:false,soundCue:'tick'},
  {mechanismId:'definition-bracket-draw',roles:['definition','subject'],layer:'annotation',intensity:'quiet',motionSignature:'brackets-trace-enclose',semanticPurpose:'Mark the exact term currently being defined.',maximumDurationFrames:20,requiresVisibleObject:false,soundCue:'none'},
  {mechanismId:'action-forward-travel',roles:['action'],layer:'main-object',intensity:'strong',motionSignature:'accelerate-travel-brake',semanticPurpose:'Turn the main verb into a visible directional action.',maximumDurationFrames:28,requiresVisibleObject:true,soundCue:'sweep'},
  {mechanismId:'action-press-release',roles:['action','transformation'],layer:'main-object',intensity:'strong',motionSignature:'approach-press-change-release',semanticPurpose:'Show an action that visibly changes an object or state.',maximumDurationFrames:32,requiresVisibleObject:true,soundCue:'impact'},
  {mechanismId:'transformation-morph-snap',roles:['transformation'],layer:'main-object',intensity:'strong',motionSignature:'morph-crossfade-free-snap',semanticPurpose:'Explain that one representation becomes another without a generic fade.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'transformation-slice-reassemble',roles:['transformation','sequence'],layer:'main-object',intensity:'strong',motionSignature:'slice-space-reorder-lock',semanticPurpose:'Make decomposition and reconstruction understandable.',maximumDurationFrames:34,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'number-odometer-roll',roles:['quantity'],layer:'measurement',intensity:'strong',motionSignature:'digit-roll-decelerate-lock',semanticPurpose:'Animate a changing integer or large number with a measurable stop.',maximumDurationFrames:28,requiresVisibleObject:false,soundCue:'tick'},
  {mechanismId:'percentage-gauge-sweep',roles:['quantity','comparison'],layer:'measurement',intensity:'strong',motionSignature:'arc-sweep-readout-lock',semanticPurpose:'Show a percentage as both movement and a final readable value.',maximumDurationFrames:32,requiresVisibleObject:false,soundCue:'resolve'},
  {mechanismId:'quantity-stack-count',roles:['quantity','sequence'],layer:'measurement',intensity:'support',motionSignature:'units-arrive-stack-count',semanticPurpose:'Make an amount concrete through countable visible units.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'tick'},
  {mechanismId:'comparison-split-balance',roles:['comparison'],layer:'main-object',intensity:'strong',motionSignature:'split-weigh-tilt-resolve',semanticPurpose:'Compare two options on a shared visual baseline.',maximumDurationFrames:36,requiresVisibleObject:true,soundCue:'impact'},
  {mechanismId:'comparison-overlay-difference',roles:['comparison'],layer:'annotation',intensity:'support',motionSignature:'align-overlay-isolate-delta',semanticPurpose:'Reveal exact differences while preserving the common structure.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'comparison-race-finish',roles:['comparison','result'],layer:'measurement',intensity:'strong',motionSignature:'parallel-travel-finish-rank',semanticPurpose:'Show a speed or performance comparison with a decisive end state.',maximumDurationFrames:36,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'negation-strike-remove',roles:['negation'],layer:'kinetic-type',intensity:'strong',motionSignature:'strike-cross-remove-hold',semanticPurpose:'Make a negation unmistakable without shaking all text.',maximumDurationFrames:20,requiresVisibleObject:false,soundCue:'warning'},
  {mechanismId:'negation-gate-block',roles:['negation','risk'],layer:'main-object',intensity:'support',motionSignature:'approach-gate-stop-reject',semanticPurpose:'Show that an option or assumption is explicitly blocked.',maximumDurationFrames:26,requiresVisibleObject:true,soundCue:'warning'},
  {mechanismId:'cause-arrow-trace',roles:['cause'],layer:'connector',intensity:'support',motionSignature:'origin-trace-arrow-arrive',semanticPurpose:'Connect a visible cause to the next consequence.',maximumDurationFrames:26,requiresVisibleObject:true,soundCue:'sweep'},
  {mechanismId:'cause-domino-trigger',roles:['cause','effect'],layer:'main-object',intensity:'strong',motionSignature:'trigger-propagate-impact-settle',semanticPurpose:'Explain a causal chain with one visible trigger.',maximumDurationFrames:36,requiresVisibleObject:true,soundCue:'impact'},
  {mechanismId:'effect-result-bloom',roles:['effect','result'],layer:'main-object',intensity:'strong',motionSignature:'signal-converge-result-bloom',semanticPurpose:'Make the consequence emerge from prior inputs rather than appear randomly.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'result-check-lock',roles:['result'],layer:'annotation',intensity:'support',motionSignature:'check-draw-badge-lock',semanticPurpose:'Hold the final outcome in a stable verified state.',maximumDurationFrames:22,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'risk-warning-pulse-once',roles:['risk'],layer:'annotation',intensity:'strong',motionSignature:'warning-enter-single-pulse-hold',semanticPurpose:'Create one controlled warning moment without continuous pulsing.',maximumDurationFrames:22,requiresVisibleObject:false,soundCue:'warning'},
  {mechanismId:'risk-confidence-crack',roles:['risk','negation'],layer:'main-object',intensity:'strong',motionSignature:'solid-hold-crack-reveal',semanticPurpose:'Show the gap between confident appearance and weak evidence.',maximumDurationFrames:34,requiresVisibleObject:true,soundCue:'warning'},
  {mechanismId:'source-stamp-verify',roles:['source'],layer:'annotation',intensity:'support',motionSignature:'source-arrive-stamp-lock',semanticPurpose:'Visibly attach a source or evidence status to a claim.',maximumDurationFrames:24,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'source-thread-connect',roles:['source','cause'],layer:'connector',intensity:'quiet',motionSignature:'source-thread-trace-attach',semanticPurpose:'Connect a statement to its supporting document or origin.',maximumDurationFrames:26,requiresVisibleObject:true,soundCue:'none'},
  {mechanismId:'time-line-travel',roles:['time','sequence'],layer:'main-object',intensity:'support',motionSignature:'timeline-pan-stop-highlight',semanticPurpose:'Move through ordered time while preserving orientation.',maximumDurationFrames:36,requiresVisibleObject:true,soundCue:'sweep'},
  {mechanismId:'time-version-flip',roles:['time','transformation'],layer:'ui-simulation',intensity:'support',motionSignature:'version-card-flip-delta-hold',semanticPurpose:'Show an old and new state with a visible version change.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'sequence-step-progress',roles:['sequence'],layer:'measurement',intensity:'support',motionSignature:'step-light-progress-lock',semanticPurpose:'Reveal ordered steps without animating every card identically.',maximumDurationFrames:32,requiresVisibleObject:true,soundCue:'tick'},
  {mechanismId:'sequence-handoff-object',roles:['sequence','action'],layer:'main-object',intensity:'strong',motionSignature:'receive-transform-handoff',semanticPurpose:'Explain a workflow through one object moving between roles or stations.',maximumDurationFrames:34,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'tool-cursor-demonstrate',roles:['tool','action'],layer:'ui-simulation',intensity:'support',motionSignature:'cursor-approach-click-result',semanticPurpose:'Demonstrate a real tool action instead of merely naming the interface.',maximumDurationFrames:28,requiresVisibleObject:true,soundCue:'click'},
  {mechanismId:'tool-panel-open-focus',roles:['tool','definition'],layer:'ui-simulation',intensity:'quiet',motionSignature:'panel-open-focus-hold',semanticPurpose:'Reveal the exact tool area relevant to the explanation.',maximumDurationFrames:24,requiresVisibleObject:true,soundCue:'none'},
  {mechanismId:'tool-command-run',roles:['tool','action','result'],layer:'ui-simulation',intensity:'strong',motionSignature:'type-command-run-output',semanticPurpose:'Show a command or prompt producing an observable result.',maximumDurationFrames:38,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'connector-thread-weight',roles:['cause','comparison','effect'],layer:'connector',intensity:'support',motionSignature:'thread-trace-thicken-settle',semanticPurpose:'Show that some relationships matter more than others.',maximumDurationFrames:28,requiresVisibleObject:true,soundCue:'none'},
  {mechanismId:'focus-spotlight-crop',roles:['subject','emphasis'],layer:'annotation',intensity:'quiet',motionSignature:'spotlight-move-crop-hold',semanticPurpose:'Direct attention to one relevant object without moving the entire camera.',maximumDurationFrames:24,requiresVisibleObject:true,soundCue:'none'},
  {mechanismId:'list-stack-press',roles:['sequence','result'],layer:'main-object',intensity:'support',motionSignature:'items-arrive-stack-press',semanticPurpose:'Compress several inputs into one concise result.',maximumDurationFrames:32,requiresVisibleObject:true,soundCue:'impact'},
  {mechanismId:'scroll-brake-focus',roles:['tool','time','sequence'],layer:'ui-simulation',intensity:'support',motionSignature:'scroll-travel-brake-focus',semanticPurpose:'Move through long content and stop exactly at the relevant part.',maximumDurationFrames:30,requiresVisibleObject:true,soundCue:'sweep'},
  {mechanismId:'callout-line-draw',roles:['definition','source','emphasis'],layer:'annotation',intensity:'quiet',motionSignature:'line-trace-label-hold',semanticPurpose:'Attach a concise label to a specific visual object.',maximumDurationFrames:22,requiresVisibleObject:true,soundCue:'none'},
  {mechanismId:'transition-object-carry',roles:['result','sequence'],layer:'transition',intensity:'support',motionSignature:'object-exit-carry-enter',semanticPurpose:'Carry one semantic object into the next scene instead of resetting the frame.',maximumDurationFrames:18,requiresVisibleObject:true,soundCue:'sweep'},
  {mechanismId:'transition-shape-match',roles:['transformation','comparison'],layer:'transition',intensity:'support',motionSignature:'shape-align-match-reveal',semanticPurpose:'Use a shared shape to bridge two related visual states.',maximumDurationFrames:18,requiresVisibleObject:true,soundCue:'resolve'},
  {mechanismId:'transition-hard-cut-impact',roles:['risk','result','emphasis'],layer:'transition',intensity:'strong',motionSignature:'hold-hard-cut-impact-hold',semanticPurpose:'Create a decisive editorial beat without a fade or ornamental transition.',maximumDurationFrames:8,requiresVisibleObject:false,soundCue:'impact'},
] as const;

export const getMicroMotionMechanismsForRole = (
  role: SemanticBeatRole,
): MicroMotionMechanism[] =>
  MICRO_MOTION_CATALOG.filter((mechanism) => mechanism.roles.includes(role));

export const getMicroMotionMechanism = (
  mechanismId: string,
): MicroMotionMechanism | undefined =>
  MICRO_MOTION_CATALOG.find(
    (mechanism) => mechanism.mechanismId === mechanismId,
  );
