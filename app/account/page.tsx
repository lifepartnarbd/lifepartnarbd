'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

type Biodata = {
  id: number;
  biodata_type: string;
  status: string;
  is_verified: boolean;
  created_at: string;
};

export default function AccountPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

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
            আপনার অ্যাকাউন্ট দেখতে হলে প্রথমে লগইন করুন।
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
    pending: { label: 'পেন্ডিং (পর্যালোচনাধীন)', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    approved: { label: 'অনুমোদিত', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: BadgeCheck },
    rejected: { label: 'বাতিল হয়েছে', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  } as const;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* প্রোফাইল কার্ড */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0">
          <UserCircle2 className="w-9 h-9 text-white" />
        </div>
        <div>
          <p className="text-xs font-mono text-emerald-600 font-semibold">{profile?.custom_id}</p>
          <h1 className="text-xl font-bold text-gray-900">{profile?.full_name || 'নাম নেই'}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* বায়োডাটা স্ট্যাটাস কার্ড */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">আমার বায়োডাটা</h2>
        </div>

        {biodataLoading ? (
          <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
        ) : !biodata ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-4">আপনি এখনো কোনো বায়োডাটা জমা দেননি।</p>
            <Link
              href="/create-biodata"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              বায়োডাটা জমা দিন
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium ${
                statusInfo[biodata.status as keyof typeof statusInfo]?.color ?? 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {(() => {
                const Icon = statusInfo[biodata.status as keyof typeof statusInfo]?.icon ?? Clock;
                return <Icon className="w-4 h-4" />;
              })()}
              {statusInfo[biodata.status as keyof typeof statusInfo]?.label ?? biodata.status}
            </div>

            <div className="text-xs text-gray-500">
              ধরন: {biodata.biodata_type === 'groom' ? 'পাত্রের বায়োডাটা' : 'পাত্রীর বায়োডাটা'} · জমা দেওয়া হয়েছে:{' '}
              {new Date(biodata.created_at).toLocaleDateString('bn-BD')}
            </div>

            {biodata.status === 'rejected' && (
              <p className="text-xs text-gray-500">
                আপনার বায়োডাটা বাতিল হয়েছে। বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।
              </p>
            )}
          </div>
        )}
      </div>

      {/* পাসওয়ার্ড পরিবর্তন কার্ড */}
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
  );
}
