package services

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/google/uuid"
	"rewards-hub/go-backend/internal/models"
)

// RewardService handles reward-related database operations
type RewardService struct {
	db *sql.DB
}

// NewRewardService creates a new reward service
func NewRewardService(db *sql.DB) *RewardService {
	return &RewardService{db: db}
}

// GetUserGoals returns user profile, wallet, and calculated active goals
func (s *RewardService) GetUserGoals(userID string) (*models.UserGoalsResponse, error) {
	// Get user
	user := &models.User{}
	err := s.db.QueryRow(
		"SELECT id, username, balance_gems FROM users WHERE id = $1",
		userID,
	).Scan(&user.ID, &user.Username, &user.BalanceGems)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Get active goals with reward details
	rows, err := s.db.Query(
		`SELECT ug.catalog_id, r.label, r.type, r.emoji, r.gem_cost 
		 FROM user_goals ug
		 JOIN rewards r ON ug.catalog_id = r.id
		 WHERE ug.user_id = $1 AND ug.is_active = 1`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activeGoals []models.UserGoal
	for rows.Next() {
		var goal models.UserGoal
		if err := rows.Scan(&goal.CatalogID, &goal.RewardLabel, &goal.RewardType, &goal.Emoji, &goal.TargetGems); err != nil {
			log.Printf("Error scanning goal: %v", err)
			continue
		}

		// Calculate dynamic fields
		goal.CurrentGems = user.BalanceGems
		goal.GemsRemaining = goal.TargetGems - goal.CurrentGems
		goal.ProgressPct = float64(goal.CurrentGems) / float64(goal.TargetGems) * 100

		// Estimated days based on average daily earnings
		if goal.GemsRemaining > 0 {
			goal.EstimatedDays = float64(goal.GemsRemaining) / models.DailyAverageGems
		}

		activeGoals = append(activeGoals, goal)
	}

	return &models.UserGoalsResponse{
		UserID:        user.ID,
		Username:      user.Username,
		WalletSummary: models.WalletSummary{BalanceGems: user.BalanceGems},
		ActiveGoals:   activeGoals,
	}, nil
}

// GetAllRewards returns all available rewards in the catalog
func (s *RewardService) GetAllRewards() (*models.GoalsResponse, error) {
	rows, err := s.db.Query(
		"SELECT id, label, type, gem_cost, emoji FROM rewards ORDER BY gem_cost ASC",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rewards []models.Reward
	for rows.Next() {
		var reward models.Reward
		if err := rows.Scan(&reward.ID, &reward.Label, &reward.Type, &reward.GemCost, &reward.Emoji); err != nil {
			log.Printf("Error scanning reward: %v", err)
			continue
		}
		rewards = append(rewards, reward)
	}

	return &models.GoalsResponse{Rewards: rewards}, nil
}

// GetFastestPath returns games ranked by earning efficiency with optional AI-generated reasons
func (s *RewardService) GetFastestPath(userID string, aiService *OpenAIService) (*models.FastestPathResponse, error) {
	// Get user's active goal to know target and remaining gems
	userGoals, err := s.GetUserGoals(userID)
	if err != nil {
		return nil, err
	}

	targetGems := 0
	remainingGems := 0
	if len(userGoals.ActiveGoals) > 0 {
		targetGems = userGoals.ActiveGoals[0].TargetGems
		remainingGems = userGoals.ActiveGoals[0].GemsRemaining
	}

	// Get games sorted by estimated_gems_hour (highest first)
	rows, err := s.db.Query(
		`SELECT g.id, g.name, g.category, g.estimated_gems_hour, g.total_gem_pool, 
		        COALESCE(ug.played, 0)
		 FROM games g
		 LEFT JOIN user_games ug ON g.id = ug.game_id AND ug.user_id = $1
		 ORDER BY g.estimated_gems_hour DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var fastestPath []models.FastestPathItem
	rank := 1

	for rows.Next() {
		var item models.FastestPathItem
		var userPlayed int
		if err := rows.Scan(
			&item.GameID, &item.Name, &item.Category, &item.EstimatedGemsHour,
			&item.TotalGemPool, &userPlayed,
		); err != nil {
			log.Printf("Error scanning game: %v", err)
			continue
		}

		item.Rank = rank
		item.UserPlayed = userPlayed == 1

		fastestPath = append(fastestPath, item)
		rank++
	}

	fastestPath = aiService.GenerateRecommendationReasons(fastestPath, targetGems, remainingGems)

	return &models.FastestPathResponse{FastestPath: fastestPath}, nil
}

// SelectUserGoal sets a user's primary tracked goal
func (s *RewardService) SelectUserGoal(userID string, catalogID string) (*models.UserGoal, error) {
	// Verify reward exists
	var rewardExists int
	err := s.db.QueryRow("SELECT COUNT(*) FROM rewards WHERE id = $1", catalogID).Scan(&rewardExists)
	if err != nil || rewardExists == 0 {
		return nil, errors.New("reward not found")
	}

	// Deactivate previous active goals
	_, err = s.db.Exec(
		"UPDATE user_goals SET is_active = 0 WHERE user_id = $1",
		userID,
	)
	if err != nil {
		return nil, err
	}

	// Check if user already has this goal
	var goalID string
	err = s.db.QueryRow(
		"SELECT id FROM user_goals WHERE user_id = $1 AND catalog_id = $2",
		userID, catalogID,
	).Scan(&goalID)

	if err == sql.ErrNoRows {
		// Create new goal
		goalID = uuid.New().String()
		_, err = s.db.Exec(
			"INSERT INTO user_goals (id, user_id, catalog_id, is_active) VALUES ($1, $2, $3, 1)",
			goalID, userID, catalogID,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create goal: %w", err)
		}
	} else if err != nil {
		return nil, err
	} else {
		// Activate existing goal
		_, err = s.db.Exec(
			"UPDATE user_goals SET is_active = 1 WHERE id = $1",
			goalID,
		)
		if err != nil {
			return nil, err
		}
	}

	// Fetch the updated goal
	user := &models.User{}
	err = s.db.QueryRow(
		"SELECT id, username, balance_gems FROM users WHERE id = $1",
		userID,
	).Scan(&user.ID, &user.Username, &user.BalanceGems)
	if err != nil {
		return nil, err
	}

	var goal models.UserGoal
	err = s.db.QueryRow(
		`SELECT ug.catalog_id, r.label, r.type, r.emoji, r.gem_cost 
		 FROM user_goals ug
		 JOIN rewards r ON ug.catalog_id = r.id
		 WHERE ug.id = $1`,
		goalID,
	).Scan(&goal.CatalogID, &goal.RewardLabel, &goal.RewardType, &goal.Emoji, &goal.TargetGems)
	if err != nil {
		return nil, err
	}

	// Calculate dynamic fields
	goal.CurrentGems = user.BalanceGems
	goal.GemsRemaining = goal.TargetGems - goal.CurrentGems
	goal.ProgressPct = float64(goal.CurrentGems) / float64(goal.TargetGems) * 100
	if goal.GemsRemaining > 0 {
		goal.EstimatedDays = float64(goal.GemsRemaining) / models.DailyAverageGems
	}

	return &goal, nil
}

// CreateOrGetUser creates a user if they don't exist, or returns existing user
func (s *RewardService) CreateOrGetUser(userID string, username string, balanceGems int) (*models.User, error) {
	user := &models.User{}
	err := s.db.QueryRow(
		"SELECT id, username, balance_gems FROM users WHERE id = $1",
		userID,
	).Scan(&user.ID, &user.Username, &user.BalanceGems)

	if err == sql.ErrNoRows {
		// Create new user
		_, err = s.db.Exec(
			"INSERT INTO users (id, username, balance_gems) VALUES ($1, $2, $3)",
			userID, username, balanceGems,
		)
		if err != nil {
			return nil, err
		}
		user.ID = userID
		user.Username = username
		user.BalanceGems = balanceGems
		return user, nil
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}
