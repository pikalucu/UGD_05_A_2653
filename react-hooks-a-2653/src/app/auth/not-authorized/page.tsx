'use client';

import Link from 'next/link';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Anda belum login</h1>
        <p className="text-gray-500 mb-6">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
        <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg inline-block">
          Login
        </Link>
      </div>
    </div>
  );
}