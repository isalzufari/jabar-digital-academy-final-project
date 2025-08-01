'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Kiri - Logo */}
      <div className="text-xl font-bold text-indigo-600">
        <Link href="/">MyBlog</Link>
      </div>

      {/* Tengah - NavLinks */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link href="/" className="hover:text-indigo-600">
          Home
        </Link>
      </div>

      {/* Kanan - User Info */}
      <div>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hi, <strong>{session.user?.name || session.user?.email}</strong>
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
