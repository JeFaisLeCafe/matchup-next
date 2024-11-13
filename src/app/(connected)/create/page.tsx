/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";

type Question = {
  text: string;
  images: File[];
};

export default function CreateQuizPage() {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", images: [] }
  ]);
  const router = useRouter();

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", images: [] }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleImageUpload = (questionIndex: number, files: FileList) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].images = [
      ...newQuestions[questionIndex].images,
      ...Array.from(files)
    ];
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the quiz creation logic
    console.log("Quiz submitted", { quizName, questions });
    // For now, let's just redirect to the quizzes page
    router.push("/quizzes");
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Link
        href="/quizzes"
        className="mb-6 inline-flex items-center text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-primary">Create your quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="quizName" className="text-primary">
            QUIZ NAME
          </Label>
          <Input
            id="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`question-${index}`} className="text-primary">
              QUESTION
            </Label>
            <Input
              id={`question-${index}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
              className="mt-1"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[...Array(4)].map((_, imageIndex) => (
                <div
                  key={imageIndex}
                  className="aspect-square bg-gray-100 flex items-center justify-center rounded-md overflow-hidden"
                >
                  {question.images[imageIndex] ? (
                    <img
                      src={URL.createObjectURL(question.images[imageIndex])}
                      alt={`Question ${index + 1} Image ${imageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <label
                      htmlFor={`image-${index}-${imageIndex}`}
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="h-6 w-6 text-gray-400" />
                      <input
                        id={`image-${index}-${imageIndex}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          handleImageUpload(index, e.target.files)
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddQuestion}
          className="w-full bg-secondary text-primary hover:bg-secondary/90"
        >
          ADD A QUESTION
        </Button>
        <Button
          type="submit"
          className="w-full bg-accent text-white hover:bg-accent/90"
        >
          CREATE
        </Button>
      </form>
    </div>
  );
}
