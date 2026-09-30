import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {
  easedProgress,
  followThrough,
  staggerDelay,
} from '../../motion/easing';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {ARITHMETIC_VISUAL_PROFILES} from './visualProfiles';
import {assertVisualQualityV4} from './visualQuality';

export const ARITHMETIC_COMPOSITION_ID = 'KI-Reel-AI-Arithmetic-Reasoning';
export const ARITHMETIC_FPS = 30;
export const ARITHMETIC_WIDTH = 1080;
export const ARITHMETIC_HEIGHT = 1920;
export const ARITHMETIC_DURATION_IN_FRAMES = 1260;

export const ARITHMETIC_SCENES = [
  {sceneId: 'arithmetic-01', startFrame: 0, durationFrames: 210},
  {sceneId: 'arithmetic-02', startFrame: 210, durationFrames: 290},
  {sceneId: 'arithmetic-03', startFrame: 500, durationFrames: 280},
  {sceneId: 'arithmetic-04', startFrame: 780, durationFrames: 250},
  {sceneId: 'arithmetic-05', startFrame: 1030, durationFrames: 230},
] as const;

assertAuthoredVisualDiversity(ARITHMETIC_VISUAL_PROFILES);
assertVisualQualityV4();

const C = {
  bg: '#F8F7FB',
  ink: '#171525',
  muted: '#706979',
  accent: '#6E45C9',
  accentSoft: '#D7C1F4',
  accentField: '#CDB0F0',
  line: '#D3CBDE',
  red: '#D33E58',
  redSoft: '#EFB0BC',
  redField: '#E68A9C',
  green: '#1E835C',
  greenSoft: '#B9E2D2',
  greenField: '#8DCEB4',
  white: '#FFFFFF',
  terminal: '#17151F',
  dark: '#252135',
} as const;

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.28,
        backgroundImage:
          'linear-gradient(rgba(110,69,201,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(110,69,201,.055) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 760,
        height: 760,
        left: 570,
        top: -300,
        borderRadius: 999,
        background: 'radial-gradient(circle, rgba(185,140,255,.28), rgba(185,140,255,0) 68%)',
      }}
    />
  </AbsoluteFill>
);

const ContextLabel: React.FC<{children: React.ReactNode; tone?: 'accent' | 'red' | 'green'}> = ({
  children,
  tone = 'accent',
}) => {
  const color = tone === 'red' ? C.red : tone === 'green' ? C.green : C.accent;
  return (
    <div
      style={{
        position: 'absolute',
        left: 88,
        top: 128,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 22,
        fontWeight: 900,
        letterSpacing: 4,
        color,
      }}
    >
      {children}
    </div>
  );
};

