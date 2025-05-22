import React, { memo } from 'react';
import Image from 'next/image';
import { SlotIconType } from '@/types/app';

interface SlotIconProps {
  type: SlotIconType;
  size?: number;
  className?: string;
}

const SlotIcon: React.FC<SlotIconProps> = ({
  type,
  size = 80,
  className = '',
}) => {
  const iconPaths = {
    [SlotIconType.AFEL]: '/slot/slot-icon-afel.png',
    [SlotIconType.CROCODILE]: '/slot/slot-icon-crocodile.png',
    [SlotIconType.HEAD]: '/slot/slot-icon-head.png',
    [SlotIconType.SOLANA]: '/slot/slot-icon-solana.png',
    [SlotIconType.TRUMP]: '/slot/slot-icon-trump.png',
    [SlotIconType.MEAT]: '/slot/slot-icon-meat.png',
  };

  const iconScales = {
    [SlotIconType.TRUMP]: 0.75,
    [SlotIconType.SOLANA]: 0.75,
    [SlotIconType.MEAT]: 0.85,
    [SlotIconType.CROCODILE]: 1,
    [SlotIconType.HEAD]: 1,
    [SlotIconType.AFEL]: 1,
  };

  const scaleFactor = iconScales[type];
  const displaySize = Math.floor(size * scaleFactor);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: displaySize,
          height: displaySize,
        }}
      >
        <Image
          src={iconPaths[type]}
          width={displaySize}
          height={displaySize}
          alt={`Slot icon ${SlotIconType[type]}`}
          className="object-contain"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    </div>
  );
};

export default memo(SlotIcon);
