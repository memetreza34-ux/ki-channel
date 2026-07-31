/**
 * TikTok-Style Animated Captions
 *
 * Features:
 * - Word-by-word highlighting
 * - Bold, high-contrast text
 * - Bouncy entrance animation
 * - Customizable colors
 *
 * Usage:
 * <TikTokCaption
 *   words={[
 *     { text: "This", start: 0, end: 15 },
 *     { text: "is", start: 15, end: 25 },
 *     { text: "viral", start: 25, end: 45 },
 *   ]}
 *   highlightColor="#FFE135"
 *   textColor="#FFFFFF"
 * />
 */

import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface Word {
  text: string;
  start: number;  // Frame when word starts
  end: number;    // Frame when word ends
}

interface TikTokCaptionProps {
  words: Word[];
  highlightColor?: string;
  textColor?: string;
  fontSize?: number;
}

export const TikTokCaption: React.FC<TikTokCaptionProps> = ({
  words,
  highlightColor = '#FFE135',
  textColor = '#FFFFFF',
  fontSize = 72
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find currently active word
  const activeWordIndex = words.findIndex(
    (word) => frame >= word.start && frame < word.end
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '0 40px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {words.map((word, index) => {
          // Entrance animation
          const entrance = spring({
            frame: frame - word.start,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          const scale = interpolate(entrance, [0, 1], [1.5, 1], {
            extrapolateRight: 'clamp',
          });

          const opacity = interpolate(entrance, [0, 1], [0, 1], {
            extrapolateRight: 'clamp',
          });

          const isActive = index === activeWordIndex;
          const hasAppeared = frame >= word.start;

          return (
            <span
              key={index}
              style={{
                fontSize,
                fontWeight: 900,
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                color: isActive ? highlightColor : textColor,
                textShadow: `
                  4px 4px 0 #000,
                  -4px -4px 0 #000,
                  4px -4px 0 #000,
                  -4px 4px 0 #000,
                  0 4px 0 #000,
                  0 -4px 0 #000,
                  4px 0 0 #000,
                  -4px 0 0 #000
                `,
                transform: `scale(${hasAppeared ? scale : 0})`,
                opacity: hasAppeared ? opacity : 0,
                transition: 'color 0.1s ease',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Alternative: Karaoke-style caption with single highlighted word
 */
export const KaraokeCaption: React.FC<{
  text: string;
  highlightIndex: number;
  highlightColor?: string;
}> = ({ text, highlightIndex, highlightColor = '#FFE135' }) => {
  const words = text.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        width: '100%',
        textAlign: 'center',
        fontSize: 64,
        fontWeight: 900,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            color: i === highlightIndex ? highlightColor : '#FFFFFF',
            textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
            marginRight: 12,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

/**
 * Caption with background box
 */
export const BoxCaption: React.FC<{
  text: string;
  backgroundColor?: string;
  textColor?: string;
}> = ({ text, backgroundColor = '#FF0050', textColor = '#FFFFFF' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 300 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '12%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: backgroundColor,
          padding: '16px 32px',
          borderRadius: 8,
          transform: `scale(${scale})`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: textColor,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
