import React from 'react';
import Image from 'next/image';
import backgroundImage from '../../../../../public/flip-background.png';
import FlipDetails from './info-section/FlipDetails';

const FlipContents = () => {
  return (
    <div className="relative w-full h-screen flex flex-col">
      <Image
        layout="fill"
        className="object-center object-cover pointer-events-none"
        src={backgroundImage}
        alt="Flip Background"
      />

      <div className="relative w-full h-full z-20">
        <FlipDetails />
      </div>
    </div>
  );
};

export default FlipContents;
