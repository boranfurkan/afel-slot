import React from 'react';

interface FlipDistributionProps {
  tailsPercentage: number;
  headsPercentage: number;
}

const FlipDistribution = ({
  tailsPercentage,
  headsPercentage,
}: FlipDistributionProps) => {
  return (
    <div className="w-[300px] h-[20px] relative overflow-hidden rounded-sm">
      <div className="absolute inset-0 flex">
        <div
          className="flip-distribution-gradient flex items-center justify-center"
          style={{ width: `${headsPercentage}%` }}
        >
          <span className="text-xs font-bold text-black">
            HEADS {headsPercentage}%
          </span>
        </div>

        <div
          className="bg-gray-200 flex items-center justify-center"
          style={{ width: `${tailsPercentage}%` }}
        >
          <span className="text-xs font-bold text-black">
            TAILS {tailsPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipDistribution;
