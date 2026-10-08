import React,{useMemo} from 'react';
import {AbsoluteFill,Html5Audio,Sequence,useCurrentFrame} from 'remotion';
import {AI_APP_WORKFLOW_CHAPTERS,type LongformChapter} from './contract';
import {BranchVisual,BuildVisual,FinishVisual,FlowVisual,HookVisual,RepoVisual,ScopeVisual,TestVisual} from './CreativeVisualsV2';
import {easedProgress} from '../../motion/easing';
import {SignalThread} from '../SignalThread';
import {YOUTUBE_VISUAL_LANGUAGE} from '../visualLanguage';

const visuals:Record<LongformChapter['id'],React.FC>={
  hook:HookVisual,
  scope:ScopeVisual,
  flow:FlowVisual,
  repo:RepoVisual,
  build:BuildVisual,
  test:TestVisual,
  branch:BranchVisual,
  finish:FinishVisual,
};

const signalThreadChapters = new Set<LongformChapter['id']>(['hook','flow','repo','branch','finish']);

const Chapter:React.FC<{chapter:LongformChapter;index:number}>=({chapter,index})=>{
  const frame=useCurrentFrame();
  const enter=easedProgress(frame,0,18);
  const Visual=visuals[chapter.id];

  return <AbsoluteFill>
    <div
      style={{
        position:'absolute',
        left:88,
        top:54,
        zIndex:50,
        display:'flex',
        gap:20,
        alignItems:'center',
        opacity:enter,
      }}
    >
      <div
        style={{
          fontFamily:YOUTUBE_VISUAL_LANGUAGE.typography.body,
          fontWeight:750,
          fontSize:18,
          letterSpacing:2.2,
          color:YOUTUBE_VISUAL_LANGUAGE.colors.purple,
        }}
      >
        {String(index+1).padStart(2,'0')}
      </div>
      <div
        style={{
          width:42,
          height:2,
          borderRadius:999,
          background:YOUTUBE_VISUAL_LANGUAGE.colors.purpleLight,
          opacity:.72,
        }}
      />
      <div
        style={{
          fontFamily:YOUTUBE_VISUAL_LANGUAGE.typography.display,
          fontWeight:800,
          fontSize:36,
          letterSpacing:-1.1,
          color:YOUTUBE_VISUAL_LANGUAGE.colors.ink,
        }}
      >
        {chapter.title}
      </div>
    </div>
    <SignalThread
      fromX={88}
      toX={650}
      y={112}
      startFrame={3}
      endFrame={24}
      opacity={.38}
      thickness={3}
      active={signalThreadChapters.has(chapter.id)}
    />
    <Visual/>
  </AbsoluteFill>;
};

export type LongformAIAppWorkflowProps={voiceoverSrc?:string};

export const LongformAIAppWorkflow:React.FC<LongformAIAppWorkflowProps>=({voiceoverSrc})=>{
  const chapters=useMemo(()=>AI_APP_WORKFLOW_CHAPTERS,[]);
  const surface=YOUTUBE_VISUAL_LANGUAGE.colors.surface;
  const background='radial-gradient(circle at 72% 18%, rgba(185,140,255,.10) 0%, rgba(185,140,255,0) 34%), radial-gradient(circle at 18% 82%, rgba(61,139,255,.055) 0%, rgba(61,139,255,0) 31%), '+surface;

  return <AbsoluteFill
    style={{
      background,
      color:YOUTUBE_VISUAL_LANGUAGE.colors.ink,
      fontFamily:YOUTUBE_VISUAL_LANGUAGE.typography.body,
      overflow:'hidden',
    }}
  >
    {chapters.map((chapter,index)=>
      <Sequence
        key={chapter.id}
        from={chapter.startFrame}
        durationInFrames={chapter.endFrame-chapter.startFrame}
      >
        <Chapter chapter={chapter} index={index}/>
      </Sequence>
    )}
    {voiceoverSrc?<Html5Audio src={voiceoverSrc}/>:null}
  </AbsoluteFill>;
};
