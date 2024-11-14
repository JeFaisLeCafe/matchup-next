"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="shadow-md bg-primary-foreground fixed top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link href="/" className="text-3xl font-bold text-primary">
          MATCHUP
        </Link>

        {/* Burger Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-20 left-0 right-0 bg-white md:relative md:top-0 md:block`}
        >
          <ul className="flex flex-col items-center space-y-4 p-4 md:p-0 md:flex-row md:space-y-0 md:space-x-4">
            <li>
              <Link
                href="/create"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Create Quiz
              </Link>
            </li>
            <li>
              <Link
                href="/my-quizzes"
                className="text-indigo-600 hover:text-indigo-800"
              >
                My Quizzes
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="text-destructive hover:text-destructive-dark"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => signIn("google")}
                  className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
