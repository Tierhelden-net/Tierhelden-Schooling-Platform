import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ quiz_id: string }> }
) {
  const params = await props.params
  try {
    const { userId } = await auth();
    const quiz_id = params.quiz_id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quizAttempt = await db.quizAttempt.create({
      data: {
        user_id: userId,
        quiz_id,
        total_score: 0,
        passed: false,
      },
    });

    return NextResponse.json(quizAttempt);
  } catch (error) {
    console.log("[QUIZATTEMPT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
