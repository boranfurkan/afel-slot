import WinIcon from '@/assets/icons/WinIcon';
import React from 'react';

const WinIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="font-normal text-[80px] leading-[100%] tracking-[0%] text-right align-middle">
        Win
      </span>
      <WinIcon height={62} width={62} />
    </div>
  );
};

export default WinIndicator;
