import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

async function getUserQuizResults(userId: string) {
  const results = await prisma.quizResult.findMany({
    where: { userId },
    include: {
      quiz: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return results.map((result) => ({
    ...result,
    answers: JSON.parse(result.answers) // Parse the JSON string back into an object
  }));
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="text-center p-4">
        Please sign in to view your profile.
      </div>
    );
  }

  const quizResults = await getUserQuizResults(session.user.id);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || ""}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{session.user.name}</CardTitle>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-xl font-bold mb-4">Your Quiz History</h2>
      {quizResults.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t taken any quizzes yet.
        </p>
      ) : (
        <div className="space-y-4">
          {quizResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>{result.quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Taken on: {new Date(result.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/quizzes/${
                    result.quizId
                  }/results?answers=${encodeURIComponent(
                    JSON.stringify(result.answers)
                  )}`}
                  className="text-primary hover:underline"
                >
                  View Results
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
