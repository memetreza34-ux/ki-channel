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

const metricLabel = (value: string | number): string =>
  typeof value === 'number' ? `${value} ms` : String(value);

export const LatencyTunnelRacePrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const content = usePrototypeContent();
  const tunnelReveal = prototypeProgress(frame, 0, 36);
  const race = prototypeProgress(frame, 30, 142);
  const finish = prototypeProgress(frame, 136, 174);
  const slowLatency = getPrototypeValue({
    content,
    key: 'slowLatency',
    fallback: 780,
  });
  const fastLatency = getPrototypeValue({
    content,
    key: 'fastLatency',
    fallback: 340,
  });
  const tunnels = [
    {
      label: getPrototypeLabel({
        content,
        key: 'slowPath',
        fallback: 'SERIELL',
      }),
      y: 390,
      color: '#FF5D6C',
      delay: 0.2,
      finalValue: slowLatency,
    },
    {
      label: getPrototypeLabel({
        content,
        key: 'fastPath',
        fallback: 'PARALLEL',
      }),
      y: 680,
      color: '#35C58A',
      delay: 0,
      finalValue: fastLatency,
    },
  ] as const;
  const requestLabel = getPrototypeLabel({
    content,
    key: 'requestLabel',
    fallback: content?.meaningContract.subjectTerms[0] ?? 'IDENTISCHE REQUESTS',
  });
  const benchmarkLabel = getPrototypeLabel({
    content,
    key: 'benchmarkLabel',
    fallback: 'LATENCY BENCHMARK',
  });
  const bottleneckLabel = getPrototypeLabel({
    content,
    key: 'bottleneckLabel',
    fallback: content?.meaningContract.resultTerms.find((term) =>
      /engpass|latenz|kapazitat/i.test(term),
    ) ?? 'ENGPÄSSE',
  });
  const optimizedLabel = getPrototypeLabel({
    content,
    key: 'optimizedLabel',
    fallback: tunnels[1].label,
  });

  return (
    <PrototypeShell
      family="SCALE PERFORMANCE"
      title="Latency Tunnel Race"
      subtitle="Gleiche Anfragen laufen durch zwei Architekturen — Engpässe machen den Unterschied sichtbar."
    >
      <GlassSurface style={{position: 'absolute', left: 72, right: 72, top: 390, bottom: 190, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 48, right: 48, top: 64, display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 18, fontWeight: 900, letterSpacing: 2, color: PROTOTYPE_PALETTE.muted}}>
          <span>{requestLabel.toLocaleUpperCase('de-DE')}</span>
          <span>{benchmarkLabel.toLocaleUpperCase('de-DE')}</span>
        </div>

        {tunnels.map((tunnel, index) => {
          const effective = Math.max(0, Math.min(1, (race - tunnel.delay) / (1 - tunnel.delay)));
          const eased = index === 0
            ? interpolate(effective, [0, 0.34, 0.65, 1], [0, 0.28, 0.45, 1])
            : interpolate(effective, [0, 0.4, 1], [0, 0.52, 1]);
          const x = interpolate(eased, [0, 1], [118, 820]);
          const finalNumeric = typeof tunnel.finalValue === 'number'
            ? tunnel.finalValue
            : index === 0
              ? 780
              : 340;
          const elapsed = Math.round(interpolate(eased, [0, 1], [0, finalNumeric]));
          return (
            <React.Fragment key={tunnel.label}>
              <div style={{position: 'absolute', left: 86, right: 86, top: tunnel.y - 82, height: 164, borderRadius: 82, background: `linear-gradient(90deg, ${tunnel.color}12, rgba(255,255,255,.82), ${tunnel.color}18)`, border: `5px solid ${tunnel.color}55`, boxShadow: `inset 0 0 44px ${tunnel.color}20`, opacity: tunnelReveal, overflow: 'hidden'}}>
                {Array.from({length: 8}, (_, ring) => (
                  <div key={ring} style={{position: 'absolute', left: 45 + ring * 96, top: 16, bottom: 16, width: 4, borderRadius: 999, background: `${tunnel.color}35`, transform: `skewX(${ring % 2 === 0 ? -10 : 10}deg)`}} />
                ))}
                {index === 0 ? (
                  <>
                    <div style={{position: 'absolute', left: 315, top: 0, bottom: 0, width: 85, background: 'rgba(255,182,72,.20)', borderLeft: '3px solid rgba(255,182,72,.5)', borderRight: '3px solid rgba(255,182,72,.5)'}} />
                    <div style={{position: 'absolute', left: 510, top: 0, bottom: 0, width: 105, background: 'rgba(255,93,108,.15)', borderLeft: '3px solid rgba(255,93,108,.45)', borderRight: '3px solid rgba(255,93,108,.45)'}} />
                  </>
                ) : null}
              </div>

              <div style={{position: 'absolute', left: 100, top: tunnel.y - 145, maxWidth: 300, padding: '11px 17px', borderRadius: 16, background: 'rgba(255,255,255,.94)', border: `2px solid ${tunnel.color}55`, color: tunnel.color, fontSize: tunnel.label.length > 14 ? 15 : 19, fontWeight: 900, letterSpacing: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{tunnel.label.toLocaleUpperCase('de-DE')}</div>
              <div style={{position: 'absolute', right: 95, top: tunnel.y - 145, fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: tunnel.color}}>{elapsed} ms</div>

              <div style={{position: 'absolute', left: x, top: tunnel.y, width: 62, height: 62, borderRadius: index === 0 ? 18 : 999, background: tunnel.color, border: '7px solid white', boxShadow: `0 0 34px ${tunnel.color}66`, transform: `translate(-50%, -50%) rotate(${index === 0 ? race * 360 : 0}deg)`, zIndex: 8}} />
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 820, top: 260, bottom: 210, width: 14, borderRadius: 999, background: `repeating-linear-gradient(180deg, ${PROTOTYPE_PALETTE.foreground} 0 22px, white 22px 44px)`, boxShadow: '0 0 22px rgba(20,18,26,.2)', opacity: tunnelReveal}} />

        <div style={{position: 'absolute', left: 115, right: 115, bottom: 54, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, opacity: finish, transform: `translateY(${(1 - finish) * 48}px)`}}>
          <div style={{padding: '22px 24px', borderRadius: 26, background: 'rgba(255,93,108,.09)', border: '2px solid rgba(255,93,108,.3)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, color: PROTOTYPE_PALETTE.danger, letterSpacing: 2}}>{bottleneckLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>{metricLabel(slowLatency)}</div>
          </div>
          <div style={{padding: '22px 24px', borderRadius: 26, background: 'rgba(53,197,138,.10)', border: '2px solid rgba(53,197,138,.34)', textAlign: 'center'}}>
            <div style={{fontSize: 19, fontWeight: 900, color: PROTOTYPE_PALETTE.success, letterSpacing: 2}}>{optimizedLabel.toLocaleUpperCase('de-DE')}</div>
            <div style={{marginTop: 10, fontSize: 27, fontWeight: 900}}>{metricLabel(fastLatency)}</div>
          </div>
        </div>
      </GlassSurface>
    </PrototypeShell>
  );
};
