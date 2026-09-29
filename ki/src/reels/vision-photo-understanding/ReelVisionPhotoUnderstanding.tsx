import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {
  choreographyProgress,
  createCenterOutRanks,
  mix,
  staggeredChoreographyProgress,
  type ChoreographyPhase,
} from '../../motion/choreography';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {
  VISION_PHOTO_SCENES,
  VISION_PHOTO_SUBTITLES,
  type VisionPhotoScene,
} from './contract';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (
  frame: number,
  startFrame: number,
  durationInFrames: number,
  easing: ChoreographyPhase['easing'] = 'enter',
) => choreographyProgress(frame, {startFrame, durationInFrames, easing});

const iconPaths: Record<string, React.ReactNode> = {
  camera: (
    <>
      <rect x="4" y="8" width="24" height="18" rx="4" />
      <path d="M10 8l2-4h8l2 4" />
      <circle cx="16" cy="17" r="5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="10" height="10" rx="2" />
      <rect x="18" y="4" width="10" height="10" rx="2" />
      <rect x="4" y="18" width="10" height="10" rx="2" />
      <rect x="18" y="18" width="10" height="10" rx="2" />
    </>
  ),
  focus: (
    <>
      <circle cx="16" cy="16" r="7" />
      <path d="M4 11V5h6M22 5h6v6M28 21v6h-6M10 27H4v-6" />
    </>
  ),
  message: (
    <>
      <path d="M5 6h22v16H14l-7 6v-6H5z" />
      <path d="M10 12h12M10 17h8" />
    </>
  ),
  clarity: (
    <>
      <path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z" />
      <circle cx="16" cy="16" r="4" />
    </>
  ),
};

const Header: React.FC<{scene: VisionPhotoScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const enter = phase(frame, 0, 10, 'enter');

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 82,
        zIndex: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        opacity: enter,
        translate: `0 ${mix(-8, 0, enter)}px`,
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 21,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(185,140,255,.16)',
          border: '1.5px solid rgba(110,69,201,.22)',
          color: BRAND.accentDk,
          boxShadow: '0 12px 30px rgba(110,69,201,.10)',
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {iconPaths[scene.icon] ?? iconPaths.camera}
        </svg>
      </div>
      <div
        style={{
          maxWidth: 820,
          textAlign: 'center',
          fontFamily: BRAND.font,
          fontSize: scene.headline.length > 24 ? 46 : 54,
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: -1.5,
          color: BRAND.accentDk,
        }}
      >
        {scene.headline}
      </div>
    </div>
  );
};

const DeskIllustration: React.FC<{
  dim?: number;
  blur?: number;
  focus?: number;
}> = ({dim = 0, blur = 0, focus = 0}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      filter: blur ? `blur(${blur}px)` : 'none',
      opacity: 1 - dim * 0.48,
    }}
  >
    <svg viewBox="0 0 760 720" width="100%" height="100%">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1E9FF" />
          <stop offset="1" stopColor="#DCCBFF" />
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8B654F" />
          <stop offset="1" stopColor="#A87A60" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#3E285E"
            floodOpacity=".18"
          />
        </filter>
      </defs>
      <rect width="760" height="720" rx="42" fill="url(#wall)" />
      <circle cx="110" cy="112" r="66" fill="#FFFFFF" opacity=".34" />
      <path d="M70 470H690V720H70z" fill="url(#desk)" />
      <rect x="130" y="220" width="320" height="210" rx="20" fill="#252033" filter="url(#shadow)" />
      <rect x="149" y="239" width="282" height="166" rx="12" fill="#EEE7FF" />
      <path d="M235 272h110M205 310h170M248 348h84" stroke="#9B78DF" strokeWidth="14" strokeLinecap="round" opacity=".55" />
      <path d="M104 438H476l52 47H70z" fill="#50445E" />
      <rect x="150" y="485" width="330" height="18" rx="9" fill="#3B3147" opacity=".78" />
      <g filter="url(#shadow)">
        <rect x="535" y="385" width="94" height="116" rx="24" fill="#FFF8F2" />
        <path d="M629 409c45 0 47 66 3 68" fill="none" stroke="#FFF8F2" strokeWidth="22" strokeLinecap="round" />
        <path d="M550 410h63" stroke="#C7936B" strokeWidth="12" strokeLinecap="round" opacity=".55" />
      </g>
      <g transform="translate(475 526) rotate(-16)" filter="url(#shadow)">
        <circle cx="0" cy="0" r="26" fill="none" stroke="#E7C85B" strokeWidth="12" />
        <rect x="22" y="-7" width="116" height="14" rx="7" fill="#E7C85B" />
        <path d="M105 -7v28M128 -7v20" stroke="#E7C85B" strokeWidth="12" strokeLinecap="round" />
      </g>
      <g transform="translate(620 145)">
        <rect x="-10" y="75" width="86" height="90" rx="18" fill="#B98CFF" opacity=".42" />
        <path d="M34 76C-4 38 10 6 36 0c8 34 0 58-2 76z" fill="#6E45C9" opacity=".52" />
        <path d="M34 76c44-42 72-24 76 2-36 9-57 4-76-2z" fill="#8D68D8" opacity=".48" />
      </g>
    </svg>
    {focus > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: '55.5%',
          top: '69%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          border: `${5 + 5 * focus}px solid ${BRAND.accentDk}`,
          boxShadow: `0 0 0 ${20 * focus}px rgba(110,69,201,.12),0 18px 46px rgba(110,69,201,.25)`,
          opacity: focus,
          scale: mix(1.34, 1, focus),
        }}
      />
    ) : null}
  </div>
);

