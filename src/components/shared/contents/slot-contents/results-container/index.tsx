import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import WinAnimation from './WinAnimation';
import LoseAnimation from './LoseAnimation';
import IdleState from './IdleState';

const ResultContainer = () => {
  const { winResult, isSpinning, spinCompleted } = useSlotMachine();
  const [componentKey, setComponentKey] = useState(Date.now());

  const [playWinnerSound] = useSound('/sounds/winner.mp3');

  useEffect(() => {
    setComponentKey(Date.now());
  }, [isSpinning, spinCompleted]);

  useEffect(() => {
    if (winResult?.isWin && spinCompleted && !isSpinning) {
      playWinnerSound();
    }
  }, [winResult, spinCompleted, isSpinning, playWinnerSound]);

  if (isSpinning) {
    return <IdleState key={`spinning-${componentKey}`} isSpinning={true} />;
  } else if (!spinCompleted) {
    return <IdleState key={`waiting-${componentKey}`} isSpinning={false} />;
  } else if (winResult) {
    if (winResult.isWin) {
      return <WinAnimation key={`win-${componentKey}`} />;
    } else {
      return <LoseAnimation key={`lose-${componentKey}`} />;
    }
  } else {
    return <IdleState key={`idle-${componentKey}`} isSpinning={false} />;
  }
};

export default ResultContainer;
