'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  Lock,
  Languages,
} from 'lucide-react';

import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

export default function AdminLoginPage() {
  const router = useRouter();

  const {
    language,
    toggleLanguage,
  } = useAdminLanguage();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const {
      data,
      error: signInError,
    } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (signInError || !data.user) {
      setError(
        language === 'bn'
          ? 'ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।'
          : 'Invalid email or password.'
      );

      setLoading(false);
      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (
      profileError ||
      profile?.role !== 'admin'
    ) {
      await supabase.auth.signOut();

      setError(
        language === 'bn'
          ? 'এই অ্যাকাউন্টের admin অ্যাক্সেস নেই।'
          : 'This account does not have admin access.'
      );

      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">

      {/* Language */}
      <button
        onClick={toggleLanguage}
        type="button"
        className="absolute top-5 right-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs"
      >
        <Languages className="w-4 h-4" />

        {language === 'bn'
          ? 'English'
          : 'বাংলা'}
      </button>

      <div className="max-w-sm w-full">

        <div className="text-center mb-8">

          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-xl font-bold text-white">
            Admin Panel
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য'
              : 'For authorized administrators only'}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label className="block text-xs font-medium text-slate-400 mb-1">
                {language === 'bn'
                  ? 'অ্যাডমিন ইমেইল'
                  : 'Admin Email'}
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                placeholder={
                  language === 'bn'
                    ? 'অ্যাডমিন ইমেইল'
                    : 'Admin email'
                }
              />

            </div>

            <div>

              <label className="block text-xs font-medium text-slate-400 mb-1">
                {language === 'bn'
                  ? 'পাসওয়ার্ড'
                  : 'Password'}
              </label>

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                placeholder={
                  language === 'bn'
                    ? 'পাসওয়ার্ড'
                    : 'Password'
                }
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:opacity-90 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >

              <Lock className="w-4 h-4" />

              {loading
                ? language === 'bn'
                  ? 'যাচাই করা হচ্ছে...'
                  : 'Checking...'
                : language === 'bn'
                  ? 'অ্যাডমিন লগইন'
                  : 'Admin Login'}

            </button>

          </form>

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Life Partner BD — Admin Access Only
        </p>

      </div>

    </div>
  );
}
