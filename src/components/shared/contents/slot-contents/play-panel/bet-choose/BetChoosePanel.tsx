import SlotButton from '@/components/UI/SlotButton';
import React from 'react';
import Image from 'next/image';
import { lamportsToSol } from '@/lib/utils';
import { useSlotMachine } from '@/contexts/SlotMachineContext';

const BetChoosePanel = () => {
  const { userBalance, setBetAmount, isSpinning } = useSlotMachine();

  const userBalanceInSol = parseFloat(lamportsToSol(userBalance));

  const handleBetClick = (amount: number) => {
    if (isSpinning) return;
    setBetAmount(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <SlotButton
        className="w-full !px-3 !py-1 h-16"
        size="large"
        disabled={true} // Always disable BET currency buttons for now
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/afel-logo.png"
            width={35}
            height={35}
            alt="Afel Logo"
            className="w-8 h-8"
          />
          <div className="flex flex-col items-center whitespace-nowrap">
            <span className="font-normal text-[26.99px] leading-tight tracking-[0%] align-middle">
              0.5 BET
            </span>
            <span className="font-normal text-[17.54px] leading-tight tracking-[0%] align-middle">
              BABY BET
            </span>
          </div>
        </div>
      </SlotButton>
      <SlotButton
        className="w-full !px-3 !py-1 h-16 flex items-center justify-center"
        size="large"
        disabled={userBalanceInSol < 0.1 || isSpinning}
        onClick={() => handleBetClick(0.1)}
      >
        0.1 SOL
      </SlotButton>
      <SlotButton
        className="w-full !px-3 !py-1 h-16 flex items-center justify-center"
        size="large"
        disabled={userBalanceInSol < 0.25 || isSpinning}
        onClick={() => handleBetClick(0.25)}
      >
        0.25 SOL
      </SlotButton>
      <SlotButton
        className="w-full !px-3 !py-1 h-16 flex items-center justify-center"
        size="large"
        disabled={userBalanceInSol < 0.5 || isSpinning}
        onClick={() => handleBetClick(0.5)}
      >
        0.5 SOL
      </SlotButton>
      <SlotButton
        className="w-full !px-3 !py-1 h-16 flex items-center justify-center"
        size="large"
        disabled={userBalanceInSol < 1 || isSpinning}
        onClick={() => handleBetClick(1)}
      >
        1 SOL
      </SlotButton>
      <SlotButton
        className="w-full !px-3 !py-1 h-16"
        size="large"
        disabled={true} // Always disable BET currency buttons for now
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/afel-logo.png"
            width={35}
            height={35}
            alt="Afel Logo"
            className="w-8 h-8"
          />
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="font-normal text-[26.99px] leading-tight tracking-[0%] text-left">
              2 BET
            </span>
            <span className="font-normal text-[17.54px] leading-tight tracking-[0%] text-left">
              LEGEND BET
            </span>
          </div>
        </div>
      </SlotButton>
    </div>
  );
};

export default BetChoosePanel;
