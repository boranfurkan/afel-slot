import React from 'react';
import PlayPanel from './play-panel';
import SlotPanel from './slot-panel/SlotPanel';
import SlotMachineController from './slot-panel/SlotMachineController';
import ResultContainer from './results-container';
import LastWinsDisplay from './last-wins-show/LastWinsDisplay';

const SlotContents = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-visible">
      <ResultContainer />
      <div className="w-full flex-1 flex h-full overflow-visible">
        <PlayPanel />
        <SlotMachineController>
          {({ isReady, onReelStop, completedReels }) => (
            <SlotPanel
              onReelStop={onReelStop}
              completedReels={completedReels}
              isReady={isReady}
            />
          )}
        </SlotMachineController>
      </div>
      <LastWinsDisplay />
    </div>
  );
};

export default SlotContents;
