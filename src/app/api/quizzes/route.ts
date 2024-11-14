import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/error-handler";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const authorId = formData.get("authorId") as string;

    if (!title || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
          `questions[${questionIndex}][answers][${answerIndex}][image]`
        )
      ) {
        const answerImage = formData.get(
          `questions[${questionIndex}][answers][${answerIndex}][image]`
        ) as File;

        let imageUrl = "";
        if (answerImage) {
          const arrayBuffer = await answerImage.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Upload to Cloudinary
          const result = (await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "matchup_answers" }, (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else reject(new Error("Upload failed"));
              })
              .end(buffer);
          })) as { secure_url: string };

          imageUrl = result.secure_url;
        }

        answers.push({ imageUrl });
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
    return handleApiError(error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get("authorId");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    let whereClause = {};
    if (authorId) {
      whereClause = { authorId };
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        questions: {
          include: {
            answers: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    return handleApiError(error);
  }
}
