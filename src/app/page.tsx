import { Header } from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">
            Welcome to MatchUp
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Create and share photo quizzes with your friends!
          </p>
          <Link
            href="/create-quiz"
            className="bg-raspberry hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Create a Quiz
          </Link>
        </div>
      </main>
      <footer className="bg-indigo-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; 2023 MatchUp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
