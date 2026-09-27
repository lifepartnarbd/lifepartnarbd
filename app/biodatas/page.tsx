'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { UserRound, MapPin, GraduationCap, Briefcase, Search, UserRoundCheck } from 'lucide-react';

type Biodata = {
  id: number;
  biodata_type: string;
  marital_status: string;
  birth_year: number;
  height: string;
  district: string;
  education: string;
  occupation: string;
  created_at: string;
};

export default function BiodatasPage() {
  const [biodatas, setBiodatas] = useState<Biodata[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('all');
  const [maritalFilter, setMaritalFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('');

  const fetchBiodatas = async () => {
    setLoading(true);
    let query = supabase
      .from('biodatas')
      .select('id, biodata_type, marital_status, birth_year, height, district, education, occupation, created_at')
      .eq('status', 'approved')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (typeFilter !== 'all') query = query.eq('biodata_type', typeFilter);
    if (maritalFilter !== 'all') query = query.eq('marital_status', maritalFilter);
    if (districtFilter.trim()) query = query.ilike('district', `%${districtFilter.trim()}%`);

    const { data, error } = await query;
    if (!error && data) setBiodatas(data as Biodata[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBiodatas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBiodatas();
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* সার্চ হেডার */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">বায়োডাটা খুঁজুন</h1>
          <p className="text-teal-100 text-sm mb-6">আপনার পছন্দ অনুযায়ী ফিল্টার করে বায়োডাটা খুঁজে নিন</p>

          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg p-2.5 text-sm text-gray-900 bg-white"
              >
                <option value="all">আমি খুঁজছি</option>
                <option value="groom">পাত্র (Groom)</option>
                <option value="bride">পাত্রী (Bride)</option>
              </select>

              <select
                value={maritalFilter}
                onChange={(e) => setMaritalFilter(e.target.value)}
                className="rounded-lg p-2.5 text-sm text-gray-900 bg-white"
              >
                <option value="all">বৈবাহিক অবস্থা</option>
                <option value="অবিবাহিত">অবিবাহিত</option>
                <option value="ডিভোর্সড">ডিভোর্সড</option>
                <option value="বিধবা/বিপত্নীক">বিধবা/বিপত্নীক</option>
              </select>

              <input
                type="text"
                placeholder="জেলা (যেমন: ঢাকা)"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="rounded-lg p-2.5 text-sm text-gray-900 bg-white sm:col-span-1"
              />

              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-teal-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                সার্চ করুন
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ফলাফল */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-4">
          {loading ? 'লোড হচ্ছে...' : `${biodatas.length} টি বায়োডাটা পাওয়া গেছে`}
        </p>

        {!loading && biodatas.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <UserRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">কোনো বায়োডাটা পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {biodatas.map((b) => (
              <Link
                key={b.id}
                href={`/biodatas/view?id=${b.id}`}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                    b.biodata_type === 'groom' ? 'bg-teal-100' : 'bg-fuchsia-100'
                  }`}>
                    <UserRound className={`w-7 h-7 ${b.biodata_type === 'groom' ? 'text-teal-700' : 'text-fuchsia-700'}`} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500">
                      {b.biodata_type === 'groom' ? 'পাত্র' : 'পাত্রী'} · বয়স {currentYear - b.birth_year}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <UserRoundCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-medium">ভেরিফাইড</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {b.district}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {b.education}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {b.occupation}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-emerald-600 font-medium">
                  বিস্তারিত দেখুন →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
