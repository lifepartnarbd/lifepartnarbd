'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  AdminLanguageProvider,
  useAdminLanguage,
} from '@/contexts/AdminLanguageContext';
import { useEffect, useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const { user, profile, loading, signOut } = useAuth();
  const { language, toggleLanguage } = useAdminLanguage();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // মোবাইলে পেজ বদলালে সাইডবার নিজে থেকে বন্ধ হয়ে যাবে
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
        {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
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
      label: language === 'bn' ? 'ইউজার তালিকা' : 'Users',
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
      label: language === 'bn' ? 'সেটিংস' : 'Settings',
      icon: Settings,
    },
  ];

  const currentLabel =
    navItems.find((item) => item.href === pathname)?.label ??
    (language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard');

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* মোবাইলে সাইডবার খোলা থাকলে পেছনের অংশ অন্ধকার হয়ে যাবে, ট্যাপ করলে বন্ধ হবে */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >

        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <span className="text-white font-bold text-sm">
              Life Partner BD
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label={language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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

        <div className="p-3 border-t border-slate-800 space-y-2">

          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
            {language === 'bn' ? 'লগআউট' : 'Logout'}
          </button>

        </div>

      </aside>

      {/* মোবাইল টপবার: হ্যামবার্গার আইকনে ক্লিক করলে সাইডবার খুলবে */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-20 h-14 bg-slate-900 border-b border-slate-800 flex items-center gap-3 px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label={language === 'bn' ? 'মেনু খুলুন' : 'Open menu'}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-sm truncate">
          {currentLabel}
        </span>
      </header>

      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLanguageProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AdminLanguageProvider>
  );
}
