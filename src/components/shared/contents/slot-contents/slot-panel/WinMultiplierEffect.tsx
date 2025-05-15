import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinMultiplierEffectProps {
  multiplier: number;
  winAmount: number;
  isVisible: boolean;
  winningPatterns: number[][];
}

interface Effect {
  id: string;
  pattern: number[];
  delay: number;
  duration: number;
  scale: number;
  opacity: number;
  yOffset: number;
  xOffset: number;
}

const WinMultiplierEffect: React.FC<WinMultiplierEffectProps> = ({
  multiplier,
  winAmount,
  isVisible,
  winningPatterns,
}) => {
  const [effects, setEffects] = useState<Effect[]>([]);

  const createEffect = useCallback(
    (pattern: number[], delay: number, id?: string): Effect => {
      const randomScale = 1.1 + Math.random() * 0.3;
      const randomDuration = 3.5 + Math.random() * 1.5;
      const randomXOffset = (Math.random() - 0.5) * 15;
      const randomYOffset = -10 + Math.random() * -25;

      return {
        id: id || `effect-${pattern.join('-')}-${Date.now()}`,
        pattern,
        delay,
        duration: randomDuration,
        scale: randomScale,
        opacity: 0.85 + Math.random() * 0.15,
        yOffset: randomYOffset,
        xOffset: randomXOffset,
      };
    },
    []
  );

  const getColorScheme = useCallback((multiplier: number) => {
    if (multiplier >= 10)
      return { text: '#FF00FF', glow: '#FF00FF', particles: '#FFAAFF' };
    if (multiplier >= 5)
      return { text: '#FFFF00', glow: '#FFFF00', particles: '#FFFFAA' };
    if (multiplier >= 3)
      return { text: '#00FFFF', glow: '#00FFFF', particles: '#AAFFFF' };
    if (multiplier >= 2)
      return { text: '#FFFFFF', glow: '#FFFFFF', particles: '#FFFFFF' };
    return { text: '#a0c380', glow: '#a0c380', particles: '#c8e0a8' };
  }, []);

  const formatSolAmount = useCallback((amount: number) => {
    return (amount / 1_000_000_000).toFixed(2);
  }, []);

  useEffect(() => {
    if (isVisible && winningPatterns.length > 0) {
      const initialEffects = winningPatterns.map((pattern, index) =>
        createEffect(pattern, index * 0.5)
      );
      setEffects(initialEffects);

      const interval = setInterval(() => {
        const randomPatternIndex = Math.floor(
          Math.random() * winningPatterns.length
        );
        const randomPattern = winningPatterns[randomPatternIndex];

        const newEffect = createEffect(
          randomPattern,
          0.2,
          `random-${Date.now()}-${Math.random()}`
        );

        setEffects((prev) => {
          const updatedEffects = [...prev];
          if (updatedEffects.length > 8) {
            updatedEffects.shift();
          }
          return [...updatedEffects, newEffect];
        });
      }, 3500);

      return () => {
        clearInterval(interval);
        setEffects([]);
      };
    }
  }, [isVisible, winningPatterns, createEffect]);

  return (
    <AnimatePresence>
      {isVisible &&
        effects.map((effect) => {
          const positions = effect.pattern.map((index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            return { row, col };
          });

          const centralPos = positions[Math.floor(positions.length / 2)];
          const xPos = (centralPos.col / 3) * 100;
          const yPos = (centralPos.row / 3) * 100;

          const colors = getColorScheme(multiplier);

          const fontSize =
            multiplier >= 10
              ? '42px'
              : multiplier >= 5
              ? '38px'
              : multiplier >= 3
              ? '34px'
              : '30px';

          return (
            <motion.div
              key={effect.id}
              className="absolute z-50 pointer-events-none"
              style={{
                left: `${50 + (xPos - 50) * 0.6 + effect.xOffset}%`,
                top: `${35 + yPos * 0.5}%`,
                fontSize: fontSize,
                fontWeight: 'bold',
                color: colors.text,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transformOrigin: 'center',
              }}
              initial={{ opacity: 0, scale: 0.7, y: 0 }}
              animate={{
                opacity: [
                  0,
                  effect.opacity,
                  effect.opacity * 0.9,
                  effect.opacity * 0.7,
                  0,
                ],
                scale: [
                  0.7,
                  effect.scale,
                  effect.scale * 0.95,
                  effect.scale * 0.9,
                  0.8,
                ],
                y: [
                  -20,
                  -50 + effect.yOffset,
                  -60 + effect.yOffset,
                  -70 + effect.yOffset,
                  -90,
                ],
              }}
              exit={{ opacity: 0, y: -100, scale: 0.5 }}
              transition={{
                duration: effect.duration,
                delay: effect.delay,
                times: [0, 0.2, 0.5, 0.8, 1],
                ease: 'easeInOut',
              }}
              onAnimationComplete={() => {
                setEffects((prev) => prev.filter((e) => e.id !== effect.id));
              }}
            >
              {/* Background glow effect */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, ${colors.glow}30 0%, transparent 70%)`,
                  zIndex: -1,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.9],
                  opacity: [0.2, 0.4, 0.1],
                }}
                transition={{
                  duration: effect.duration * 0.8,
                  repeat: 0,
                  ease: 'easeInOut',
                }}
              />

              {/* Multiplier text with highlight */}
              <div className="relative">
                <motion.span
                  className="font-supply absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    filter: `blur(4px)`,
                    opacity: 0.7,
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Math.floor(effect.duration / 1.8),
                    repeatType: 'reverse',
                  }}
                >
                  +{multiplier}X
                </motion.span>
                <span className="font-supply relative z-10">
                  +{multiplier}X
                </span>
              </div>

              {/* SOL amount */}
              <span className="text-2xl mt-2 font-bold">
                +{formatSolAmount(winAmount / winningPatterns.length)} SOL
              </span>

              {/* Enhanced particles around the text */}
              {Array.from({ length: 12 }).map((_, i) => {
                const size = 5 + Math.random() * 8;
                const distance = 30 + Math.random() * 70;
                const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
                const delay = Math.random() * 0.8;

                return (
                  <motion.div
                    key={`particle-${effect.id}-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: colors.particles,
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                      scale: 0.5,
                    }}
                    animate={{
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
                      scale: [0.5, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 1,
                      delay: delay,
                      times: [0, 0.4, 1],
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
};

export default memo(WinMultiplierEffect);
