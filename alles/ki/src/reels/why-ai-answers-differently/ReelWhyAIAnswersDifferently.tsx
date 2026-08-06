import React from 'react';
import {AbsoluteFill,Audio,Sequence} from 'remotion';
import {DualSentenceKaraokeCaption} from '../../components/DualSentenceKaraokeCaption';
import {differentAnswersAsset} from './assets';
import {ANSWER_SCENE_COMPONENTS} from './scenes';
import {ANSWER_CAPTION_PAIRS,ANSWER_SCENES,ANSWER_SYNC_STATUS,type AnswerSceneId} from './sync';
import {answerFont,answerPalette} from './style';
export type ReelWhyAIAnswersDifferentlyProps={voiceoverSrc?:string;muteVoiceover?:boolean};
export const ReelWhyAIAnswersDifferently:React.FC<ReelWhyAIAnswersDifferentlyProps>=({voiceoverSrc,muteVoiceover=false})=>{const play=!muteVoiceover&&ANSWER_SYNC_STATUS==='final-transcript-aligned';return <AbsoluteFill style={{background:answerPalette.background}}>{ANSWER_SCENES.map((scene)=>{const Component=ANSWER_SCENE_COMPONENTS[scene.id as AnswerSceneId];return <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={scene.id}><Component/></Sequence>;})}<DualSentenceKaraokeCaption cues={ANSWER_CAPTION_PAIRS} accentColor={answerPalette.accentBright} fontFamily={answerFont} fontSizePx={44}/>{play?<Audio src={voiceoverSrc??differentAnswersAsset('voiceover')} playbackRate={1} volume={1}/>:null}</AbsoluteFill>;};
