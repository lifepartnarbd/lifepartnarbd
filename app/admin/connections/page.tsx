'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2,
  XCircle,
  Coins,
} from 'lucide-react';

export default function AdminConnectionsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('connection_orders')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (
    id: number,
    status: 'approved' | 'rejected'
  ) => {
    setBusy(id);

    const { error } = await supabase.rpc(
      'review_connection_order',
      {
        p_order_id: id,
        p_status: status,
      }
    );

    if (error) {
      alert(error.message);
    } else {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
              }
            : r
        )
      );
    }

    setBusy(null);
  };

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl font-bold text-white mb-1">
        কানেকশন পেমেন্ট
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        ৳১০০ পেমেন্ট যাচাই করে কানেকশন অনুমোদন করুন।
      </p>

      {loading ? (
        <p className="text-slate-500">
          লোড হচ্ছে...
        </p>
      ) : rows.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
          কোনো পেমেন্ট রিকোয়েস্ট নেই।
        </div>
      ) : (
        <div className="space-y-3">

          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >

              <div>

                <p className="text-white font-semibold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  ৳{r.amount} · {r.connections_granted} কানেকশন
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {r.payment_method} · TX: {r.transaction_id}
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  {new Date(
                    r.created_at
                  ).toLocaleString('bn-BD')}
                </p>

              </div>

              {r.status === 'pending' ? (
                <div className="flex gap-2">

                  <button
                    disabled={busy === r.id}
                    onClick={() =>
                      action(r.id, 'approved')
                    }
                    className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs flex gap-1 items-center"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    অনুমোদন
                  </button>

                  <button
                    disabled={busy === r.id}
                    onClick={() =>
                      action(r.id, 'rejected')
                    }
                    className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-xs flex gap-1 items-center"
                  >
                    <XCircle className="w-4 h-4" />
                    বাতিল
                  </button>

                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  {r.status}
                </span>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
