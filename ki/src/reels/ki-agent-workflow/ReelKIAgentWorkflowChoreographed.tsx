import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  FileText,
  Globe2,
  ListChecks,
  LockKeyhole,
  MousePointer2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react';
import {BRAND} from '../../../brand/brand';
import choreographyPlanJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/06-projektdateien/CHOREOGRAPHY-PLAN.json';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {createChoreographyTiming, type ChoreographyPlan, type ResolvedChoreographyBeat} from '../choreographyTiming';
import {StoryProgressRail, StoryTexture} from '../StoryMotion';
import {KI_AGENT_WORKFLOW_CUES, KI_AGENT_WORKFLOW_SCENES} from './contract';

type Props = {
  voiceoverSrc: string;
  showCaptions?: boolean;
  generatedImageSrc?: string;
  generatedBrollSrc?: string;
};

type SceneProps = {
  sceneId: string;
  duration: number;
  accent: string;
  generatedImageSrc?: string;
  generatedBrollSrc?: string;
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const FONT = BRAND.font;
const choreography = createChoreographyTiming(
  KI_AGENT_WORKFLOW_CUES,
  KI_AGENT_WORKFLOW_SCENES,
  choreographyPlanJson as ChoreographyPlan,
);

const Shell: React.FC<React.PropsWithChildren<{accent: string; eyebrow: string; seed: number}>> = ({accent, eyebrow, seed, children}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: BRAND.ink, background: `linear-gradient(180deg, ${BRAND.bg} 0%, ${BRAND.bgDeep} 100%)`, padding: '86px 68px 350px', overflow: 'hidden'}}>
    <StoryTexture seed={seed} color={BRAND.bg} opacity={0.08}/>
    <div style={{position: 'relative', zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 900, color: accent, letterSpacing: '.05em'}}>
      <span style={{width: 10, height: 10, borderRadius: 99, background: accent, boxShadow: `0 0 0 6px ${accent}18`}}/>
      {eyebrow}
    </div>
    <div style={{position: 'relative', zIndex: 2, flex: 1}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{background: 'rgba(255,255,255,.95)', border: '1px solid rgba(26,26,46,.075)', boxShadow: '0 22px 58px rgba(65,45,105,.10)', borderRadius: 30, ...style}}>{children}</div>
);

const Headline: React.FC<React.PropsWithChildren<{size?: number}>> = ({children, size = 72}) => (
  <div style={{fontSize: size, lineHeight: 1, fontWeight: 950, letterSpacing: '-.048em', marginTop: 24, maxWidth: 930}}>{children}</div>
);

