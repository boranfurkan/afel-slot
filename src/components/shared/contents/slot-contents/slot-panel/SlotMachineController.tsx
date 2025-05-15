import React, { useEffect, useState, useCallback, memo } from 'react';
import useSound from 'use-sound';
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
  const { isSpinning, winResult, markSpinCompleted, resetWinResult } =
    useSlotMachine();
  const [completedReels, setCompletedReels] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [playReelsEnd] = useSound('/sounds/reels-end.mp3');

  const handleReelStop = useCallback((columnIndex: number) => {
    setCompletedReels((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      // Reset animation state
      setCompletedReels(0);
      setIsReady(false);

      // Also ensure win result is reset
      resetWinResult();
    } else {
      // When spinning stops, prepare for final positioning
      setIsReady(true);
    }
  }, [isSpinning, resetWinResult]);

  // Mark spin as completed when all reels stop
  useEffect(() => {
    if (completedReels === 3 && !isSpinning) {
      // Play reels end sound when all reels have stopped
      playReelsEnd();

      // Add a small delay to ensure animations complete
      const timer = setTimeout(() => {
        // Call the context function to mark the spin as completed
        markSpinCompleted();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [completedReels, markSpinCompleted, isSpinning, playReelsEnd]);

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
