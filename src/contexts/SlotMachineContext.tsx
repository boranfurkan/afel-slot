import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import { solToLamports } from '@/lib/utils';
import { MOCK_USER_DATA } from '@/mock';

// Define the types of icons that can appear in the slots
export enum SlotIconType {
  AFEL = 1,
  AVOCADO = 2,
  BANANA = 3,
  CHERRIES = 4,
  MANGO = 5,
  PEAR = 6,
}

// Map icons to their respective multipliers based on the game logic
const ICON_MULTIPLIERS = {
  // Full matches (all three the same)
  [SlotIconType.AFEL]: 1.2,
  [SlotIconType.AVOCADO]: 1.2,
  [SlotIconType.BANANA]: 2,
  [SlotIconType.CHERRIES]: 3,
  [SlotIconType.MANGO]: 5,
  [SlotIconType.PEAR]: 10,
};

// Special combinations with their multipliers
const SPECIAL_COMBINATIONS = [
  {
    combo: [SlotIconType.AFEL, SlotIconType.AVOCADO, SlotIconType.AVOCADO],
    multiplier: 1.5,
  },
  {
    combo: [SlotIconType.BANANA, SlotIconType.CHERRIES, SlotIconType.BANANA],
    multiplier: 2.5,
  },
  {
    combo: [SlotIconType.AVOCADO, SlotIconType.MANGO, SlotIconType.PEAR],
    multiplier: 3,
  },
  {
    combo: [SlotIconType.CHERRIES, SlotIconType.PEAR, SlotIconType.MANGO],
    multiplier: 4,
  },
];

// Winning patterns to check (rows and diagonals)
const WINNING_PATTERNS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

interface WinningResult {
  isWin: boolean;
  multiplier: number;
  winningPatterns: number[][];
  winAmount: number;
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

  // Create a ref for the slot counters
  const slotRefs = useRef<any[]>([]);

  // Generate random slots
  const generateRandomSlots = useCallback(() => {
    return Array(9)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 6) + 1) as SlotIconType);
  }, []);

  // Check if a pattern is a full match (all three the same)
  const isFullMatch = (pattern: SlotIconType[]): boolean => {
    return pattern[0] === pattern[1] && pattern[1] === pattern[2];
  };

  // Check if a pattern matches a special combination
  const checkSpecialCombination = (pattern: SlotIconType[]): number | null => {
    for (const { combo, multiplier } of SPECIAL_COMBINATIONS) {
      if (
        pattern[0] === combo[0] &&
        pattern[1] === combo[1] &&
        pattern[2] === combo[2]
      ) {
        return multiplier;
      }
    }
    return null;
  };

  // Calculate winnings based on the slot values
  const calculateWinnings = useCallback(
    (slots: SlotIconType[]): WinningResult => {
      let totalMultiplier = 0;
      const winningPatterns: number[][] = [];

      // Check each winning pattern
      for (const pattern of WINNING_PATTERNS) {
        const patternValues = [
          slots[pattern[0]],
          slots[pattern[1]],
          slots[pattern[2]],
        ];

        // Check for full match
        if (isFullMatch(patternValues)) {
          totalMultiplier += ICON_MULTIPLIERS[patternValues[0]];
          winningPatterns.push(pattern);
          continue;
        }

        // Check for special combination
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
      };
    },
    [betAmount]
  );

  // Spin the slots
  const spinSlots = useCallback(() => {
    if (isSpinning || solToLamports(betAmount) > userBalance) return;

    // Deduct bet amount from balance
    setUserBalance((prev) => prev - solToLamports(betAmount));

    setIsSpinning(true);
    setWinResult(null);
    setPreviousSlotValues(slotValues);

    // Generate new slot values
    const newSlotValues = generateRandomSlots();

    // Start the animation for each slot
    if (slotRefs.current) {
      slotRefs.current.forEach((ref, index) => {
        if (ref) {
          // Add slight delay for each column to create cascading effect
          setTimeout(() => {
            ref.startAnimation({
              duration: 2 + Math.random() * 0.5, // Randomize duration slightly
            });
          }, (index % 3) * 200); // Delay based on column
        }
      });
    }

    // Update the slots after a delay
    setTimeout(() => {
      setSlotValues(newSlotValues);

      // Calculate winnings
      const result = calculateWinnings(newSlotValues);
      setWinResult(result);

      // Add winnings to balance if there's a win
      if (result.isWin) {
        setUserBalance((prev) => prev + result.winAmount);
      }

      setIsSpinning(false);
    }, 3000); // Total animation time
  }, [
    isSpinning,
    betAmount,
    userBalance,
    slotValues,
    generateRandomSlots,
    calculateWinnings,
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
