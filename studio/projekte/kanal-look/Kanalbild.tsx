import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Icon} from '../../kit';
import type {Project} from '../types';
import {BODY, FOOT_Y, KANAL, SERIEN, StilContext, Toki} from './stil';

/**
 * YouTube-Kanalbilder: Profilbild (rund beschnitten) und Banner.
 * Banner wird mit `npm run still -- Kanal-Banner --scale=1.3334` als 2560×1440 gerendert.
 * Sichere Zone (überall sichtbar): 1546×423 in 2560×1440 → hier 1160×317, Mitte bei (960, 540).
 * Kanalname ist noch offen → kein Name im Bild.
 */

const INK = KANAL.ink;
const SICHER = {x: 380, y: 382, w: 1160, h: 317};

/* ───────────── Profilbild ───────────── */

const Profil: React.FC = () => {
  const k = 3.0;
  const mitteY = 560;
  const fussY = mitteY + (FOOT_Y - (BODY.y + BODY.h / 2)) * k;
  return (
    <StilContext.Provider value={KANAL}>
      <AbsoluteFill style={{background: SERIEN.erklaert.tint}}>
        <div style={{position: 'absolute', left: 90, top: 90, width: 900, height: 900, borderRadius: '50%', background: '#FFE4D9'}} />
        <Toki x={540} y={fussY} k={k} gesicht="freude" armL={14} armR={14} idle={false} blink={0} />
      </AbsoluteFill>
    </StilContext.Provider>
  );
};

/* ───────────── Banner ───────────── */

const DEKO = [
  {icon: 'ph:sparkle-fill', farbe: SERIEN.erklaert.farbe},
  {icon: 'ph:chat-circle-dots-fill', farbe: SERIEN.news.farbe},
  {icon: 'ph:lightning-fill', farbe: SERIEN.test.farbe},
  {icon: 'ph:scales-fill', farbe: SERIEN.recht.farbe},
  {icon: 'ph:brain-fill', farbe: KANAL.ki},
];

/** Kleine Token-Chips und Icons außerhalb der sicheren Zone (auf großen Bildschirmen sichtbar). */
const Streu: React.FC = () => (
  <>
    {Array.from({length: 22}, (_, i) => {
      const links = i % 2 === 0;
      const x = links ? 30 + random(`bx${i}`) * 300 : 1590 + random(`bx${i}`) * 300;
      const y = 60 + random(`by${i}`) * 960;
      const d = DEKO[i % DEKO.length];
      const rot = (random(`br${i}`) - 0.5) * 30;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, opacity: 0.9}}>
          {i % 3 === 0 ? (
            <div style={{padding: '8px 18px', borderRadius: 14, background: '#FFFFFF', boxShadow: '0 8px 18px rgba(30,35,50,0.08)', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 28, color: d.farbe}}>
              {['To', 'ken', 'KI', 'Him', 'mel', '?', '62 %', 'blau'][i % 8]}
            </div>
          ) : (
            <Icon icon={d.icon} size={44 + random(`bs${i}`) * 30} color={d.farbe} animate="none" />
          )}
        </div>
      );
    })}
  </>
);

const Banner: React.FC = () => {
  const k = 1.05;
  return (
    <StilContext.Provider value={KANAL}>
      <AbsoluteFill style={{background: KANAL.bg, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -200, top: 520, width: 900, height: 900, borderRadius: '50%', background: SERIEN.erklaert.tint2}} />
        <div style={{position: 'absolute', right: -160, top: -380, width: 860, height: 860, borderRadius: '50%', background: SERIEN.news.tint2}} />
        <div style={{position: 'absolute', left: 820, top: 760, width: 620, height: 620, borderRadius: '50%', background: SERIEN.recht.tint2}} />
        <div style={{position: 'absolute', left: 260, top: -360, width: 600, height: 600, borderRadius: '50%', background: SERIEN.test.tint2}} />
        <Streu />
        {/* Sichere Zone */}
        <div style={{position: 'absolute', left: SICHER.x, top: SICHER.y, width: SICHER.w, height: SICHER.h, display: 'flex', alignItems: 'center', gap: 50}}>
          <div style={{position: 'relative', width: 300, height: SICHER.h, flexShrink: 0}}>
            <Toki x={150} y={SICHER.h - 6} k={k} gesicht="freude" armL={30} armR={150} idle={false} blink={0} />
          </div>
          <div>
            <div style={{fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 92, letterSpacing: '-0.045em', color: INK, lineHeight: 1}}>
              KI, <span style={{color: KANAL.ki}}>einfach erklärt.</span>
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 26}}>
              {Object.values(SERIEN).map((s) => (
                <div key={s.label} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, background: s.tint, whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '0.06em', textTransform: 'uppercase', color: s.farbe === SERIEN.erklaert.farbe ? '#8A6400' : s.farbe}}>
                  <div style={{width: 12, height: 12, borderRadius: '50%', background: s.farbe}} />
                  {({'KI-News': 'News', 'Recht & Gesellschaft': 'Recht'} as Record<string, string>)[s.label] ?? s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </StilContext.Provider>
  );
};

/** Prüfbild: Banner mit eingezeichneter sicherer Zone. */
const BannerPruefung: React.FC = () => (
  <AbsoluteFill>
    <Banner />
    <div style={{position: 'absolute', left: SICHER.x, top: SICHER.y, width: SICHER.w, height: SICHER.h, border: '3px dashed #E5484D'}} />
  </AbsoluteFill>
);

export const kanalbilder: Project[] = [
  {id: 'Kanal-Profilbild', component: Profil, format: 'square', durationInFrames: 1, ordner: 'Kanal-Look'},
  {id: 'Kanal-Banner', component: Banner, format: 'landscape', durationInFrames: 1, ordner: 'Kanal-Look'},
  {id: 'Kanal-Banner-Pruefung', component: BannerPruefung, format: 'landscape', durationInFrames: 1, ordner: 'Kanal-Look'},
];
