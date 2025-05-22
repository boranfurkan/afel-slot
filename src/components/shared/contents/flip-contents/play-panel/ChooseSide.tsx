import React from 'react';
import FlipContentButton from '../FlipContentButton';

const ChooseSide = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <h3 className="font-normal text-[24.73px] leading-[100%] tracking-[0%] text-center align-middle text-white uppercase">
        I choose
      </h3>
      <div className="grid grid-cols-2 w-full gap-2">
        <FlipContentButton className="w-full" selected={true}>
          Heads
        </FlipContentButton>
        <FlipContentButton className="w-full" selected={false}>
          Tails
        </FlipContentButton>
      </div>
    </div>
  );
};

export default ChooseSide;
