import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import SlotReel from './SlotReel';
import WinMultiplierEffect from './WinMultiplierEffect';
import RowIndicator from './RowIndicator';
import WinningLine from './WinningLine';
import { getWinPatternType } from '@/lib/win-patterns';
import { SlotIconType } from '@/types/app';

interface SlotPanelProps {
  onReelStop: (columnIndex: number) => void;
  completedReels: number;
  isReady: boolean;
}

const SlotPanel: React.FC<SlotPanelProps> = ({
  onReelStop,
  completedReels,
  isReady,
}) => {
  const { slotValues, isSpinning, winResult } = useSlotMachine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size when it changes or when component mounts
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    // Initial size measurement
    updateSize();

    // Set up resize listener
    window.addEventListener('resize', updateSize);

    // Measure again after a short delay to ensure all elements have rendered
    const timer = setTimeout(updateSize, 500);

    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, []);

  const getColumnValues = (columnIndex: number): SlotIconType[] => {
    return [
      slotValues[columnIndex],
      slotValues[columnIndex + 3],
      slotValues[columnIndex + 6],
    ];
  };

  const getWinningRowsForColumn = (columnIndex: number): number[] => {
    if (!winResult || !winResult.isWin) return [];

    return winResult.winningPatterns.flatMap((pattern) =>
      pattern
        .filter((index) => index % 3 === columnIndex)
        .map((index) => Math.floor(index / 3))
    );
  };

  const reelDimensions = {
    height: '450px', // 3 rows at 150px each
  };

  // Debug winning patterns
  useEffect(() => {
    if (winResult?.isWin && !isSpinning && completedReels === 3) {
      console.log('Win detected! Patterns:', winResult.winningPatterns);
      console.log('Container size:', containerSize);
    }
  }, [winResult, isSpinning, completedReels, containerSize]);

  // Check if we should show winning lines
  const showWinningLines =
    winResult?.isWin && !isSpinning && completedReels === 3;

  return (
    <div
      className="w-full relative border-l-2 border-[#8db170] overflow-visible"
      style={{ isolation: 'isolate' }}
    >
      <Image
        src="/slot-background.png"
        fill
        alt="slot background"
        className="object-center object-cover pointer-events-none"
        priority
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-6">
        <div
          ref={containerRef}
          className="slot-machine-container w-[90%] bg-black/30 rounded-lg backdrop-blur-sm p-6 relative overflow-visible"
          style={{ zIndex: 20 }}
        >
          {/* Slot reels */}
          <div
            className="grid grid-cols-3 gap-4 relative"
            style={{ height: reelDimensions.height }}
          >
            {[0, 1, 2].map((columnIndex) => (
              <SlotReel
                key={`reel-${columnIndex}`}
                columnIndex={columnIndex}
                finalValues={getColumnValues(columnIndex)}
                isSpinning={isSpinning}
                winningRows={getWinningRowsForColumn(columnIndex)}
                onReelStop={() => onReelStop(columnIndex)}
              />
            ))}
          </div>

          {/* Row indicators added last so they appear on top */}
          <RowIndicator side="left" containerHeight={reelDimensions.height} />
          <RowIndicator side="right" containerHeight={reelDimensions.height} />

          {/* Winning lines - simplified for debugging */}
          {showWinningLines &&
            winResult.winningPatterns.map((pattern, index) => (
              <WinningLine
                key={`win-line-${index}`}
                pattern={pattern}
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
                patternType={getWinPatternType(pattern)}
              />
            ))}

          {/* Win multiplier effect */}
          {showWinningLines && (
            <WinMultiplierEffect
              multiplier={winResult.multiplier}
              winAmount={winResult.winAmount}
              isVisible={true}
              winningPatterns={winResult.winningPatterns}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotPanel;
