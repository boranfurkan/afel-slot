'use client';
import { FlipProvider } from '@/contexts/FlipContext';
import { SlotMachineProvider } from '@/contexts/SlotMachineContext';
import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <div>
      <SlotMachineProvider>
        <FlipProvider>{children}</FlipProvider>
      </SlotMachineProvider>
    </div>
  );
};

export default Providers;
