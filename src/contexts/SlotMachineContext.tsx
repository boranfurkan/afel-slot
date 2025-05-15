import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import useSound from 'use-sound';
import { solToLamports } from '@/lib/utils';
import { MOCK_USER_DATA } from '@/mock';
import {
  WINNING_PATTERNS,
  ICON_MULTIPLIERS,
  isFullMatch,
  checkSpecialCombination,
} from '@/lib/win-patterns';
import { SlotIconType } from '@/types/app';

export interface WinningResult {
  isWin: boolean;
  multiplier: number;
  winningPatterns: number[][];
  winAmount: number;
  timestamp: number;
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
  resetWinResult: () => void;
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(0.1);
  const [winResult, setWinResult] = useState<WinningResult | null>(null);
  const [userBalance, setUserBalance] = useState(MOCK_USER_DATA.solBalance);
  const [spinCompleted, setSpinCompleted] = useState(true);

  const slotRefs = useRef<any[]>([]);

  // Sound hooks
  const [playReelsBegin] = useSound('/sounds/reels-begin.mp3');

  const resetWinResult = useCallback(() => {
    setWinResult(null);
  }, []);

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
        timestamp: Date.now(),
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

    // Play the reels begin sound when spinning starts
    playReelsBegin();

    resetWinResult();
    setIsSpinning(true);
    setSpinCompleted(false);
    setUserBalance((prev) => prev - solToLamports(betAmount));

    const newSlotValues = generateRandomSlots();

    setTimeout(() => {
      setSlotValues(newSlotValues);
      const result = calculateWinnings(newSlotValues);
      setIsSpinning(false);

      if (result.isWin) {
        setUserBalance((prev) => prev + result.winAmount);
      }

      setWinResult(result);
    }, 3000);
  }, [
    isSpinning,
    spinCompleted,
    betAmount,
    userBalance,
    generateRandomSlots,
    calculateWinnings,
    resetWinResult,
    playReelsBegin,
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
    resetWinResult,
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
