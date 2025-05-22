import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from '../../../../../public/flip-background.png';
import FlipDetails from './info-section/FlipDetails';
import PlayPanel from './play-panel';

import { useFlipMachine } from '@/contexts/FlipContext';
import { FlipGameState } from '@/contexts/FlipContext';
import WaitingForDeposit from './WaitingForDeposit';
import CoinFlipAnimation from './CoinFlipAnimation';
import FlipResult from './FlipResult';

const FlipContents = () => {
  const { gameState } = useFlipMachine();

  const renderGameState = () => {
    switch (gameState) {
      case FlipGameState.WAITING_FOR_DEPOSIT:
        return <WaitingForDeposit key="waiting" />;
      case FlipGameState.FLIPPING:
        return <CoinFlipAnimation key="flipping" />;
      case FlipGameState.RESULT:
        return <FlipResult key="result" />;
      default:
        return <PlayPanel key="idle" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const gameStateVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Image */}
      <Image
        layout="fill"
        className="object-center object-cover pointer-events-none"
        src={backgroundImage}
        alt="Flip Background"
        priority
      />

      {/* Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/20 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Content */}
      <div className="relative w-full h-full z-20 flex flex-col">
        {/* Top Info Bar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <FlipDetails />
        </motion.div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState}
                variants={gameStateVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                {renderGameState()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>

      {/* Ambient Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

export default FlipContents;
