'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  UserRound,
  MapPin,
  GraduationCap,
  Briefcase,
  Ruler,
  Palette,
  BookOpen,
  Users,
  Heart,
  ArrowLeft,
  UserRoundCheck,
} from 'lucide-react';
import ShortlistButton from '@/components/ShortlistButton';

type Biodata = {
  id: number;
  biodata_type: string;
  marital_status: string;
  birth_year: number;
  height: string;
  complexion: string;
  district: string;
  education: string;
  occupation: string;
  salat_punctuality: string;
  purdah_or_beard: string;
  family_background: string;
  partner_expectation: string;
  created_at: string;
};

function BiodataViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBiodata = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('biodatas')
        .select('id, biodata_type, marital_status, birth_year, height, complexion, district, education, occupation, salat_punctuality, purdah_or_beard, family_background, partner_expectation, created_at')
        .eq('id', id)
        .eq('status', 'approved')
        .eq('is_verified', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBiodata(data as Biodata);
      }
      setLoading(false);
    };

    fetchBiodata();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (notFound || !biodata) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
          <UserRound className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">বায়োডাটা পাওয়া যায়নি</h2>
          <p className="text-sm text-gray-600 mt-2 mb-6">
            এই বায়োডাটাটি খুঁজে পাওয়া যায়নি অথবা এখনো অনুমোদিত হয়নি।
          </p>
          <Link
            href="/biodatas"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 rounded-lg text-sm font-medium transition"
          >
            লিস্টে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  const infoRows = [
    { icon: Ruler, label: 'উচ্চতা', value: biodata.height },
    { icon: Palette, label: 'গায়ের রং', value: biodata.complexion },
    { icon: MapPin, label: 'স্থায়ী জেলা', value: biodata.district },
    { icon: GraduationCap, label: 'শিক্ষাগত যোগ্যতা', value: biodata.education },
    { icon: Briefcase, label: 'পেশা', value: biodata.occupation },
    { icon: BookOpen, label: 'নামাজ', value: biodata.salat_punctuality },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-4">
          <Link href="/biodatas" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition">
            <ArrowLeft className="w-4 h-4" />
            লিস্টে ফিরে যান
          </Link>
          <ShortlistButton biodataId={biodata.id} />
        </div>

        {/* হেডার কার্ড */}
        <div className={`rounded-2xl p-6 mb-5 text-white ${
          biodata.biodata_type === 'groom'
            ? 'bg-gradient-to-br from-teal-800 to-teal-900'
            : 'bg-gradient-to-br from-fuchsia-700 to-purple-900'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <UserRound className="w-11 h-11 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full">
                  {biodata.biodata_type === 'groom' ? 'পাত্র' : 'পাত্রী'}
                </span>
                <span className="text-xs flex items-center gap-1 text-emerald-300">
                  <UserRoundCheck className="w-3.5 h-3.5" />
                  ভেরিফাইড
                </span>
              </div>
              <h1 className="text-xl font-bold">বয়স: {currentYear - biodata.birth_year} বছর</h1>
              <p className="text-sm opacity-80">{biodata.marital_status}</p>
            </div>
          </div>
        </div>

        {/* মৌলিক তথ্য */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">মৌলিক তথ্য</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoRows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{row.label}</p>
                    <p className="text-sm font-medium text-gray-800">{row.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* পর্দা/দাড়ি */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">দ্বীনদারি</h2>
          <p className="text-sm text-gray-700">{biodata.purdah_or_beard}</p>
        </div>

        {/* পারিবারিক পরিচিতি */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">পারিবারিক পরিচিতি</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{biodata.family_background}</p>
        </div>

        {/* জীবনসঙ্গী প্রত্যাশা */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-fuchsia-600" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">জীবনসঙ্গী প্রত্যাশা</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{biodata.partner_expectation}</p>
        </div>

        {/* গার্ডিয়ান তথ্য - লক করা */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-amber-900 font-medium mb-1">🔒 অভিভাবকের যোগাযোগের তথ্য লক করা আছে</p>
          <p className="text-xs text-amber-700">এই তথ্য দেখতে হলে শীঘ্রই আসছে "কানেকশন" ফিচার ব্যবহার করতে হবে।</p>
        </div>

      </div>
    </div>
  );
}

export default function BiodataViewPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">লোড হচ্ছে...</div>}>
      <BiodataViewInner />
    </Suspense>
  );
}
