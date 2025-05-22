import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import ArrowUpIcon from '@/assets/icons/ArrowUpIcon';

const BetInput = () => {
  const isError = false;
  return (
    <div className="relative w-full mt-7">
      {isError && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[#FF0018] font-normal text-[19.46px] leading-[20.26px] tracking-[0%] text-center">
          NOT ENOUGH SOL
        </div>
      )}
      <input
        className="w-full bg-[#171717] text-white px-4 py-2.5 rounded-[5.47px] border border-[#979797] font-normal text-[13.18px] leading-[22.14px] tracking-[0%] pr-12"
        type="number"
        step="0.1"
        min="0.1"
        value={0.1}
      />
      <div className="flex flex-col absolute top-0 right-5 h-full justify-center gap-4">
        <div className={`cursor-pointer`} onClick={() => {}}>
          <ArrowUpIcon width={19.39} height={9.7} />
        </div>
        <div className={`cursor-pointer`} onClick={() => {}}>
          <ArrowDownIcon width={19.39} height={9.7} />
        </div>
      </div>
    </div>
  );
};

export default BetInput;
