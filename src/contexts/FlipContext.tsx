import React, { createContext, useContext, useState, useCallback } from 'react';
import useSound from 'use-sound';
import { solToLamports } from '@/lib/utils';
import { MOCK_USER_DATA } from '@/mock';
import { FlipSide } from '@/types/app';

export enum FlipGameState {
  IDLE = 'IDLE',
  WAITING_FOR_DEPOSIT = 'WAITING_FOR_DEPOSIT',
  FLIPPING = 'FLIPPING',
  RESULT = 'RESULT',
}

export interface FlipResult {
  result: FlipSide;
  isWin: boolean;
  winAmount: number;
  timestamp: number;
}

interface FlipContextType {
  gameState: FlipGameState;
  betAmount: number;
  selectedSide: FlipSide | null;
  flipResult: FlipResult | null;
  userBalance: number;

  setBetAmount: (amount: number) => void;
  setSelectedSide: (side: FlipSide) => void;
  startFlip: () => void;
  resetGame: () => void;

  canStartFlip: boolean;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export const FlipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(FlipGameState.IDLE);
  const [betAmount, setBetAmount] = useState(0.1);
  const [selectedSide, setSelectedSide] = useState<FlipSide | null>(null);
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  const [userBalance, setUserBalance] = useState(MOCK_USER_DATA.solBalance);

  const [playCoinFlip] = useSound('/sounds/coin-flip.mp3');
  const [playWin] = useSound('/sounds/winner.mp3');
  const [playLose] = useSound('/sounds/lose.mp3');

  const canStartFlip =
    gameState === FlipGameState.IDLE &&
    selectedSide !== null &&
    betAmount > 0 &&
    solToLamports(betAmount) <= userBalance;

  const performFlip = useCallback(() => {
    const result: FlipSide = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    const isWin = result === selectedSide;
    const winAmount = isWin ? solToLamports(betAmount) * 2 : 0;

    const newResult: FlipResult = {
      result,
      isWin,
      winAmount,
      timestamp: Date.now(),
    };

    setFlipResult(newResult);

    if (isWin) {
      setUserBalance((prev) => prev + winAmount);
      playWin();
    } else {
      playLose();
    }

    setGameState(FlipGameState.RESULT);
  }, [selectedSide, betAmount, playWin, playLose]);

  const startFlip = useCallback(() => {
    if (!canStartFlip) return;

    setUserBalance((prev) => prev - solToLamports(betAmount));

    setGameState(FlipGameState.WAITING_FOR_DEPOSIT);

    setTimeout(() => {
      setGameState(FlipGameState.FLIPPING);
      playCoinFlip();

      setTimeout(() => {
        performFlip();
      }, 3000);
    }, 2000);
  }, [canStartFlip, betAmount, playCoinFlip, performFlip]);

  const resetGame = useCallback(() => {
    setGameState(FlipGameState.IDLE);
    setSelectedSide(null);
    setFlipResult(null);
  }, []);

  const value = {
    gameState,
    betAmount,
    selectedSide,
    flipResult,
    userBalance,
    setBetAmount,
    setSelectedSide,
    startFlip,
    resetGame,
    canStartFlip,
  };

  return <FlipContext.Provider value={value}>{children}</FlipContext.Provider>;
};

export const useFlipMachine = () => {
  const context = useContext(FlipContext);
  if (context === undefined) {
    throw new Error('useFlipMachine must be used within a FlipMachineProvider');
  }
  return context;
};
