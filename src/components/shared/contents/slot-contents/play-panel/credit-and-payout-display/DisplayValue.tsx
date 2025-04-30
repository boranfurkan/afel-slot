import React from 'react';

interface DisplayValueProps {
  heading: string;
  value: string;
}

const DisplayValue = ({ heading, value }: DisplayValueProps) => {
  return (
    <div className="w-full bg-[#171717]/20 rounded-[10px] p-3 flex flex-col gap-4">
      <div className="flex flex-col gap-2.5 items-center">
        <span className="font-normal text-xl leading-[100%] tracking-[0%] text-right align-middle uppercase">
          {heading}
        </span>
        <div className="bg-[#D2D2D2] h-[1px] w-full"></div>
      </div>
      <div className="flex items-center justify-between">
        {value.split('').map((char, index) => (
          <span
            key={index}
            className="font-normal text-2xl leading-[100%] tracking-[0%] text-right align-middle"
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DisplayValue;
