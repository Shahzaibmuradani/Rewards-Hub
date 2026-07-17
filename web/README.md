# Rewards Hub Web

This folder contains a dedicated React + Vite web app for Rewards Hub.
It calls the existing Go backend API directly, so it can run independently from the mobile Expo app while sharing the same data contract.

## Prerequisites

- Node.js 18+
- npm
- The Rewards Hub backend running on port 8080

## Backend requirement

Start the backend first:

```bash
cd ../go-backend
go run ./cmd/main.go
```

The API will be available at:

```text
http://localhost:8080/api
```

## Install and run

```bash
cd web
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Environment variables

If you need to point the web app at a different API host, create a `.env` file in the `web` folder:

```env
VITE_API_URL=http://localhost:8080/api
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## What it shows

- User goals pulled from the backend
- Reward catalog pulled from the backend
- Basic web UI for browsing rewards and goals
