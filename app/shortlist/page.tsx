'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Heart, UserRound, MapPin, GraduationCap, LogIn } from 'lucide-react';

type ShortlistedBiodata = {
  id: number;
  biodata_type: string;
  birth_year: number;
  district: string;
  education: string;
};

export default function ShortlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ShortlistedBiodata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlist = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('shortlists')
        .select('biodata_id, biodatas ( id, biodata_type, birth_year, district, education )')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const list = data
          .map((row: any) => row.biodatas)
          .filter(Boolean) as ShortlistedBiodata[];
        setItems(list);
      }
      setLoading(false);
    };

    if (user) fetchShortlist();
  }, [user]);

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">লোড হচ্ছে...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
          <LogIn className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">লগইন করা প্রয়োজন</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6">পছন্দের তালিকা দেখতে হলে লগইন করুন।</p>
          <Link href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            লগইন করুন
          </Link>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-1">
        <Heart className="w-5 h-5 text-pink-500" />
        <h1 className="text-2xl font-bold text-gray-900">পছন্দের তালিকা</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        আপনি সর্বমোট {loading ? '...' : items.length} টি বায়োডাটা পছন্দের তালিকায় রেখেছেন।
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">পছন্দের তালিকা খালি</p>
          <p className="text-xs text-gray-500 mt-1">আপনি এখনও কোনো বায়োডাটা পছন্দের তালিকায় রাখেননি।</p>
          <Link href="/biodatas" className="inline-block mt-4 text-emerald-600 text-sm font-medium hover:underline">
            বায়োডাটা খুঁজুন →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((b) => (
            <Link
              key={b.id}
              href={`/biodatas/view?id=${b.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  b.biodata_type === 'groom' ? 'bg-teal-100' : 'bg-fuchsia-100'
                }`}>
                  <UserRound className={`w-6 h-6 ${b.biodata_type === 'groom' ? 'text-teal-700' : 'text-fuchsia-700'}`} />
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {b.biodata_type === 'groom' ? 'পাত্র' : 'পাত্রী'} · বয়স {currentYear - b.birth_year}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" />{b.district}</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-gray-400" />{b.education}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
