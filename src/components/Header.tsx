"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="shadow-md bg-inherit">
      <div className="container flex items-center justify-between px-4 py-6 mx-auto">
        <Link href="/" className="text-3xl font-bold text-primary">
          MATCHUP
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
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
                    className="px-4 py-2 text-white rounded bg-primary hover:bg-primary/90"
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
