import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import FlipContentButton from '../FlipContentButton';
import { useFlipMachine } from '@/contexts/FlipContext';
import { FlipSide } from '@/types/app';

const ChooseSide = () => {
  const { selectedSide, setSelectedSide, gameState } = useFlipMachine();
  const isDisabled = gameState !== 'IDLE';

  const handleSideSelect = (side: FlipSide) => {
    if (isDisabled) return;
    setSelectedSide(side);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="font-normal text-[24.73px] leading-[100%] tracking-[0%] text-center align-middle text-white uppercase"
        variants={buttonVariants}
      >
        I choose
      </motion.h3>

      <div className="grid grid-cols-2 w-full gap-2">
        <motion.div variants={buttonVariants}>
          <FlipContentButton
            className={`w-full h-16 flex items-center justify-center gap-2 transition-all duration-300 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            selected={selectedSide === 'HEADS'}
            onClick={() => handleSideSelect('HEADS')}
            disabled={isDisabled}
          >
            <motion.div
              animate={
                selectedSide === 'HEADS'
                  ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: selectedSide === 'HEADS' ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <Image
                src="/flip/heads-icon.png"
                alt="Heads"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </motion.div>
            <span className="text-xl font-bold">HEADS</span>
          </FlipContentButton>
        </motion.div>

        <motion.div variants={buttonVariants}>
          <FlipContentButton
            className={`w-full h-16 flex items-center justify-center gap-2 transition-all duration-300 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            selected={selectedSide === 'TAILS'}
            onClick={() => handleSideSelect('TAILS')}
            disabled={isDisabled}
          >
            <motion.div
              animate={
                selectedSide === 'TAILS'
                  ? {
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                repeat: selectedSide === 'TAILS' ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <Image
                src="/flip/tails-icon.png"
                alt="Tails"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </motion.div>
            <span className="text-xl font-bold">TAILS</span>
          </FlipContentButton>
        </motion.div>
      </div>

      {/* Selection Feedback */}
      {selectedSide && (
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="text-yellow-400 text-sm font-medium"
            animate={{
              textShadow: [
                '0 0 0px rgba(250, 204, 21, 0.8)',
                '0 0 10px rgba(250, 204, 21, 0.8)',
                '0 0 0px rgba(250, 204, 21, 0.8)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✓ {selectedSide} SELECTED
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChooseSide;
