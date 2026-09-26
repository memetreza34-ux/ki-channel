export const REMOTION_CAPABILITIES = [
  'react-svg-css','paths','shapes','three','depth-2.5d','kinetic-typography','terminal-code','data-visualization','object-transformation','motion-blur','transitions','noise','real-capture',
];

const capabilities = new Set(REMOTION_CAPABILITIES);
const advanced = new Set(REMOTION_CAPABILITIES.filter((capability)=>capability!=='react-svg-css'));

export const isSafeReelSourceFile = (sourceFile) => {
  if (typeof sourceFile!=='string' || !sourceFile.trim()) return false;
  const normalized=sourceFile.replaceAll('\\','/');
  if (normalized.startsWith('/') || normalized.includes('://')) return false;
  if (normalized.split('/').includes('..')) return false;
  if (!normalized.startsWith('ki/src/reels/')) return false;
  return /\.(?:ts|tsx)$/.test(normalized);
};

export const validateRemotionCapabilityManifest = (manifest,{label='remotion-capabilities-v1.json'}={}) => {
  const failures=[];
  if (!manifest || typeof manifest!=='object') return [`${label}: manifest must be an object.`];
  if (manifest.version!==1) failures.push(`${label}: version must be 1.`);

  const sourceFiles=Array.isArray(manifest.sourceFiles)?manifest.sourceFiles:[];
  if (sourceFiles.length===0) failures.push(`${label}: sourceFiles must contain at least one reel source file.`);
  const uniqueSourceFiles=new Set();
  for (const [index,sourceFile] of sourceFiles.entries()) {
    if (!isSafeReelSourceFile(sourceFile)) failures.push(`${label}: sourceFiles[${index}] must be a .ts/.tsx file below ki/src/reels/ without path traversal.`);
    else if (uniqueSourceFiles.has(sourceFile)) failures.push(`${label}: duplicate sourceFile ${sourceFile}.`);
    else uniqueSourceFiles.add(sourceFile);
  }

  if (!Array.isArray(manifest.beats) || manifest.beats.length<4) return [...failures,`${label}: beats must contain at least four beats.`];

  const ids=new Set(); let advancedBeats=0; let heroBeats=0;
  for (const [index,beat] of manifest.beats.entries()) {
    const prefix=`${label}: beats[${index}]`;
    if (!beat || typeof beat!=='object') {failures.push(`${prefix} must be an object.`);continue;}
    if (typeof beat.beatId!=='string' || !beat.beatId.trim()) failures.push(`${prefix}.beatId must be a non-empty string.`);
    else if (ids.has(beat.beatId)) failures.push(`${prefix}: duplicate beatId ${beat.beatId}.`); else ids.add(beat.beatId);
    if (!capabilities.has(beat.primaryCapability)) failures.push(`${prefix}.primaryCapability is invalid: ${beat.primaryCapability}`);
    if (!Array.isArray(beat.capabilities) || beat.capabilities.length===0) failures.push(`${prefix}.capabilities must be a non-empty array.`);
    else {
      for (const capability of beat.capabilities) if (!capabilities.has(capability)) failures.push(`${prefix}.capabilities contains invalid value ${capability}.`);
      if (!beat.capabilities.includes(beat.primaryCapability)) failures.push(`${prefix}.capabilities must include primaryCapability.`);
    }
    if (!isSafeReelSourceFile(beat.sourceFile)) failures.push(`${prefix}.sourceFile must be a safe .ts/.tsx file below ki/src/reels/.`);
    else if (!sourceFiles.includes(beat.sourceFile)) failures.push(`${prefix}.sourceFile must also be listed in manifest.sourceFiles.`);
    if (typeof beat.rationale!=='string' || beat.rationale.trim().length<20) failures.push(`${prefix}.rationale must explain why this Remotion mechanism is the best visual explanation.`);
    if (beat.primaryPrimitive==='card' && !(typeof beat.semanticCardReason==='string' && beat.semanticCardReason.trim())) failures.push(`${prefix}: abstract card default is forbidden; semanticCardReason is required.`);
    if (advanced.has(beat.primaryCapability)) advancedBeats+=1;
    if (beat.isHero===true) heroBeats+=1;
    if (beat.isHook===true && !advanced.has(beat.primaryCapability)) failures.push(`${prefix}: hook cannot use plain react-svg-css as its primary capability.`);
  }

  if (heroBeats<1) failures.push(`${label}: at least one beat must be marked isHero=true.`);
  if (advancedBeats/manifest.beats.length<0.5) failures.push(`${label}: at least 50% of beats must use an advanced Remotion capability as primaryCapability.`);
  const uniquePrimary=new Set(manifest.beats.map((beat)=>beat?.primaryCapability).filter(Boolean)).size;
  if (uniquePrimary<Math.min(3,manifest.beats.length)) failures.push(`${label}: at least three different primary capabilities are required.`);

  for (let index=2;index<manifest.beats.length;index+=1) {
    const a=manifest.beats[index-2],b=manifest.beats[index-1],c=manifest.beats[index];
    if (a?.primaryCapability===b?.primaryCapability && b?.primaryCapability===c?.primaryCapability && !b?.continuationOfPrevious && !c?.continuationOfPrevious) {
      failures.push(`${label}: ${a.beatId}, ${b.beatId}, ${c.beatId} repeat ${c.primaryCapability} three times without continuationOfPrevious.`);
    }
  }
  return failures;
};

export const CAPABILITY_SOURCE_EVIDENCE = {
  paths:['<AnimatedDataPath','evolvePath(','getPointAtLength('],
  shapes:['<ShapeSignal','<Circle','<Triangle','makeCircle(','makeTriangle('],
  three:['<ThreeCanvas','<mesh','<group','<perspectiveCamera'],
  'depth-2.5d':['<DepthStage','perspective:','translate3d('],
  'kinetic-typography':['<KineticType','<KineticNumber','data-remotion-capability="kinetic-typography"'],
  'terminal-code':['<TerminalMock','<CodeDiff','<CodeEditor'],
  'data-visualization':['<BenchmarkAxis','<DataChart','<LineChart','<BarChart','<AreaChart'],
  'object-transformation':['<ObjectTransformation','<ObjectMorph','data-remotion-capability="object-transformation"'],
  'motion-blur':['<CameraMotionBlur','<Trail'],
  transitions:['<TransitionSeries'],
  noise:['noise2D(','noise3D('],
  'real-capture':['<OffthreadVideo','<Video','<Img','staticFile('],
};

export const findMissingCapabilityEvidence = (manifest,sourceByFile) => {
  const failures=[];
  const sources=sourceByFile instanceof Map?sourceByFile:new Map(Object.entries(sourceByFile??{}));
  for (const beat of manifest?.beats??[]) {
    if (!beat || typeof beat!=='object' || !isSafeReelSourceFile(beat.sourceFile)) continue;
    const sourceText=sources.get(beat.sourceFile)??'';
    for (const capability of beat.capabilities??[]) {
      const tokens=CAPABILITY_SOURCE_EVIDENCE[capability];
      if (!tokens) continue;
      if (!tokens.some((token)=>sourceText.includes(token))) {
        failures.push(`${beat.beatId}/${capability}: no implementation evidence found in ${beat.sourceFile} (expected one of: ${tokens.join(', ')})`);
      }
    }
  }
  return failures;
};
