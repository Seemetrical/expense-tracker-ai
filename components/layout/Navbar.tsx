'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, PlusCircle, TrendingUp } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: List },
];

interface Props {
  onAddClick: () => void;
}

export default function Navbar({ onAddClick }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Expensify</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${pathname === href
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Add button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Mobile nav */}
      <div className="flex sm:hidden border-t border-gray-100">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors
              ${pathname === href
                ? 'text-indigo-700 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
