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
  muted: '#7D778A',
  accent: '#6E45C9',
  accentSoft: '#D9C8F8',
  line: '#DCD6E6',
  red: '#D9485F',
  redSoft: '#F7D9DE',
  green: '#228B62',
  greenSoft: '#D9F1E7',
  white: '#FFFFFF',
  terminal: '#17151F',
} as const;

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.32,
        backgroundImage:
          'linear-gradient(rgba(110,69,201,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(110,69,201,.055) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 700,
        height: 700,
        left: 610,
        top: -260,
        borderRadius: 999,
        background: 'radial-gradient(circle, rgba(185,140,255,.22), rgba(185,140,255,0) 68%)',
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
      const local = Math.max(0, Math.min(1, progress * 1.25 - index * 0.08));
      const offset = interpolate(local, [0, 1], [0, index === value.length - 1 ? -14 : -4]);
      const scale = interpolate(local, [0, 1], [1, index === value.length - 1 ? 1.08 : 1]);
      return (
        <text
          key={`${digit}-${index}`}
          x={x + index * spacing}
          y={y + offset}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={size}
          fontWeight={950}
          fill={local > 0.34 ? toColor : fromColor}
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
  const scale = interpolate(progress, [0, 1], [0.96, 1]);
  const rise = interpolate(progress, [0, 1], [14, 0]);
  return (
    <g opacity={0.35 + progress * 0.65} transform={`translate(${x}, ${y + rise}) scale(${scale})`}>
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
  return (
    <g>
      <text x={150} y={1040} fontFamily="Arial" fontSize={20} fontWeight={900} letterSpacing={3} fill={C.muted}>
        BEISPIEL — NÄCHSTE TOKEN-KANDIDATEN
      </text>
      {data.map((item, index) => {
        const delay = staggerDelay(index, 5);
        const p = easedProgress(frame, 74 + delay, 110 + delay, 'enterEmphasis');
        const width = item.value * 9.4 * p;
        return (
          <g key={item.label}>
            <text x={150} y={1110 + index * 92} fontFamily="Arial" fontSize={34} fontWeight={900} fill={C.ink}>
              {item.label}
            </text>
            <rect x={250} y={1078 + index * 92} width={620} height={44} rx={22} fill="#ECE8F1" />
            <rect x={250} y={1078 + index * 92} width={width} height={44} rx={22} fill={item.color} opacity={0.92} />
          </g>
        );
      })}
    </g>
  );
};

const TerminalMock: React.FC<{frame: number}> = ({frame}) => {
  const type = easedProgress(frame, 46, 78, 'move');
  const result = easedProgress(frame, 78, 94, 'enterEmphasis');
  const expression = '47 * 18';
  const shown = expression.slice(0, Math.floor(type * expression.length));
  return (
    <g>
      <rect x={380} y={620} width={570} height={430} rx={38} fill={C.terminal} />
      <circle cx={426} cy={665} r={9} fill={C.red} />
      <circle cx={456} cy={665} r={9} fill="#E6B94C" />
      <circle cx={486} cy={665} r={9} fill={C.green} />
      <text x={430} y={760} fontFamily="monospace" fontSize={32} fontWeight={700} fill="#CFC9DB">
        $ calculator
      </text>
      <text x={430} y={830} fontFamily="monospace" fontSize={48} fontWeight={800} fill={C.white}>
        {shown}
        <tspan fill={C.accentSoft}>_</tspan>
      </text>
      <text
        x={430}
        y={935}
        fontFamily="monospace"
        fontSize={76}
        fontWeight={950}
        fill={C.green}
        opacity={result}
        transform={`translate(0, ${(1 - result) * 16})`}
      >
        846
      </text>
    </g>
  );
};

// REMOTION_BEAT: math-01-wrong-answer
const WrongAnswerBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const snap = easedProgress(frame, 6, 16, 'enterEmphasis');
  const settle = easedProgress(frame, followThrough(16, 1), 32, 'move');
  const compress = easedProgress(frame, 165, 202, 'move');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(0, ${interpolate(compress, [0, 1], [0, -170])}) scale(${interpolate(compress, [0, 1], [1, 0.72])})`}>
        <text x={110} y={760} fontFamily="Arial" fontSize={116} fontWeight={950} fill={C.ink}>
          47 × 18 =
        </text>
        <KineticNumber value="836" progress={snap} x={690} y={760} size={116} spacing={84} />
        <text
          x={690}
          y={860}
          fontFamily="Arial"
          fontSize={24}
          fontWeight={900}
          letterSpacing={4}
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
  const fracture = easedProgress(frame, 14, 30, 'move');
  const verdict = easedProgress(frame, 58, 90, 'enter');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <path
        d="M 650 610 L 905 900"
        stroke={C.red}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={390}
        strokeDashoffset={390 * (1 - fracture)}
      />
      <ObjectTransformation progress={verdict}>
        <text x={150} y={1030} fontFamily="Arial" fontSize={48} fontWeight={950} fill={C.ink}>
          SPRACHE
        </text>
        <text x={150} y={1090} fontFamily="Arial" fontSize={28} fontWeight={800} fill={C.muted}>
          kann sicher klingen
        </text>
        <text x={650} y={1030} fontFamily="Arial" fontSize={48} fontWeight={950} fill={C.red}>
          RECHNUNG
        </text>
        <text x={650} y={1090} fontFamily="Arial" fontSize={28} fontWeight={800} fill={C.red}>
          muss trotzdem stimmen
        </text>
      </ObjectTransformation>
    </svg>
  );
};

const TOKEN_PATH = 'M 120 730 C 300 610, 520 610, 690 720 S 880 850, 980 720';
const TOKEN_PATH_LENGTH = getLength(TOKEN_PATH);

// REMOTION_BEAT: math-03-token-stream
const TokenStreamBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = easedProgress(frame, 24, 88, 'move');
  const pathProps = evolvePath(draw, TOKEN_PATH);
  const tokens = ['47', '×', '18', '=', '?'];
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <path d={TOKEN_PATH} fill="none" stroke={C.line} strokeWidth={20} strokeLinecap="round" />
      <path
        d={TOKEN_PATH}
        fill="none"
        stroke={C.accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={pathProps.strokeDasharray}
        strokeDashoffset={pathProps.strokeDashoffset}
      />
      {tokens.map((token, index) => {
        const delay = staggerDelay(index, 3);
        const enter = easedProgress(frame, 4 + delay, 20 + delay, 'enterEmphasis');
        const travel = easedProgress(frame, 28 + delay, 92 + delay, 'move');
        const fraction = Math.min(0.94, 0.08 + index * 0.12 + travel * 0.12);
        const point = getPointAtLength(TOKEN_PATH, TOKEN_PATH_LENGTH * fraction) ?? {x: 120, y: 730};
        return (
          <g key={`${token}-${index}`} opacity={enter} transform={`translate(${point.x}, ${point.y})`}>
            <circle r={42} fill={index === 4 ? C.accent : C.white} stroke={C.accentSoft} strokeWidth={4} />
            <text y={12} textAnchor="middle" fontFamily="Arial" fontSize={31} fontWeight={950} fill={index === 4 ? C.white : C.ink}>
              {token}
            </text>
          </g>
        );
      })}
      <text x={120} y={560} fontFamily="Arial" fontSize={54} fontWeight={950} fill={C.ink}>
        Schritt für Schritt
      </text>
      <text x={120} y={610} fontFamily="Arial" fontSize={27} fontWeight={800} fill={C.muted}>
        Text und Zahlen laufen durch dieselbe Token-Pipeline.
      </text>
    </svg>
  );
};

// REMOTION_BEAT: math-04-probability-shift
const ProbabilityShiftBeat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <BarChart frame={frame} />
    </svg>
  );
};

const ERROR_PATH = 'M 190 760 C 330 600, 455 600, 540 760 S 735 920, 895 760';
const ERROR_PATH_LENGTH = getLength(ERROR_PATH);

// REMOTION_BEAT: math-05-error-cascade
const ErrorCascadeBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const fail = easedProgress(frame, 28, 42, 'enterEmphasis');
  const cascade = easedProgress(frame, 40, 104, 'move');
  const pathProps = evolvePath(cascade, ERROR_PATH);
  const pulse = getPointAtLength(ERROR_PATH, ERROR_PATH_LENGTH * Math.max(0.001, cascade)) ?? {x: 190, y: 760};
  const nodes = [
    {x: 190, label: '47 × 10', value: '470'},
    {x: 540, label: '47 × 8', value: '366'},
    {x: 895, label: 'SUMME', value: '836'},
  ];
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <text x={110} y={470} fontFamily="Arial" fontSize={58} fontWeight={950} fill={C.ink}>
        Ein Fehler reicht.
      </text>
      <text x={110} y={525} fontFamily="Arial" fontSize={28} fontWeight={800} fill={C.muted}>
        Danach können abhängige Schritte sauber — aber falsch — weiterlaufen.
      </text>
      <path d={ERROR_PATH} fill="none" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      <path
        d={ERROR_PATH}
        fill="none"
        stroke={C.red}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={pathProps.strokeDasharray}
        strokeDashoffset={pathProps.strokeDashoffset}
      />
      {nodes.map((node, index) => {
        const affected = index === 0 ? 0 : Math.max(0, Math.min(1, cascade * 1.5 - (index - 1) * 0.45));
        const state = index === 1 ? Math.max(fail, affected) : affected;
        return (
          <ObjectTransformation key={node.label} progress={0.72 + state * 0.28}>
            <circle cx={node.x} cy={760} r={92} fill={state > 0.34 ? C.redSoft : C.greenSoft} stroke={state > 0.34 ? C.red : C.green} strokeWidth={6} />
            <text x={node.x} y={735} textAnchor="middle" fontFamily="Arial" fontSize={24} fontWeight={900} fill={C.muted}>
              {node.label}
            </text>
            <text x={node.x} y={795} textAnchor="middle" fontFamily="Arial" fontSize={50} fontWeight={950} fill={state > 0.34 ? C.red : C.green}>
              {node.value}
            </text>
          </ObjectTransformation>
        );
      })}
      <circle cx={pulse.x} cy={pulse.y} r={16 + Math.sin(frame * 0.5) * 3} fill={C.red} opacity={cascade} />
      <text x={350} y={1010} fontFamily="Arial" fontSize={42} fontWeight={950} fill={C.red} opacity={easedProgress(frame, 100, 128, 'enter')}>
        FALSCHER ZWISCHENSCHRITT → FALSCHE SUMME
      </text>
    </svg>
  );
};

const TOOL_PATH = 'M 155 795 C 280 795, 300 795, 385 795';

// REMOTION_BEAT: math-06-tool-route
const ToolRouteBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const route = easedProgress(frame, 20, 52, 'move');
  const pathProps = evolvePath(route, TOOL_PATH);
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <text x={100} y={470} fontFamily="Arial" fontSize={58} fontWeight={950} fill={C.ink}>
        Werkzeug statt Raten
      </text>
      <g>
        <circle cx={155} cy={795} r={76} fill={C.accentSoft} />
        <text x={155} y={782} textAnchor="middle" fontFamily="Arial" fontSize={22} fontWeight={900} fill={C.accent}>
          MODELL
        </text>
        <text x={155} y={822} textAnchor="middle" fontFamily="Arial" fontSize={34} fontWeight={950} fill={C.ink}>
          47×18
        </text>
      </g>
      <path d={TOOL_PATH} fill="none" stroke={C.line} strokeWidth={18} strokeLinecap="round" />
      <path
        d={TOOL_PATH}
        fill="none"
        stroke={C.accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={pathProps.strokeDasharray}
        strokeDashoffset={pathProps.strokeDashoffset}
      />
      <TerminalMock frame={frame} />
    </svg>
  );
};

// REMOTION_BEAT: math-07-verified-answer
const VerifiedAnswerBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const returnProgress = easedProgress(frame, 122, 148, 'move');
  const x = interpolate(returnProgress, [0, 1], [780, 170]);
  const y = interpolate(returnProgress, [0, 1], [1055, 1180]);
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <ObjectTransformation progress={returnProgress}>
        <circle cx={x} cy={y} r={66} fill={C.green} />
        <text x={x} y={y + 20} textAnchor="middle" fontFamily="Arial" fontSize={54} fontWeight={950} fill={C.white}>
          846
        </text>
      </ObjectTransformation>
      <text x={260} y={1198} fontFamily="Arial" fontSize={34} fontWeight={900} fill={C.green} opacity={returnProgress}>
        berechnet → zurück zur Erklärung
      </text>
    </svg>
  );
};

// REMOTION_BEAT: math-08-final-rule
const FinalRuleBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const wrongExit = easedProgress(frame, 18, 36, 'exit');
  const correctLock = easedProgress(frame, 30, 54, 'enterEmphasis');
  const wordOne = easedProgress(frame, 58, 78, 'enter');
  const wordTwo = easedProgress(frame, 66, 96, 'enterEmphasis');
  const check = easedProgress(frame, 92, 112, 'move');
  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <text x={160} y={610} fontFamily="Arial" fontSize={78} fontWeight={950} fill={C.ink}>
        47 × 18 =
      </text>
      <g opacity={1 - wrongExit} transform={`translate(${wrongExit * -70}, 0)`}>
        <text x={650} y={610} fontFamily="Arial" fontSize={92} fontWeight={950} fill={C.red}>
          836
        </text>
        <line x1={640} y1={575} x2={850} y2={615} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      </g>
      <KineticNumber value="846" progress={correctLock} x={650} y={610} size={92} spacing={68} fromColor={C.green} toColor={C.green} />
      <text x={130} y={880} fontFamily="Arial" fontSize={78} fontWeight={950} fill={C.ink} opacity={wordOne} transform={`translate(0, ${(1 - wordOne) * 24})`}>
        RECHNUNG
      </text>
      <text x={130} y={1005} fontFamily="Arial" fontSize={112} fontWeight={950} fill={C.accent} opacity={wordTwo} transform={`translate(0, ${(1 - wordTwo) * 28})`}>
        PRÜFEN.
      </text>
      <path
        d="M 760 905 L 820 970 L 955 825"
        fill="none"
        stroke={C.green}
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={300}
        strokeDashoffset={300 * (1 - check)}
      />
      <text x={130} y={1120} fontFamily="Arial" fontSize={28} fontWeight={800} fill={C.muted} opacity={easedProgress(frame, followThrough(96, 2), 126, 'enter')}>
        Geld · Messwerte · Prozente → Rechner oder Rechentool
      </text>
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

export const ReelAIArithmeticReasoning: React.FC<ReelAIArithmeticReasoningProps> = ({
  showCaptions = true,
}) => (
  <AbsoluteFill style={{background: C.bg, color: C.ink}}>
    <Backdrop />
    <Sequence from={0} durationInFrames={210} name="Hook — wrong answer">
      <SceneOne />
    </Sequence>
    <Sequence from={210} durationInFrames={290} name="Token prediction">
      <SceneTwo />
    </Sequence>
    <Sequence from={500} durationInFrames={280} name="Error cascade">
      <SceneThree />
    </Sequence>
    <Sequence from={780} durationInFrames={250} name="Tool route">
      <SceneFour />
    </Sequence>
    <Sequence from={1030} durationInFrames={230} name="Final verdict">
      <SceneFive />
    </Sequence>
    {!showCaptions ? (
      <style>{`[data-arithmetic-caption] { display: none !important; }`}</style>
    ) : null}
  </AbsoluteFill>
);
