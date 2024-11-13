/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        },
        questions: {
          select: {
            id: true,
            text: true
          }
        }
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const authorId = formData.get("authorId") as string;

    const questionsData = [];
    let questionIndex = 0;

    while (formData.has(`questions[${questionIndex}][text]`)) {
      const questionText = formData.get(
        `questions[${questionIndex}][text]`
      ) as string;
      const answers = [];
      let answerIndex = 0;

      while (
        formData.has(
          `questions[${questionIndex}][answers][${answerIndex}][text]`
        )
      ) {
        const answerText = formData.get(
          `questions[${questionIndex}][answers][${answerIndex}][text]`
        ) as string;
        const answerImage = formData.get(
          `questions[${questionIndex}][answers][${answerIndex}][image]`
        ) as File | null;

        let imageUrl = null;
        if (answerImage) {
          const arrayBuffer = await answerImage.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream((error, result) => {
                if (error) reject(error);
                else resolve(result);
              })
              .end(buffer);
          });
          imageUrl = (result as any).secure_url;
        }

        answers.push({ text: answerText, imageUrl });
        answerIndex++;
      }

      questionsData.push({ text: questionText, answers });
      questionIndex++;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        author: { connect: { id: authorId } },
        questions: {
          create: questionsData.map((q, index) => ({
            text: q.text,
            order: index,
            answers: {
              create: q.answers.map((a, aIndex) => ({
                text: a.text,
                imageUrl: a.imageUrl,
                order: aIndex
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Failed to create quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
