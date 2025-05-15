import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SlotIconType, useSlotMachine } from '@/contexts/SlotMachineContext';
import SlotReel from './SlotReel';
import WinMultiplierEffect from './WinMultiplierEffect';

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

  // Update container size when it changes
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setContainerSize({ width: rect.width, height: rect.height });
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Convert the flat slotValues array to a column-based structure for our reels
  const getColumnValues = (columnIndex: number): SlotIconType[] => {
    return [
      slotValues[columnIndex], // Top row
      slotValues[columnIndex + 3], // Middle row
      slotValues[columnIndex + 6], // Bottom row
    ];
  };

  // Get winning rows for a specific column
  const getWinningRowsForColumn = (columnIndex: number): number[] => {
    if (!winResult || !winResult.isWin) return [];

    return winResult.winningPatterns.flatMap(
      (pattern) =>
        pattern
          .filter((index) => index % 3 === columnIndex) // Filter indices for this column
          .map((index) => Math.floor(index / 3)) // Convert to row index (0, 1, or 2)
    );
  };

  // Calculate dimensions to ensure perfect 3x3 grid
  const calculateReelDimensions = () => {
    // Each reel should have exactly 3 slots visible (150px each for taller reels)
    return {
      height: '450px', // 3 rows at 150px each
    };
  };

  const reelDimensions = calculateReelDimensions();

  // Calculate the path for the winning line based on the pattern
  const calculateWinningLinePath = () => {
    if (
      !winResult?.isWin ||
      !containerRef.current ||
      winResult.winningPatterns.length === 0
    )
      return null;

    // Get container dimensions
    const { width, height } = containerSize;
    const reelWidth = width / 3;
    const slotHeight = height / 3;

    // We'll take the first winning pattern to draw the line
    const pattern = winResult.winningPatterns[0];

    // Calculate exact pixel coordinates for each winning slot
    const points = pattern.map((slotIndex) => {
      const row = Math.floor(slotIndex / 3);
      const col = slotIndex % 3;

      // Calculate center coordinates in pixels
      const x = col * reelWidth + reelWidth / 2;
      const y = row * slotHeight + slotHeight / 2;

      return { x, y };
    });

    // Calculate the path based on the pattern orientation
    // Row win, column win, or diagonal win
    if (
      (pattern[0] === 0 && pattern[1] === 1 && pattern[2] === 2) || // Row 1
      (pattern[0] === 3 && pattern[1] === 4 && pattern[2] === 5) || // Row 2
      (pattern[0] === 6 && pattern[1] === 7 && pattern[2] === 8) // Row 3
    ) {
      // Horizontal line - Draw a single curved path through the three points
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[0].x + reelWidth / 2,
        controlY1: points[0].y - slotHeight / 4,
        controlX2: points[2].x - reelWidth / 2,
        controlY2: points[2].y - slotHeight / 4,
      };
    } else if (
      (pattern[0] === 0 && pattern[1] === 3 && pattern[2] === 6) || // Column 1
      (pattern[0] === 1 && pattern[1] === 4 && pattern[2] === 7) || // Column 2
      (pattern[0] === 2 && pattern[1] === 5 && pattern[2] === 8) // Column 3
    ) {
      // Vertical line - Draw a single curved path through the three points
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[0].x + reelWidth / 4,
        controlY1: points[0].y + slotHeight / 2,
        controlX2: points[2].x + reelWidth / 4,
        controlY2: points[2].y - slotHeight / 2,
      };
    } else if (pattern[0] === 0 && pattern[1] === 4 && pattern[2] === 8) {
      // Diagonal from top-left to bottom-right
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[1].x - reelWidth / 4,
        controlY1: points[1].y - slotHeight / 4,
        controlX2: points[1].x + reelWidth / 4,
        controlY2: points[1].y + slotHeight / 4,
      };
    } else if (pattern[0] === 2 && pattern[1] === 4 && pattern[2] === 6) {
      // Diagonal from top-right to bottom-left
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[1].x + reelWidth / 4,
        controlY1: points[1].y - slotHeight / 4,
        controlX2: points[1].x - reelWidth / 4,
        controlY2: points[1].y + slotHeight / 4,
      };
    } else {
      // Special combination
      // For special combinations, we'll just draw a direct curve through the points
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[1].x,
        controlY1: points[1].y - slotHeight / 3,
        controlX2: points[1].x,
        controlY2: points[1].y + slotHeight / 3,
      };
    }
  };

  // Calculate the win path only once when needed
  const winPath =
    winResult?.isWin && !isSpinning && completedReels === 3
      ? calculateWinningLinePath()
      : null;

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
          {/* Row indicators on the left */}
          <div
            className="absolute left-0 top-0 h-full flex flex-col justify-between items-center"
            style={{
              transform: 'translateX(-50%)',
              height: reelDimensions.height,
              marginTop: '6px',
            }}
          >
            {[1, 2, 3].map((row, idx) => (
              <div
                key={`left-row-${row}`}
                className="w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
                style={{
                  marginTop: idx === 0 ? '10%' : 0,
                  marginBottom: idx === 2 ? '10%' : 0,
                }}
              >
                {row}
              </div>
            ))}
          </div>

          {/* Slot reels - fixed dimensions for perfect alignment */}
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

          {/* Row indicators on the right */}
          <div
            className="absolute right-0 top-0 h-full flex flex-col justify-between items-center"
            style={{
              transform: 'translateX(50%)',
              height: reelDimensions.height,
              marginTop: '6px',
            }}
          >
            {[1, 2, 3].map((row, idx) => (
              <div
                key={`right-row-${row}`}
                className="w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
                style={{
                  marginTop: idx === 0 ? '10%' : 0,
                  marginBottom: idx === 2 ? '10%' : 0,
                }}
              >
                {row}
              </div>
            ))}
          </div>

          {/* Win line - Single curved path exactly like the design image */}
          {winPath && (
            <svg
              className="absolute inset-0 w-full h-full z-50 overflow-visible"
              preserveAspectRatio="none"
              style={{ pointerEvents: 'none' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4DFF00" />
                  <stop offset="100%" stopColor="#009705" />
                </linearGradient>
                <filter
                  id="winLineFilter"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  filterUnits="userSpaceOnUse"
                >
                  <feDropShadow
                    dx="5.91"
                    dy="3.94"
                    stdDeviation="5.221"
                    floodColor="#15FF00"
                    floodOpacity="1"
                  />
                </filter>
              </defs>
              <motion.path
                d={`M ${winPath.startX} ${winPath.startY} C ${winPath.controlX1} ${winPath.controlY1}, ${winPath.controlX2} ${winPath.controlY2}, ${winPath.endX} ${winPath.endY}`}
                stroke="url(#lineGradient)"
                strokeWidth="5.91"
                fill="none"
                filter="url(#winLineFilter)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
          )}

          {/* Win multiplier flying text effect */}
          {winResult &&
            winResult.isWin &&
            !isSpinning &&
            completedReels === 3 && (
              <WinMultiplierEffect
                multiplier={winResult.multiplier}
                winAmount={winResult.winAmount}
                isVisible={!isSpinning && completedReels === 3}
                winningPatterns={winResult.winningPatterns}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default SlotPanel;
