'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
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
  Settings,
  Languages,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  const { user, profile, loading, signOut } = useAuth();

  const {
    language,
    setLanguage,
  } = useAdminLanguage();

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
        {language === 'bn'
          ? 'লোড হচ্ছে...'
          : 'Loading...'}
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const navItems = [
    {
      href: '/admin',
      label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/biodata',
      label:
        language === 'bn'
          ? 'বায়োডাটা রিকোয়েস্ট'
          : 'Biodata Requests',
      icon: FileClock,
    },
    {
      href: '/admin/users',
      label:
        language === 'bn'
          ? 'ইউজার তালিকা'
          : 'Users',
      icon: Users,
    },
    {
      href: '/admin/support',
      label:
        language === 'bn'
          ? 'সাপোর্ট / রিপোর্ট'
          : 'Support / Reports',
      icon: Flag,
    },
    {
      href: '/admin/connections',
      label:
        language === 'bn'
          ? 'কানেকশন পেমেন্ট'
          : 'Connection Payments',
      icon: Coins,
    },
    {
      href: '/admin/settings',
      label:
        language === 'bn'
          ? 'সেটিংস'
          : 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">

        {/* Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div>
            <span className="text-white font-bold text-sm block">
              Life Partner BD
            </span>

            <span className="text-[10px] text-slate-500">
              Admin Panel
            </span>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

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

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800 space-y-1">

          {/* Language */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <Languages className="w-4 h-4" />

            <span className="flex-1 text-left">
              {language === 'bn'
                ? 'English'
                : 'বাংলা'}
            </span>

            <span className="text-[10px] text-slate-500">
              {language === 'bn' ? 'EN' : 'BN'}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />

            {language === 'bn'
              ? 'লগআউট'
              : 'Logout'}
          </button>

        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
