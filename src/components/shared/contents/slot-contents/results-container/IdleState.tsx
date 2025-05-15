import React from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';

interface IdleStateProps {
  isSpinning: boolean;
}

// Component shown when no win/lose state is active
const IdleState: React.FC<IdleStateProps> = ({ isSpinning }) => {
  return (
    <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4 relative overflow-hidden">
      {/* Result box - empty */}
      <div className="bg-[#171717]/30 backdrop-blur-sm rounded-[8px] w-1/4 min-h-[100px] flex items-center justify-center relative">
        <div className="h-[62px]" /> {/* Empty placeholder with same height */}
      </div>

      {/* Logo section */}
      <div className="w-3/4 flex items-center justify-center gap-16 relative z-10">
        <AfelLogo />

        <motion.div
          animate={
            isSpinning
              ? {
                  rotate: [0, 180, 360],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: isSpinning ? Infinity : 0,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <PlusIcon height={19} width={19} />
        </motion.div>

        <SlotFrenzyText />
      </div>
    </div>
  );
};

export default IdleState;
