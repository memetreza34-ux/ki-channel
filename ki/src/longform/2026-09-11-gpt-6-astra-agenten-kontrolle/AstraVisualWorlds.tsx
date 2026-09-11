import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {SkiaCanvas} from '@remotion/skia';
import {Circle as SkiaCircle, Fill} from '@shopify/react-native-skia';
import {ASTRA_COLORS, ASTRA_FONT_STACK, ASTRA_LAYOUT, accentColor} from './design';
import type {AstraTimedBeat} from './types';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const WorldShell: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: 'PURPLE' | 'RISK' | 'POSITIVE' | 'NEUTRAL';
}> = ({eyebrow, title, children, accent = 'PURPLE'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 22, stiffness: 140, mass: 0.9}});
  return (
    <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.background, fontFamily: ASTRA_FONT_STACK, color: ASTRA_COLORS.ink}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 18%, rgba(185,140,255,0.16), transparent 34%)'}} />
      <div style={{position: 'absolute', left: ASTRA_LAYOUT.edge, right: ASTRA_LAYOUT.edge, top: 76, opacity: enter}}>
        <div style={{fontSize: 24, fontWeight: 800, letterSpacing: 2.2, color: accentColor(accent), textTransform: 'uppercase'}}>{eyebrow}</div>
        <div style={{fontSize: 66, lineHeight: 1.02, fontWeight: 850, maxWidth: ASTRA_LAYOUT.titleMax, marginTop: 12}}>{title}</div>
      </div>
      <div style={{position: 'absolute', left: ASTRA_LAYOUT.edge, right: ASTRA_LAYOUT.edge, top: 238, bottom: 76}}>{children}</div>
    </AbsoluteFill>
  );
};

const Pill: React.FC<{children: React.ReactNode; tone?: 'PURPLE' | 'RISK' | 'POSITIVE' | 'NEUTRAL'}> = ({children, tone = 'PURPLE'}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', padding: '12px 18px', borderRadius: 999, backgroundColor: `${accentColor(tone)}16`, color: accentColor(tone), border: `1px solid ${accentColor(tone)}33`, fontSize: 24, fontWeight: 780}}>{children}</div>
);

