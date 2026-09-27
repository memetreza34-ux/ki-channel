export const V3_ARCHETYPES = new Set(['hero-impact','object-transformation','split-comparison','ui-demo','network-flow','device-scene','timeline-deadline','zoom-detail','terminal-code','final-verdict']);
const scoreKeys=['hook','visualVariety','motion','iconIllustrationUse','readability','overall'];

export const validateVisualQualityV3Manifest=(manifest,{label='visual-quality-v3.json'}={})=>{
  const errors=[]; const fail=(message)=>errors.push(`${label}: ${message}`);
  if (!manifest || typeof manifest!=='object') return [`${label}: manifest missing or invalid`];
  if (manifest.version!==3) fail('version must be 3');
  if (typeof manifest.sourceQualityContract!=='string' || !manifest.sourceQualityContract.endsWith('visualQuality.ts')) fail('sourceQualityContract must point to a reel visualQuality.ts file');
  const hook=manifest.hook??{};
  if (!(hook.heroAreaRatio>=.28)) fail('hook.heroAreaRatio must be >= 0.28');
  if (!(hook.semanticVisualAnchors>=2)) fail('hook.semanticVisualAnchors must be >= 2');
  if (!(hook.brandAnchorAreaRatio>=.035)) fail('hook.brandAnchorAreaRatio must be >= 0.035');
  if (!(hook.stateChangesFirstSecond>=2)) fail('hook.stateChangesFirstSecond must be >= 2');
  if (!(hook.stateChangesFirst3Seconds>=3)) fail('hook.stateChangesFirst3Seconds must be >= 3');
  if (hook.contrast!=='strong') fail('hook.contrast must be strong');
  if (hook.conflictVisible!==true) fail('hook.conflictVisible must be true');
  if (hook.keyMessageVisible!==true) fail('hook.keyMessageVisible must be true');

  const scenes=Array.isArray(manifest.scenes)?manifest.scenes:[];
  if (scenes.length<4) fail('at least four scenes are required');
  const ids=new Set();
  for (const [index,scene] of scenes.entries()) {
    const p=`scenes[${index}]`;
    if (!scene?.sceneId) fail(`${p}.sceneId missing`); else if (ids.has(scene.sceneId)) fail(`${p}.sceneId duplicate: ${scene.sceneId}`); else ids.add(scene.sceneId);
    if (!V3_ARCHETYPES.has(scene?.archetype)) fail(`${p}.archetype invalid`);
    if (!(scene?.heroAreaRatio>=.18)) fail(`${p}.heroAreaRatio must be >= 0.18`);
    if (!((scene?.semanticIconCount??0)+(scene?.illustrationCount??0)>=2)) fail(`${p} needs >=2 semantic icons/illustrations`);
    if (!(scene?.supportElementCount>=3)) fail(`${p}.supportElementCount must be >=3`);
    if (!(scene?.distinctShapeFamilies>=3)) fail(`${p}.distinctShapeFamilies must be >=3`);
    if (!(scene?.meaningfulStateChanges>=2)) fail(`${p}.meaningfulStateChanges must be >=2`);
    if (!(scene?.microBeats>=2)) fail(`${p}.microBeats must be >=2`);
    if (!((scene?.motionDistancePx??0)>=60 || (scene?.meaningfulStateChanges??0)>=4)) fail(`${p} is too static`);
    if (scene?.cameraMotion==='locked' && (scene?.depthLayers??0)<2 && (scene?.meaningfulStateChanges??0)<4) fail(`${p} locked camera needs depth or >=4 state changes`);
  }
  for (let i=1;i<scenes.length;i+=1) if (scenes[i-1]?.archetype===scenes[i]?.archetype) fail(`consecutive scenes repeat archetype ${scenes[i]?.archetype}`);
  const unique=new Set(scenes.map((scene)=>scene?.archetype)).size;
  if (scenes.length>=4 && unique<4) fail('at least four different shot archetypes are required');
  if (scenes.filter((scene)=>scene?.contrast==='soft').length>Math.floor(scenes.length*.25)) fail('too many soft/washed-out scenes');
  const scores=manifest.targetScores??{};
  for (const key of scoreKeys) if (!(scores[key]>=8 && scores[key]<=10)) fail(`targetScores.${key} must be 8-10`);
  return errors;
};

export const futureReelNeedsV3=(weekName,reelName)=>{
  const weekStart=String(weekName).slice(0,10);
  if (weekStart>='2026-09-28') return false;
  if (weekStart>'2026-09-21') return true;
  if (weekStart<'2026-09-21') return false;
  const index=Number(String(reelName).match(/^(\d{2})_/)?.[1]??0);
  return index>=5;
};
