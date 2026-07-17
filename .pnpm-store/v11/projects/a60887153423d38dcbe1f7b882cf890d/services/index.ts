import { USER_ID } from "@/constants/config";
import type {
  ICatalogGoalsResponse,
  IFastestPathResponse,
  ISelectGoalResponse,
  IUserGoals,
} from "@/types";
import { apiFetch } from "./api";

export const userGoalsQueryKey = (userId: string = USER_ID) =>
  ["userGoals", userId] as const;

export const fastestPathQueryKey = (userId: string = USER_ID) =>
  ["fastestPath", userId] as const;

export const catalogGoalsQueryKey = ["catalogGoals"] as const;

export function getUserGoals(userId: string = USER_ID): Promise<IUserGoals> {
  return apiFetch(`/user-goals?user_id=${userId}`);
}

export function getFastestPath(userId: string = USER_ID): Promise<IFastestPathResponse> {
  return apiFetch(`/fastest-path?user_id=${userId}`);
}

export function getCatalogGoals(): Promise<ICatalogGoalsResponse> {
  return apiFetch("/goals");
}

export function selectUserGoal(
  catalogId: string,
  userId: string = USER_ID,
): Promise<ISelectGoalResponse> {
  return apiFetch(`/user/select-goal?user_id=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ catalog_id: catalogId }),
  });
}
