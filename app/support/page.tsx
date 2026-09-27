'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Flag,
  Send,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Report = {
  id: number;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
};

export default function SupportPage() {
  const { user, loading } = useAuth();

  const [subject, setSubject] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [sending, setSending] =
    useState(false);

  const [done, setDone] =
    useState(false);

  const [reports, setReports] =
    useState<Report[]>([]);

  const [reportsLoading, setReportsLoading] =
    useState(false);

  const loadReports = async () => {
    if (!user) {
      setReports([]);
      return;
    }

    setReportsLoading(true);

    const { data, error } =
      await supabase
        .from('support_reports')
        .select(
          'id,subject,message,status,admin_reply,replied_at,created_at'
        )
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        });

    if (!error) {
      setReports(
        (data ?? []) as Report[]
      );
    }

    setReportsLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (
      !user ||
      !subject.trim() ||
      !message.trim()
    ) {
      return;
    }

    setSending(true);

    const { error } =
      await supabase
        .from('support_reports')
        .insert({
          user_id: user.id,
          subject: subject.trim(),
          message: message.trim(),
          status: 'open',
        });

    setSending(false);

    if (error) {
      alert(
        'রিপোর্ট পাঠানো যায়নি। Supabase migration চালু আছে কি না দেখুন।'
      );
      return;
    }

    setSubject('');
    setMessage('');
    setDone(true);

    await loadReports();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">

        <div className="max-w-md w-full bg-white p-8 rounded-2xl border text-center">

          <Flag className="w-10 h-10 text-purple-600 mx-auto mb-3" />

          <h1 className="text-xl font-bold">
            লগইন করা প্রয়োজন
          </h1>

          <p className="text-sm text-gray-500 mt-2 mb-5">
            সাপোর্ট/রিপোর্ট পাঠাতে আগে লগইন করুন।
          </p>

          <Link
            href="/login"
            className="inline-block bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm"
          >
            লগইন করুন
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[70vh] py-10 px-4">

      <div className="max-w-2xl mx-auto">

        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">

          <div className="flex items-center gap-3 mb-2">

            <div className="p-3 rounded-xl bg-purple-50">
              <Flag className="w-5 h-5 text-purple-700" />
            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                সাপোর্ট / রিপোর্ট
              </h1>

              <p className="text-xs text-gray-500">
                সমস্যা, অভিযোগ বা সহায়তার প্রয়োজন হলে লিখুন।
              </p>

            </div>

          </div>

          {done ? (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">

              <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />

              <h2 className="font-bold text-emerald-800">
                রিপোর্ট জমা হয়েছে
              </h2>

              <p className="text-sm text-emerald-700 mt-1">
                অ্যাডমিন আপনার রিপোর্ট দেখে উত্তর দিলে নিচে দেখা যাবে।
              </p>

              <button
                onClick={() =>
                  setDone(false)
                }
                className="mt-4 text-sm font-semibold text-emerald-700 hover:underline"
              >
                আরেকটি রিপোর্ট পাঠান
              </button>

            </div>
          ) : (
            <form
              onSubmit={submit}
              className="space-y-4 mt-6"
            >

              <div>

                <label className="block text-xs font-medium text-gray-700 mb-1">
                  বিষয়
                </label>

                <input
                  value={subject}
                  onChange={(e) =>
                    setSubject(
                      e.target.value
                    )
                  }
                  required
                  className="w-full border rounded-lg p-3 text-sm"
                  placeholder="যেমন: পেমেন্ট সমস্যা / ভুল প্রোফাইল / অন্য সমস্যা"
                />

              </div>

              <div>

                <label className="block text-xs font-medium text-gray-700 mb-1">
                  সমস্যার বিস্তারিত
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  required
                  rows={6}
                  className="w-full border rounded-lg p-3 text-sm"
                  placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
                />

              </div>

              <button
                disabled={sending}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />

                {sending
                  ? 'পাঠানো হচ্ছে...'
                  : 'রিপোর্ট সাবমিট করুন'}
              </button>

            </form>
          )}

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-5">

          <h2 className="font-bold text-gray-900">
            আপনার রিপোর্ট ও অ্যাডমিনের রিপ্লাই
          </h2>

          <div className="mt-4 space-y-3">

            {reportsLoading ? (
              <p className="text-sm text-gray-500">
                রিপোর্ট লোড হচ্ছে...
              </p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-gray-500">
                এখনও কোনো রিপোর্ট নেই।
              </p>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-xl p-4"
                >

                  <div className="flex justify-between gap-3">

                    <p className="font-semibold text-sm">
                      {r.subject}
                    </p>

                    <span className="text-xs text-gray-500">
                      {r.status}
                    </span>

                  </div>

                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                    {r.message}
                  </p>

                  {r.admin_reply && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-emerald-800">
                      <b>অ্যাডমিন:</b>{' '}
                      {r.admin_reply}
                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
