import React from 'react';

const SlotFrenzyTabContent = () => {
  const letters = [
    { char: 'S', size: 'text-2xl' },
    { char: 'L', size: 'text-3xl' },
    { char: 'O', size: 'text-4xl' },
    { char: 'T', size: 'text-5xl' },
    {
      char: 'F',
      size: 'font-normal text-[57.94px] leading-[100%] tracking-[0%]',
    },
    {
      char: 'R',
      size: 'font-normal text-[57.94px] leading-[100%] tracking-[0%]',
    },
    { char: 'E', size: 'text-5xl' },
    { char: 'N', size: 'text-4xl' },
    { char: 'Z', size: 'text-3xl' },
    { char: 'Y', size: 'text-2xl' },
  ];

  return (
    <div className="flex justify-center items-baseline py-6 px-4 uppercase text-white">
      <div className="flex items-baseline">
        {letters.slice(0, 4).map((letter, index) => (
          <span
            key={index}
            className={`${letter.size} font-pixel align-middle inline-block`}
            style={{
              imageRendering: 'pixelated',
              textShadow: '0px 0px 2px rgba(255,255,255,0.3)',
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
      <div className="w-1.5"></div>
      <div className="flex items-baseline">
        {letters.slice(4).map((letter, index) => (
          <span
            key={index + 4}
            className={`${letter.size} font-pixel align-middle inline-block`}
            style={{
              imageRendering: 'pixelated',
              textShadow: '0px 0px 2px rgba(255,255,255,0.3)',
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SlotFrenzyTabContent;
