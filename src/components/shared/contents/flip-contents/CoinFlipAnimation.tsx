import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useFlipMachine } from '@/contexts/FlipContext';

const CoinFlipAnimation = () => {
  const { flipResult, selectedSide } = useFlipMachine();
  const coinRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayResult, setDisplayResult] = useState<'H' | 'T' | '?'>('?');

  useEffect(() => {
    if (!coinRef.current || !checkboxRef.current) return;

    const coinElement = coinRef.current;
    const checkbox = checkboxRef.current;

    // Handle animation events
    const handleAnimationStart = () => {
      setIsFlipping(true);
      setDisplayResult('?');
    };

    const handleAnimationEnd = () => {
      setIsFlipping(false);
      if (flipResult) {
        setDisplayResult(flipResult.result === 'HEADS' ? 'H' : 'T');
      }
    };

    // Add event listeners
    coinElement.addEventListener('animationstart', handleAnimationStart);
    coinElement.addEventListener('animationend', handleAnimationEnd);

    // Start the flip animation
    checkbox.checked = true;

    return () => {
      coinElement.removeEventListener('animationstart', handleAnimationStart);
      coinElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [flipResult]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center relative overflow-visible"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-96 h-96 bg-gradient-radial from-yellow-400/30 via-orange-400/20 to-transparent rounded-full blur-2xl" />
      </motion.div>

      {/* Coin Container with proper spacing for glow */}
      <div
        className="coin-flip-container relative z-20"
        style={{ padding: '60px' }}
      >
        <div className="coin-flip-bounds">
          <input
            ref={checkboxRef}
            type="checkbox"
            className="coin-flip-trigger"
          />
          <div
            ref={coinRef}
            className="coin-flip"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Back Side (Tails) */}
            <div className="coin-flip-back">
              <div className="w-36 h-36 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border-2 border-gray-300">
                <Image
                  src="/flip/tails-icon.png"
                  alt="Tails"
                  width={100}
                  height={100}
                  className="w-25 h-25 object-contain"
                />
              </div>
            </div>

            {/* Coin Edge Elements */}
            <div className="coin-flip-edge-front"></div>
            <div className="coin-flip-center"></div>
            <div className="coin-flip-edge-back"></div>

            {/* Front Side (Heads) */}
            <div className="coin-flip-front">
              <div className="w-36 h-36 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border-2 border-gray-300">
                <Image
                  src="/flip/heads-icon.png"
                  alt="Heads"
                  width={100}
                  height={100}
                  className="w-25 h-25 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Side Indicator - Moved to very bottom */}
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20 shadow-lg"
          animate={{
            boxShadow: [
              '0 0 0px rgba(255,255,255,0.3)',
              '0 0 15px rgba(255,255,255,0.4)',
              '0 0 0px rgba(255,255,255,0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-white/80 text-xs mb-0.5">YOU CHOSE</div>
          <div className="text-yellow-400 text-lg font-bold">
            {selectedSide}
          </div>
        </motion.div>
      </motion.div>

      {/* Status Text - Moved higher */}
      <motion.div
        className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center z-10"
        animate={{
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10 shadow-lg">
          <div className="text-xl font-bold text-white">
            {isFlipping ? 'FLIPPING...' : 'LANDED!'}
          </div>
          {!isFlipping && flipResult && (
            <motion.div
              className="text-xs text-yellow-400 mt-0.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              Result: {flipResult.result}
            </motion.div>
          )}
        </div>
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
  );
};

export default CoinFlipAnimation;
