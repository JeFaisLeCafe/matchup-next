/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getQuizzes(userId: string) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        authorId: userId
      },
      include: {
        questions: {
          include: {
            answers: {
              take: 1 // We only need one image for the quiz card
            }
          },
          take: 1 // We only need one question to get an image
        }
      }
    });
    return quizzes;
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
}

export default async function QuizzesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null; // The middleware will handle the redirect
  }

  let quizzes;
  try {
    quizzes = await getQuizzes(session.user.id);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return (
      <div className="container p-4 mx-auto text-center">
        <p className="text-red-500">
          Failed to load quizzes. Please try again later.
        </p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="container p-4 mx-auto text-center">
        <h1 className="mb-6 text-3xl font-bold text-primary">Quizzes</h1>
        <p className="mb-4">You haven&apos;t created any quizzes yet.</p>
        <Link href="/create" passHref>
          <Button className="bg-secondary text-primary hover:bg-secondary/90">
            Create a Quiz
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-primary">Quizzes</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="transition-shadow duration-200 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-primary">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {quiz.questions[0]?.answers[0]?.imageUrl ? (
                <img
                  src={quiz.questions[0].answers[0].imageUrl}
                  alt={quiz.title}
                  className="object-cover w-full h-40 mb-4 rounded"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-40 mb-4 bg-gray-200 rounded">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              <Link href={`/quizzes/${quiz.id}/play`} passHref>
                <Button className="w-full">PLAY</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
