import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const id = (await params).id;
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { answers } = await req.json();
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizId: id,
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
