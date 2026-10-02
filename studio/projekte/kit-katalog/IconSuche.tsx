import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Icon, useTheme} from '../../kit';

export type IconSucheProps = {icons: string[]; titel: string};

/** Raster aus Icons mit Namen – Ergebnis von `npm run icons -- <wort> --bild`. */
export const IconSuche: React.FC<IconSucheProps> = ({icons, titel}) => {
  const t = useTheme();
  const cols = 8;
  return (
    <AbsoluteFill>
      <Background pattern={false} />
      <div style={{position: 'absolute', left: 60, top: 36, fontFamily: t.font.body, fontWeight: 800, fontSize: 40, color: t.c.ink}}>{titel}</div>
      <div style={{position: 'absolute', left: 60, top: 110, right: 60, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18}}>
        {icons.slice(0, 48).map((name) => (
          <div key={name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 10, borderRadius: 16, background: t.c.surface}}>
            <Icon icon={name} size={84} animate="none" color={t.c.ink} />
            <div style={{fontFamily: t.font.mono, fontSize: 14, color: t.c.inkSoft, textAlign: 'center', wordBreak: 'break-all'}}>{name}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
