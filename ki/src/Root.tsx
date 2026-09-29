import React from 'react';
import {MotionEnginePreviewRoot} from './motion-engine/MotionEnginePreviewRoot';
import {MotionPreviewRoot} from './motion-system/MotionPreviewRoot';
import {ProductionRoot} from './ProductionRoot';

export const RemotionRoot: React.FC = () => (
  <>
    <ProductionRoot />
    <MotionEnginePreviewRoot />
    <MotionPreviewRoot />
  </>
);
