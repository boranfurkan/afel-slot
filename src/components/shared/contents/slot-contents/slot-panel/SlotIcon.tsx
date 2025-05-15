import React from 'react';
import Image from 'next/image';
import { SlotIconType } from '@/types/app';

interface SlotIconProps {
  type: SlotIconType;
  size?: number;
  className?: string;
  debug?: boolean;
}

const SlotIcon: React.FC<SlotIconProps> = ({
  type,
  size = 80,
  className = '',
  debug = false,
}) => {
  const iconPaths = {
    [SlotIconType.AFEL]: '/slot/slot-icon-afel.png',
    [SlotIconType.CROCODILE]: '/slot/slot-icon-crocodile.png',
    [SlotIconType.HEAD]: '/slot/slot-icon-head.png',
    [SlotIconType.SOLANA]: '/slot/slot-icon-solana.png',
    [SlotIconType.TRUMP]: '/slot/slot-icon-trump.png',
    [SlotIconType.MEAT]: '/slot/slot-icon-meat.png',
  };

  const iconScales: Partial<Record<SlotIconType, number>> = {
    [SlotIconType.TRUMP]: 0.75,
    [SlotIconType.SOLANA]: 0.75,
    [SlotIconType.MEAT]: 0.85,
  };

  const iconPositionAdjustments: Partial<
    Record<SlotIconType, { x: number; y: number }>
  > = {
    [SlotIconType.TRUMP]: { x: 0, y: 0 },
    [SlotIconType.CROCODILE]: { x: 0, y: 0 },
    [SlotIconType.HEAD]: { x: 0, y: 0 },
    [SlotIconType.MEAT]: { x: 0, y: 0 },
    [SlotIconType.SOLANA]: { x: 0, y: 0 },
    [SlotIconType.AFEL]: { x: 0, y: 0 },
  };

  const iconPath = iconPaths[type];
  const scaleFactor = iconScales[type] || 1;
  const posAdjust = iconPositionAdjustments[type] || { x: 0, y: 0 };

  const displaySize = Math.floor(size * scaleFactor);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        border: debug ? '1px dashed red' : 'none',
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: displaySize,
          height: displaySize,
          transform: `translate(${posAdjust.x}px, ${posAdjust.y}px)`,
          border: debug ? '1px solid blue' : 'none',
        }}
      >
        <Image
          src={iconPath}
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

export default SlotIcon;
