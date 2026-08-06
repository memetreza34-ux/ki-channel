import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  BoundaryGate,
  CapacityMeter,
  ContextWindow,
  MessageCard,
  Rail,
  SceneShell,
  StateBadge,
  clampProgress,
} from './components';
import {localBeatFrame, localResultFrame, type ContextSceneId} from './sync';
import {contextPalette, contextShadows} from './style';

const beatProgress = (sceneId: ContextSceneId, beatId: string, frame: number): number =>
  clampProgress(frame, localBeatFrame(sceneId, beatId), localResultFrame(sceneId, beatId));

export const Scene01Forgetting: React.FC = () => {
  const frame = useCurrentFrame();
  const forget = beatProgress('scene-01', 's1-forgets', frame);
  const windowBeat = beatProgress('scene-01', 's1-window', frame);
  const railOffset = interpolate(forget, [0, 1], [120, -420]);
  const ghostOpacity = clampProgress(forget, 0.55, 1);

  return (
    <SceneShell title="Warum verschwinden frühere Nachrichten?">
      <ContextWindow emphasis={0.45 + windowBeat * 0.55}>
        <BoundaryGate left={42} top={106} height={520} progress={forget} label="NICHT SICHTBAR" />
        <Rail left={-160} top={280} width={1750} offsetX={railOffset} gap={46}>
          <MessageCard width={360} height={205} tone="danger" label="FRÜHERE REGEL" sublabel="wichtig für die Aufgabe" opacity={1 - forget * 0.72} blurPx={forget * 3.5} />
          <MessageCard width={360} height={205} tone="active" label="AKTUELLE AUFGABE" />
          <MessageCard width={360} height={205} tone="dark" label="NEUE NACHRICHT" />
        </Rail>
        <StateBadge text="NUR SICHTBARER INHALT IST AKTIV" tone="accent" visible={windowBeat} style={{position: 'absolute', left: 210, bottom: 56}} />
      </ContextWindow>
      <MessageCard
        width={300}
        height={170}
        tone="danger"
        label="FRÜHERE REGEL"
        opacity={ghostOpacity * 0.68}
        blurPx={3 + ghostOpacity * 3}
        style={{position: 'absolute', left: -225, top: 350, transform: `translateX(${interpolate(ghostOpacity, [0, 1], [100, 0])}px) scale(0.88)`}}
      />
    </SceneShell>
  );
};

export const Scene02LimitedSlice: React.FC = () => {
  const frame = useCurrentFrame();
  const band = beatProgress('scene-02', 's2-band', frame);
  const slice = beatProgress('scene-02', 's2-slice', frame);
  const offset = interpolate(band, [0, 1], [190, -180]);
  const cards = ['START', 'NAME', 'REGEL', 'DATEI', 'AUFGABE', 'ANTWORT', 'KORREKTUR', 'NEU'];

  return (
    <SceneShell title="Der Chat ist länger als der sichtbare Ausschnitt">
      <div style={{position: 'absolute', inset: 0}}>
        <Rail left={-520} top={315} width={2380} offsetX={offset} gap={34}>
          {cards.map((label, index) => {
            const active = index >= 3 && index <= 5;
            return (
              <MessageCard
                key={label}
                width={250}
                height={170}
                tone={active ? 'active' : 'inactive'}
                label={label}
                opacity={active ? 1 : 0.25 + (1 - slice) * 0.45}
                blurPx={active ? 0 : slice * 3}
                scale={0.92 + band * 0.08}
              />
            );
          })}
        </Rail>
        <ContextWindow left={268} top={92} width={508} height={690} emphasis={slice} overflowHidden={false} label="SICHTBARER AUSSCHNITT">
          <div style={{position: 'absolute', inset: 0, background: `rgba(109,58,219,${0.04 + slice * 0.08})`}} />
        </ContextWindow>
        <div style={{position: 'absolute', left: 18, top: 630, fontSize: 23, fontWeight: 950, color: contextPalette.muted, opacity: slice}}>VORHER</div>
        <div style={{position: 'absolute', right: 18, top: 630, fontSize: 23, fontWeight: 950, color: contextPalette.muted, opacity: slice}}>SPÄTER</div>
        <StateBadge text="NUR EIN TEIL IST GLEICHZEITIG SICHTBAR" visible={slice} style={{position: 'absolute', left: 275, bottom: 38}} />
      </div>
    </SceneShell>
  );
};

