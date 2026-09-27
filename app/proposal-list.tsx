'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Inbox,
  Send,
  UserRound,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Proposal = {
  id: number;
  status: string;
  created_at: string;
  responded_at: string | null;
  biodata_id: number;

  biodatas: {
    id: number;
    biodata_type: string;
    birth_year: number;
    district: string;
    education: string;
  } | null;
};

function statusLabel(status: string) {
  if (status === 'accepted') {
    return {
      text: 'গ্রহণ করা হয়েছে',
      cls: 'bg-emerald-50 text-emerald-700',
      icon: CheckCircle2,
    };
  }

  if (status === 'declined') {
    return {
      text: 'প্রত্যাখ্যাত',
      cls: 'bg-red-50 text-red-700',
      icon: XCircle,
    };
  }

  return {
    text: 'অপেক্ষমাণ',
    cls: 'bg-amber-50 text-amber-700',
    icon: Clock,
  };
}

export function ProposalList({
  received = false,
}: {
  received?: boolean;
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [items, setItems] =
    useState<Proposal[]>([]);

  const [loading, setLoading] =
    useState(true);

  const load = async () => {
    if (!user) return;

    let query = supabase
      .from('proposals')
      .select(
        'id,status,created_at,responded_at,biodata_id,biodatas(id,biodata_type,birth_year,district,education)'
      )
      .order('created_at', {
        ascending: false,
      });

    query = received
      ? query.eq('receiver_id', user.id)
      : query.eq('sender_id', user.id);

    const { data } = await query;

    setItems(
      (data ?? []) as unknown as Proposal[]
    );

    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user, received]);

  const respond = async (
    id: number,
    status: 'accepted' | 'declined'
  ) => {
    if (!user) return;

    const { error } = await supabase
      .from('proposals')
      .update({
        status,
        responded_at:
          new Date().toISOString(),
      })
      .eq('id', id)
      .eq('receiver_id', user.id);

    if (!error) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status,
                responded_at:
                  new Date().toISOString(),
              }
            : p
        )
      );
    } else {
      alert(
        'আপডেট করা যায়নি: ' +
          error.message
      );
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

        <div className="text-center">

          <p className="mb-4">
            লগইন করুন।
          </p>

          <Link
            href="/login"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg"
          >
            লগইন
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[70vh] py-10 px-4">

      <div className="max-w-3xl mx-auto">

        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        <div className="flex items-center gap-3 mb-1">

          {received ? (
            <Inbox className="w-6 h-6 text-emerald-600" />
          ) : (
            <Send className="w-6 h-6 text-blue-600" />
          )}

          <h1 className="text-2xl font-bold">
            {received
              ? 'প্রাপ্ত প্রস্তাব'
              : 'পাঠানো প্রস্তাব'}
          </h1>

        </div>

        <p className="text-sm text-gray-500 mb-6">
          {received
            ? 'আপনার বায়োডাটায় আসা প্রস্তাবগুলো এখানে দেখুন।'
            : 'আপনি যেসব প্রস্তাব পাঠিয়েছেন সেগুলোর অবস্থা এখানে দেখুন।'}
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">
            লোড হচ্ছে...
          </p>
        ) : items.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">

            {received ? (
              <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            ) : (
              <Send className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            )}

            <p className="font-semibold text-gray-700">
              ০টি{' '}
              {received
                ? 'প্রাপ্ত'
                : 'পাঠানো'}{' '}
              প্রস্তাব
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {received
                ? 'এখনও কোনো প্রস্তাব আসেনি।'
                : 'আপনি এখনও কোনো প্রস্তাব পাঠাননি।'}
            </p>

            <Link
              href="/biodatas"
              className="inline-block mt-4 text-emerald-600 text-sm font-semibold"
            >
              বায়োডাটা খুঁজুন →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">

            {items.map((p) => {
              const b = p.biodatas;
              const st = statusLabel(
                p.status
              );

              const Icon = st.icon;

              return (
                <div
                  key={p.id}
                  className="bg-white border rounded-2xl p-5"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    <Link
                      href={`/biodatas/view?id=${p.biodata_id}`}
                      className="flex items-center gap-3"
                    >

                      <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center">
                        <UserRound className="w-5 h-5 text-purple-700" />
                      </div>

                      <div>

                        <p className="font-semibold text-gray-800">
                          {b?.biodata_type ===
                          'groom'
                            ? 'পাত্র'
                            : 'পাত্রী'}{' '}
                          · বয়স{' '}
                          {b
                            ? new Date().getFullYear() -
                              b.birth_year
                            : '—'}
                        </p>

                        <p className="text-xs text-gray-500">
                          {b?.district ||
                            '—'}{' '}
                          ·{' '}
                          {b?.education ||
                            '—'}
                        </p>

                      </div>

                    </Link>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {st.text}
                    </span>

                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t text-xs text-gray-500">

                    <span>
                      {new Date(
                        p.created_at
                      ).toLocaleDateString(
                        'bn-BD'
                      )}
                    </span>

                    {received &&
                      p.status ===
                        'pending' && (
                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              respond(
                                p.id,
                                'declined'
                              )
                            }
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600"
                          >
                            প্রত্যাখ্যান
                          </button>

                          <button
                            onClick={() =>
                              respond(
                                p.id,
                                'accepted'
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white"
                          >
                            প্রস্তাব গ্রহণ
                          </button>

                        </div>
                      )}

                    {p.status ===
                      'accepted' && (
                      <span className="text-emerald-700 font-medium">
                        উভয় পক্ষ সম্মত হলে কানেকশন কিনে অভিভাবকের যোগাযোগ তথ্য আনলক করা যাবে।
                      </span>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}
