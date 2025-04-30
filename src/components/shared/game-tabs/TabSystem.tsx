'use client';

import { GameTabs } from '@/types/app';
import React, { useState } from 'react';
import TabHeadings from './tab-headings/TabHeadings';
import { AnimatePresence, motion } from 'framer-motion';
import SlotContents from '../contents/slot-contents';

const TabSystem = () => {
  const [activeTab, setActiveTab] = useState(GameTabs.SLOT);

  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <TabHeadings activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="w-full h-full flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
          >
            {activeTab === GameTabs.SLOT ? (
              <div className="w-full min-h-screen border-[1.5px] border-t-0 border-border bg-dark-bg">
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <SlotContents />
                </motion.div>
              </div>
            ) : (
              <div className="w-full h-full border-[1.5px] border-t-0 border-border rounded-b-[37.37px] bg-dark-bg">
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Coin Flip Content
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabSystem;
