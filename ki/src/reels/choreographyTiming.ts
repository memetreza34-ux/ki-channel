export type ChoreographyWord = {text:string; startFrame:number; endFrame:number};
export type ChoreographyCue = {sceneId:string; sentenceId:string; startFrame:number; endFrame:number; text:string; words?:readonly ChoreographyWord[]};
export type ChoreographyScene = {sceneId:string; startFrame:number; endFrame:number};

type SpeechAnchor =
  | {type:'SENTENCE_START'}
  | {type:'SENTENCE_END'}
  | {type:'PHRASE_START'; phrase:string}
  | {type:'PHRASE_END'; phrase:string};

type VisualRef =
  | {ref:'speechStart'|'speechEnd'|'sceneStart'|'sceneEnd'; offsetFrames?:number}
  | {ref:'beatStart'|'beatEnd'; beatId:string; offsetFrames?:number};

type SfxRef = VisualRef | {ref:'visualStart'; offsetFrames?:number};

export type ChoreographyBeat = {
  id:string;
  sceneId:string;
  sentenceId:string;
  speech:{start:SpeechAnchor; end:SpeechAnchor};
  visual:{target:string; start:VisualRef; end:VisualRef; enterFrames?:number; exitFrames?:number};
  sfx?:{id:string; at:SfxRef};
};

export type ChoreographyPlan = {
  rules?:{defaultEnterFrames?:number; defaultExitFrames?:number; minimumHoldFrames?:number};
  beats:readonly ChoreographyBeat[];
};

export type ResolvedChoreographyBeat = {
  id:string;
  sceneId:string;
  sentenceId:string;
  target:string;
  speechStartFrame:number;
  speechEndFrame:number;
  visualStartFrame:number;
  enterEndFrame:number;
  exitStartFrame:number;
  visualEndFrame:number;
  enterFrames:number;
  exitFrames:number;
  sfxFrame?:number;
};

const normalize=(value:string)=>String(value??'').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}]+/gu,'').trim();
const tokens=(value:string)=>String(value??'').split(/\s+/).map(normalize).filter(Boolean);
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,Math.round(value)));

