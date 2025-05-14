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
  const slotHeight = 100; // Height of each slot box

  // Create a sequence of icons for the reel - just enough for smooth animation
  const generateReelIcons = () => {
    // Get all possible icon types
    const allIconTypes = Object.values(SlotIconType).filter(
      (v) => typeof v === 'number'
    ) as SlotIconType[];

    // Create a sequence with exactly 12 items for smoother animation
    const reelIcons: SlotIconType[] = [];

    // Add randomized icons first (will be the ones that spin)
    for (let i = 0; i < 9; i++) {
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

    // Set initial positions with proper spacing
    boxesRef.current.forEach((box, index) => {
      // Position each box with proper spacing
      gsap.set(box, {
        transform: `translateY(${index * slotHeight}px)`,
        // Initially only show the first few items
        visibility: index < 3 ? 'visible' : 'hidden',
        opacity: 1,
      });
    });

    setIsInitialized(true);
  }, []);

  // Start animation when isSpinning changes to true
  useEffect(() => {
    if (!reelRef.current || !reelContainerRef.current || !isInitialized) return;

    if (isSpinning && !isAnimating) {
      // Add a small delay based on column index for a cascade effect
      setTimeout(() => {
        startSpinAnimation();
      }, columnIndex * 150);
    } else if (!isSpinning && isAnimating) {
      stopSpinAnimation();
    }
  }, [isSpinning, isInitialized, columnIndex]);

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

    // Prepare all boxes for animation - critical first step
    boxesRef.current.forEach((box, index) => {
      // Prepare each box with initial state but don't change visibility yet
      gsap.set(box, {
        transform: `translateY(${index * slotHeight}px)`,
      });
    });

    // Pre-position off-screen boxes for smooth entry
    const boxCount = boxesRef.current.length;
    const visibleCount = 3; // Number of visible slots

    // Create a new timeline for continuous spinning
    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        // Randomize icons that are currently off-screen for variety
        const allIconTypes = Object.values(SlotIconType).filter(
          (v) => typeof v === 'number'
        ) as SlotIconType[];

        // Only update icons that are currently off-screen
        boxesRef.current.forEach((box) => {
          const yPos = Number(gsap.getProperty(box, 'y'));
          if (yPos < 0 || yPos >= slotHeight * visibleCount) {
            const iconElement = box.querySelector('.slot-icon-container');
            if (iconElement) {
              // Update icon that's off-screen
              gsap.to(iconElement, {
                opacity: 0,
                duration: 0.05,
                onComplete: () => {
                  gsap.to(iconElement, { opacity: 1, duration: 0.05 });
                },
              });
            }
          }
        });
      },
    });

    // Calculate the total height of the reel
    const totalHeight = slotHeight * boxCount;

    // First, make sure all boxes are properly positioned
    boxesRef.current.forEach((box, i) => {
      // Ensure consistent starting state
      const initialY = i * slotHeight;
      gsap.set(box, {
        transform: `translateY(${initialY}px)`,
        visibility:
          initialY >= 0 && initialY < slotHeight * visibleCount
            ? 'visible'
            : 'hidden',
      });
    });

    // Now start the continuous animation with a slightly staggered start for each box
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
            let newY = (initialY - offset) % totalHeight; // Moving upward

            // Wrap around when going off the top
            if (newY < 0) {
              newY += totalHeight;
            }

            // Update position
            gsap.set(box, { transform: `translateY(${newY}px)` });

            // Show only elements in the visible area
            const isVisible = newY >= 0 && newY < slotHeight * visibleCount;
            gsap.set(box, { visibility: isVisible ? 'visible' : 'hidden' });
          },
        },
        0
      );
    });

    // Add ease-in at the beginning for realistic acceleration
    tl.timeScale(0.8);
    gsap.to(tl, { timeScale: 3, duration: 0.6, ease: 'power2.in' });

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

    // Gradually slow down the animation with a delay based on column index
    gsap.to(timelineRef.current, {
      timeScale: 0.3,
      duration: 0.8 + columnIndex * 0.3,
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
              className="absolute inset-x-0 h-[100px] rounded-md pointer-events-none z-20"
              style={{
                top: `${rowIndex * 100}px`,
                // Use filter for glow effect instead of box-shadow to avoid clipping
                filter: 'none',
                willChange: 'filter, background-color',
              }}
              initial={{ opacity: 0 }}
              animate={{
                filter: [
                  'drop-shadow(0 0 0px #a0c380)',
                  'drop-shadow(0 0 15px #a0c380)',
                  'drop-shadow(0 0 0px #a0c380)',
                ],
                backgroundColor: [
                  'rgba(160, 195, 128, 0)',
                  'rgba(160, 195, 128, 0.3)',
                  'rgba(160, 195, 128, 0)',
                ],
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
