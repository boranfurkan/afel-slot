import LoseIcon from '@/assets/icons/LoseIcon';
import React from 'react';

const LoseIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="font-normal text-[80px] leading-[100%] tracking-[0%] text-right align-middle">
        Lose
      </span>
      <LoseIcon height={62} width={62} />
    </div>
  );
};

export default LoseIndicator;
