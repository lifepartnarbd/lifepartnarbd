'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  UserCircle2,
  Clock,
  XCircle,
  KeyRound,
  LogIn,
  PlusCircle,
  LayoutDashboard,
  Edit,
  Heart,
  Ban,
  Star,
  ShoppingCart,
  Send,
  Inbox,
  Flag,
  Settings,
  Trash2,
  LogOut,
  LayoutGrid,
  Coins,
  LineChart,
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
  const [connectionBalance, setConnectionBalance] = useState(0);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [sentProposalCount, setSentProposalCount] = useState(0);
  const [receivedProposalCount, setReceivedProposalCount] = useState(0);
  const [likedMeCount, setLikedMeCount] = useState(0);

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

    if (user) {
      fetchBiodata();

      const loadStats = async () => {
        const { data: bal } = await supabase
          .from('user_connections')
          .select('balance')
          .eq('user_id', user.id)
          .maybeSingle();

        setConnectionBalance(bal?.balance ?? 0);

        const [{ count: sc }, { count: sp }, { count: rp }] = await Promise.all([
          supabase
            .from('shortlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),

          supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', user.id),

          supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id),
        ]);

        setShortlistCount(sc ?? 0);
        setSentProposalCount(sp ?? 0);
        setReceivedProposalCount(rp ?? 0);

        const { data: mine } = await supabase
          .from('biodatas')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (mine) {
          const { count: lc } = await supabase
            .from('shortlists')
            .select('*', { count: 'exact', head: true })
            .eq('biodata_id', mine.id);

          setLikedMeCount(lc ?? 0);
        }
      };

      loadStats();
    }
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage('');

    if (newPassword.length < 6) {
      setPwMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setPwLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
          <LogIn className="w-12 h-12 text-purple-700 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900">
            লগইন করা প্রয়োজন
          </h2>

          <p className="text-sm text-gray-600 mt-2 mb-6">
            আপনার ড্যাশবোর্ড দেখতে হলে প্রথমে লগইন করুন।
          </p>

          <Link
            href="/login"
            className="block w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            লগইন করুন
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = {
    pending: {
      label: 'পেন্ডিং',
      color: 'bg-amber-100 text-amber-700',
      icon: Clock,
    },

    approved: {
      label: 'অনুমোদিত',
      color: 'bg-emerald-100 text-emerald-700',
      icon: Star,
    },

    rejected: {
      label: 'বাতিল',
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
    },
  } as const;

  const currentStatus = biodata
    ? statusInfo[biodata.status as keyof typeof statusInfo]
    : null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">

        <div className="w-full md:w-72 flex-shrink-0 space-y-4">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <UserCircle2 className="w-12 h-12 text-gray-400" />
            </div>

            <p className="text-sm text-gray-500 mb-1">
              বায়োডাটার অবস্থা
            </p>

            {biodataLoading ? (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium mb-4">
                লোড হচ্ছে...
              </span>
            ) : biodata ? (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${currentStatus?.color}`}
              >
                {currentStatus?.label}
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-4">
                তৈরি করেন নি
              </span>
            )}

            <Link
              href="/create-biodata"
              className="w-full bg-purple-800 hover:bg-purple-900 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />

              {biodata
                ? 'বায়োডাটা এডিট করুন'
                : 'বায়োডাটা তৈরি করুন'}
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <nav className="flex flex-col text-sm font-medium text-gray-600">

              <Link
                href="/account"
                className="flex items-center gap-3 px-5 py-3.5 bg-purple-50 text-purple-800 border-l-4 border-purple-800"
              >
                <LayoutDashboard className="w-5 h-5" />
                ড্যাশবোর্ড
              </Link>

              <Link
                href="/edit-biodata"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Edit className="w-5 h-5" />
                বায়োডাটা এডিট
              </Link>

              <Link
                href="/shortlist"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Heart className="w-5 h-5" />
                পছন্দের তালিকা
              </Link>

              <Link
                href="/ignore-list"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Ban className="w-5 h-5" />
                অপছন্দের তালিকা
              </Link>

              <Link
                href="/liked-me"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Star className="w-5 h-5" />
                আমাকে যারা পছন্দ করেছেন
              </Link>

              <Link
                href="/connections"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <ShoppingCart className="w-5 h-5" />
                কেনা কানেকশন
              </Link>

              <Link
                href="/sent-proposals"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Send className="w-5 h-5" />
                পাঠানো প্রস্তাব
              </Link>

              <Link
                href="/received-proposals"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Inbox className="w-5 h-5" />
                প্রাপ্ত প্রস্তাব
              </Link>

              <div className="h-px bg-gray-100 my-1" />

              <Link
                href="/support"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Flag className="w-5 h-5" />
                সাপোর্ট/রিপোর্ট
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <Settings className="w-5 h-5" />
                সেটিংস
              </Link>

              <Link
                href="/delete-biodata"
                className="flex items-center gap-3 px-5 py-3.5 text-red-600 hover:bg-red-50 border-l-4 border-transparent hover:border-red-300"
              >
                <Trash2 className="w-5 h-5" />
                ডিলিট বায়োডাটা
              </Link>

              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center w-full text-left gap-3 px-5 py-3.5 text-gray-600 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
              >
                <LogOut className="w-5 h-5" />
                লগআউট
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1 space-y-6">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-purple-800" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-purple-900">
                ড্যাশবোর্ড
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                আপনার অ্যাকাউন্টের সারসংক্ষেপ এক নজরে দেখুন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="bg-purple-800 rounded-xl shadow-sm p-6 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full">
                <Coins className="w-6 h-6 text-white/80" />
              </div>

              <div>
                <h3 className="text-4xl font-bold mb-1">
                  {connectionBalance}
                </h3>

                <p className="text-sm font-medium text-white/90">
                  কানেকশন রয়েছে
                </p>

                <p className="text-xs text-white/70 mt-2">
                  প্রতিটি বায়োডাটার যোগাযোগের তথ্য দেখতে ১টি কানেকশন প্রয়োজন।
                </p>
              </div>

              <Link
                href="/connections"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg mt-5 flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                কানেকশন কিনুন
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
              <div className="absolute top-4 right-4 bg-blue-50 p-2 rounded-full">
                <LineChart className="w-6 h-6 text-blue-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                ০ বার
              </h3>

              <p className="text-sm font-medium text-gray-700">
                বায়োডাটা ভিজিট সংখ্যা
              </p>

              <p className="text-xs text-gray-400 mt-1 mb-4">
                আপনার বায়োডাটা যতবার ভিজিট করা হয়েছে।
              </p>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-center">

                <div>
                  <div className="text-xs text-gray-500">
                    শেষ ৩০ দিন
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-1">
                    ০
                  </div>
                </div>

                <div className="border-l border-gray-100">
                  <div className="text-xs text-gray-500">
                    শেষ ৭ দিন
                  </div>

                  <div className="text-sm font-bold text-gray-900 mt-1">
                    ০
                  </div>
                </div>

                <div className="border-l border-gray-100">
                  <div className="text-xs text-purple-700 font-semibold">
                    আজকে
                  </div>

                  <div className="text-sm font-bold text-purple-900 mt-1">
                    ০
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
              <div className="absolute top-4 right-4 bg-amber-50 p-2 rounded-full">
                <Star className="w-6 h-6 text-amber-500 fill-amber-100" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {likedMeCount} জন
              </h3>

              <p className="text-sm font-medium text-gray-700">
                আপনার বায়োডাটা পছন্দের তালিকাভুক্ত হয়েছে
              </p>

              <p className="text-xs text-gray-400 mt-1">
                এত জন আপনার বায়োডাটা পছন্দের তালিকায় রেখেছেন।
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {[
              {
                title: 'পছন্দের তালিকা',
                desc: 'আপনার পছন্দের তালিকাভুক্ত বায়োডাটা সমূহ।',
                icon: Heart,
                color: 'text-pink-500 bg-pink-50',
                count: shortlistCount,
                href: '/shortlist',
              },

              {
                title: 'অপছন্দের তালিকা',
                desc: 'আপনার অপছন্দের তালিকাভুক্ত বায়োডাটা সমূহ।',
                icon: Ban,
                color: 'text-red-500 bg-red-50',
                count: 0,
                href: '/ignore-list',
              },

              {
                title: 'কানেকশন ক্রয়সমূহ',
                desc: 'আপনার কানেকশন ক্রয় সংক্রান্ত সমস্ত তথ্য',
                icon: ShoppingCart,
                color: 'text-purple-600 bg-purple-50',
                count: connectionBalance,
                href: '/purchases',
              },

              {
                title: 'পাঠানো প্রস্তাব',
                desc: 'আপনি যে প্রস্তাবগুলো পাঠিয়েছেন।',
                icon: Send,
                color: 'text-blue-500 bg-blue-50',
                count: sentProposalCount,
                href: '/sent-proposals',
              },

              {
                title: 'প্রাপ্ত প্রস্তাব',
                desc: 'আপনি যে প্রস্তাবগুলো পেয়েছেন।',
                icon: Inbox,
                color: 'text-emerald-500 bg-emerald-50',
                count: receivedProposalCount,
                href: '/received-proposals',
              },
            ].map((item, idx) => (
              <Link
                href={item.href}
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${item.color}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="text-lg font-bold text-gray-300 px-2">
                  {item.count}
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mt-8">

            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gray-100 p-2 rounded-full">
                <KeyRound className="w-5 h-5 text-gray-600" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  পাসওয়ার্ড পরিবর্তন
                </h2>

                <p className="text-xs text-gray-500">
                  আপনার একাউন্টের নিরাপত্তা নিশ্চিত করুন
                </p>
              </div>
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

            <form
              onSubmit={handlePasswordChange}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <input
                type="password"
                placeholder="নতুন পাসওয়ার্ড লিখুন..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />

              <button
                type="submit"
                disabled={pwLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition whitespace-nowrap"
              >
                {pwLoading
                  ? 'পরিবর্তন হচ্ছে...'
                  : 'পরিবর্তন করুন'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
