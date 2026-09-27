'use client';

import Link from 'next/link';

import {
  ArrowLeft,
  Ban,
} from 'lucide-react';

export default function IgnoreList() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">

      <Link
        href="/account"
        className="inline-flex gap-1 items-center text-sm text-gray-500 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        ড্যাশবোর্ড
      </Link>

      <h1 className="text-2xl font-bold flex gap-2 items-center">
        <Ban className="text-red-500" />
        অপছন্দের তালিকা
      </h1>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        আপনি যাদের অপছন্দ করেছেন তাদের তালিকা।
      </p>

      <div className="bg-white border rounded-2xl p-10 text-center">

        <p className="font-semibold text-gray-700">
          ০টি
        </p>

        <p className="text-xs text-gray-500 mt-1">
          এখনও কোনো অপছন্দের তালিকা তৈরি হয়নি।
        </p>

      </div>

    </div>
  );
}