const Caption: React.FC<{text: string; duration: number}> = ({text, duration}) => {
  const frame = useCurrentFrame();
  const enter = easedProgress(frame, 3, 13, 'enter');
  const exit = easedProgress(frame, Math.max(14, duration - 10), Math.max(15, duration - 2), 'exit');
  return (
    <div
      data-arithmetic-caption="true"
      style={{
        position: 'absolute',
        left: REEL_CAPTION_SAFE.horizontalInset,
        right: REEL_CAPTION_SAFE.horizontalInset,
        bottom: REEL_CAPTION_SAFE.bottom,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: REEL_CAPTION_SAFE.maxWidth,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 46,
          lineHeight: 1.12,
          fontWeight: 900,
          textAlign: 'center',
          color: C.ink,
          opacity: enter * (1 - exit),
          transform: `translateY(${(1 - enter) * 12}px)`,
          textShadow: '0 3px 18px rgba(248,247,251,.96)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

type KineticNumberProps = {
  value: string;
  progress: number;
  x: number;
  y: number;
  size?: number;
  fromColor?: string;
  toColor?: string;
  spacing?: number;
};

const KineticNumber: React.FC<KineticNumberProps> = ({
  value,
  progress,
  x,
  y,
  size = 116,
  fromColor = C.ink,
  toColor = C.red,
  spacing = 82,
}) => (
  <g>
    {value.split('').map((digit, index) => {
      const local = Math.max(0, Math.min(1, progress * 1.35 - index * 0.11));
      const offset = interpolate(local, [0, 1], [0, index === value.length - 1 ? -20 : -5]);
      const scale = interpolate(local, [0, 1], [1, index === value.length - 1 ? 1.12 : 1]);
      return (
        <text
          key={`${digit}-${index}`}
          x={x + index * spacing}
          y={y + offset}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={size}
          fontWeight={950}
          fill={local > 0.32 ? toColor : fromColor}
          transform={`translate(${x + index * spacing}, ${y}) scale(${scale}) translate(${-x - index * spacing}, ${-y})`}
        >
          {digit}
        </text>
      );
    })}
  </g>
);

type ObjectTransformationProps = {
  progress: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
};

const ObjectTransformation: React.FC<ObjectTransformationProps> = ({progress, x = 0, y = 0, children}) => {
  const scale = interpolate(progress, [0, 1], [0.94, 1]);
  const rise = interpolate(progress, [0, 1], [18, 0]);
  return (
    <g opacity={0.28 + progress * 0.72} transform={`translate(${x}, ${y + rise}) scale(${scale})`}>
      {children}
    </g>
  );
};

const BarChart: React.FC<{frame: number}> = ({frame}) => {
  const data = [
    {label: '846', value: 58, color: C.accent},
    {label: '836', value: 27, color: C.red},
    {label: '856', value: 15, color: C.muted},
  ];
  const select = easedProgress(frame, 150, 184, 'enterEmphasis');
  const exitLosers = easedProgress(frame, 184, 220, 'exit');
  const collapse = easedProgress(frame, 224, 270, 'move');
  return (
    <g transform={`translate(${interpolate(collapse, [0, 1], [0, -120])}, ${interpolate(collapse, [0, 1], [0, -170])})`}>
      <rect
        x={80}
        y={940}
        width={920}
        height={410}
        rx={44}
        fill={C.accentSoft}
        opacity={easedProgress(frame, 90, 122, 'enter') * (1 - collapse * 0.72)}
      />
      <text x={150} y={1015} fontFamily="Arial" fontSize={20} fontWeight={900} letterSpacing={3} fill={C.muted}>
        BEISPIEL — NÄCHSTE TOKEN-KANDIDATEN
      </text>
      {data.map((item, index) => {
        const delay = staggerDelay(index, 5);
        const p = easedProgress(frame, 100 + delay, 136 + delay, 'enterEmphasis');
        const isWinner = index === 0;
        const loserOpacity = isWinner ? 1 : 1 - exitLosers;
        const rowY = 1060 + index * 92;
        const winnerBoost = isWinner ? interpolate(select, [0, 1], [1, 1.16]) : 1;
        return (
          <g key={item.label} opacity={loserOpacity} transform={`translate(${isWinner ? select * 28 : -exitLosers * 80}, 0) scale(${winnerBoost})`}>
            <text x={150} y={rowY + 32} fontFamily="Arial" fontSize={34} fontWeight={900} fill={C.ink}>
              {item.label}
            </text>
            <rect x={250} y={rowY} width={620} height={48} rx={24} fill="#EEE9F3" />
            <rect x={250} y={rowY} width={item.value * 9.4 * p} height={48} rx={24} fill={item.color} opacity={0.96} />
            {isWinner ? (
              <rect x={120} y={rowY - 18} width={800 * select} height={84} rx={34} fill="none" stroke={C.accent} strokeWidth={7} opacity={select} />
            ) : null}
          </g>
        );
      })}
      <g opacity={collapse} transform={`translate(${770 + collapse * 60}, ${760 - collapse * 40}) scale(${0.7 + collapse * 0.3})`}>
        <circle r={92} fill={C.accent} />
        <text y={17} textAnchor="middle" fontFamily="Arial" fontSize={48} fontWeight={950} fill={C.white}>846</text>
      </g>
    </g>
  );
};

const TerminalMock: React.FC<{frame: number}> = ({frame}) => {
  const expand = easedProgress(frame, 22, 68, 'move');
  const type = easedProgress(frame, 68, 116, 'move');
  const execution = easedProgress(frame, 108, 138, 'enterEmphasis');
  const result = easedProgress(frame, 132, 154, 'enterEmphasis');
  const exit = easedProgress(frame, 190, 232, 'exit');
  const expression = '47 * 18';
  const shown = expression.slice(0, Math.floor(type * expression.length));
  const width = interpolate(expand, [0, 1], [260, 570]);
  const x = 950 - width;
  return (
    <g opacity={1 - exit * 0.65} transform={`translate(${exit * 80}, ${exit * -40}) scale(${1 - exit * 0.16})`}>
      <rect x={x} y={600} width={width} height={470} rx={38} fill={C.terminal} />
      <rect x={x + 28} y={730} width={(width - 56) * execution} height={150} rx={26} fill={C.green} opacity={0.24 * execution} />
      <circle cx={x + 46} cy={645} r={9} fill={C.red} />
      <circle cx={x + 76} cy={645} r={9} fill="#E6B94C" />
      <circle cx={x + 106} cy={645} r={9} fill={C.green} />
      <text x={x + 50} y={730} fontFamily="monospace" fontSize={30} fontWeight={700} fill="#CFC9DB">
        $ calculator
      </text>
      <text x={x + 50} y={815} fontFamily="monospace" fontSize={48} fontWeight={800} fill={C.white}>
        {shown}
        <tspan fill={C.accentSoft}>_</tspan>
      </text>
      <text
        x={x + 50}
        y={955}
        fontFamily="monospace"
        fontSize={92}
        fontWeight={950}
        fill={C.greenField}
        opacity={result}
        transform={`translate(0, ${(1 - result) * 22})`}
      >
        846
      </text>
    </g>
  );
};

// REMOTION_BEAT: math-01-wrong-answer
const WrongAnswerBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const alarm = easedProgress(frame, 0, 6, 'enterEmphasis');
  const secondShock = easedProgress(frame, 6, 15, 'enterEmphasis');
  const alarmExit = easedProgress(frame, 20, 46, 'exit');
  const snap = easedProgress(frame, 6, 16, 'enterEmphasis');
  const settle = easedProgress(frame, followThrough(16, 1), 34, 'move');
  const compress = easedProgress(frame, 165, 202, 'move');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect
        x={1080 - 520 * alarm}
        y={350}
        width={520 * alarm}
        height={560}
        rx={60}
        fill={C.redSoft}
        opacity={(1 - alarmExit) * 0.98}
      />
      <rect
        x={70}
        y={900}
        width={700 * secondShock}
        height={260}
        rx={52}
        fill={C.accentField}
        opacity={(1 - alarmExit) * 0.88}
      />
      <g transform={`translate(0, ${interpolate(compress, [0, 1], [0, -200])}) scale(${interpolate(compress, [0, 1], [1, 0.72])})`}>
        <text x={105} y={745} fontFamily="Arial" fontSize={120} fontWeight={950} fill={C.ink}>
          47 × 18 =
        </text>
        <KineticNumber value="836" progress={snap} x={690} y={745} size={120} spacing={84} />
        <text
          x={610}
          y={850}
          fontFamily="Arial"
          fontSize={28}
          fontWeight={950}
          letterSpacing={3}
          fill={C.red}
          opacity={settle}
        >
          PLAUSIBEL. ABER FALSCH.
        </text>
      </g>
    </svg>
  );
};

// REMOTION_BEAT: math-02-equation-fracture
const EquationFractureBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const fracture = easedProgress(frame, 14, 34, 'move');
  const compare = easedProgress(frame, 42, 84, 'enterEmphasis');
  const focus = easedProgress(frame, 118, 150, 'move');
  const clear = easedProgress(frame, 170, 202, 'exit');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <path
        d="M 625 535 L 930 925"
        stroke={C.red}
        strokeWidth={11}
        strokeLinecap="round"
        strokeDasharray={500}
        strokeDashoffset={500 * (1 - fracture)}
      />
      <rect x={70} y={900} width={440 * compare} height={340} rx={50} fill={C.accentSoft} opacity={0.9 * compare * (1 - clear)} />
      <rect x={570} y={900} width={440 * compare} height={340} rx={50} fill={C.redSoft} opacity={(0.8 + focus * 0.2) * compare * (1 - clear)} />
      <rect x={570} y={900} width={440 * focus} height={340} rx={50} fill={C.redField} opacity={0.55 * focus * (1 - clear)} />
      <ObjectTransformation progress={compare}>
        <text x={135} y={1030} fontFamily="Arial" fontSize={52} fontWeight={950} fill={C.ink}>SPRACHE</text>
        <text x={135} y={1090} fontFamily="Arial" fontSize={29} fontWeight={800} fill={C.muted}>kann sicher klingen</text>
        <text x={635} y={1030} fontFamily="Arial" fontSize={52} fontWeight={950} fill={C.red}>RECHNUNG</text>
        <text x={635} y={1090} fontFamily="Arial" fontSize={29} fontWeight={800} fill={C.red}>muss trotzdem stimmen</text>
      </ObjectTransformation>
    </svg>
  );
};

