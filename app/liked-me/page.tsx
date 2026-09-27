'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Star,
  UserRound,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function LikedMe() {
  const {
    user,
    loading,
  } = useAuth();

  const [items, setItems] =
    useState<any[]>([]);

  const [busy, setBusy] =
    useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setBusy(false);
        return;
      }

      const { data: mine } =
        await supabase
          .from('biodatas')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (!mine) {
        setBusy(false);
        return;
      }

      const { data } =
        await supabase
          .from('shortlists')
          .select(
            'id,created_at,user_id'
          )
          .eq(
            'biodata_id',
            mine.id
          )
          .order('created_at', {
            ascending: false,
          });

      setItems(data ?? []);
      setBusy(false);
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="p-10 text-center">
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

      <h1 className="text-2xl font-bold flex gap-2 items-center">
        <Star className="text-amber-500" />
        আমাকে যারা পছন্দ করেছেন
      </h1>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        আপনার বায়োডাটাকে অন্য কেউ পছন্দ করলে এখানে সংখ্যা দেখা যাবে। পরিচয়/ব্যক্তিগত তথ্য গোপন রাখা হয়েছে।
      </p>

      {busy ? (
        <p>
          লোড হচ্ছে...
        </p>
      ) : (
        <div className="bg-white border rounded-2xl p-8 text-center">

          <UserRound className="w-10 h-10 text-gray-200 mx-auto mb-3" />

          <p className="font-semibold text-gray-700">
            {items.length} জন
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {items.length
              ? 'আপনার বায়োডাটা পছন্দের তালিকায় রাখা হয়েছে।'
              : 'এখনও কেউ আপনার বায়োডাটা পছন্দ করেননি।'}
          </p>

        </div>
      )}

    </div>
  );
}
