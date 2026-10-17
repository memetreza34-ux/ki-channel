import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {INTELLIGENT_UI_CHAPTERS, INTELLIGENT_UI_DURATION_IN_FRAMES, type IntelligentUIChapter} from './contract';
import {
  HookVisual, FormatVisual, ArchitectureVisual, SavingsVisual,
  LearningVisual, LimitsVisual, AvailabilityVisual, PayoffVisual,
} from './IntelligentUIVisuals';

const chapterViews: Record<IntelligentUIChapter['id'], React.FC> = {
  hook: HookVisual, format: FormatVisual, architecture: ArchitectureVisual, savings: SavingsVisual,
  learning: LearningVisual, limits: LimitsVisual, availability: AvailabilityVisual, payoff: PayoffVisual,
};

export type LongformIntelligentUIProps = {voiceoverSrc?: string};

export const LongformIntelligentUI: React.FC<LongformIntelligentUIProps> = ({voiceoverSrc}) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min(100, (frame/INTELLIGENT_UI_DURATION_IN_FRAMES)*100));
  return <AbsoluteFill style={{fontFamily:BRAND.font,background:'#FBF9FD',color:BRAND.ink,overflow:'hidden'}}>
    {INTELLIGENT_UI_CHAPTERS.map(chapter=>{
      const Visual = chapterViews[chapter.id];
      return <Sequence
        key={chapter.id}
        name={'Longform – '+chapter.title}
        from={chapter.startFrame}
        durationInFrames={chapter.endFrame-chapter.startFrame}
      ><Visual/></Sequence>;
    })}
    <div style={{position:'absolute',left:86,right:86,bottom:12,height:5,borderRadius:6,background:'rgba(110,69,201,.12)',zIndex:99}}>
      <div style={{width:progress+'%',background:BRAND.accentDk,height:'100%',borderRadius:6}}/>
    </div>
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc}/> : null}
  </AbsoluteFill>;
};