const PhotoFrame: React.FC<{
  focus?: number;
  dim?: number;
  blur?: number;
  showLabel?: boolean;
  style?: React.CSSProperties;
}> = ({focus = 0, dim = 0, blur = 0, showLabel = true, style}) => (
  <div
    style={{
      position: 'relative',
      width: 820,
      height: 850,
      borderRadius: 50,
      overflow: 'hidden',
      background: '#E9DEFF',
      boxShadow: '0 30px 90px rgba(49,31,73,.17)',
      border: '2px solid rgba(110,69,201,.14)',
      ...style,
    }}
  >
    <DeskIllustration focus={focus} dim={dim} blur={blur} />
    {showLabel ? (
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 22,
          padding: '10px 16px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.82)',
          backdropFilter: 'blur(8px)',
          fontSize: 19,
          fontWeight: 900,
          letterSpacing: 1.1,
          color: BRAND.accentDk,
        }}
      >
        FOTO
      </div>
    ) : null}
  </div>
);

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config: {damping: 18, stiffness: 150, mass: 0.75}});
  const question = phase(frame, 24, 18, 'enterEmphasis');
  const focus = phase(frame, 72, 28, 'move');
  const bridge = phase(frame, 178, 54, 'move');
  const questionExit = phase(frame, 168, 20, 'exit');
  const scale = (0.8 + 0.2 * intro) * mix(1, 0.805, bridge);
  const translateY = (1 - intro) * 80 + mix(0, -123, bridge);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <PhotoFrame
        focus={focus * (1 - bridge * 0.18)}
        style={{
          position: 'absolute',
          left: 130,
          top: 260,
          scale,
          translate: `0 ${translateY}px`,
          rotate: `${mix(-3, 0, intro)}deg`,
          transformOrigin: 'center center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 1090,
          padding: '26px 34px',
          borderRadius: 30,
          background: '#fff',
          border: '2px solid rgba(110,69,201,.18)',
          boxShadow: '0 22px 60px rgba(43,28,65,.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: question * (1 - questionExit),
          translate: `0 ${mix(28, 0, question) - questionExit * 16}px`,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BRAND.accentDk,
            color: '#fff',
            fontSize: 30,
            fontWeight: 950,
          }}
        >
          ?
        </div>
        <div style={{fontSize: 38, fontWeight: 900, color: BRAND.ink}}>
          Wo liegt der Schlüssel?
        </div>
      </div>
    </div>
  );
};

const TILE_COLUMNS = 5;
const TILE_ROWS = 4;
const TILE_WIDTH = 132;
const TILE_HEIGHT = 142;
const TILE_RANKS = createCenterOutRanks(TILE_COLUMNS, TILE_ROWS);

const TokenizeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grid = phase(frame, 18, 22, 'enter');
  const basePhotoFade = phase(frame, 76, 54, 'move');
  const tokenFieldSettle = phase(frame, 258, 48, 'move');
  const startX = 210;
  const startY = 290;
  const cropTopInsidePhoto = 70;

  return (
    <div style={{position: 'absolute', inset: 0, perspective: 1150}}>
      <PhotoFrame
        style={{
          position: 'absolute',
          width: 660,
          height: 690,
          left: 210,
          top: 220,
          opacity: 1 - basePhotoFade * 0.92,
          scale: mix(1, 0.96, basePhotoFade),
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: startX,
          top: startY,
          width: 660,
          height: 568,
          display: 'grid',
          gridTemplateColumns: `repeat(${TILE_COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${TILE_ROWS}, 1fr)`,
          opacity: grid * (1 - basePhotoFade * 0.55),
        }}
      >
        {Array.from({length: TILE_COLUMNS * TILE_ROWS}, (_, index) => (
          <div
            key={index}
            style={{
              border: '2px solid rgba(110,69,201,.58)',
              background: 'rgba(255,255,255,.02)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          rotate: `${mix(0, -0.7, tokenFieldSettle)}deg`,
        }}
      >
        {Array.from({length: TILE_COLUMNS * TILE_ROWS}, (_, index) => {
          const column = index % TILE_COLUMNS;
          const row = Math.floor(index / TILE_COLUMNS);
          const rank = TILE_RANKS[index] ?? index;
          const lift = staggeredChoreographyProgress(
            frame,
            rank,
            {startFrame: 64, durationInFrames: 18, easing: 'enterEmphasis'},
            {offsetFrames: 3, capFrames: 48},
          );
          const token = staggeredChoreographyProgress(
            frame,
            rank,
            {startFrame: 176, durationInFrames: 20, easing: 'move'},
            {offsetFrames: 3, capFrames: 45},
          );

          const baseX = startX + column * TILE_WIDTH;
          const baseY = startY + row * TILE_HEIGHT;
          const spreadX = (column - 2) * 34 + (index % 2 ? 18 : -18);
          const spreadY = (row - 1.5) * 42 + ((index % 3) - 1) * 18;
          const tokenX = 70 + (index % 10) * 100;
          const tokenY = 1000 + Math.floor(index / 10) * 105;
          const currentX = mix(spreadX * lift, tokenX - baseX, token);
          const currentY = mix(spreadY * lift, tokenY - baseY, token);
          const depth = mix(0, 150 + (rank % 6) * 18, lift) * (1 - token);
          const rotateX = mix(0, ((row - 1.5) * -6), lift) * (1 - token);
          const rotateY = mix(0, ((column - 2) * 5), lift) * (1 - token);
          const rotateZ = (index % 2 ? 1 : -1) * (5 + 4 * (index % 3)) * lift * (1 - token);
          const tileWidth = mix(TILE_WIDTH, 50, token);
          const tileHeight = mix(TILE_HEIGHT, 43, token);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: baseX,
                top: baseY,
                width: tileWidth,
                height: tileHeight,
                overflow: 'hidden',
                borderRadius: mix(8, 22, token),
                border: `${mix(1.5, 3.5, lift)}px solid rgba(110,69,201,${mix(0.28, 0.72, lift)})`,
                boxShadow: `0 ${mix(6, 24, lift)}px ${mix(16, 48, lift)}px rgba(56,35,86,${mix(0.05, 0.18, lift)})`,
                transform: `translate3d(${currentX}px, ${currentY}px, ${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                transformStyle: 'preserve-3d',
                opacity: grid,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 660,
                  height: 690,
                  left: -column * TILE_WIDTH,
                  top: -(cropTopInsidePhoto + row * TILE_HEIGHT),
                  opacity: 1 - token,
                }}
              >
                <DeskIllustration />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    index % 3 === 0
                      ? '#6E45C9'
                      : index % 3 === 1
                        ? '#8D68D8'
                        : '#B98CFF',
                  opacity: token,
                  boxShadow: token > 0.6 ? 'inset 0 0 0 1px rgba(255,255,255,.24)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FocusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ['Wo', 'liegt', 'der', 'Schlüssel?'];
  const photoEnter = phase(frame, 10, 18, 'enterEmphasis');
  const connect = phase(frame, 92, 34, 'move');
  const dim = phase(frame, 156, 28, 'enter');

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: 320,
          width: 310,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {words.map((word, index) => {
          const active = index === 3;
          const enter = staggeredChoreographyProgress(
            frame,
            index,
            {startFrame: 20, durationInFrames: 12, easing: 'enterEmphasis'},
            {offsetFrames: 5, capFrames: 18},
          );
          return (
            <div
              key={word}
              style={{
                alignSelf: index % 2 ? 'flex-end' : 'flex-start',
                padding: '18px 24px',
                borderRadius: 24,
                background: active ? BRAND.accentDk : '#fff',
                color: active ? '#fff' : BRAND.ink,
                border: '2px solid rgba(110,69,201,.16)',
                boxShadow: '0 14px 36px rgba(44,28,67,.08)',
                fontSize: 32,
                fontWeight: 900,
                opacity: enter,
                translate: `${mix(-34, 0, enter)}px 0`,
                scale: active ? mix(1, 1.055, connect) : 1,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      <PhotoFrame
        dim={dim * 0.55}
        focus={connect}
        style={{
          position: 'absolute',
          width: 590,
          height: 620,
          left: 420,
          top: 280,
          opacity: photoEnter,
          translate: `${mix(48, -10, photoEnter) - connect * 8}px 0`,
          scale: mix(0.985, 1.015, connect),
        }}
      />

      <svg
        viewBox="0 0 1080 1180"
        style={{
          position: 'absolute',
          left: 0,
          top: 150,
          width: 1080,
          height: 1180,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 330 510 C 480 480, 610 620, 760 700"
          fill="none"
          stroke={BRAND.accentDk}
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - connect}
          opacity={connect}
        />
        <path
          d="M 330 510 C 470 550, 620 730, 770 720"
          fill="none"
          stroke="#B98CFF"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - connect}
          opacity={connect * 0.72}
        />
      </svg>
    </div>
  );
};

const KeyCrop: React.FC<{focus: number}> = ({focus}) => (
  <div
    style={{
      position: 'relative',
      width: 760,
      height: 500,
      borderRadius: 46,
      overflow: 'hidden',
      background: 'linear-gradient(135deg,#E8D9FF,#F5EFFF)',
      boxShadow: '0 28px 78px rgba(49,31,73,.15)',
    }}
  >
    <svg viewBox="0 0 760 500" width="100%" height="100%">
      <rect x="0" y="330" width="760" height="170" fill="#9D7157" />
      <g transform="translate(485 220)">
        <rect x="0" y="0" width="118" height="145" rx="28" fill="#FFF8F2" />
        <path d="M118 32c54 0 55 83 4 86" fill="none" stroke="#FFF8F2" strokeWidth="26" strokeLinecap="round" />
        <path d="M18 35h78" stroke="#C7936B" strokeWidth="14" strokeLinecap="round" opacity=".6" />
      </g>
      <g transform="translate(265 350) rotate(-12)">
        <circle cx="0" cy="0" r="38" fill="none" stroke="#E7C85B" strokeWidth="16" />
        <rect x="34" y="-9" width="185" height="18" rx="9" fill="#E7C85B" />
        <path d="M170 -8v38M205 -8v28" stroke="#E7C85B" strokeWidth="16" strokeLinecap="round" />
      </g>
    </svg>
    <div
      style={{
        position: 'absolute',
        left: 196,
        top: 270,
        width: 175,
        height: 175,
        borderRadius: '50%',
        border: `8px solid ${BRAND.accentDk}`,
        boxShadow: `0 0 0 ${26 * focus}px rgba(110,69,201,.12)`,
        opacity: focus,
        scale: mix(1.25, 1, focus),
      }}
    />
  </div>
);

const AnswerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const crop = phase(frame, 0, 22, 'enterEmphasis');
  const arrow = phase(frame, 110, 28, 'move');
  const words = ['Der', 'Schlüssel', 'liegt', 'neben', 'der', 'Tasse.'];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          marginTop: 230,
          scale: mix(0.88, 1, crop),
          translate: `0 ${mix(36, 0, crop)}px`,
          opacity: crop,
        }}
      >
        <KeyCrop focus={arrow} />
      </div>
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 14,
          width: 830,
        }}
      >
        {words.map((word, index) => {
          const enter = staggeredChoreographyProgress(
            frame,
            index,
            {startFrame: 45, durationInFrames: 10, easing: 'enterEmphasis'},
            {offsetFrames: 6, capFrames: 30},
          );
          return (
            <span
              key={word}
              style={{
                fontSize: 45,
                fontWeight: 950,
                color: index === 1 ? BRAND.accentDk : BRAND.ink,
                opacity: enter,
                translate: `0 ${mix(22, 0, enter)}px`,
                scale: mix(0.94, 1, enter),
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      <svg
        viewBox="0 0 1080 300"
        style={{
          position: 'absolute',
          left: 0,
          top: 760,
          width: 1080,
          height: 300,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 520 260 C 490 190, 430 155, 375 135"
          fill="none"
          stroke={BRAND.accentDk}
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrow}
        />
        <path
          d="M365 133l28-4-10 26"
          fill="none"
          stroke={BRAND.accentDk}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrow}
        />
      </svg>
    </div>
  );
};

const FinalRuleItem: React.FC<{
  progress: number;
  label: string;
  variant: 'camera' | 'question' | 'focus';
}> = ({progress, label, variant}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      opacity: progress,
      translate: `0 ${mix(24, 0, progress)}px`,
      scale: mix(0.94, 1, progress),
    }}
  >
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: variant === 'focus' ? BRAND.accentDk : 'rgba(185,140,255,.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: variant === 'focus' ? '#fff' : BRAND.accentDk,
        fontSize: 58,
        fontWeight: 950,
      }}
    >
      {variant === 'question' ? (
        '?'
      ) : (
        <svg width="62" height="62" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2">
          {iconPaths[variant]}
        </svg>
      )}
    </div>
    <div style={{fontSize: 30, fontWeight: 900, color: BRAND.ink}}>{label}</div>
  </div>
);

const LimitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const blur = phase(frame, 20, 32, 'move');
  const split = phase(frame, 84, 30, 'enterEmphasis');
  const clearFocus = phase(frame, 144, 26, 'move');
  const rule1 = staggeredChoreographyProgress(
    frame,
    0,
    {startFrame: 190, durationInFrames: 14, easing: 'enterEmphasis'},
    {offsetFrames: 12, capFrames: 36},
  );
  const rule2 = staggeredChoreographyProgress(
    frame,
    1,
    {startFrame: 190, durationInFrames: 14, easing: 'enterEmphasis'},
    {offsetFrames: 12, capFrames: 36},
  );
  const rule3 = staggeredChoreographyProgress(
    frame,
    2,
    {startFrame: 190, durationInFrames: 14, easing: 'enterEmphasis'},
    {offsetFrames: 12, capFrames: 36},
  );
  const plus = phase(frame, 202, 10, 'enterEmphasis');
  const arrow = phase(frame, 226, 12, 'move');

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 55,
          top: 250,
          width: 455,
          height: 610,
          borderRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 22px 65px rgba(50,32,74,.12)',
          opacity: split,
          translate: `${mix(70, 0, split)}px 0`,
        }}
      >
        <DeskIllustration blur={7 * blur} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 18,
            padding: '9px 15px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.88)',
            fontSize: 22,
            fontWeight: 900,
            color: '#8F3347',
          }}
        >
          UNSCHARF
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 55,
          top: 250,
          width: 455,
          height: 610,
          borderRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 22px 65px rgba(50,32,74,.12)',
          opacity: split,
          translate: `${mix(-70, 0, split)}px 0`,
          scale: mix(1, 1.018, clearFocus),
        }}
      >
        <DeskIllustration focus={clearFocus} />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 18,
            padding: '9px 15px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.88)',
            fontSize: 22,
            fontWeight: 900,
            color: BRAND.accentDk,
          }}
        >
          KLAR
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 955,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FinalRuleItem progress={rule1} label="klares Bild" variant="camera" />
        <div style={{fontSize: 58, fontWeight: 950, color: BRAND.accentDk, opacity: plus}}>+</div>
        <FinalRuleItem progress={rule2} label="genaue Frage" variant="question" />
        <div style={{fontSize: 58, fontWeight: 950, color: BRAND.accentDk, opacity: arrow}}>→</div>
        <FinalRuleItem progress={rule3} label="besserer Fokus" variant="focus" />
      </div>
    </div>
  );
};

const SceneVisual: React.FC<{scene: VisionPhotoScene}> = ({scene}) => {
  switch (scene.sceneId) {
    case 'vision-photo-01':
      return <HookScene />;
    case 'vision-photo-02':
      return <TokenizeScene />;
    case 'vision-photo-03':
      return <FocusScene />;
    case 'vision-photo-04':
      return <AnswerScene />;
    case 'vision-photo-05':
      return <LimitsScene />;
    default:
      return null;
  }
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useMemo(
    () =>
      VISION_PHOTO_SUBTITLES.find(
        (item) => frame >= item.startFrame && frame < item.endFrame,
      ) ?? null,
    [frame],
  );
  if (!cue) return null;

  const words = cue.text.split(/\s+/).filter(Boolean);
  let active = 0;
  if (cue.words?.length) {
    const found = cue.words.findIndex(
      (word) => frame >= word.startFrame && frame < word.endFrame,
    );
    active =
      found >= 0
        ? found
        : Math.min(
            cue.words.length - 1,
            Math.floor(
              clamp((frame - cue.startFrame) / (cue.endFrame - cue.startFrame)) *
                cue.words.length,
            ),
          );
  } else {
    active = Math.min(
      words.length - 1,
      Math.floor(
        clamp((frame - cue.startFrame) / (cue.endFrame - cue.startFrame)) *
          words.length,
      ),
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: REEL_CAPTION_SAFE.horizontalInset,
        right: REEL_CAPTION_SAFE.horizontalInset,
        bottom: REEL_CAPTION_SAFE.bottom,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: REEL_CAPTION_SAFE.maxWidth,
          textAlign: 'center',
          fontFamily: BRAND.font,
          fontSize: 46,
          lineHeight: 1.18,
          fontWeight: 900,
          letterSpacing: -0.8,
          color: BRAND.ink,
          textShadow:
            '0 2px 0 rgba(255,255,255,.95),0 0 12px rgba(255,255,255,.9),0 8px 22px rgba(45,31,67,.12)',
        }}
      >
        {words.map((word, index) => (
          <React.Fragment key={`${cue.startFrame}-${index}`}>
            <span
              style={{
                display: 'inline-block',
                color: index === active ? BRAND.accentDk : BRAND.ink,
                translate: index === active ? '0 -2px' : '0 0',
                scale: index === active ? 1.06 : 1,
                transformOrigin: 'center bottom',
              }}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export type ReelVisionPhotoUnderstandingProps = {
  showCaptions?: boolean;
  voiceoverSrc?: string;
};

export const ReelVisionPhotoUnderstanding: React.FC<
  ReelVisionPhotoUnderstandingProps
> = ({showCaptions = true, voiceoverSrc}) => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg,#FCFAFF 0%,#F7F2FF 54%,#FBF9FF 100%)',
      fontFamily: BRAND.font,
      color: BRAND.ink,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        width: 720,
        height: 720,
        borderRadius: '50%',
        background: 'rgba(185,140,255,.09)',
        left: -290,
        top: 280,
        filter: 'blur(2px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 620,
        height: 620,
        borderRadius: '50%',
        background: 'rgba(110,69,201,.055)',
        right: -300,
        top: 720,
      }}
    />
    {VISION_PHOTO_SCENES.map((scene) => (
      <Sequence
        key={scene.sceneId}
        from={scene.startFrame}
        durationInFrames={scene.endFrame - scene.startFrame}
      >
        <Header scene={scene} />
        <SceneVisual scene={scene} />
      </Sequence>
    ))}
    {showCaptions ? <CaptionLayer /> : null}
    {voiceoverSrc ? (
      <Html5Audio
        src={voiceoverSrc.startsWith('http') ? voiceoverSrc : staticFile(voiceoverSrc)}
      />
    ) : null}
  </AbsoluteFill>
);
