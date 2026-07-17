.PHONY: build run clean test help

help:
	@echo "Available commands:"
	@echo "  make build   - Build the Go backend"
	@echo "  make run     - Run the Go backend"
	@echo "  make test    - Run tests"
	@echo "  make clean   - Remove build artifacts"
	@echo "  make deps    - Download dependencies"

build:
	@echo "Building Go backend..."
	go build -o bin/server ./cmd

run:
	@echo "Running Go backend..."
	go run ./cmd/main.go

test:
	@echo "Running tests..."
	go test -v ./...

clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	rm -f data/rewards.db

deps:
	@echo "Downloading dependencies..."
	go mod download
	go mod tidy
