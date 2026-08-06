import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CoverWhyAIMisunderstandsYou} from './CoverWhyAIMisunderstandsYou';
import {ReelWhyAIMisunderstandsYou} from './ReelWhyAIMisunderstandsYou';
import {MISUNDERSTANDS_COMPOSITION_ID, MISUNDERSTANDS_COVER_ID, MISUNDERSTANDS_DURATION, MISUNDERSTANDS_FPS, MISUNDERSTANDS_HEIGHT, MISUNDERSTANDS_WIDTH} from './contract';

const Root: React.FC = () => <><Composition id={MISUNDERSTANDS_COMPOSITION_ID} component={ReelWhyAIMisunderstandsYou} durationInFrames={MISUNDERSTANDS_DURATION} fps={MISUNDERSTANDS_FPS} width={MISUNDERSTANDS_WIDTH} height={MISUNDERSTANDS_HEIGHT}/><Composition id={MISUNDERSTANDS_COVER_ID} component={CoverWhyAIMisunderstandsYou} durationInFrames={1} fps={MISUNDERSTANDS_FPS} width={MISUNDERSTANDS_WIDTH} height={MISUNDERSTANDS_HEIGHT}/></>;

registerRoot(Root);