export const createChoreographyTiming=(cues:readonly ChoreographyCue[],scenes:readonly ChoreographyScene[],plan:ChoreographyPlan)=>{
  const sceneById=new Map(scenes.map((scene)=>[scene.sceneId,scene]));
  const beatById=new Map<string,ChoreographyBeat>();
  for(const beat of plan.beats??[]){
    if(!beat?.id) throw new Error('CHOREOGRAPHY-PLAN beat without id');
    if(beatById.has(beat.id)) throw new Error(`Duplicate choreography beat id: ${beat.id}`);
    beatById.set(beat.id,beat);
  }

  const sentenceCues=(sceneId:string,sentenceId:string)=>cues.filter((cue)=>cue.sceneId===sceneId&&cue.sentenceId===sentenceId).sort((a,b)=>a.startFrame-b.startFrame);
  const sentenceWords=(sceneId:string,sentenceId:string)=>sentenceCues(sceneId,sentenceId).flatMap((cue)=>cue.words??[]).filter((word)=>Number.isFinite(word.startFrame)&&Number.isFinite(word.endFrame)).sort((a,b)=>a.startFrame-b.startFrame);
  const phraseMatch=(words:readonly ChoreographyWord[],phrase:string)=>{
    const wanted=tokens(phrase); const normalized=words.map((word)=>normalize(word.text));
    for(let index=0;index<=normalized.length-wanted.length;index++){
      let ok=true;
      for(let offset=0;offset<wanted.length;offset++) if(normalized[index+offset]!==wanted[offset]){ok=false;break;}
      if(ok) return {first:words[index],last:words[index+wanted.length-1]};
    }
    return null;
  };

  const previewAnchor=(beat:ChoreographyBeat,anchor:SpeechAnchor)=>{
    const matches=sentenceCues(beat.sceneId,beat.sentenceId);
    if(!matches.length) throw new Error(`${beat.id}: no caption cues for ${beat.sceneId}/${beat.sentenceId}`);
    const start=Math.min(...matches.map((cue)=>cue.startFrame));
    const end=Math.max(...matches.map((cue)=>cue.endFrame));
    if(anchor.type==='SENTENCE_START') return start;
    if(anchor.type==='SENTENCE_END') return end;
    const all=tokens(matches.map((cue)=>cue.text).join(' ')); const wanted=tokens(anchor.phrase);
    let found=-1;
    for(let index=0;index<=all.length-wanted.length;index++){
      let ok=true;
      for(let offset=0;offset<wanted.length;offset++) if(all[index+offset]!==wanted[offset]){ok=false;break;}
      if(ok){found=index;break;}
    }
    if(found<0) throw new Error(`${beat.id}: preview phrase not found: ${anchor.phrase}`);
    const edgeIndex=anchor.type==='PHRASE_START'?found:found+wanted.length;
    return Math.round(start+(end-start)*(edgeIndex/Math.max(1,all.length)));
  };

  const resolveSpeechAnchor=(beat:ChoreographyBeat,anchor:SpeechAnchor)=>{
    const words=sentenceWords(beat.sceneId,beat.sentenceId);
    if(!words.length) return previewAnchor(beat,anchor);
    if(anchor.type==='SENTENCE_START') return words[0].startFrame;
    if(anchor.type==='SENTENCE_END') return words[words.length-1].endFrame;
    const match=phraseMatch(words,anchor.phrase);
    if(!match) throw new Error(`${beat.id}: exact aligned phrase missing: ${anchor.phrase}`);
    return anchor.type==='PHRASE_START'?match.first.startFrame:match.last.endFrame;
  };

  const speechById=new Map<string,{start:number;end:number}>();
  for(const beat of plan.beats??[]){
    const scene=sceneById.get(beat.sceneId); if(!scene) throw new Error(`${beat.id}: unknown scene ${beat.sceneId}`);
    const start=resolveSpeechAnchor(beat,beat.speech.start); const end=resolveSpeechAnchor(beat,beat.speech.end);
    if(end<start) throw new Error(`${beat.id}: speech end before start`);
    if(start<scene.startFrame||end>scene.endFrame) throw new Error(`${beat.id}: speech window outside scene`);
    speechById.set(beat.id,{start,end});
  }

  const visualStartById=new Map<string,number>();
  const resolveRef=(beat:ChoreographyBeat,ref:VisualRef,phase:'start'|'end')=>{
    const scene=sceneById.get(beat.sceneId)!; const own=speechById.get(beat.id)!; const offset=Number(ref.offsetFrames||0);
    if(ref.ref==='speechStart') return own.start+offset;
    if(ref.ref==='speechEnd') return own.end+offset;
    if(ref.ref==='sceneStart') return scene.startFrame+offset;
    if(ref.ref==='sceneEnd') return scene.endFrame+offset;
    if(ref.ref==='beatStart'){
      const other=visualStartById.get(ref.beatId);
      if(other===undefined) throw new Error(`${beat.id}: ${phase} beatStart ${ref.beatId} unresolved`);
      return other+offset;
    }
    const other=speechById.get(ref.beatId);
    if(!other) throw new Error(`${beat.id}: ${phase} beatEnd ${ref.beatId} unknown`);
    return other.end+offset;
  };

  for(const beat of plan.beats??[]){
    const scene=sceneById.get(beat.sceneId)!;
    const value=resolveRef(beat,beat.visual.start,'start');
    visualStartById.set(beat.id,clamp(value,scene.startFrame,scene.endFrame-1));
  }

  const defaultEnter=Math.max(1,Number(plan.rules?.defaultEnterFrames??8));
  const defaultExit=Math.max(1,Number(plan.rules?.defaultExitFrames??6));
  const minimumHold=Math.max(0,Number(plan.rules?.minimumHoldFrames??3));
  const resolved=new Map<string,ResolvedChoreographyBeat>();

  for(const beat of plan.beats??[]){
    const scene=sceneById.get(beat.sceneId)!; const speech=speechById.get(beat.id)!; const start=visualStartById.get(beat.id)!;
    const rawEnd=resolveRef(beat,beat.visual.end,'end'); const end=clamp(rawEnd,start+1,scene.endFrame);
    const enter=Math.max(1,Number(beat.visual.enterFrames??defaultEnter)); const exit=Math.max(1,Number(beat.visual.exitFrames??defaultExit));
    const available=end-start;
    if(available<enter+exit+minimumHold) throw new Error(`${beat.id}: visual window ${available}f too short for ${enter}f ENTER + ${minimumHold}f HOLD + ${exit}f EXIT`);
    const enterEnd=start+enter; const exitStart=end-exit;
    if(exitStart<enterEnd) throw new Error(`${beat.id}: enter/exit phases overlap`);

    let sfxFrame:number|undefined;
    if(beat.sfx){
      const ref=beat.sfx.at; const offset=Number(ref.offsetFrames||0);
      if(ref.ref==='visualStart') sfxFrame=start+offset;
      else if(ref.ref==='speechStart') sfxFrame=speech.start+offset;
      else if(ref.ref==='speechEnd') sfxFrame=speech.end+offset;
      else if(ref.ref==='sceneStart') sfxFrame=scene.startFrame+offset;
      else if(ref.ref==='sceneEnd') sfxFrame=scene.endFrame+offset;
      else if(ref.ref==='beatStart') sfxFrame=(visualStartById.get(ref.beatId)??start)+offset;
      else sfxFrame=(speechById.get(ref.beatId)?.end??speech.end)+offset;
      sfxFrame=clamp(sfxFrame,scene.startFrame,scene.endFrame-1);
    }

    resolved.set(beat.id,{id:beat.id,sceneId:beat.sceneId,sentenceId:beat.sentenceId,target:beat.visual.target,speechStartFrame:speech.start,speechEndFrame:speech.end,visualStartFrame:start,enterEndFrame:enterEnd,exitStartFrame:exitStart,visualEndFrame:end,enterFrames:enter,exitFrames:exit,sfxFrame});
  }

  const global=(id:string)=>{const beat=resolved.get(id);if(!beat) throw new Error(`Unknown choreography beat: ${id}`);return beat;};
  const local=(sceneId:string,id:string)=>{
    const beat=global(id); if(beat.sceneId!==sceneId) throw new Error(`${id}: expected ${beat.sceneId}, got ${sceneId}`);
    const scene=sceneById.get(sceneId); if(!scene) throw new Error(`Unknown scene: ${sceneId}`);
    const shift=(frame:number)=>frame-scene.startFrame;
    return {...beat,speechStartFrame:shift(beat.speechStartFrame),speechEndFrame:shift(beat.speechEndFrame),visualStartFrame:shift(beat.visualStartFrame),enterEndFrame:shift(beat.enterEndFrame),exitStartFrame:shift(beat.exitStartFrame),visualEndFrame:shift(beat.visualEndFrame),sfxFrame:beat.sfxFrame===undefined?undefined:shift(beat.sfxFrame)};
  };
  return {global,local,all:()=>[...resolved.values()],has:(id:string)=>resolved.has(id)};
};
