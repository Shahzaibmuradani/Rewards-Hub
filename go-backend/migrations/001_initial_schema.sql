-- Initial database schema for Rewards Hub - PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    balance_gems INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rewards catalog table
CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    gem_cost INTEGER NOT NULL,
    emoji TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User goals/tracked rewards table
CREATE TABLE IF NOT EXISTS user_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    catalog_id TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (catalog_id) REFERENCES rewards(id),
    UNIQUE(user_id, catalog_id)
);

-- Games table for fastest-path recommendations
CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    estimated_gems_hour DOUBLE PRECISION NOT NULL,
    total_gem_pool INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Per-user game state for the user_played response field
CREATE TABLE IF NOT EXISTS user_games (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    played INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_games_user_id ON user_games(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(type);
CREATE INDEX IF NOT EXISTS idx_games_gems_hour ON games(estimated_gems_hour DESC);

-- Dummy data matching the provided JSON examples
DELETE FROM user_games
WHERE id IN ('uuid-user-game-pixel-flow', 'uuid-user-game-stack-blitz', 'uuid-user-game-coin-rush')
    OR user_id = 'uuid-user-1234'
    OR game_id IN ('uuid-game-pixel-flow', 'uuid-game-stack-blitz', 'uuid-game-coin-rush');

DELETE FROM user_goals
WHERE id IN ('uuid-user-goal-paypal-675', 'uuid-user-goal-amazon-1012', 'uuid-goal-1')
    OR user_id = 'uuid-user-1234'
    OR catalog_id IN ('uuid-reward-paypal-675', 'uuid-reward-amazon-1012', 'uuid-reward-google-500');

DELETE FROM games
WHERE id IN ('uuid-game-pixel-flow', 'uuid-game-stack-blitz', 'uuid-game-coin-rush');

DELETE FROM rewards
WHERE id IN ('uuid-reward-paypal-675', 'uuid-reward-amazon-1012', 'uuid-reward-google-500');

DELETE FROM users
WHERE id = 'uuid-user-1234';

INSERT INTO users (id, username, balance_gems) VALUES
    ('8be4df61-93ca-11d2-aa0d-00e098032b8c', 'John Doe', 2199)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rewards (id, label, type, gem_cost, emoji) VALUES
    ('2f6a7c64-1b52-4f18-9147-2d9f5674d9ab', '€6.75 PayPal', 'paypal', 3999, '💰'),
    ('6f1b6f79-7b93-4b4d-933d-0d7c01c5a5c1', '€10.12 Amazon', 'amazon', 5999, '💰'),
    ('f5ad0d58-2ff0-4dfc-bb04-4bbf9d034a5d', '€5 Google Play', 'google_play', 3200, '🎮')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_goals (id, user_id, catalog_id, is_active) VALUES
    ('9f5f3c20-0e1d-4b0c-a16b-126e7fbd29e4', '8be4df61-93ca-11d2-aa0d-00e098032b8c', '2f6a7c64-1b52-4f18-9147-2d9f5674d9ab', 1),
    ('c5a83f1a-6319-4f67-a89c-6f3c36e22c4d', '8be4df61-93ca-11d2-aa0d-00e098032b8c', '6f1b6f79-7b93-4b4d-933d-0d7c01c5a5c1', 1)
ON CONFLICT (user_id, catalog_id) DO NOTHING;

INSERT INTO games (id, name, category, estimated_gems_hour, total_gem_pool) VALUES
    ('3c032af2-cd84-4b0d-9f8f-fdccd08f7681', 'Pixel Flow', 'arcade', 820, 204261),
    ('a37a7ebc-f6dd-4b74-8f9e-256f1c635f62', 'Stack Blitz', 'puzzle', 530, 53038),
    ('d9a1b3e8-412a-45a9-8c4c-5afef81eddea', 'Coin Rush', 'casual', 410, 31000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_games (id, user_id, game_id, played) VALUES
    ('f8aa3b4d-95d6-48af-81b6-b6888b3e4d22', '8be4df61-93ca-11d2-aa0d-00e098032b8c', '3c032af2-cd84-4b0d-9f8f-fdccd08f7681', 0),
    ('0c7cb2f4-3ca5-43fd-aa87-ed7c7cd997b5', '8be4df61-93ca-11d2-aa0d-00e098032b8c', 'a37a7ebc-f6dd-4b74-8f9e-256f1c635f62', 1),
    ('b65d30c0-e2b5-4a1d-95ab-9a6bb7e7f8c0', '8be4df61-93ca-11d2-aa0d-00e098032b8c', 'd9a1b3e8-412a-45a9-8c4c-5afef81eddea', 0)
ON CONFLICT (user_id, game_id) DO NOTHING;
