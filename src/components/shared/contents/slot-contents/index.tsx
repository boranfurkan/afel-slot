import React from 'react';
import ResultShow from './ResultShow';
import PlayPanel from './play-panel';
import SlotPanel from './slot-panel/SlotPanel';

const SlotContents = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <ResultShow />
      <div className="w-full flex-1 flex h-full">
        <PlayPanel />
        <SlotPanel />
      </div>
    </div>
  );
};

export default SlotContents;
