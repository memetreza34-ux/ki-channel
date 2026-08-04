import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ReelSceneId} from '../contract';
import {SUBTITLE_CUES} from '../contract';
import {palette, shadow} from '../visualUtils';
import {ReelChrome} from './ReelChrome';

export const SceneShell: React.FC<{
  sceneId: ReelSceneId;
  children: React.ReactNode;
  background?: string;
}> = ({sceneId, children, background}) => (
  <AbsoluteFill
    style={{
      background:
        background ??
        `radial-gradient(circle at 50% 35%, ${palette.white} 0%, ${palette.background} 48%, #F0ECF7 100%)`,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(rgba(135,87,232,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(135,87,232,.035) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 82%, transparent 100%)',
      }}
    />
    {children}
    <ReelChrome sceneId={sceneId} subtitleWords={SUBTITLE_CUES[sceneId]} />
  </AbsoluteFill>
);

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(255,255,255,.82)',
      border: '1px solid rgba(135,87,232,.16)',
      borderRadius: 34,
      boxShadow: shadow,
      backdropFilter: 'blur(18px)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const TokenCapsule: React.FC<{
  text: string;
  accent?: boolean;
  danger?: boolean;
  style?: React.CSSProperties;
}> = ({text, accent, danger, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 96,
      minHeight: 64,
      padding: '10px 22px',
      borderRadius: 20,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 900,
      fontSize: 34,
      letterSpacing: -0.7,
      color: danger ? palette.danger : accent ? palette.white : palette.foreground,
      background: danger
        ? 'rgba(255,93,108,.12)'
        : accent
          ? `linear-gradient(135deg, ${palette.accent}, #6A36D3)`
          : palette.white,
      border: danger
        ? '2px solid rgba(255,93,108,.38)'
        : accent
          ? '2px solid rgba(255,255,255,.24)'
          : '2px solid rgba(135,87,232,.16)',
      boxShadow: accent
        ? '0 18px 50px rgba(135,87,232,.34)'
        : '0 12px 34px rgba(45,28,75,.12)',
      ...style,
    }}
  >
    {text}
  </div>
);
