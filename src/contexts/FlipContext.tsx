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
  isAnimating: boolean;

  setBetAmount: (amount: number) => void;
  setSelectedSide: (side: FlipSide) => void;
  startFlip: () => void;
  resetGame: () => void;
  claimReward: () => void;
  setIsAnimating: (isAnimating: boolean) => void;

  canStartFlip: boolean;
  canClaimReward: boolean;
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
  const [isAnimating, setIsAnimating] = useState(false);

  const [playCoinFlip] = useSound('/sounds/coin-flip.mp3');
  const [playWin] = useSound('/sounds/winner.mp3');
  const [playLose] = useSound('/sounds/lose.mp3');

  const canStartFlip =
    gameState === FlipGameState.IDLE &&
    selectedSide !== null &&
    betAmount > 0 &&
    solToLamports(betAmount) <= userBalance &&
    !isAnimating;

  const canClaimReward =
    gameState === FlipGameState.RESULT &&
    flipResult !== null &&
    flipResult.isWin === true &&
    !isAnimating;

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

    // Play appropriate sound
    setTimeout(() => {
      if (isWin) {
        playWin();
      } else {
        playLose();
      }
    }, 500);

    setGameState(FlipGameState.RESULT);
  }, [selectedSide, betAmount, playWin, playLose]);

  const startFlip = useCallback(() => {
    if (!canStartFlip) return;

    // Deduct bet amount immediately
    setUserBalance((prev) => prev - solToLamports(betAmount));
    setGameState(FlipGameState.WAITING_FOR_DEPOSIT);

    // Wait for deposit simulation
    setTimeout(() => {
      setGameState(FlipGameState.FLIPPING);
      setIsAnimating(true);
      playCoinFlip();

      // Start flip animation and wait for completion
      setTimeout(() => {
        performFlip();
        setIsAnimating(false);
      }, 4000); // 4 seconds for coin flip animation
    }, 2500); // 2.5 seconds waiting for deposit
  }, [canStartFlip, betAmount, playCoinFlip, performFlip]);

  const claimReward = useCallback(() => {
    if (!canClaimReward) return;

    // Add winnings to balance (this was already added in performFlip, but we'll show animation)
    setIsAnimating(true);

    setTimeout(() => {
      resetGame();
      setIsAnimating(false);
    }, 1500); // Animation duration for claiming
  }, [canClaimReward]);

  const resetGame = useCallback(() => {
    setGameState(FlipGameState.IDLE);
    setFlipResult(null);
    setIsAnimating(false);
    // Keep selectedSide and betAmount for user convenience
  }, []);

  const value = {
    gameState,
    betAmount,
    selectedSide,
    flipResult,
    userBalance,
    isAnimating,
    setBetAmount,
    setSelectedSide,
    startFlip,
    resetGame,
    claimReward,
    setIsAnimating,
    canStartFlip,
    canClaimReward,
  };

  return <FlipContext.Provider value={value}>{children}</FlipContext.Provider>;
};

export const useFlipMachine = () => {
  const context = useContext(FlipContext);
  if (context === undefined) {
    throw new Error('useFlipMachine must be used within a FlipProvider');
  }
  return context;
};
