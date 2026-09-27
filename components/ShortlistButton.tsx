'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

export default function ShortlistButton({ biodataId }: { biodataId: number }) {
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from('shortlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('biodata_id', biodataId)
        .maybeSingle();

      setShortlisted(!!data);
      setChecking(false);
    };
    check();
  }, [user, biodataId]);

  const toggleShortlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('পছন্দের তালিকায় রাখতে হলে প্রথমে লগইন করুন।');
      return;
    }

    setLoading(true);

    if (shortlisted) {
      await supabase.from('shortlists').delete().eq('user_id', user.id).eq('biodata_id', biodataId);
      setShortlisted(false);
    } else {
      await supabase.from('shortlists').insert([{ user_id: user.id, biodata_id: biodataId }]);
      setShortlisted(true);
    }

    setLoading(false);
  };

  if (checking) return null;

  return (
    <button
      onClick={toggleShortlist}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
        shortlisted
          ? 'bg-pink-50 border-pink-200 text-pink-600'
          : 'bg-white border-gray-200 text-gray-500 hover:border-pink-200 hover:text-pink-500'
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${shortlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
      {shortlisted ? 'পছন্দের তালিকায় আছে' : 'পছন্দের তালিকায় রাখুন'}
    </button>
  );
}
