import React, { useState } from 'react';
import DisplayValue from './credit-and-payout-display/DisplayValue';
import SlotButton from '@/components/UI/SlotButton';
import BetChoosePanel from './bet-choose/BetChoosePanel';

import { MOCK_USER_DATA } from '@/mock';
import { lamportsToSol } from '@/lib/utils';
import BetInput from './bet-input/BetInput';
import StartButton from './start-button/StartButton';

const PlayPanel = () => {
  const [betAmount, setBetAmount] = useState<number>(0);
  return (
    <div className="p-5 bg-[#22560F] w-1/3">
      <div className="py-6 px-4 slot-gradient-to-bottom border-[2.5px] border-black rounded-[19.31px] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <DisplayValue
            heading="Credit"
            value={lamportsToSol(MOCK_USER_DATA.credit)}
          />
          <DisplayValue
            heading="Payout"
            value={lamportsToSol(MOCK_USER_DATA.payout)}
          />
        </div>
        <SlotButton className="w-full">Cashout</SlotButton>
        <div className="bg-[#D2D2D2] h-[1px]"></div>
        <BetChoosePanel userBalance={MOCK_USER_DATA.solBalance} />
        <BetInput
          userBalance={MOCK_USER_DATA.solBalance}
          inputValue={betAmount}
          onChange={(value) => {
            setBetAmount(value);
          }}
        />
        <StartButton onClick={() => {}} />
      </div>
    </div>
  );
};

export default PlayPanel;
