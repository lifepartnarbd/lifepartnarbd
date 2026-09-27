'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Edit,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function EditBiodata() {
  const {
    user,
    loading,
  } = useAuth();

  const [has, setHas] =
    useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('biodatas')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setHas(!!data);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="p-10">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Link
          href="/login"
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg"
        >
          লগইন করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      <Link
        href="/account"
        className="inline-flex gap-1 items-center text-sm text-gray-500 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        ড্যাশবোর্ড
      </Link>

      <div className="bg-white border rounded-2xl p-8 text-center">

        <Edit className="w-10 h-10 text-purple-600 mx-auto mb-3" />

        <h1 className="text-xl font-bold">
          বায়োডাটা এডিট
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          বর্তমান ফর্মটি পুনরায় পূরণ করে আপডেট করতে পারবেন।
        </p>

        <Link
          href="/create-biodata"
          className="inline-block mt-5 bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm"
        >
          {has
            ? 'বায়োডাটা ফর্ম খুলুন'
            : 'বায়োডাটা তৈরি করুন'}
        </Link>

      </div>
    </div>
  );
}
