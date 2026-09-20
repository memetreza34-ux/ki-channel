import React from 'react';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {ProductionRoot} from './ProductionRoot';

export const RemotionRoot: React.FC = () => (
  <>
    <ProductionRoot />
    <MotionPreviewRoot />
  </>
);
