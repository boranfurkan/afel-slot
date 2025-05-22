import { cn } from '@/lib/utils';
import React from 'react';

interface FlipContentButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  selected?: boolean;
}

const FlipContentButton = ({
  children,
  onClick,
  disabled,
  className,
  selected,
}: FlipContentButtonProps) => {
  return (
    <button
      className={cn(
        'font-normal text-[24.73px] leading-[25.53px] tracking-[0%] text-center text-black flip-button-gradient py-2 px-4 border-2 rounded-[6.63px]',
        selected ? 'border-white' : 'border-transparent',
        disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default FlipContentButton;
