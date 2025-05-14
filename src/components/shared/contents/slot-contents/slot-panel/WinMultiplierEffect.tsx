import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinMultiplierEffectProps {
  multiplier: number;
  winAmount: number;
  isVisible: boolean;
  winningPatterns: number[][];
}

const WinMultiplierEffect: React.FC<WinMultiplierEffectProps> = ({
  multiplier,
  winAmount,
  isVisible,
  winningPatterns,
}) => {
  // Get SOL amount with 2 decimal places
  const formatSolAmount = (amount: number) => {
    return (amount / 1_000_000_000).toFixed(2);
  };

  // Create an effect for each winning pattern
  return (
    <>
      <AnimatePresence>
        {isVisible &&
          winningPatterns.map((pattern, index) => {
            // Calculate a central position based on this pattern
            // Convert pattern indices to grid positions
            const positions = pattern.map((index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              return { row, col };
            });

            // Find the central point (usually the middle index)
            const centralPos = positions[1]; // Middle of 3
            const xPos = (centralPos.col / 3) * 100; // As percentage
            const yPos = (centralPos.row / 3) * 100; // As percentage

            return (
              <motion.div
                key={`win-effect-${pattern.join('-')}`}
                className="absolute z-50 pointer-events-none"
                style={{
                  left: `${50 + (xPos - 50) * 0.8}%`,
                  top: `${25 + yPos * 0.7}%`,
                  fontSize: multiplier >= 5 ? '32px' : '28px',
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(0,0,0,0.8)',
                  color: multiplier >= 5 ? '#ffff00' : '#a0c380',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transformOrigin: 'center',
                }}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1.2, 1],
                  y: [-20, -70, -100],
                  filter: [
                    'drop-shadow(0 0 0px #a0c380)',
                    'drop-shadow(0 0 8px #a0c380)',
                    'drop-shadow(0 0 12px #a0c380)',
                    'drop-shadow(0 0 0px #a0c380)',
                  ],
                }}
                exit={{ opacity: 0, y: -120 }}
                transition={{
                  duration: 2.5,
                  delay: index * 0.3, // Stagger multiple wins
                  times: [0, 0.2, 0.8, 1],
                  ease: 'easeOut',
                }}
              >
                <span className="font-supply">+{multiplier}X</span>
                <span className="text-xl mt-1">
                  +{formatSolAmount(winAmount / winningPatterns.length)} SOL
                </span>

                {/* Particles around the text */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`particle-${index}-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: 6 + Math.random() * 4,
                      height: 6 + Math.random() * 4,
                      backgroundColor: multiplier >= 5 ? '#ffff00' : '#a0c380',
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 50,
                      y: (Math.random() - 0.5) * 50,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.2 + Math.random() * 0.5,
                    }}
                  />
                ))}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </>
  );
};

export default WinMultiplierEffect;
