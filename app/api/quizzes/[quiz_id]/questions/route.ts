// POST: Frage erstellen 
// GET: Alle Fragen für ein Quiz abrufen 

// app/api/quizzes/[quiz_id]/questions/route.ts

// TODO: is_knockout sollte false als default haben (im prisma)
// TODO: defaults für Messages einstellen (im prisma)
// TODO: Wie wird die Quiz ID in der URL übergeben? String, Int?

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// POST: Frage erstellen
export async function POST(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth(); // Get the userId from the auth() function (Clerk)
    const { quiz_id } = params; // Get the quiz_id from the URL
    const { question_text, question_type, answer_selection_type, correct_answers, points, is_knockout } = await req.json(); 
    // Get the question data from the request body

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id) {
      return new NextResponse("Missing Quiz ID", { status: 400 });
    }

    const question = await db.question.create({ // Create a new question
      data: {
        quiz_id: parseInt(quiz_id),
        question_text,
        question_type,
        answer_selection_type,
        correct_answers,
        points,
        is_knockout,
      },
    });

    return NextResponse.json(question);
  } catch (error) { // Catch any errors
    console.log("[QUIZ_QUESTION_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET: Alle Fragen
export async function GET(req: Request, { params }: { params: { quiz_id: string } }) {
  try {
    const { userId } = auth();
    const { quiz_id } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!quiz_id) {
      return new NextResponse("Missing Quiz ID", { status: 400 });
    }

    const questions = await db.question.findMany({ // Find all questions for a quiz
      where: { // Filter by quiz_id
        // TODO: parseInt hier notwendig/richtig?
        quiz_id: parseInt(quiz_id),
      },
      include: { // Include the answers
        answers: true,
      },
    });

    return NextResponse.json(questions);
  } catch (error) { // Catch any errors
    console.log("[QUIZZES_QUESTIONS_GET_ALL]", error); // Log the error
    return new NextResponse("Internal Error", { status: 500 });
  }
}
