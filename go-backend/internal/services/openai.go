package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"rewards-hub/go-backend/internal/models"
)

const defaultRecommendationModel = "gemini-2.5-flash"

// OpenAIService now wraps the Gemini API client under the same structural contract
type OpenAIService struct {
	client  *genai.Client
	enabled bool
	model   string
}

type recommendationPromptGame struct {
	GameID            string  `json:"game_id"`
	Rank              int     `json:"rank"`
	Name              string  `json:"name"`
	Category          string  `json:"category"`
	EstimatedGemsHour float64 `json:"estimated_gems_hour"`
	TotalGemPool      int     `json:"total_gem_pool"`
	UserPlayed        bool    `json:"user_played"`
}

type recommendationResponse struct {
	Reasons map[string]string `json:"reasons"`
}

// NewOpenAIService creates a new Gemini service adapter
func NewOpenAIService() *OpenAIService {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Println("Warning: GEMINI_API_KEY not set. Personalized reasons will not be generated.")
		return &OpenAIService{enabled: false}
	}

	model := os.Getenv("GEMINI_MODEL")
	if model == "" {
		model = defaultRecommendationModel
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("Warning: Failed to create Gemini client: %v. Using default reasons.", err)
		return &OpenAIService{enabled: false}
	}

	log.Printf("Gemini recommendations enabled with model %s", model)

	return &OpenAIService{
		client:  client,
		enabled: true,
		model:   model,
	}
}

// GenerateRecommendationReasons adds personalized reasons to a ranked fastest-path list.
func (s *OpenAIService) GenerateRecommendationReasons(items []models.FastestPathItem, targetGems int, remainingGems int) []models.FastestPathItem {
	for i := range items {
		items[i].Reason = getDefaultReason(items[i].Rank, items[i].Name, items[i].EstimatedGemsHour, items[i].UserPlayed)
	}

	if s == nil || !s.enabled || s.client == nil || len(items) == 0 {
		return items
	}

	games := make([]recommendationPromptGame, 0, len(items))
	for _, item := range items {
		games = append(games, recommendationPromptGame{
			GameID:            item.GameID,
			Rank:              item.Rank,
			Name:              item.Name,
			Category:          item.Category,
			EstimatedGemsHour: item.EstimatedGemsHour,
			TotalGemPool:      item.TotalGemPool,
			UserPlayed:        item.UserPlayed,
		})
	}

	gamesJSON, err := json.Marshal(games)
	if err != nil {
		log.Printf("Warning: Could not encode recommendation prompt: %v. Using default reasons.", err)
		return items
	}

	userPrompt := fmt.Sprintf(
		`Current target gems: %d
Remaining gems to target: %d
Ranked fastest-path games JSON:
%s`,
		targetGems,
		remainingGems,
		string(gamesJSON),
	)

	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()

	model := s.client.GenerativeModel(s.model)
	
	// Enforce strict JSON output schemas on Gemini
	model.ResponseMIMEType = "application/json"
	model.SystemInstruction = genai.NewUserContent(genai.Text(
		"You write concise, friendly mobile rewards recommendations. " +
			"Return valid JSON only. Each reason must be one conversational sentence under 30 words. " +
			"Use the target gems, remaining gems, rank, gems/hour, and whether the user has played the game. " +
			"Return JSON only in this exact shape: {\"reasons\":{\"game_id\":\"personalized reason\"}}",
	))

	resp, err := model.GenerateContent(ctx, genai.Text(userPrompt))
	if err != nil {
		log.Printf("Warning: Gemini API error: %v. Using default reasons.", err)
		return items
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return items
	}

	// Extract content text safely from Gemini part structures
	partText, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return items
	}

	content := strings.TrimSpace(string(partText))
	
	var parsed recommendationResponse
	if err := json.Unmarshal([]byte(content), &parsed); err != nil {
		log.Printf("Warning: Could not parse Gemini recommendation response: %v. Using default reasons.", err)
		return items
	}

	for i := range items {
		reason := strings.TrimSpace(parsed.Reasons[items[i].GameID])
		reason = strings.Trim(reason, "\"'")
		if reason != "" {
			items[i].Reason = reason
		}
	}

	return items
}

// GenerateRecommendationReason generates a personalized reason for a single game recommendation
func (s *OpenAIService) GenerateRecommendationReason(rank int, gameName string, gemsPerHour float64, targetGems int, remainingGems int, userPlayed bool) string {
	if s == nil || !s.enabled || s.client == nil {
		return getDefaultReason(rank, gameName, gemsPerHour, userPlayed)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userPlayedText := "has not played"
	if userPlayed {
		userPlayedText = "has already played"
	}

	userPrompt := fmt.Sprintf(
		`Game: %s
Rank: %d
Estimated gems per hour: %.0f
Current target gems: %d
Remaining gems to target: %d
User game history: %s this game`,
		gameName, rank, gemsPerHour, targetGems, remainingGems,
		userPlayedText,
	)

	model := s.client.GenerativeModel(s.model)
	model.SystemInstruction = genai.NewUserContent(genai.Text(
		"You write concise, friendly mobile rewards recommendations. " +
			"Return exactly one conversational sentence under 30 words. " +
			"Do not include quotes, markdown formatting, JSON labels, or extra explanation.",
	))

	resp, err := model.GenerateContent(ctx, genai.Text(userPrompt))
	if err != nil {
		log.Printf("Warning: Gemini API error: %v. Using default reason.", err)
		return getDefaultReason(rank, gameName, gemsPerHour, userPlayed)
	}

	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		partText, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
		if ok {
			reason := strings.TrimSpace(string(partText))
			reason = strings.Trim(reason, "\"'")
			if reason != "" {
				return reason
			}
		}
	}

	return getDefaultReason(rank, gameName, gemsPerHour, userPlayed)
}

// getDefaultReason provides a default recommendation reason based on rank and earnings
func getDefaultReason(rank int, gameName string, gemsPerHour float64, userPlayed bool) string {
	switch rank {
	case 1:
		return "Best gems/hour available"
	case 2:
		if userPlayed {
			return "Good gems/hour, already started"
		}
		return "Good gems/hour, solid choice"
	case 3:
		return "Solid backup option"
	default:
		if gemsPerHour > 600 {
			return "High earning potential"
		}
		return "Reliable earning option"
	}
}