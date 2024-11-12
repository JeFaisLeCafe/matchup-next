"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Answer = {
  text: string;
  imageFile: File | null;
  imagePreview: string | null;
};

type Question = {
  text: string;
  answers: Answer[];
};

export default function CreateQuiz() {
  const { data: session } = useSession();
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      answers: [
        { text: "", imageFile: null, imagePreview: null },
        { text: "", imageFile: null, imagePreview: null }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        answers: [
          { text: "", imageFile: null, imagePreview: null },
          { text: "", imageFile: null, imagePreview: null }
        ]
      }
    ]);
  };

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({
      text: "",
      imageFile: null,
      imagePreview: null
    });
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (questionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleImageUpload = (
    questionIndex: number,
    answerIndex: number,
    file: File
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].imageFile = file;
    newQuestions[questionIndex].answers[answerIndex].imagePreview =
      URL.createObjectURL(file);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("You must be logged in to create a quiz");
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", quizTitle);
      formData.append("authorId", session.user.id);

      questions.forEach((question, qIndex) => {
        formData.append(`questions[${qIndex}][text]`, question.text);
        question.answers.forEach((answer, aIndex) => {
          formData.append(
            `questions[${qIndex}][answers][${aIndex}][text]`,
            answer.text
          );
          if (answer.imageFile) {
            formData.append(
              `questions[${qIndex}][answers][${aIndex}][image]`,
              answer.imageFile
            );
          }
        });
      });

      const response = await fetch("/api/quizzes", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const quiz = await response.json();
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center p-4">Please sign in to create a quiz.</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-primary">Create a New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="quizTitle" className="text-primary">
                Quiz Title
              </Label>
              <Input
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="mb-6 p-4 border-secondary">
                <CardContent>
                  <Label
                    htmlFor={`question-${questionIndex}`}
                    className="text-primary"
                  >
                    Question {questionIndex + 1}
                  </Label>
                  <Input
                    id={`question-${questionIndex}`}
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, e.target.value)
                    }
                    required
                    className="mt-1"
                  />
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="mt-2">
                      <Label
                        htmlFor={`question-${questionIndex}-answer-${answerIndex}`}
                        className="text-primary"
                      >
                        Answer {answerIndex + 1}
                      </Label>
                      <Input
                        id={`question-${questionIndex}-answer-${answerIndex}`}
                        value={answer.text}
                        onChange={(e) =>
                          handleAnswerChange(
                            questionIndex,
                            answerIndex,
                            e.target.value
                          )
                        }
                        required
                        className="mt-1"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(
                            questionIndex,
                            answerIndex,
                            e.target.files![0]
                          )
                        }
                        className="mt-1"
                      />
                      {answer.imagePreview && (
                        <img
                          src={answer.imagePreview}
                          alt="Answer preview"
                          className="mt-2 max-w-xs rounded-md"
                        />
                      )}
                    </div>
                  ))}
                  {question.answers.length < 6 && (
                    <Button
                      type="button"
                      onClick={() => addAnswer(questionIndex)}
                      className="mt-2 bg-secondary text-primary hover:bg-secondary/80"
                    >
                      Add Answer
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              onClick={addQuestion}
              className="mb-4 bg-secondary text-primary hover:bg-secondary/80"
            >
              Add Question
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
