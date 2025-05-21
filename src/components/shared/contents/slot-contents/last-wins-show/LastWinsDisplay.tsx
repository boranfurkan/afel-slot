import React from 'react';
import LastWinItem from './LastWinItem';
import { SlotIconType } from '@/types/app';

const LastWinsDisplay = () => {
  const DUMMY_LAST_WINS = [
    {
      rowOne: {
        elements: [
          SlotIconType.AFEL,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },

    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
    {
      rowOne: {
        elements: [
          SlotIconType.MEAT,
          SlotIconType.CROCODILE,
          SlotIconType.HEAD,
        ],
        multiplier: 2,
      },
      rowTwo: {
        elements: [SlotIconType.SOLANA, SlotIconType.TRUMP, SlotIconType.MEAT],
        multiplier: 3,
      },
    },
  ];
  return (
    <div className="bg-[#A0C380] p-1 pt-0 w-full">
      <div className="slot-gradient-to-bottom p-2 border-[2.5px] border-black w-full">
        <div className="rounded-[10px] w-full flex items-center justify-start p-2 gap-3 overflow-x-auto no-scrollbar">
          {DUMMY_LAST_WINS.map((item, index) => {
            return (
              <LastWinItem
                rowOne={item.rowOne}
                rowTwo={item.rowTwo}
                key={`last-win-item-${index}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LastWinsDisplay;
