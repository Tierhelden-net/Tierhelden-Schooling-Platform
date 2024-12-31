// POST: Antwort erstellen - TODO
// GET: Alle Antworten für eine Frage abrufen - TODO

// app/api/questions/[questionId]/answers/route.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// POST: Antwort erstellen
export async function POST(req: Request, { params }: { params: { question_id: string } }) {
  try {
    const { userId } = auth();
    const { question_id } = params;
    const { answer_text, is_correct, position } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question_id) {
      return new NextResponse("Missing questionId", { status: 400 });
    }

    const answer = await db.answer.create({ // Create a new answer
      data: {
        question_id: parseInt(question_id),
        answer_text,
        is_correct,
        position,
      },
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.log("[QUIZZES_ANSWERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET: Alle Antworten für eine Frage abrufen
export async function GET(req: Request, { params }: { params: { question_id: string } }) {
  try {
    const { userId } = auth();
    const { question_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!question_id) { // Check if the question_id is missing
      return new NextResponse("Missing Question ID", { status: 400 });
    }

    const answers = await db.answer.findMany({ // Find all answers for a question
      where: {
        question_id: parseInt(question_id), // Filter by question_id
      },
    });

    return NextResponse.json(answers);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_ANSWERS_GET_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
