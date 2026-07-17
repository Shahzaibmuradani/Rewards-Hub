import { useEffect, useState } from 'react';

type Reward = {
  id: string;
  label: string;
  type: string;
  gem_cost: number;
  emoji: string;
};

type UserGoal = {
  catalog_id: string;
  reward_label: string;
  reward_type: string;
  emoji: string;
  target_gems: number;
  current_gems: number;
  progress_pct: number;
  gems_remaining: number;
  estimated_days: number;
};

type UserGoalsResponse = {
  user_id: string;
  username: string;
  wallet_summary: {
    balance_gems: number;
  };
  active_goals: UserGoal[];
};

type GoalResponse = {
  rewards: Reward[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
const USER_ID = '8be4df61-93ca-11d2-aa0d-00e098032b8c';

export default function App() {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [userGoalsResponse, goalsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user-goals?user_id=${USER_ID}`),
          fetch(`${API_BASE_URL}/goals`),
        ]);

        if (!userGoalsResponse.ok || !goalsResponse.ok) {
          throw new Error('Failed to load data from the Rewards Hub API');
        }

        const userGoalsData: UserGoalsResponse = await userGoalsResponse.json();
        const goalsData: GoalResponse = await goalsResponse.json();

        setGoals(userGoalsData.active_goals);
        setRewards(goalsData.rewards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Rewards Hub</p>
        <h1>Track rewards, choose goals, and keep momentum going.</h1>
        <p className="lead">
          This web app connects to the same backend endpoints as the mobile app, powered by the demo user and reward catalog.
        </p>
      </section>

      {loading && <p>Loading rewards and goals…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="card">
            <h2>Active goals</h2>
            {goals.length === 0 ? (
              <p>No active goals yet.</p>
            ) : (
              <ul>
                {goals.map((goal) => (
                  <li key={goal.catalog_id}>
                    <strong>{goal.reward_label}</strong> — {goal.current_gems}/{goal.target_gems} gems
                    <span> • {goal.progress_pct.toFixed(0)}% complete</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2>Reward catalog</h2>
            <div className="grid">
              {rewards.map((reward) => (
                <article key={reward.id} className="reward-card">
                  <div className="reward-emoji">{reward.emoji}</div>
                  <h3>{reward.label}</h3>
                  <p>{reward.type}</p>
                  <p>{reward.gem_cost} gems</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