const TOKEN_PATH = 'M 110 700 C 285 565, 510 565, 680 700 S 880 855, 990 700';
const TOKEN_PATH_LENGTH = getLength(TOKEN_PATH);

// REMOTION_BEAT: math-03-token-stream
const TokenStreamBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const rail = easedProgress(frame, 0, 26, 'enterEmphasis');
  const railShift = easedProgress(frame, 48, 86, 'move');
  const draw = easedProgress(frame, 24, 96, 'move');
  const winnerPhase = easedProgress(frame, 188, 238, 'move');
  const endBand = easedProgress(frame, 238, 282, 'enterEmphasis');
  const pathProps = evolvePath(draw, TOKEN_PATH);
  const tokens = ['47', '×', '18', '=', '?'];
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={575 + railShift * 70} width={1080 * rail} height={270 - railShift * 80} fill={C.accentSoft} opacity={0.72} />
      <rect x={0} y={560} width={1080 * endBand} height={330} fill={C.greenSoft} opacity={0.72 * endBand} />
      <path d={TOKEN_PATH} fill="none" stroke={C.white} strokeWidth={30} strokeLinecap="round" opacity={0.9} />
      <path
        d={TOKEN_PATH}
        fill="none"
        stroke={C.accent}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={pathProps.strokeDasharray}
        strokeDashoffset={pathProps.strokeDashoffset}
      />
      {tokens.map((token, index) => {
        const delay = staggerDelay(index, 3);
        const enter = easedProgress(frame, 4 + delay, 22 + delay, 'enterEmphasis');
        const travel = easedProgress(frame, 30 + delay, 104 + delay, 'move');
        const fraction = Math.min(0.92, 0.08 + index * 0.12 + travel * 0.13);
        const point = getPointAtLength(TOKEN_PATH, TOKEN_PATH_LENGTH * fraction) ?? {x: 120, y: 700};
        const winnerOffset = index === 4 ? winnerPhase * 110 : 0;
        return (
          <g key={`${token}-${index}`} opacity={enter * (index === 4 ? 1 : 1 - winnerPhase * 0.45)} transform={`translate(${point.x + winnerOffset}, ${point.y - winnerOffset * 0.34})`}>
            <circle r={46 + (index === 4 ? winnerPhase * 18 : 0)} fill={index === 4 ? C.accent : C.white} stroke={C.accent} strokeWidth={4} />
            <text y={13} textAnchor="middle" fontFamily="Arial" fontSize={32} fontWeight={950} fill={index === 4 ? C.white : C.ink}>{token}</text>
          </g>
        );
      })}
      <text x={110} y={470} fontFamily="Arial" fontSize={58} fontWeight={950} fill={C.ink}>Schritt für Schritt</text>
      <text x={110} y={525} fontFamily="Arial" fontSize={29} fontWeight={800} fill={C.muted}>Text und Zahlen laufen durch dieselbe Token-Pipeline.</text>
    </svg>
  );
};

