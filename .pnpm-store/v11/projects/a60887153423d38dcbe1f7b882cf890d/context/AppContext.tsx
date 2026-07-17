import React, { createContext, useContext } from "react";

import { useUserGoals } from "@/features/rewards/hooks/useRewardsQueries";

interface AppContextValue {
  gemBalance: number;
  username: string;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useUserGoals();

  return (
    <AppContext.Provider
      value={{
        gemBalance: data?.wallet_summary.balance_gems ?? 0,
        username: data?.username ?? "",
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
