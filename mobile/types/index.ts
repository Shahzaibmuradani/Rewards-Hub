export interface IActiveGoal {
  catalog_id: string;
  reward_label: string;
  reward_type: string;
  emoji: string;
  target_gems: number;
  current_gems: number;
  progress_pct: number;
  gems_remaining: number;
  estimated_days: number;
}

export interface IUserGoals {
  user_id: string;
  username: string;
  wallet_summary: {
    balance_gems: number;
  };
  active_goals: IActiveGoal[];
}

export interface IFastestPathItem {
  rank: number;
  game_id: string;
  name: string;
  category: string;
  estimated_gems_hour: number;
  total_gem_pool: number;
  user_played: boolean;
  reason: string;
}

export interface IFastestPathResponse {
  fastest_path: IFastestPathItem[];
}

export interface ICatalogReward {
  id: string;
  label: string;
  type: string;
  gem_cost: number;
  emoji: string;
}

export interface ICatalogGoalsResponse {
  rewards: ICatalogReward[];
}

export interface ISelectGoalResponse {
  success: boolean;
  message: string;
  goal: IActiveGoal;
}
