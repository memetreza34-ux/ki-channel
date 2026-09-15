export const REMOTION_SHOWCASE_ID='RemotionShowcase20260912';
export const REMOTION_SHOWCASE_FPS=30;
export const REMOTION_SHOWCASE_WIDTH=1920;
export const REMOTION_SHOWCASE_HEIGHT=1080;
export const REMOTION_SHOWCASE_DURATION_IN_FRAMES=40*REMOTION_SHOWCASE_FPS;

export const SHOWCASE_SCENES=[
  {id:'hook',from:0,duration:4*30},
  {id:'studio',from:4*30,duration:6*30},
  {id:'media',from:10*30,duration:6*30},
  {id:'data',from:16*30,duration:6*30},
  {id:'three',from:22*30,duration:6*30},
  {id:'skia',from:28*30,duration:6*30},
  {id:'finale',from:34*30,duration:6*30},
] as const;
