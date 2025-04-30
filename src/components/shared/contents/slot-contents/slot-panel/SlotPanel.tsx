import React from 'react';
import Image from 'next/image';

const SlotPanel = () => {
  return (
    <div className="w-2/3 h-full relative border-l-2 border-[#8db170]">
      <Image
        src="/slot-background.png"
        fill
        alt="slot background"
        className="object-center object-cover pointer-events-none"
        priority
      />
      <div className="relative z-1">slot content</div>
    </div>
  );
};

export default SlotPanel;