const SourceProof: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 20, stiffness: 150}});
  const focus = interpolate(frame, [12, 48], [0.1, 1], clamp);
  if (!beat.assetStaticPath) throw new Error(`Source proof missing approved local asset: ${beat.id}`);
  return (
    <WorldShell eyebrow="Originalquelle" title={beat.headline || 'Echte Quelle statt Mockup'} accent={beat.accent}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1.42fr 0.58fr', gap: 38, alignItems: 'stretch'}}>
        <div style={{position: 'relative', borderRadius: 30, overflow: 'hidden', backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${ASTRA_COLORS.line}`, boxShadow: '0 28px 70px rgba(26,26,46,0.12)', scale: 0.96 + reveal * 0.04}}>
          <Img src={staticFile(beat.assetStaticPath)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', left: `${8 + (1-focus)*10}%`, right: `${8 + (1-focus)*10}%`, top: '50%', height: 6, borderRadius: 999, backgroundColor: accentColor(beat.accent), boxShadow: `0 0 0 ${10 + focus*10}px ${accentColor(beat.accent)}18`}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24}}>
          <Pill tone={beat.accent}>{beat.sourceLabel || 'verified source'}</Pill>
          <div style={{fontSize: 38, lineHeight: 1.18, fontWeight: 760}}>{beat.subline || 'Reale Aussage wird mit der Originalquelle belegt.'}</div>
          <div style={{fontSize: 22, lineHeight: 1.45, color: ASTRA_COLORS.muted}}>Lokaler Screenshot · SHA-gebunden · keine generierte Produkt-UI</div>
        </div>
      </div>
    </WorldShell>
  );
};

const AgentWorkspace: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = ['Ziel', 'Research', 'Browser', 'Datei', 'Code', 'Tool', 'Review', 'Ergebnis'];
  return (
    <WorldShell eyebrow="Agentic Work" title={beat.headline || 'Aus einer Antwort wird ein Arbeitsablauf'}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
        <div style={{position: 'relative', width: '100%', height: 420}}>
          <div style={{position: 'absolute', left: 60, right: 60, top: 207, height: 4, backgroundColor: ASTRA_COLORS.line, borderRadius: 99}} />
          {nodes.map((node, index) => {
            const local = frame - index * 9;
            const enter = spring({fps, frame: Math.max(0, local), config: {damping: 18, stiffness: 160}});
            const x = 60 + index * ((1510) / (nodes.length - 1));
            const active = local > 8;
            return (
              <div key={node} style={{position: 'absolute', left: x, top: 210, translate: '-50% -50%', opacity: enter, scale: 0.82 + enter * 0.18}}>
                <div style={{width: 122, height: 122, borderRadius: 34, backgroundColor: active ? ASTRA_COLORS.softPurple : ASTRA_COLORS.surface, border: `2px solid ${active ? ASTRA_COLORS.lavender : ASTRA_COLORS.line}`, display: 'grid', placeItems: 'center', boxShadow: active ? '0 18px 42px rgba(110,69,201,0.13)' : 'none'}}>
                  <div style={{width: 20, height: 20, borderRadius: 99, backgroundColor: active ? ASTRA_COLORS.purple : ASTRA_COLORS.line}} />
                </div>
                <div style={{fontSize: 24, fontWeight: 760, textAlign: 'center', marginTop: 16, whiteSpace: 'nowrap'}}>{node}</div>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 60, top: 350, fontSize: 28, color: ASTRA_COLORS.muted}}>{beat.subline || 'Je länger die Kette, desto wichtiger werden Rechte, Logs und Freigaben.'}</div>
        </div>
      </div>
    </WorldShell>
  );
};

const BenchmarkLab: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scores = [
    {value: '98%', label: 'FrontierMath Tier 4'},
    {value: '99,9%', label: 'ARC-AGI-3'},
    {value: '100%', label: 'ExploitBench'},
  ];
  const zoomOut = interpolate(frame, [40, 100], [0, 1], clamp);
  return (
    <WorldShell eyebrow="Benchmark Lab" title={beat.headline || 'Extrem hohe Werte – aber nur in engen Messfenstern'}>
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, scale: 1 - zoomOut * 0.08, translate: `0 ${zoomOut * -30}px`}}>
          {scores.map((score, index) => {
            const enter = spring({fps, frame: Math.max(0, frame - index * 8), config: {damping: 18, stiffness: 150}});
            return (
              <div key={score.label} style={{height: 310, borderRadius: 30, backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${ASTRA_COLORS.line}`, padding: 34, opacity: enter, scale: 0.9 + enter * 0.1}}>
                <div style={{fontSize: 96, fontWeight: 900, letterSpacing: -5, color: ASTRA_COLORS.purple}}>{score.value}</div>
                <div style={{fontSize: 27, fontWeight: 760, marginTop: 20}}>{score.label}</div>
                <div style={{fontSize: 20, color: ASTRA_COLORS.muted, marginTop: 8}}>OpenAI reported</div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 170, right: 170, bottom: 12, height: 168, borderRadius: 32, border: `2px dashed ${ASTRA_COLORS.line}`, backgroundColor: `rgba(255,255,255,${0.35 + zoomOut * 0.6})`, opacity: zoomOut, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 44px'}}>
          <div style={{fontSize: 34, fontWeight: 800}}>Realwelt</div>
          <div style={{fontSize: 26, color: ASTRA_COLORS.muted}}>unklare Inputs · kaputte Dateien · Rechte · dynamische Websites · widersprüchliche Daten</div>
        </div>
      </div>
    </WorldShell>
  );
};

const AccessCore: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 24;
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 7, 6]} intensity={2.4} />
      <mesh rotation={[0.2 + Math.sin(t) * 0.08, t * 0.22, 0.1]}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial color={ASTRA_COLORS.purple} roughness={0.35} metalness={0.15} />
      </mesh>
      {[[-3.1, 1.8, 0], [3.1, 1.8, 0], [-3.1, -1.8, 0], [3.1, -1.8, 0]].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} scale={0.65 + Math.sin(t + index) * 0.05}>
          <boxGeometry args={[1.25, 0.7, 0.34]} />
          <meshStandardMaterial color={index === 3 ? ASTRA_COLORS.risk : ASTRA_COLORS.lavender} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
};