// REMOTION_BEAT: math-04-probability-shift
const ProbabilityShiftBeat: React.FC = () => {
  const frame = useCurrentFrame();
  return <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}><BarChart frame={frame} /></svg>;
};

const ERROR_PATH = 'M 185 785 C 325 610, 465 610, 540 785 S 735 960, 895 785';
const ERROR_PATH_LENGTH = getLength(ERROR_PATH);

// REMOTION_BEAT: math-05-error-cascade
const ErrorCascadeBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = easedProgress(frame, 0, 25, 'enterEmphasis');
  const fail = easedProgress(frame, 46, 74, 'enterEmphasis');
  const firstLeg = easedProgress(frame, 72, 116, 'move');
  const secondNode = easedProgress(frame, 108, 145, 'enterEmphasis');
  const secondLeg = easedProgress(frame, 136, 182, 'move');
  const finalFail = easedProgress(frame, 176, 216, 'enterEmphasis');
  const consequence = easedProgress(frame, 210, 252, 'enter');
  const finalPush = easedProgress(frame, 242, 276, 'move');
  const cascade = Math.max(firstLeg * 0.48, 0.48 + secondLeg * 0.52);
  const pathProps = evolvePath(Math.min(1, cascade), ERROR_PATH);
  const pulse = getPointAtLength(ERROR_PATH, ERROR_PATH_LENGTH * Math.max(0.001, Math.min(1, cascade))) ?? {x: 185, y: 785};
  const nodes = [
    {x: 185, label: '47 × 10', value: '470', state: 0},
    {x: 540, label: '47 × 8', value: '366', state: Math.max(fail, secondNode)},
    {x: 895, label: 'SUMME', value: '836', state: finalFail},
  ];
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={55} y={395} width={970 * panel} height={790} rx={64} fill={C.dark} opacity={0.98 * panel} />
      <rect x={55} y={395} width={485 * firstLeg} height={790} rx={64} fill={C.red} opacity={0.18 * firstLeg} />
      <rect x={540} y={395} width={485 * secondLeg} height={790} rx={64} fill={C.red} opacity={0.23 * secondLeg} />
      <g transform={`translate(0, ${-finalPush * 45}) scale(${1 + finalPush * 0.035})`}>
        <text x={110} y={505} fontFamily="Arial" fontSize={58} fontWeight={950} fill={C.white}>Ein Fehler reicht.</text>
        <text x={110} y={558} fontFamily="Arial" fontSize={28} fontWeight={800} fill="#CDC6D9">Ein falscher Schritt kann abhängige Schritte mitziehen.</text>
        <path d={ERROR_PATH} fill="none" stroke="#5A5369" strokeWidth={18} strokeLinecap="round" />
        <path d={ERROR_PATH} fill="none" stroke={C.redField} strokeWidth={12} strokeLinecap="round" strokeDasharray={pathProps.strokeDasharray} strokeDashoffset={pathProps.strokeDashoffset} />
        {nodes.map((node, index) => {
          const state = node.state;
          const fill = state > 0.35 ? C.redField : index === 0 ? C.greenField : C.white;
          const stroke = state > 0.35 ? '#FFDFE5' : index === 0 ? '#DFF5EC' : C.accentSoft;
          return (
            <ObjectTransformation key={node.label} progress={0.72 + Math.max(panel, state) * 0.28}>
              <circle cx={node.x} cy={785} r={96} fill={fill} stroke={stroke} strokeWidth={7} />
              <text x={node.x} y={758} textAnchor="middle" fontFamily="Arial" fontSize={23} fontWeight={900} fill={state > 0.35 ? C.white : C.dark}>{node.label}</text>
              <text x={node.x} y={815} textAnchor="middle" fontFamily="Arial" fontSize={50} fontWeight={950} fill={state > 0.35 ? C.white : C.dark}>{node.value}</text>
            </ObjectTransformation>
          );
        })}
        <circle cx={pulse.x} cy={pulse.y} r={17 + Math.sin(frame * 0.45) * 3} fill="#FFF2F4" stroke={C.red} strokeWidth={8} opacity={Math.max(firstLeg, secondLeg)} />
      </g>
      <rect x={160} y={1080} width={760 * consequence} height={100} rx={38} fill={C.redField} opacity={consequence} />
      <text x={540} y={1144} textAnchor="middle" fontFamily="Arial" fontSize={34} fontWeight={950} fill={C.white} opacity={consequence}>FALSCHER SCHRITT → FALSCHE SUMME</text>
    </svg>
  );
};

