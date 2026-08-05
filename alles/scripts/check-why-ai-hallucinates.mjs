import {readFile,stat,writeFile} from 'node:fs/promises';
import {extname} from 'node:path';
import {inspectMotionArtifactBuffer,describeMotionArtifactFailure} from './motion-artifact-validation.mjs';
import {HALLUCINATION_RENDER_CONFIG as config} from './why-ai-hallucinates-render-config.mjs';

const expected=[...config.checkpoints.map((frame)=>({kind:'still',frame,path:`${config.stillOutput}/frame-${String(frame).padStart(4,'0')}.png`})),{kind:'video',frame:null,path:config.videoOutput}];
const artifacts=[];
for(const item of expected){
  try{
    const metadata=await stat(item.path);
    const bytes=await readFile(item.path);
    const inspection=inspectMotionArtifactBuffer({extension:extname(item.path),sizeBytes:metadata.size,header:bytes.subarray(0,64)});
    artifacts.push({...item,sizeBytes:metadata.size,...inspection,failure:inspection.valid?null:describeMotionArtifactFailure(inspection)});
  }catch(error){artifacts.push({...item,sizeBytes:0,valid:false,failure:error instanceof Error?error.message:String(error)});}
}
const passedArtifacts=artifacts.filter((item)=>item.valid).length;
const report={version:1,expectedArtifacts:expected.length,passedArtifacts,failedArtifacts:expected.length-passedArtifacts,passed:passedArtifacts===expected.length,artifacts};
await writeFile(config.reportOutput,`${JSON.stringify(report,null,2)}\n`,'utf8');
if(!report.passed){console.error(`Freigabe fehlgeschlagen: ${passedArtifacts}/${expected.length} Artefakte gültig.`);process.exit(1);}
console.log(`Technische Freigabe bestanden: ${passedArtifacts}/${expected.length} Artefakte gültig.`);
