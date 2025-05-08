import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SlotIconType, useSlotMachine } from '@/contexts/SlotMachineContext';
import SlotReel from './SlotReel';

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
    // Each reel should have exactly 3 slots visible (100px each)
    return {
      height: '300px', // 3 rows at 100px each
    };
  };

  const reelDimensions = calculateReelDimensions();

  // Calculate the winning line paths based on actual DOM positions
  const calculateWinningLinePaths = () => {
    if (!winResult || !winResult.isWin || !containerRef.current) return [];

    // Get container dimensions for accurate positioning
    const containerRect = containerRef.current.getBoundingClientRect();

    return winResult.winningPatterns.map((pattern) => {
      // Calculate center points for each winning slot
      const points = pattern.map((slotIndex) => {
        const row = Math.floor(slotIndex / 3);
        const col = slotIndex % 3;

        // Calculate center coordinates of each slot
        // These calculations need to match the actual positions in the rendered grid
        const x = col * 33.33 + 16.665; // Center of each column (as percentage)
        const y = row * 33.33 + 16.665; // Center of each row (as percentage)

        return { x, y };
      });

      // Create SVG path with percentages rather than fixed pixels
      return {
        path: `M ${points[0].x}% ${points[0].y}% L ${points[1].x}% ${points[1].y}% L ${points[2].x}% ${points[2].y}%`,
        index: pattern.join('-'),
      };
    });
  };

  return (
    <div className="w-full relative border-l-2 border-[#8db170]">
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
          className="slot-machine-container w-[90%] bg-black/30 rounded-lg backdrop-blur-sm p-6 relative"
        >
          {/* Slot reels - fixed dimensions for perfect alignment */}
          <div
            className="grid grid-cols-3 gap-4"
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

          {/* Win lines - positioned absolutely over the entire container */}
          {winResult &&
            winResult.isWin &&
            !isSpinning &&
            completedReels === 3 && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {calculateWinningLinePaths().map(({ path, index }) => (
                    <motion.path
                      key={`win-line-${index}`}
                      d={path}
                      stroke="#a0c380"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: [0, 0.8, 0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 0.5,
                      }}
                    />
                  ))}
                </svg>
              </div>
            )}
        </div>

        {/* Win information at the bottom */}
        {winResult && winResult.isWin && !isSpinning && (
          <motion.div
            className="absolute bottom-4 right-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="slot-gradient-to-bottom px-4 py-2 rounded-full inline-flex items-center justify-center">
              <span className="font-normal text-xl leading-[100%] tracking-[0%] text-right align-middle uppercase">
                WIN: {winResult.multiplier}x
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SlotPanel;
