import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {progress} from './motion';
import {useTheme} from './themes';

const ZEICHEN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$';

type ScrambleProps = {
  text: string;
  delay?: number;
  /** Frames bis der ganze Text steht. */
  duration?: number;
  size?: number;
  color?: string;
  font?: 'heading' | 'mono' | 'display';
  seed?: string;
  style?: React.CSSProperties;
};

/** Text "entschlüsselt" sich: Zufallszeichen rasten von links nach rechts ein. */
export const Scramble: React.FC<ScrambleProps> = ({text, delay = 0, duration = 26, size = 96, color, font = 'mono', seed = 's', style}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const p = progress(frame, delay, duration, 'soft');
  const tick = Math.floor(frame / 2);
  const fam = font === 'mono' ? t.font.mono : font === 'display' ? t.font.display : t.font.heading;
  return (
    <span
      style={{
        fontFamily: fam,
        fontSize: size,
        fontWeight: font === 'mono' ? 700 : font === 'display' ? t.font.displayWeight : t.font.headingWeight,
        letterSpacing: font === 'mono' ? '0.02em' : t.font.headingTracking,
        color: color ?? t.c.ink,
        whiteSpace: 'pre',
        opacity: frame < delay ? 0 : 1,
        ...style,
      }}
    >
      {text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const lockAt = (i + 1) / text.length;
        const locked = p >= lockAt;
        const rnd = ZEICHEN[Math.floor(random(`${seed}-${i}-${tick}`) * ZEICHEN.length)];
        return (
          <span key={i} style={{color: locked ? undefined : t.c.accentDeep, opacity: locked ? 1 : 0.75}}>
            {locked ? ch : rnd}
          </span>
        );
      })}
    </span>
  );
};

type WordRotateProps = {
  /** Fester Text davor, z. B. "KI für". */
  prefix?: string;
  words: string[];
  suffix?: string;
  delay?: number;
  /** Frames pro Wort. */
  per?: number;
  size?: number;
  align?: 'left' | 'center';
};

/** Satz mit wechselndem Wort: "KI für Texte / Bilder / Code". */
export const WordRotate: React.FC<WordRotateProps> = ({prefix, words, suffix, delay = 0, per = 30, size = 96, align = 'center'}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const local = Math.max(0, frame - delay);
  const idx = Math.min(words.length - 1, Math.floor(local / per));
  const inWord = local - idx * per;
  const enter = idx === 0 && frame < delay ? 0 : progress(inWord, 0, 12, 'out');
  const prev = idx > 0 ? words[idx - 1] : null;
  const exit = progress(inWord, 0, 10, 'in');
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  const textStyle: React.CSSProperties = {
    fontFamily: t.font.heading,
    fontSize: size,
    fontWeight: t.font.headingWeight,
    letterSpacing: t.font.headingTracking,
    lineHeight: 1.1,
  };
  return (
    <div style={{...textStyle, color: t.c.ink, textAlign: align, opacity: frame < delay ? 0 : 1}}>
      {prefix ? `${prefix} ` : null}
      <span style={{position: 'relative', display: 'inline-block', verticalAlign: 'bottom', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
        <span style={{visibility: 'hidden'}}>{longest}</span>
        {prev ? (
          <span style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'left', color: t.c.accentDeep, transform: `translateY(${-exit * 110}%)`}}>{prev}</span>
        ) : null}
        <span style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'left', color: t.c.accentDeep, transform: `translateY(${(1 - enter) * 110}%)`}}>
          {words[idx]}
        </span>
      </span>
      {suffix ? ` ${suffix}` : null}
    </div>
  );
};
