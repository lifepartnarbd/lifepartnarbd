'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import Link from 'next/link';

import {
  useAuth,
} from '@/contexts/AuthContext';

import {
  LogIn,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const {
    signIn,
    user,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  /*
   * User already logged in হলে
   * login page না দেখিয়ে dashboard-এ পাঠাবে।
   */
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/account');
    }
  }, [
    authLoading,
    user,
    router,
  ]);

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
      error,
    } = await signIn(
      formData.email,
      formData.password
    );

    if (error) {
      setError(
        'ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে'
      );

      setLoading(false);
      return;
    }

    /*
     * Login success হলে সরাসরি Dashboard।
     */
    router.replace('/account');
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  /*
   * Already logged in হলে redirect হওয়ার
   * আগ পর্যন্ত login form দেখানোর দরকার নেই।
   */
  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500 text-sm">
        ড্যাশবোর্ডে নেওয়া হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">

      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        <div className="text-center mb-6">

          <LogIn className="w-10 h-10 text-emerald-600 mx-auto mb-2" />

          <h1 className="text-2xl font-bold text-gray-900">
            লগইন করুন
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            লগইন করলে সরাসরি আপনার ড্যাশবোর্ড খুলবে।
          </p>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-xs font-medium text-gray-700 mb-1">
              ইমেইল
            </label>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-xs font-medium text-gray-700 mb-1">
              পাসওয়ার্ড
            </label>

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {loading
              ? 'লগইন হচ্ছে...'
              : 'লগইন করুন'}
          </button>

        </form>

        {/* SIGNUP */}
        <p className="text-center text-xs text-gray-500 mt-5">

          অ্যাকাউন্ট নেই?{' '}

          <Link
            href="/signup"
            className="text-emerald-600 font-medium hover:underline"
          >
            নতুন অ্যাকাউন্ট খুলুন
          </Link>

        </p>

      </div>
    </div>
  );
}
