// AUTO-GENERIERT — Sichtungs-Galerie roher Remotion-Templates (React Video Editor, MIT).
// Jede Komponente UNVERÄNDERT, nur nacheinander gereiht + Namens-Label. Kein Styling-Eingriff.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import T_AnimatedList from "../vendor-templates/rve/animated-list.tsx";
import T_AnimatedText from "../vendor-templates/rve/animated-text.tsx";
import T_AreaChart from "../vendor-templates/rve/area-chart.tsx";
import T_BlindsTransition from "../vendor-templates/rve/blinds-transition.tsx";
import T_BokehCircles from "../vendor-templates/rve/bokeh-circles.tsx";
import T_BounceText from "../vendor-templates/rve/bounce-text.tsx";
import T_BubblePopText from "../vendor-templates/rve/bubble-pop-text.tsx";
import T_CameraShake from "../vendor-templates/rve/camera-shake.tsx";
import T_CardFlip from "../vendor-templates/rve/card-flip.tsx";
import T_ChapterTitle from "../vendor-templates/rve/chapter-title.tsx";
import T_ChartAnimation from "../vendor-templates/rve/chart-animation.tsx";
import T_CinematicTitleIntro from "../vendor-templates/rve/cinematic-title-intro.tsx";
import T_CircularProgress from "../vendor-templates/rve/circular-progress.tsx";
import T_ClockWipe from "../vendor-templates/rve/clock-wipe.tsx";
import T_ComparisonChart from "../vendor-templates/rve/comparison-chart.tsx";
import T_CountdownIntro from "../vendor-templates/rve/countdown-intro.tsx";
import T_CountdownTimer from "../vendor-templates/rve/countdown-timer.tsx";
import T_CreditsRoll from "../vendor-templates/rve/credits-roll.tsx";
import T_CrossDissolve from "../vendor-templates/rve/cross-dissolve.tsx";
import T_DonutChart from "../vendor-templates/rve/donut-chart.tsx";
import T_EndCard from "../vendor-templates/rve/end-card.tsx";
import T_FadeThroughBlack from "../vendor-templates/rve/fade-through-black.tsx";
import T_FilmBurn from "../vendor-templates/rve/film-burn.tsx";
import T_FloatingBubbleText from "../vendor-templates/rve/floating-bubble-text.tsx";
import T_GalleryGrid from "../vendor-templates/rve/gallery-grid.tsx";
import T_GeometricPatterns from "../vendor-templates/rve/geometric-patterns.tsx";
import T_GlitchText from "../vendor-templates/rve/glitch-text.tsx";
import T_GradientShift from "../vendor-templates/rve/gradient-shift.tsx";
import T_GridPulse from "../vendor-templates/rve/grid-pulse.tsx";
import T_ImageCarousel from "../vendor-templates/rve/image-carousel.tsx";
import T_ImageComparisonSlider from "../vendor-templates/rve/image-comparison-slider.tsx";
import T_ImageZoomReveal from "../vendor-templates/rve/image-zoom-reveal.tsx";
import T_IrisTransition from "../vendor-templates/rve/iris-transition.tsx";
import T_KenBurns from "../vendor-templates/rve/ken-burns.tsx";
import T_LetterboxReveal from "../vendor-templates/rve/letterbox-reveal.tsx";
import T_LineChart from "../vendor-templates/rve/line-chart.tsx";
import T_LiquidWave from "../vendor-templates/rve/liquid-wave.tsx";
import T_LogoBlurReveal from "../vendor-templates/rve/logo-blur-reveal.tsx";
import T_LogoBounceDrop from "../vendor-templates/rve/logo-bounce-drop.tsx";
import T_LogoFadeReveal from "../vendor-templates/rve/logo-fade-reveal.tsx";
import T_LogoGlitchReveal from "../vendor-templates/rve/logo-glitch-reveal.tsx";
import T_LogoScaleRotate from "../vendor-templates/rve/logo-scale-rotate.tsx";
import T_LogoSpinReveal from "../vendor-templates/rve/logo-spin-reveal.tsx";
import T_LogoSplitReveal from "../vendor-templates/rve/logo-split-reveal.tsx";
import T_LogoStrokeDraw from "../vendor-templates/rve/logo-stroke-draw.tsx";
import T_LogoTypewriter from "../vendor-templates/rve/logo-typewriter.tsx";
import T_LowerThird from "../vendor-templates/rve/lower-third.tsx";
import T_MasonryGallery from "../vendor-templates/rve/masonry-gallery.tsx";
import T_MatrixRain from "../vendor-templates/rve/matrix-rain.tsx";
import T_MorphTransition from "../vendor-templates/rve/morph-transition.tsx";
import T_NoiseGrain from "../vendor-templates/rve/noise-grain.tsx";
import T_NotificationPop from "../vendor-templates/rve/notification-pop.tsx";
import T_ParticleExplosion from "../vendor-templates/rve/particle-explosion.tsx";
import T_PhotoStack from "../vendor-templates/rve/photo-stack.tsx";
import T_PictureInPicture from "../vendor-templates/rve/picture-in-picture.tsx";
import T_PieChart from "../vendor-templates/rve/pie-chart.tsx";
import T_PixelTransition from "../vendor-templates/rve/pixel-transition.tsx";
import T_PolaroidFrame from "../vendor-templates/rve/polaroid-frame.tsx";
import T_PoppingText from "../vendor-templates/rve/popping-text.tsx";
import T_ProgressBars from "../vendor-templates/rve/progress-bars.tsx";
import T_ProgressSteps from "../vendor-templates/rve/progress-steps.tsx";
import T_PulsingText from "../vendor-templates/rve/pulsing-text.tsx";
import T_PushTransition from "../vendor-templates/rve/push-transition.tsx";
import T_QuoteCard from "../vendor-templates/rve/quote-card.tsx";
import T_RotatingCarousel from "../vendor-templates/rve/rotating-carousel.tsx";
import T_SlideText from "../vendor-templates/rve/slide-text.tsx";
import T_SlideWipe from "../vendor-templates/rve/slide-wipe.tsx";
import T_SoundWave from "../vendor-templates/rve/sound-wave.tsx";
import T_SplitScreen from "../vendor-templates/rve/split-screen.tsx";
import T_SpotlightReveal from "../vendor-templates/rve/spotlight-reveal.tsx";
import T_Starfield from "../vendor-templates/rve/starfield.tsx";
import T_StatCounter from "../vendor-templates/rve/stat-counter.tsx";
import T_SubscribeReminder from "../vendor-templates/rve/subscribe-reminder.tsx";
import T_TextHighlight from "../vendor-templates/rve/text-highlight.tsx";
import T_TitleSplit from "../vendor-templates/rve/title-split.tsx";
import T_TypewriterSubtitle from "../vendor-templates/rve/typewriter-subtitle.tsx";
import T_VignettePulse from "../vendor-templates/rve/vignette-pulse.tsx";
import T_WhipPan from "../vendor-templates/rve/whip-pan.tsx";
import T_ZoomThrough from "../vendor-templates/rve/zoom-through.tsx";

