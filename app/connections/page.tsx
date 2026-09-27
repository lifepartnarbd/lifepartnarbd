'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

export default function ConnectionsPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [balance, setBalance] = useState(0);
  const [method, setMethod] = useState('bKash');
  const [txid, setTxid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('user_connections')
      .select('balance')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setBalance(data?.balance ?? 0);
      });
  }, [user]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !txid.trim()) return;

    setSubmitting(true);

    const { error } = await supabase
      .from('connection_orders')
      .insert({
        user_id: user.id,
        plan_code: 'single',
        amount: siteConfig.contactUnlockFee,
        payment_method: method,
        transaction_id: txid.trim(),
        connections_granted: 1,
        status: 'pending',
      });

    setSubmitting(false);

    if (error) {
      alert(
        'অর্ডার জমা দেওয়া যায়নি। Supabase migration চালু আছে কি না দেখুন।'
      );
      return;
    }

    setTxid('');
    setDone(true);
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
    <div className="bg-gray-50 min-h-[70vh] py-10 px-4">

      <div className="max-w-4xl mx-auto">

        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-gray-500">
                  আপনার কানেকশন
                </p>

                <p className="text-4xl font-extrabold text-purple-800 mt-1">
                  {balance}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50">
                <Coins className="w-7 h-7 text-purple-700" />
              </div>

            </div>

            <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">

              <b>
                কানেকশন = ১টি যোগাযোগ আনলক।
              </b>

              <p className="text-xs mt-1">
                প্রস্তাব গ্রহণের পর কানেকশন ব্যবহার করে অভিভাবকের যোগাযোগ তথ্য দেখা যাবে।
              </p>

            </div>

          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <span className="inline-flex px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              Paid Connection
            </span>

            <h1 className="text-2xl font-bold mt-2">
              ১ কানেকশন — ৳{siteConfig.contactUnlockFee}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              বায়োডাটা তৈরি, দেখা ও প্রস্তাব গ্রহণ বিনামূল্যে। যোগাযোগের গোপন তথ্য দেখার জন্য এই কানেকশন ব্যবহার হবে।
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>✓ ১টি গ্রহণ করা প্রস্তাবের যোগাযোগ আনলক</li>
              <li>✓ অভিভাবকের নম্বর সুরক্ষিতভাবে দেখানো</li>
              <li>✓ সফল পেমেন্ট অ্যাডমিন যাচাই করবেন</li>
            </ul>

          </div>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-5">

          <h2 className="font-bold text-gray-900">
            ৳{siteConfig.contactUnlockFee} কানেকশন কিনুন
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            বর্তমানে manual verification রাখা হয়েছে—পেমেন্টের পর transaction ID দিন।
          </p>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">

            <p className="font-semibold text-amber-900">
              পেমেন্ট নির্দেশনা
            </p>

            <p className="mt-1 text-amber-800">
              আপনার নির্ধারিত bKash/Nagad নম্বরে ৳{siteConfig.contactUnlockFee} Send Money করুন এবং transaction ID নিচে দিন।
            </p>

            <p className="mt-2 font-bold text-amber-900">
              পেমেন্ট নম্বর: Admin সেটিংস থেকে দিন
            </p>

          </div>

          {done ? (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex gap-3">

              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />

              <div>

                <p className="font-semibold text-emerald-800">
                  পেমেন্ট রিকোয়েস্ট জমা হয়েছে
                </p>

                <p className="text-sm text-emerald-700 mt-1">
                  অ্যাডমিন যাচাই করার পর ১টি কানেকশন আপনার অ্যাকাউন্টে যোগ হবে।
                </p>

              </div>

            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mt-5 grid sm:grid-cols-3 gap-3"
            >

              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value)
                }
                className="border rounded-lg p-3 text-sm"
              >
                <option>bKash</option>
                <option>Nagad</option>
                <option>Bank</option>
              </select>

              <input
                value={txid}
                onChange={(e) =>
                  setTxid(e.target.value)
                }
                required
                placeholder="Transaction ID"
                className="border rounded-lg p-3 text-sm sm:col-span-2"
              />

              <button
                disabled={submitting}
                className="sm:col-span-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold"
              >
                {submitting
                  ? 'জমা হচ্ছে...'
                  : 'পেমেন্ট রিকোয়েস্ট পাঠান'}
              </button>

            </form>
          )}

        </div>

        <div className="mt-5 bg-white border rounded-2xl p-5 flex gap-3 text-sm text-gray-600">

          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />

          <p>
            প্ল্যাটফর্ম নীতিতে যোগাযোগের আগে উভয় পক্ষের সম্মতি ও প্রয়োজনীয় ক্ষেত্রে অভিভাবককে সম্পৃক্ত রাখার ব্যবস্থা রাখা হয়েছে। এটি ধর্মীয় ফতোয়া নয়; শরিয়াহ-সম্মত ব্যবহারের জন্য স্থানীয় আলেম/বিশ্বস্ত বিশেষজ্ঞের পরামর্শ নিন।
          </p>

        </div>

      </div>
    </div>
  );
}
