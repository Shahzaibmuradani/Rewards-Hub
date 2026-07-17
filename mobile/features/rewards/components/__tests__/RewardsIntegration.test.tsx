import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { USER_ID } from "../../../../constants/config";
import { apiFetch } from "../../../../services/api";
import { createQueryClientWrapper } from "../../test-utils/renderWithQueryClient";
import RewardsScreen from "../../screens/RewardsScreen";

jest.setTimeout(20000);

jest.mock("../../../../components/ScreenHeader", () => ({
  ScreenHeader: ({ title }: { title: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, title);
  },
}));

jest.mock("react-native/Libraries/Lists/FlatList", () => {
  const React = require("react");
  const View = require("react-native/Libraries/Components/View/View").default;

  function FlatList({ data = [], renderItem, keyExtractor }: any) {
    return React.createElement(
      View,
      null,
      data.map((item: unknown, index: number) =>
        React.createElement(
          View,
          {
            key: keyExtractor ? keyExtractor(item, index) : String(index),
          },
          renderItem({ item, index, separators: {} }),
        ),
      ),
    );
  }

  return { __esModule: true, default: FlatList };
});

jest.mock("../../../../services/api", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Medium: "Medium",
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockedApiFetch = apiFetch as unknown as jest.MockedFunction<any>;

type UserGoalsResponse = {
  user_id: string;
  username: string;
  wallet_summary: {
    balance_gems: number;
  };
  active_goals: Array<{
    catalog_id: string;
    reward_label: string;
    reward_type: string;
    emoji: string;
    target_gems: number;
    current_gems: number;
    progress_pct: number;
    gems_remaining: number;
    estimated_days: number;
  }>;
};

type FastestPathResponse = {
  fastest_path: Array<{
    rank: number;
    game_id: string;
    name: string;
    category: string;
    estimated_gems_hour: number;
    total_gem_pool: number;
    user_played: boolean;
    reason: string;
  }>;
};

type CatalogGoalsResponse = {
  rewards: Array<{
    id: string;
    label: string;
    type: string;
    gem_cost: number;
    emoji: string;
  }>;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createStarterUserGoals(): UserGoalsResponse {
  return {
    user_id: USER_ID,
    username: "archer",
    wallet_summary: { balance_gems: 1250 },
    active_goals: [
      {
        catalog_id: "goal-starter",
        reward_label: "Starter Goal",
        reward_type: "bonus",
        emoji: "💎",
        target_gems: 1000,
        current_gems: 250,
        progress_pct: 25,
        gems_remaining: 750,
        estimated_days: 4,
      },
    ],
  };
}

function createTurboUserGoals(): UserGoalsResponse {
  return {
    user_id: USER_ID,
    username: "archer",
    wallet_summary: { balance_gems: 1250 },
    active_goals: [
      {
        catalog_id: "goal-turbo",
        reward_label: "Turbo Goal",
        reward_type: "premium",
        emoji: "🚀",
        target_gems: 2500,
        current_gems: 1600,
        progress_pct: 64,
        gems_remaining: 900,
        estimated_days: 2,
      },
    ],
  };
}

function createStarterFastestPath(): FastestPathResponse {
  return {
    fastest_path: [
      {
        rank: 1,
        game_id: "game-starter-1",
        name: "Starter Sprint",
        category: "arcade",
        estimated_gems_hour: 120,
        total_gem_pool: 8000,
        user_played: false,
        reason: "Fastest route for the current goal.",
      },
      {
        rank: 2,
        game_id: "game-starter-2",
        name: "Goal Rush",
        category: "strategy",
        estimated_gems_hour: 95,
        total_gem_pool: 5600,
        user_played: true,
        reason: "Solid alternative.",
      },
    ],
  };
}

function createTurboFastestPath(): FastestPathResponse {
  return {
    fastest_path: [
      {
        rank: 1,
        game_id: "game-turbo-1",
        name: "Turbo Dash",
        category: "racing",
        estimated_gems_hour: 180,
        total_gem_pool: 9200,
        user_played: false,
        reason: "Optimized after switching to the turbo goal.",
      },
      {
        rank: 2,
        game_id: "game-turbo-2",
        name: "Turbo Loop",
        category: "arcade",
        estimated_gems_hour: 145,
        total_gem_pool: 7100,
        user_played: false,
        reason: "Secondary option after the goal switch.",
      },
    ],
  };
}

function createCatalogGoals(): CatalogGoalsResponse {
  return {
    rewards: [
      {
        id: "goal-starter",
        label: "Starter Goal",
        type: "bonus",
        gem_cost: 1000,
        emoji: "💎",
      },
      {
        id: "goal-turbo",
        label: "Turbo Goal",
        type: "premium",
        gem_cost: 2500,
        emoji: "🚀",
      },
    ],
  };
}

describe("Rewards integration", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("renders the initial active goal and recommended games", async () => {
    const serverState = {
      userGoals: createStarterUserGoals(),
      fastestPath: createStarterFastestPath(),
      catalogGoals: createCatalogGoals(),
    };

    mockedApiFetch.mockImplementation(async (path: string) => {
      if (path.startsWith("/user-goals")) return clone(serverState.userGoals);
      if (path.startsWith("/fastest-path")) return clone(serverState.fastestPath);
      if (path === "/goals") return clone(serverState.catalogGoals);
      if (path.startsWith("/user/select-goal")) {
        return {
          success: true,
          message: "Goal selected",
          goal: clone(serverState.userGoals.active_goals[0]),
        };
      }
      throw new Error(`Unexpected path: ${path}`);
    });

    const { Wrapper } = createQueryClientWrapper();

    render(<RewardsScreen />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.getByText("Starter Goal")).toBeTruthy());
    expect(screen.getByText("Starter Sprint")).toBeTruthy();
    expect(screen.getByText("Goal Rush")).toBeTruthy();
  });

  it("invalidates both reward queries after goal selection and refreshes the UI from new server truth", async () => {
    const serverState = {
      userGoals: createStarterUserGoals(),
      fastestPath: createStarterFastestPath(),
      catalogGoals: createCatalogGoals(),
    };

    mockedApiFetch.mockImplementation(async (path: string, init?: RequestInit) => {
      if (path.startsWith("/user-goals")) return clone(serverState.userGoals);
      if (path.startsWith("/fastest-path")) return clone(serverState.fastestPath);
      if (path === "/goals") return clone(serverState.catalogGoals);
      if (path.startsWith("/user/select-goal") && init?.method === "POST") {
        serverState.userGoals = createTurboUserGoals();
        serverState.fastestPath = createTurboFastestPath();
        return {
          success: true,
          message: "Goal selected",
          goal: clone(serverState.userGoals.active_goals[0]),
        };
      }
      throw new Error(`Unexpected path: ${path}`);
    });

    const { queryClient, Wrapper } = createQueryClientWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    render(<RewardsScreen />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.getByText("Starter Goal")).toBeTruthy());
    fireEvent.press(screen.getByText("Change Goal"));
    await waitFor(() => expect(screen.getByText("Turbo Goal")).toBeTruthy());
    fireEvent.press(screen.getByText("Turbo Goal"));

    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["userGoals", USER_ID] }),
      ),
    );
    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["fastestPath", USER_ID] }),
      ),
    );

    await waitFor(() => expect(screen.getByText("Turbo Goal")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Turbo Dash")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Turbo Loop")).toBeTruthy());
  });
});
