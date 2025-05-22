import React from 'react';
import { motion } from 'framer-motion';
import FlipDistribution from './FlipDistribution';
import UserIcon from '@/assets/icons/UserIcon';
import LastFlipsShow from './last-flips/LastFlipsShow';

const FlipDetails = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="bg-[#002E09] px-3 py-2 flex items-center gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-10" variants={itemVariants}>
        <motion.div
          className="flex items-center gap-16"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <UserIcon />
            </motion.div>
            <div className="relative w-max">
              <motion.span
                className="font-normal text-base leading-[27.2px] tracking-[0%]"
                variants={numberVariants}
                animate={{
                  color: ['#ffffff', '#a0c380', '#ffffff'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                17
              </motion.span>
              <motion.span
                className="font-normal text-[9.6px] leading-[16.32px] tracking-[0%] absolute -top-2 -right-10 text-white"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                FLIPPING
              </motion.span>
            </div>
          </motion.div>

          <motion.div className="relative w-max" variants={itemVariants}>
            <motion.span
              className="font-normal text-base leading-[27.2px] tracking-[0%] text-[#A7D858]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 8px rgba(167, 216, 88, 0.6)',
              }}
            >
              -8033.418
            </motion.span>
            <motion.span
              className="font-normal text-[9.6px] leading-[16.32px] tracking-[0%] absolute -top-2 -right-4 text-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1,
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
              }}
            >
              SOL
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <FlipDistribution tailsPercentage={50} headsPercentage={50} />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1">
        <LastFlipsShow />
      </motion.div>
    </motion.div>
  );
};

export default FlipDetails;
