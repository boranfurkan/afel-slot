import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { WinPatternType } from '@/lib/win-patterns';

interface WinningLineProps {
  pattern: number[];
  containerWidth: number;
  containerHeight: number;
  patternType: WinPatternType;
  color?: string;
  glowColor?: string;
  lineWidth?: number;
  animationDuration?: number;
  debug?: boolean;
}

const WinningLine: React.FC<WinningLineProps> = ({
  pattern,
  containerWidth,
  containerHeight,
  patternType,
  color = '#4DFF00',
  glowColor = 'rgba(77, 255, 0, 0.3)',
  lineWidth = 6,
  animationDuration = 2.5,
  debug = false,
}) => {
  // Calculate positions for each slot in the pattern
  const positions = useMemo(() => {
    return pattern.map((slotIndex) => {
      const row = Math.floor(slotIndex / 3);
      const col = slotIndex % 3;

      const paddingX = containerWidth * 0.04;
      const paddingY = containerHeight * 0.05;
      const gapX = containerWidth * 0.035;

      const availableWidth = containerWidth - paddingX * 2;
      const availableHeight = containerHeight - paddingY * 2;

      const cellWidth = availableWidth / 3 - (gapX * 2) / 3;
      const cellHeight = availableHeight / 3;

      return {
        x: paddingX + col * (cellWidth + gapX) + cellWidth / 2 + 30, // Added X offset
        y: paddingY + row * cellHeight + cellHeight / 2, // No Y offset needed
      };
    });
  }, [pattern, containerWidth, containerHeight]);

  // Generate SVG path data
  const pathData = useMemo(() => {
    if (positions.length < 2) return '';

    let pathData = `M ${positions[0].x} ${positions[0].y}`;
    for (let i = 1; i < positions.length; i++) {
      pathData += ` L ${positions[i].x} ${positions[i].y}`;
    }

    return pathData;
  }, [positions]);

  // Animation variants based on pattern type
  const variants = useMemo(() => {
    const baseTransition = {
      duration: animationDuration,
      ease: [0.22, 1, 0.36, 1],
      repeat: Infinity,
      repeatDelay: 0.2,
    };

    const isRow = patternType.startsWith('row');
    const isColumn = patternType.startsWith('col');
    const isDiagonal = patternType.startsWith('diag');
    const isSpecial = patternType === WinPatternType.SPECIAL;

    // Default animation for all pattern types
    const defaultAnimation = {
      line: {
        initial: { pathLength: 0, opacity: 0 },
        animate: {
          pathLength: [0, 1, 1, 0],
          opacity: [0.3, 1, 1, 0.3],
          strokeWidth: [lineWidth, lineWidth + 2, lineWidth + 2, lineWidth],
        },
        transition: {
          ...baseTransition,
          times: [0, 0.3, 0.7, 1],
        },
      },
      dot: {
        initial: { scale: 0 },
        animate: { scale: [0, 1.2, 1, 0] },
        transition: baseTransition,
      },
    };

    // Specific animations based on pattern type
    if (isRow) {
      return {
        ...defaultAnimation,
        line: {
          ...defaultAnimation.line,
          animate: {
            ...defaultAnimation.line.animate,
            x: [0, 6, -6, 0],
          },
        },
        dot: {
          ...defaultAnimation.dot,
          animate: {
            ...defaultAnimation.dot.animate,
            x: [0, 3, -3, 0],
          },
        },
      };
    }

    if (isColumn) {
      return {
        ...defaultAnimation,
        line: {
          ...defaultAnimation.line,
          animate: {
            ...defaultAnimation.line.animate,
            y: [0, 6, -6, 0],
          },
        },
        dot: {
          ...defaultAnimation.dot,
          animate: {
            ...defaultAnimation.dot.animate,
            y: [0, 3, -3, 0],
          },
        },
      };
    }

    if (isDiagonal) {
      return {
        ...defaultAnimation,
        line: {
          ...defaultAnimation.line,
          animate: {
            ...defaultAnimation.line.animate,
            scale: [1, 1.05, 1.05, 1],
            rotate: [0, 0.5, -0.5, 0],
            strokeWidth: [lineWidth, lineWidth + 3, lineWidth + 3, lineWidth],
          },
        },
        dot: {
          ...defaultAnimation.dot,
          animate: {
            ...defaultAnimation.dot.animate,
            rotate: [0, 180, 360, 540],
          },
        },
      };
    }

    if (isSpecial) {
      return {
        ...defaultAnimation,
        line: {
          ...defaultAnimation.line,
          animate: {
            ...defaultAnimation.line.animate,
            scale: [1, 1.08, 0.95, 1],
            filter: [
              'brightness(1)',
              'brightness(1.7)',
              'brightness(1.7)',
              'brightness(1)',
            ],
            strokeWidth: [
              lineWidth,
              lineWidth * 1.5,
              lineWidth * 1.5,
              lineWidth,
            ],
          },
        },
        dot: {
          ...defaultAnimation.dot,
          animate: {
            ...defaultAnimation.dot.animate,
            scale: [0, 1.5, 1.5, 0],
            filter: [
              'brightness(1)',
              'brightness(1.7)',
              'brightness(1.7)',
              'brightness(1)',
            ],
          },
        },
      };
    }

    return defaultAnimation;
  }, [patternType, animationDuration, lineWidth]);

  // Get pattern color based on type
  const patternColor = useMemo(() => {
    switch (patternType) {
      case WinPatternType.ROW_1:
      case WinPatternType.ROW_2:
      case WinPatternType.ROW_3:
        return color || '#4DFF00';
      case WinPatternType.COLUMN_1:
      case WinPatternType.COLUMN_2:
      case WinPatternType.COLUMN_3:
        return color || '#00BFFF';
      case WinPatternType.DIAGONAL_1:
      case WinPatternType.DIAGONAL_2:
        return color || '#FFD700';
      case WinPatternType.SPECIAL:
        return color || '#FF00FF';
      default:
        return color || '#4DFF00';
    }
  }, [patternType, color]);

  // Get glow color based on pattern color
  const patternGlowColor = useMemo(() => {
    if (glowColor) return glowColor;

    if (patternColor.startsWith('#')) {
      const r = parseInt(patternColor.slice(1, 3), 16);
      const g = parseInt(patternColor.slice(3, 5), 16);
      const b = parseInt(patternColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.3)`;
    }

    return patternColor.replace(/[^,]+(?=\))/, '0.3');
  }, [patternColor, glowColor]);

  const isSpecial = patternType === WinPatternType.SPECIAL;

  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      className="absolute top-0 left-0 z-40 pointer-events-none"
      role="img"
    >
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Debug grid overlay */}
      {debug && (
        <g className="debug-grid">
          {/* Vertical grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`vgrid-${i}`}
              x1={containerWidth * 0.065 + i * containerWidth * 0.29}
              y1={0}
              x2={containerWidth * 0.065 + i * containerWidth * 0.29}
              y2={containerHeight}
              stroke="rgba(255, 0, 0, 0.2)"
              strokeWidth={1}
            />
          ))}

          {/* Horizontal grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`hgrid-${i}`}
              x1={0}
              y1={containerHeight * 0.08 + i * containerHeight * 0.28}
              x2={containerWidth}
              y2={containerHeight * 0.08 + i * containerHeight * 0.28}
              stroke="rgba(255, 0, 0, 0.2)"
              strokeWidth={1}
            />
          ))}
        </g>
      )}

      {/* Glow background path */}
      <motion.path
        d={pathData}
        stroke={patternGlowColor}
        strokeWidth={lineWidth + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={variants.line.initial}
        animate={variants.line.animate}
        transition={variants.line.transition}
      />

      {/* Main path */}
      <motion.path
        d={pathData}
        stroke={patternColor}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={variants.line.initial}
        animate={variants.line.animate}
        transition={variants.line.transition}
        style={{ filter: `drop-shadow(0 0 8px ${patternColor})` }}
      />

      {/* Position marker dots */}
      {positions.map((pos, index) => {
        const positionRatio = index / (positions.length - 1);

        return (
          <React.Fragment key={`position-${index}-${pattern.join('-')}`}>
            {/* Debug marker */}
            {debug && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={4}
                fill="red"
                stroke="white"
                strokeWidth={1}
              />
            )}

            {/* Glow circle */}
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={16}
              fill={patternGlowColor}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0.4, 0.7, 0.7, 0.4],
              }}
              transition={{
                duration: animationDuration,
                ease: [0.22, 1, 0.36, 1],
                times: [
                  positionRatio * 0.3,
                  positionRatio * 0.3 + 0.1,
                  0.7 + (1 - positionRatio) * 0.25,
                  0.7 + (1 - positionRatio) * 0.25 + 0.1,
                ],
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
            />

            {/* Main circle */}
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={10}
              fill={patternColor}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0.7, 1, 1, 0.7],
              }}
              transition={{
                duration: animationDuration,
                ease: [0.22, 1, 0.36, 1],
                times: [
                  positionRatio * 0.3,
                  positionRatio * 0.3 + 0.1,
                  0.7 + (1 - positionRatio) * 0.25,
                  0.7 + (1 - positionRatio) * 0.25 + 0.1,
                ],
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
              style={{ filter: `drop-shadow(0 0 6px ${patternColor})` }}
            />
          </React.Fragment>
        );
      })}

      {/* Special effect for special patterns */}
      {isSpecial && (
        <motion.rect
          x={0}
          y={0}
          width={containerWidth}
          height={containerHeight}
          fill="none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: animationDuration * 0.7,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{
            filter: `blur(20px)`,
            background: `radial-gradient(circle at center, ${patternColor}44 0%, transparent 70%)`,
          }}
        />
      )}
    </svg>
  );
};

export default memo(WinningLine);
