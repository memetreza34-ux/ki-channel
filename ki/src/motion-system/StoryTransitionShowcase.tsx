import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {bookFlip} from '@remotion/transitions/book-flip';
import {StoryFlowArrow} from '../reels/StoryShapes';

const Panel: React.FC<React.PropsWithChildren<{background:string}>> = ({background, children}) => (
  <AbsoluteFill style={{background, justifyContent:'center', alignItems:'center', fontFamily:'Inter, system-ui, sans-serif', fontSize:92, fontWeight:950, color:'#102033'}}>
    {children}
  </AbsoluteFill>
);

export const StoryTransitionShowcase: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={54}>
      <Panel background="#F4F8FC">HOOK</Panel>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({direction:'from-right'})} timing={linearTiming({durationInFrames:12})} />
    <TransitionSeries.Sequence durationInFrames={54}>
      <Panel background="#EEF6FF">
        <div style={{display:'grid',placeItems:'center',gap:28}}>
          <div>PROBLEM</div>
          <StoryFlowArrow accent="#2E90FA" startFrame={6} endFrame={34} length={260}/>
        </div>
      </Panel>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction:'from-left'})} timing={linearTiming({durationInFrames:12})} />
    <TransitionSeries.Sequence durationInFrames={54}>
      <Panel background="#F4F0FF">PROOF</Panel>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={bookFlip({})} timing={linearTiming({durationInFrames:14})} />
    <TransitionSeries.Sequence durationInFrames={58}>
      <Panel background="#ECFDF3">PAYOFF</Panel>
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
