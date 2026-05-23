'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import Header from '@/components/Header';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardResponse } from '@/lib/types';
import { useAuthRedirect } from '@/lib/useAuthRedirect';
import { Crown } from 'lucide-react';

export default function LeaderboardPage() {
  useAuthRedirect();

  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<LeaderboardResponse>('/leaderboard')
      .then(setData)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-3xl flex items-center gap-4 font-semibold text-amber-400 group">
          <Crown className="h-7 w-7 text-amber-500 transition-transform duration-300 [rotate:-20deg] group-hover:[rotate:0deg]" />
          Leaderboard
        </h1>
          

        {loading && <div>Loading leaderboard...</div>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {data && (
          <LeaderboardTable rows={data.data} currentUser={data.current_user} />
        )}
      </main>
    </div>
  );
}