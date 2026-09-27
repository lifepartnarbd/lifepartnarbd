'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Send,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateBiodataPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [formData, setFormData] = useState({
    biodata_type: 'groom',
    marital_status: 'অবিবাহিত',
    birth_year: 2000,
    height: "5' 6\"",
    complexion: 'শ্যামলা',
    education: '',
    occupation: '',
    district: '',
    salat_punctuality: '৫ ওয়াক্ত নিয়মিত',
    purdah_or_beard: '',
    family_background: '',
    partner_expectation: '',
    guardian_relation: 'বাবা',
    guardian_phone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
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

    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase
          .from('biodatas')
          .insert([
            {
              ...formData,
              user_id: user.id,
              status: 'pending',
              is_verified: false,
            },
          ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      alert(
        err.message ||
          'সাবমিট করতে সমস্যা হয়েছে।'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">

        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-emerald-100 text-center shadow-sm">

          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900">
            বায়োডাটা জমা হয়েছে!
          </h2>

          <p className="text-sm text-gray-600 mt-2 mb-6">
            আপনার বায়োডাটাটি অ্যাডমিন রিভিউয়ের জন্য জমা রাখা হয়েছে। যাচাই-বাছাই শেষে এটি ওয়েবসাইটে উন্মুক্ত করা হবে।
          </p>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            হোমপেজে ফিরে যান
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900">
          বায়োডাটা রেজিস্ট্রেশন
        </h1>

        <p className="text-xs text-gray-500 mt-1 mb-6">
          সঠিক ও নির্ভুল তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন।
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="border-b border-gray-100 pb-5">

            <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">
              ১. সাধারণ তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  বায়োডাটার ধরন
                </label>

                <select
                  name="biodata_type"
                  value={formData.biodata_type}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                >
                  <option value="groom">
                    পাত্রের বায়োডাটা
                  </option>

                  <option value="bride">
                    পাত্রীর বায়োডাটা
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  বৈবাহিক অবস্থা
                </label>

                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                >
                  <option value="অবিবাহিত">
                    অবিবাহিত
                  </option>

                  <option value="ডিভোর্সড">
                    ডিভোর্সড
                  </option>

                  <option value="বিধবা/বিপত্নীক">
                    বিধবা/বিপত্নীক
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  জন্ম সাল
                </label>

                <input
                  type="number"
                  name="birth_year"
                  value={formData.birth_year}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  উচ্চতা
                </label>

                <input
                  type="text"
                  name="height"
                  placeholder="যেমন: 5' 6''"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  গায়ের রং
                </label>

                <input
                  type="text"
                  name="complexion"
                  placeholder="যেমন: উজ্জ্বল শ্যামলা / ফর্সা"
                  value={formData.complexion}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  স্থায়ী জেলা
                </label>

                <input
                  type="text"
                  name="district"
                  placeholder="যেমন: ঢাকা"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  শিক্ষাগত যোগ্যতা
                </label>

                <input
                  type="text"
                  name="education"
                  placeholder="যেমন: অনার্স / ফাজিল / মাস্টার্স"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  পেশা
                </label>

                <input
                  type="text"
                  name="occupation"
                  placeholder="পেশার বিবরণ"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

            </div>
          </div>

          <div className="border-b border-gray-100 pb-5">

            <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">
              ২. দ্বীনি ও পারিবারিক বিবরণ
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  নামাজ সংক্রান্ত বিবরণ
                </label>

                <input
                  type="text"
                  name="salat_punctuality"
                  placeholder="প্রতিদিন ৫ ওয়াক্ত সালাত পড়া হয় কি না"
                  value={formData.salat_punctuality}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  পর্দা / সুন্নতি দাড়ি
                </label>

                <input
                  type="text"
                  name="purdah_or_beard"
                  placeholder="সুন্নতি দাড়ি আছে কি না / বাইরে পর্দা মানা হয় কি না"
                  value={formData.purdah_or_beard}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  পারিবারিক পরিচিতি
                </label>

                <textarea
                  name="family_background"
                  rows={2}
                  placeholder="বাবা-মা ও ভাই-বোনদের সংক্ষিপ্ত বিবরণ"
                  value={formData.family_background}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  কেমন জীবনসঙ্গী চান
                </label>

                <textarea
                  name="partner_expectation"
                  rows={2}
                  placeholder="জীবনসঙ্গী নিয়ে আপনার প্রত্যাশা"
                  value={formData.partner_expectation}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">

            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-700" />

              <span>
                ৩. অভিভাবকের তথ্য (ওয়েবসাইটে সরাসরি উন্মুক্ত থাকবে না)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  অভিভাবকের সাথে সম্পর্ক
                </label>

                <input
                  type="text"
                  name="guardian_relation"
                  placeholder="যেমন: বাবা / বড় ভাই"
                  value={formData.guardian_relation}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  অভিভাবকের মোবাইল নম্বর
                </label>

                <input
                  type="tel"
                  name="guardian_phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-amber-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition"
          >
            {loading ? (
              'জমা দেওয়া হচ্ছে...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                বায়োডাটা সাবমিট করুন
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
