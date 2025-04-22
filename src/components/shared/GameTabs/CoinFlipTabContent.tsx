import GoldIcon from '@/assets/icons/GoldIcon';
import React from 'react';

const CoinFlipTabContent = () => {
  return (
    <div className="font-supply flex items-center gap-3 text-white">
      <span className="font-normal text-[40.97px] leading-[0%] tracking-[-3.5%] align-middle uppercase">
        Coin
      </span>
      <div className="relative">
        <GoldIcon />
      </div>
      <span className="font-normal text-[40.97px] leading-[0%] tracking-[-3.5%] align-middle uppercase">
        Flip
      </span>
    </div>
  );
};

export default CoinFlipTabContent;