const TOOL_PATH = 'M 150 810 C 275 810, 310 810, 390 810';

// REMOTION_BEAT: math-06-tool-route
const ToolRouteBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const inputField = easedProgress(frame, 0, 24, 'enterEmphasis');
  const route = easedProgress(frame, 20, 70, 'move');
  const returnField = easedProgress(frame, 170, 215, 'enterEmphasis');
  const pathProps = evolvePath(route, TOOL_PATH);
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={470} width={330 * inputField} height={700} fill={C.accentSoft} opacity={0.75} />
      <rect x={0} y={1040} width={1080 * returnField} height={250} fill={C.greenSoft} opacity={0.82} />
      <text x={95} y={440} fontFamily="Arial" fontSize={58} fontWeight={950} fill={C.ink}>Werkzeug statt Raten</text>
      <g>
        <circle cx={150} cy={810} r={82} fill={C.accent} />
        <text x={150} y={792} textAnchor="middle" fontFamily="Arial" fontSize={21} fontWeight={900} fill={C.white}>MODELL</text>
        <text x={150} y={835} textAnchor="middle" fontFamily="Arial" fontSize={34} fontWeight={950} fill={C.white}>47×18</text>
      </g>
      <path d={TOOL_PATH} fill="none" stroke={C.white} strokeWidth={22} strokeLinecap="round" />
      <path d={TOOL_PATH} fill="none" stroke={C.accent} strokeWidth={9} strokeLinecap="round" strokeDasharray={pathProps.strokeDasharray} strokeDashoffset={pathProps.strokeDashoffset} />
      <TerminalMock frame={frame} />
    </svg>
  );
};

