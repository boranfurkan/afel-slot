import { GameTabs } from '@/types/app';
import React from 'react';
import SlotFrenzyTabContent from './SlotFrenzyTabContent';
import CoinFlipTabContent from './CoinFlipTabContent';

interface TabSystemProps {
  activeTab: GameTabs;
  setActiveTab: (tab: GameTabs) => void;
}

const TabSystem: React.FC<TabSystemProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <div>
        <SlotFrenzyTabContent />
      </div>
      <div>
        <CoinFlipTabContent />
      </div>
    </div>
  );
};

export default TabSystem;