const TimedBeat: React.FC<React.PropsWithChildren<{
  window: ResolvedChoreographyBeat;
  direction?: 'up' | 'left' | 'right' | 'none';
  style?: React.CSSProperties;
}>> = ({window, direction = 'up', style, children}) => {
  const frame = useCurrentFrame();
  if (frame < window.visualStartFrame || frame >= window.visualEndFrame) return null;
  const enterRaw = interpolate(frame, [window.visualStartFrame, Math.max(window.visualStartFrame + 1, window.enterEndFrame)], [0, 1], clamp);
  const exitRaw = interpolate(frame, [window.exitStartFrame, Math.max(window.exitStartFrame + 1, window.visualEndFrame)], [1, 0], clamp);
  const enter = Easing.out(Easing.cubic)(enterRaw);
  const exit = Easing.inOut(Easing.cubic)(exitRaw);
  const opacity = Math.max(0, Math.min(1, Math.min(enter, exit)));
  const enterTravel = 18 * (1 - enter);
  const exitTravel = 8 * (1 - exit);
  const x = direction === 'left' ? -enterTravel + exitTravel : direction === 'right' ? enterTravel - exitTravel : 0;
  const y = direction === 'up' ? enterTravel - exitTravel : 0;
  const scale = 0.985 + 0.015 * enter - 0.008 * (1 - exit);
  return <div style={{...style, opacity, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`, transformOrigin: 'center', willChange: 'transform, opacity'}}>{children}</div>;
};

const EnterOnly: React.FC<React.PropsWithChildren<{
  startFrame: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  style?: React.CSSProperties;
}>> = ({startFrame, direction = 'up', style, children}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const raw = interpolate(frame, [startFrame, startFrame + 9], [0, 1], clamp);
  const eased = Easing.out(Easing.cubic)(raw);
  const travel = 20 * (1 - eased);
  const x = direction === 'left' ? -travel : direction === 'right' ? travel : 0;
  const y = direction === 'up' ? travel : 0;
  return <div style={{...style, opacity: eased, transform: `translate3d(${x}px, ${y}px, 0) scale(${0.985 + 0.015 * eased})`, transformOrigin: 'center', willChange: 'transform, opacity'}}>{children}</div>;
};

const IconStep: React.FC<{
  window: ResolvedChoreographyBeat;
  icon: React.ReactNode;
  label: string;
  color: string;
  compact?: boolean;
}> = ({window, icon, label, color, compact = false}) => {
  const frame = useCurrentFrame();
  const pending = frame < window.visualStartFrame;
  const active = frame >= window.visualStartFrame && frame < window.visualEndFrame;
  const done = frame >= window.visualEndFrame;
  const appear = interpolate(frame, [Math.max(0, window.visualStartFrame - 5), window.visualStartFrame + 5], [0.45, 1], clamp);
  const scale = active ? interpolate(frame, [window.visualStartFrame, window.visualStartFrame + 8], [0.985, 1.02], clamp) : 1;
  return (
    <div style={{display: 'grid', gridTemplateColumns: compact ? '54px 1fr 28px' : '64px 1fr 32px', gap: compact ? 12 : 18, alignItems: 'center', padding: compact ? '14px 16px' : '18px 20px', borderRadius: 22, background: active ? `${color}12` : 'rgba(255,255,255,.78)', border: `1px solid ${active ? `${color}42` : 'rgba(26,26,46,.07)'}`, opacity: pending ? 0.52 : done ? 0.80 : appear, transform: `scale(${scale})`, boxShadow: active ? `0 12px 28px ${color}18` : 'none'}}>
      <div style={{width: compact ? 48 : 56, height: compact ? 48 : 56, borderRadius: 18, display: 'grid', placeItems: 'center', color: pending ? '#98A2B3' : color, background: pending ? '#F2F4F7' : `${color}12`}}>{icon}</div>
      <div style={{fontSize: compact ? 22 : 25, fontWeight: 930, letterSpacing: '-.02em'}}>{label}</div>
      {done ? <CheckCircle2 size={compact ? 25 : 29} color="#12B76A"/> : active ? <div style={{width: 12, height: 12, borderRadius: 99, background: color, boxShadow: `0 0 0 7px ${color}18`}}/> : <div style={{width: 10, height: 10, borderRadius: 99, background: '#D0D5DD'}}/>}
    </div>
  );
};

const MediaImage: React.FC<{src?: string; duration: number}> = ({src, duration}) => {
  const frame = useCurrentFrame();
  if (!src) return null;
  const scale = interpolate(frame, [0, Math.max(1, duration)], [1.02, 1.08], clamp);
  const y = interpolate(frame, [0, Math.max(1, duration)], [0, -12], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${y}px) scale(${scale})`}}/>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(243,240,250,.80))'}}/>
    </div>
  );
};

const MediaVideo: React.FC<{src?: string}> = ({src}) => src ? (
  <div style={{position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,46,.08), rgba(26,26,46,.52))'}}/>
  </div>
) : null;

const Scene1: React.FC<SceneProps> = ({sceneId, accent}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's1-headline');
  const goal = choreography.local(sceneId, 's1-goal');
  const search = choreography.local(sceneId, 's1-search');
  const compare = choreography.local(sceneId, 's1-compare');
  const agent = choreography.local(sceneId, 's1-agent');
  const progress = interpolate(frame, [search.visualStartFrame, Math.max(search.visualStartFrame + 1, agent.visualStartFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="01 • DAS ZIEL" seed={7}>
      <TimedBeat window={headline}><Headline>Du gibst nicht jeden Schritt vor.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 34}}>
        <EnterOnly startFrame={goal.visualStartFrame} style={{position: 'absolute', left: 54, right: 54, top: 70}}>
          <Card style={{padding: 30}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, color: accent, fontSize: 22, fontWeight: 900}}><Target size={34}/> EIN ZIEL</div>
            <div style={{fontSize: 41, lineHeight: 1.08, fontWeight: 950, marginTop: 16}}>3 Lieferanten finden.<br/>Angebote vergleichen.</div>
            <div style={{marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
              <IconStep window={search} label="Finden" icon={<Search size={28}/>} color="#2E90FA" compact/>
              <IconStep window={compare} label="Vergleichen" icon={<FileText size={28}/>} color="#F79009" compact/>
              <IconStep window={agent} label="Agent" icon={<Bot size={28}/>} color={accent} compact/>
            </div>
            <div style={{marginTop: 24}}><StoryProgressRail progress={progress} accent={accent} height={10}/></div>
          </Card>
        </EnterOnly>
        <EnterOnly startFrame={agent.visualStartFrame} style={{position: 'absolute', left: 210, right: 210, top: 720}}>
          <Card style={{padding: 30, textAlign: 'center', border: `2px solid ${accent}26`}}><Bot size={62} color={accent}/><div style={{fontSize: 34, fontWeight: 950, marginTop: 10}}>KI-AGENT</div><div style={{fontSize: 22, opacity: .62, marginTop: 6}}>Ziel statt Einzelschritte</div></Card>
        </EnterOnly>
      </div>
    </Shell>
  );
};

