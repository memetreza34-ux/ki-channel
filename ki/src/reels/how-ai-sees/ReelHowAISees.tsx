import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from 'remotion';
import {
  HOW_AI_SEES_DURATION_IN_FRAMES,
  HOW_AI_SEES_SCENES,
  HOW_AI_SEES_SUBTITLE_CUES,
} from './contract';
import {
  Scene1Pixels,
  Scene2Patches,
  Scene3Link,
  Scene4Error,
  Scene5Prompt,
} from './Visuals';

const activeWordIndex=(frame:number,cue:any,count:number)=>{if(count<=1)return 0;const p=interpolate(frame,[cue.startFrame,Math.max(cue.startFrame+1,cue.endFrame-1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return Math.min(count-1,Math.floor(p*count));};
const buildCaptionGroups=(words:string[],maxWords=6):number[][]=>{const groups:number[][]=[];let current:number[]=[];words.forEach((word,index)=>{current.push(index);const hard=/[.!?][”“\"')\]]?$/.test(word);const soft=/[,;:][”“\"')\]]?$/.test(word)&&current.length>=4;if(hard||soft||current.length>=maxWords){groups.push(current);current=[];}});if(current.length)groups.push(current);return groups;};

const Captions:React.FC=()=>{const frame=useCurrentFrame();const cue=HOW_AI_SEES_SUBTITLE_CUES.find(c=>frame>=c.startFrame&&frame<c.endFrame);if(!cue)return null;const words=cue.text.trim().split(/\s+/).filter(Boolean);const active=activeWordIndex(frame,cue,words.length);const groups=buildCaptionGroups(words,6);const visible=groups.find(g=>g.includes(active))??groups[0]??[];const fade=Math.min(interpolate(frame,[cue.startFrame,cue.startFrame+4],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),interpolate(frame,[cue.endFrame-4,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));return <div style={{position:'absolute',left:76,right:76,bottom:270,zIndex:200,display:'flex',justifyContent:'center',opacity:fade,pointerEvents:'none'}}><div style={{width:'100%',maxWidth:860,textAlign:'center',fontFamily:'sans-serif',fontSize:52,fontWeight:850,lineHeight:1.14,letterSpacing:-.9,color:'white',textShadow:'0 2px 0 rgba(0,0,0,.98),0 0 15px rgba(0,0,0,.98),0 8px 30px rgba(0,0,0,.10)'}}>{visible.map((idx,i)=><React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${idx}`}><span style={{display:'inline-block',color:idx===active?'#00FF66':'white',transform:`scale(${idx===active?1.04:1})`,transformOrigin:'50% 70%'}}>{words[idx]}</span>{i<visible.length-1?' ':null}</React.Fragment>)}</div></div>};

export const ReelHowAISees: React.FC<{
  voiceoverSrc?: string;
  showCaptions?: boolean;
}> = ({ voiceoverSrc, showCaptions = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0B0E', color: 'white' }}>
      {voiceoverSrc && <Audio src={voiceoverSrc} />}

      <Sequence
        from={HOW_AI_SEES_SCENES[0].startFrame}
        durationInFrames={
          HOW_AI_SEES_SCENES[0].endFrame - HOW_AI_SEES_SCENES[0].startFrame
        }
      >
        <Scene1Pixels />
      </Sequence>

      <Sequence
        from={HOW_AI_SEES_SCENES[1].startFrame}
        durationInFrames={
          HOW_AI_SEES_SCENES[1].endFrame - HOW_AI_SEES_SCENES[1].startFrame
        }
      >
        <Scene2Patches />
      </Sequence>

      <Sequence
        from={HOW_AI_SEES_SCENES[2].startFrame}
        durationInFrames={
          HOW_AI_SEES_SCENES[2].endFrame - HOW_AI_SEES_SCENES[2].startFrame
        }
      >
        <Scene3Link />
      </Sequence>

      <Sequence
        from={HOW_AI_SEES_SCENES[3].startFrame}
        durationInFrames={
          HOW_AI_SEES_SCENES[3].endFrame - HOW_AI_SEES_SCENES[3].startFrame
        }
      >
        <Scene4Error />
      </Sequence>

      <Sequence
        from={HOW_AI_SEES_SCENES[4].startFrame}
        durationInFrames={
          HOW_AI_SEES_SCENES[4].endFrame - HOW_AI_SEES_SCENES[4].startFrame
        }
      >
        <Scene5Prompt />
      </Sequence>

      {showCaptions && <Captions />}
    </AbsoluteFill>
  );
};
