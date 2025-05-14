import React from 'react';
import ResultShow from './ResultShow';
import PlayPanel from './play-panel';
import SlotPanel from './slot-panel/SlotPanel';
import { SlotMachineProvider } from '@/contexts/SlotMachineContext';
import SlotMachineController from './slot-panel/SlotMachineController';

const SlotContents = () => {
  return (
    <SlotMachineProvider>
      <div className="w-full h-full flex flex-col overflow-visible">
        <ResultShow />
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
      </div>
    </SlotMachineProvider>
  );
};

export default SlotContents;
