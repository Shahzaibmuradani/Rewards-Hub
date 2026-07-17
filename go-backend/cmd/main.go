package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"rewards-hub/go-backend/internal/db"
	"rewards-hub/go-backend/internal/handlers"
	"rewards-hub/go-backend/internal/services"
)

// enableCORS adds the required headers for cross-origin requests.
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allows incoming requests from your frontend environment
		w.Header().Set("Access-Control-Allow-Origin", "*") 
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle browser preflight OPTIONS requests instantly
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load environment variables
	godotenv.Load()

	// Initialize database
	database, err := db.Initialize()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	// Initialize OpenAI service for personalized recommendations
	aiService := services.NewOpenAIService()

	// Create router
	router := mux.NewRouter()

	// Rewards API endpoints
	router.HandleFunc("/api/user-goals", handlers.GetUserGoalsHandler(database)).Methods("GET")
	router.HandleFunc("/api/goals", handlers.GetGoalsHandler(database)).Methods("GET")
	router.HandleFunc("/api/fastest-path", handlers.GetFastestPathHandler(database, aiService)).Methods("GET")
	router.HandleFunc("/api/user/select-goal", handlers.SelectGoalHandler(database)).Methods("POST")

	// Server configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Starting Rewards Hub backend on %s", addr)

	// Wrap your router with the CORS middleware here
	if err := http.ListenAndServe(addr, enableCORS(router)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}