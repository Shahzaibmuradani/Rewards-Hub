package models

import "time"

// User represents a user in the system
type User struct {
	ID          string    `json:"user_id"`
	Username    string    `json:"username"`
	BalanceGems int       `json:"balance_gems"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// WalletSummary represents the user's wallet
type WalletSummary struct {
	BalanceGems int `json:"balance_gems"`
}

// Reward represents a reward in the catalog
type Reward struct {
	ID      string `json:"id"`
	Label   string `json:"label"`
	Type    string `json:"type"`
	GemCost int    `json:"gem_cost"`
	Emoji   string `json:"emoji"`
}

// UserGoal represents a user's active or selected goal
type UserGoal struct {
	CatalogID       string  `json:"catalog_id"`
	RewardLabel     string  `json:"reward_label"`
	RewardType      string  `json:"reward_type"`
	Emoji           string  `json:"emoji"`
	TargetGems      int     `json:"target_gems"`
	CurrentGems     int     `json:"current_gems"`
	ProgressPct     float64 `json:"progress_pct"`
	GemsRemaining   int     `json:"gems_remaining"`
	EstimatedDays   float64 `json:"estimated_days"`
}

// UserGoalsResponse represents the response for /api/user-goals
type UserGoalsResponse struct {
	UserID       string         `json:"user_id"`
	Username     string         `json:"username"`
	WalletSummary WalletSummary  `json:"wallet_summary"`
	ActiveGoals  []UserGoal     `json:"active_goals"`
}

// GoalsResponse represents the response for /api/goals
type GoalsResponse struct {
	Rewards []Reward `json:"rewards"`
}

// Game represents a game in the fastest path
type Game struct {
	ID                 string  `json:"game_id"`
	Name               string  `json:"name"`
	Category           string  `json:"category"`
	EstimatedGemsHour  float64 `json:"estimated_gems_hour"`
	TotalGemPool       int     `json:"total_gem_pool"`
	UserPlayed         bool    `json:"user_played"`
	Reason             string  `json:"reason"`
}

// FastestPathItem represents a ranked game in the fastest path
type FastestPathItem struct {
	Rank               int     `json:"rank"`
	GameID             string  `json:"game_id"`
	Name               string  `json:"name"`
	Category           string  `json:"category"`
	EstimatedGemsHour  float64 `json:"estimated_gems_hour"`
	TotalGemPool       int     `json:"total_gem_pool"`
	UserPlayed         bool    `json:"user_played"`
	Reason             string  `json:"reason"`
}

// FastestPathResponse represents the response for /api/fastest-path
type FastestPathResponse struct {
	FastestPath []FastestPathItem `json:"fastest_path"`
}

// SelectGoalRequest represents the request payload for /api/user/select-goal
type SelectGoalRequest struct {
	CatalogID string `json:"catalog_id"`
}

// SelectGoalResponse represents the response for /api/user/select-goal
type SelectGoalResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Goal    *UserGoal   `json:"goal,omitempty"`
}

// DailyAverageGems represents the average gems earned per day
// This is used for calculating estimated_days
const DailyAverageGems = 750 // Average gems earned per day across all games
