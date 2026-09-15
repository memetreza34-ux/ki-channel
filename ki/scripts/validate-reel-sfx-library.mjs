#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const fail=(message)=>{console.error(`SFX LIBRARY GATE FAILED: ${message}`);process.exit(1);};
const indexPath=path.resolve('public/reel-sfx/sfx-index.json');
if(!existsSync(indexPath)) fail('public/reel-sfx/sfx-index.json missing. Run node ki/scripts/setup-reel-sfx-library.mjs first.');
let index;
try{index=JSON.parse(await readFile(indexPath,'utf8'));}catch(error){fail(`invalid sfx-index.json: ${error.message}`);}
if(index.status!=='LOCAL_CC0_SFX_LIBRARY_READY') fail('library status is not LOCAL_CC0_SFX_LIBRARY_READY.');
if(!/^[0-9a-f]{40}$/i.test(index?.mirror?.commit||'')) fail('mirror commit SHA missing/invalid.');
const packs=Array.isArray(index.packs)?index.packs:[];
const items=Array.isArray(index.items)?index.items:[];
if(packs.length<5) fail(`only ${packs.length} packs indexed; expected at least 5.`);
if(items.length<300) fail(`only ${items.length} SFX indexed; expected at least 300.`);
for(const pack of packs){
  if(pack.license!=='CC0-1.0') fail(`${pack.id} is not CC0-1.0.`);
  if(!/^https:\/\/kenney\.nl\/assets\//.test(pack.officialUrl||'')) fail(`${pack.id} official Kenney URL missing.`);
  const licensePath=path.resolve('public/reel-sfx/licenses',`${pack.id}.txt`);
  if(!existsSync(licensePath)) fail(`license file missing for ${pack.id}.`);
  const text=await readFile(licensePath,'utf8');
  if(!/creative commons zero|\bcc0\b/i.test(text)) fail(`license file does not prove CC0 for ${pack.id}.`);
}
for(const item of items){
  if(item.license!=='CC0-1.0') fail(`non-CC0 item detected: ${item.id}`);
  if(!item.runtimeFile||!existsSync(path.resolve(item.runtimeFile))) fail(`runtime SFX missing: ${item.id}`);
  if(!Number.isFinite(Number(item.durationSeconds))||Number(item.durationSeconds)<=0) fail(`invalid duration: ${item.id}`);
}
console.log('SFX LIBRARY GATE PASSED');
console.log(`packs: ${packs.length}`);
console.log(`sounds: ${items.length}`);
console.log('license policy: CC0-only automatic library');
console.log(`mirror commit: ${index.mirror.commit}`);
