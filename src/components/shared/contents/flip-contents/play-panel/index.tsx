import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ChooseSide from './ChooseSide';
import { Separator } from '@/components/UI/separator';
import BetChoosePanel from './BetChoosePanel';
import BetInput from './BetInput';
import FlipContentButton from '../FlipContentButton';
import { useFlipMachine } from '@/contexts/FlipContext';

const PlayPanel = () => {
  const {
    startFlip,
    canStartFlip,
    selectedSide,
    betAmount,
    gameState,
    resetGame,
  } = useFlipMachine();

  const handleStartFlip = () => {
    if (canStartFlip) {
      startFlip();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="w-full flex flex-col items-center gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Panel */}
      <motion.div
        className="w-full border border-[#FFFFFF99] p-2.5 rounded-[15px] flex flex-col gap-4 backdrop-blur-sm bg-black/20"
        variants={itemVariants}
      >
        {/* Choose Side Section */}
        <ChooseSide />

        <Separator className="bg-[#FFFFFF99] w-full h-[1px]" />

        {/* Bet Choose Panel */}
        <BetChoosePanel />

        <Separator className="bg-[#FFFFFF99] w-full h-[1px]" />

        {/* Custom Bet Input */}
        <BetInput />

        <Separator className="bg-[#FFFFFF99] w-full h-[1px]" />

        {/* Start Button or Reset Button */}
        <motion.div className="w-full" variants={itemVariants}>
          {gameState === 'IDLE' ? (
            <motion.div
              whileHover={canStartFlip ? { scale: 1.02 } : {}}
              whileTap={canStartFlip ? { scale: 0.98 } : {}}
            >
              <FlipContentButton
                onClick={handleStartFlip}
                disabled={!canStartFlip}
                className={`w-full h-16 text-2xl font-bold transition-all duration-300 ${
                  canStartFlip ? 'hover:shadow-lg' : ''
                }`}
              >
                <motion.div
                  className="flex items-center justify-center gap-3"
                  animate={
                    canStartFlip
                      ? {
                          scale: [1, 1.05, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: canStartFlip ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  <span>🎯</span>
                  <span>BET {betAmount} SOL</span>
                </motion.div>
              </FlipContentButton>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FlipContentButton
                onClick={resetGame}
                className="w-full h-16 text-xl font-bold bg-red-500/20 hover:bg-red-500/30 border-red-500"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🔄 RESET GAME
                </motion.div>
              </FlipContentButton>
            </motion.div>
          )}
        </motion.div>

        {/* Game Status Indicator */}
        <motion.div className="text-center text-sm" variants={itemVariants}>
          {!selectedSide && gameState === 'IDLE' && (
            <motion.span
              className="text-yellow-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚡ Choose HEADS or TAILS to continue
            </motion.span>
          )}

          {selectedSide && betAmount === 0 && gameState === 'IDLE' && (
            <motion.span
              className="text-yellow-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💰 Select your bet amount
            </motion.span>
          )}

          {canStartFlip && (
            <motion.span
              className="text-green-400 font-medium"
              animate={{
                textShadow: [
                  '0 0 0px rgba(34, 197, 94, 0.8)',
                  '0 0 10px rgba(34, 197, 94, 0.8)',
                  '0 0 0px rgba(34, 197, 94, 0.8)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🚀 Ready to flip! Click BET to start
            </motion.span>
          )}

          {gameState === 'WAITING_FOR_DEPOSIT' && (
            <span className="text-blue-400">
              📡 Waiting for deposit confirmation...
            </span>
          )}

          {gameState === 'FLIPPING' && (
            <span className="text-purple-400">🪙 Coin is flipping...</span>
          )}

          {gameState === 'RESULT' && (
            <span className="text-orange-400">🎉 Check your result above!</span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PlayPanel;
