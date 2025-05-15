import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { solToLamports } from '@/lib/utils';
import { MOCK_USER_DATA } from '@/mock';
import {
  WINNING_PATTERNS,
  ICON_MULTIPLIERS,
  SPECIAL_COMBINATIONS,
  isFullMatch,
  checkSpecialCombination,
} from '@/lib/win-patterns';
import { SlotIconType } from '@/types/app';

export interface WinningResult {
  isWin: boolean;
  multiplier: number;
  winningPatterns: number[][];
  winAmount: number;
  timestamp: number; // Add a timestamp to force re-renders
}

interface SlotMachineContextType {
  slotValues: SlotIconType[];
  isSpinning: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  spinSlots: () => void;
  winResult: WinningResult | null;
  userBalance: number;
  slotRefs: React.RefObject<any[]>;
  spinCompleted: boolean;
  markSpinCompleted: () => void;
  resetWinResult: () => void; // New function to explicitly reset win result
}

const SlotMachineContext = createContext<SlotMachineContextType | undefined>(
  undefined
);

export const SlotMachineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [slotValues, setSlotValues] = useState<SlotIconType[]>(
    Array(9).fill(SlotIconType.AFEL)
  );
  const [previousSlotValues, setPreviousSlotValues] = useState<SlotIconType[]>(
    Array(9).fill(SlotIconType.AFEL)
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(0.1);
  const [winResult, setWinResult] = useState<WinningResult | null>(null);
  const [userBalance, setUserBalance] = useState(MOCK_USER_DATA.solBalance);
  const [spinCompleted, setSpinCompleted] = useState(true);

  const slotRefs = useRef<any[]>([]);

  // Explicitly reset win result - can be called from components
  const resetWinResult = useCallback(() => {
    setWinResult(null);
  }, []);

  // Force reset winResult when spinning starts
  useEffect(() => {
    if (isSpinning) {
      resetWinResult();
    }
  }, [isSpinning, resetWinResult]);

  const generateRandomSlots = useCallback(() => {
    return Array(9)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 6) + 1) as SlotIconType);
  }, []);

  const calculateWinnings = useCallback(
    (slots: SlotIconType[]): WinningResult => {
      let totalMultiplier = 0;
      const winningPatterns: number[][] = [];

      for (const pattern of WINNING_PATTERNS) {
        const patternValues = [
          slots[pattern[0]],
          slots[pattern[1]],
          slots[pattern[2]],
        ];

        if (isFullMatch(patternValues)) {
          totalMultiplier += ICON_MULTIPLIERS[patternValues[0]];
          winningPatterns.push(pattern);
          continue;
        }

        const specialMultiplier = checkSpecialCombination(patternValues);
        if (specialMultiplier !== null) {
          totalMultiplier += specialMultiplier;
          winningPatterns.push(pattern);
        }
      }

      const isWin = totalMultiplier > 0;
      const winAmount = isWin ? solToLamports(betAmount) * totalMultiplier : 0;

      return {
        isWin,
        multiplier: totalMultiplier,
        winningPatterns,
        winAmount,
        timestamp: Date.now(), // Add timestamp to ensure uniqueness
      };
    },
    [betAmount]
  );

  const markSpinCompleted = useCallback(() => {
    setSpinCompleted(true);
  }, []);

  const spinSlots = useCallback(() => {
    if (isSpinning || !spinCompleted || solToLamports(betAmount) > userBalance)
      return;

    // Reset win result at the start of each spin
    resetWinResult();

    // Set states to indicate spinning
    setIsSpinning(true);
    setSpinCompleted(false);

    // Deduct bet amount from balance
    setUserBalance((prev) => prev - solToLamports(betAmount));

    setPreviousSlotValues(slotValues);

    // Generate new slot values
    const newSlotValues = generateRandomSlots();

    // Start the animation for each slot
    if (slotRefs.current) {
      slotRefs.current.forEach((ref, index) => {
        if (ref) {
          setTimeout(() => {
            ref.startAnimation({
              duration: 2 + Math.random() * 0.5,
            });
          }, (index % 3) * 200);
        }
      });
    }

    setTimeout(() => {
      setSlotValues(newSlotValues);

      // Calculate winnings
      const result = calculateWinnings(newSlotValues);

      // End spinning state
      setIsSpinning(false);

      // Add winnings to balance if there's a win
      if (result.isWin) {
        setUserBalance((prev) => prev + result.winAmount);
      }

      // Set the result - will be displayed when spinCompleted is true
      setWinResult(result);

      // Log for debugging
      console.log('Spin completed, result:', result.isWin ? 'WIN' : 'LOSE');
    }, 3000);
  }, [
    isSpinning,
    spinCompleted,
    betAmount,
    userBalance,
    slotValues,
    generateRandomSlots,
    calculateWinnings,
    resetWinResult,
  ]);

  const value = {
    slotValues,
    isSpinning,
    betAmount,
    setBetAmount,
    spinSlots,
    winResult,
    userBalance,
    slotRefs,
    spinCompleted,
    markSpinCompleted,
    resetWinResult, // Expose reset function
  };

  return (
    <SlotMachineContext.Provider value={value}>
      {children}
    </SlotMachineContext.Provider>
  );
};

export const useSlotMachine = () => {
  const context = useContext(SlotMachineContext);
  if (context === undefined) {
    throw new Error('useSlotMachine must be used within a SlotMachineProvider');
  }
  return context;
};