const AccessArchitecture: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame, config: {damping: 20, stiffness: 120}});
  return (
    <WorldShell eyebrow="Access Architecture" title={beat.headline || 'Fähigkeit ist nur die eine Hälfte – Zugriff ist die andere'} accent="RISK">
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1.22fr 0.78fr', gap: 26}}>
        <div style={{borderRadius: 34, overflow: 'hidden', backgroundColor: '#F2EFFA', border: `1px solid ${ASTRA_COLORS.line}`}}>
          <ThreeCanvas width={1040} height={690} camera={{position: [0, 0, 8.4], fov: 43}}>
            <AccessCore />
          </ThreeCanvas>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18}}>
          {['Network', 'Terminal', 'Files', 'Accounts', 'Tools'].map((label, index) => {
            const on = frame > 14 + index * 12;
            return (
              <div key={label} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderRadius: 22, backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${on ? ASTRA_COLORS.risk : ASTRA_COLORS.line}`, opacity: 0.5 + reveal * 0.5}}>
                <div style={{width: 18, height: 18, borderRadius: 99, backgroundColor: on ? ASTRA_COLORS.risk : ASTRA_COLORS.line}} />
                <div style={{fontSize: 28, fontWeight: 770}}>{label}</div>
                <div style={{marginLeft: 'auto', fontSize: 18, color: on ? ASTRA_COLORS.risk : ASTRA_COLORS.muted}}>{on ? 'ACCESS' : 'LOCKED'}</div>
              </div>
            );
          })}
          <Pill tone="RISK">OpenAI Preparedness Framework · Critical</Pill>
        </div>
      </div>
    </WorldShell>
  );
};

const MonitorabilityRoom: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alignment = interpolate(frame, [0, 90], [0.48, 0.84], clamp);
  const monitorability = interpolate(frame, [0, 90], [0.82, 0.5], clamp);
  const pulse = 1 + Math.sin(frame / 8) * 0.06;
  return (
    <WorldShell eyebrow="Monitorability" title={beat.headline || 'Besser ausgerichtet – und trotzdem schwerer zu überwachen'} accent="RISK">
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 32}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center'}}>
          {[
            {label: 'Alignment', value: alignment, tone: 'POSITIVE' as const},
            {label: 'Monitorability', value: monitorability, tone: 'RISK' as const},
          ].map((metric) => (
            <div key={metric.label} style={{padding: 28, borderRadius: 28, backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${ASTRA_COLORS.line}`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontSize: 30, fontWeight: 800}}>{metric.label}</div>
                <Pill tone={metric.tone}>{Math.round(metric.value * 100)}</Pill>
              </div>
              <div style={{height: 16, backgroundColor: ASTRA_COLORS.line, borderRadius: 99, overflow: 'hidden', marginTop: 24}}>
                <div style={{height: '100%', width: `${metric.value * 100}%`, backgroundColor: accentColor(metric.tone), borderRadius: 99}} />
              </div>
            </div>
          ))}
          <Pill tone="RISK">adversarial evaluation ≠ normales Alltagsverhalten</Pill>
        </div>
        <div style={{position: 'relative', borderRadius: 34, backgroundColor: '#F1EEF9', overflow: 'hidden', border: `1px solid ${ASTRA_COLORS.line}`}}>
          <SkiaCanvas width={820} height={690}>
            <Fill color="#F1EEF9" />
            {[0, 1, 2, 3, 4].map((i) => (
              <SkiaCircle key={i} cx={115 + i * 145} cy={280 + Math.sin(frame / 12 + i) * 42} r={(34 - i * 3) * pulse} color={i < 2 ? ASTRA_COLORS.purple : ASTRA_COLORS.lavender} />
            ))}
          </SkiaCanvas>
          <div style={{position: 'absolute', left: 54, right: 54, bottom: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <div style={{fontSize: 22, color: ASTRA_COLORS.muted}}>sichtbare Begründungsspur</div>
              <div style={{fontSize: 36, fontWeight: 830, marginTop: 6}}>wird kürzer / weniger informativ</div>
            </div>
            <Pill tone="NEUTRAL">no steganographic CoT evidence</Pill>
          </div>
        </div>
      </div>
    </WorldShell>
  );
};

