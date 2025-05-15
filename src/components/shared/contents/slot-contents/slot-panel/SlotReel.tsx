import React, { memo } from 'react';
import { motion } from 'framer-motion';

import SlotIcon from './SlotIcon';
import { useReelAnimation } from '@/hooks/useReelAnimation';
import { SlotIconType } from '@/types/app';

interface SlotReelProps {
  columnIndex: number;
  finalValues: SlotIconType[];
  isSpinning: boolean;
  winningRows: number[];
  onReelStop?: () => void;
}

const SlotReel: React.FC<SlotReelProps> = ({
  columnIndex,
  finalValues,
  isSpinning,
  winningRows,
  onReelStop,
}) => {
  const slotHeight = 150;

  const { reelRef, reelContainerRef, boxesRef, reelIcons } = useReelAnimation({
    columnIndex,
    finalValues,
    isSpinning,
    slotHeight,
    onReelStop: onReelStop || (() => {}),
  });

  return (
    <div
      ref={reelRef}
      className="relative h-full overflow-hidden border-2 border-[#6c924a]/50 rounded-md bg-gradient-to-b from-white/30 to-white/5"
    >
      <div ref={reelContainerRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          <div className="h-full w-px bg-white/20"></div>
          <div className="h-full w-px bg-white/20"></div>
        </div>

        {reelIcons.map((iconType, index) => (
          <div
            key={`slot-box-${columnIndex}-${index}`}
            ref={(el) => {
              if (el) boxesRef.current[index] = el;
            }}
            className="slot-box absolute w-full h-[150px] flex items-center justify-center"
            style={{
              top: 0,
              transform: `translateY(${index * 150}px)`,
              visibility: index < 3 ? 'visible' : 'hidden',
              zIndex: 10 - (index % 10),
            }}
          >
            <div className="slot-icon-container w-full h-full flex items-center justify-center">
              <SlotIcon type={iconType} size={100} className="p-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 h-[10px] pointer-events-none bg-gradient-to-b from-white/10 to-transparent z-10"></div>
      <div className="absolute inset-x-0 bottom-0 h-[10px] pointer-events-none bg-gradient-to-t from-white/10 to-transparent z-10"></div>

      {winningRows.map(
        (rowIndex) =>
          !isSpinning && (
            <motion.div
              key={`win-highlight-${columnIndex}-${rowIndex}`}
              className="absolute inset-x-0 h-[150px] rounded-md pointer-events-none z-20"
              style={{
                top: `${rowIndex * 150}px`,
                filter: 'none',
                willChange: 'filter, background-color',
              }}
              initial={{ opacity: 0 }}
              animate={{
                filter: [
                  'drop-shadow(0 0 0px #a0c380)',
                  'drop-shadow(0 0 15px #a0c380)',
                  'drop-shadow(0 0 0px #a0c380)',
                ],
                backgroundColor: [
                  'rgba(160, 195, 128, 0)',
                  'rgba(160, 195, 128, 0.3)',
                  'rgba(160, 195, 128, 0)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          )
      )}
    </div>
  );
};

export default memo(SlotReel);
