import React, { useEffect, useState } from 'react';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

interface SlotMachineControllerProps {
  children: (props: {
    isReady: boolean;
    onReelStop: (columnIndex: number) => void;
    completedReels: number;
  }) => React.ReactNode;
}

/**
 * A controller component that manages the coordination between
 * multiple slot reels to ensure synchronized animations and proper
 * stopping positions.
 */
const SlotMachineController: React.FC<SlotMachineControllerProps> = ({
  children,
}) => {
  const { isSpinning, slotValues, winResult } = useSlotMachine();
  const [completedReels, setCompletedReels] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [reelStopOrder, setReelStopOrder] = useState<number[]>([]);

  // Track which reels have completed their animation
  const handleReelStop = (columnIndex: number) => {
    setReelStopOrder((prev) => [...prev, columnIndex]);
    setCompletedReels((prev) => prev + 1);
  };

  // Reset state when spinning starts or stops
  useEffect(() => {
    if (isSpinning) {
      setCompletedReels(0);
      setReelStopOrder([]);
      setIsReady(false);
    } else {
      // When spinning stops, prepare for final positioning
      setIsReady(true);
    }
  }, [isSpinning]);

  // Log when all reels have completed (helpful for debugging)
  useEffect(() => {
    if (completedReels === 3 && winResult?.isWin) {
      // All reels have stopped and there's a win
      console.log('All reels stopped in order:', reelStopOrder);
      console.log('Win patterns:', winResult.winningPatterns);
    }
  }, [completedReels, winResult, reelStopOrder]);

  // Expose the controller state and functions to children
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
