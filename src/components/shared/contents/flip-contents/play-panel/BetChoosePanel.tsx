import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FlipContentButton from '../FlipContentButton';
import { useFlipMachine } from '@/contexts/FlipContext';
import { lamportsToSol } from '@/lib/utils';

const BetChoosePanel = () => {
  const { userBalance, setBetAmount, betAmount, gameState } = useFlipMachine();
  const isDisabled = gameState !== 'IDLE';

  const userBalanceInSol = parseFloat(lamportsToSol(userBalance));

  const handleBetClick = (amount: number) => {
    if (isDisabled) return;
    setBetAmount(amount);
  };

  const betOptions = [
    { amount: 0.1, label: '0.1 SOL' },
    { amount: 0.25, label: '0.25 SOL' },
    { amount: 0.5, label: '0.5 SOL' },
    { amount: 1, label: '1 SOL' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-2 gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* BET Currency Options - Disabled for now */}
      <motion.div variants={itemVariants}>
        <FlipContentButton
          className="w-full !px-3 !py-1 h-16 opacity-50"
          disabled={true}
        >
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/afel-logo.png"
              width={35}
              height={35}
              alt="Afel Logo"
              className="w-8 h-8"
            />
            <div className="flex flex-col items-center whitespace-nowrap">
              <span className="font-normal text-[20px] leading-tight tracking-[0%] align-middle">
                0.5 BET
              </span>
              <span className="font-normal text-[14px] leading-tight tracking-[0%] align-middle">
                BABY BET
              </span>
            </div>
          </div>
        </FlipContentButton>
      </motion.div>

      {/* SOL Betting Options */}
      {betOptions.map((option, index) => (
        <motion.div key={option.amount} variants={itemVariants}>
          <FlipContentButton
            className={`w-full !px-3 !py-1 h-16 flex items-center justify-center transition-all duration-300 ${
              !isDisabled && userBalanceInSol >= option.amount
                ? 'hover:scale-105'
                : ''
            }`}
            disabled={userBalanceInSol < option.amount || isDisabled}
            selected={betAmount === option.amount}
            onClick={() => handleBetClick(option.amount)}
          >
            <motion.span
              className="text-xl font-bold"
              animate={
                betAmount === option.amount
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: betAmount === option.amount ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              {option.label}
            </motion.span>

            {/* Insufficient funds indicator */}
            {userBalanceInSol < option.amount && (
              <motion.div
                className="absolute inset-0 bg-red-500/20 rounded-[6.63px] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-red-400 text-xs font-bold">
                  INSUFFICIENT
                </span>
              </motion.div>
            )}
          </FlipContentButton>
        </motion.div>
      ))}

      {/* Legend BET - Disabled for now */}
      <motion.div variants={itemVariants}>
        <FlipContentButton
          className="w-full !px-3 !py-1 h-16 opacity-50"
          disabled={true}
        >
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/afel-logo.png"
              width={35}
              height={35}
              alt="Afel Logo"
              className="w-8 h-8"
            />
            <div className="flex flex-col items-start whitespace-nowrap">
              <span className="font-normal text-[20px] leading-tight tracking-[0%] text-left">
                2 BET
              </span>
              <span className="font-normal text-[14px] leading-tight tracking-[0%] text-left">
                LEGEND BET
              </span>
            </div>
          </div>
        </FlipContentButton>
      </motion.div>

      {/* Current Balance Display */}
      <motion.div
        className="col-span-2 mt-4 text-center"
        variants={itemVariants}
      >
        <div className="text-white/70 text-sm mb-1">AVAILABLE BALANCE</div>
        <motion.div
          className="text-green-400 text-lg font-bold"
          animate={{
            textShadow: [
              '0 0 0px rgba(34, 197, 94, 0.8)',
              '0 0 8px rgba(34, 197, 94, 0.8)',
              '0 0 0px rgba(34, 197, 94, 0.8)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {userBalanceInSol.toFixed(3)} SOL
        </motion.div>
      </motion.div>

      {/* Selected Bet Display */}
      {betAmount > 0 && (
        <motion.div
          className="col-span-2 mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-yellow-400 text-sm font-medium"
            animate={{
              textShadow: [
                '0 0 0px rgba(250, 204, 21, 0.8)',
                '0 0 8px rgba(250, 204, 21, 0.8)',
                '0 0 0px rgba(250, 204, 21, 0.8)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✓ BET: {betAmount} SOL SELECTED
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BetChoosePanel;
