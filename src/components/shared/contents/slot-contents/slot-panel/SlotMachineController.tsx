import React, { useEffect, useState } from 'react';
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
  const [reelStopOrder, setReelStopOrder] = useState<number[]>([]);

  // Track which reels have completed their animation
  const handleReelStop = (columnIndex: number) => {
    setReelStopOrder((prev) => [...prev, columnIndex]);
    setCompletedReels((prev) => prev + 1);
  };

  // Reset state when spinning starts
  useEffect(() => {
    if (isSpinning) {
      // Reset animation state
      setCompletedReels(0);
      setReelStopOrder([]);
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
      // All reels have stopped, ready to show results
      // Add a small delay to ensure animations complete
      setTimeout(() => {
        // Call the context function to mark the spin as completed
        markSpinCompleted();

        if (winResult?.isWin) {
          console.log('All reels stopped in order:', reelStopOrder);
          console.log('Win patterns:', winResult.winningPatterns);
        }
      }, 500);
    }
  }, [completedReels, markSpinCompleted, reelStopOrder, winResult, isSpinning]);

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

export default SlotMachineController;
