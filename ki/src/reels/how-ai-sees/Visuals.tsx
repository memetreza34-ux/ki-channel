import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1Pixels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 4,
          transform: `scale(${scale * 2})`,
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const showNumber = frame > 30 + i * 0.5;
          const hue = (i * 137.5) % 360;
          return (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                backgroundColor: `hsl(${hue}, 80%, 50%)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 4,
                opacity: showNumber ? 0.8 : 1,
              }}
            >
              {showNumber ? `[${Math.floor(Math.random() * 255)},...]` : ''}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Scene2Patches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitProgress = spring({ fps, frame: frame - 15, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: splitProgress * 20,
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const highlightFeature = frame > 60 + i * 5;
          return (
            <div
              key={i}
              style={{
                width: 150,
                height: 150,
                backgroundColor: '#1E1E24',
                border: highlightFeature ? '2px solid #00F0FF' : '2px solid #333',
                borderRadius: 12,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.1s',
              }}
            >
              {highlightFeature && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    border: '2px dashed #00F0FF',
                    borderRadius: '50%',
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Scene3Link: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const linkProgress = spring({ fps, frame: frame - 20, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ flexDirection: 'row', padding: 100, justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {['Patch A', 'Patch B', 'Patch C'].map((p, i) => (
          <div key={i} style={{ width: 120, height: 120, backgroundColor: '#333', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24, fontWeight: 'bold' }}>{p}</div>
        ))}
      </div>
      
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <path d="M 300 400 Q 540 400 780 400" stroke="#00F0FF" strokeWidth={8} fill="none" strokeDasharray={1000} strokeDashoffset={1000 - linkProgress * 1000} />
        <path d="M 300 240 Q 540 400 780 400" stroke="#00F0FF" strokeWidth={8} fill="none" strokeDasharray={1000} strokeDashoffset={1000 - linkProgress * 1000} />
        <path d="M 300 560 Q 540 400 780 400" stroke="#00F0FF" strokeWidth={8} fill="none" strokeDasharray={1000} strokeDashoffset={1000 - linkProgress * 1000} />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, opacity: linkProgress }}>
        <div style={{ padding: '20px 40px', backgroundColor: '#00F0FF', color: 'black', borderRadius: 100, fontSize: 32, fontWeight: 'bold' }}>Katze</div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene4Error: React.FC = () => {
  const frame = useCurrentFrame();
  const jitter = Math.sin(frame * 0.5) * 10;
  const isError = frame > 40;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: isError ? '#3B0000' : '#0B0B0E', transition: 'background-color 0.2s' }}>
      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: isError ? '#FF3333' : 'white',
          transform: isError ? `translate(${jitter}px, ${-jitter}px)` : 'none',
          textAlign: 'center',
        }}
      >
        {isError ? 'VERWIRRUNG\n(Perspektive / Text)' : 'Normales Bild'}
      </div>
    </AbsoluteFill>
  );
};

export const Scene5Prompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({ fps, frame: frame - 10, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 800, height: 600, backgroundColor: '#1E1E24', borderRadius: 20, position: 'relative' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <rect
            x={100}
            y={100}
            width={300}
            height={400}
            stroke="#00FF66"
            strokeWidth={10}
            fill="none"
            strokeDasharray={1400}
            strokeDashoffset={1400 - drawProgress * 1400}
            rx={20}
          />
        </svg>
        <div style={{ position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', padding: '20px 40px', borderRadius: 100, width: '100%', textAlign: 'center' }}>
          <span style={{ color: '#00FF66', fontSize: 40, fontWeight: 'bold' }}>"Fokussiere auf den grünen Bereich..."</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
