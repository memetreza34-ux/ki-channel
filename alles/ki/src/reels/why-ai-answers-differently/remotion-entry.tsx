import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CoverWhyAIAnswersDifferently} from './CoverWhyAIAnswersDifferently';
import {ReelWhyAIAnswersDifferently} from './ReelWhyAIAnswersDifferently';
import {ANSWER_COMPOSITION_ID,ANSWER_COVER_ID,ANSWER_DURATION,ANSWER_FPS,ANSWER_HEIGHT,ANSWER_WIDTH} from './sync';
const Root:React.FC=()=> <><Composition id={ANSWER_COMPOSITION_ID} component={ReelWhyAIAnswersDifferently} defaultProps={{muteVoiceover:false}} durationInFrames={ANSWER_DURATION} fps={ANSWER_FPS} width={ANSWER_WIDTH} height={ANSWER_HEIGHT}/><Composition id={ANSWER_COVER_ID} component={CoverWhyAIAnswersDifferently} durationInFrames={1} fps={ANSWER_FPS} width={ANSWER_WIDTH} height={ANSWER_HEIGHT}/></>;
registerRoot(Root);
