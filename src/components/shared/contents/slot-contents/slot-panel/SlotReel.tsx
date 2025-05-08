import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SlotIconType } from '@/contexts/SlotMachineContext';
import SlotIcon from './SlotIcon';
import gsap from 'gsap';

interface SlotReelProps {
  columnIndex: number;
  finalValues: SlotIconType[];
  isSpinning: boolean;
  winningRows: number[];
  onReelStop?: () => void;
}

const SlotReel: React.FC<SlotReelProps> = ({
  columnIndex,
  finalValues,
  isSpinning,
  winningRows,
  onReelStop,
}) => {
  const reelRef = useRef<HTMLDivElement>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a sequence of icons for the reel - just enough for smooth animation
  const generateReelIcons = () => {
    // Get all possible icon types
    const allIconTypes = Object.values(SlotIconType).filter(
      (v) => typeof v === 'number'
    ) as SlotIconType[];

    // Create a sequence with exactly 9 items (3 visible + buffer items)
    // This keeps the animation smooth but limits what's rendered
    const reelIcons: SlotIconType[] = [];

    // Add some randomized icons first (will be the ones that spin)
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allIconTypes.length);
      reelIcons.push(allIconTypes[randomIndex]);
    }

    // Add the final values at the end so we can stop on them
    reelIcons.push(...finalValues);

    return reelIcons;
  };

  const reelIcons = generateReelIcons();

  // Initialize positions once component mounts
  useEffect(() => {
    if (
      !reelRef.current ||
      !reelContainerRef.current ||
      boxesRef.current.length === 0
    )
      return;

    // Set initial positions with clear spacing
    const slotHeight = 100;

    boxesRef.current.forEach((box, index) => {
      // Set each box at its proper initial position
      gsap.set(box, {
        transform: `translateY(${index * slotHeight}px)`,
        // Initially only show the first 3 items (one for each visible row)
        visibility: index < 3 ? 'visible' : 'hidden',
      });
    });

    setIsInitialized(true);
  }, []);

  // Start animation when isSpinning changes to true
  useEffect(() => {
    if (!reelRef.current || !reelContainerRef.current || !isInitialized) return;

    if (isSpinning && !isAnimating) {
      startSpinAnimation();
    } else if (!isSpinning && isAnimating) {
      stopSpinAnimation();
    }
  }, [isSpinning, isInitialized]);

  // Create and start the spinning animation
  const startSpinAnimation = () => {
    if (
      !reelRef.current ||
      !reelContainerRef.current ||
      boxesRef.current.length === 0
    )
      return;

    setIsAnimating(true);

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Reset positions - each slot box is exactly 100px tall
    const slotHeight = 100;

    // Reset positions with proper spacing - critical to prevent overlap
    gsap.set(boxesRef.current, {
      clearProps: 'transform, visibility',
      transform: (i) => `translateY(${i * slotHeight}px)`,
      visibility: (i) => (i < 3 ? 'visible' : 'hidden'),
    });

    // Create a new timeline for continuous spinning
    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        // Randomize visible icons on each repeat for variety
        const allIconTypes = Object.values(SlotIconType).filter(
          (v) => typeof v === 'number'
        ) as SlotIconType[];

        boxesRef.current.forEach((box, index) => {
          if (index < boxesRef.current.length - 3) {
            const iconElement = box.querySelector('.slot-icon-container');
            if (iconElement) {
              // Fade transition when changing icons
              gsap.to(iconElement, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                  gsap.to(iconElement, { opacity: 1, duration: 0.1 });
                },
              });
            }
          }
        });
      },
    });

    // Calculate the total height of the reel
    const totalHeight = slotHeight * boxesRef.current.length;

    // Animate each box with careful position management
    boxesRef.current.forEach((box, i) => {
      // Store the initial position
      const initialY = i * slotHeight;

      tl.to(
        box,
        {
          duration: 2, // Duration for one complete cycle
          ease: 'none',
          // Use a custom onUpdate to handle the wrapping logic
          onUpdate: function () {
            const progress = this.progress(); // Animation progress (0-1)
            const offset = progress * totalHeight; // How far we've moved
            let newY = (initialY + offset) % totalHeight; // Wrap around using modulo

            // Ensure we keep items properly positioned
            gsap.set(box, { transform: `translateY(${newY}px)` });

            // Hide elements that are out of the visible range (3 slots)
            const isVisible = newY >= 0 && newY < slotHeight * 3;
            gsap.set(box, { visibility: isVisible ? 'visible' : 'hidden' });
          },
        },
        0
      );
    });

    // Add delay based on column index for cascading effect
    tl.delay(columnIndex * 0.2);

    // Add ease-in at the beginning for realistic acceleration
    tl.timeScale(0.5);
    gsap.to(tl, { timeScale: 3, duration: 1, ease: 'power2.in' });

    timelineRef.current = tl;
  };

  // Stop the animation and ensure it stops precisely at the correct position
  const stopSpinAnimation = () => {
    if (
      !timelineRef.current ||
      !reelRef.current ||
      boxesRef.current.length === 0
    )
      return;

    // Variables for positioning
    const slotHeight = 100; // Height of each slot box

    // Gradually slow down the animation
    gsap.to(timelineRef.current, {
      timeScale: 0.5,
      duration: 0.5 + columnIndex * 0.2,
      ease: 'power2.out',
      onComplete: () => {
        // Kill the repeating timeline
        timelineRef.current?.kill();

        // Create a new timeline for the final stopping sequence
        const finalTl = gsap.timeline({
          onComplete: () => {
            setIsAnimating(false);
            if (onReelStop) onReelStop();
          },
        });

        // Position the final values in the visible slots perfectly centered
        const finalPositions = [
          { row: 0, y: 0 }, // Top position
          { row: 1, y: slotHeight }, // Middle position
          { row: 2, y: slotHeight * 2 }, // Bottom position
        ];

        // Start with all boxes hidden
        gsap.set(boxesRef.current, { visibility: 'hidden' });

        // Only show the final 3 items positioned exactly where they should be
        boxesRef.current.slice(-3).forEach((box, i) => {
          // Get the final position for this row
          const finalPos = finalPositions[i];

          // Position and show the final items with a nice bounce effect
          finalTl.to(
            box,
            {
              transform: `translateY(${finalPos.y}px)`,
              visibility: 'visible',
              duration: 0.5,
              ease: 'bounce.out',
            },
            0
          );
        });

        timelineRef.current = finalTl;
      },
    });
  };

  return (
    <div
      ref={reelRef}
      className="relative h-full overflow-hidden border-2 border-[#6c924a]/50 rounded-md bg-gradient-to-b from-white/30 to-white/5"
    >
      {/* Reel container with fixed height and proper overflow */}
      <div ref={reelContainerRef} className="absolute inset-0 overflow-hidden">
        {/* Vertical lines for slot effect */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          <div className="h-full w-px bg-white/20"></div>
          <div className="h-full w-px bg-white/20"></div>
        </div>

        {/* Slot boxes - each box has fixed height of 100px */}
        {reelIcons.map((iconType, index) => (
          <div
            key={`slot-box-${columnIndex}-${index}`}
            ref={(el) => {
              if (el) boxesRef.current[index] = el;
            }}
            className="slot-box absolute w-full h-[100px] flex items-center justify-center"
            style={{
              top: 0,
              transform: `translateY(${index * 100}px)`,
              visibility: index < 3 ? 'visible' : 'hidden', // Only show first 3 initially
              zIndex: 10 - (index % 10), // Ensure proper stacking during animation
            }}
          >
            <div className="slot-icon-container w-full h-full flex items-center justify-center">
              <SlotIcon type={iconType} size={64} className="p-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Visual slot frame overlays */}
      <div className="absolute inset-x-0 top-0 h-[10px] pointer-events-none bg-gradient-to-b from-white/10 to-transparent z-10"></div>
      <div className="absolute inset-x-0 bottom-0 h-[10px] pointer-events-none bg-gradient-to-t from-white/10 to-transparent z-10"></div>

      {/* Win highlight effects for each row */}
      {winningRows.map(
        (rowIndex) =>
          !isSpinning && (
            <motion.div
              key={`win-highlight-${columnIndex}-${rowIndex}`}
              className="absolute inset-x-0 h-[100px] rounded-md ring-4 ring-[#a0c380] bg-[#a0c380]/20 pointer-events-none z-20"
              style={{ top: `${rowIndex * 100}px` }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.9, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          )
      )}
    </div>
  );
};

export default SlotReel;