const PER = 75; // Frames pro Template (2.5s @30fps)

const entries: { Comp: React.ComponentType<any>; name: string }[] = [
  { Comp: T_AnimatedList, name: "animated-list" },
  { Comp: T_AnimatedText, name: "animated-text" },
  { Comp: T_AreaChart, name: "area-chart" },
  { Comp: T_BlindsTransition, name: "blinds-transition" },
  { Comp: T_BokehCircles, name: "bokeh-circles" },
  { Comp: T_BounceText, name: "bounce-text" },
  { Comp: T_BubblePopText, name: "bubble-pop-text" },
  { Comp: T_CameraShake, name: "camera-shake" },
  { Comp: T_CardFlip, name: "card-flip" },
  { Comp: T_ChapterTitle, name: "chapter-title" },
  { Comp: T_ChartAnimation, name: "chart-animation" },
  { Comp: T_CinematicTitleIntro, name: "cinematic-title-intro" },
  { Comp: T_CircularProgress, name: "circular-progress" },
  { Comp: T_ClockWipe, name: "clock-wipe" },
  { Comp: T_ComparisonChart, name: "comparison-chart" },
  { Comp: T_CountdownIntro, name: "countdown-intro" },
  { Comp: T_CountdownTimer, name: "countdown-timer" },
  { Comp: T_CreditsRoll, name: "credits-roll" },
  { Comp: T_CrossDissolve, name: "cross-dissolve" },
  { Comp: T_DonutChart, name: "donut-chart" },
  { Comp: T_EndCard, name: "end-card" },
  { Comp: T_FadeThroughBlack, name: "fade-through-black" },
  { Comp: T_FilmBurn, name: "film-burn" },
  { Comp: T_FloatingBubbleText, name: "floating-bubble-text" },
  { Comp: T_GalleryGrid, name: "gallery-grid" },
  { Comp: T_GeometricPatterns, name: "geometric-patterns" },
  { Comp: T_GlitchText, name: "glitch-text" },
  { Comp: T_GradientShift, name: "gradient-shift" },
  { Comp: T_GridPulse, name: "grid-pulse" },
  { Comp: T_ImageCarousel, name: "image-carousel" },
  { Comp: T_ImageComparisonSlider, name: "image-comparison-slider" },
  { Comp: T_ImageZoomReveal, name: "image-zoom-reveal" },
  { Comp: T_IrisTransition, name: "iris-transition" },
  { Comp: T_KenBurns, name: "ken-burns" },
  { Comp: T_LetterboxReveal, name: "letterbox-reveal" },
  { Comp: T_LineChart, name: "line-chart" },
  { Comp: T_LiquidWave, name: "liquid-wave" },
  { Comp: T_LogoBlurReveal, name: "logo-blur-reveal" },
  { Comp: T_LogoBounceDrop, name: "logo-bounce-drop" },
  { Comp: T_LogoFadeReveal, name: "logo-fade-reveal" },
  { Comp: T_LogoGlitchReveal, name: "logo-glitch-reveal" },
  { Comp: T_LogoScaleRotate, name: "logo-scale-rotate" },
  { Comp: T_LogoSpinReveal, name: "logo-spin-reveal" },
  { Comp: T_LogoSplitReveal, name: "logo-split-reveal" },
  { Comp: T_LogoStrokeDraw, name: "logo-stroke-draw" },
  { Comp: T_LogoTypewriter, name: "logo-typewriter" },
  { Comp: T_LowerThird, name: "lower-third" },
  { Comp: T_MasonryGallery, name: "masonry-gallery" },
  { Comp: T_MatrixRain, name: "matrix-rain" },
  { Comp: T_MorphTransition, name: "morph-transition" },
  { Comp: T_NoiseGrain, name: "noise-grain" },
  { Comp: T_NotificationPop, name: "notification-pop" },
  { Comp: T_ParticleExplosion, name: "particle-explosion" },
  { Comp: T_PhotoStack, name: "photo-stack" },
  { Comp: T_PictureInPicture, name: "picture-in-picture" },
  { Comp: T_PieChart, name: "pie-chart" },
  { Comp: T_PixelTransition, name: "pixel-transition" },
  { Comp: T_PolaroidFrame, name: "polaroid-frame" },
  { Comp: T_PoppingText, name: "popping-text" },
  { Comp: T_ProgressBars, name: "progress-bars" },
  { Comp: T_ProgressSteps, name: "progress-steps" },
  { Comp: T_PulsingText, name: "pulsing-text" },
  { Comp: T_PushTransition, name: "push-transition" },
  { Comp: T_QuoteCard, name: "quote-card" },
  { Comp: T_RotatingCarousel, name: "rotating-carousel" },
  { Comp: T_SlideText, name: "slide-text" },
  { Comp: T_SlideWipe, name: "slide-wipe" },
  { Comp: T_SoundWave, name: "sound-wave" },
  { Comp: T_SplitScreen, name: "split-screen" },
  { Comp: T_SpotlightReveal, name: "spotlight-reveal" },
  { Comp: T_Starfield, name: "starfield" },
  { Comp: T_StatCounter, name: "stat-counter" },
  { Comp: T_SubscribeReminder, name: "subscribe-reminder" },
  { Comp: T_TextHighlight, name: "text-highlight" },
  { Comp: T_TitleSplit, name: "title-split" },
  { Comp: T_TypewriterSubtitle, name: "typewriter-subtitle" },
  { Comp: T_VignettePulse, name: "vignette-pulse" },
  { Comp: T_WhipPan, name: "whip-pan" },
  { Comp: T_ZoomThrough, name: "zoom-through" },
];

const Label: React.FC<{ name: string; index: number; total: number }> = ({ name, index, total }) => (
  <div style={{ position: "absolute", top: 24, left: 24, right: 24, display: "flex",
    justifyContent: "space-between", zIndex: 999, fontFamily: "monospace", fontSize: 22,
    color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
    <span>{index + 1}/{total} — {name}</span>
  </div>
);

export const TemplateGallery: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {entries.map(({ Comp, name }, i) => (
      <Sequence key={name} from={i * PER} durationInFrames={PER} name={name}>
        <AbsoluteFill>
          <Comp />
          <Label name={name} index={i} total={entries.length} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const TEMPLATE_GALLERY_FRAMES = entries.length * PER;
