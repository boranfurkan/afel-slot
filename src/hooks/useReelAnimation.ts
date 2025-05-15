'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SlotIconType } from '@/types/app';

interface UseReelAnimationProps {
  columnIndex: number;
  finalValues: SlotIconType[];
  isSpinning: boolean;
  slotHeight: number;
  onReelStop: () => void;
}

export const useReelAnimation = ({
  columnIndex,
  finalValues,
  isSpinning,
  slotHeight,
  onReelStop,
}: UseReelAnimationProps) => {
  const reelRef = useRef<HTMLDivElement>(null);
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const generateReelIcons = () => {
    const allIconTypes = Object.values(SlotIconType).filter(
      (v) => typeof v === 'number'
    ) as SlotIconType[];

    const reelIcons: SlotIconType[] = [];
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * allIconTypes.length);
      reelIcons.push(allIconTypes[randomIndex]);
    }
    reelIcons.push(...finalValues);

    return reelIcons;
  };

  const reelIcons = generateReelIcons();

  useEffect(() => {
    if (
      !reelRef.current ||
      !reelContainerRef.current ||
      boxesRef.current.length === 0
    )
      return;

    boxesRef.current.forEach((box, index) => {
      gsap.set(box, {
        transform: `translateY(${index * slotHeight}px)`,
        visibility: index < 3 ? 'visible' : 'hidden',
        opacity: 1,
      });
    });

    setIsInitialized(true);
  }, [slotHeight]);

  useEffect(() => {
    if (!reelRef.current || !reelContainerRef.current || !isInitialized) return;

    if (isSpinning && !isAnimating) {
      setTimeout(() => {
        startSpinAnimation();
      }, columnIndex * 150);
    } else if (!isSpinning && isAnimating) {
      stopSpinAnimation();
    }
  }, [isSpinning, isInitialized, columnIndex]);

  const startSpinAnimation = () => {
    if (
      !reelRef.current ||
      !reelContainerRef.current ||
      boxesRef.current.length === 0
    )
      return;

    setIsAnimating(true);

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    boxesRef.current.forEach((box, index) => {
      gsap.set(box, {
        transform: `translateY(${index * slotHeight}px)`,
      });
    });

    const boxCount = boxesRef.current.length;
    const visibleCount = 3;

    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        const allIconTypes = Object.values(SlotIconType).filter(
          (v) => typeof v === 'number'
        ) as SlotIconType[];

        boxesRef.current.forEach((box) => {
          const yPos = Number(gsap.getProperty(box, 'y'));
          if (yPos < 0 || yPos >= slotHeight * visibleCount) {
            const iconElement = box.querySelector('.slot-icon-container');
            if (iconElement) {
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

    const totalHeight = slotHeight * boxCount;

    boxesRef.current.forEach((box, i) => {
      const initialY = i * slotHeight;
      gsap.set(box, {
        transform: `translateY(${initialY}px)`,
        visibility:
          initialY >= 0 && initialY < slotHeight * visibleCount
            ? 'visible'
            : 'hidden',
      });
    });

    boxesRef.current.forEach((box, i) => {
      const initialY = i * slotHeight;

      tl.to(
        box,
        {
          duration: 2,
          ease: 'none',
          onUpdate: function () {
            const progress = this.progress();
            const offset = progress * totalHeight;
            let newY = (initialY - offset) % totalHeight;

            if (newY < 0) {
              newY += totalHeight;
            }

            gsap.set(box, { transform: `translateY(${newY}px)` });

            const isVisible = newY >= 0 && newY < slotHeight * visibleCount;
            gsap.set(box, { visibility: isVisible ? 'visible' : 'hidden' });
          },
        },
        0
      );
    });

    tl.timeScale(0.8);
    gsap.to(tl, { timeScale: 3, duration: 0.6, ease: 'power2.in' });

    timelineRef.current = tl;
  };

  const stopSpinAnimation = () => {
    if (
      !timelineRef.current ||
      !reelRef.current ||
      boxesRef.current.length === 0
    )
      return;

    gsap.to(timelineRef.current, {
      timeScale: 0.3,
      duration: 0.8 + columnIndex * 0.3,
      ease: 'power2.out',
      onComplete: () => {
        timelineRef.current?.kill();

        const finalTl = gsap.timeline({
          onComplete: () => {
            setIsAnimating(false);
            if (onReelStop) onReelStop();
          },
        });

        const finalPositions = [
          { row: 0, y: 0 },
          { row: 1, y: slotHeight },
          { row: 2, y: slotHeight * 2 },
        ];

        gsap.set(boxesRef.current, { visibility: 'hidden' });

        boxesRef.current.slice(-3).forEach((box, i) => {
          const finalPos = finalPositions[i];

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

  return {
    reelRef,
    reelContainerRef,
    boxesRef,
    reelIcons,
    isAnimating,
  };
};
