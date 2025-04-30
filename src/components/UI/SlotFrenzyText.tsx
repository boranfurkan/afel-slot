import React from 'react';

const SlotFrenzyText: React.FC = () => {
  const letters = [
    { char: 'S', size: 'text-2xl' },
    { char: 'L', size: 'text-3xl' },
    { char: 'O', size: 'text-4xl' },
    { char: 'T', size: 'text-5xl' },
    { char: 'F', size: 'text-5xl' },
    { char: 'R', size: 'text-5xl' },
    { char: 'E', size: 'text-5xl' },
    { char: 'N', size: 'text-4xl' },
    { char: 'Z', size: 'text-3xl' },
    { char: 'Y', size: 'text-2xl' },
  ];

  return (
    <div className="flex justify-center items-baseline uppercase text-white">
      <div className="flex items-baseline">
        {letters.slice(0, 4).map((letter, index) => (
          <span
            key={index}
            className={`${letter.size} font-pixel align-middle inline-block`}
            style={{
              imageRendering: 'pixelated',
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
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SlotFrenzyText;
