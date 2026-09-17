import React,{useMemo} from 'react';
import {AbsoluteFill,Html5Audio,Sequence,useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {ChapterHeader} from './ChapterHeader';
import {HookScene} from './HookScene';
import {CHAPTER_WORDS} from './chapterWords';
import {WordScene} from './WordScene';
import {AGENT_LOOP_CHAPTERS,type AgentLoopChapter,type AgentLoopChapterId} from './contract';
import {AnatomyVisual,CompareVisual,ExampleVisual,FitVisual,GuardrailsVisual,HookVisual,LoopVisual,RisksVisual,ToolsVisual} from './Visuals';

const visualByChapter:Record<AgentLoopChapterId,React.FC<{beats:number[]}>>={hook:HookScene as unknown as React.FC<{beats:number[]}>,compare:CompareVisual,anatomy:AnatomyVisual,loop:LoopVisual,example:ExampleVisual,tools:ToolsVisual,risks:RisksVisual,guardrails:GuardrailsVisual,fit:FitVisual};

// Der Kapitelkopf belegt die oberen ~170px dauerhaft. Die Szene darunter wird
// entsprechend eingerueckt und leicht verkleinert, damit nichts kollidiert.
const CHAPTER_HEADER_SPACE=172;
const ChapterLayer:React.FC<{chapter:AgentLoopChapter;index:number}>=({chapter,index})=>{const words=CHAPTER_WORDS[chapter.id];const Visual=visualByChapter[chapter.id];return <AbsoluteFill><ChapterHeader id={chapter.id} index={index} title={chapter.title}/><div style={{position:'absolute',inset:0,transformOrigin:'center top',transform:`translateY(${CHAPTER_HEADER_SPACE*0.62}px) scale(0.94)`}}>{words?<WordScene items={words}/>:<Visual beats={chapter.beatFrames}/>}</div></AbsoluteFill>};

export type LongformAgentLoopProps={voiceoverSrc?:string};
export const LongformAgentLoop:React.FC<LongformAgentLoopProps>=({voiceoverSrc})=>{const chapters=useMemo(()=>AGENT_LOOP_CHAPTERS,[]);const frame=useCurrentFrame();const total=chapters.at(-1)?.endFrame??1;const progress=Math.min(1,frame/total);return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 38%,#FFFFFF 0%,#FAF8FC 62%,#F1EDF6 100%)',color:BRAND.ink,fontFamily:BRAND.font.body,overflow:'hidden'}}><div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(110,69,201,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.018) 1px,transparent 1px)',backgroundSize:'80px 80px'}}/>{chapters.map((chapter,index)=><Sequence key={chapter.id} from={chapter.startFrame} durationInFrames={chapter.endFrame-chapter.startFrame} name={`${chapter.id}-${chapter.beatFrames.length}-beats`}><ChapterLayer chapter={chapter} index={index}/></Sequence>)}<div style={{position:'absolute',left:70,right:70,bottom:34,height:6,borderRadius:9,background:'rgba(26,26,46,.08)',zIndex:100}}><div style={{height:'100%',width:`${progress*100}%`,borderRadius:9,background:BRAND.accentDk}}/></div>{voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}</AbsoluteFill>};
