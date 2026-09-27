'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send } from 'lucide-react';

type Report = {
  id: number;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  user_id: string;
};

export default function AdminSupportPage() {
  const [rows, setRows] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('support_reports')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    setRows((data ?? []) as Report[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sendReply = async (id: number) => {
    const text = (reply[id] || '').trim();

    if (!text) return;

    setBusy(id);

    const { error } = await supabase
      .from('support_reports')
      .update({
        admin_reply: text,
        status: 'replied',
        replied_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                admin_reply: text,
                status: 'replied',
              }
            : r
        )
      );

      setReply((prev) => ({
        ...prev,
        [id]: '',
      }));
    }

    setBusy(null);
  };

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl font-bold text-white mb-1">
        সাপোর্ট / রিপোর্ট
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        ইউজারের রিপোর্ট দেখুন এবং রিপ্লাই দিন।
      </p>

      {loading ? (
        <p className="text-slate-500">
          লোড হচ্ছে...
        </p>
      ) : rows.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
          কোনো রিপোর্ট নেই।
        </div>
      ) : (
        <div className="space-y-4">

          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >

              <div className="flex justify-between gap-3">

                <div>
                  <h2 className="font-semibold text-white">
                    {r.subject}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    User: {r.user_id} ·{' '}
                    {new Date(
                      r.created_at
                    ).toLocaleString('bn-BD')}
                  </p>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                  {r.status}
                </span>

              </div>

              <div className="mt-4 bg-slate-950 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap">
                {r.message}
              </div>

              {r.admin_reply && (
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-300 whitespace-pre-wrap">
                  <b>বর্তমান রিপ্লাই:</b>
                  <br />
                  {r.admin_reply}
                </div>
              )}

              <div className="mt-4 flex gap-2">

                <textarea
                  value={reply[r.id] || ''}
                  onChange={(e) =>
                    setReply((prev) => ({
                      ...prev,
                      [r.id]: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="ইউজারকে রিপ্লাই লিখুন..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white"
                />

                <button
                  onClick={() => sendReply(r.id)}
                  disabled={busy === r.id}
                  className="self-end bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {busy === r.id ? '...' : 'রিপ্লাই'}
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
