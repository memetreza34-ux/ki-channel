import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop, progress, Sfx, type SfxName} from '../../kit';
import type {Project} from '../types';
import {Hintergrund, KANAL, SERIEN, StilContext, Toki, useStil, type Gesicht} from './stil';

/**
 * Vorführung des Token-Wesens: Ausdrücke, Arme, Stimme, steigende Ticks, Sound-Logo.
 */

const BEAT = 60;
const POS = {x: 960, y: 860, k: 1.6};

type Beat = {
  titel: string;
  gesicht: Gesicht;
  armL?: (f: number) => number;
  armR?: (f: number) => number;
  sound?: SfxName;
  smile?: number;
  look?: [number, number];
  extra?: 'gedanken' | 'frage' | 'zeigen';
  hopser?: boolean;
};

// Winken/Jubeln: gleichmäßige Schwingung, daher Sinus.
const BEATS: Beat[] = [
  {titel: 'Ruhig', gesicht: 'neutral'},
  {titel: 'Winken', gesicht: 'neutral', smile: 0.9, armR: (f) => 140 + 22 * Math.sin(f / 3.2), sound: 'kHallo'},
  {titel: 'Freude', gesicht: 'freude', armL: () => 160, armR: () => 160, sound: 'kYay', hopser: true},
  {titel: 'Staunen', gesicht: 'staunen', armL: () => 65, armR: () => 65, sound: 'kOh'},
  {titel: 'Nachdenken', gesicht: 'denken', armR: () => 35, sound: 'kHmm', extra: 'gedanken'},
  {titel: 'Zeigen', gesicht: 'neutral', smile: 0.7, armR: (f) => mix(18, 95, progress(f, 0, 12)), look: [1, -0.2], sound: 'kBabbel1', extra: 'zeigen'},
  {titel: 'Ernst', gesicht: 'ernst', armL: () => 8, armR: () => 8},
  {titel: 'Verwirrt', gesicht: 'verwirrt', armL: () => 150, sound: 'kHuch', extra: 'frage'},
  {titel: 'Traurig', gesicht: 'traurig', armL: () => 4, armR: () => 4},
];

const LISTE_AT = BEATS.length * BEAT;
const LISTE = ['Texte', 'Bilder', 'Code', 'Musik', 'Videos'];
const LOGO_AT = LISTE_AT + 130;
const TOTAL = LOGO_AT + 110;

const Gedanken: React.FC<{f: number}> = ({f}) => {
  const s = useStil();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = progress(f, 8 + i * 7, 10);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: POS.x + 150 + i * 46,
              top: 470 - i * 56,
              width: 22 + i * 14,
              height: 22 + i * 14,
              borderRadius: '50%',
              background: s.surface,
              border: `4px solid ${s.faint}`,
              opacity: p,
              transform: `scale(${mix(0.3, 1, p)})`,
            }}
          />
        );
      })}
    </>
  );
};

