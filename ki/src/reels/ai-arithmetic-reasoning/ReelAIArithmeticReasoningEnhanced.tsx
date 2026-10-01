import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easedProgress} from '../../motion/easing';
import {
  ReelAIArithmeticReasoning as BaseArithmeticReel,
  type ReelAIArithmeticReasoningProps,
} from './ReelAIArithmeticReasoning';

const COLORS = {
  accent: '#6E45C9',
  accentSoft: '#D7C1F4',
  red: '#D33E58',
  redSoft: '#EFB0BC',
  redField: '#E68A9C',
  green: '#1E835C',
  greenSoft: '#B9E2D2',
  terminal: '#17151F',
  white: '#FFFFFF',
} as const;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const windowed = (
  frame: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
): number =>
  clamp01(
    easedProgress(frame, enterStart, enterEnd, 'enterEmphasis') *
      (1 - easedProgress(frame, exitStart, exitEnd, 'exit')),
  );

const SceneOneOverlay: React.FC<{frame: number}> = ({frame}) => {
  const impact = windowed(frame, 1, 12, 18, 34);
  const secondImpact = windowed(frame, 8, 15, 16, 27);
  const fractureField = windowed(frame, 34, 62, 78, 102);
  const mathTakeover = windowed(frame, 82, 118, 126, 154);
  const verdictLock = windowed(frame, 126, 158, 166, 196);
  const finalPush = easedProgress(frame, 168, 204, 'move');

  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <g opacity={impact}>
        <rect x={0} y={315} width={1080} height={610} fill={COLORS.redSoft} opacity={0.38} />
        <path d="M 120 390 L 965 900" stroke={COLORS.red} strokeWidth={34} strokeLinecap="round" opacity={0.32} />
      </g>

      <g opacity={secondImpact}>
        <rect x={0} y={260} width={1080} height={760} fill={COLORS.accent} opacity={0.28} />
        <circle cx={810} cy={690} r={300} fill={COLORS.white} opacity={0.16} />
      </g>

      <g opacity={fractureField}>
        <rect x={0} y={845} width={540} height={470} fill={COLORS.accentSoft} opacity={0.34} />
        <rect x={540} y={845} width={540} height={470} fill={COLORS.redSoft} opacity={0.42} />
      </g>

      <g opacity={mathTakeover}>
        <rect x={1080 - 900 * mathTakeover} y={430} width={900 * mathTakeover} height={820} fill={COLORS.redField} opacity={0.2} />
        <circle cx={790} cy={760} r={330 * mathTakeover} fill={COLORS.red} opacity={0.1} />
      </g>

      <g opacity={verdictLock}>
        <rect x={80} y={860} width={920} height={380} rx={72} fill={COLORS.red} opacity={0.16} />
        <path d="M 690 875 L 940 1190" stroke={COLORS.white} strokeWidth={18} strokeLinecap="round" opacity={0.72} />
      </g>

      <rect
        x={0}
        y={1260 - finalPush * 120}
        width={1080 * finalPush}
        height={120}
        fill={COLORS.red}
        opacity={0.16 * finalPush}
      />
    </svg>
  );
};

const SceneTwoOverlay: React.FC<{frame: number}> = ({frame}) => {
  const lane = windowed(frame, 0, 24, 45, 72);
  const scan = windowed(frame, 52, 82, 102, 132);
  const candidates = windowed(frame, 104, 134, 150, 182);
  const winner = windowed(frame, 158, 190, 205, 236);
  const commit = easedProgress(frame, 224, 278, 'move');

  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={510} width={1080} height={430} fill={COLORS.accentSoft} opacity={0.28 * lane} />

      <g opacity={scan}>
        <rect x={0} y={430} width={1080} height={610} fill={COLORS.accent} opacity={0.12} />
        <rect x={80 + 780 * scan} y={470} width={150} height={520} rx={75} fill={COLORS.white} opacity={0.55} />
      </g>

      <g opacity={candidates}>
        <rect x={40} y={865} width={1000} height={500} rx={72} fill={COLORS.redSoft} opacity={0.22} />
        <rect x={70} y={900} width={940 * candidates} height={90} rx={45} fill={COLORS.accent} opacity={0.18} />
      </g>

      <g opacity={winner}>
        <rect x={0} y={820} width={1080} height={560} fill={COLORS.greenSoft} opacity={0.28} />
        <circle cx={835} cy={760} r={250 * winner} fill={COLORS.accent} opacity={0.13} />
      </g>

      <rect x={0} y={500} width={1080 * commit} height={860} fill={COLORS.greenSoft} opacity={0.2 * commit} />
    </svg>
  );
};

