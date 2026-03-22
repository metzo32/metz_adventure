"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TripProvider } from "@/app/contexts/TripContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TripProvider>{children}</TripProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