const Scene2: React.FC<SceneProps> = ({sceneId, duration, accent, generatedImageSrc}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's2-headline');
  const parts = choreography.local(sceneId, 's2-parts');
  const tool = choreography.local(sceneId, 's2-tool');
  const web = choreography.local(sceneId, 's2-web');
  const files = choreography.local(sceneId, 's2-files');
  const save = choreography.local(sceneId, 's2-save');
  const progress = interpolate(frame, [parts.visualStartFrame, Math.max(parts.visualStartFrame + 1, save.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="02 • PLAN + TOOLS" seed={10}>
      <TimedBeat window={headline}><Headline size={66}>Der Agent zerlegt das Ziel.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <EnterOnly startFrame={parts.visualStartFrame} style={{position: 'absolute', inset: '40px 18px 210px'}}>
          <Card style={{position: 'absolute', inset: 0, padding: 28, overflow: 'hidden'}}>
            <MediaImage src={generatedImageSrc} duration={duration}/>
            <div style={{position: 'relative', zIndex: 2}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 950}}><ListChecks size={34} color={accent}/> ÜBERSICHT</div>
              <div style={{marginTop: 26, display: 'grid', gap: 16}}>
                <IconStep window={web} label="Webseiten" icon={<Globe2 size={30}/>} color="#2E90FA"/>
                <IconStep window={files} label="Dateien" icon={<FileText size={30}/>} color="#F79009"/>
                <IconStep window={save} label="Zwischenergebnisse" icon={<Database size={30}/>} color="#12B76A"/>
              </div>
              <div style={{marginTop: 28}}><StoryProgressRail progress={progress} accent={accent} height={12}/></div>
            </div>
          </Card>
        </EnterOnly>
        <TimedBeat window={tool} style={{position: 'absolute', left: 250, right: 250, bottom: 72}}><Card style={{padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 23, fontWeight: 950}}><Wrench color={accent} size={28}/> Tool wählen</Card></TimedBeat>
      </div>
    </Shell>
  );
};

