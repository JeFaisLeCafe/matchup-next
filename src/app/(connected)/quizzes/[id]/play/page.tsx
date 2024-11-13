/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Quiz } from "../../../../../../types/db";

export default function PlayQuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        setError("Failed to load quiz. Please try again." + err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Save quiz results
      try {
        const response = await fetch(`/api/quizzes/${quiz.id}/results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ answers: selectedAnswers })
        });

        if (!response.ok) {
          throw new Error("Failed to save quiz results");
        }

        // Navigate to results page
        const answersParam = encodeURIComponent(
          JSON.stringify(selectedAnswers)
        );
        router.push(`/quizzes/${quiz.id}/results?answers=${answersParam}`);
      } catch (error) {
        console.error("Error saving quiz results:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="container max-w-md p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold text-primary">{quiz.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQuestion.text}</p>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedAnswers[currentQuestion.id] === answer.id
                    ? "border-primary"
                    : "border-transparent"
                }`}
                aria-label={`Select answer ${answer.id}`}
              >
                <img
                  src={answer.imageUrl}
                  alt={`Answer option ${answer.id}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          className="flex items-center"
        >
          {currentQuestionIndex === quiz.questions.length - 1
            ? "Finish"
            : "Next"}{" "}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
