'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  UserCircle2,
  BadgeCheck,
  Clock,
  XCircle,
  FileText,
  KeyRound,
  LogIn,
  PlusCircle,
  Search,
  ShieldCheck,
} from 'lucide-react';

type Biodata = {
  id: number;
  biodata_type: string;
  status: string;
  is_verified: boolean;
  created_at: string;
};

export default function AccountPage() {
  const { user, profile, loading: authLoading } = useAuth();

  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [biodataLoading, setBiodataLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  useEffect(() => {
    const fetchBiodata = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('biodatas')
        .select('id, biodata_type, status, is_verified, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setBiodata(data ?? null);
      setBiodataLoading(false);
    };

    if (user) fetchBiodata();
  }, [user]);

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
          <p className="text-sm text-gray-600 mt-2 mb-6">
            আপনার ড্যাশবোর্ড দেখতে হলে প্রথমে লগইন করুন।
          </p>
          <Link
            href="/login"
            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            লগইন করুন
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = {
    pending: { label: 'পেন্ডিং', color: 'from-amber-500 to-orange-600', icon: Clock },
    approved: { label: 'অনুমোদিত', color: 'from-emerald-500 to-emerald-700', icon: BadgeCheck },
    rejected: { label: 'বাতিল', color: 'from-red-500 to-red-700', icon: XCircle },
  } as const;

  const currentStatus = biodata ? statusInfo[biodata.status as keyof typeof statusInfo] : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* প্রোফাইল হেডার */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
            <UserCircle2 className="w-9 h-9 text-white" />
          </div>
          <div>
            <p className="text-xs font-mono text-amber-300 font-semibold">{profile?.custom_id}</p>
            <h1 className="text-xl md:text-2xl font-bold">{profile?.full_name || 'নাম নেই'}</h1>
            <p className="text-sm text-teal-100">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-8">

        {/* স্ট্যাটাস কার্ড গ্রিড - OrdhekDeen স্টাইল: বড়, centered */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">আমার একাউন্ট পরিসংখ্যান</h2>
          <div className="grid grid-cols-3 gap-3 md:gap-5">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {biodataLoading ? '...' : biodata ? '১' : '০'}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">আমার বায়োডাটা</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 text-center">
              <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${currentStatus?.color ?? 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                {(() => {
                  const Icon = currentStatus?.icon ?? Clock;
                  return <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />;
                })()}
              </div>
              <div className="text-lg md:text-xl font-extrabold text-gray-900">
                {biodataLoading ? '...' : currentStatus?.label ?? 'জমা হয়নি'}
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">স্ট্যাটাস</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-lg md:text-xl font-extrabold text-gray-900">সাধারণ</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">অ্যাকাউন্ট টাইপ</div>
            </div>

          </div>
        </div>

        {/* কুইক অ্যাকশন */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">দ্রুত কাজ</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/create-biodata"
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3 hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {biodata ? 'বায়োডাটা এডিট করুন' : 'বায়োডাটা জমা দিন'}
              </span>
            </Link>

            <Link
              href="/"
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3 hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-full bg-fuchsia-50 flex items-center justify-center">
                <Search className="w-6 h-6 text-fuchsia-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">বায়োডাটা খুঁজুন</span>
            </Link>
          </div>
        </div>

        {/* বায়োডাটা বিস্তারিত */}
        {biodata && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">বায়োডাটার বিস্তারিত</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs block">ধরন</span>
                {biodata.biodata_type === 'groom' ? 'পাত্রের বায়োডাটা' : 'পাত্রীর বায়োডাটা'}
              </div>
              <div>
                <span className="text-gray-400 text-xs block">জমা দেওয়ার তারিখ</span>
                {new Date(biodata.created_at).toLocaleDateString('bn-BD')}
              </div>
            </div>
            {biodata.status === 'rejected' && (
              <p className="text-xs text-red-600 mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
                আপনার বায়োডাটা বাতিল হয়েছে। বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।
              </p>
            )}
          </div>
        )}

        {/* পাসওয়ার্ড পরিবর্তন */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">পাসওয়ার্ড পরিবর্তন</h2>
          </div>

          {pwMessage && (
            <div
              className={`text-sm rounded-lg p-3 mb-4 ${
                pwMessage.includes('সফলভাবে')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
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

      </div>
    </div>
  );
}
