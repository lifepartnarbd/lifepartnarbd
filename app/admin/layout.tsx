'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileClock,
  LogOut,
  ShieldCheck,
  Flag,
  Coins,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoginPage) return;

    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [
    isLoginPage,
    loading,
    user,
    profile,
    router,
  ]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (
    loading ||
    !user ||
    profile?.role !== 'admin'
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/biodata',
      label: 'বায়োডাটা রিকোয়েস্ট',
      icon: FileClock,
    },
    {
      href: '/admin/users',
      label: 'ইউজার তালিকা',
      icon: Users,
    },
    {
      href: '/admin/support',
      label: 'সাপোর্ট / রিপোর্ট',
      icon: Flag,
    },
    {
      href: '/admin/connections',
      label: 'কানেকশন পেমেন্ট',
      icon: Coins,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">

      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">

        <div className="p-5 border-b border-slate-800 flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <span className="text-white font-bold text-sm">
            Life Partner BD
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
            লগআউট
          </button>
        </div>

      </aside>

      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
