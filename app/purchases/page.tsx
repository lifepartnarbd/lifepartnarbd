'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function PurchasesPage() {
  const {
    user,
    loading,
  } = useAuth();

  const [rows, setRows] =
    useState<any[]>([]);

  const [busy, setBusy] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('connection_orders')
      .select(
        'id,amount,plan_code,payment_method,transaction_id,status,connections_granted,created_at'
      )
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      })
      .then(({ data }) => {
        setRows(data ?? []);
        setBusy(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
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
        className="inline-flex items-center gap-1 text-sm text-gray-500 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        ড্যাশবোর্ড
      </Link>

      <div className="flex items-center gap-2 mb-1">

        <ShoppingCart className="w-5 h-5 text-purple-700" />

        <h1 className="text-2xl font-bold">
          কেনা কানেকশন
        </h1>

      </div>

      <p className="text-sm text-gray-500 mb-6">
        আপনার কানেকশন ক্রয়/পেমেন্ট রিকোয়েস্টের ইতিহাস।
      </p>

      {busy ? (
        <p>
          লোড হচ্ছে...
        </p>
      ) : rows.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center">

          <p className="font-semibold">
            ০টি ক্রয়
          </p>

          <Link
            href="/connections"
            className="text-emerald-600 text-sm mt-3 inline-block"
          >
            কানেকশন কিনুন →
          </Link>

        </div>
      ) : (
        <div className="space-y-3">

          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded-xl p-4 flex justify-between gap-3"
            >

              <div>

                <p className="font-semibold">
                  ৳{r.amount} ·{' '}
                  {r.connections_granted}{' '}
                  কানেকশন
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {r.payment_method} ·{' '}
                  {r.transaction_id} ·{' '}
                  {new Date(
                    r.created_at
                  ).toLocaleDateString(
                    'bn-BD'
                  )}
                </p>

              </div>

              <span className="text-xs font-semibold">
                {r.status ===
                'approved'
                  ? 'অনুমোদিত'
                  : r.status ===
                    'rejected'
                  ? 'বাতিল'
                  : 'পেন্ডিং'}
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