const Figur: React.FC = () => {
  const s = useStil();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beatIndex = Math.min(BEATS.length - 1, Math.floor(frame / BEAT));
  const inBeats = frame < LISTE_AT;
  const beat = BEATS[beatIndex];
  const f = frame - beatIndex * BEAT;

  // Kleiner Federstoß bei jedem Wechsel, damit der Ausdruck "einrastet".
  const switchBump = inBeats ? 1 - spring({frame: f, fps, config: {damping: 10, stiffness: 200, mass: 0.5}}) : 0;
  const hop = inBeats && beat.hopser ? Math.abs(Math.sin((f / BEAT) * Math.PI * 2)) * 50 : 0;

  // Liste: Wesen schaut auf die Punkte
  const inListe = frame >= LISTE_AT && frame < LOGO_AT;
  const lf = frame - LISTE_AT;

  // Logo: Wesen springt in die Mitte, drei Punkte im Takt der Töne
  const inLogo = frame >= LOGO_AT;
  const gf = frame - LOGO_AT;
  const logoNoten = [8, 13, 17];

  let gesicht: Gesicht = beat.gesicht;
  let armL = beat.armL ? beat.armL(f) : 18;
  let armR = beat.armR ? beat.armR(f) : 18;
  let look = beat.look;
  let smile = beat.smile;
  if (inListe) {
    gesicht = 'neutral';
    smile = 0.8;
    armR = 18;
    armL = mix(18, 70, progress(lf, 0, 10));
    look = [-1, -0.4];
  }
  if (inLogo) {
    gesicht = gf > 18 ? 'freude' : 'neutral';
    smile = undefined;
    look = undefined;
    armL = gf > 18 ? 160 : 18;
    armR = gf > 18 ? 160 : 18;
  }

  const titel = inLogo ? 'Sound-Logo' : inListe ? 'Steigende Töne' : beat.titel;
  const titelKey = inLogo ? 'logo' : inListe ? 'liste' : beat.titel;
  const titelStart = inLogo ? LOGO_AT : inListe ? LISTE_AT : beatIndex * BEAT;
  const titelIn = progress(frame, titelStart, 10);

  return (
    <AbsoluteFill>
      <Hintergrund blobs={[SERIEN.erklaert.tint2, SERIEN.news.tint2]} />
      <div style={{position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: s.body, fontSize: 30, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.inkSoft}}>Token-Wesen · Ausdrücke</div>
        <div key={titelKey} style={{fontFamily: s.head, fontSize: 96, fontWeight: 800, letterSpacing: '-0.035em', color: s.ink, marginTop: 8, opacity: titelIn, transform: `translateY(${(1 - titelIn) * 20}px)`}}>
          {titel}
        </div>
      </div>

      {inBeats && beat.extra === 'gedanken' ? <Gedanken f={f} /> : null}
      {inBeats && beat.extra === 'frage' ? (
        <div style={{position: 'absolute', left: POS.x + 170, top: 380, fontFamily: s.head, fontWeight: 900, fontSize: 130, color: s.ki, opacity: progress(f, 6, 8), transform: `rotate(14deg) scale(${mix(0.4, 1, progress(f, 6, 10))})`}}>?</div>
      ) : null}
      {inBeats && beat.extra === 'zeigen' ? (
        <div style={{position: 'absolute', left: POS.x + 330, top: 600, fontFamily: s.head, fontWeight: 800, fontSize: 64, color: s.ink, opacity: progress(f, 12, 10), transform: `translateX(${(1 - progress(f, 12, 14)) * -30}px)`}}>
          Schau mal!
        </div>
      ) : null}

      {inListe ? (
        <div style={{position: 'absolute', left: 230, top: 330, display: 'flex', flexDirection: 'column', gap: 14}}>
          {LISTE.map((w, i) => {
            const p = pop(frame, fps, LISTE_AT + 12 + i * 12, 'snappy');
            return (
              <div key={w} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: clamp01(p * 2), transform: `translateX(${(1 - p) * -40}px)`}}>
                <div style={{width: 22, height: 22, borderRadius: '50%', background: s.ki}} />
                <div style={{fontFamily: s.head, fontSize: 60, fontWeight: 800, color: s.ink}}>{w}</div>
              </div>
            );
          })}
        </div>
      ) : null}

      {inLogo ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 34}}>
          {[SERIEN.news.farbe, SERIEN.test.farbe, SERIEN.erklaert.farbe].map((c, i) => {
            const p = pop(gf, fps, logoNoten[i], 'bouncy');
            return <div key={c} style={{width: 64, height: 64, borderRadius: '50%', background: c, transform: `scale(${clamp01(p) * 1.0 + Math.max(0, p - 1)})`}} />;
          })}
        </div>
      ) : null}

      <Toki
        x={POS.x}
        y={POS.y - hop}
        k={POS.k}
        sx={1 + switchBump * 0.08}
        sy={1 - switchBump * 0.1}
        gesicht={gesicht}
        armL={armL}
        armR={armR}
        look={look}
        smile={smile}
        mouthO={inBeats && beat.sound && f > 4 && f < 22 && beat.gesicht !== 'freude' ? 0.35 + 0.25 * Math.sin(f / 1.6) : undefined}
      />

      {BEATS.map((b, i) => (b.sound ? <Sfx key={i} name={b.sound} at={i * BEAT + 4} volume={0.6} /> : null))}
      {BEATS.map((b, i) => (i > 0 ? <Sfx key={`t${i}`} name="kTipp" at={i * BEAT} volume={0.3} /> : null))}
      {LISTE.map((_, i) => (
        <Sfx key={`l${i}`} name={(['kTick1', 'kTick2', 'kTick3', 'kTick4', 'kTick5'] as const)[i]} at={LISTE_AT + 12 + i * 12} volume={0.5} />
      ))}
      <Sequence from={LOGO_AT} layout="none">
        <Sfx name="kLogo" at={0} volume={0.7} />
        <Sfx name="kYay" at={20} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Comp: React.FC = () => (
  <StilContext.Provider value={KANAL}>
    <Figur />
  </StilContext.Provider>
);

export const figurProjekt: Project = {id: 'Kanal-Figur', component: Comp, format: 'landscape', durationInFrames: TOTAL, ordner: 'Kanal-Look'};
