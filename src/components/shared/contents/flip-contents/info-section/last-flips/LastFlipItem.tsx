import HeadIcon from '@/assets/icons/HeadIcon';
import TailIcon from '@/assets/icons/TailIcon';
import { FlipSide } from '@/types/app';
import React from 'react';

interface LastFlipItemProps {
  side: FlipSide;
}

const LastFlipItem = ({ side }: LastFlipItemProps) => {
  const FlipData = {
    TAILS: {
      background: '#6C924A',
      icon: TailIcon,
    },
    HEADS: {
      background: '#FFF',
      icon: HeadIcon,
    },
  };

  const IconComponent = FlipData[side].icon;

  return (
    <div
      className="rounded-[31px] border border-black p-1"
      style={{
        background: FlipData[side].background,
      }}
    >
      <IconComponent />
    </div>
  );
};

export default LastFlipItem;
