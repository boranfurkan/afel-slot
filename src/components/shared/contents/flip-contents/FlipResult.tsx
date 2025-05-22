import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';
import { lamportsToSol } from '@/lib/utils';
import FlipContentButton from './FlipContentButton';

const FlipResult = () => {
  const { flipResult, claimReward, canClaimReward, selectedSide, resetGame } =
    useFlipMachine();
  const [showProcessing, setShowProcessing] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (flipResult?.isWin) {
      const timer = setTimeout(() => {
        setShowProcessing(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [flipResult]);

  useEffect(() => {
    if (showProcessing) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [showProcessing]);

  if (!flipResult) return null;

  const isWin = flipResult.isWin;
  const winAmount = lamportsToSol(flipResult.winAmount, 3);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const celebrationVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Result Coin Display */}
        <motion.div
          className="relative"
          variants={isWin ? celebrationVariants : {}}
          animate={isWin ? 'animate' : ''}
        >
          <motion.div
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
              flipResult.result === 'HEADS'
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                : 'bg-gradient-to-br from-green-500 to-green-700'
            }`}
            initial={{ scale: 0, rotateY: 0 }}
            animate={{
              scale: 1,
              rotateY: flipResult.result === 'HEADS' ? 0 : 180,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.3,
            }}
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <Image
                src={`/flip/${flipResult.result.toLowerCase()}-icon.png`}
                alt={flipResult.result}
                width={60}
                height={60}
                className="w-15 h-15"
              />
            </div>
          </motion.div>

          {/* Win Glow Effect */}
          {isWin && (
            <motion.div
              className="absolute inset-0 bg-yellow-400 rounded-full blur-xl -z-10"
              animate={{
                scale: [0.8, 1.5, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {/* Win/Lose Message */}
        <motion.div className="text-center" variants={itemVariants}>
          {isWin ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <motion.h2
                className="font-bold text-6xl text-green-400 mb-4 uppercase"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(34, 197, 94, 0.8)',
                    '0 0 30px rgba(34, 197, 94, 0.8)',
                    '0 0 10px rgba(34, 197, 94, 0.8)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                YOU WON
              </motion.h2>
              <motion.div
                className="text-4xl font-bold text-white"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {winAmount} SOL
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <h2 className="font-bold text-6xl text-red-400 mb-4 uppercase">
                YOU LOST
              </h2>
              <div className="text-2xl text-gray-400">
                Better luck next time!
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Processing State for Wins */}
        {isWin && showProcessing && (
          <motion.div
            className="text-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="text-xl text-white mb-6"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              SOLANA IS PROCESSING{dots}
            </motion.div>

            {/* Processing Bar */}
            <motion.div
              className="w-80 h-1 bg-white/20 rounded-full overflow-hidden mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            {/* Claim Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <FlipContentButton
                onClick={claimReward}
                disabled={!canClaimReward}
                className="px-8 py-4 text-2xl font-bold"
              >
                CLAIM REWARD
              </FlipContentButton>
            </motion.div>
          </motion.div>
        )}

        {/* Confetti for Wins */}
        {isWin && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][
                    i % 4
                  ],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [(Math.random() - 0.5) * 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}

        {/* Lose State - Show "Play Again" option */}
        {!isWin && (
          <motion.div
            className="text-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipContentButton
              onClick={resetGame}
              className="px-8 py-3 text-xl"
            >
              PLAY AGAIN
            </FlipContentButton>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FlipResult;
