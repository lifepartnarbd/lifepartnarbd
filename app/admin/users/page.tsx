'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserCircle2 } from 'lucide-react';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';

type UserRow = {
  id: string;
  full_name: string;
  gender: string;
  custom_id: string;
  role: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const { language } = useAdminLanguage();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, full_name, gender, custom_id, role, created_at'
        )
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(data as UserRow[]);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 md:p-8">

      <h1 className="text-2xl font-bold text-white mb-1">
        {language === 'bn' ? 'ইউজার তালিকা' : 'Users'}
      </h1>

      <p className="text-sm text-slate-400 mb-6">
        {language === 'bn'
          ? `মোট ${users.length} জন রেজিস্টার্ড ইউজার`
          : `${users.length} registered users`}
      </p>

      {loading ? (
        <p className="text-sm text-slate-500">
          {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
        </p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">

              <tr>
                <th className="text-left px-4 py-3">
                  ID
                </th>

                <th className="text-left px-4 py-3">
                  {language === 'bn' ? 'নাম' : 'Name'}
                </th>

                <th className="text-left px-4 py-3">
                  {language === 'bn' ? 'লিঙ্গ' : 'Gender'}
                </th>

                <th className="text-left px-4 py-3">
                  {language === 'bn' ? 'ভূমিকা' : 'Role'}
                </th>

                <th className="text-left px-4 py-3">
                  {language === 'bn'
                    ? 'জয়েন তারিখ'
                    : 'Joined'}
                </th>
              </tr>

            </thead>

            <tbody>

              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-slate-800 text-slate-300"
                >

                  <td className="px-4 py-3 font-mono text-fuchsia-400">
                    {u.custom_id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4 text-slate-500" />
                      {u.full_name || '—'}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {u.gender === 'male'
                      ? language === 'bn'
                        ? 'পুরুষ'
                        : 'Male'
                      : language === 'bn'
                        ? 'মহিলা'
                        : 'Female'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-fuchsia-500/20 text-fuchsia-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.role === 'admin'
                        ? language === 'bn'
                          ? 'অ্যাডমিন'
                          : 'Admin'
                        : language === 'bn'
                          ? 'সাধারণ ইউজার'
                          : 'User'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {new Date(u.created_at).toLocaleDateString(
                      language === 'bn' ? 'bn-BD' : 'en-US'
                    )}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
