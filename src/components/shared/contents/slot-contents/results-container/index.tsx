import React, { useEffect, useState } from 'react';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import WinAnimation from './WinAnimation';
import LoseAnimation from './LoseAnimation';
import IdleState from './IdleState';

// This is a master controller component that will completely unmount and remount
// child components based on game state
const ResultContainer = () => {
  const { winResult, isSpinning, spinCompleted } = useSlotMachine();
  // Force a re-render on state changes with a unique key
  const [componentKey, setComponentKey] = useState(Date.now());

  // Reset on any state change
  useEffect(() => {
    // When spinning starts or finishes, force a complete component remount
    setComponentKey(Date.now());
  }, [isSpinning, spinCompleted]);

  // Determine which component to render
  if (isSpinning) {
    // If spinning, show spinning state
    return <IdleState key={`spinning-${componentKey}`} isSpinning={true} />;
  } else if (!spinCompleted) {
    // If animation finishing but not complete
    return <IdleState key={`waiting-${componentKey}`} isSpinning={false} />;
  } else if (winResult) {
    // If we have a result
    if (winResult.isWin) {
      return <WinAnimation key={`win-${componentKey}`} />;
    } else {
      return <LoseAnimation key={`lose-${componentKey}`} />;
    }
  } else {
    // Default idle state
    return <IdleState key={`idle-${componentKey}`} isSpinning={false} />;
  }
};

export default ResultContainer;
