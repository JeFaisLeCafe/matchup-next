/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";

type Answer = {
  id: string;
  imageUrl: string;
};

type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

type Result = {
  questionId: string;
  selectedAnswerId: string;
};

export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizAndResults = async () => {
      try {
        // Fetch quiz data
        const quizResponse = await fetch(`/api/quizzes/${params.id}`);
        if (!quizResponse.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const quizData: Quiz = await quizResponse.json();
        setQuiz(quizData);

        // Get user's answers from URL params
        const userAnswers = JSON.parse(searchParams.get("answers") || "{}");

        // Prepare results
        const preparedResults = quizData.questions.map((question) => ({
          questionId: question.id,
          selectedAnswerId: userAnswers[question.id] || null
        }));

        setResults(preparedResults);
      } catch (err) {
        setError("Failed to load quiz results. Please try again." + err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAndResults();
  }, [params.id, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading results...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  return (
    <div className="container max-w-md p-4 mx-auto">
      <Link
        href={`/quizzes/${quiz.id}`}
        className="inline-flex items-center mb-6 text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quiz
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-primary">
        {quiz.title} - Your Choices
      </h1>
      {results.map((result, index) => {
        const question = quiz.questions[index];
        const selectedAnswer = question.answers.find(
          (a) => a.id === result.selectedAnswerId
        );
        return (
          <Card key={result.questionId} className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                Question {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{question.text}</p>
              <div>
                <p className="mb-1 font-semibold">Your Choice:</p>
                {selectedAnswer ? (
                  <img
                    src={selectedAnswer.imageUrl}
                    alt="Your selected answer"
                    className="object-cover w-full h-48 border-2 rounded-lg border-primary"
                  />
                ) : (
                  <p className="text-muted-foreground">No answer selected</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <div className="mt-6 space-y-4 flex flex-col ">
        <ShareButton
          title={`My results for ${quiz.title}`}
          text={`Check out my choices for ${quiz.title}!`}
          url={window.location.href}
        />
        <Link href={`/quizzes/${quiz.id}/play`} passHref>
          <Button className="w-full bg-primary text-secondary hover:bg-primary/90">
            Play Again
          </Button>
        </Link>
        <Link href="/quizzes" passHref>
          <Button className="w-full" variant="link">
            Back to Quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
}
