'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

import {
  Menu,
  X,
  UserCircle2,
  Heart,
} from 'lucide-react';

/*
|--------------------------------------------------------------------------
| Inline Logo
|--------------------------------------------------------------------------
| আলাদা image/file লাগবে না।
| SVG সরাসরি Navbar-এর ভিতরে render হবে।
*/
function SiteLogo({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 group">

      {/* Custom inline SVG logo */}
      <div
        className={`relative flex-shrink-0 ${
          mobile ? 'w-10 h-10' : 'w-11 h-11'
        }`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-label="Life Partner BD logo"
          role="img"
        >
          <defs>
            <linearGradient
              id="lpLogoGradient"
              x1="7"
              y1="8"
              x2="58"
              y2="58"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#059669" />
              <stop offset="52%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>

            <linearGradient
              id="lpHeartGradient"
              x1="23"
              y1="22"
              x2="43"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Outer rounded emblem */}
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="17"
            fill="white"
          />

          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="17"
            stroke="url(#lpLogoGradient)"
            strokeWidth="3"
          />

          {/* Two soft connection arcs */}
          <path
            d="M17.5 30.5C17.5 23.9 22.4 18.5 28.5 18.5C31.4 18.5 34 19.7 36 21.7"
            stroke="url(#lpLogoGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          <path
            d="M46.5 33.5C46.5 40.1 41.6 45.5 35.5 45.5C32.6 45.5 30 44.3 28 42.3"
            stroke="url(#lpLogoGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Heart / partnership mark */}
          <path
            d="M32 43.5C31.65 43.2 22.4 36.25 20.25 32.15C18.1 28.05 20.15 23.6 24.55 23.15C27.15 22.9 29.45 24.25 32 27C34.55 24.25 36.85 22.9 39.45 23.15C43.85 23.6 45.9 28.05 43.75 32.15C41.6 36.25 32.35 43.2 32 43.5Z"
            fill="url(#lpHeartGradient)"
          />

          {/* Small white shine */}
          <path
            d="M24.8 27.3C26 25.9 28.05 26 29.45 27.05"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Site name */}
      <div className="leading-none">

        <div
          className="
            text-xl
            sm:text-2xl
            font-extrabold
            tracking-tight
            bg-gradient-to-r
            from-emerald-600
            via-teal-600
            to-purple-700
            bg-clip-text
            text-transparent
            transition
            duration-200
            group-hover:from-emerald-700
            group-hover:via-teal-700
            group-hover:to-purple-800
          "
        >
          Life Partner <span className="font-black">BD</span>
        </div>

        {!mobile && (
          <div className="text-[9px] sm:text-[10px] tracking-[0.18em] font-semibold text-gray-400 mt-1 uppercase">
            Halal Matrimony
          </div>
        )}

      </div>
    </div>
  );
}