export const Scene03WindowMoves: React.FC = () => {
  const frame = useCurrentFrame();
  const message = beatProgress('scene-03', 's3-message', frame);
  const shift = beatProgress('scene-03', 's3-shift', frame);
  const windowLeft = interpolate(shift, [0, 1], [60, 454]);
  const newCardX = interpolate(message, [0, 1], [300, 0]);
  const labels = ['ALT', 'REGEL', 'AUFGABE', 'AKTUELL', 'NEU'];

  return (
    <SceneShell title="Neue Nachrichten verschieben das Kontextfenster">
      <div style={{position: 'absolute', inset: 0}}>
        <Rail left={-70} top={325} width={1500} offsetX={0} gap={34}>
          {labels.map((label, index) => (
            <MessageCard
              key={label}
              width={255}
              height={170}
              tone={index === 4 ? 'dark' : index < 2 ? 'inactive' : 'active'}
              label={label}
              opacity={index === 4 ? message : 1}
              style={index === 4 ? {transform: `translateX(${newCardX}px) scale(${0.9 + message * 0.1})`} : undefined}
            />
          ))}
        </Rail>
        <ContextWindow left={windowLeft} top={120} width={520} height={620} emphasis={0.45 + shift * 0.55} overflowHidden={false} label="AKTIVER BEREICH" />
        <svg viewBox="0 0 1012 800" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
          <path d="M190 720 C350 770 620 770 820 720" fill="none" stroke={contextPalette.accent} strokeWidth="18" strokeLinecap="round" strokeDasharray="760" strokeDashoffset={760 * (1 - shift)} />
          <path d="M800 690 L840 720 L800 750" fill="none" stroke={contextPalette.accent} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity={shift} />
        </svg>
        <StateBadge text="DAS FENSTER WANDERT NACH VORN" visible={shift} style={{position: 'absolute', left: 305, bottom: 20}} />
      </div>
    </SceneShell>
  );
};

