'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Languages,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  const {
    language,
    setLanguage,
  } = useAdminLanguage();

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState('');

  const [error, setError] =
    useState('');

  const changePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!user?.email) {
      setError(
        language === 'bn'
          ? 'অ্যাডমিন ইউজার পাওয়া যায়নি।'
          : 'Admin user could not be found.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড দুইবার একই নয়।'
          : 'New passwords do not match.'
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের থেকে আলাদা দিন।'
          : 'New password must be different from the current password.'
      );
      return;
    }

    setLoading(true);

    // First verify current password
    const {
      error: verifyError,
    } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      setError(
        language === 'bn'
          ? 'বর্তমান পাসওয়ার্ড সঠিক নয়।'
          : 'Current password is incorrect.'
      );

      setLoading(false);
      return;
    }

    // Update password
    const {
      error: updateError,
    } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(
        language === 'bn'
          ? updateError.message
          : 'Password could not be changed.'
      );

      setLoading(false);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setSuccess(
      language === 'bn'
        ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।'
        : 'Password changed successfully.'
    );

    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">

      <div className="mb-7">

        <h1 className="text-2xl font-bold text-white">
          {language === 'bn'
            ? 'অ্যাডমিন সেটিংস'
            : 'Admin Settings'}
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          {language === 'bn'
            ? 'অ্যাডমিন অ্যাকাউন্ট এবং ভাষার সেটিংস'
            : 'Manage admin account and language settings'}
        </p>

      </div>

      {/* Language */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Languages className="w-5 h-5 text-blue-400" />
          </div>

          <div className="flex-1">

            <h2 className="text-white font-semibold">
              {language === 'bn'
                ? 'ভাষা'
                : 'Language'}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {language === 'bn'
                ? 'Admin Panel-এর ভাষা নির্বাচন করুন।'
                : 'Choose the language for the Admin Panel.'}
            </p>

            <div className="flex gap-2 mt-4">

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  language === 'en'
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  language === 'bn'
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Password */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <div className="flex items-start gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
          </div>

          <div>

            <h2 className="text-white font-semibold">
              {language === 'bn'
                ? 'পাসওয়ার্ড পরিবর্তন'
                : 'Change Password'}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {language === 'bn'
                ? 'অ্যাডমিন অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন।'
                : 'Change the password of your admin account.'}
            </p>

          </div>

        </div>

        {success && (
          <div className="mb-5 flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg p-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={changePassword}
          className="space-y-4 max-w-lg"
        >

          <div>

            <label className="block text-xs font-medium text-slate-400 mb-1">
              {language === 'bn'
                ? 'বর্তমান পাসওয়ার্ড'
                : 'Current Password'}
            </label>

            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              placeholder={
                language === 'bn'
                  ? 'বর্তমান পাসওয়ার্ড দিন'
                  : 'Enter current password'
              }
            />

          </div>

          <div>

            <label className="block text-xs font-medium text-slate-400 mb-1">
              {language === 'bn'
                ? 'নতুন পাসওয়ার্ড'
                : 'New Password'}
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              placeholder={
                language === 'bn'
                  ? 'কমপক্ষে ৬ অক্ষর'
                  : 'At least 6 characters'
              }
            />

          </div>

          <div>

            <label className="block text-xs font-medium text-slate-400 mb-1">
              {language === 'bn'
                ? 'নতুন পাসওয়ার্ড আবার দিন'
                : 'Confirm New Password'}
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              placeholder={
                language === 'bn'
                  ? 'নতুন পাসওয়ার্ড আবার লিখুন'
                  : 'Enter new password again'
              }
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white px-5 py-3 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >

            <Lock className="w-4 h-4" />

            {loading
              ? language === 'bn'
                ? 'পরিবর্তন হচ্ছে...'
                : 'Changing...'
              : language === 'bn'
                ? 'পাসওয়ার্ড পরিবর্তন করুন'
                : 'Change Password'}

          </button>

        </form>

      </div>

    </div>
  );
}