export default function Navbar() {
  const {
    user,
    profile,
    signOut,
    loading,
  } = useAuth();

  const router = useRouter();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    await signOut();

    setMenuOpen(false);

    router.push('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between h-[72px] items-center">

          {/* =====================================================
              LOGO
          ====================================================== */}
          <div className="flex-shrink-0">

            <Link
              href="/"
              onClick={closeMenu}
              aria-label="Life Partner BD Home"
            >
              <SiteLogo />
            </Link>

          </div>


          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <div className="hidden md:flex items-center gap-7">

            <Link
              href="/"
              className="
                text-gray-700
                hover:text-emerald-600
                font-medium
                text-sm
                transition
                duration-200
              "
            >
              হোম
            </Link>

            <Link
              href="/biodatas"
              className="
                text-gray-700
                hover:text-emerald-600
                font-medium
                text-sm
                transition
                duration-200
              "
            >
              বায়োডাটা খুঁজুন
            </Link>

            <Link
              href="/terms"
              className="
                text-gray-700
                hover:text-emerald-600
                font-medium
                text-sm
                transition
                duration-200
              "
            >
              নির্দেশনা
            </Link>

            <Link
              href="/support"
              className="
                text-gray-700
                hover:text-emerald-600
                font-medium
                text-sm
                transition
                duration-200
              "
            >
              যোগাযোগ
            </Link>

          </div>


          {/* =====================================================
              DESKTOP USER AREA
          ====================================================== */}
          <div className="hidden md:flex items-center gap-3">

            {loading ? null : user ? (
              <>

                {/* User account */}
                <Link
                  href="/account"
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-700
                    hover:text-emerald-600
                    transition
                    duration-200
                    px-1
                  "
                >

                  <UserCircle2 className="w-5 h-5 text-emerald-600" />

                  <span className="font-semibold">
                    {profile?.custom_id ?? 'ইউজার'}
                  </span>

                </Link>


                {/* Create biodata */}
                <Link
                  href="/create-biodata"
                  className="
                    bg-gradient-to-r
                    from-emerald-600
                    to-teal-600
                    hover:from-emerald-700
                    hover:to-teal-700
                    text-white
                    text-sm
                    font-semibold
                    px-4
                    py-2.5
                    rounded-xl
                    transition
                    duration-200
                    shadow-sm
                    hover:shadow-md
                  "
                >
                  বায়োডাটা জমা দিন
                </Link>


                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="
                    text-sm
                    text-gray-600
                    hover:text-red-600
                    font-medium
                    px-2
                    py-2
                    transition
                    duration-200
                  "
                >
                  লগআউট
                </button>

              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  href="/login"
                  className="
                    text-sm
                    text-gray-700
                    hover:text-emerald-600
                    font-semibold
                    px-3
                    py-2
                    transition
                    duration-200
                  "
                >
                  লগইন
                </Link>


                {/* Signup */}
                <Link
                  href="/signup"
                  className="
                    bg-gradient-to-r
                    from-emerald-600
                    to-teal-600
                    hover:from-emerald-700
                    hover:to-teal-700
                    text-white
                    text-sm
                    font-semibold
                    px-4
                    py-2.5
                    rounded-xl
                    transition
                    duration-200
                    shadow-sm
                    hover:shadow-md
                  "
                >
                  সাইনআপ
                </Link>
              </>
            )}

          </div>


          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}
          <button
            type="button"
            aria-label={
              menuOpen
                ? 'মেনু বন্ধ করুন'
                : 'মেনু খুলুন'
            }
            className="
              md:hidden
              w-10
              h-10
              rounded-xl
              bg-gray-50
              hover:bg-emerald-50
              flex
              items-center
              justify-center
              text-gray-700
              hover:text-emerald-700
              transition
              duration-200
            "
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >

            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}

          </button>

        </div>


        {/* =======================================================
            MOBILE MENU
        ======================================================== */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">

            {/* Mobile Logo */}
            <div className="pb-4 mb-2 border-b border-gray-100">

              <Link
                href="/"
                onClick={closeMenu}
              >
                <SiteLogo mobile />
              </Link>

            </div>


            {/* Mobile Navigation */}
            <div className="space-y-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="
                  block
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  transition
                "
              >
                হোম
              </Link>

              <Link
                href="/biodatas"
                onClick={closeMenu}
                className="
                  block
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  transition
                "
              >
                বায়োডাটা খুঁজুন
              </Link>

              <Link
                href="/terms"
                onClick={closeMenu}
                className="
                  block
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  transition
                "
              >
                নির্দেশনা
              </Link>

              <Link
                href="/support"
                onClick={closeMenu}
                className="
                  block
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  transition
                "
              >
                যোগাযোগ
              </Link>

            </div>


            {/* Mobile User Section */}
            <div className="border-t border-gray-100 mt-3 pt-3">

              {user ? (
                <>

                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      font-medium
                      text-gray-700
                      hover:bg-gray-50
                    "
                  >

                    <UserCircle2 className="w-5 h-5 text-emerald-600" />

                    {profile?.custom_id ?? 'ইউজার'}

                    <span className="text-gray-400 ml-1">
                      (ড্যাশবোর্ড)
                    </span>

                  </Link>


                  <Link
                    href="/create-biodata"
                    onClick={closeMenu}
                    className="
                      block
                      bg-gradient-to-r
                      from-emerald-600
                      to-teal-600
                      text-white
                      text-sm
                      font-semibold
                      text-center
                      py-2.5
                      rounded-xl
                      mt-2
                    "
                  >
                    বায়োডাটা জমা দিন
                  </Link>


                  <button
                    onClick={handleLogout}
                    className="
                      block
                      w-full
                      text-left
                      text-red-600
                      text-sm
                      font-medium
                      px-3
                      py-2.5
                      mt-1
                      rounded-lg
                      hover:bg-red-50
                    "
                  >
                    লগআউট
                  </button>

                </>
              ) : (
                <>

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="
                      block
                      text-gray-700
                      text-sm
                      font-medium
                      px-3
                      py-2.5
                      rounded-lg
                      hover:bg-gray-50
                    "
                  >
                    লগইন
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="
                      block
                      bg-gradient-to-r
                      from-emerald-600
                      to-teal-600
                      text-white
                      text-sm
                      font-semibold
                      text-center
                      py-2.5
                      rounded-xl
                      mt-2
                    "
                  >
                    সাইনআপ
                  </Link>

                </>
              )}

            </div>

          </div>
        )}

      </div>

    </nav>
  );
}
