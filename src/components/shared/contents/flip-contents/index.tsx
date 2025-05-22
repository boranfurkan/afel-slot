import React from 'react';
import Image from 'next/image';
import backgroundImage from '../../../../../public/flip-background.png';
import FlipDetails from './info-section/FlipDetails';
import PlayPanel from './play-panel';

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
        <div className="max-w-lg mx-auto w-full h-full flex items-center justify-center">
          <PlayPanel />
        </div>
      </div>
    </div>
  );
};

export default FlipContents;
