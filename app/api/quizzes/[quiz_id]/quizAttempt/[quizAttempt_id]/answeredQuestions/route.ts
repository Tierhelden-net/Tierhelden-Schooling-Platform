import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quiz_id = searchParams.get("quiz_id");
    const quizAttempt_id = searchParams.get("quizAttempt_id");

    if (!quiz_id || !quizAttempt_id) {
      return NextResponse.json(
        { error: "quiz id and quiz attempt id is required in the URL" },
        { status: 400 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const answeredQuestions = await db.userAnswer.findMany({
      where: {
        quiz_attempt_id: quizAttempt_id,
        quiz_id: quiz_id,
        user_id: userId,
      },
      select: {
        question_id: true,
      },
    });

    return NextResponse.json(answeredQuestions);
  } catch (error) {
    console.error("Error fetching answered questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
