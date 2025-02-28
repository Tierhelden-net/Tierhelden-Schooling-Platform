import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { quiz_id: string; quizAttempt_id: string } }
) {
  try {
    const { userId } = auth();
    const quiz_id = parseInt(params.quiz_id);
    const quizAttempt_id = parseInt(params.quizAttempt_id);

    if (!userId || !quiz_id || !quizAttempt_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { ...values } = await req.json();
    const answers = values.answers;

    //for each answer one entry:
    for (let answer of answers) {
      await db.userAnswer.create({
        data: {
          user_id: userId,
          quiz_id,
          quiz_attempt_id: quizAttempt_id,
          question_id: parseInt(values.question_id),
          answer_id: parseInt(answer),
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[QUIZATTEMPT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
