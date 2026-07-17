import React, { useEffect } from "react";
import { render, waitFor } from "@testing-library/react-native";

import { USER_ID } from "../../../constants/config";
import { apiFetch } from "../../../services/api";
import { createQueryClientWrapper } from "../test-utils/renderWithQueryClient";
import { useRewardsScreen } from "./useRewardsScreen";

jest.mock("../../../services/api", () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as unknown as jest.MockedFunction<any>;

type RewardsScreenState = ReturnType<typeof useRewardsScreen>;

function getUserGoalsPayload() {
  return Promise.resolve({
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
  });
}

function getFastestPathPayload() {
  return Promise.resolve({
    fastest_path: [
      {
        rank: 1,
        game_id: "game-1",
        name: "Starter Sprint",
        category: "arcade",
        estimated_gems_hour: 120,
        total_gem_pool: 8000,
        user_played: false,
        reason: "Fastest route for the current goal.",
      },
      {
        rank: 2,
        game_id: "game-2",
        name: "Goal Rush",
        category: "strategy",
        estimated_gems_hour: 95,
        total_gem_pool: 5600,
        user_played: true,
        reason: "Solid alternative.",
      },
    ],
  });
}

function getCatalogGoalsPayload() {
  return Promise.resolve({
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
  });
}

function Probe({ onChange }: { onChange: (state: RewardsScreenState) => void }) {
  const state = useRewardsScreen();

  useEffect(() => {
    onChange(state);
  }, [onChange, state]);

  return null;
}

describe("useRewardsScreen", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("exposes a combined loading state while queries are pending", async () => {
    mockedApiFetch.mockImplementation(
      () =>
        new Promise(() => {
          // Intentionally left pending to test loading behavior.
        }),
    );

    const latestState: { current?: RewardsScreenState } = {};
    const { Wrapper } = createQueryClientWrapper();

    render(
      <Probe
        onChange={(state) => {
          latestState.current = state;
        }}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(latestState.current?.isLoading).toBe(true));
    expect(latestState.current?.error).toBeNull();
  });

  it("maps resolved query data into the combined view model", async () => {
    mockedApiFetch.mockImplementation((path: string) => {
      if (path.startsWith("/user-goals")) return getUserGoalsPayload();
      if (path.startsWith("/fastest-path")) return getFastestPathPayload();
      if (path === "/goals") return getCatalogGoalsPayload();
      return Promise.reject(new Error(`Unexpected path: ${path}`));
    });

    const latestState: { current?: RewardsScreenState } = {};
    const { Wrapper } = createQueryClientWrapper();

    render(
      <Probe
        onChange={(state) => {
          latestState.current = state;
        }}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(latestState.current?.isLoading).toBe(false));
    await waitFor(() => expect(latestState.current?.data.activeGoal?.catalog_id).toBe("goal-starter"));

    expect(latestState.current?.error).toBeNull();
    expect(latestState.current?.data.activeGoal).toEqual({
      catalog_id: "goal-starter",
      reward_label: "Starter Goal",
      reward_type: "bonus",
      emoji: "💎",
      target_gems: 1000,
      current_gems: 250,
      progress_pct: 25,
      gems_remaining: 750,
      estimated_days: 4,
    });
    expect(latestState.current?.data.fastestPath).toEqual([
      {
        rank: 1,
        game_id: "game-1",
        name: "Starter Sprint",
        category: "arcade",
        estimated_gems_hour: 120,
        total_gem_pool: 8000,
        user_played: false,
        reason: "Fastest route for the current goal.",
      },
      {
        rank: 2,
        game_id: "game-2",
        name: "Goal Rush",
        category: "strategy",
        estimated_gems_hour: 95,
        total_gem_pool: 5600,
        user_played: true,
        reason: "Solid alternative.",
      },
    ]);
    expect(latestState.current?.data.catalogRewards).toEqual([
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
    ]);
  });

  it("captures API failures without throwing uncaught exceptions", async () => {
    mockedApiFetch.mockImplementation((path: string) => {
      if (path.startsWith("/user-goals")) return Promise.reject(new Error("500 server error"));
      if (path.startsWith("/fastest-path")) return getFastestPathPayload();
      if (path === "/goals") return getCatalogGoalsPayload();
      return Promise.reject(new Error(`Unexpected path: ${path}`));
    });

    const latestState: { current?: RewardsScreenState } = {};
    const { Wrapper } = createQueryClientWrapper();

    render(
      <Probe
        onChange={(state) => {
          latestState.current = state;
        }}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(latestState.current?.error).toBeInstanceOf(Error));
    expect(latestState.current?.error?.message).toBe("500 server error");
    expect(latestState.current?.data.activeGoal).toBeNull();
    expect(latestState.current?.isLoading).toBe(false);
  });
});
