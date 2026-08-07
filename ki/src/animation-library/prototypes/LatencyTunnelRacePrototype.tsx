import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  getPrototypeLabel,
  getPrototypeValue,
  usePrototypeContent,
} from './PrototypeContentContext';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './PrototypeShell';

const numericLatency = (
  value: string | number,
  fallback: number,
): number => {
  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(',', '.').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const metricLabel = (value: number): string => `${Math.round(value)} ms`;
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const LatencyTunnelRacePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const tunnelReveal = prototypeProgress(frame, 0, 36);
  const race = prototypeProgress(frame, 30, 142);
  const finish = prototypeProgress(frame, 136, 174);
  const firstLatency = numericLatency(
    getPrototypeValue({content, key: 'slowLatency', fallback: 780}),
    780,
  );
  const secondLatency = numericLatency(
    getPrototypeValue({content, key: 'fastLatency', fallback: 340}),
    340,
  );
  const maximumLatency = Math.max(firstLatency, secondLatency);
  const minimumLatency = Math.min(firstLatency, secondLatency);
  const latencyDelta = maximumLatency - minimumLatency;
  const speedup = maximumLatency / minimumLatency;
  const tunnels = [
    {
      label: getPrototypeLabel({content, key: 'slowPath', fallback: 'SERIELL'}),
      y: 390,
      finalValue: firstLatency,
    },
    {
      label: getPrototypeLabel({content, key: 'fastPath', fallback: 'PARALLEL'}),
      y: 680,
      finalValue: secondLatency,
    },
  ].map((tunnel) => ({
    ...tunnel,
    isFaster: tunnel.finalValue === minimumLatency,
    color: tunnel.finalValue === minimumLatency ? '#35C58A' : '#FF5D6C',
  }));
  const fasterTunnel = tunnels.reduce((best, tunnel) =>
    tunnel.finalValue < best.finalValue ? tunnel : best,
  );
  const slowerTunnel = tunnels.reduce((worst, tunnel) =>
    tunnel.finalValue > worst.finalValue ? tunnel : worst,
  );
  const requestLabel = getPrototypeLabel({
    content,
    key: 'requestLabel',
    fallback: content?.meaningContract.subjectTerms[0] ?? 'IDENTISCHE REQUESTS',
  });
  const benchmarkLabel = getPrototypeLabel({content, key: 'benchmarkLabel', fallback: 'LATENCY BENCHMARK'});
  const bottleneckLabel = getPrototypeLabel({
    content,
    key: 'bottleneckLabel',
    fallback: content?.meaningContract.resultTerms.find((term) => /engpass|latenz|kapazitat/i.test(term)) ?? 'LANGSAMER PFAD',
  });
  const optimizedLabel = getPrototypeLabel({
    content,
    key: 'optimizedLabel',
    fallback: fasterTunnel.label,
  });

  return (
    <PrototypeShell
      family="SCALE PERFORMANCE"
      title="Latency Tunnel Race"
      subtitle="Die gleiche Anfrage startet gleichzeitig. Die gemessene Latenz bestimmt direkt, wann jeder Pfad die Ziellinie erreicht."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 48, right: 48, top: 64, display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
          <span>{requestLabel.toLocaleUpperCase('de-DE')}</span>
          <span>{benchmarkLabel.toLocaleUpperCase('de-DE')}</span>
        </div>

        {tunnels.map((tunnel, index) => {
          const progressFromLatency = clamp01(race * (maximumLatency / tunnel.finalValue));
          const x = interpolate(progressFromLatency, [0, 1], [118, 820]);
          const elapsed = Math.min(tunnel.finalValue, race * maximumLatency);
          const finished = progressFromLatency >= 0.999;
          return (
            <React.Fragment key={`${tunnel.label}-${index}`}>
              <div style={{position: 'absolute', left: 86, right: 86, top: tunnel.y - 82, height: 164, borderRadius: 82, background: `linear-gradient(90deg, ${tunnel.color}12, rgba(255,255,255,.82), ${tunnel.color}18)`, border: `5px solid ${tunnel.color}55`, boxShadow: `inset 0 0 44px ${tunnel.color}20`, opacity: tunnelReveal, overflow: 'hidden'}}>
                {Array.from({length: 8}, (_, ring) => (
                  <div key={ring} style={{position: 'absolute', left: 45 + ring * 96, top: 16, bottom: 16, width: 4, borderRadius: 999, background: `${tunnel.color}35`, transform: `skewX(${ring % 2 === 0 ? -10 : 10}deg)`}} />
                ))}
                {!tunnel.isFaster ? (
                  <>
                    <div style={{position: 'absolute', left: 315, top: 0, bottom: 0, width: 85, background: 'rgba(255,182,72,.20)', borderLeft: '3px solid rgba(255,182,72,.5)', borderRight: '3px solid rgba(255,182,72,.5)'}} />
                    <div style={{position: 'absolute', left: 510, top: 0, bottom: 0, width: 105, background: 'rgba(255,93,108,.15)', borderLeft: '3px solid rgba(255,93,108,.45)', borderRight: '3px solid rgba(255,93,108,.45)'}} />
                  </>
                ) : null}
              </div>
              <div style={{position: 'absolute', left: 100, top: tunnel.y - 145, maxWidth: 300, padding: '11px 17px', borderRadius: 16, background: 'rgba(255,255,255,.94)', border: `2px solid ${tunnel.color}55`, color: tunnel.color, fontSize: tunnel.label.length > 14 ? 15 : 19, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{tunnel.label.toLocaleUpperCase('de-DE')}</div>
              <div style={{position: 'absolute', right: 95, top: tunnel.y - 145, fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: tunnel.color}}>{metricLabel(elapsed)}</div>
              <div style={{position: 'absolute', left: x, top: tunnel.y, width: 62, height: 62, borderRadius: tunnel.isFaster ? 999 : 18, background: tunnel.color, border: `7px solid ${finished ? PROTOTYPE_PALETTE.success : 'white'}`, boxShadow: `0 0 34px ${tunnel.color}66`, transform: `translate(-50%, -50%) scale(${finished ? 1.08 : 1})`, zIndex: 8}} />
              {finished ? <div style={{position: 'absolute', left: 710, top: tunnel.y + 58, width: 180, textAlign: 'center', fontSize: 14, fontWeight: 900, letterSpacing: 1.5, color: PROTOTYPE_PALETTE.success}}>ZIEL · {metricLabel(tunnel.finalValue)}</div> : null}
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 820, top: 260, bottom: 210, width: 14, borderRadius: 999, background: `repeating-linear-gradient(180deg, ${PROTOTYPE_PALETTE.foreground} 0 22px, white 22px 44px)`, boxShadow: '0 0 22px rgba(20,18,26,.2)', opacity: tunnelReveal}} />

        <div style={{position: 'absolute', left: 115, right: 115, bottom: 54, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, opacity: finish, transform: `translateY(${(1 - finish) * 48}px)`}}>
          <div style={{padding: '20px 18px', borderRadius: 24, background: 'rgba(255,93,108,.09)', border: '2px solid rgba(255,93,108,.3)', textAlign: 'center'}}>
            <div style={{fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.danger, letterSpacing: 1.5}}>{bottleneckLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 7, fontSize: 14, fontWeight: 900, color: PROTOTYPE_PALETTE.muted}}>{slowerTunnel.label}</div>
            <div style={{marginTop: 7, fontSize: 25, fontWeight: 900}}>{metricLabel(slowerTunnel.finalValue)}</div>
          </div>
          <div style={{padding: '20px 18px', borderRadius: 24, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.34)', textAlign: 'center'}}>
            <div style={{fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.success, letterSpacing: 1.5}}>{optimizedLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 7, fontSize: 14, fontWeight: 900, color: PROTOTYPE_PALETTE.muted}}>{fasterTunnel.label}</div>
            <div style={{marginTop: 7, fontSize: 25, fontWeight: 900}}>{metricLabel(fasterTunnel.finalValue)}</div>
          </div>
          <div style={{padding: '20px 18px', borderRadius: 24, background: 'rgba(135,87,232,.08)', border: '2px solid rgba(135,87,232,.25)', textAlign: 'center'}}>
            <div style={{fontSize: 16, fontWeight: 900, color: PROTOTYPE_PALETTE.accent, letterSpacing: 1.5}}>VORTEIL</div>
            <div style={{marginTop: 9, fontSize: 22, fontWeight: 900}}>−{Math.round(latencyDelta)} ms</div>
            <div style={{marginTop: 5, fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color: PROTOTYPE_PALETTE.muted}}>{speedup.toFixed(2)}× schneller</div>
          </div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
