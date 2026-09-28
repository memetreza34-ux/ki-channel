import React from 'react';
import {ArtDirectionPreviewRoot} from './art-direction/ArtDirectionPreviewRoot';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {ProductionRoot} from './ProductionRoot';

export const RemotionRoot: React.FC = () => (
  <>
    <ProductionRoot />
    <ArtDirectionPreviewRoot />
    <MotionPreviewRoot />
  </>
);
