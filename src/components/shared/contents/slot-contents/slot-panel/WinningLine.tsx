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
    // Calculate cell dimensions
    const cellWidth = containerWidth / 3;
    const cellHeight = containerHeight / 3;

    // Map each pattern index to precise coordinates
    return pattern.map((slotIndex) => {
      const row = Math.floor(slotIndex / 3);
      const col = slotIndex % 3;

      // Calculate exact center of each cell
      return {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2,
      };
    });
  }, [pattern, containerWidth, containerHeight]);

  // Generate SVG path data connecting all points
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

    // Default animation
    const defaultVariants = {
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

    // Pattern-specific variations
    if (isRow) {
      return {
        ...defaultVariants,
        line: {
          ...defaultVariants.line,
          animate: {
            ...defaultVariants.line.animate,
            x: [0, 5, -5, 0],
          },
        },
      };
    }

    if (isColumn) {
      return {
        ...defaultVariants,
        line: {
          ...defaultVariants.line,
          animate: {
            ...defaultVariants.line.animate,
            y: [0, 5, -5, 0],
          },
        },
      };
    }

    if (isDiagonal) {
      return {
        ...defaultVariants,
        line: {
          ...defaultVariants.line,
          animate: {
            ...defaultVariants.line.animate,
            scale: [1, 1.03, 1.03, 1],
          },
        },
      };
    }

    return defaultVariants;
  }, [patternType, animationDuration, lineWidth]);

  // Get pattern color based on pattern type
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
      {/* Debug grid overlay */}
      {debug && (
        <g className="debug-grid">
          {/* Vertical cell dividers */}
          {[1, 2].map((i) => (
            <line
              key={`vgrid-${i}`}
              x1={(i * containerWidth) / 3}
              y1={0}
              x2={(i * containerWidth) / 3}
              y2={containerHeight}
              stroke="rgba(255, 0, 0, 0.3)"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          ))}

          {/* Horizontal cell dividers */}
          {[1, 2].map((i) => (
            <line
              key={`hgrid-${i}`}
              x1={0}
              y1={(i * containerHeight) / 3}
              x2={containerWidth}
              y2={(i * containerHeight) / 3}
              stroke="rgba(255, 0, 0, 0.3)"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          ))}

          {/* Cell centers */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <circle
                key={`center-${row}-${col}`}
                cx={(col * containerWidth) / 3 + containerWidth / 6}
                cy={(row * containerHeight) / 3 + containerHeight / 6}
                r={4}
                fill="rgba(255, 255, 0, 0.5)"
              />
            ))
          )}
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

      {/* Position dots */}
      {positions.map((pos, index) => {
        const positionRatio = index / (positions.length - 1);

        return (
          <React.Fragment key={`position-${index}-${pattern.join('-')}`}>
            {/* Debug position marker */}
            {debug && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={5}
                fill="red"
                stroke="white"
                strokeWidth={1}
              />
            )}

            {/* Animated dot */}
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
    </svg>
  );
};

export default memo(WinningLine);
