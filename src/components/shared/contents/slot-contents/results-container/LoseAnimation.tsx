import React from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';
import LoseIndicator from '@/components/UI/LoseIndicator';

const LoseAnimation: React.FC = () => {
  return (
    <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4 relative overflow-hidden">
      <div className="bg-[#171717]/30 backdrop-blur-sm rounded-[8px] w-1/4 min-h-[100px] flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateZ: [0, 1, -1, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: 4,
            repeatType: 'loop',
            repeatDelay: 0.5,
          }}
        >
          <motion.div
            animate={{
              x: [0, -2, 2, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: 4,
              repeatType: 'loop',
              repeatDelay: 0.5,
              ease: 'easeInOut',
            }}
          >
            <LoseIndicator />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-[8px] z-0 bg-[#FF0018]/5"
          animate={{
            boxShadow: [
              'inset 0 0 10px rgba(255, 0, 24, 0.1)',
              'inset 0 0 20px rgba(255, 0, 24, 0.3)',
              'inset 0 0 10px rgba(255, 0, 24, 0.1)',
            ],
          }}
          transition={{
            duration: 1.8,
            repeat: 4,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="w-3/4 flex items-center justify-center gap-16 relative z-10">
        <AfelLogo />
        <PlusIcon height={19} width={19} />
        <SlotFrenzyText />
      </div>
    </div>
  );
};

export default LoseAnimation;
