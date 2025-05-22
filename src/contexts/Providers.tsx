"use client";

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
      <AppWalletProvider>{children}</AppWalletProvider>
    </QueryClientProvider>
  );
};

export default Providers;
