import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type RankingItem = {
  label: string;
  value: number;
  atFrame?: number;
};

export const RankingStage: React.FC<{
  items: RankingItem[];
  startFrame?: number;
  highlightFrame?: number;
}> = ({items, startFrame = 0, highlightFrame = startFrame + 80}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((item) => item.value), 1);
  const highlight = spring({
    fps,
    frame: frame - highlightFrame,
    config: {damping: 18, stiffness: 170},
  });

  return (
    <div style={{position: 'absolute', left: 110, right: 110, top: 420, bottom: 420}}>
      {sorted.map((item, index) => {
        const appearAt = item.atFrame ?? startFrame + index * 10;
        const progress = spring({fps, frame: frame - appearAt, config: {damping: 18, stiffness: 170}});
        const width = interpolate(progress, [0, 1], [0, (item.value / max) * 760]);
        const rank = index + 1;
        const rowScale = rank === 1 ? interpolate(highlight, [0, 1], [1, 1.025]) : 1;
        return (
          <div
            key={`${item.label}-${index}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 1fr 110px',
              gap: 20,
              alignItems: 'center',
              marginBottom: 34,
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) scale(${rowScale})`,
              transformOrigin: 'center left',
            }}
          >
            <div style={{fontSize: 34, fontWeight: 900, color: '#6E45C9'}}>{rank}</div>
            <div>
              <div style={{fontSize: item.label.length > 24 ? 24 : 28, fontWeight: 800, color: '#1A1A2E', marginBottom: 10, overflowWrap: 'anywhere'}}>{item.label}</div>
              <div style={{height: 34, background: '#EEEAF6', borderRadius: 999, overflow: 'hidden'}}>
                <div
                  style={{
                    width,
                    height: '100%',
                    borderRadius: 999,
                    background: rank === 1 ? '#B98CFF' : '#D7C3F6',
                    boxShadow: rank === 1 && highlight > 0
                      ? `0 8px ${26 + highlight * 8}px rgba(185,140,255,0.34)`
                      : 'none',
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
