import React from 'react';
import {Composition,Folder} from 'remotion';
import {PHYSICAL_AI_WORLD_LAB_DURATION,PHYSICAL_AI_WORLD_LAB_FPS,PHYSICAL_AI_WORLD_LAB_ID,PhysicalAIWorldLab} from './PhysicalAIWorldLab';

export const ArtDirectionPreviewRoot:React.FC=()=> <Folder name="Art-Direction-Lab">
  <Composition id={PHYSICAL_AI_WORLD_LAB_ID} component={PhysicalAIWorldLab} durationInFrames={PHYSICAL_AI_WORLD_LAB_DURATION} fps={PHYSICAL_AI_WORLD_LAB_FPS} width={1080} height={1920}/>
</Folder>;
