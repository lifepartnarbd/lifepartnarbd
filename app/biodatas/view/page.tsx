'use client';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

import {
  UserRound,
  MapPin,
  GraduationCap,
  Briefcase,
  Ruler,
  Palette,
  BookOpen,
  Users,
  Heart,
  ArrowLeft,
  UserRoundCheck,
} from 'lucide-react';

import ShortlistButton from '@/components/ShortlistButton';
import { useAuth } from '@/contexts/AuthContext';

type Biodata = {
  id: number;
  biodata_type: string;
  marital_status: string;
  birth_year: number;
  height: string;
  complexion: string;
  district: string;
  education: string;
  occupation: string;
  salat_punctuality: string;
  purdah_or_beard: string;
  family_background: string;
  partner_expectation: string;
  user_id: string;
  created_at: string;
};

function BiodataViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { user } = useAuth();

  const [biodata, setBiodata] =
    useState<Biodata | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  const [proposalSending, setProposalSending] =
    useState(false);

  const [proposalStatus, setProposalStatus] =
    useState<
      'pending' | 'accepted' | 'declined' | null
    >(null);

  const [connectionBalance, setConnectionBalance] =
    useState(0);

  const [contact, setContact] =
    useState<string | null>(null);

  const [contactLoading, setContactLoading] =
    useState(false);

  useEffect(() => {
    const fetchBiodata = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('biodatas')
        .select(
          'id, user_id, biodata_type, marital_status, birth_year, height, complexion, district, education, occupation, salat_punctuality, purdah_or_beard, family_background, partner_expectation, created_at'
        )
        .eq('id', id)
        .eq('status', 'approved')
        .eq('is_verified', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBiodata(data as Biodata);
      }

      setLoading(false);
    };

    fetchBiodata();
  }, [id]);

  useEffect(() => {
    const loadRelationship = async () => {
      if (!user || !biodata) {
        setProposalStatus(null);
        setConnectionBalance(0);
        return;
      }

      const [
        { data: proposal },
        { data: balanceRow },
      ] = await Promise.all([
        supabase
          .from('proposals')
          .select('status')
          .eq('sender_id', user.id)
          .eq('biodata_id', biodata.id)
          .maybeSingle(),

        supabase
          .from('user_connections')
          .select('balance')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      setProposalStatus(
        (proposal?.status as
          | 'pending'
          | 'accepted'
          | 'declined'
          | null) ?? null
      );

      setConnectionBalance(
        balanceRow?.balance ?? 0
      );
    };

    loadRelationship();
  }, [user, biodata]);

  const sendProposal = async () => {
    if (!user || !biodata) {
      alert('প্রস্তাব পাঠাতে লগইন করুন।');
      return;
    }

    if (biodata.user_id === user.id) {
      alert(
        'নিজের বায়োডাটায় প্রস্তাব পাঠানো যাবে না।'
      );
      return;
    }

    setProposalSending(true);

    const { data: existing } = await supabase
      .from('proposals')
      .select('id,status')
      .eq('sender_id', user.id)
      .eq('biodata_id', biodata.id)
      .maybeSingle();

    let error = null;

    if (existing?.status === 'accepted') {
      setProposalStatus('accepted');
    } else if (existing?.status === 'pending') {
      setProposalStatus('pending');
    } else if (existing?.status === 'declined') {
      const result = await supabase
        .from('proposals')
        .update({
          status: 'pending',
          responded_at: null,
        })
        .eq('id', existing.id)
        .eq('sender_id', user.id);

      error = result.error;

      if (!error) {
        setProposalStatus('pending');
      }
    } else {
      const result = await supabase
        .from('proposals')
        .insert({
          sender_id: user.id,
          receiver_id: biodata.user_id,
          biodata_id: biodata.id,
          status: 'pending',
        });

      error = result.error;

      if (!error) {
        setProposalStatus('pending');
      }
    }

    setProposalSending(false);

    if (error) {
      alert(
        'প্রস্তাব পাঠানো যায়নি: ' +
          error.message
      );
    }
  };

  const unlockContact = async () => {
    if (!user || !biodata) {
      alert(
        'যোগাযোগের তথ্য দেখতে লগইন করুন।'
      );
      return;
    }

    setContactLoading(true);

    const { data, error } =
      await supabase.rpc(
        'unlock_guardian_contact',
        {
          p_biodata_id: biodata.id,
        }
      );

    setContactLoading(false);

    if (error) {
      alert(
        error.message ||
          'কানেকশন ব্যবহার করা যায়নি।'
      );
      return;
    }

    if (data) {
      setContact(data as string);

      setConnectionBalance(
        (prev) => Math.max(0, prev - 1)
      );
    } else {
      alert(
        'প্রথমে প্রস্তাব পাঠিয়ে অপর পক্ষের সম্মতি নিন এবং ১টি কানেকশন ব্যবহার করুন।'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (notFound || !biodata) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">

        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">

          <UserRound className="w-12 h-12 text-gray-300 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900">
            বায়োডাটা পাওয়া যায়নি
          </h2>

          <p className="text-sm text-gray-600 mt-2 mb-6">
            এই বায়োডাটাটি খুঁজে পাওয়া যায়নি অথবা এখনো অনুমোদিত হয়নি।
          </p>

          <Link
            href="/biodatas"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-6 rounded-lg text-sm font-medium transition"
          >
            লিস্টে ফিরে যান
          </Link>

        </div>
      </div>
    );
  }

  const currentYear =
    new Date().getFullYear();

  const infoRows = [
    {
      icon: Ruler,
      label: 'উচ্চতা',
      value: biodata.height,
    },

    {
      icon: Palette,
      label: 'গায়ের রং',
      value: biodata.complexion,
    },

    {
      icon: MapPin,
      label: 'স্থায়ী জেলা',
      value: biodata.district,
    },

    {
      icon: GraduationCap,
      label: 'শিক্ষাগত যোগ্যতা',
      value: biodata.education,
    },

    {
      icon: Briefcase,
      label: 'পেশা',
      value: biodata.occupation,
    },

    {
      icon: BookOpen,
      label: 'নামাজ',
      value: biodata.salat_punctuality,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-4">

          <Link
            href="/biodatas"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            লিস্টে ফিরে যান
          </Link>

          <ShortlistButton biodataId={biodata.id} />

        </div>

        <div
          className={`rounded-2xl p-6 mb-5 text-white ${
            biodata.biodata_type === 'groom'
              ? 'bg-gradient-to-br from-teal-800 to-teal-900'
              : 'bg-gradient-to-br from-fuchsia-700 to-purple-900'
          }`}
        >

          <div className="flex items-center gap-4">

            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <UserRound className="w-11 h-11 text-white" />
            </div>

            <div>

              <div className="flex items-center gap-2 mb-1">

                <span className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full">
                  {biodata.biodata_type === 'groom'
                    ? 'পাত্র'
                    : 'পাত্রী'}
                </span>

                <span className="text-xs flex items-center gap-1 text-emerald-300">
                  <UserRoundCheck className="w-3.5 h-3.5" />
                  ভেরিফাইড
                </span>

              </div>

              <h1 className="text-xl font-bold">
                বয়স:{' '}
                {currentYear -
                  biodata.birth_year}{' '}
                বছর
              </h1>

              <p className="text-sm opacity-80">
                {biodata.marital_status}
              </p>

            </div>
          </div>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">

          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            মৌলিক তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {infoRows.map((row) => {
              const Icon = row.icon;

              return (
                <div
                  key={row.label}
                  className="flex items-start gap-3"
                >

                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      {row.label}
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {row.value}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">

          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            দ্বীনদারি
          </h2>

          <p className="text-sm text-gray-700">
            {biodata.purdah_or_beard}
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">

          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-600" />

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              পারিবারিক পরিচিতি
            </h2>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {biodata.family_background}
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">

          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-fuchsia-600" />

            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              জীবনসঙ্গী প্রত্যাশা
            </h2>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {biodata.partner_expectation}
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <p className="text-sm font-bold text-gray-900">
                পরবর্তী ধাপ
              </p>

              <p className="text-xs text-gray-500 mt-1">
                প্রথমে সম্মানজনকভাবে প্রস্তাব পাঠান। অপর পক্ষ গ্রহণ করলে ১টি Paid Connection ব্যবহার করে অভিভাবকের যোগাযোগ তথ্য দেখা যাবে।
              </p>

            </div>

            {user?.id !== biodata.user_id && (
              <div className="shrink-0">

                {proposalStatus === 'accepted' ? (
                  <span className="inline-flex px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                    প্রস্তাব গ্রহণ করা হয়েছে ✓
                  </span>
                ) : proposalStatus === 'pending' ? (
                  <span className="inline-flex px-4 py-2.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold">
                    প্রস্তাব অপেক্ষমাণ
                  </span>
                ) : (
                  <button
                    onClick={sendProposal}
                    disabled={proposalSending}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                  >
                    {proposalSending
                      ? 'পাঠানো হচ্ছে...'
                      : proposalStatus === 'declined'
                      ? 'আবার প্রস্তাব পাঠান'
                      : 'প্রস্তাব পাঠান'}
                  </button>
                )}

              </div>
            )}

          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">

            {contact ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">

                <p className="text-xs text-emerald-700">
                  অভিভাবকের যোগাযোগ
                </p>

                <p className="text-lg font-bold text-emerald-900 mt-1">
                  {contact}
                </p>

              </div>
            ) : proposalStatus === 'accepted' ? (
              connectionBalance > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>

                    <p className="text-sm text-amber-900 font-medium">
                      🔒 যোগাযোগের তথ্য সুরক্ষিত
                    </p>

                    <p className="text-xs text-amber-700 mt-1">
                      আপনার {connectionBalance}টি কানেকশন আছে। ১টি কানেকশন ব্যবহার করে অভিভাবকের যোগাযোগ আনলক করুন।
                    </p>

                  </div>

                  <button
                    onClick={unlockContact}
                    disabled={contactLoading}
                    className="shrink-0 border border-amber-300 bg-white text-amber-900 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {contactLoading
                      ? 'চেক হচ্ছে...'
                      : '১ কানেকশন দিয়ে আনলক'}
                  </button>

                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>

                    <p className="text-sm text-purple-900 font-medium">
                      ✅ প্রস্তাব গ্রহণ করা হয়েছে
                    </p>

                    <p className="text-xs text-purple-700 mt-1">
                      যোগাযোগের তথ্য দেখতে আগে ১টি Paid Connection কিনতে হবে। ১ কানেকশন = ৳১০০।
                    </p>

                  </div>

                  <Link
                    href="/connections"
                    className="shrink-0 bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    কানেকশন কিনুন
                  </Link>

                </div>
              )
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                <p className="text-sm text-gray-700 font-medium">
                  🔒 যোগাযোগের তথ্য এখনো উন্মুক্ত নয়
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  প্রথমে প্রস্তাব পাঠান এবং অপর পক্ষ গ্রহণ করলে Paid Connection ব্যবহার করে অভিভাবকের যোগাযোগ দেখতে পারবেন।
                </p>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function BiodataViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
          লোড হচ্ছে...
        </div>
      }
    >
      <BiodataViewInner />
    </Suspense>
  );
}