// REMOTION_BEAT: math-07-verified-answer
const VerifiedAnswerBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const returnProgress = easedProgress(frame, 150, 206, 'move');
  const finalEquation = easedProgress(frame, 205, 246, 'enterEmphasis');
  const x = interpolate(returnProgress, [0, 1], [790, 175]);
  const y = interpolate(returnProgress, [0, 1], [980, 1160]);
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <ObjectTransformation progress={returnProgress}>
        <circle cx={x} cy={y} r={72} fill={C.green} />
        <text x={x} y={y + 20} textAnchor="middle" fontFamily="Arial" fontSize={56} fontWeight={950} fill={C.white}>846</text>
      </ObjectTransformation>
      <g opacity={finalEquation} transform={`translate(${interpolate(finalEquation, [0, 1], [90, 0])}, 0)`}>
        <text x={370} y={1190} fontFamily="Arial" fontSize={72} fontWeight={950} fill={C.ink}>47 × 18 =</text>
        <text x={770} y={1190} fontFamily="Arial" fontSize={86} fontWeight={950} fill={C.green}>846</text>
      </g>
    </svg>
  );
};

// REMOTION_BEAT: math-08-final-rule
const FinalRuleBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const compare = easedProgress(frame, 0, 20, 'enterEmphasis');
  const wrongExit = easedProgress(frame, 30, 62, 'exit');
  const correctLock = easedProgress(frame, 50, 92, 'enterEmphasis');
  const verdictField = easedProgress(frame, 88, 132, 'enterEmphasis');
  const wordOne = easedProgress(frame, 94, 122, 'enter');
  const wordTwo = easedProgress(frame, 116, 146, 'enterEmphasis');
  const categories = easedProgress(frame, 142, 184, 'enter');
  const check = easedProgress(frame, 180, 212, 'move');
  const finalSweep = easedProgress(frame, 204, 228, 'enterEmphasis');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={370} width={540 * compare * (1 - wrongExit)} height={380} fill={C.redSoft} opacity={0.86} />
      <rect x={1080 - 540 * compare} y={370} width={540 * compare + 540 * correctLock} height={380} fill={C.greenSoft} opacity={0.92} />
      <text x={150} y={590} fontFamily="Arial" fontSize={78} fontWeight={950} fill={C.ink}>47 × 18 =</text>
      <g opacity={compare * (1 - wrongExit)} transform={`translate(${-wrongExit * 120}, 0)`}>
        <text x={650} y={590} fontFamily="Arial" fontSize={92} fontWeight={950} fill={C.red}>836</text>
        <line x1={635} y1={550} x2={855} y2={605} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
      </g>
      <KineticNumber value="846" progress={correctLock} x={650} y={590} size={92} spacing={68} fromColor={C.green} toColor={C.green} />
      <rect x={70} y={785} width={940 * verdictField} height={330} rx={58} fill={C.accentSoft} opacity={0.95 * verdictField} />
      <text x={125} y={900} fontFamily="Arial" fontSize={78} fontWeight={950} fill={C.ink} opacity={wordOne} transform={`translate(0, ${(1 - wordOne) * 26})`}>RECHNUNG</text>
      <text x={125} y={1035} fontFamily="Arial" fontSize={118} fontWeight={950} fill={C.accent} opacity={wordTwo} transform={`translate(0, ${(1 - wordTwo) * 30})`}>PRÜFEN.</text>
      {['GELD', 'MESSWERTE', 'PROZENTE'].map((label, index) => {
        const p = Math.max(0, Math.min(1, categories * 1.35 - index * 0.18));
        return (
          <g key={label} opacity={p} transform={`translate(${125 + index * 290}, ${1160 + (1 - p) * 30})`}>
            <rect width={245} height={86} rx={30} fill={index === 0 ? C.greenSoft : index === 1 ? C.accentSoft : C.redSoft} />
            <text x={122} y={55} textAnchor="middle" fontFamily="Arial" fontSize={24} fontWeight={950} fill={C.ink}>{label}</text>
          </g>
        );
      })}
      <circle cx={900} cy={965} r={95 * check} fill={C.green} opacity={check} />
      <path d="M 850 965 L 885 1002 L 955 920" fill="none" stroke={C.white} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={220} strokeDashoffset={220 * (1 - check)} />
      <rect x={0} y={1300} width={1080 * finalSweep} height={140} fill={C.green} opacity={0.9 * finalSweep} />
      <text x={540} y={1387} textAnchor="middle" fontFamily="Arial" fontSize={34} fontWeight={950} fill={C.white} opacity={finalSweep}>RECHNER ODER RECHENTOOL BENUTZEN</text>
    </svg>
  );
};

