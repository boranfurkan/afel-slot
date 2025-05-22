"use client";

import { FlipProvider } from "@/contexts/FlipContext";
import { SlotMachineProvider } from "@/contexts/SlotMachineContext";
import AppWalletProvider from "@/contexts/WalletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppWalletProvider>
        <SlotMachineProvider>
          <FlipProvider>{children}</FlipProvider>
        </SlotMachineProvider>
      </AppWalletProvider>
    </QueryClientProvider>
  );
};

export default Providers;
