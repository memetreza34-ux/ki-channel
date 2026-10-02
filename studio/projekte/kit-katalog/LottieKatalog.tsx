import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Lottie, useTheme} from '../../kit';
import {LOTTIE_EMOJI, LOTTIE_UI} from '../../kit/lottie-namen';
import type {Project} from '../types';

const Raster: React.FC<{namen: readonly string[]; ordner: 'emoji' | 'ui'; spalten: number; titel: string}> = ({namen, ordner, spalten, titel}) => {
  const t = useTheme();
  const zelle = Math.floor((1920 - 120) / spalten);
  return (
    <AbsoluteFill>
      <Background pattern={false} />
      <div style={{position: 'absolute', left: 60, top: 26, fontFamily: t.font.body, fontWeight: 800, fontSize: 34, color: t.c.ink}}>{titel}</div>
      <div style={{position: 'absolute', left: 60, top: 84, display: 'grid', gridTemplateColumns: `repeat(${spalten}, ${zelle}px)`, rowGap: 6}}>
        {namen.map((n, i) => (
          <div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Lottie name={`${ordner}/${n}`} size={zelle * 0.62} loop delay={i % 8} color={ordner === 'ui' ? 'accent' : undefined} popIn={false} />
            <div style={{fontFamily: t.font.mono, fontSize: 15, color: t.c.inkSoft}}>{n}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const EmojiKatalog: React.FC = () => (
  <Raster namen={LOTTIE_EMOJI} ordner="emoji" spalten={9} titel='Lottie: emoji/… (Google Noto, CC BY 4.0 – in die Beschreibung: "Animierte Emojis: Google Noto, CC BY 4.0")' />
);
const UiKatalog: React.FC = () => <Raster namen={LOTTIE_UI} ordner="ui" spalten={14} titel="Lottie: ui/… (MIT, einfärbbar: color=&quot;accent&quot;)" />;

export const emojiKatalog: Project = {id: 'Lottie-Katalog-Emoji', component: EmojiKatalog, format: 'landscape', durationInFrames: 120};
export const uiKatalog: Project = {id: 'Lottie-Katalog-UI', component: UiKatalog, format: 'landscape', durationInFrames: 120};
