import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlipMachine } from '@/contexts/FlipContext';
import { lamportsToSol } from '@/lib/utils';
import Image from 'next/image';

const WaitingForDeposit = () => {
  const { betAmount, selectedSide } = useFlipMachine();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
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
        {/* Coin Icon with Pulse Animation */}
        <motion.div
          className="relative"
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Image
              src="/flip/flip-icon.png"
              alt="Flip Icon"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </motion.div>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-yellow-400 rounded-full blur-xl -z-10"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Waiting Text */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.h2
            className="font-normal text-4xl leading-tight tracking-wide text-white uppercase mb-2"
            animate={{
              textShadow: [
                '0 0 0px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.8)',
                '0 0 0px rgba(255,255,255,0.8)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            WAITING FOR DEPOSIT{dots}
          </motion.h2>
        </motion.div>

        {/* Bet Details */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div
            className="text-6xl font-bold text-white mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            {selectedSide} {lamportsToSol(betAmount * 1_000_000_000, 3)} SOL
          </motion.div>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          className="w-80 h-2 bg-white/20 rounded-full overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Floating Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default WaitingForDeposit;