export const Scene04OldContentLeaves: React.FC = () => {
  const frame = useCurrentFrame();
  const out = beatProgress('scene-04', 's4-out', frame);
  const unavailable = beatProgress('scene-04', 's4-unavailable', frame);
  const oldX = interpolate(out, [0, 1], [475, 30]);

  return (
    <SceneShell title="Alte Nachrichten rutschen über die Grenze">
      <div style={{position: 'absolute', inset: 0}}>
        <BoundaryGate left={420} top={64} height={700} progress={1} label="GRENZE" />
        <ContextWindow left={430} top={54} width={554} height={720} emphasis={unavailable} label="AKTUELLER KONTEXT">
          <MessageCard width={370} height={220} tone="active" label="AKTUELLE FRAGE" style={{position: 'absolute', left: 90, top: 155}} />
          <div style={{position: 'absolute', left: 105, right: 105, top: 455, display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{height: 26, borderRadius: 99, background: contextPalette.accent, opacity: 0.65}} />
            <div style={{height: 26, width: '72%', borderRadius: 99, background: contextPalette.lineStrong, opacity: 0.7}} />
          </div>
          <StateBadge text="NICHT MEHR VERFÜGBAR" tone="danger" visible={unavailable} style={{position: 'absolute', left: 105, bottom: 62}} />
        </ContextWindow>
        <MessageCard
          width={390}
          height={230}
          tone="danger"
          label="FRÜHERE REGEL"
          sublabel="für die nächste Antwort wichtig"
          opacity={1 - out * 0.62}
          blurPx={out * 4}
          style={{position: 'absolute', zIndex: 30, left: oldX, top: 250, transform: `scale(${1 - out * 0.08})`}}
        />
        <div style={{position: 'absolute', zIndex: 35, left: 342, top: 348, width: 82, height: 18, background: contextPalette.danger, transform: `scaleX(${out})`, transformOrigin: 'right', borderRadius: 99}} />
      </div>
    </SceneShell>
  );
};

export const Scene05CapacityFills: React.FC = () => {
  const frame = useCurrentFrame();
  const text = beatProgress('scene-05', 's5-text', frame);
  const files = beatProgress('scene-05', 's5-files', frame);
  const answer = beatProgress('scene-05', 's5-answer', frame);
  const fill = Math.min(1, text * 0.38 + files * 0.28 + answer * 0.34);
  const oldLift = interpolate(fill, [0, 1], [0, -360]);

  return (
    <SceneShell title="Lange Inhalte füllen den verfügbaren Platz">
      <ContextWindow emphasis={fill} label="KONTEXT-KAPAZITÄT">
        <MessageCard
          width={330}
          height={155}
          tone="danger"
          label="FRÜHERE INFO"
          opacity={1 - fill * 0.78}
          style={{position: 'absolute', left: 118, top: 135, transform: `translateY(${oldLift}px) scale(${1 - fill * 0.08})`}}
        />
        <div style={{position: 'absolute', left: 95, right: 150, bottom: 68, height: 520, display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <div style={{width: 250, height: 430 * text, minHeight: 2, borderRadius: 34, background: contextPalette.accentSoft, border: `4px solid ${contextPalette.accent}`, boxShadow: contextShadows.accent, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 29, fontWeight: 970, color: contextPalette.accentDark, opacity: text}}>LANGER TEXT</div>
          </div>
          <div style={{width: 190, height: 320 * files, minHeight: 2, borderRadius: 34, background: contextPalette.warningSoft, border: `4px solid ${contextPalette.warning}`, boxShadow: contextShadows.soft, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 970, color: contextPalette.warning, opacity: files}}>DATEIEN</div>
          </div>
          <div style={{width: 260, height: 470 * answer, minHeight: 2, borderRadius: 34, background: answer > 0.82 ? contextPalette.dangerSoft : contextPalette.surface, border: `4px solid ${answer > 0.82 ? contextPalette.danger : contextPalette.accent}`, boxShadow: answer > 0.82 ? contextShadows.danger : contextShadows.accent, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 970, color: answer > 0.82 ? contextPalette.dangerDark : contextPalette.accentDark, opacity: answer, textAlign: 'center'}}>LANGE<br />ANTWORT</div>
          </div>
        </div>
        <CapacityMeter fill={fill} />
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene06MissingDetails: React.FC = () => {
  const frame = useCurrentFrame();
  const details = beatProgress('scene-06', 's6-details', frame);
  const visible = beatProgress('scene-06', 's6-visible', frame);
  const beamEnd = interpolate(visible, [0, 1], [780, 430]);

  return (
    <SceneShell title="Fehlende Details liegen außerhalb des Fensters">
      <div style={{position: 'absolute', inset: 0}}>
        <MessageCard
          width={360}
          height={330}
          tone="danger"
          label="FRÜHERE DETAILS"
          sublabel="NAME · REGEL · ENTSCHEIDUNG"
          opacity={0.42 + details * 0.38}
          blurPx={visible * 2.5}
          style={{position: 'absolute', left: 24, top: 220}}
        />
        <BoundaryGate left={420} top={70} height={690} progress={1} label="NICHT IM FENSTER" />
        <ContextWindow left={430} top={58} width={554} height={720} emphasis={visible} label="SICHTBARER TEIL">
          <MessageCard width={370} height={220} tone="active" label="AKTUELLE ANTWORT" style={{position: 'absolute', left: 92, top: 175}} />
          <div style={{position: 'absolute', left: 120, top: 475, width: 310, height: 34, borderRadius: 99, background: contextPalette.dangerSoft, border: `3px solid ${contextPalette.danger}`, opacity: visible}} />
          <StateBadge text="DETAIL FEHLT" tone="danger" visible={visible} style={{position: 'absolute', left: 150, bottom: 70}} />
        </ContextWindow>
        <svg viewBox="0 0 1012 820" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d={`M820 430 C690 430 560 430 ${beamEnd} 430`} fill="none" stroke={contextPalette.accent} strokeWidth="18" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - details)} />
          <circle cx="430" cy="430" r={22 + visible * 8} fill={contextPalette.danger} opacity={visible} />
          <path d="M405 405 L455 455 M455 405 L405 455" stroke="white" strokeWidth="9" strokeLinecap="round" opacity={visible} />
        </svg>
      </div>
    </SceneShell>
  );
};

export const Scene07KeepImportantVisible: React.FC = () => {
  const frame = useCurrentFrame();
  const summary = beatProgress('scene-07', 's7-summary', frame);
  const repeat = beatProgress('scene-07', 's7-repeat', frame);
  const sections = beatProgress('scene-07', 's7-sections', frame);
  const stackSpread = interpolate(summary, [0, 1], [1, 0]);

  return (
    <SceneShell title="Verdichte und ordne den wichtigen Kontext">
      <ContextWindow emphasis={0.45 + sections * 0.55} label="AKTIVER PROJEKTKONTEXT">
        {[0, 1, 2].map((index) => (
          <MessageCard
            key={index}
            width={350}
            height={190}
            tone="inactive"
            opacity={(1 - summary) * 0.78}
            style={{position: 'absolute', left: 95 + index * 95 * stackSpread, top: 150 + index * 54 * stackSpread, transform: `rotate(${(-5 + index * 5) * stackSpread}deg) scale(${1 - summary * 0.14})`}}
          />
        ))}
        <MessageCard width={390} height={210} tone="success" label="KURZE ZUSAMMENFASSUNG" opacity={summary} style={{position: 'absolute', left: 80, top: 235, transform: `scale(${0.88 + summary * 0.12})`}} />
        <MessageCard width={390} height={210} tone="active" label="ZENTRALE VORGABE" opacity={repeat} style={{position: 'absolute', right: 80, top: 235, transform: `translateY(${(1 - repeat) * -80}px) scale(${0.88 + repeat * 0.12})`}} />
        <div style={{position: 'absolute', left: 78, right: 78, bottom: 80, display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 18, opacity: sections, transform: `translateY(${(1 - sections) * 38}px)`}}>
          {['TEIL 1', 'AKTUELL', 'TEIL 3'].map((label, index) => (
            <div key={label} style={{height: 88, borderRadius: 26, border: `3px solid ${index === 1 ? contextPalette.accent : contextPalette.lineStrong}`, background: index === 1 ? contextPalette.accent : contextPalette.surfaceMuted, color: index === 1 ? '#FFFFFF' : contextPalette.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 970}}>{label}</div>
          ))}
        </div>
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene08VisibleContextCounts: React.FC = () => {
  const frame = useCurrentFrame();
  const context = beatProgress('scene-08', 's8-context', frame);
  const intent = beatProgress('scene-08', 's8-intent', frame);
  const visible = beatProgress('scene-08', 's8-visible', frame);
  const leftX = interpolate(context, [0, 1], [-340, 0]);
  const rightX = interpolate(context, [0, 1], [340, 0]);
  const topY = interpolate(context, [0, 1], [-260, 0]);

  return (
    <SceneShell title="Nur der aktive Kontext kann die Antwort steuern">
      <ContextWindow left={80} top={40} width={884} height={760} emphasis={visible} label="SICHTBARER KONTEXT">
        <MessageCard width={620} height={165} tone="success" label="ZUSAMMENFASSUNG" opacity={context} style={{position: 'absolute', left: 126, top: 120, transform: `translateX(${leftX}px) scale(${0.9 + context * 0.1})`}} />
        <MessageCard width={620} height={165} tone="active" label="ZENTRALE VORGABE" opacity={context} style={{position: 'absolute', left: 126, top: 315, transform: `translateY(${topY}px) scale(${0.9 + context * 0.1})`}} />
        <MessageCard width={620} height={165} tone="dark" label="AKTUELLE AUFGABE" opacity={context} style={{position: 'absolute', left: 126, top: 510, transform: `translateX(${rightX}px) scale(${0.9 + context * 0.1})`}} />
        <div style={{position: 'absolute', right: 36, top: 32, width: 126, height: 58, borderRadius: 999, border: `3px solid ${contextPalette.danger}`, background: contextPalette.dangerSoft, opacity: intent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 970, color: contextPalette.danger}}>ABSICHT ×</div>
        <div style={{position: 'absolute', inset: 20, borderRadius: 42, border: `5px solid ${contextPalette.success}`, boxShadow: contextShadows.success, opacity: visible}} />
        <StateBadge text="DER RELEVANTE TEIL MUSS SICHTBAR SEIN" tone="success" visible={visible} style={{position: 'absolute', left: 185, bottom: 38}} />
      </ContextWindow>
    </SceneShell>
  );
};

export const CONTEXT_SCENE_COMPONENTS = {
  'scene-01': Scene01Forgetting,
  'scene-02': Scene02LimitedSlice,
  'scene-03': Scene03WindowMoves,
  'scene-04': Scene04OldContentLeaves,
  'scene-05': Scene05CapacityFills,
  'scene-06': Scene06MissingDetails,
  'scene-07': Scene07KeepImportantVisible,
  'scene-08': Scene08VisibleContextCounts,
} satisfies Record<ContextSceneId, React.FC>;
