import React, { useEffect, useState } from 'react';
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
  }, [isVisible, winningPatterns, multiplier, winAmount]);

  // Function to create an effect with enhanced properties
  const createEffect = (
    pattern: number[],
    delay: number,
    id?: string
  ): Effect => {
    const positions = pattern.map((index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      return { row, col };
    });

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
      opacity: 0.85 + Math.random() * 0.15, // Higher base opacity
      yOffset: randomYOffset,
      xOffset: randomXOffset,
    };
  };

  // Get SOL amount with 2 decimal places
  const formatSolAmount = (amount: number) => {
    return (amount / 1_000_000_000).toFixed(2);
  };

  // Choose colors based on multiplier
  const getColorScheme = (multiplier: number) => {
    if (multiplier >= 10)
      return { text: '#FF00FF', glow: '#FF00FF', particles: '#FFAAFF' }; // Special purple for highest multipliers
    if (multiplier >= 5)
      return { text: '#FFFF00', glow: '#FFFF00', particles: '#FFFFAA' }; // Yellow for high multipliers
    if (multiplier >= 3)
      return { text: '#00FFFF', glow: '#00FFFF', particles: '#AAFFFF' }; // Cyan for medium-high
    if (multiplier >= 2)
      return { text: '#FFFFFF', glow: '#FFFFFF', particles: '#FFFFFF' }; // White for medium
    return { text: '#a0c380', glow: '#a0c380', particles: '#c8e0a8' }; // Default green for low multipliers
  };

  return (
    <>
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
                  textShadow: `0 0 15px ${colors.glow}80, 0 0 20px ${colors.glow}60`,
                  color: colors.text,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transformOrigin: 'center',
                  filter: `drop-shadow(0 0 8px ${colors.glow})`,
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
                  filter: [
                    `drop-shadow(0 0 5px ${colors.glow}80)`,
                    `drop-shadow(0 0 15px ${colors.glow})`,
                    `drop-shadow(0 0 20px ${colors.glow})`,
                    `drop-shadow(0 0 15px ${colors.glow}90)`,
                    `drop-shadow(0 0 5px ${colors.glow}60)`,
                  ],
                }}
                exit={{ opacity: 0, y: -100, scale: 0.5 }}
                transition={{
                  duration: effect.duration,
                  delay: effect.delay,
                  times: [0, 0.2, 0.5, 0.8, 1], // More stages in the animation
                  ease: 'easeInOut',
                }}
                onAnimationComplete={() => {
                  // Remove this effect after animation completes
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
                        boxShadow: `0 0 8px 2px ${colors.glow}`,
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

                {/* Longer trailing particles */}
                {multiplier >= 3 &&
                  Array.from({ length: 6 }).map((_, i) => {
                    const size = 3 + Math.random() * 5;
                    const distance = 50 + Math.random() * 100;
                    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
                    const delay = 0.3 + Math.random() * 1.2;

                    return (
                      <motion.div
                        key={`trail-${effect.id}-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: size,
                          height: size,
                          background: `radial-gradient(circle, ${colors.particles} 30%, transparent 70%)`,
                        }}
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0,
                        }}
                        animate={{
                          x: [0, Math.cos(angle) * distance],
                          y: [0, Math.sin(angle) * distance],
                          opacity: [0, 0.7, 0],
                          scale: [1, 0.5],
                        }}
                        transition={{
                          duration: 2.5 + Math.random() * 1.5,
                          delay: delay,
                          ease: 'easeOut',
                        }}
                      />
                    );
                  })}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </>
  );
};

export default WinMultiplierEffect;
