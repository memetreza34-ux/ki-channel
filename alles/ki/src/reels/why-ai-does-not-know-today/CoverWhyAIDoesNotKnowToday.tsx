import React from 'react';
import {AbsoluteFill} from 'remotion';
import {todayFont, todayPalette, todayShadows} from './style';

export const CoverWhyAIDoesNotKnowToday: React.FC = () => (
  <AbsoluteFill style={{background: todayPalette.background, color: todayPalette.foreground, fontFamily: todayFont, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 58%, rgba(109,58,219,.18), transparent 48%), linear-gradient(90deg, rgba(35,27,44,.035) 1px, transparent 1px), linear-gradient(rgba(35,27,44,.035) 1px, transparent 1px)', backgroundSize: 'auto,96px 96px,96px 96px'}} />

    <div style={{position: 'absolute', left: 70, right: 70, top: 92, textAlign: 'center', fontSize: 78, lineHeight: 0.98, fontWeight: 980, letterSpacing: -4.2}}>
      WARUM WEISS DEINE KI NICHT,<br />
      <span style={{color: todayPalette.accent}}>WAS HEUTE PASSIERT?</span>
    </div>

    <div style={{position: 'absolute', left: 80, top: 750, width: 350, height: 350, borderRadius: '50%', background: `radial-gradient(circle at 38% 30%, ${todayPalette.accentSoft}, ${todayPalette.dark} 72%)`, border: `10px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent}}>
      <div style={{position: 'absolute', inset: 65, borderRadius: 40, border: '5px solid rgba(255,255,255,.8)', background: 'rgba(255,255,255,.12)'}}>
        {[0,1,2,3].map((line) => <div key={line} style={{height: 18, width: `${78 - line * 8}%`, margin: `${36 + line * 34}px auto 0`, borderRadius: 99, background: line === 0 ? todayPalette.accentBright : 'rgba(255,255,255,.55)'}} />)}
      </div>
      <svg viewBox="0 0 350 350" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <path d="M30 80 L155 175 L70 300 M320 45 L215 160 L305 285 M80 15 L170 115 L270 20" fill="none" stroke={todayPalette.iceStrong} strokeWidth="9" opacity=".8" />
      </svg>
    </div>

    <div style={{position: 'absolute', right: 70, top: 700, width: 390, height: 390, borderRadius: '50%', background: `radial-gradient(circle at 40% 33%, white, ${todayPalette.successSoft})`, border: `10px solid ${todayPalette.success}`, boxShadow: todayShadows.success}}>
      <div style={{position: 'absolute', inset: 58, borderRadius: '50%', border: `5px solid ${todayPalette.success}`, opacity: .5}} />
      <div style={{position: 'absolute', left: 188, top: 74, width: 15, height: 130, borderRadius: 99, background: todayPalette.foreground, transform: 'rotate(25deg)', transformOrigin: '7px 122px'}} />
      <div style={{position: 'absolute', left: 188, top: 112, width: 15, height: 100, borderRadius: 99, background: todayPalette.accent, transform: 'rotate(128deg)', transformOrigin: '7px 82px'}} />
      <div style={{position: 'absolute', left: 105, right: 105, bottom: 78, height: 76, borderRadius: 24, background: 'white', border: `4px solid ${todayPalette.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 980, color: todayPalette.success}}>HEUTE</div>
    </div>

    <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
      <path d="M425 920 C500 840 560 840 645 900" fill="none" stroke={todayPalette.line} strokeWidth="30" strokeLinecap="round" />
      <path d="M425 920 C500 840 535 842 575 866" fill="none" stroke={todayPalette.accent} strokeWidth="18" strokeLinecap="round" />
      <circle cx="590" cy="874" r="20" fill={todayPalette.danger} />
      <circle cx="630" cy="892" r="20" fill={todayPalette.danger} />
    </svg>

    <div style={{position: 'absolute', left: 170, right: 170, bottom: 240, height: 116, borderRadius: 42, border: `5px solid ${todayPalette.danger}`, background: todayPalette.dangerSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 980, color: todayPalette.danger, boxShadow: todayShadows.danger}}>
      NICHT AUTOMATISCH LIVE VERBUNDEN
    </div>
  </AbsoluteFill>
);