const SceneThreeOverlay: React.FC<{frame: number}> = ({frame}) => {
  const first = easedProgress(frame, 22, 68, 'enterEmphasis');
  const second = easedProgress(frame, 76, 126, 'enterEmphasis');
  const third = easedProgress(frame, 130, 182, 'enterEmphasis');
  const consequence = easedProgress(frame, 188, 238, 'move');
  const settle = easedProgress(frame, 235, 274, 'move');

  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={55} y={395} width={325 * first} height={790} rx={62} fill={COLORS.green} opacity={0.2 * first} />
      <rect x={377} y={395} width={326 * second} height={790} fill={COLORS.redSoft} opacity={0.46 * second} />
      <rect x={700} y={395} width={325 * third} height={790} rx={62} fill={COLORS.red} opacity={0.42 * third} />

      <g opacity={consequence}>
        <rect x={55} y={1045} width={970} height={220} rx={48} fill={COLORS.red} opacity={0.42} />
        <path d="M 150 1148 L 930 1148" stroke={COLORS.white} strokeWidth={22} strokeLinecap="round" opacity={0.76} />
      </g>

      <rect
        x={0}
        y={420 - settle * 70}
        width={1080}
        height={760}
        fill={COLORS.redSoft}
        opacity={0.12 * settle}
      />
    </svg>
  );
};

const SceneFourOverlay: React.FC<{frame: number}> = ({frame}) => {
  const input = windowed(frame, 0, 36, 52, 78);
  const toolFocus = windowed(frame, 46, 92, 105, 132);
  const execution = windowed(frame, 96, 138, 150, 176);
  const verified = windowed(frame, 148, 190, 204, 228);
  const returnRoute = easedProgress(frame, 196, 246, 'move');

  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={455} width={390 * input} height={760} fill={COLORS.accentSoft} opacity={0.34 * input} />

      <g opacity={toolFocus}>
        <rect x={315} y={500} width={710} height={650} rx={64} fill={COLORS.terminal} opacity={0.2} />
        <path d="M 340 845 L 980 845" stroke={COLORS.accent} strokeWidth={26} strokeLinecap="round" opacity={0.38} />
      </g>

      <g opacity={execution}>
        <rect x={330} y={665} width={690} height={390} rx={52} fill={COLORS.green} opacity={0.22} />
        <circle cx={820} cy={875} r={230 * execution} fill={COLORS.greenSoft} opacity={0.24} />
      </g>

      <g opacity={verified}>
        <rect x={0} y={965} width={1080} height={360} fill={COLORS.greenSoft} opacity={0.36} />
        <path d="M 890 800 C 760 965, 520 1070, 190 1165" fill="none" stroke={COLORS.green} strokeWidth={24} strokeLinecap="round" opacity={0.45} />
      </g>

      <rect x={0} y={1030} width={1080 * returnRoute} height={300} fill={COLORS.greenSoft} opacity={0.22 * returnRoute} />
    </svg>
  );
};

const SceneFiveOverlay: React.FC<{frame: number}> = ({frame}) => {
  const compare = easedProgress(frame, 0, 22, 'enterEmphasis');
  const greenTakeover = easedProgress(frame, 34, 74, 'move');
  const decisionSweep = easedProgress(frame, 22, 60, 'enterEmphasis');
  const verdict = windowed(frame, 82, 122, 132, 156);
  const categories = windowed(frame, 134, 172, 180, 202);
  const finish = easedProgress(frame, 178, 226, 'move');

  return (
    <svg width="1080" height="1500" style={{position: 'absolute', inset: 0}}>
      <g opacity={compare}>
        <rect x={0} y={320} width={540 * (1 - greenTakeover)} height={560} fill={COLORS.red} opacity={0.28} />
        <rect x={540 - 540 * greenTakeover} y={320} width={540 + 540 * greenTakeover} height={560} fill={COLORS.green} opacity={0.28} />
      </g>

      <rect x={0} y={300} width={1080 * decisionSweep} height={650} fill={COLORS.green} opacity={0.28 * decisionSweep} />

      <g opacity={verdict}>
        <rect x={55} y={760} width={970} height={390} rx={68} fill={COLORS.accent} opacity={0.22} />
        <circle cx={900} cy={955} r={190 * verdict} fill={COLORS.green} opacity={0.18} />
      </g>

      <g opacity={categories}>
        <rect x={0} y={1080} width={360} height={300} fill={COLORS.green} opacity={0.34} />
        <rect x={360} y={1080} width={360} height={300} fill={COLORS.accent} opacity={0.3} />
        <rect x={720} y={1080} width={360} height={300} fill={COLORS.red} opacity={0.3} />
      </g>

      <rect x={0} y={1210 - finish * 90} width={1080 * finish} height={190} fill={COLORS.green} opacity={0.3 * finish} />
    </svg>
  );
};

const SemanticMotionOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 210) return <SceneOneOverlay frame={frame} />;
  if (frame < 500) return <SceneTwoOverlay frame={frame - 210} />;
  if (frame < 780) return <SceneThreeOverlay frame={frame - 500} />;
  if (frame < 1030) return <SceneFourOverlay frame={frame - 780} />;
  return <SceneFiveOverlay frame={frame - 1030} />;
};

export const ReelAIArithmeticReasoningEnhanced: React.FC<ReelAIArithmeticReasoningProps> = ({
  showCaptions = true,
}) => (
  <AbsoluteFill>
    <BaseArithmeticReel showCaptions={showCaptions} />
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 20}}>
      <SemanticMotionOverlay />
    </AbsoluteFill>
  </AbsoluteFill>
);
