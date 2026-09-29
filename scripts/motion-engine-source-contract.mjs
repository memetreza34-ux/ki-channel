import ts from 'typescript';

const heroComponents=new Set([
  'CinematicCameraRig',
  'ChoreographedObject',
  'ImpactShake',
  'AliveHold',
  'DirectionalBlur',
]);
const animatedAssetComponents=new Set(['Lottie','RemotionRiveCanvas']);
const customMotionCalls=new Set([
  'spring',
  'interpolate',
  'evolvePath',
  'getPointAtLength',
  'bezierPoint',
  'bezierTangentAngle',
  'dampedOscillation',
  'noise2D',
  'noise3D',
]);

const tail=(value)=>String(value).split('.').at(-1)??String(value);

export const collectMotionEngineEvidence=(sourceText)=>{
  const source=ts.createSourceFile('motion-engine.tsx',sourceText,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const jsx=new Set();
  const calls=new Set();
  const identifiers=new Set();
  const strings=[];
  const visit=(node)=>{
    if (ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)) jsx.add(tail(node.tagName.getText(source)));
    if (ts.isCallExpression(node)) calls.add(tail(node.expression.getText(source)));
    if (ts.isIdentifier(node)) identifiers.add(node.text);
    if (ts.isStringLiteralLike(node)) strings.push(node.text);
    if (ts.isTemplateExpression(node)) strings.push(node.getText(source));
    ts.forEachChild(node,visit);
  };
  visit(source);
  return {jsx,calls,identifiers,strings};
};

export const validateHeroMotionSource=(sourceText,{label='hero source'}={})=>{
  const failures=[];
  const evidence=collectMotionEngineEvidence(sourceText);
  const usedEngine=[...heroComponents].filter((name)=>evidence.jsx.has(name));
  const usesAnimatedAsset=[...animatedAssetComponents].some((name)=>evidence.jsx.has(name));
  const customCalls=[...customMotionCalls].filter((name)=>evidence.calls.has(name));
  const hasFrame=evidence.calls.has('useCurrentFrame');
  const phaseWords=/anticipat|impact|settle|overshoot|follow.?through|travel|reveal|push-through|whip-|impact-push|camera|trajectory|bezier/i.test(sourceText);
  const transformSignals=evidence.strings.filter((value)=>/translate3d|rotate[XYZ]?\(|scale[XYZ]?\(|blur\(/i.test(value)).length;

  const engineChoreography=usedEngine.length>=2;
  const customChoreography=hasFrame && phaseWords && customCalls.length>=2 && transformSignals>=1;

  if (!engineChoreography && !customChoreography && !usesAnimatedAsset) {
    failures.push(
      `${label}: hero motion is utility-only. Use at least two Motion Engine primitives, an authored frame-driven choreography (phase + multiple timing mechanisms + transform), or a real Lottie/Rive animation asset.`,
    );
  }

  if (!engineChoreography && !usesAnimatedAsset && !hasFrame) {
    failures.push(`${label}: custom hero choreography must be frame-driven with useCurrentFrame().`);
  }

  return failures;
};
