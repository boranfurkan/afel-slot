import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import SlotCounter from 'react-slot-counter';
import { motion } from 'framer-motion';
import SlotIcon from '@/components/shared/contents/slot-contents/slot-panel/SlotIcon';
import { SlotIconType, useSlotMachine } from '@/contexts/SlotMachineContext';

const SlotPanel = () => {
  const { slotValues, isSpinning, winResult, slotRefs } = useSlotMachine();

  // Initialize refs for each slot
  useEffect(() => {
    slotRefs.current = slotRefs.current.slice(0, 9);
    while (slotRefs.current.length < 9) {
      slotRefs.current.push(null);
    }
  }, [slotRefs]);

  // Group slots into a 3x3 grid pattern
  const rows = [
    slotValues.slice(0, 3), // First row
    slotValues.slice(3, 6), // Second row
    slotValues.slice(6, 9), // Third row
  ];

  // Create dummy characters array for the slot machine
  const dummyIcons = Object.values(SlotIconType)
    .filter((value) => typeof value === 'number')
    .map((type) => (
      <SlotIcon
        key={`dummy-${type}`}
        type={type as SlotIconType}
        size={64}
        className="p-1"
      />
    ));

  // Highlight winning patterns
  const isWinningSlot = (rowIndex: number, colIndex: number): boolean => {
    if (!winResult || !winResult.isWin) return false;

    const slotIndex = rowIndex * 3 + colIndex;
    return winResult.winningPatterns.some((pattern) =>
      pattern.includes(slotIndex)
    );
  };

  return (
    <div className="w-full  relative border-l-2 border-[#8db170]">
      <Image
        src="/slot-background.png"
        fill
        alt="slot background"
        className="object-center object-cover pointer-events-none"
        priority
      />

      <div className="relative z-10 w-full h-full flex h-[40vh] flex-col items-center justify-center">
        <div className="slot-machine-container w-[90%] h-[80%] bg-black/30 rounded-lg backdrop-blur-sm p-6">
          {/* Slot reels */}
          <div className="grid grid-cols-3 gap-2 h-full">
            {rows.map((row, rowIndex) =>
              row.map((iconType, colIndex) => {
                const slotIndex = rowIndex * 3 + colIndex;
                const isWinning = isWinningSlot(rowIndex, colIndex);

                return (
                  <div
                    key={`slot-${rowIndex}-${colIndex}`}
                    className="relative h-full"
                  >
                    {/* Reel border and styling */}
                    <div className="absolute inset-0 border-2 border-[#6c924a]/50 rounded-md bg-gradient-to-b from-white/30 to-white/5 overflow-hidden">
                      {/* Vertical lines for slot effect */}
                      <div className="absolute inset-0 flex justify-between">
                        <div className="h-full w-px bg-white/20"></div>
                        <div className="h-full w-px bg-white/20"></div>
                      </div>
                    </div>

                    {/* Slot counter component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SlotCounter
                        ref={(el) => {
                          if (slotRefs.current) {
                            slotRefs.current[slotIndex] = el;
                          }
                        }}
                        startValueOnce
                        autoAnimationStart={false}
                        duration={1.5 + colIndex * 0.2} // Stagger duration
                        speed={1.2}
                        delay={rowIndex * 0.1} // Slight delay between rows
                        value={[
                          <SlotIcon
                            type={iconType}
                            key={`value-${slotIndex}`}
                            className="p-1"
                          />,
                        ]}
                        dummyCharacters={dummyIcons}
                        dummyCharacterCount={10}
                        containerClassName="w-full h-full flex items-center justify-center"
                        charClassName="w-full h-full flex items-center justify-center"
                      />
                    </div>

                    {/* Winning highlight effect */}
                    {isWinning && !isSpinning && (
                      <motion.div
                        className="absolute inset-0 rounded-md ring-4 ring-[#a0c380] bg-[#a0c380]/20"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [0.9, 1.05, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Win lines */}
        {winResult && winResult.isWin && !isSpinning && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {winResult.winningPatterns.map((pattern, index) => {
                // Calculate center points for each winning slot
                const points = pattern.map((slotIndex) => {
                  const row = Math.floor(slotIndex / 3);
                  const col = slotIndex % 3;
                  // Calculate x, y coordinates based on grid position
                  const x = 50 + col * 100;
                  const y = 50 + row * 100;
                  return { x, y };
                });

                // Create path for the winning line
                const pathData = `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y}`;

                return (
                  <motion.path
                    key={`win-line-${index}`}
                    d={pathData}
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
                      delay: index * 0.3,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        )}

        {/* Win information */}
        {winResult && winResult.isWin && !isSpinning && (
          <motion.div
            className="absolute bottom-4 left-0 right-0 text-center"
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
