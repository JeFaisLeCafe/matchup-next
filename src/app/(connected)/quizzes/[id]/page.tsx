/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Answer = {
  id: string;
  text: string;
  imageUrl: string | null;
};

type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

type Quiz = {
  id: string;
  title: string;
  author: {
    name: string;
  };
  questions: Question[];
};

export default function QuizPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetch(`/api/quizzes/${params.id}`)
        .then((response) => response.json())
        .then((data) => setQuiz(data))
        .catch((error) => console.error("Error fetching quiz:", error));
    }
  }, [status, params.id]);

  if (status === "loading" || !quiz) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center p-4">Please sign in to view this quiz.</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-primary">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-2">
            Created by: {quiz.author.name}
          </p>
          <p className="text-sm mb-4">{quiz.questions.length} questions</p>
        </CardContent>
      </Card>

      {quiz.questions.map((question, index) => (
        <Card key={question.id} className="mb-6">
          <CardHeader>
            <CardTitle className="text-primary">Question {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{question.text}</p>
            <div className="grid grid-cols-2 gap-4">
              {question.answers.map((answer) => (
                <div key={answer.id} className="border rounded p-2">
                  {answer.imageUrl && (
                    <img
                      src={answer.imageUrl}
                      alt={answer.text}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                  )}
                  <p>{answer.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="mt-8 text-center">
        <Button className="bg-secondary text-primary hover:bg-secondary/80 mr-4">
          Share Quiz
        </Button>
        <Button>Take Quiz</Button>
      </div>
    </div>
  );
}
