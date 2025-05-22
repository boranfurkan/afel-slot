import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface FlipDistributionProps {
  tailsPercentage: number;
  headsPercentage: number;
}

const FlipDistribution = ({
  tailsPercentage,
  headsPercentage,
}: FlipDistributionProps) => {
  const headsControls = useAnimationControls();
  const tailsControls = useAnimationControls();

  useEffect(() => {
    headsControls.start({
      width: `${headsPercentage}%`,
      transition: { duration: 1.2, ease: 'easeOut', delay: 0.2 },
    });

    tailsControls.start({
      width: `${tailsPercentage}%`,
      transition: { duration: 1.2, ease: 'easeOut', delay: 0.4 },
    });
  }, [headsPercentage, tailsPercentage, headsControls, tailsControls]);

  return (
    <motion.div
      className="w-[300px] h-[20px] relative overflow-hidden rounded-sm border border-white/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 flex">
        <motion.div
          className="flip-distribution-gradient flex items-center justify-center relative overflow-hidden"
          initial={{ width: '0%' }}
          animate={headsControls}
        >
          <motion.span
            className="text-xs font-bold text-black relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            HEADS {headsPercentage}%
          </motion.span>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              delay: 1.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        </motion.div>

        <motion.div
          className="bg-gray-200 flex items-center justify-center relative overflow-hidden"
          initial={{ width: '100%' }}
          animate={tailsControls}
        >
          <motion.span
            className="text-xs font-bold text-black relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            TAILS {tailsPercentage}%
          </motion.span>

          {/* Pulse effect for tails */}
          <motion.div
            className="absolute inset-0 bg-gray-300"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.5,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlipDistribution;
