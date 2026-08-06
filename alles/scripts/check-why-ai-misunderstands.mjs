import {readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {getMisunderstandsRenderConfig} from './why-ai-misunderstands-render-config.mjs';

const config=getMisunderstandsRenderConfig(process.argv[2]);
const errors=[];
const imageResults=[];

const validateImage=async(file,label)=>{
  try{
    const stats=statSync(file);
    const metadata=await sharp(file).metadata();
    if(metadata.width!==config.width||metadata.height!==config.height)errors.push(`${label}: ${metadata.width}x${metadata.height} statt ${config.width}x${config.height}`);
    if(stats.size<1024)errors.push(`${label}: Datei ist zu klein (${stats.size} Bytes)`);
    imageResults.push({label,file,width:metadata.width,height:metadata.height,size:stats.size});
  }catch(error){errors.push(`${label}: ${error instanceof Error?error.message:String(error)}`);}
};

for(const frame of config.checkpoints){await validateImage(resolve(config.stillOutput,`frame-${String(frame).padStart(4,'0')}.png`),`Frame ${frame}`);}
await validateImage(config.coverOutput,'Cover');

const selected=[129,353,564,759,973,1208,1448,1659,1873];
try{
  const composites=[];
  for(const [index,frame] of selected.entries()){
    const source=resolve(config.stillOutput,`frame-${String(frame).padStart(4,'0')}.png`);
    const buffer=await sharp(source).resize(360,640,{fit:'cover'}).png().toBuffer();
    composites.push({input:buffer,left:(index%3)*360,top:Math.floor(index/3)*640});
  }
  await sharp({create:{width:1080,height:1920,channels:4,background:'#F7F5FA'}}).composite(composites).png().toFile(config.contactSheetOutput);
}catch(error){errors.push(`Kontaktbogen: ${error instanceof Error?error.message:String(error)}`);}

let videoResult=null;
try{
  const stats=statSync(config.videoOutput);
  const prefix=readFileSync(config.videoOutput).subarray(0,64).toString('latin1');
  if(!prefix.includes('ftyp'))errors.push('MP4: ftyp-Header fehlt');
  if(stats.size<4096)errors.push(`MP4: Datei ist zu klein (${stats.size} Bytes)`);
  videoResult={file:config.videoOutput,size:stats.size,hasFtyp:prefix.includes('ftyp')};
}catch(error){errors.push(`MP4: ${error instanceof Error?error.message:String(error)}`);}

const report={version:1,checkedAt:new Date().toISOString(),compositionId:config.compositionId,expectedCheckpoints:config.checkpoints.length,images:imageResults,video:videoResult,contactSheet:config.contactSheetOutput,errors,passed:errors.length===0,visualApproval:false,userApproval:false};
writeFileSync(config.reportOutput,`${JSON.stringify(report,null,2)}\n`,'utf8');
if(errors.length>0){for(const error of errors)console.error(`FEHLER: ${error}`);process.exit(1);}
console.log(`✓ Technische Artefaktprüfung bestanden: ${imageResults.length} Bilder und 1 MP4`);
console.log('Hinweis: Technische Prüfung ersetzt keine visuelle Freigabe.');
