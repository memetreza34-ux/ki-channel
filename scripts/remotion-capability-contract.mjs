import ts from 'typescript';

export const REMOTION_CAPABILITIES = [
  'react-svg-css','paths','shapes','three','depth-2.5d','kinetic-typography','terminal-code','data-visualization','object-transformation','motion-blur','transitions','noise','real-capture','lottie','rive',
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

export const beatSourceMarker = (beatId) => `// REMOTION_BEAT: ${beatId}`;

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

const CAPABILITY_AST_EVIDENCE = {
  paths:{jsx:['AnimatedDataPath'],calls:['evolvePath','getPointAtLength']},
  shapes:{jsx:['ShapeSignal','Circle','Triangle'],calls:['makeCircle','makeTriangle']},
  three:{jsx:['ThreeCanvas','mesh','group','perspectiveCamera'],calls:[]},
  'depth-2.5d':{jsx:['DepthStage'],calls:[],features:['perspective','translate3d']},
  'kinetic-typography':{jsx:['KineticType','KineticNumber'],calls:[]},
  'terminal-code':{jsx:['TerminalMock','CodeDiff','CodeEditor'],calls:[]},
  'data-visualization':{jsx:['BenchmarkAxis','DataChart','LineChart','BarChart','AreaChart'],calls:[]},
  'object-transformation':{jsx:['ObjectTransformation','ObjectMorph'],calls:[]},
  'motion-blur':{jsx:['CameraMotionBlur','Trail'],calls:[]},
  transitions:{jsx:['TransitionSeries'],calls:[]},
  noise:{jsx:[],calls:['noise2D','noise3D']},
  'real-capture':{jsx:['OffthreadVideo','Video','Img','CanvasImage'],calls:[]},
  lottie:{jsx:['Lottie'],calls:[]},
  rive:{jsx:['RemotionRiveCanvas'],calls:[]},
};

const getBeatSourceSlice = (sourceText,beatId) => {
  const marker=beatSourceMarker(beatId);
  const start=sourceText.indexOf(marker);
  if (start<0) return null;
  const next=sourceText.indexOf('// REMOTION_BEAT:',start+marker.length);
  return sourceText.slice(start,next<0?sourceText.length:next);
};

const tailName=(text)=>String(text).split('.').at(-1)??String(text);

const collectExecutableEvidence = (sourceText) => {
  const source=ts.createSourceFile('capability-beat.tsx',sourceText,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const jsx=new Set();
  const calls=new Set();
  const features=new Set();

  const visit=(node)=>{
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) jsx.add(tailName(node.tagName.getText(source)));
    if (ts.isCallExpression(node)) calls.add(tailName(node.expression.getText(source)));
    if (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) {
      const name=node.name?.getText(source)?.replace(/^['"]|['"]$/g,'');
      if (name==='perspective') features.add('perspective');
    }
    if (ts.isStringLiteralLike(node) && node.text.includes('translate3d(')) features.add('translate3d');
    if (ts.isTemplateExpression(node) && node.getText(source).includes('translate3d(')) features.add('translate3d');
    ts.forEachChild(node,visit);
  };
  visit(source);
  return {jsx,calls,features};
};

const hasCapabilityEvidence=(capability,evidence)=>{
  const expected=CAPABILITY_AST_EVIDENCE[capability];
  if (!expected) return true;
  return (expected.jsx??[]).some((name)=>evidence.jsx.has(name)) ||
    (expected.calls??[]).some((name)=>evidence.calls.has(name)) ||
    (expected.features??[]).some((name)=>evidence.features.has(name));
};

const expectedEvidenceLabel=(capability)=>{
  const expected=CAPABILITY_AST_EVIDENCE[capability];
  if (!expected) return 'none';
  return [...(expected.jsx??[]).map((name)=>`JSX:${name}`),...(expected.calls??[]).map((name)=>`call:${name}`),...(expected.features??[]).map((name)=>`feature:${name}`)].join(', ');
};

export const findMissingCapabilityEvidence = (manifest,sourceByFile) => {
  const failures=[];
  const sources=sourceByFile instanceof Map?sourceByFile:new Map(Object.entries(sourceByFile??{}));
  for (const beat of manifest?.beats??[]) {
    if (!beat || typeof beat!=='object' || !isSafeReelSourceFile(beat.sourceFile) || !beat.beatId) continue;
    const sourceText=sources.get(beat.sourceFile)??'';
    const beatSource=getBeatSourceSlice(sourceText,beat.beatId);
    if (beatSource===null) {
      failures.push(`${beat.beatId}: missing source marker "${beatSourceMarker(beat.beatId)}" in ${beat.sourceFile}.`);
      continue;
    }
    const evidence=collectExecutableEvidence(beatSource);
    for (const capability of beat.capabilities??[]) {
      if (!hasCapabilityEvidence(capability,evidence)) {
        failures.push(`${beat.beatId}/${capability}: no executable AST evidence found inside the beat source section in ${beat.sourceFile} (expected one of: ${expectedEvidenceLabel(capability)})`);
      }
    }
  }
  return failures;
};
