package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"rewards-hub/go-backend/internal/models"
	"rewards-hub/go-backend/internal/services"
)

// GetUserGoalsHandler returns user profile, wallet, and calculated active goals
func GetUserGoalsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user_id from query parameters
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
			return
		}

		rewardService := services.NewRewardService(db)
		goals, err := rewardService.GetUserGoals(userID)
		if err != nil {
			if err.Error() == "user not found" {
				http.Error(w, "User not found", http.StatusNotFound)
				return
			}
			log.Printf("Error fetching user goals: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(goals)
	}
}

// GetGoalsHandler returns the full catalog of available rewards
func GetGoalsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rewardService := services.NewRewardService(db)
		goals, err := rewardService.GetAllRewards()
		if err != nil {
			log.Printf("Error fetching rewards: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(goals)
	}
}

// GetFastestPathHandler returns games ranked by earning efficiency
func GetFastestPathHandler(db *sql.DB, aiService *services.OpenAIService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user_id from query parameters
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
			return
		}

		rewardService := services.NewRewardService(db)
		fastestPath, err := rewardService.GetFastestPath(userID, aiService)
		if err != nil {
			log.Printf("Error fetching fastest path: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(fastestPath)
	}
}

// SelectGoalHandler updates user's primary tracked goal
func SelectGoalHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user_id from query parameters
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
			return
		}

		var req models.SelectGoalRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if req.CatalogID == "" {
			http.Error(w, "catalog_id is required", http.StatusBadRequest)
			return
		}

		rewardService := services.NewRewardService(db)
		goal, err := rewardService.SelectUserGoal(userID, req.CatalogID)
		if err != nil {
			log.Printf("Error selecting goal: %v", err)
			if err.Error() == "reward not found" {
				http.Error(w, "Reward not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response := models.SelectGoalResponse{
			Success: true,
			Message: "Goal selected successfully",
			Goal:    goal,
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}
