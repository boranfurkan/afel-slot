import React, { useMemo, useState, useEffect } from 'react';
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
  const reelCenterOffsets = [0, 0, 0];

  const rowCenterOffsets = [0, 0, 0];

  const symbolCenterXOffset = -2;
  const symbolCenterYOffset = 0;

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
        x:
          paddingX +
          col * (cellWidth + gapX) +
          cellWidth / 2 +
          reelCenterOffsets[col] +
          symbolCenterXOffset,
        y:
          paddingY +
          row * cellHeight +
          cellHeight / 2 +
          rowCenterOffsets[row] +
          symbolCenterYOffset,
      };
    });
  }, [pattern, containerWidth, containerHeight]);

  const pathData = useMemo(() => {
    if (positions.length < 2) return '';

    let pathData = `M ${positions[0].x} ${positions[0].y}`;

    for (let i = 1; i < positions.length; i++) {
      pathData += ` L ${positions[i].x} ${positions[i].y}`;
    }

    return pathData;
  }, [positions]);

  const getAnimationVariants = useMemo(() => {
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

    if (isRow) {
      return {
        line: {
          initial: { pathLength: 0, opacity: 0 },
          animate: {
            pathLength: [0, 1, 1, 0],
            opacity: [0.3, 1, 1, 0.3],
            x: [0, 6, -6, 0],
            strokeWidth: [lineWidth, lineWidth + 2, lineWidth + 2, lineWidth],
          },
          transition: {
            ...baseTransition,
            times: [0, 0.3, 0.7, 1],
          },
        },
        dot: {
          initial: { scale: 0 },
          animate: {
            scale: [0, 1.2, 1, 0],
            x: [0, 3, -3, 0],
          },
          transition: baseTransition,
        },
      };
    } else if (isColumn) {
      return {
        line: {
          initial: { pathLength: 0, opacity: 0 },
          animate: {
            pathLength: [0, 1, 1, 0],
            opacity: [0.3, 1, 1, 0.3],
            y: [0, 6, -6, 0],
            strokeWidth: [lineWidth, lineWidth + 2, lineWidth + 2, lineWidth],
          },
          transition: {
            ...baseTransition,
            times: [0, 0.3, 0.7, 1],
          },
        },
        dot: {
          initial: { scale: 0 },
          animate: {
            scale: [0, 1.2, 1, 0],
            y: [0, 3, -3, 0],
          },
          transition: baseTransition,
        },
      };
    } else if (isDiagonal) {
      return {
        line: {
          initial: { pathLength: 0, opacity: 0 },
          animate: {
            pathLength: [0, 1, 1, 0],
            opacity: [0.3, 1, 1, 0.3],
            scale: [1, 1.05, 1.05, 1],
            rotate: [0, 0.5, -0.5, 0],
            strokeWidth: [lineWidth, lineWidth + 3, lineWidth + 3, lineWidth],
          },
          transition: {
            ...baseTransition,
            times: [0, 0.3, 0.7, 1],
          },
        },
        dot: {
          initial: { scale: 0 },
          animate: {
            scale: [0, 1.3, 1, 0],
            rotate: [0, 180, 360, 540],
          },
          transition: baseTransition,
        },
      };
    } else if (isSpecial) {
      return {
        line: {
          initial: { pathLength: 0, opacity: 0 },
          animate: {
            pathLength: [0, 1, 1, 0],
            opacity: [0.3, 1, 1, 0.3],
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
          transition: {
            ...baseTransition,
            times: [0, 0.3, 0.7, 1],
          },
        },
        dot: {
          initial: { scale: 0 },
          animate: {
            scale: [0, 1.5, 1.5, 0],
            filter: [
              'brightness(1)',
              'brightness(1.7)',
              'brightness(1.7)',
              'brightness(1)',
            ],
          },
          transition: baseTransition,
        },
      };
    } else {
      return {
        line: {
          initial: { pathLength: 0, opacity: 0 },
          animate: {
            pathLength: [0, 1, 1, 0],
            opacity: [0.3, 1, 1, 0.3],
            strokeWidth: [
              lineWidth,
              lineWidth * 1.2,
              lineWidth * 1.2,
              lineWidth,
            ],
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
    }
  }, [patternType, animationDuration, lineWidth]);

  const variants = getAnimationVariants;

  const getPatternColor = useMemo(() => {
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

  const getPatternGlowColor = useMemo(() => {
    if (glowColor) return glowColor;

    const baseColor = getPatternColor.replace(/[^,]+(?=\))/, '0.3');
    return baseColor.startsWith('#')
      ? `rgba(${parseInt(baseColor.slice(1, 3), 16)}, ${parseInt(
          baseColor.slice(3, 5),
          16
        )}, ${parseInt(baseColor.slice(5, 7), 16)}, 0.3)`
      : baseColor;
  }, [getPatternColor, glowColor]);

  const actualColor = getPatternColor;
  const actualGlowColor = getPatternGlowColor;
  const isSpecial = patternType === WinPatternType.SPECIAL;

  // Dynamic calibration mode
  const [calibrationMode, setCalibrationMode] = useState(false);

  // Allow toggling calibration mode with key press in development
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' && process.env.NODE_ENV === 'development') {
        setCalibrationMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Use debug mode from props or calibration mode from state
  const showDebugMarkers = debug || calibrationMode;

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
      {showDebugMarkers && (
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

      <motion.path
        d={pathData}
        stroke={actualGlowColor}
        strokeWidth={lineWidth + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={variants.line.initial}
        animate={variants.line.animate}
        transition={variants.line.transition}
      />

      <motion.path
        d={pathData}
        stroke={actualColor}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={variants.line.initial}
        animate={variants.line.animate}
        transition={variants.line.transition}
        style={{ filter: `drop-shadow(0 0 8px ${actualColor})` }}
      />

      {positions.map((pos, index) => {
        const positionRatio = index / (positions.length - 1);

        return (
          <React.Fragment key={`position-${index}-${pattern.join('-')}`}>
            {/* Debug marker for position center points */}
            {showDebugMarkers && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={4}
                fill="red"
                stroke="white"
                strokeWidth={1}
              />
            )}

            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={16}
              fill={actualGlowColor}
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

            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={10}
              fill={actualColor}
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
              style={{ filter: `drop-shadow(0 0 6px ${actualColor})` }}
            />

            <motion.g>
              {Array.from({ length: isSpecial ? 12 : 8 }).map(
                (_, particleIndex) => {
                  const angleOffset = Math.random() * 0.5;
                  const angle =
                    (particleIndex / (isSpecial ? 12 : 8)) * Math.PI * 2 +
                    angleOffset;
                  const distance = isSpecial
                    ? 25 + Math.random() * 10
                    : 15 + Math.random() * 8;
                  const particleSize = isSpecial
                    ? 2 + Math.random() * 3
                    : 1.5 + Math.random() * 2;
                  const speedVariation = 0.8 + Math.random() * 0.4;

                  return (
                    <motion.circle
                      key={`particle-${index}-${particleIndex}`}
                      cx={pos.x}
                      cy={pos.y}
                      r={particleSize}
                      fill={actualColor}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: [
                          0,
                          Math.cos(angle) * distance * 0.5,
                          Math.cos(angle) * distance,
                        ],
                        y: [
                          0,
                          Math.sin(angle) * distance * 0.5,
                          Math.sin(angle) * distance,
                        ],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: isSpecial
                          ? 1.2 * speedVariation
                          : 0.8 * speedVariation,
                        ease: 'easeOut',
                        delay: positionRatio * 0.3 * animationDuration,
                        repeat: Infinity,
                        repeatDelay: animationDuration + 0.2,
                      }}
                      style={{ filter: `blur(${isSpecial ? 1 : 0.5}px)` }}
                    />
                  );
                }
              )}
            </motion.g>

            {isSpecial && (
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={25}
                fill="none"
                stroke={actualColor}
                strokeWidth={1}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 2.5],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                  delay: positionRatio * 0.3 * animationDuration,
                  repeat: Infinity,
                  repeatDelay: animationDuration + 0.2,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

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
            background: `radial-gradient(circle at center, ${actualColor}44 0%, transparent 70%)`,
          }}
        />
      )}
    </svg>
  );
};

export default React.memo(WinningLine);
