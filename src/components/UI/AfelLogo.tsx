import React from 'react';
import Image from 'next/image';

const AfelLogo = () => {
  return (
    <div className="flex items-center justify-center gap-5">
      <Image
        src="/afel-logo.png"
        width={78}
        height={62}
        alt="Afel Logo"
        className="w-[78px] h-[62px]"
      />
      <span className="font-normal text-[77.25px] leading-[100%] tracking-[0%] align-middle">
        AFEL
      </span>
    </div>
  );
};

export default AfelLogo;
