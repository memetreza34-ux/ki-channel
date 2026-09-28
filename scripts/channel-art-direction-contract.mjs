export const CHANNEL_ART_DIRECTION_ID='physical-ai-editorial-v1';
export const MATERIALS=new Set(['warm-paper','graphite','frosted-acrylic','clear-glass','brushed-metal','ceramic']);
export const CAMERAS=new Set(['editorial-medium','macro-push','controlled-orbit','top-down-mechanical','cutaway']);
export const ROLES=['hook','mechanism','payoff'];
export const GLOW_MODES=new Set(['none','semantic-only']);
const weakActions=new Set(['show','shows','display','displays','appear','appears','float','floats','zeigen','zeigt','erscheinen','erscheint','schweben','schwebt','bewegen','bewegt']);
const placeholders=/^(offen|todo|tbd|placeholder|dummy|test)$/i;
const useful=(value,min=5)=>typeof value==='string'&&value.trim().length>=min&&!placeholders.test(value.trim());

export const validateArtDirectionCalibration=(manifest,{label='art-direction-calibration.json',requireApproval=false}={})=>{
  const failures=[];
  const fail=(message)=>failures.push(`${label}: ${message}`);
  if(!manifest||typeof manifest!=='object')return [`${label}: manifest missing or invalid`];
  if(manifest.version!==1)fail('version must be 1');
  if(manifest.worldId!==CHANNEL_ART_DIRECTION_ID)fail(`worldId must be ${CHANNEL_ART_DIRECTION_ID}`);
  const scenes=Array.isArray(manifest.scenes)?manifest.scenes:[];
  if(scenes.length!==3)fail('exactly three calibration scenes are required');
  for(const role of ROLES){if(scenes.filter((scene)=>scene?.role===role).length!==1)fail(`needs exactly one ${role} scene`);}
  const ids=new Set();
  for(const [index,scene] of scenes.entries()){
    const p=`scenes[${index}]`;
    if(!ROLES.includes(scene?.role))fail(`${p}.role must be hook, mechanism or payoff`);
    if(!useful(scene?.sceneId,3))fail(`${p}.sceneId missing`);else if(ids.has(scene.sceneId))fail(`${p}.sceneId duplicate: ${scene.sceneId}`);else ids.add(scene.sceneId);
    if(!useful(scene?.heroObject,5))fail(`${p}.heroObject must name a concrete physical hero`);
    const action=String(scene?.physicalAction??'').trim().toLowerCase();
    if(!useful(scene?.physicalAction,4)||weakActions.has(action))fail(`${p}.physicalAction must describe a physical event, not show/appear/float`);
    if(!Array.isArray(scene?.materials)||scene.materials.length<1||scene.materials.length>3)fail(`${p}.materials must contain 1-3 material families`);else for(const material of scene.materials)if(!MATERIALS.has(material))fail(`${p}.materials contains invalid value ${material}`);
    if(!CAMERAS.has(scene?.camera))fail(`${p}.camera invalid`);
    if(!Number.isInteger(scene?.supportObjectCount)||scene.supportObjectCount<0||scene.supportObjectCount>3)fail(`${p}.supportObjectCount must be 0-3`);
    if(!Number.isInteger(scene?.visualLabelCount)||scene.visualLabelCount<0||scene.visualLabelCount>2)fail(`${p}.visualLabelCount must be 0-2`);
    if(!Number.isInteger(scene?.uiPanelCount)||scene.uiPanelCount<0||scene.uiPanelCount>1)fail(`${p}.uiPanelCount must be 0-1`);
    if(!GLOW_MODES.has(scene?.glowMode))fail(`${p}.glowMode must be none or semantic-only`);
    if(!(scene?.purpleCoverageTarget>=0&&scene.purpleCoverageTarget<=0.18))fail(`${p}.purpleCoverageTarget must be 0-0.18`);
    if(scene?.neonBackground!==false)fail(`${p}.neonBackground must be false`);
    if(scene?.dashboardGrammar!==false)fail(`${p}.dashboardGrammar must be false`);
    if(scene?.floatingPillCloud!==false)fail(`${p}.floatingPillCloud must be false`);
    if(!useful(scene?.channelWorldFit,20))fail(`${p}.channelWorldFit must explain the art-direction fit`);
  }
  if(!['PENDING','REWORK','APPROVED'].includes(manifest.humanCreativeStatus))fail('humanCreativeStatus must be PENDING, REWORK or APPROVED');
  if(manifest.humanCreativeStatus==='APPROVED'){
    if(manifest.approvedByHuman!==true)fail('APPROVED requires approvedByHuman=true');
    if(!useful(manifest.approvalNote,20))fail('APPROVED requires a concrete approvalNote');
    if(manifest.fullReelBuildAllowed!==true)fail('APPROVED requires fullReelBuildAllowed=true');
  }else if(manifest.fullReelBuildAllowed!==false){
    fail('fullReelBuildAllowed must remain false until human approval');
  }
  if(requireApproval&&manifest.humanCreativeStatus!=='APPROVED')fail('full Phase 1 build is blocked until humanCreativeStatus=APPROVED');
  if(requireApproval&&manifest.fullReelBuildAllowed!==true)fail('full Phase 1 build is blocked until fullReelBuildAllowed=true');
  return failures;
};
