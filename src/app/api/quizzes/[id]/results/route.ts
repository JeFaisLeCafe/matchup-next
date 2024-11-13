import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { answers } = await req.json();
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizId: params.id,
        answers: JSON.stringify(answers) // Convert JSON to string for SQLite storage
      }
    });

    return NextResponse.json(quizResult);
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    return NextResponse.json(
      { error: "Failed to save quiz result" },
      { status: 500 }
    );
  }
}
