import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { USER_ID } from "@/constants/config";

import {
  catalogGoalsQueryKey,
  fastestPathQueryKey,
  getCatalogGoals,
  getFastestPath,
  getUserGoals,
  selectUserGoal,
  userGoalsQueryKey,
} from "../../../services";

export function useUserGoals(userId: string = USER_ID) {
  return useQuery({
    queryKey: userGoalsQueryKey(userId),
    queryFn: () => getUserGoals(userId),
  });
}

export function useFastestPath(userId: string = USER_ID) {
  return useQuery({
    queryKey: fastestPathQueryKey(userId),
    queryFn: () => getFastestPath(userId),
  });
}

export function useCatalogGoals() {
  return useQuery({
    queryKey: catalogGoalsQueryKey,
    queryFn: getCatalogGoals,
  });
}

export function useSelectGoal(userId: string = USER_ID) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (catalogId: string) => selectUserGoal(catalogId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userGoalsQueryKey(userId) });
      void queryClient.invalidateQueries({ queryKey: fastestPathQueryKey(userId) });
    },
  });
}