const AgentInfrastructure: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layers = ['Session', 'Tools', 'Files', 'Sandbox', 'Subagents'];
  return (
    <WorldShell eyebrow="Agent Infrastructure" title={beat.headline || 'Das Modell ist nicht die ganze Agenten-Plattform'}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '0.74fr 1.26fr', gap: 34}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
          <div style={{padding: 30, borderRadius: 30, backgroundColor: ASTRA_COLORS.softPurple, border: `2px solid ${ASTRA_COLORS.lavender}`}}>
            <div style={{fontSize: 24, color: ASTRA_COLORS.purple, fontWeight: 800}}>MODEL</div>
            <div style={{fontSize: 48, fontWeight: 900, marginTop: 8}}>GPT-6 Astra</div>
          </div>
          <div style={{height: 2, backgroundColor: ASTRA_COLORS.line}} />
          <div style={{fontSize: 25, lineHeight: 1.42, color: ASTRA_COLORS.muted}}>Agents API ist Infrastruktur für Agenten. Sie wird im Video bewusst nicht als Astra-exklusive API dargestellt.</div>
        </div>
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14}}>
          {layers.map((layer, index) => {
            const enter = spring({fps, frame: Math.max(0, frame - index * 8), config: {damping: 18, stiffness: 150}});
            return (
              <div key={layer} style={{height: 88, borderRadius: 22, backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${ASTRA_COLORS.line}`, display: 'flex', alignItems: 'center', padding: '0 30px', opacity: enter, translate: `${(1-enter)*70}px 0`, boxShadow: '0 12px 30px rgba(26,26,46,0.06)'}}>
                <div style={{fontSize: 28, fontWeight: 820}}>{layer}</div>
                <div style={{marginLeft: 'auto', width: 12, height: 12, borderRadius: 99, backgroundColor: ASTRA_COLORS.positive}} />
              </div>
            );
          })}
        </div>
      </div>
    </WorldShell>
  );
};

const ControlStack: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const controls = ['Least privilege', 'Sandbox', 'Audit log', 'Action limits', 'Approval gate', 'Independent monitor', 'Human review'];
  return (
    <WorldShell eyebrow="Control Stack" title={beat.headline || 'Je mehr wir delegieren, desto größer muss die Architektur darum werden'} accent="POSITIVE">
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 36}}>
        <div style={{display: 'grid', placeItems: 'center'}}>
          <div style={{width: 330, height: 330, borderRadius: 999, backgroundColor: ASTRA_COLORS.softPurple, border: `2px solid ${ASTRA_COLORS.lavender}`, display: 'grid', placeItems: 'center', boxShadow: '0 30px 90px rgba(110,69,201,0.15)'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 22, color: ASTRA_COLORS.purple, fontWeight: 850}}>MODEL</div>
              <div style={{fontSize: 48, fontWeight: 900, marginTop: 8}}>Astra</div>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12}}>
          {controls.map((control, index) => {
            const enter = spring({fps, frame: Math.max(0, frame - index * 7), config: {damping: 18, stiffness: 160}});
            const approval = control === 'Approval gate';
            return (
              <div key={control} style={{height: 72, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', backgroundColor: approval ? ASTRA_COLORS.softRisk : ASTRA_COLORS.surface, border: `1px solid ${approval ? ASTRA_COLORS.risk : ASTRA_COLORS.line}`, opacity: enter, translate: `${(1-enter)*64}px 0`}}>
                <div style={{width: 18, height: 18, borderRadius: 99, backgroundColor: approval ? ASTRA_COLORS.risk : ASTRA_COLORS.positive}} />
                <div style={{fontSize: 26, fontWeight: 790}}>{control}</div>
                {approval ? <div style={{marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: ASTRA_COLORS.risk}}>APPROVAL REQUIRED</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </WorldShell>
  );
};

const RealMedia: React.FC<{beat: AstraTimedBeat; video: boolean}> = ({beat, video}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 120], [1.02, 1.08], clamp);
  if (!beat.assetStaticPath) throw new Error(`Real media beat missing approved local asset: ${beat.id}`);
  return (
    <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.ink, fontFamily: ASTRA_FONT_STACK}}>
      {video ? (
        <OffthreadVideo src={staticFile(beat.assetStaticPath)} muted style={{width: '100%', height: '100%', objectFit: 'cover', scale: zoom}} />
      ) : (
        <Img src={staticFile(beat.assetStaticPath)} style={{width: '100%', height: '100%', objectFit: 'cover', scale: zoom}} />
      )}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(26,26,46,0.72), rgba(26,26,46,0.08) 60%, rgba(26,26,46,0.15))'}} />
      <div style={{position: 'absolute', left: 92, bottom: 76, maxWidth: 950, color: 'white'}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 1.5, opacity: 0.8}}>REAL MEDIA · ILLUSTRATIVE</div>
        <div style={{fontSize: 50, lineHeight: 1.08, fontWeight: 860, marginTop: 10}}>{beat.headline || 'Reale B-Roll als Rhythmuswechsel'}</div>
        {beat.subline ? <div style={{fontSize: 24, lineHeight: 1.4, marginTop: 14, opacity: 0.85}}>{beat.subline}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export const AstraBeatScene: React.FC<{beat: AstraTimedBeat}> = ({beat}) => {
  if (beat.kind === 'SOURCE_PROOF') return <SourceProof beat={beat} />;
  if (beat.kind === 'AGENT_WORKSPACE') return <AgentWorkspace beat={beat} />;
  if (beat.kind === 'BENCHMARK_LAB') return <BenchmarkLab beat={beat} />;
  if (beat.kind === 'ACCESS_ARCHITECTURE') return <AccessArchitecture beat={beat} />;
  if (beat.kind === 'MONITORABILITY_ROOM') return <MonitorabilityRoom beat={beat} />;
  if (beat.kind === 'AGENT_INFRASTRUCTURE') return <AgentInfrastructure beat={beat} />;
  if (beat.kind === 'CONTROL_STACK') return <ControlStack beat={beat} />;
  if (beat.kind === 'REAL_BROLL') return <RealMedia beat={beat} video />;
  return <RealMedia beat={beat} video={false} />;
};
