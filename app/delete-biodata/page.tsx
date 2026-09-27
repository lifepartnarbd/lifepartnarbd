'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Trash2,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function DeleteBiodata() {
  const { user } = useAuth();

  const [busy, setBusy] =
    useState(false);

  const del = async () => {
    if (
      !user ||
      !confirm(
        'আপনি কি সত্যিই বায়োডাটা মুছে ফেলতে চান?'
      )
    ) {
      return;
    }

    setBusy(true);

    const { error } =
      await supabase
        .from('biodatas')
        .delete()
        .eq('user_id', user.id);

    setBusy(false);

    if (error) {
      alert(error.message);
    } else {
      alert(
        'বায়োডাটা মুছে ফেলা হয়েছে।'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">

      <Link
        href="/account"
        className="inline-flex gap-1 items-center text-sm text-gray-500 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        ড্যাশবোর্ড
      </Link>

      <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">

        <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />

        <h1 className="text-xl font-bold">
          বায়োডাটা ডিলিট
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          এই কাজটি করার আগে নিশ্চিত হয়ে নিন।
        </p>

        <button
          disabled={busy}
          onClick={del}
          className="mt-5 bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm"
        >
          {busy
            ? 'মুছে ফেলা হচ্ছে...'
            : 'বায়োডাটা মুছে ফেলুন'}
        </button>

      </div>
    </div>
  );
}