const Scene3: React.FC<SceneProps> = ({sceneId, accent, generatedBrollSrc}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's3-headline');
  const retry = choreography.local(sceneId, 's3-retry');
  const next = choreography.local(sceneId, 's3-next');
  const other = choreography.local(sceneId, 's3-other');
  const loop = interpolate(frame, [headline.visualStartFrame, Math.max(headline.visualStartFrame + 1, other.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="03 • DER LOOP" seed={13}>
      <TimedBeat window={headline}><Headline size={66}>Reicht das Ergebnis schon?</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 26}}>
        <Card style={{position: 'absolute', left: 35, right: 35, top: 40, height: 650, padding: 28, overflow: 'hidden', background: generatedBrollSrc ? '#111827' : 'rgba(255,255,255,.94)'}}>
          <MediaVideo src={generatedBrollSrc}/>
          <div style={{position: 'relative', zIndex: 2, height: '100%', display: 'grid', placeItems: 'center'}}><div style={{position: 'relative', width: 520, height: 520, borderRadius: 999, border: '3px solid rgba(185,140,255,.22)', background: generatedBrollSrc ? 'rgba(17,24,39,.38)' : 'rgba(185,140,255,.07)'}}>
            <div style={{position: 'absolute', inset: 64, borderRadius: 999, border: `14px solid ${accent}20`, borderTopColor: accent, transform: `rotate(${loop * 520}deg)`}}/>
            <div style={{position: 'absolute', left: 165, top: 54, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Wrench size={42} color={accent}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>AUSFÜHREN</div></div>
            <div style={{position: 'absolute', right: 54, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Search size={42} color="#2E90FA"/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>PRÜFEN</div></div>
            <div style={{position: 'absolute', left: 190, bottom: 52, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><RefreshCcw size={42} color={frame >= retry.visualStartFrame ? '#F79009' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>RETRY</div></div>
            <div style={{position: 'absolute', left: 55, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><CheckCircle2 size={42} color={frame < retry.visualStartFrame ? '#12B76A' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>FERTIG?</div></div>
          </div></div>
        </Card>
        <EnterOnly startFrame={retry.visualStartFrame} style={{position: 'absolute', left: 70, right: 70, top: 735}}>
          <Card style={{padding: 18}}><div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12}}>
            <IconStep window={retry} label="Retry" icon={<RefreshCcw size={27}/>} color="#F04438" compact/>
            <IconStep window={next} label="Nächster" icon={<ArrowRight size={27}/>} color={accent} compact/>
            <IconStep window={other} label="Anderer Weg" icon={<ListChecks size={27}/>} color="#F79009" compact/>
          </div></Card>
        </EnterOnly>
      </div>
    </Shell>
  );
};

const Scene4: React.FC<SceneProps> = ({sceneId, accent}) => {
  const headline = choreography.local(sceneId, 's4-headline');
  const model = choreography.local(sceneId, 's4-model');
  const rules = choreography.local(sceneId, 's4-rules');
  const tools = choreography.local(sceneId, 's4-tools');
  const permission = choreography.local(sceneId, 's4-permission');
  const limits = choreography.local(sceneId, 's4-limits');
  const overviewStart = Math.max(0, headline.enterEndFrame - 2);
  return (
    <Shell accent={accent} eyebrow="04 • GUARDRAILS" seed={18}>
      <TimedBeat window={headline}><Headline size={64}>Ein Agent denkt nicht wie ein Mensch.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 24}}>
        <EnterOnly startFrame={overviewStart} style={{position: 'absolute', left: 35, right: 35, top: 45}}>
          <Card style={{padding: 26}}>
            <div style={{fontSize: 22, fontWeight: 950, color: accent, marginBottom: 18}}>WAS IHN STEUERT</div>
            <div style={{display: 'grid', gap: 14}}>
              <IconStep window={model} label="Modell" icon={<Bot size={30}/>} color={BRAND.accentDk}/>
              <IconStep window={rules} label="Regeln" icon={<ListChecks size={30}/>} color="#F79009"/>
              <IconStep window={tools} label="Erlaubte Tools" icon={<Wrench size={30}/>} color="#2E90FA"/>
            </div>
          </Card>
        </EnterOnly>
        <EnterOnly startFrame={permission.visualStartFrame} style={{position: 'absolute', left: 110, right: 110, top: 650}}>
          <Card style={{padding: 24, display: 'grid', gridTemplateColumns: '62px 1fr', gap: 16, alignItems: 'center', border: '1px solid rgba(240,68,56,.18)'}}><div style={{width: 58, height: 58, borderRadius: 18, display: 'grid', placeItems: 'center', background: '#F0443812', color: '#F04438'}}><LockKeyhole size={30}/></div><div><div style={{fontSize: 25, fontWeight: 950}}>Berechtigungen</div><div style={{fontSize: 19, opacity: .58, marginTop: 4}}>begrenzen Aktionen</div></div></Card>
        </EnterOnly>
        <EnterOnly startFrame={limits.visualStartFrame} style={{position: 'absolute', left: 160, right: 160, top: 865}}>
          <Card style={{padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: accent, fontSize: 24, fontWeight: 950}}><ShieldCheck size={30}/> Klare Grenzen</Card>
        </EnterOnly>
      </div>
    </Shell>
  );
};

const Scene5: React.FC<SceneProps> = ({sceneId, accent}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's5-headline');
  const goal = choreography.local(sceneId, 's5-goal');
  const plan = choreography.local(sceneId, 's5-plan');
  const tool = choreography.local(sceneId, 's5-tool');
  const check = choreography.local(sceneId, 's5-check');
  const loop = choreography.local(sceneId, 's5-loop');
  const action = choreography.local(sceneId, 's5-action');
  const progress = interpolate(frame, [goal.visualStartFrame, Math.max(goal.visualStartFrame + 1, loop.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="05 • WORKFLOW" seed={22}>
      <TimedBeat window={headline}><Headline size={66}>So sieht der Ablauf aus.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <EnterOnly startFrame={Math.max(0, headline.enterEndFrame - 2)} style={{position: 'absolute', left: 20, right: 20, top: 85}}>
          <Card style={{padding: 28}}>
            <div style={{display: 'grid', gap: 13}}>
              <IconStep window={goal} label="Ziel" icon={<Target size={28}/>} color={accent}/>
              <IconStep window={plan} label="Plan" icon={<ListChecks size={28}/>} color={accent}/>
              <IconStep window={tool} label="Tool" icon={<Wrench size={28}/>} color={accent}/>
              <IconStep window={check} label="Check" icon={<Search size={28}/>} color={accent}/>
              <IconStep window={loop} label="Loop" icon={<RefreshCcw size={28}/>} color={accent}/>
            </div>
            <div style={{marginTop: 24}}><StoryProgressRail progress={progress} accent={accent} height={12}/></div>
          </Card>
        </EnterOnly>
        <EnterOnly startFrame={action.visualStartFrame} style={{position: 'absolute', left: 235, right: 235, bottom: 58}}><Card style={{padding: '18px 22px', textAlign: 'center'}}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 24, fontWeight: 950}}><MousePointer2 color={accent} size={28}/> Chat <ArrowRight size={24}/> Aktion</div></Card></EnterOnly>
      </div>
    </Shell>
  );
};

const Scene6: React.FC<SceneProps> = ({sceneId, accent}) => {
  const headline = choreography.local(sceneId, 's6-headline');
  const result = choreography.local(sceneId, 's6-result');
  const actions = choreography.local(sceneId, 's6-actions');
  const control = choreography.local(sceneId, 's6-control');
  const protocol = choreography.local(sceneId, 's6-protocol');
  const approval = choreography.local(sceneId, 's6-approval');
  return (
    <Shell accent={accent} eyebrow="06 • ERGEBNIS" seed={27}>
      <TimedBeat window={headline}><Headline size={66}>Nicht nur Antwort. Fertige Arbeit.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 28}}>
        <EnterOnly startFrame={result.visualStartFrame} style={{position: 'absolute', left: 70, right: 70, top: 55}}>
          <Card style={{padding: 32}}><div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, fontWeight: 900, color: accent}}><FileText/> ARBEITSERGEBNIS</div><div style={{display: 'grid', gap: 14, marginTop: 24}}>{['3 Anbieter gefunden','Angebote strukturiert','Unterschiede zusammengefasst'].map((label) => <div key={label} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, fontWeight: 850, padding: 16, borderRadius: 18, background: '#F7F5FB'}}><CheckCircle2 color="#12B76A"/> {label}</div>)}</div></Card>
        </EnterOnly>
        <EnterOnly startFrame={Math.max(0, control.visualStartFrame - 8)} style={{position: 'absolute', left: 55, right: 55, top: 610}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12}}>
            <IconStep window={control} label="Kontrolle" icon={<ShieldCheck size={26}/>} color={accent} compact/>
            <IconStep window={protocol} label="Protokoll" icon={<Database size={26}/>} color={accent} compact/>
            <IconStep window={approval} label="Freigabe" icon={<LockKeyhole size={26}/>} color={accent} compact/>
          </div>
        </EnterOnly>
        <EnterOnly startFrame={actions.visualStartFrame} style={{position: 'absolute', left: 250, right: 250, top: 885}}>
          <Card style={{padding: 22, textAlign: 'center', color: accent}}><MousePointer2 size={34}/><div style={{fontSize: 29, fontWeight: 950, marginTop: 8}}>KI + AKTION</div></Card>
        </EnterOnly>
        <EnterOnly startFrame={approval.visualStartFrame} style={{position: 'absolute', left: 180, right: 180, top: 1030}}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 20, fontWeight: 900, color: accent}}><Sparkles size={24}/> Autonomie braucht Grenzen.</div></EnterOnly>
      </div>
    </Shell>
  );
};

const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = KI_AGENT_WORKFLOW_CUES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  return <div style={{...REEL_CAPTION_WRAPPER_STYLE, zIndex: 80}}><div style={{...REEL_CAPTION_GLASS_STYLE, fontFamily: FONT}}>{cue.text}</div></div>;
};

export const ReelKIAgentWorkflowChoreographed: React.FC<Props> = ({voiceoverSrc, showCaptions = true, generatedImageSrc, generatedBrollSrc}) => (
  <AbsoluteFill style={{background: BRAND.bgDeep}}>
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc}/> : null}
    {KI_AGENT_WORKFLOW_SCENES.map((scene, index) => {
      const Scene = sceneComponents[index];
      if (!Scene) return null;
      return (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={scene.title}>
          <Scene sceneId={scene.sceneId} duration={scene.endFrame - scene.startFrame} accent={scene.accent} generatedImageSrc={generatedImageSrc} generatedBrollSrc={generatedBrollSrc}/>
        </Sequence>
      );
    })}
    {showCaptions ? <CaptionLayer/> : null}
  </AbsoluteFill>
);
