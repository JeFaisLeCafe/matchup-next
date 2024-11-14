"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Answer {
  imageFile: File | null;
  imagePreview: string;
}

interface Question {
  text: string;
  answers: Answer[];
}

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", answers: [{ imageFile: null, imagePreview: "" }] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", answers: [{ imageFile: null, imagePreview: "" }] }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({
      imageFile: null,
      imagePreview: ""
    });
    setQuestions(newQuestions);
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(newQuestions);
  };

  const handleImageChange = (
    questionIndex: number,
    answerIndex: number,
    file: File | null
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newQuestions[questionIndex].answers[answerIndex].imagePreview =
          reader.result as string;
        setQuestions([...newQuestions]);
      };
      reader.readAsDataURL(file);
    } else {
      newQuestions[questionIndex].answers[answerIndex].imagePreview = "";
      setQuestions([...newQuestions]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a quiz");
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create quiz");
      }

      const quiz = await response.json();
      toast.success("Quiz created successfully!");
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create quiz. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/quizzes" className="flex items-center text-primary mb-4">
        <ArrowLeft className="mr-2" /> Back to Quizzes
      </Link>
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="quizTitle">Quiz Title</Label>
            <Input
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
              className="mb-4"
            />
          </CardContent>
        </Card>

        {questions.map((question, qIndex) => (
          <Card key={qIndex} className="mb-6">
            <CardHeader>
              <CardTitle>Question {qIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
              <Input
                id={`question-${qIndex}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
                className="mb-4"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="relative">
                    <Label htmlFor={`question-${qIndex}-answer-${aIndex}`}>
                      Answer Image
                    </Label>
                    <Input
                      id={`question-${qIndex}-answer-${aIndex}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          qIndex,
                          aIndex,
                          e.target.files?.[0] || null
                        )
                      }
                      className="mb-2"
                    />
                    {answer.imagePreview && (
                      <img
                        src={answer.imagePreview}
                        alt={`Answer ${aIndex + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => handleAddAnswer(qIndex)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Answer
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center mb-6">
          <Button type="button" onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
          {questions.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveQuestion(questions.length - 1)}
            >
              <X className="mr-2 h-4 w-4" /> Remove Last Question
            </Button>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
        </Button>
      </form>
    </div>
  );
}
