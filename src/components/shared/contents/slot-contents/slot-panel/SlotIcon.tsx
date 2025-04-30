import React from 'react';
import Image from 'next/image';
import { SlotIconType } from '@/contexts/SlotMachineContext';

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
    [SlotIconType.AFEL]: '/slot/AfelIcon.svg',
    [SlotIconType.AVOCADO]: '/slot/AvocadoIcon.svg',
    [SlotIconType.BANANA]: '/slot/BananaIcon.svg',
    [SlotIconType.CHERRIES]: '/slot/CherriesIcon.svg',
    [SlotIconType.MANGO]: '/slot/MangoIcon.svg',
    [SlotIconType.PEAR]: '/slot/PearIcon.svg',
  };

  const iconPath = iconPaths[type];

  return (
    <div
      className={`relative flex items-center justify-center h-full w-full ${className}`}
    >
      <Image
        src={iconPath}
        width={size}
        height={size}
        alt={`Slot icon ${SlotIconType[type]}`}
        className="object-contain max-h-full max-w-full"
      />
    </div>
  );
};

export default SlotIcon;
