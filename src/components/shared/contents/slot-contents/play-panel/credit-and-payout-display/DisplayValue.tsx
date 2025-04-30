import React from 'react';
import { motion } from 'framer-motion';

interface DisplayValueProps {
  heading: string;
  value: string;
  animate?: boolean;
}

const DisplayValue = ({
  heading,
  value,
  animate = false,
}: DisplayValueProps) => {
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
          <motion.span
            key={index}
            className="font-normal text-2xl leading-[100%] tracking-[0%] text-right align-middle"
            animate={
              animate
                ? {
                    scale: [1, 1.2, 1],
                    color: ['#ffffff', '#a0c380', '#ffffff'],
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              repeat: animate ? 1 : 0,
              delay: index * 0.05,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default DisplayValue;
