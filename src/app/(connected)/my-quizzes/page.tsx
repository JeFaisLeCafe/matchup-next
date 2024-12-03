import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getMyQuizzes(userId: string) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        authorId: userId
      },
      include: {
        questions: {
          include: {
            answers: {
              take: 1
            }
          },
          take: 1
        }
      }
    });
    return quizzes;
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
}

export default async function MyQuizzesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const quizzes = await getMyQuizzes(session.user.id);

  if (quizzes.length === 0) {
    return (
      <div className="container p-4 mx-auto text-center">
        <h1 className="mb-6 text-3xl font-bold text-primary">My Quizzes</h1>
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
      <h1 className="mb-6 text-3xl font-bold text-primary">My Quizzes</h1>
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
