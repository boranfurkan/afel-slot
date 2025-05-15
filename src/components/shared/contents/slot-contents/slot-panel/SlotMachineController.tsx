import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

interface SlotMachineControllerProps {
  children: (props: {
    isReady: boolean;
    onReelStop: (columnIndex: number) => void;
    completedReels: number;
  }) => React.ReactNode;
}

const SlotMachineController: React.FC<SlotMachineControllerProps> = ({
  children,
}) => {
  const { isSpinning, markSpinCompleted, resetWinResult } = useSlotMachine();
  const [completedReels, setCompletedReels] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleReelStop = useCallback((columnIndex: number) => {
    setCompletedReels((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      setCompletedReels(0);
      setIsReady(false);

      resetWinResult();
    } else {
      setIsReady(true);
    }
  }, [isSpinning, resetWinResult]);

  useEffect(() => {
    if (completedReels === 3 && !isSpinning) {
      const timer = setTimeout(() => {
        markSpinCompleted();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [completedReels, markSpinCompleted, isSpinning]);

  return (
    <>
      {children({
        isReady,
        onReelStop: handleReelStop,
        completedReels,
      })}
    </>
  );
};

export default memo(SlotMachineController);
