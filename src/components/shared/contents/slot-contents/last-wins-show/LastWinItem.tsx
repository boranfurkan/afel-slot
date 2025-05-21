import { SlotIconType } from '@/types/app';
import React from 'react';
import SlotIcon from '../slot-panel/SlotIcon';

interface LastWinItemProps {
  rowOne: {
    elements: SlotIconType[];
    multiplier: number;
  };
  rowTwo: {
    elements: SlotIconType[];
    multiplier: number;
  };
}

const LastWinItem = ({ rowOne, rowTwo }: LastWinItemProps) => {
  return (
    <div className="bg-[#DFFFD1] px-3 py-1.5 flex flex-col w-max rounded-[15px]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {rowOne.elements.map((icon, index) => {
            return (
              <SlotIcon type={icon} size={30} key={`row1-icon-${index}`} />
            );
          })}
        </div>
        <p className="font-normal text-[48.28px] leading-[100%] tracking-[0%] text-right align-middle text-black">
          x{rowOne.multiplier}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {rowTwo.elements.map((icon, index) => {
            return (
              <SlotIcon type={icon} size={30} key={`row2-icon-${index}`} />
            );
          })}
        </div>
        <p className="font-normal text-[48.28px] leading-[100%] tracking-[0%] text-right align-middle text-black">
          x{rowTwo.multiplier}
        </p>
      </div>
    </div>
  );
};

export default LastWinItem;
