'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

export default function AdminDashboardPage() {
  const { language } = useAdminLanguage();

  const [stats, setStats] = useState({
    users: 0,
    total: 0,
    pending: 0,
    approved: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        usersRes,
        totalRes,
        pendingRes,
        approvedRes,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('biodatas')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('biodatas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),

        supabase
          .from('biodatas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved'),
      ]);

      setStats({
        users: usersRes.count ?? 0,
        total: totalRes.count ?? 0,
        pending: pendingRes.count ?? 0,
        approved: approvedRes.count ?? 0,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: language === 'bn' ? 'মোট ইউজার' : 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'from-blue-500 to-blue-700',
    },
    {
      label: language === 'bn' ? 'মোট বায়োডাটা' : 'Total Biodata',
      value: stats.total,
      icon: FileText,
      color: 'from-fuchsia-600 to-purple-700',
    },
    {
      label: language === 'bn'
        ? 'পেন্ডিং রিকোয়েস্ট'
        : 'Pending Requests',
      value: stats.pending,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: language === 'bn' ? 'অনুমোদিত' : 'Approved',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-700',
    },
  ];

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl font-bold text-white mb-1">
        {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        {language === 'bn'
          ? 'সাইটের সার্বিক পরিসংখ্যান'
          : 'Overall site statistics'}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="text-2xl font-bold text-white">
                {loading ? '...' : card.value}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                {card.label}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
