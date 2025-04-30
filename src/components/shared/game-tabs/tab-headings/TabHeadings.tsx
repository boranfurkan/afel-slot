'use client';
import { GameTabs } from '@/types/app';
import React from 'react';
import SlotFrenzyTabContent from './SlotFrenzyTabContent';
import CoinFlipTabContent from './CoinFlipTabContent';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TabHeadingsProps {
  activeTab: GameTabs;
  setActiveTab: (tab: GameTabs) => void;
}

const TabHeadings: React.FC<TabHeadingsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-full flex items-center justify-center h-max border-[1.5px] border-border rounded-t-[37.37px] overflow-hidden">
      <motion.div
        onClick={() => setActiveTab(GameTabs.SLOT)}
        className={cn(
          'flex-1 w-full flex items-center justify-center h-[80px] rounded-tl-[37.37px] py-4 cursor-pointer relative'
        )}
        animate={{
          backgroundColor: activeTab === GameTabs.SLOT ? '#212c16' : '#1a1a1a', // dark-bg color
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Background gradient overlay */}
        <motion.div
          className={cn(
            'absolute inset-0 slot-gradient-to-bottom rounded-tl-[37.37px]'
          )}
          initial={{ opacity: activeTab === GameTabs.SLOT ? 1 : 0 }}
          animate={{ opacity: activeTab === GameTabs.SLOT ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: activeTab === GameTabs.SLOT ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <SlotFrenzyTabContent isActive={activeTab === GameTabs.SLOT} />
        </motion.div>
      </motion.div>

      <motion.div
        onClick={() => setActiveTab(GameTabs.FLIP)}
        className={cn(
          'flex-1 w-full flex items-center justify-center h-[80px] rounded-tr-[37.37px] py-4 cursor-pointer relative'
        )}
        animate={{
          backgroundColor: activeTab === GameTabs.FLIP ? '#78ff00' : '#1a1a1a', // dark-bg color
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Background gradient overlay */}
        <motion.div
          className={cn(
            'absolute inset-0 coin-flip-gradient rounded-tr-[37.37px]'
          )}
          initial={{ opacity: activeTab === GameTabs.FLIP ? 1 : 0 }}
          animate={{ opacity: activeTab === GameTabs.FLIP ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Content */}
        <motion.div
          className={cn(
            'relative z-10',
            activeTab === GameTabs.FLIP ? 'text-black' : ''
          )}
          animate={{
            scale: activeTab === GameTabs.FLIP ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <CoinFlipTabContent isActive={activeTab === GameTabs.FLIP} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TabHeadings;
