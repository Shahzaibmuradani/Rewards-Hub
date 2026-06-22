import React, { createContext, useContext, useState } from "react";

export interface Reward {
  id: string;
  brand: string;
  label: string;
  value: string;
  costGems: number;
  type: "paypal" | "amazon" | "google";
}

export interface GameRec {
  id: string;
  name: string;
  gems1: string;
  gems2: string;
}

interface AppContextValue {
  gemBalance: number;
  addGems: (amount: number) => void;
  rewards: Reward[];
  games: GameRec[];
  activeGoals: { brand: string; value: string; costGems: number }[];
}

const AppContext = createContext<AppContextValue | null>(null);

const REWARDS: Reward[] = [
  { id: "1", brand: "PayPal", label: "PayPal €6.75", value: "€6.75", costGems: 3999, type: "paypal" },
  { id: "2", brand: "Amazon", label: "Amazon €10.12", value: "€10.12", costGems: 5999, type: "amazon" },
  { id: "3", brand: "Google Play", label: "Google Play €5", value: "€5", costGems: 3200, type: "google" },
];

const GAMES: GameRec[] = [
  { id: "1", name: "Pixel Flow!", gems1: "≈ 204,261 💎", gems2: "≈ 53,038 💎" },
  { id: "2", name: "Stack Blitz", gems1: "≈ 180,000 💎", gems2: "≈ 41,200 💎" },
  { id: "3", name: "Coin Rush", gems1: "≈ 95,500 💎", gems2: "≈ 22,700 💎" },
];

const ACTIVE_GOALS = [
  { brand: "PayPal", value: "€6.75", costGems: 3999 },
  { brand: "Amazon", value: "€10.12", costGems: 5999 },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [gemBalance, setGemBalance] = useState<number>(2199);

  function addGems(amount: number) {
    setGemBalance((prev) => prev + amount);
  }

  return (
    <AppContext.Provider
      value={{ gemBalance, addGems, rewards: REWARDS, games: GAMES, activeGoals: ACTIVE_GOALS }}
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
