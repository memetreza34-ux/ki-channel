#!/usr/bin/env node
import {access,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const [rawRoot]=process.argv.slice(2);
if(!rawRoot){console.error('Aufruf: node scripts/init-art-direction-calibration.mjs "ki/reels/<Woche>/<Reel>"');process.exit(1);}
const reelRoot=resolve(rawRoot);
const project=resolve(reelRoot,'06-projektdateien');
const target=resolve(project,'art-direction-calibration.json');
const template=resolve('ki/gehirn/ART_DIRECTION_CALIBRATION_TEMPLATE.json');
try{await access(project);}catch{console.error(`Projektordner fehlt: ${project}`);process.exit(1);}
try{await access(target);console.error(`Datei existiert bereits: ${target}`);process.exit(1);}catch{}
await copyFile(template,target);
console.log(`Art-Direction-Kalibrierung angelegt: ${target}`);
console.log('Nächster Schritt: nur Hook + Mechanism + Payoff bauen, rendern, menschlich prüfen. Vollproduktion bleibt gesperrt bis APPROVED.');