const SceneOne: React.FC = () => (
  <AbsoluteFill>
    <ContextLabel tone="red">KI-ANTWORT ≠ RECHENBEWEIS</ContextLabel>
    <WrongAnswerBeat />
    <EquationFractureBeat />
    <Caption text="Sprachmodell ≠ Taschenrechner" duration={210} />
  </AbsoluteFill>
);

const SceneTwo: React.FC = () => (
  <AbsoluteFill>
    <ContextLabel>WIE DER TEXT ENTSTEHT</ContextLabel>
    <TokenStreamBeat />
    <ProbabilityShiftBeat />
    <Caption text="Es wählt wahrscheinliche nächste Tokens" duration={290} />
  </AbsoluteFill>
);

const SceneThree: React.FC = () => (
  <AbsoluteFill>
    <ContextLabel tone="red">FEHLERKASKADE</ContextLabel>
    <ErrorCascadeBeat />
    <Caption text="Ein Fehler kann sich weiterziehen" duration={280} />
  </AbsoluteFill>
);

const SceneFour: React.FC = () => (
  <AbsoluteFill>
    <ContextLabel tone="green">TOOL-ROUTE</ContextLabel>
    <ToolRouteBeat />
    <VerifiedAnswerBeat />
    <Caption text="Rechentool übernimmt die Berechnung" duration={250} />
  </AbsoluteFill>
);

const SceneFive: React.FC = () => (
  <AbsoluteFill>
    <ContextLabel tone="green">DIE REGEL</ContextLabel>
    <FinalRuleBeat />
    <Caption text="Wichtige Zahlen: Rechnung prüfen" duration={230} />
  </AbsoluteFill>
);

export type ReelAIArithmeticReasoningProps = {
  showCaptions?: boolean;
};

export const ReelAIArithmeticReasoning: React.FC<ReelAIArithmeticReasoningProps> = ({showCaptions = true}) => (
  <AbsoluteFill style={{background: C.bg, color: C.ink}}>
    <Backdrop />
    <Sequence from={0} durationInFrames={210} name="Hook — wrong answer"><SceneOne /></Sequence>
    <Sequence from={210} durationInFrames={290} name="Token prediction"><SceneTwo /></Sequence>
    <Sequence from={500} durationInFrames={280} name="Error cascade"><SceneThree /></Sequence>
    <Sequence from={780} durationInFrames={250} name="Tool route"><SceneFour /></Sequence>
    <Sequence from={1030} durationInFrames={230} name="Final verdict"><SceneFive /></Sequence>
    {!showCaptions ? <style>{`[data-arithmetic-caption] { display: none !important; }`}</style> : null}
  </AbsoluteFill>
);
