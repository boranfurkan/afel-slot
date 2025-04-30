import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';
import { lamportsToSol } from '@/lib/utils';
import React from 'react';

interface BetInputProps {
  userBalance: number;
  inputValue: number;
  onChange: (value: number) => void;
}

const BetInput = ({ userBalance, inputValue, onChange }: BetInputProps) => {
  const maxBalance = parseFloat(lamportsToSol(userBalance));
  const isError = inputValue > maxBalance;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onChange(0);
      return;
    }

    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onChange(value);
    }
  };

  const increaseValue = () => {
    const newValue = inputValue + 1;
    if (newValue <= maxBalance) {
      onChange(newValue);
    }
  };

  const decreaseValue = () => {
    const newValue = Math.max(0, inputValue - 1);
    onChange(newValue);
  };

  return (
    <div className="relative w-full mt-7">
      {isError && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[#FF0018] font-normal text-[19.46px] leading-[20.26px] tracking-[0%] text-center">
          NOT ENOUGH SOL
        </div>
      )}
      <input
        className="w-full bg-[#171717] text-white px-4 py-2.5 rounded-[5.47px] border border-[#979797] font-normal text-[26.99px] leading-[45.33px] tracking-[0%] pr-12"
        type="number"
        value={inputValue}
        onChange={handleChange}
      />
      <div className="flex flex-col absolute top-0 right-5 h-full justify-center gap-4">
        <div className="cursor-pointer" onClick={increaseValue}>
          <ArrowUpIcon width={19.39} height={9.7} />
        </div>
        <div className="cursor-pointer" onClick={decreaseValue}>
          <ArrowDownIcon width={19.39} height={9.7} />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
