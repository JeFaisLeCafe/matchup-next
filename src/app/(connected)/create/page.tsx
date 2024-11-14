/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AwaitedReactNode,
  ClassAttributes,
  HTMLAttributes,
  JSX,
  JSXElementConstructor,
  LegacyRef,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X, GripVertical } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Answer {
  id: string;
  imageFile: File | null;
  imagePreview: string;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      answers: [
        { id: "1-1", imageFile: null, imagePreview: "" },
        { id: "1-2", imageFile: null, imagePreview: "" }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleAddQuestion = () => {
    const newQuestionId = String(Date.now());
    setQuestions([
      ...questions,
      {
        id: newQuestionId,
        text: "",
        answers: [
          { id: `${newQuestionId}-1`, imageFile: null, imagePreview: "" },
          { id: `${newQuestionId}-2`, imageFile: null, imagePreview: "" }
        ]
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex: number) => {
    if (questions[questionIndex].answers.length < 6) {
      const newQuestions = [...questions];
      const newAnswerId = `${questions[questionIndex].id}-${Date.now()}`;
      newQuestions[questionIndex].answers.push({
        id: newAnswerId,
        imageFile: null,
        imagePreview: ""
      });
      setQuestions(newQuestions);
    }
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    const currentAnswers = newQuestions[questionIndex].answers;
    if (
      currentAnswers.length > 2 &&
      (currentAnswers[answerIndex].imageFile || currentAnswers.length > 2)
    ) {
      currentAnswers.splice(answerIndex, 1);
      setQuestions(newQuestions);
    }
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newQuestions = Array.from(questions);
    const [reorderedItem] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, reorderedItem);

    setQuestions(newQuestions);
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
    <div className="flex flex-col ">
      <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <Link href="/quizzes" className="text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Create your quiz</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-6">
            <Label
              htmlFor="quizTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              QUIZZ NAME
            </Label>
            <Input
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided: {
                droppableProps: JSX.IntrinsicAttributes &
                  ClassAttributes<HTMLDivElement> &
                  HTMLAttributes<HTMLDivElement>;
                innerRef: LegacyRef<HTMLDivElement> | undefined;
                placeholder:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<AwaitedReactNode>
                  | null
                  | undefined;
              }) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((question, qIndex) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={qIndex}
                    >
                      {(provided: {
                        innerRef: LegacyRef<HTMLDivElement> | undefined;
                        draggableProps: JSX.IntrinsicAttributes &
                          ClassAttributes<HTMLDivElement> &
                          HTMLAttributes<HTMLDivElement>;
                        dragHandleProps: JSX.IntrinsicAttributes &
                          ClassAttributes<HTMLDivElement> &
                          HTMLAttributes<HTMLDivElement>;
                      }) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-8 bg-white p-4 rounded-lg shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Label
                              htmlFor={`question-${qIndex}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              QUESTION {qIndex + 1}
                            </Label>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIndex)}
                                className="text-red-500 mr-2"
                                disabled={questions.length === 1}
                              >
                                <X className="w-5 h-5" />
                              </button>
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <Input
                            id={`question-${qIndex}`}
                            value={question.text}
                            onChange={(e) =>
                              handleQuestionChange(qIndex, e.target.value)
                            }
                            required
                            className="w-full border-gray-300 mb-4"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            {question.answers.map((answer, aIndex) => (
                              <div key={answer.id} className="relative">
                                <input
                                  type="file"
                                  id={`question-${qIndex}-answer-${aIndex}`}
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageChange(
                                      qIndex,
                                      aIndex,
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={`question-${qIndex}-answer-${aIndex}`}
                                  className="block w-full h-32 bg-gray-200 rounded-md cursor-pointer overflow-hidden"
                                >
                                  {answer.imagePreview ? (
                                    <Image
                                      src={answer.imagePreview}
                                      alt={`Answer ${aIndex + 1}`}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Plus className="w-8 h-8 text-gray-400" />
                                    </div>
                                  )}
                                </label>
                                {(answer.imageFile ||
                                  question.answers.length > 2) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveAnswer(qIndex, aIndex)
                                    }
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {question.answers.length < 6 && (
                            <Button
                              type="button"
                              onClick={() => handleAddAnswer(qIndex)}
                              className="mt-4 w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                              Add Answer
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            type="button"
            onClick={handleAddQuestion}
            className="w-full mb-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            ADD A QUESTION
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSubmitting ? "Creating..." : "CREATE"}
          </Button>
        </form>
      </main>
    </div>
  );
}
