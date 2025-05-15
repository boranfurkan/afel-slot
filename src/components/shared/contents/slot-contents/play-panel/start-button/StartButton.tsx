import React, { memo } from 'react';
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import { motion } from 'framer-motion';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import { lamportsToSol } from '@/lib/utils';

const StartButton = () => {
  const { spinSlots, isSpinning, betAmount, userBalance, spinCompleted } =
    useSlotMachine();

  const canSpin =
    !isSpinning &&
    spinCompleted &&
    parseFloat(lamportsToSol(userBalance)) >= betAmount;

  return (
    <motion.div
      className={`cursor-pointer flex items-center gap-4 justify-center select-none ${
        !canSpin ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => canSpin && spinSlots()}
      whileHover={canSpin ? { scale: 1.05 } : {}}
      whileTap={canSpin ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      <ArrowRightIcon width={24} height={47} />
      <span className="font-normal text-[77.25px] leading-[100%] tracking-[0%] text-right align-middle">
        {isSpinning ? 'SPINNING' : spinCompleted ? 'START' : 'WAITING'}
      </span>
    </motion.div>
  );
};

export default memo(StartButton);
