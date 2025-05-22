import React from 'react';
import FlipDistribution from './FlipDistribution';
import UserIcon from '@/assets/icons/UserIcon';
import LastFlipsShow from './last-flips/LastFlipsShow';

const FlipDetails = () => {
  return (
    <div className="bg-[#002E09] px-3 py-2 flex items-center gap-10">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-2">
            <UserIcon />
            <div className="relative w-max">
              <span className="font-normal text-base leading-[27.2px] tracking-[0%]">
                17
              </span>
              <span className="font-normal text-[9.6px] leading-[16.32px] tracking-[0%] absolute -top-2 -right-10 text-white">
                FLIPPING
              </span>
            </div>
          </div>
          <div className="relative w-max">
            <span className="font-normal text-base leading-[27.2px] tracking-[0%] text-[#A7D858]">
              -8033.418
            </span>
            <span className="font-normal text-[9.6px] leading-[16.32px] tracking-[0%] absolute -top-2 -right-4 text-white">
              SOL
            </span>
          </div>
        </div>
        <FlipDistribution tailsPercentage={50} headsPercentage={50} />
      </div>
      <LastFlipsShow />
    </div>
  );
};

export default FlipDetails;
