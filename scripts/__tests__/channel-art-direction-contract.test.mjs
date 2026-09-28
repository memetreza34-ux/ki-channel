import test from 'node:test';
import assert from 'node:assert/strict';
import {validateArtDirectionCalibration} from '../channel-art-direction-contract.mjs';

const scene=(role)=>({role,sceneId:`scene-${role}`,heroObject:role==='hook'?'heavy ceramic model core':'frosted acrylic information body',physicalAction:role==='hook'?'collides':'sorts',materials:['graphite','frosted-acrylic'],camera:role==='mechanism'?'top-down-mechanical':'editorial-medium',supportObjectCount:2,visualLabelCount:1,uiPanelCount:0,glowMode:'semantic-only',purpleCoverageTarget:.12,neonBackground:false,dashboardGrammar:false,floatingPillCloud:false,channelWorldFit:'Uses the same physical editorial objects, restrained material palette and weight-driven motion language.'});
const valid=()=>({version:1,worldId:'physical-ai-editorial-v1',scenes:[scene('hook'),scene('mechanism'),scene('payoff')],humanCreativeStatus:'APPROVED',approvedByHuman:true,approvalNote:'Human review approved the physical editorial world, material balance and visual hierarchy.',fullReelBuildAllowed:true});

test('accepts an approved physical AI calibration',()=>{assert.deepEqual(validateArtDirectionCalibration(valid(),{requireApproval:true}),[]);});

test('blocks dashboard/neon/pill-cloud drift',()=>{const manifest=valid();manifest.scenes[0].neonBackground=true;manifest.scenes[1].dashboardGrammar=true;manifest.scenes[2].floatingPillCloud=true;const errors=validateArtDirectionCalibration(manifest);assert.equal(errors.some((e)=>e.includes('neonBackground')),true);assert.equal(errors.some((e)=>e.includes('dashboardGrammar')),true);assert.equal(errors.some((e)=>e.includes('floatingPillCloud')),true);});

test('blocks UI density and excessive labels/support objects',()=>{const manifest=valid();manifest.scenes[0].supportObjectCount=6;manifest.scenes[0].visualLabelCount=5;manifest.scenes[0].uiPanelCount=4;const errors=validateArtDirectionCalibration(manifest);assert.equal(errors.some((e)=>e.includes('supportObjectCount')),true);assert.equal(errors.some((e)=>e.includes('visualLabelCount')),true);assert.equal(errors.some((e)=>e.includes('uiPanelCount')),true);});

test('does not allow automated approval',()=>{const manifest=valid();manifest.humanCreativeStatus='PENDING';manifest.approvedByHuman=false;manifest.approvalNote='';manifest.fullReelBuildAllowed=false;const errors=validateArtDirectionCalibration(manifest,{requireApproval:true});assert.equal(errors.some((e)=>e.includes('humanCreativeStatus=APPROVED')),true);});

test('blocks weak action-only animation',()=>{const manifest=valid();manifest.scenes[1].physicalAction='schwebt';const errors=validateArtDirectionCalibration(manifest);assert.equal(errors.some((e)=>e.includes('physicalAction')),true);});
