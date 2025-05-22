import React from 'react';
import { Separator } from '@/components/UI/separator';
import LastFlipItem from './LastFlipItem';
import { FlipSide } from '@/types/app';

const LastFlipsShow = () => {
  const flipData = [
    { id: 1, result: 'HEADS' },
    { id: 2, result: 'TAILS' },
    { id: 3, result: 'HEADS' },
    { id: 4, result: 'TAILS' },
    { id: 5, result: 'HEADS' },
    { id: 6, result: 'TAILS' },
    { id: 7, result: 'HEADS' },
    { id: 8, result: 'TAILS' },
    { id: 9, result: 'HEADS' },
    { id: 10, result: 'TAILS' },
    { id: 11, result: 'HEADS' },
    { id: 12, result: 'TAILS' },
    { id: 13, result: 'HEADS' },
    { id: 14, result: 'TAILS' },
    { id: 15, result: 'HEADS' },
    { id: 16, result: 'TAILS' },
    { id: 17, result: 'HEADS' },
    { id: 18, result: 'TAILS' },
    { id: 19, result: 'HEADS' },
    { id: 20, result: 'TAILS' },
    { id: 21, result: 'HEADS' },
    { id: 22, result: 'TAILS' },
    { id: 23, result: 'HEADS' },
  ];

  return (
    <div className="flex items-center gap-3 flex-1 w-full">
      <div className="flex items-center gap-2">
        <h4 className="font-normal text-base leading-[27.2px] tracking-[0%] text-white text-nowrap">
          LAST FLIPS
        </h4>
        <LastFlipItem side={flipData[0].result as FlipSide} />
      </div>
      <Separator
        className="bg-white/30 w-[1px] h-5 min-h-5"
        orientation="vertical"
      />
      <div className="flex items-center gap-2 flex-1 overflow-x-scroll no-scrollbar">
        {flipData.map((flip) => (
          <LastFlipItem key={flip.id} side={flip.result as FlipSide} />
        ))}
      </div>
    </div>
  );
};

export default LastFlipsShow;
