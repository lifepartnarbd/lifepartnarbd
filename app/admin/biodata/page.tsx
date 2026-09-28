'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
} from 'lucide-react';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

type Biodata = {
  id: number;
  biodata_type: string;
  marital_status: string;
  birth_year: number;
  height: string;
  complexion: string;
  education: string;
  occupation: string;
  district: string;
  salat_punctuality: string;
  purdah_or_beard: string;
  family_background: string;
  partner_expectation: string;
  guardian_relation: string;
  guardian_phone: string;
  status: string;
  is_verified: boolean;
  created_at: string;
};

export default function AdminBiodataPage() {
  const { language } = useAdminLanguage();

  const [biodatas, setBiodatas] = useState<Biodata[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] =
    useState<'pending' | 'approved' | 'rejected'>('pending');

  const [actionId, setActionId] =
    useState<number | null>(null);

  const fetchBiodatas = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('biodatas')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBiodatas(data as Biodata[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBiodatas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAction = async (
    id: number,
    newStatus: 'approved' | 'rejected'
  ) => {
    setActionId(id);

    const { error } = await supabase
      .from('biodatas')
      .update({
        status: newStatus,
        is_verified: newStatus === 'approved',
      })
      .eq('id', id);

    if (!error) {
      setBiodatas((prev) =>
        prev.filter((b) => b.id !== id)
      );
    } else {
      alert(
        language === 'bn'
          ? 'আপডেট করতে সমস্যা হয়েছে: ' + error.message
          : 'Update failed: ' + error.message
      );
    }

    setActionId(null);
  };

  const tabLabel = {
    pending: language === 'bn' ? 'পেন্ডিং' : 'Pending',
    approved: language === 'bn' ? 'অনুমোদিত' : 'Approved',
    rejected: language === 'bn' ? 'বাতিল' : 'Rejected',
  };

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl font-bold text-white mb-1">
        {language === 'bn'
          ? 'বায়োডাটা রিকোয়েস্ট'
          : 'Biodata Requests'}
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        {language === 'bn'
          ? 'নতুন বায়োডাটা যাচাই করে অনুমোদন/বাতিল করুন'
          : 'Review and approve or reject biodata'}
      </p>

      <div className="flex gap-2 mb-6">

        {(['pending', 'approved', 'rejected'] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tabLabel[tab]}
            </button>
          )
        )}

      </div>

      {loading ? (
        <p className="text-sm text-slate-500">
          {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
        </p>
      ) : biodatas.length === 0 ? (
        <p className="text-sm text-slate-500">
          {language === 'bn'
            ? 'এই তালিকায় কোনো বায়োডাটা নেই।'
            : 'No biodata found in this list.'}
        </p>
      ) : (
        <div className="space-y-4">

          {biodatas.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >

              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">

                <div>

                  <span className="text-xs font-semibold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded-full">
                    {b.biodata_type === 'groom'
                      ? language === 'bn'
                        ? 'পাত্র'
                        : 'Groom'
                      : language === 'bn'
                        ? 'পাত্রী'
                        : 'Bride'}
                  </span>

                  <span className="text-xs text-slate-500 ml-2 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />

                    {new Date(
                      b.created_at
                    ).toLocaleDateString(
                      language === 'bn'
                        ? 'bn-BD'
                        : 'en-US'
                    )}
                  </span>

                </div>

                {filter === 'pending' && (
                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleAction(b.id, 'approved')
                      }
                      disabled={actionId === b.id}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />

                      {language === 'bn'
                        ? 'অনুমোদন'
                        : 'Approve'}
                    </button>

                    <button
                      onClick={() =>
                        handleAction(b.id, 'rejected')
                      }
                      disabled={actionId === b.id}
                      className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />

                      {language === 'bn'
                        ? 'বাতিল'
                        : 'Reject'}
                    </button>

                  </div>
                )}

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-300 mb-3">

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'জন্ম সাল'
                      : 'Birth Year'}
                  </span>
                  {b.birth_year}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'উচ্চতা'
                      : 'Height'}
                  </span>
                  {b.height}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'গায়ের রং'
                      : 'Complexion'}
                  </span>
                  {b.complexion}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'জেলা'
                      : 'District'}
                  </span>
                  {b.district}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'শিক্ষা'
                      : 'Education'}
                  </span>
                  {b.education}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'পেশা'
                      : 'Occupation'}
                  </span>
                  {b.occupation}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'বৈবাহিক অবস্থা'
                      : 'Marital Status'}
                  </span>
                  {b.marital_status}
                </div>

                <div>
                  <span className="text-slate-500 text-xs block">
                    {language === 'bn'
                      ? 'নামাজ'
                      : 'Prayer'}
                  </span>
                  {b.salat_punctuality}
                </div>

              </div>

              <div className="text-sm text-slate-300 mb-3">
                <span className="text-slate-500 text-xs block">
                  {language === 'bn'
                    ? 'পর্দা/দাড়ি'
                    : 'Purdah/Beard'}
                </span>

                {b.purdah_or_beard}
              </div>

              <div className="text-sm text-slate-300 mb-3">
                <span className="text-slate-500 text-xs block">
                  {language === 'bn'
                    ? 'পারিবারিক পরিচিতি'
                    : 'Family Background'}
                </span>

                {b.family_background}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center gap-2 text-sm">

                <Phone className="w-4 h-4 text-amber-400" />

                <span className="text-amber-300 font-medium">
                  {language === 'bn'
                    ? 'অভিভাবক'
                    : 'Guardian'}{' '}
                  ({b.guardian_relation}):{' '}
                  {b.guardian_phone}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
