import ts from 'typescript';

const heroComponents=new Set(['CinematicCameraRig','ChoreographedObject','ImpactShake','AliveHold','DirectionalBlur']);

const tail=(value)=>String(value).split('.').at(-1)??String(value);

export const collectMotionEngineEvidence=(sourceText)=>{
  const source=ts.createSourceFile('motion-engine.tsx',sourceText,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const jsx=new Set();
  const calls=new Set();
  const strings=[];
  const visit=(node)=>{
    if (ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)) jsx.add(tail(node.tagName.getText(source)));
    if (ts.isCallExpression(node)) calls.add(tail(node.expression.getText(source)));
    if (ts.isStringLiteralLike(node)) strings.push(node.text);
    ts.forEachChild(node,visit);
  };
  visit(source);
  return {jsx,calls,strings};
};

export const validateHeroMotionSource=(sourceText,{label='hero source'}={})=>{
  const failures=[];
  const evidence=collectMotionEngineEvidence(sourceText);
  const used=[...heroComponents].filter((name)=>evidence.jsx.has(name));
  if (used.length<2) failures.push(`${label}: hero motion must combine at least two Motion Engine primitives or use an explicitly custom choreography.`);
  if (!evidence.calls.has('useCurrentFrame')) failures.push(`${label}: frame-driven motion is required.`);
  const hasMotionPhase=/anticipation|impactFrame|settleFrame|push-through|whip-|impact-push/.test(sourceText);
  if (!hasMotionPhase) failures.push(`${label}: no authored anticipation/impact/settle or cinematic camera phase found.`);
  return failures;
};
