import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {CameraStage} from '../../animation-library/creativeMotionPrimitives';
import {
  BrandAnchor,
  GlassPanel,
  HeroOrb,
  InfoChip,
  KineticConnector,
  SceneBackdrop,
  TechIcon,
  type TechIconName,
} from '../../visual-system/TechVisualKit';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {GPT56_SCENES, GPT56_SUBTITLES, type Gpt56Cue, type Gpt56Scene} from './contract';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const sceneIcon = (icon: string): TechIconName => {
  const mapping: Record<string, TechIconName> = {
    swap: 'arrow-swap',
    moon: 'sparkles',
    sun: 'zap',
    slider: 'sliders',
    steps: 'brain',
    plans: 'gauge',
    compare: 'arrow-swap',
  };
  return mapping[icon] ?? 'sparkles';
};

const Header: React.FC<{scene: Gpt56Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 150, mass: 0.75}});
  return (
    <div style={{position: 'absolute', left: 68, right: 68, top: 72, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: enter, transform: `translateY(${(1 - enter) * -18}px)`}}>
      <div style={{width: 62, height: 62, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(185,140,255,.15)', border: '2px solid rgba(110,69,201,.18)', color: BRAND.accentDk, boxShadow: '0 14px 32px rgba(45,30,68,.08)'}}>
        <TechIcon name={sceneIcon(scene.icon)} size={34} />
      </div>
      <div style={{fontSize: scene.headline.length > 27 ? 40 : 47, lineHeight: 1.02, fontWeight: 950, letterSpacing: -1.5, color: BRAND.accentDk, textAlign: 'center'}}>{scene.headline}</div>
    </div>
  );
};

const CaptionLayer: React.FC<{showCaptions: boolean}> = ({showCaptions}) => {
  const frame = useCurrentFrame();
  if (!showCaptions) return null;
  const cue = GPT56_SUBTITLES.find((candidate) => frame >= candidate.startFrame && frame < candidate.endFrame) as Gpt56Cue | undefined;
  if (!cue) return null;
  const words = cue.text.trim().split(/\s+/).filter(Boolean);
  const local = clamp((frame - cue.startFrame) / Math.max(1, cue.endFrame - cue.startFrame));
  const activeIndex = Math.min(words.length - 1, Math.floor(local * Math.max(1, words.length)));
  return (
    <div style={{position: 'absolute', left: REEL_CAPTION_SAFE.horizontalInset, right: REEL_CAPTION_SAFE.horizontalInset, bottom: REEL_CAPTION_SAFE.bottom, zIndex: 100, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{maxWidth: REEL_CAPTION_SAFE.maxWidth, textAlign: 'center', fontSize: 48, lineHeight: 1.08, fontWeight: 950, letterSpacing: -1.35, color: BRAND.ink, textWrap: 'balance'}}>
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span style={{color: index === activeIndex ? BRAND.accentDk : BRAND.ink}}>{word}</span>
            {index < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const SpeedTrail: React.FC<{x: number; y: number; width: number; delay: number}> = ({x, y, width, delay}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, delay, delay + 38);
  return <div style={{position: 'absolute', left: x, top: y, width: width * p, height: 7, borderRadius: 8, background: 'linear-gradient(90deg,rgba(185,140,255,0),rgba(110,69,201,.52))', opacity: p}} />;
};

const ModelSwapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const oldExit = ease(frame, 58, 112);
  const newEnter = ease(frame, 90, 150);
  const impact = ease(frame, 118, 178);
  return (
    <CameraStage mode="push" startFrame={0} endFrame={205} intensity={0.8}>
      <SceneBackdrop intensity={1.05} />
      <BrandAnchor brand="chatgpt" x={58} y={176} accent delay={4} />
      <InfoChip label="MODELL-UPDATE" icon="sparkles" x={718} y={180} width={300} delay={10} />
      <GlassPanel x={94} y={350} width={892} height={350} radius={48} delay={4}>
        <div style={{position: 'absolute', left: 54, top: 40, fontSize: 22, fontWeight: 900, color: 'rgba(26,26,46,.46)', letterSpacing: 1.6}}>CHATGPT · MODELLWECHSEL</div>
        <div style={{position: 'absolute', left: 66, top: 126, width: 310, height: 126, borderRadius: 32, background: '#F2F0F5', border: '2px solid rgba(26,26,46,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, fontSize: 42, fontWeight: 950, color: BRAND.ink, opacity: 1 - oldExit * 0.92, transform: `translateX(${-380 * oldExit}px) rotate(${-7 * oldExit}deg)`}}>
          <TechIcon name="lock" size={36} color="rgba(26,26,46,.55)" /> GPT-5.5
        </div>
        <div style={{position: 'absolute', right: 66, top: 126, width: 334, height: 126, borderRadius: 32, background: 'linear-gradient(135deg,#F4ECFF,#E5D7FF)', border: '3px solid rgba(110,69,201,.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, fontSize: 42, fontWeight: 950, color: BRAND.accentDk, opacity: newEnter, transform: `translateX(${380 * (1 - newEnter)}px) scale(${0.88 + newEnter * 0.12})`, boxShadow: '0 24px 55px rgba(110,69,201,.16)'}}>
          <TechIcon name="sparkles" size={38} /> GPT-5.6
        </div>
        <div style={{position: 'absolute', left: 414, top: 154, color: BRAND.accentDk, opacity: newEnter}}><TechIcon name="arrow-swap" size={64} strokeWidth={2.5} /></div>
      </GlassPanel>
      <KineticConnector from={{x: 530, y: 720}} to={{x: 530, y: 875}} startFrame={72} endFrame={128} width={8} />
      <GlassPanel x={304} y={850} width={472} height={360} radius={44} accent delay={88} rotate={-1.2}>
        <div style={{position: 'absolute', left: 34, top: 30, width: 76, height: 76, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.accentDk, boxShadow: '0 12px 30px rgba(45,30,68,.08)'}}><TechIcon name="calendar" size={44} /></div>
        <div style={{position: 'absolute', left: 130, top: 40, fontSize: 24, fontWeight: 950, color: BRAND.accentDk}}>OKTOBER 2026</div>
        <div style={{position: 'absolute', left: 58, right: 58, top: 126, height: 160, borderRadius: 34, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, boxShadow: '0 18px 45px rgba(45,30,68,.10)', transform: `scale(${0.94 + impact * 0.06})`}}>
          <span style={{fontSize: 118, lineHeight: 1, fontWeight: 950, color: BRAND.ink}}>14</span>
          <span style={{fontSize: 31, fontWeight: 950, color: '#B5415C'}}>OCT</span>
        </div>
      </GlassPanel>
      <InfoChip label="GPT-5.5 RAUS" icon="unlock" x={90} y={1238} width={310} accent delay={132} />
      <InfoChip label="GPT-5.6 REIN" icon="zap" x={680} y={1238} width={310} delay={148} />
    </CameraStage>
  );
};

const LunaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stream = ease(frame, 78, 188);
  return (
    <CameraStage mode="parallax" startFrame={0} endFrame={205} intensity={0.65}>
      <SceneBackdrop intensity={0.85} />
      <BrandAnchor brand="chatgpt" x={58} y={180} compact delay={4} />
      <HeroOrb label="LUNA" eyebrow="GPT-5.6" x={345} y={420} size={390} delay={10} icon="zap" />
      <InfoChip label="FREE" icon="bot" x={86} y={530} width={230} delay={42} />
      <InfoChip label="GO" icon="sparkles" x={764} y={530} width={230} delay={54} />
      <InfoChip label="SCHNELL" icon="zap" x={175} y={1005} width={300} accent delay={112} />
      <InfoChip label="LOW COST" icon="gauge" x={605} y={1005} width={300} delay={126} />
      {[0,1,2,3,4].map((index) => <SpeedTrail key={index} x={150 + index * 105} y={865 + (index % 2) * 34} width={145 + index * 16} delay={72 + index * 8} />)}
      <div style={{position: 'absolute', left: 172, top: 1160, width: 736, display: 'flex', justifyContent: 'space-between', opacity: stream}}>
        {['Prompt', 'Antwort', 'Weiter'].map((label, index) => (
          <div key={label} style={{width: 190, height: 92, borderRadius: 26, background: '#fff', border: '2px solid rgba(110,69,201,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 900, color: index === 1 ? BRAND.accentDk : BRAND.ink, boxShadow: '0 14px 34px rgba(45,30,68,.08)', transform: `translateX(${(1 - stream) * (index - 1) * 60}px)`}}>{label}</div>
        ))}
      </div>
    </CameraStage>
  );
};

const SolScene: React.FC = () => {
  const frame = useCurrentFrame();
  const network = ease(frame, 48, 150);
  const codeReveal = ease(frame, 104, 190);
  return (
    <CameraStage mode="push" startFrame={0} endFrame={205} intensity={1.05}>
      <SceneBackdrop intensity={1.0} />
      <BrandAnchor brand="chatgpt" x={58} y={180} compact accent delay={4} />
      <HeroOrb label="SOL" eyebrow="GPT-5.6" x={350} y={395} size={380} delay={8} icon="brain" warm />
      <InfoChip label="CODE" icon="code" x={64} y={490} width={235} delay={38} />
      <InfoChip label="RECHERCHE" icon="search" x={760} y={430} width={260} delay={52} />
      <InfoChip label="WORKFLOW" icon="workflow" x={742} y={790} width={270} delay={66} />
      <KineticConnector from={{x: 290, y: 525}} to={{x: 465, y: 575}} startFrame={46} endFrame={105} width={7} />
      <KineticConnector from={{x: 790, y: 465}} to={{x: 620, y: 555}} startFrame={56} endFrame={118} width={7} />
      <KineticConnector from={{x: 790, y: 825}} to={{x: 625, y: 690}} startFrame={70} endFrame={135} width={7} />
      <GlassPanel x={128} y={940} width={824} height={310} radius={38} delay={105}>
        <div style={{position: 'absolute', left: 32, top: 26, display: 'flex', alignItems: 'center', gap: 14, color: BRAND.accentDk}}><TechIcon name="terminal" size={35} /><span style={{fontSize: 25, fontWeight: 950}}>COMPLEXER WORKFLOW</span></div>
        <div style={{position: 'absolute', left: 38, right: 38, top: 92, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18}}>
          {[
            ['1', 'Planen'],
            ['2', 'Prüfen'],
            ['3', 'Ausführen'],
          ].map(([number, label], index) => (
            <div key={label} style={{height: 150, borderRadius: 26, background: index === 2 ? '#EEE3FF' : '#F8F5FC', border: '2px solid rgba(110,69,201,.12)', opacity: codeReveal, transform: `translateY(${(1 - codeReveal) * (24 + index * 8)}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              <div style={{fontSize: 22, fontWeight: 900, color: 'rgba(26,26,46,.45)'}}>{number}</div>
              <div style={{fontSize: 29, fontWeight: 950, color: index === 2 ? BRAND.accentDk : BRAND.ink}}>{label}</div>
            </div>
          ))}
        </div>
      </GlassPanel>
      <div style={{position: 'absolute', left: 510, top: 820, width: 60, height: 60, borderRadius: '50%', background: BRAND.accentDk, boxShadow: '0 0 0 18px rgba(185,140,255,.12)', opacity: network}} />
    </CameraStage>
  );
};

const ThinkingSliderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const move = ease(frame, 58, 180);
  const knobX = 82 + move * 652;
  const brainPulse = 0.96 + Math.sin(frame / 12) * 0.04;
  return (
    <CameraStage mode="push" startFrame={0} endFrame={205} intensity={0.72}>
      <SceneBackdrop intensity={0.8} />
      <BrandAnchor brand="chatgpt" x={58} y={180} compact delay={4} />
      <GlassPanel x={108} y={420} width={864} height={430} radius={48} delay={10}>
        <div style={{position: 'absolute', left: 42, top: 38, display: 'flex', alignItems: 'center', gap: 15, color: BRAND.accentDk}}><TechIcon name="sliders" size={38} /><span style={{fontSize: 28, fontWeight: 950}}>THINKING</span></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 184, height: 18, borderRadius: 18, background: '#EDE7F5', overflow: 'hidden'}}><div style={{height: '100%', width: `${move * 100}%`, borderRadius: 18, background: `linear-gradient(90deg,#D3BAFF,${BRAND.accentDk})`}} /></div>
        <div style={{position: 'absolute', left: knobX, top: 142, width: 96, height: 96, borderRadius: '50%', background: BRAND.accentDk, border: '8px solid #fff', boxShadow: '0 18px 44px rgba(110,69,201,.28)', transform: 'translateX(-48px)'}} />
        {['INSTANT','MEDIUM','HIGH','EXTRA'].map((label, index) => <div key={label} style={{position: 'absolute', left: 44 + index * 205, top: 265, width: 180, textAlign: 'center', fontSize: 20, fontWeight: 950, color: index <= Math.round(move * 3) ? BRAND.accentDk : 'rgba(26,26,46,.32)'}}>{label}</div>)}
      </GlassPanel>
      <div style={{position: 'absolute', left: 390, top: 930, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,#EEE3FF 0%,rgba(238,227,255,.45) 50%,transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.accentDk, transform: `scale(${brainPulse})`}}><TechIcon name="brain" size={126} strokeWidth={1.8} /></div>
      <InfoChip label="SCHNELL" icon="zap" x={110} y={1130} width={270} delay={60} />
      <InfoChip label="MEHR TIEFE" icon="brain" x={700} y={1130} width={270} accent delay={122} />
    </CameraStage>
  );
};

const ThinkingStepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const build = ease(frame, 12, 120);
  const premium = ease(frame, 116, 190);
  const levels = [
    {label: 'INSTANT', icon: 'zap' as TechIconName, h: 180},
    {label: 'MEDIUM', icon: 'gauge' as TechIconName, h: 260},
    {label: 'HIGH', icon: 'brain' as TechIconName, h: 350},
    {label: 'EXTRA HIGH', icon: 'unlock' as TechIconName, h: 455},
  ];
  return (
    <CameraStage mode="pan-right" startFrame={0} endFrame={205} intensity={0.55}>
      <SceneBackdrop intensity={0.78} />
      <div style={{position: 'absolute', left: 86, top: 360, width: 910, height: 780}}>
        {levels.map((level, index) => {
          const p = clamp(build * 4 - index);
          return (
            <div key={level.label} style={{position: 'absolute', left: index * 205, bottom: 0, width: 250, height: level.h, borderRadius: '34px 34px 16px 16px', background: index === 3 ? 'linear-gradient(180deg,#F6EFFF,#E6D4FF)' : '#fff', border: `2px solid ${index === 3 ? 'rgba(110,69,201,.28)' : 'rgba(110,69,201,.14)'}`, boxShadow: index === 3 ? '0 28px 74px rgba(110,69,201,.18)' : '0 18px 44px rgba(45,30,68,.08)', opacity: p, transform: `translateY(${(1 - p) * 90}px) scale(${0.94 + 0.06 * p})`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 34, gap: 18}}>
              <TechIcon name={level.icon} size={index === 3 ? 52 : 40} color={index === 3 ? BRAND.accentDk : BRAND.ink} />
              <div style={{fontSize: 22, fontWeight: 950, color: index === 3 ? BRAND.accentDk : BRAND.ink, textAlign: 'center'}}>{level.label}</div>
              {index === 3 ? <div style={{marginTop: 18, width: 92, height: 92, borderRadius: 28, background: BRAND.accentDk, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: premium, transform: `scale(${0.85 + premium * 0.15})`}}><TechIcon name="sparkles" size={48} color="#fff" /></div> : null}
            </div>
          );
        })}
      </div>
      <InfoChip label="4 DENKSTUFEN" icon="brain" x={350} y={1225} width={380} accent delay={138} />
    </CameraStage>
  );
};

const PlansScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = ease(frame, 10, 130);
  const access = ease(frame, 105, 192);
  const plans = [
    {name: 'PLUS', h: 260, features: ['Medium', 'High'], premium: false},
    {name: 'PRO', h: 385, features: ['Extra High', 'Pro-Stufe'], premium: true},
    {name: 'BUSINESS', h: 470, features: ['Extra High', 'Pro-Stufe'], premium: true},
    {name: 'ENTERPRISE', h: 555, features: ['Extra High', 'Pro-Stufe'], premium: true},
  ];
  return (
    <CameraStage mode="pull" startFrame={0} endFrame={205} intensity={0.5}>
      <SceneBackdrop intensity={0.72} />
      <InfoChip label="PLAN-ZUGRIFF" icon="gauge" x={358} y={192} width={364} accent delay={5} />
      <div style={{position: 'absolute', left: 58, right: 58, top: 390, height: 760, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        {plans.map((plan, index) => {
          const p = clamp(rise * 4 - index);
          return (
            <div key={plan.name} style={{width: 225, height: plan.h, borderRadius: '34px 34px 18px 18px', background: plan.premium ? 'linear-gradient(180deg,#F3E9FF,#E6D5FF)' : '#fff', border: `2px solid ${plan.premium ? 'rgba(110,69,201,.24)' : 'rgba(110,69,201,.13)'}`, boxShadow: plan.premium ? '0 24px 62px rgba(110,69,201,.14)' : '0 16px 40px rgba(45,30,68,.08)', opacity: p, transform: `translateY(${(1 - p) * 100}px)`, padding: '30px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
              <div style={{fontSize: 27, fontWeight: 950, color: plan.premium ? BRAND.accentDk : BRAND.ink}}>{plan.name}</div>
              <div style={{width: 72, height: 72, borderRadius: 22, background: plan.premium ? BRAND.accentDk : '#F2EEF7', color: plan.premium ? '#fff' : BRAND.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: index === 0 ? 1 : access}}><TechIcon name={index === 0 ? 'lock' : 'unlock'} size={38} color="currentColor" /></div>
              {plan.features.map((feature) => <div key={feature} style={{width: '100%', minHeight: 58, borderRadius: 19, background: 'rgba(255,255,255,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 900, color: BRAND.ink, textAlign: 'center', padding: '0 8px'}}>{feature}</div>)}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 180, top: 1190, width: 720, height: 12, borderRadius: 12, background: '#EDE6F6', overflow: 'hidden'}}><div style={{height: '100%', width: `${access * 100}%`, background: `linear-gradient(90deg,#CDB0FF,${BRAND.accentDk})`}} /></div>
    </CameraStage>
  );
};

const ChatLane: React.FC<{x: number; model: string; level: string; stronger?: boolean; delay: number}> = ({x, model, level, stronger = false, delay}) => {
  const frame = useCurrentFrame();
  const enter = ease(frame, delay, delay + 42);
  const response = ease(frame, delay + 42, delay + 120);
  return (
    <div style={{position: 'absolute', left: x, top: 610, width: 420, height: 565, borderRadius: 42, background: '#fff', border: `3px solid ${stronger ? 'rgba(110,69,201,.28)' : 'rgba(110,69,201,.12)'}`, boxShadow: stronger ? '0 30px 80px rgba(110,69,201,.17)' : '0 22px 58px rgba(45,30,68,.10)', opacity: enter, transform: `translateY(${(1 - enter) * 46}px) scale(${0.94 + 0.06 * enter})`, overflow: 'hidden'}}>
      <div style={{height: 96, borderBottom: '2px solid rgba(110,69,201,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 950, color: BRAND.ink}}><TechIcon name="bot" size={33} color={BRAND.accentDk} />ChatGPT</div>
        <div style={{padding: '10px 14px', borderRadius: 14, background: stronger ? BRAND.accentDk : '#F1ECF7', color: stronger ? '#fff' : BRAND.ink, fontSize: 18, fontWeight: 900}}>{model}</div>
      </div>
      <div style={{padding: 28}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 15px', borderRadius: 15, background: stronger ? '#EEE3FF' : '#F4F1F7', color: stronger ? BRAND.accentDk : BRAND.ink, fontSize: 18, fontWeight: 900}}><TechIcon name="brain" size={22} />{level}</div>
        {[0,1,2,3].map((index) => <div key={index} style={{marginTop: 30 + index * 2, width: `${(stronger ? 86 : 68) - index * 8}%`, height: 16, borderRadius: 14, background: index === 0 && stronger ? '#C9A9FF' : '#E7E1EC', opacity: response, transform: `scaleX(${0.65 + response * 0.35})`, transformOrigin: 'left center'}} />)}
        {stronger ? <div style={{marginTop: 34, height: 86, borderRadius: 24, background: 'linear-gradient(135deg,#F6EFFF,#E8D8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: BRAND.accentDk, fontSize: 22, fontWeight: 950, opacity: response}}><TechIcon name="sparkles" size={30} />MEHR TIEFE</div> : null}
      </div>
    </div>
  );
};

const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = ease(frame, 34, 94);
  const finale = ease(frame, 150, 198);
  return (
    <CameraStage mode="push" startFrame={0} endFrame={205} intensity={0.75}>
      <SceneBackdrop intensity={0.95} />
      <BrandAnchor brand="chatgpt" x={58} y={180} compact accent delay={4} />
      <GlassPanel x={258} y={330} width={564} height={128} radius={32} delay={10}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 29, fontWeight: 950, color: BRAND.ink}}><TechIcon name="terminal" size={34} color={BRAND.accentDk} />GLEICHER PROMPT</div>
      </GlassPanel>
      <KineticConnector from={{x: 540, y: 470}} to={{x: 300, y: 610}} startFrame={32} endFrame={82} width={6} />
      <KineticConnector from={{x: 540, y: 470}} to={{x: 780, y: 610}} startFrame={42} endFrame={92} width={6} />
      <div style={{opacity: split}}>
        <ChatLane x={72} model="LUNA" level="Think" delay={62} />
        <ChatLane x={588} model="SOL" level="High" stronger delay={78} />
      </div>
      <div style={{position: 'absolute', left: 242, top: 1215, width: 596, height: 102, borderRadius: 30, background: BRAND.accentDk, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontSize: 30, fontWeight: 950, boxShadow: '0 24px 64px rgba(110,69,201,.25)', opacity: finale, transform: `scale(${0.9 + finale * 0.1})`}}><TechIcon name="sliders" size={40} color="#fff" />MODELL + DENKSTUFE</div>
    </CameraStage>
  );
};

const sceneComponent: Record<string, React.FC> = {
  'gpt56-01': ModelSwapScene,
  'gpt56-02': LunaScene,
  'gpt56-03': SolScene,
  'gpt56-04': ThinkingSliderScene,
  'gpt56-05': ThinkingStepsScene,
  'gpt56-06': PlansScene,
  'gpt56-07': CompareScene,
};

const Scene: React.FC<{scene: Gpt56Scene}> = ({scene}) => {
  const Visual = sceneComponent[scene.sceneId];
  return (
    <AbsoluteFill style={{backgroundColor: '#fff', overflow: 'hidden'}}>
      <Visual />
      <Header scene={scene} />
    </AbsoluteFill>
  );
};

export type ReelGpt56ChatGPTProps = {showCaptions?: boolean};

export const ReelGpt56ChatGPTV2: React.FC<ReelGpt56ChatGPTProps> = ({showCaptions = true}) => (
  <AbsoluteFill style={{backgroundColor: '#fff', fontFamily: 'Inter, Arial, sans-serif', color: BRAND.ink}}>
    {GPT56_SCENES.map((scene) => (
      <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} layout="none">
        <Scene scene={scene} />
      </Sequence>
    ))}
    <CaptionLayer showCaptions={showCaptions} />
  </AbsoluteFill>
);
