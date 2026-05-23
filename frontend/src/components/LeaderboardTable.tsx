import { LeaderboardResponse, LeaderboardRow } from '@/lib/types';

type Props = {
  rows: LeaderboardRow[];
  currentUser: LeaderboardResponse['current_user'];
};

export default function LeaderboardTable({ rows, currentUser }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <table className="w-full border-collapse text-left">
        <thead className="bg-zinc-50 text-zinc-700">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold">Місце</th>
            <th className="px-4 py-3 text-sm font-semibold">Ім&apos;я</th>
            <th className="px-4 py-3 text-sm font-semibold">Монети</th>
            <th className="px-4 py-3 text-sm font-semibold">Завершені курси</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rank}
              className={row.userId === currentUser.currentUserId ? 'bg-amber-100 text-zinc-800' : 'text-zinc-500 bg-white'}
            >
              <td className="px-4 py-3">{row.rank}</td>
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.coins}</td>
              <td className="px-4 py-3">{row.courses_completed}</td>
            </tr>
          ))}

          {currentUser.rank > 10 && (
            <tr className="bg-zinc-100">
              <td className="px-4 py-3 font-bold text-zinc-600">{currentUser.rank}</td>
              <td className="px-4 py-3 font-bold text-zinc-600">Ваш рейтинг у списку</td>
              <td className="px-4 py-3 font-bold text-zinc-600">{currentUser.coins}</td>
              <td className="px-4 py-3 font-bold text-zinc-600">{currentUser.courses_completed}</td>
            </tr>
          )}

        </tbody>
      </table>


    </div>
  );
}