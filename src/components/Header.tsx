"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const theme = useTheme();
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold"
          style={{ color: theme.colors.indigo }}
        >
          MATCHUP
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                href="/create-quiz"
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
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => signIn("google")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
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
