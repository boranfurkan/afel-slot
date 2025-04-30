import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  'slot-gradient-to-bottom font-normal text-middle align-middle rounded-[6px] uppercase',
  {
    variants: {
      size: {
        small: 'px-3 py-2 text-base leading-[100%] tracking-[0%]',
        default: 'px-5 py-3 text-xl leading-[100%] tracking-[0%]',
        large: 'px-6 py-4 text-2xl leading-[100%] tracking-[0%]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface SlotButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size'>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const SlotButton = ({
  children,
  size,
  className,
  disabled,
  ...props
}: SlotButtonProps) => {
  return (
    <motion.button
      className={`${buttonVariants({ size, className })} ${
        disabled ? 'opacity-50 cursor-not-allowed brightness-75 grayscale' : ''
      }`}
      whileTap={
        !disabled
          ? {
              scale: 0.95,
              boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.5)',
            }
          : undefined
      }
      transition={{
        duration: 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default SlotButton;
