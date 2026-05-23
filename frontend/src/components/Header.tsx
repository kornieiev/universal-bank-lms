'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, clearTokens } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const links = [
    { href: '/courses', label: 'Courses' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];

  const logout = () => {
    clearTokens();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between gap-6 border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center gap-8">
        <div className="text-lg font-semibold text-zinc-900">Universal Bank LMS</div>

        <nav className="flex items-center gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-bold text-zinc-900 border-amber-500 bg-amber-400 border-1 rounded-3xl py-1 px-4">
          {user ? `${user.name} • ${user.coins} coins` : 'Guest'}
        </div>
        <button
          onClick={logout}
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}