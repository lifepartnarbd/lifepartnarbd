'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { KeyRound, Globe, Trash2, LogIn, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage('');

    if (newPassword.length < 6) {
      setPwMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);

    if (error) {
      setPwMessage('সমস্যা হয়েছে: ' + error.message);
    } else {
      setPwMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।');
      setNewPassword('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
          <LogIn className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">লগইন করা প্রয়োজন</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6">সেটিংস দেখতে হলে লগইন করুন।</p>
          <Link href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            লগইন করুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <SettingsIcon className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">সেটিংস</h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">পাসওয়ার্ড পরিবর্তন</h2>
        </div>

        {pwMessage && (
          <div className={`text-sm rounded-lg p-3 mb-4 ${pwMessage.includes('সফলভাবে') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {pwMessage}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            placeholder="নতুন পাসওয়ার্ড"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="flex-1 border rounded-lg p-2.5 text-sm bg-gray-50"
          />
          <button
            type="submit"
            disabled={pwLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition whitespace-nowrap"
          >
            {pwLoading ? 'আপডেট হচ্ছে...' : 'পরিবর্তন করুন'}
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900">ভাষা</h2>
        </div>
        <p className="text-sm text-gray-500">এই মুহূর্তে সাইট শুধুমাত্র বাংলায় উপলব্ধ। ইংরেজি ভাষা শীঘ্রই যুক্ত করা হবে।</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-red-900">অ্যাকাউন্ট ডিলিট করুন</h2>
        </div>
        <p className="text-sm text-red-700 mb-4">
          অ্যাকাউন্ট ডিলিট করলে আপনার সকল তথ্য ও বায়োডাটা স্থায়ীভাবে মুছে যাবে। এই কাজটি আপাতত সাপোর্টের মাধ্যমে করতে হবে।
        </p>
        <Link
          href="mailto:lifepartnarbd@gmail.com"
          className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          ডিলিট অনুরোধ পাঠান
        </Link>
      </div>
    </div>
  );
}
