import ArrowRightIcon from '@/assets/icons/ArrowRightIcon';
import React from 'react';

interface StartButtonProps {
  onClick: () => void;
}

const StartButton = ({ onClick }: StartButtonProps) => {
  return (
    <div
      className="cursor-pointer flex items-center gap-4 justify-center select-none "
      onClick={onClick}
    >
      <ArrowRightIcon width={24} height={47} />
      <span className="font-normal text-[77.25px] leading-[100%] tracking-[0%] text-right align-middle">
        START
      </span>
    </div>
  );
};

export default StartButton;
