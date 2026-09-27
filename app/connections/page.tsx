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
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const CONNECTION_PRICE = 50;

const PAYMENT_METHODS = {
  bKash: {
    name: 'bKash',
    number: '01710195926',
    type: 'Personal',
  },
  Nagad: {
    name: 'Nagad',
    number: '01870779640',
    type: 'Personal',
  },
  Rocket: {
    name: 'Rocket',
    number: '01715569505',
    type: 'Personal',
  },
} as const;

type PaymentMethod = keyof typeof PAYMENT_METHODS;

export default function ConnectionsPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [balance, setBalance] = useState(0);

  const [method, setMethod] = useState<PaymentMethod | ''>('');

  const [txid, setTxid] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const [done, setDone] = useState(false);

  const [methodOpen, setMethodOpen] = useState(false);

  const [copied, setCopied] = useState(false);

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

  const selectedPayment = method
    ? PAYMENT_METHODS[method]
    : null;

  const selectPaymentMethod = (
    selectedMethod: PaymentMethod
  ) => {
    setMethod(selectedMethod);
    setMethodOpen(false);
    setCopied(false);
  };

  const copyNumber = async () => {
    if (!selectedPayment) return;

    try {
      await navigator.clipboard.writeText(
        selectedPayment.number
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert('নম্বর কপি করা যায়নি।');
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!method) {
      alert('অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন।');
      return;
    }

    if (!txid.trim()) {
      alert('অনুগ্রহ করে Transaction ID দিন।');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('connection_orders')
      .insert({
        user_id: user.id,
        plan_code: 'single',
        amount: CONNECTION_PRICE,
        payment_method: method,
        transaction_id: txid.trim(),
        connections_granted: 1,
        status: 'pending',
      });

    setSubmitting(false);

    if (error) {
      console.error(error);

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

        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        {/* Top Cards */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Balance */}
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
                প্রস্তাব গ্রহণের পর কানেকশন ব্যবহার করে
                অভিভাবকের যোগাযোগ তথ্য দেখা যাবে।
              </p>

            </div>

          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">

            <span className="inline-flex px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
              Paid Connection
            </span>

            <h1 className="text-2xl font-bold mt-2">
              ১ কানেকশন — ৳{CONNECTION_PRICE}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              বায়োডাটা তৈরি, দেখা ও প্রস্তাব গ্রহণ বিনামূল্যে।
              যোগাযোগের গোপন তথ্য দেখার জন্য এই কানেকশন ব্যবহার হবে।
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>✓ ১টি গ্রহণ করা প্রস্তাবের যোগাযোগ আনলক</li>
              <li>✓ অভিভাবকের নম্বর সুরক্ষিতভাবে দেখানো</li>
              <li>✓ সফল পেমেন্ট অ্যাডমিন যাচাই করবেন</li>
            </ul>

          </div>

        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-5">

          <h2 className="font-bold text-gray-900">
            ৳{CONNECTION_PRICE} কানেকশন কিনুন
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            বর্তমানে manual verification রাখা হয়েছে—
            পেমেন্টের পর Transaction ID দিন।
          </p>

          {/* Payment Instruction */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">

            <p className="font-semibold text-amber-900">
              পেমেন্ট নির্দেশনা
            </p>

            {!selectedPayment ? (
              <>
                <p className="mt-1 text-amber-800">
                  প্রথমে একটি Payment Method নির্বাচন করুন।
                  তারপর প্রদর্শিত নম্বরে ৳{CONNECTION_PRICE}
                  Send Money করুন।
                </p>

                <p className="mt-2 font-bold text-amber-900">
                  Payment Method নির্বাচন করুন
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 text-amber-800">
                  নিচের {selectedPayment.name} নম্বরে
                  ৳{CONNECTION_PRICE} Send Money করুন এবং
                  Transaction ID নিচে দিন।
                </p>

                <p className="mt-2 font-bold text-amber-900">
                  পেমেন্ট নম্বর: {selectedPayment.number}
                </p>
              </>
            )}

          </div>

          {/* Success */}
          {done ? (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex gap-3">

              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />

              <div>

                <p className="font-semibold text-emerald-800">
                  পেমেন্ট রিকোয়েস্ট জমা হয়েছে
                </p>

                <p className="text-sm text-emerald-700 mt-1">
                  অ্যাডমিন যাচাই করার পর ১টি কানেকশন
                  আপনার অ্যাকাউন্টে যোগ হবে।
                </p>

              </div>

            </div>
          ) : (

            <form
              onSubmit={submit}
              className="mt-5 space-y-4"
            >

              {/* Payment Method */}
              <div className="relative">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setMethodOpen((prev) => !prev)
                  }
                  className="w-full flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >

                  <span
                    className={
                      method
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500'
                    }
                  >
                    {method
                      ? `${PAYMENT_METHODS[method].name} ✓`
                      : 'Select Payment Method'}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      methodOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />

                </button>

                {/* Dropdown */}
                {methodOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

                    {(
                      Object.keys(
                        PAYMENT_METHODS
                      ) as PaymentMethod[]
                    ).map((paymentMethod) => (

                      <button
                        key={paymentMethod}
                        type="button"
                        onClick={() =>
                          selectPaymentMethod(
                            paymentMethod
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-emerald-50 transition"
                      >

                        <span className="font-medium text-gray-800">
                          {PAYMENT_METHODS[paymentMethod].name}
                        </span>

                        {method === paymentMethod && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}

                      </button>

                    ))}

                  </div>
                )}

              </div>

              {/* Selected Payment Details */}
              {selectedPayment && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm font-bold text-emerald-900">
                        {selectedPayment.name}
                      </p>

                      <p className="text-xs text-emerald-700 mt-1">
                        Personal
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 bg-white rounded-lg border border-emerald-100 p-3">

                    <span className="text-lg font-bold tracking-wide text-gray-900">
                      {selectedPayment.number}
                    </span>

                    <button
                      type="button"
                      onClick={copyNumber}
                      className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                    >

                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          কপি হয়েছে
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          নম্বর কপি
                        </>
                      )}

                    </button>

                  </div>

                </div>
              )}

              {/* Transaction ID */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction ID
                </label>

                <input
                  value={txid}
                  onChange={(e) =>
                    setTxid(e.target.value)
                  }
                  required
                  placeholder="Transaction ID লিখুন"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting || !method
                }
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition"
              >
                {submitting
                  ? 'জমা হচ্ছে...'
                  : 'পেমেন্ট রিকোয়েস্ট পাঠান'}
              </button>

            </form>
          )}

        </div>

        {/* Security Notice */}
        <div className="mt-5 bg-white border rounded-2xl p-5 flex gap-3 text-sm text-gray-600">

          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />

          <p>
            প্ল্যাটফর্ম নীতিতে যোগাযোগের আগে উভয় পক্ষের
            সম্মতি ও প্রয়োজনীয় ক্ষেত্রে অভিভাবককে সম্পৃক্ত
            রাখার ব্যবস্থা রাখা হয়েছে। এটি ধর্মীয় ফতোয়া নয়;
            শরিয়াহ-সম্মত ব্যবহারের জন্য স্থানীয় আলেম/বিশ্বস্ত
            বিশেষজ্ঞের পরামর্শ নিন।
          </p>

        </div>

      </div>
    </div>
  );
}v
