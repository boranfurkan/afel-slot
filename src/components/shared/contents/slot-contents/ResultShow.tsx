import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';
import WinIndicator from '@/components/UI/WinIndicator';

import React from 'react';

const ResultShow = () => {
  return (
    <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4">
      <div className="bg-[#171717]/30 rounded-[8px] w-1/4">
        <WinIndicator />
      </div>
      <div className="w-3/4 flex items-center justify-center gap-16">
        <AfelLogo />
        <PlusIcon height={19} width={19} />
        <SlotFrenzyText />
      </div>
    </div>
  );
};

export default ResultShow;
