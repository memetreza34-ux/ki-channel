import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type RankingItem = {
  label: string;
  value: number;
};

export const RankingStage: React.FC<{
  items: RankingItem[];
  startFrame?: number;
}> = ({items, startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((item) => item.value), 1);

  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: 420, bottom: 420}}>
      {sorted.map((item, index) => {
        const local = frame - (startFrame + index * 10);
        const progress = spring({fps, frame: local, config: {damping: 18, stiffness: 170}});
        const width = interpolate(progress, [0, 1], [0, (item.value / max) * 760]);
        const rank = index + 1;
        return (
          <div
            key={item.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 1fr 110px',
              gap: 20,
              alignItems: 'center',
              marginBottom: 34,
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px)`,
            }}
          >
            <div style={{fontSize: 34, fontWeight: 900, color: '#6E45C9'}}>{rank}</div>
            <div>
              <div style={{fontSize: 28, fontWeight: 800, color: '#1A1A2E', marginBottom: 10}}>{item.label}</div>
              <div style={{height: 34, background: '#EEEAF6', borderRadius: 999, overflow: 'hidden'}}>
                <div
                  style={{
                    width,
                    height: '100%',
                    borderRadius: 999,
                    background: rank === 1 ? '#B98CFF' : '#D7C3F6',
                    boxShadow: rank === 1 ? '0 8px 26px rgba(185,140,255,0.34)' : 'none',
                  }}
                />
              </div>
            </div>
            <div style={{fontSize: 30, fontWeight: 900, color: '#1A1A2E', textAlign: 'right'}}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
};
