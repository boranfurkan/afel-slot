import { useCallback } from 'react';
import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';
import { useSlotMachine } from '@/contexts/SlotMachineContext';
import { lamportsToSol } from '@/lib/utils';

const BetInput = () => {
  const { userBalance, betAmount, setBetAmount, isSpinning } = useSlotMachine();

  const maxBalance = parseFloat(lamportsToSol(userBalance));
  const isError = betAmount > maxBalance;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSpinning) return;

      if (e.target.value === '') {
        setBetAmount(0);
        return;
      }

      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setBetAmount(value);
      }
    },
    [isSpinning, setBetAmount]
  );

  const increaseValue = useCallback(() => {
    if (isSpinning) return;

    const newValue = betAmount + 0.1;
    const roundedValue = Math.round(newValue * 10) / 10;
    if (roundedValue <= maxBalance) {
      setBetAmount(roundedValue);
    }
  }, [isSpinning, betAmount, maxBalance, setBetAmount]);

  const decreaseValue = useCallback(() => {
    if (isSpinning) return;

    const newValue = Math.max(0.1, betAmount - 0.1);
    const roundedValue = Math.round(newValue * 10) / 10;
    setBetAmount(roundedValue);
  }, [isSpinning, betAmount, setBetAmount]);

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
        step="0.1"
        min="0.1"
        value={betAmount}
        onChange={handleChange}
        disabled={isSpinning}
      />
      <div className="flex flex-col absolute top-0 right-5 h-full justify-center gap-4">
        <div
          className={`cursor-pointer ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={increaseValue}
        >
          <ArrowUpIcon width={19.39} height={9.7} />
        </div>
        <div
          className={`cursor-pointer ${
            isSpinning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={decreaseValue}
        >
          <ArrowDownIcon width={19.39} height={9.7} />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
