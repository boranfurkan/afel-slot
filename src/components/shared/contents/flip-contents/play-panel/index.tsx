import React from 'react';
import Image from 'next/image';
import ChooseSide from './ChooseSide';
import { Separator } from '@/components/UI/separator';
import BetChoosePanel from './BetChoosePanel';

const PlayPanel = () => {
  return (
    <div className="w-full flex flex-col items-center gap-10">
      <Image
        src="/flip/flip-icon.png"
        alt="Flip Icon"
        width={103}
        height={120}
        className="w-[103px] h-[120px] pointer-events-none"
      />
      <div className="w-full border border-[#FFFFFF99] p-2.5 rounded-[15px] flex flex-col gap-4">
        <ChooseSide />
        <Separator className="bg-[#FFFFFF99] w-full h-[1px]" />
        <BetChoosePanel />
        <Separator className="bg-[#FFFFFF99] w-full h-[1px]" />
      </div>
    </div>
  );
};

export default PlayPanel;
