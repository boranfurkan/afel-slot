import React from 'react';
import Image from 'next/image';
import FlipContentButton from '../FlipContentButton';

const BetChoosePanel = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FlipContentButton className="w-full !px-3 !py-1 h-16">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/afel-logo.png"
            width={35}
            height={35}
            alt="Afel Logo"
            className="w-8 h-8"
          />
          <div className="flex flex-col items-center whitespace-nowrap">
            <span className="font-normal text-[26.99px] leading-tight tracking-[0%] align-middle">
              0.5 BET
            </span>
            <span className="font-normal text-[17.54px] leading-tight tracking-[0%] align-middle">
              BABY BET
            </span>
          </div>
        </div>
      </FlipContentButton>
      <FlipContentButton className="w-full !px-3 !py-1 h-16 flex items-center justify-center">
        0.1 SOL
      </FlipContentButton>
      <FlipContentButton className="w-full !px-3 !py-1 h-16 flex items-center justify-center">
        0.25 SOL
      </FlipContentButton>
      <FlipContentButton className="w-full !px-3 !py-1 h-16 flex items-center justify-center">
        0.5 SOL
      </FlipContentButton>
      <FlipContentButton className="w-full !px-3 !py-1 h-16 flex items-center justify-center">
        1 SOL
      </FlipContentButton>
      <FlipContentButton className="w-full !px-3 !py-1 h-16" disabled={true}>
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/afel-logo.png"
            width={35}
            height={35}
            alt="Afel Logo"
            className="w-8 h-8"
          />
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="font-normal text-[26.99px] leading-tight tracking-[0%] text-left">
              2 BET
            </span>
            <span className="font-normal text-[17.54px] leading-tight tracking-[0%] text-left">
              LEGEND BET
            </span>
          </div>
        </div>
      </FlipContentButton>
    </div>
  );
};

export default BetChoosePanel;
