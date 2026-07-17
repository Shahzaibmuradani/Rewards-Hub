import { useQueryClient } from "@tanstack/react-query";

import { USER_ID } from "@/constants/config";

import {
  catalogGoalsQueryKey,
  fastestPathQueryKey,
  userGoalsQueryKey,
} from "../../../services";
import {
  useCatalogGoals,
  useFastestPath,
  useUserGoals,
} from "./useRewardsQueries";

export function useRewardsScreen(userId: string = USER_ID) {
  const queryClient = useQueryClient();

  const userGoalsQuery = useUserGoals(userId);
  const fastestPathQuery = useFastestPath(userId);
  const catalogQuery = useCatalogGoals();

  const isLoading =
    userGoalsQuery.isLoading || fastestPathQuery.isLoading || catalogQuery.isLoading;

  const isRefreshing =
    userGoalsQuery.isRefetching ||
    fastestPathQuery.isRefetching ||
    catalogQuery.isRefetching;

  const error = userGoalsQuery.error ?? fastestPathQuery.error ?? catalogQuery.error ?? null;

  const data = {
    activeGoal: userGoalsQuery.data?.active_goals[0] ?? null,
    fastestPath: fastestPathQuery.data?.fastest_path ?? [],
    catalogRewards: catalogQuery.data?.rewards ?? [],
  };

  const refreshAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userGoalsQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: fastestPathQueryKey(userId) }),
      queryClient.invalidateQueries({ queryKey: catalogGoalsQueryKey }),
    ]);
  };

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refreshAll,
  };
}
