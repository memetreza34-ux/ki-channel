import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Background, COLORS, FONT, Sfx, SFX_FILES, type SfxName} from '../../kit';
import type {Project} from '../types';

const NAMES = Object.keys(SFX_FILES) as SfxName[];
const EACH = 40;
const SOUND_AT = 8;

/**
 * Hörprobe aller Sounds: in `npm run studio` abspielen. Links steht der Name,
 * der gerade läuft – so heißt er auch im Code (`<Sfx name="…" />`).
 */
const SoundKatalog: React.FC = () => {
  const frame = useCurrentFrame();
  const current = Math.min(NAMES.length - 1, Math.floor(frame / EACH));
  return (
    <AbsoluteFill>
      <Background />
      <div style={{position: 'absolute', left: 120, top: 120, width: 760}}>
        <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 34, color: COLORS.inkSoft}}>
          Sound {current + 1} von {NAMES.length}
        </div>
        <div style={{fontFamily: FONT.mono, fontWeight: 700, fontSize: 96, color: COLORS.accentDeep, marginTop: 20, letterSpacing: '-0.03em'}}>
          {NAMES[current]}
        </div>
        <div style={{fontFamily: FONT.mono, fontWeight: 500, fontSize: 30, color: COLORS.inkSoft, marginTop: 18}}>
          sfx/{SFX_FILES[NAMES[current]]}
        </div>
        <div style={{fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, color: COLORS.inkFaint, marginTop: 60, lineHeight: 1.4}}>
          Kenney.nl · CC0 · im Code: &lt;Sfx name=&quot;{NAMES[current]}&quot; at={'{…}'} /&gt;
        </div>
      </div>
      <div style={{position: 'absolute', left: 940, top: 110, width: 900, display: 'flex', flexWrap: 'wrap', gap: 12}}>
        {NAMES.map((n, i) => (
          <div
            key={n}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 22,
              background: i === current ? COLORS.accentDeep : i < current ? COLORS.accentTint : COLORS.surface,
              color: i === current ? '#FFFFFF' : COLORS.ink,
              border: `2px solid ${COLORS.line}`,
            }}
          >
            {n}
          </div>
        ))}
      </div>
      {NAMES.map((n, i) => (
        <Sequence key={n} from={i * EACH} durationInFrames={EACH} layout="none">
          <Sfx name={n} at={SOUND_AT} volume={0.7} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const projekt: Project = {
  id: 'Sound-Katalog',
  component: SoundKatalog,
  format: 'landscape',
  durationInFrames: NAMES.length * EACH,
  ordner: 'Kataloge',
};
