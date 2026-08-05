import {copyFile, mkdir, stat, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';

const reelRoot = resolve('..','reels','2026-08-03_bis_2026-08-09','mittwoch','reel-01_warum-ki-halluziniert');
const publicRoot = resolve('public','reels','why-ai-hallucinates');
const files = [
  ['03-szenen/BILDER-HIER-EINFUEGEN/scene-01-confident-answer.png','images/scene-01-confident-answer.png'],
  ['03-szenen/BILDER-HIER-EINFUEGEN/scene-03-pattern-gap-machine.png','images/scene-03-pattern-gap-machine.png'],
  ['03-szenen/BILDER-HIER-EINFUEGEN/scene-04-risk-documents.png','images/scene-04-risk-documents.png'],
  ['03-szenen/BILDER-HIER-EINFUEGEN/scene-08-verification-desk.png','images/scene-08-verification-desk.png'],
  ['02-audio/voiceover.wav','audio/voiceover.wav'],
];

const report = {version:1,stagedAt:new Date().toISOString(),passed:true,files:[]};
for (const [sourceRelative,destinationRelative] of files) {
  const source=resolve(reelRoot,sourceRelative);
  const destination=resolve(publicRoot,destinationRelative);
  try {
    const metadata=await stat(source);
    if (!metadata.isFile() || metadata.size===0) throw new Error('Datei ist leer oder kein reguläres Asset');
    await mkdir(dirname(destination),{recursive:true});
    await copyFile(source,destination);
    report.files.push({source,destination,sizeBytes:metadata.size,passed:true});
  } catch (error) {
    report.passed=false;
    report.files.push({source,destination,sizeBytes:0,passed:false,error:error instanceof Error?error.message:String(error)});
  }
}

const reportPath=resolve(reelRoot,'timeline','asset-stage-report.json');
await writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');
if (!report.passed) {
  for (const file of report.files.filter((item)=>!item.passed)) console.error(`FEHLT: ${file.source} – ${file.error}`);
  process.exit(1);
}
console.log(`Alle ${report.files.length} Pflichtassets wurden nach ${publicRoot} kopiert.`);
