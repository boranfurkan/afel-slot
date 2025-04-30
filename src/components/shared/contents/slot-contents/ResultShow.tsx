import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';
import WinIndicator from '@/components/UI/WinIndicator';
import LoseIndicator from '@/components/UI/LoseIndicator';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ResultShow = () => {
  const { winResult, isSpinning } = useSlotMachine();

  // Only show result when not spinning and we have a result
  const showResult = !isSpinning && winResult !== null;
  const isWin = showResult && winResult.isWin;

  return (
    <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4">
      <div className="bg-[#171717]/30 rounded-[8px] w-1/4 min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div
              key={isWin ? 'win' : 'lose'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {isWin ? <WinIndicator /> : <LoseIndicator />}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[62px]"
            />
          )}
        </AnimatePresence>
      </div>
      <div className="w-3/4 flex items-center justify-center gap-16">
        <AfelLogo />
        <PlusIcon height={19} width={19} />
        <SlotFrenzyText />
      </div>
    </div>
  );
};

export default ResultShow;
