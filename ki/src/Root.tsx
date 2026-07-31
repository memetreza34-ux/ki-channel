import React from 'react';
import { Composition } from 'remotion';
import { Demo } from './_archive/Demo';
import { KitTest } from './_archive/KitTest';
import { CaptionsTest } from './_archive/CaptionsTest';
import { ExtrasTest } from './_archive/ExtrasTest';
import { Extras2Test } from './_archive/Extras2Test';
import { ShaderTest } from './_archive/ShaderTest';
import { CameraTest } from './_archive/CameraTest';
import { ChatTest } from './_archive/ChatTest';
import { P2Test } from './_archive/P2Test';
import { ThreeDemo } from '@studio/core/three';
import { TemplateGallery, TEMPLATE_GALLERY_FRAMES } from './_archive/TemplateGallery';
import { TemplateGallery2A, TEMPLATE_GALLERY2A_FRAMES } from './_archive/TemplateGallery2A';
import { TemplateGallery2B, TEMPLATE_GALLERY2B_FRAMES } from './_archive/TemplateGallery2B';
import { TemplateGallery2C, TEMPLATE_GALLERY2C_FRAMES } from './_archive/TemplateGallery2C';
import { TemplateGallery2D, TEMPLATE_GALLERY2D_FRAMES } from './_archive/TemplateGallery2D';
import { PremiumMotionDemo, PREMIUM_MOTION_DEMO_FRAMES } from './_archive/PremiumMotionDemo';
import { PremiumMotionDemo2, PREMIUM_MOTION_DEMO2_FRAMES } from './_archive/PremiumMotionDemo2';
import { PremiumMotionDemo3, PREMIUM_MOTION_DEMO3_FRAMES } from './_archive/PremiumMotionDemo3';
import { AiToolsTest, AI_TOOLS_TEST_FRAMES } from './_archive/AiToolsTest';
import { StyleExperimentTest, STYLE_EXPERIMENT_FRAMES } from './_archive/StyleExperimentTest';
import { Reel30sTest, REEL_30S_FRAMES } from './_archive/Reel30sTest';
import { AiToolRankingDemo, AI_TOOL_RANKING_DEMO_FRAMES } from './_archive/AiToolRankingDemo';
import { ReelHalluzinationTest, REEL_HALLUZINATION_FRAMES } from './_archive/ReelHalluzinationTest';
import { ReelMemoryTest, REEL_MEMORY_FRAMES } from './_archive/ReelMemoryTest';
import { StyleExperimentLight, STYLE_LIGHT_FRAMES } from './_archive/StyleExperimentLight';
import { BRAND } from '../brand/brand';
import { AnimationShowcase3KI, ANIMATION_SHOWCASE3KI_FRAMES } from './_archive/AnimationShowcase3';
import { AnimationShowcaseNewKI, ANIMATION_SHOWCASE_NEW_KI_FRAMES } from './_archive/AnimationShowcaseNew';
import { AnimationShowcaseFillerKI, ANIMATION_SHOWCASE_FILLER_KI_FRAMES } from './_archive/AnimationShowcaseFiller';
import { KimiK3, KIMI_K3_FRAMES } from './reels/2026-07-27-kimi-k3/KimiK3';
import { OpenAIHack, OPENAI_HACK_FRAMES } from './reels/2026-07-27-openai-hack/OpenAIHack';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AnimationShowcase3KI" component={AnimationShowcase3KI} durationInFrames={ANIMATION_SHOWCASE3KI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AnimationShowcaseNewKI" component={AnimationShowcaseNewKI} durationInFrames={ANIMATION_SHOWCASE_NEW_KI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AnimationShowcaseFillerKI" component={AnimationShowcaseFillerKI} durationInFrames={ANIMATION_SHOWCASE_FILLER_KI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Demo" component={Demo} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="KitTest" component={KitTest} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="CaptionsTest" component={CaptionsTest} durationInFrames={100} fps={30} width={1080} height={1920} />
    <Composition id="ExtrasTest" component={ExtrasTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="Extras2Test" component={Extras2Test} durationInFrames={380} fps={30} width={1920} height={1080} />
    <Composition id="TestShader" component={ShaderTest} durationInFrames={120} fps={30} width={1080} height={1920} />
    <Composition id="TestCamera" component={CameraTest} durationInFrames={60} fps={30} width={1080} height={1920} />
    <Composition id="TestChat" component={ChatTest} durationInFrames={140} fps={30} width={1080} height={1920} />
    <Composition id="TestP2" component={P2Test} durationInFrames={160} fps={30} width={1080} height={1920} />
    <Composition id="AiToolsTest" component={AiToolsTest} durationInFrames={AI_TOOLS_TEST_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="StyleExperiment" component={StyleExperimentTest} durationInFrames={STYLE_EXPERIMENT_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Reel30sTest" component={Reel30sTest} durationInFrames={REEL_30S_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AiToolRankingDemo" component={AiToolRankingDemo} durationInFrames={AI_TOOL_RANKING_DEMO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ReelHalluzinationTest" component={ReelHalluzinationTest} durationInFrames={REEL_HALLUZINATION_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ReelMemoryTest" component={ReelMemoryTest} durationInFrames={REEL_MEMORY_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="StyleExperimentLight" component={StyleExperimentLight} durationInFrames={STYLE_LIGHT_FRAMES} fps={30} width={1080} height={1920} />
    <Composition
      id="TemplateGallery"
      component={TemplateGallery}
      durationInFrames={TEMPLATE_GALLERY_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition id="TemplateGallery2A" component={TemplateGallery2A} durationInFrames={TEMPLATE_GALLERY2A_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="TemplateGallery2B" component={TemplateGallery2B} durationInFrames={TEMPLATE_GALLERY2B_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="TemplateGallery2C" component={TemplateGallery2C} durationInFrames={TEMPLATE_GALLERY2C_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="TemplateGallery2D" component={TemplateGallery2D} durationInFrames={TEMPLATE_GALLERY2D_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="PremiumMotionDemo" component={PremiumMotionDemo} durationInFrames={PREMIUM_MOTION_DEMO_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="PremiumMotionDemo2" component={PremiumMotionDemo2} durationInFrames={PREMIUM_MOTION_DEMO2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="PremiumMotionDemo3" component={PremiumMotionDemo3} durationInFrames={PREMIUM_MOTION_DEMO3_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="KimiK3" component={KimiK3} durationInFrames={KIMI_K3_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="OpenAIHack" component={OpenAIHack} durationInFrames={OPENAI_HACK_FRAMES} fps={30} width={1080} height={1920} />
    <Composition
      id="Three3D"
      component={ThreeDemo as React.FC}
      defaultProps={{ color: BRAND.accent }}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
