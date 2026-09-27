'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, UserCircle2 } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-emerald-600">
              Life Partner BD
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium">হোম</Link>
            <Link href="/biodatas" className="text-gray-700 hover:text-emerald-600 font-medium">বায়োডাটা খুঁজুন</Link>
            <Link href="#" className="text-gray-700 hover:text-emerald-600 font-medium">নির্দেশনা</Link>
            <Link href="#" className="text-gray-700 hover:text-emerald-600 font-medium">যোগাযোগ</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loading ? null : user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"
                >
                  <UserCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">{profile?.custom_id ?? 'ইউজার'}</span>
                </Link>
                <Link
                  href="/create-biodata"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  বায়োডাটা জমা দিন
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium px-3 py-2"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-emerald-600 font-medium px-3 py-2"
                >
                  লগইন
                </Link>
                <Link
                  href="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  সাইনআপ
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-700 py-2">হোম</Link>
            <Link href="/biodatas" className="block text-gray-700 py-2">বায়োডাটা খুঁজুন</Link>
            <Link href="#" className="block text-gray-700 py-2">নির্দেশনা</Link>
            <Link href="#" className="block text-gray-700 py-2">যোগাযোগ</Link>
            <div className="border-t border-gray-100 pt-3">
              {user ? (
                <>
                  <Link href="/account" className="block text-sm text-gray-700 py-2">
                    {profile?.custom_id ?? 'ইউজার'} (অ্যাকাউন্ট)
                  </Link>
                  <Link href="/create-biodata" className="block bg-emerald-600 text-white text-sm text-center py-2 rounded-lg mb-2 mt-2">
                    বায়োডাটা জমা দিন
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left text-red-600 text-sm py-2">
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-700 py-2">লগইন</Link>
                  <Link href="/signup" className="block bg-emerald-600 text-white text-sm text-center py-2 rounded-lg mt-2">
                    সাইনআপ
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
